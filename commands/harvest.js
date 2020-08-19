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
	name: 'harvest',
	description: '',
	async execute(message, args) {
        args = args.trim().split(/ +/);
        
        let field_number = 0
        let field = 0

        const check_user = await Users.findOne({
            where: { user_id: message.author.id },
        });

        if (!check_user) {
            Users.create({ user_id: message.author.id, balance: 0})
            Fields.create({ user_id: message.author.id, field_number: 1, plant: '', age: 0, harvest_age: 0, sell_value: 0, generatedItem_id: 0, is_empty: true, level: 0 })
        }

        if ( args.length === 1 && args[0] === '' ) {
            field = await Fields.findOne({
                where: { user_id: message.author.id, is_empty: false },
            });
            if (field) {
            return message.channel.send(`Please also specify the field number in the command:\n${PREFIX}harvest [Field Number]`);
            } else {
                return message.channel.send(`All your field(s) are empty.`);
            }
        } else if ( args.length === 1 ) {
            field_number = Number(args[0])
            if (!Number.isInteger(field_number)) {
                return message.channel.send(`You did not enter a valid field number.`);
            }
            field = await Fields.findOne({
                where: { user_id: message.author.id, field_number: field_number },
            });
            if (!field) {
                return message.channel.send(`You don't have that field number.`);
            } else if (field.is_empty == true) {
                return message.channel.send(`There is nothing planted on that field!`);
            }
        } else {
            return message.channel.send(`I don't understand, try this...\n${PREFIX}harvest [Field Number]`);
        }
        
        const user = await Users.findOne({
            where: { user_id: message.author.id },
        });

        if (field.is_withered === true) {
            return message.channel.send(`Yikes! The plant on that field has withered!`);
        }
        
        if (field) {
            if (field.age >= field.harvest_age) {

                field.is_empty = true
                field.save()

                if (field.level == 1) {
                    message.channel.send(`You have harvested ${field.plant}!`);
                } else {
                    message.channel.send(`You have harvested Lv.${field.level} ${field.plant}!`);
                }

                seedsAchievement = 0

                seedsAchievement = await SeedsAchievements.findOne({
                    where: { user_id: message.author.id, name: field.plant }
                })

                if (!seedsAchievement) { // Create the achievement for that seed if he doesn't have the achievement.
                    SeedsAchievements.create({ user_id: message.author.id, name: field.plant })
                }

                seedsAchievement = await SeedsAchievements.findOne({
                    where: { user_id: message.author.id, name: field.plant }
                })

                seedsAchievement.total_harvested += 1
                seedsAchievement.save()

                const userItem = await UserItems.findOne({
                    where: { user_id: message.author.id, item_id: field.generatedItem_id, level: field.level },
                });
                if (userItem) {
                    userItem.amount += 1;
                    return userItem.save()
                }
                return UserItems.create({ user_id: message.author.id, item_id: field.generatedItem_id, amount: 1, level: field.level })
            }
        }
        return message.channel.send(`The plant is not ready to be harvested!`);
	},
};