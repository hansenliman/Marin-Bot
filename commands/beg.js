const Discord = require('discord.js');
const Sequelize = require('sequelize');
const { Op } = require('sequelize');
const Items = require('../models/Items');
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
const UserItems = require('../models/UserItems')(sequelize, Sequelize);

// Create associations:
UserSeeds.belongsTo(Seeds, { foreignKey: 'seed_id', as: 'seed' });

module.exports = {
	name: 'beg',
	description: '',
    cooldown: 36000, // In seconds 72000
	async execute(message, args) {
		const check_user = await Users.findOne({
            where: { user_id: message.author.id },
        });

        if (!check_user) {
            Users.create({ user_id: message.author.id, balance: 0})
            Fields.create({ user_id: message.author.id, field_number: 1, plant: '', age: 0, harvest_age: 0, sell_value: 0, generatedItem_id: 0, is_empty: true, level: 0 })
        }

        const user = await Users.findOne({
            where: { user_id: message.author.id },
        });

        const userItems = await UserItems.findOne({
            where: { user_id: message.author.id }
        })

        const userSeeds = await UserSeeds.findOne({
            where: { user_id: message.author.id }
        })

        const beg_money = 5

        const field = await Fields.findOne({
            where: { user_id: message.author.id, is_empty: false }
        })

        if (user.balance <= 3 && !field && !userItems && !userSeeds) {
            if (user) {
                user.balance += beg_money;
                user.save()
            }
    
            return message.channel.send(`You just gained ${beg_money} zeny!`)
        }
        return message.channel.send(`You begged for money...\nBut no one came...`)
        
	},
};