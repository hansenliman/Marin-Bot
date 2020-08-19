const Discord = require('discord.js');
const Sequelize = require('sequelize');
const { Op } = require('sequelize');
const client = new Discord.Client();
const PREFIX = '!';

// Login to database:
const sequelize = new Sequelize('database', 'user', 'password', {
	host: 'localhost',
	dialect: 'sqlite',
	logging: false,
	// SQLite only
	storage: 'database.sqlite',
});

// Import models:
const Users = require('../models/Users')(sequelize, Sequelize);
const Seeds = require('../models/Seeds')(sequelize, Sequelize);
const UserSeeds = require('../models/UserSeeds')(sequelize, Sequelize);
const Fields = require('../models/Fields')(sequelize, Sequelize);
const Items = require('../models/Items')(sequelize, Sequelize);
const UserItems = require('../models/UserItems')(sequelize, Sequelize);
const SeedsAchievements = require('../models/SeedsAchievements')(sequelize, Sequelize);

// Create associations:
UserSeeds.belongsTo(Seeds, { foreignKey: 'seed_id', as: 'seed' });
UserItems.belongsTo(Items, { foreignKey: 'item_id', as: 'item' });

module.exports = {
	name: 'sell',
	description: '',
	async execute(message, args) {
        args = args.trim().split(/ +/);
        
        level = 0

        amount = 0

        item = 0

        const check_user = await Users.findOne({
            where: { user_id: message.author.id },
        });

        if (!check_user) {
            Users.create({ user_id: message.author.id, balance: 0})
            Fields.create({ user_id: message.author.id, field_number: 1, plant: '', age: 0, harvest_age: 0, sell_value: 0, generatedItem_id: 0, is_empty: true, level: 0 })
        }

        if ( args.length === 1 && args[0] === '' ) {
            return message.channel.send(`The proper usage for selling is:\n${PREFIX}plant [Item Name] or ${PREFIX}plant [Item Name] [Amount] or just ${PREFIX}plant [Level] [Item Name] or ${PREFIX}plant [Level] [Item Name] [Amount]`);
        } else if ( args.length === 1 ) { // [Item Name]
            amount = 1
            level = 1
            item = await Items.findOne({ 
                where: { name: { [Op.like]: args[0] } } 
            });
    
            if (!item) {
                return message.channel.send(`The item does not exist.`)
            }
        } else if ( args.length === 2 ) {
            const temp = Number(args[0])
            if (Number.isInteger(temp)) { // [Level] [Item Name]
                amount = 1
                level = args[0]
                item = await Items.findOne({ 
                    where: { name: { [Op.like]: args[1] } } 
                });
        
                if (!item) {
                    return message.channel.send(`The item does not exist.`)
                }
            } else { // [Item Name] [Amount]
                amount = Number(args[1])
                if (!Number.isInteger(amount)) {
                    return message.channel.send(`You did not enter a valid amount.`);
                }
                level = 1
                item = await Items.findOne({ 
                    where: { name: { [Op.like]: args[0] } } 
                });
        
                if (!item) {
                    return message.channel.send(`The item does not exist.`)
                }
            }
        } else if ( args.length === 3 ) { // [Level] [Item Name] [Amount]
            amount = Number(args[2])
            if (!Number.isInteger(amount)) {
                return message.channel.send(`You did not enter a valid amount.`);
            }
            level = args[0]
            item = await Items.findOne({ 
                where: { name: { [Op.like]: args[1] } } 
            });
    
            if (!item) {
                return message.channel.send(`The item does not exist.`)
            }
        } else {
            return message.channel.send(`I don't understand, try this...\n${PREFIX}plant [Item Name] or ${PREFIX}plant [Item Name] [Amount] or just ${PREFIX}plant [Level] [Item Name] or ${PREFIX}plant [Level] [Item Name] [Amount]`);
        }

        if (amount <= 0) {
            return message.channel.send(`Enter an amount number that is higher that 0.`);
        }

        const userItem = await UserItems.findOne({
            where: { user_id: message.author.id, item_id: item.id, level: level }
        })

        if (!userItem) {
            return message.channel.send(`You do not have the item.`)
        }

        const user = await Users.findOne({ where: { user_id: message.author.id } });

        actual_amount = 0

        if ( userItem.amount - amount < 0 ) {
            actual_amount = userItem.amount
        } else {
            actual_amount = amount
        }

        const total_profit = item.sell_value * (1 + (0.1 * (userItem.level - 1))) * actual_amount

        let seedsAchievement = await SeedsAchievements.findOne({
            where: { user_id: message.author.id, name: item.name }
        })

        if (!seedsAchievement) { // Create the achievement for that seed if he doesn't have the achievement.
            SeedsAchievements.create({ user_id: message.author.id, name: item.name })
        }

        seedsAchievement = await SeedsAchievements.findOne({
            where: { user_id: message.author.id, name: item.name }
        })

        seedsAchievement.balance_generated += total_profit
        seedsAchievement.save()

        user.balance += total_profit
        user.save()
        message.channel.send(`You cashed in ${total_profit} zeny!`)

        userItem.amount -= actual_amount
        
        if (userItem.amount === 0) {
            await userItem.destroy({
                where: { user_id: message.author.id, item_id: item.id, level: level }
            })
            return
        }
        return userItem.save()
	},
};