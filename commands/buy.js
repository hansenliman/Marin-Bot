const Discord = require('discord.js');
const Sequelize = require('sequelize');
const { Op } = require('sequelize');
const seasons = require('../seasons');
const { season_counter } = require('../seasons');
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

// Create associations:
UserSeeds.belongsTo(Seeds, { foreignKey: 'seed_id', as: 'seed' });

module.exports = {
	name: 'buy',
	description: '',
	async execute(message, args) {
        args = args.trim().split(/ +/);
        
        amount = 0

        const check_user = await Users.findOne({
            where: { user_id: message.author.id },
        });

        if (!check_user) {
            Users.create({ user_id: message.author.id, balance: 0})
            Fields.create({ user_id: message.author.id, field_number: 1, plant: '', age: 0, harvest_age: 0, sell_value: 0, generatedItem_id: 0, is_empty: true, level: 0 })
        }

        if ( args.length === 1 && args[0] === '' ) {
            return message.channel.send(`The proper usage for buying is:\n${PREFIX}buy [Seed] [Amount] or just ${PREFIX}buy [Seed]`);
        } else if (args.length === 1) {
            amount = 1 
        } else if ( args.length === 2 ) {
            amount = Number(args[1])
            if (!Number.isInteger(amount)) {
                return message.channel.send(`You did not enter a valid amount.`);
            }
        } else {
            return message.channel.send(`I don't understand, try this...\n${PREFIX}buy [Seed] [Amount] or just ${PREFIX}buy [Seed]`);
        }

        if (amount <= 0) {
            return message.channel.send(`Enter an amount number that is higher that 0.`);

        }

        const seed = await Seeds.findOne({ where: { name: { [Op.like]: args[0] } } });
        if (!seed) return message.channel.send(`That item doesn't exist.`);

        const user = await Users.findOne({ where: { user_id: message.author.id } });

        if (user.balance - seed.cost * amount < 0) {
            return message.channel.send(`Sorry, you don't have enough zeny.`);
        }
        
        const userSeed = await UserSeeds.findOne({
            where: { user_id: message.author.id, seed_id: seed.id },
        });

        if (seed.season != seasons.seasons[seasons.get_season_counter()]) {
            return message.channel.send(`That seed is currently unavailable.`)
        }

        message.channel.send(`You've bought: ${amount} ${seed.name} seed(s)!`);

        if (user) {
            user.balance -= seed.cost * amount
            user.save()
        }

        if (userSeed) {
            userSeed.amount += amount;
            return userSeed.save()
        }

        return UserSeeds.create({ user_id: message.author.id, seed_id: seed.id, amount: amount, level: 1 })
	},
};