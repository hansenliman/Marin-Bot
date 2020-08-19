const Discord = require('discord.js');
const Sequelize = require('sequelize');
const { Op } = require('sequelize');
const seasons = require('../seasons');
const { time } = require('console');
const { date } = require('random-js');
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
    name: 'season',
    aliases: ['seasons'],
	description: '',
	async execute(message, args) {
        const timeLeft = (seasons.get_season_timeleft() / 1000) / 60 / 60;
        return message.channel.send(`${timeLeft.toFixed(1)} hours left until ${seasons.seasons[seasons.get_season_counter()]} ends.\nDon't let your crops wither on the vine!`);
	},
};

