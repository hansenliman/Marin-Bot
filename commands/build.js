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

// Create associations:
UserSeeds.belongsTo(Seeds, { foreignKey: 'seed_id', as: 'seed' });

module.exports = {
	name: 'build',
	description: '',
	async execute(message, args) {
		const check_user = await Users.findOne({
            where: { user_id: message.author.id },
        });

        if (!check_user) {
            Users.create({ user_id: message.author.id, balance: 0})
            Fields.create({ user_id: message.author.id, field_number: 1, plant: '', age: 0, harvest_age: 0, sell_value: 0, generatedItem_id: 0, is_empty: true, level: 0 })
        }

        const user = await Users.findOne({ where: { user_id: message.author.id } });

        args = args.toLowerCase()

        if (args === '') {
            return message.channel.send(`To add a field use:\n${PREFIX}build field\nCost: ${user.next_field_cost} zeny`);
        } else if (args === 'field') {
            if (user.balance - user.next_field_cost < 0) {
                return message.channel.send(`Sorry, you don't have enough zeny.`);
            }
            user.number_of_fields += 1
            user.balance -= user.next_field_cost
            user.next_field_cost = Math.ceil(user.next_field_cost * 1.5)
            user.save()
    
            Fields.create({ user_id: message.author.id, field_number: user.number_of_fields, plant: '', age: 0, harvest_age: 0, sell_value: 0, generatedItem_id: 0, is_empty: true, level: 0 })
    
            return message.channel.send(`Congratulations! You have one more field!`);
        }
	},
};