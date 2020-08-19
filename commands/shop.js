const Discord = require('discord.js');
const Sequelize = require('sequelize');
const { Op } = require('sequelize');
const seasons = require('../seasons');
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
  
// setInterval(change_season, 1500);

// Import models:
const Users = require('../models/Users')(sequelize, Sequelize);
const Seeds = require('../models/Seeds')(sequelize, Sequelize);
const UserSeeds = require('../models/UserSeeds')(sequelize, Sequelize);
const Fields = require('../models/Fields')(sequelize, Sequelize);

// Create associations:
UserSeeds.belongsTo(Seeds, { foreignKey: 'seed_id', as: 'seed' });

module.exports = {
	name: 'shop',
	description: '',
	async execute(message, args) {

		// seasons.change_season()

		const seeds = await Seeds.findAll({ 
            where: { season: seasons.seasons[seasons.get_season_counter()] },
		});
        return message.channel.send(`Welcome to the ${seasons.seasons[seasons.get_season_counter()]} shop!\nPrice List: \n${seeds.map(i => `${i.name}: ${i.cost} zeny`).join('\n')}`);
	},
};

