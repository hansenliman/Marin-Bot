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
    name: 'water',
    aliases: ['w'],
    description: '',
    cooldown: 3600, // Default: 3600
	async execute(message, args) {
		const fields = await Fields.findAll({ 
            where: { user_id: message.author.id, is_empty: false },
        });

        let buffer = ''

        fields.forEach(field => {
            field.age += 1;
            if (field.age === field.harvest_age) {
                buffer += `Oh! Looks like your ${field.plant} on field ${field.field_number} has fully grown!\n`
            }
            field.save()
        });

        if (fields.length === 0) {
            return message.channel.send(`Nice! You've watered empty fields!`);
        }

        buffer += `Nice! You've watered your fields!`

        return message.channel.send(buffer);
	},
};