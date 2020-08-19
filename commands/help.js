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

// Create associations:
UserSeeds.belongsTo(Seeds, { foreignKey: 'seed_id', as: 'seed' });

module.exports = {
	name: 'help',
	description: '',
	async execute(message, args) {
		message.channel.send(`Current command list:\n!help\n!balance\n!beg\n!build\n!buy\n!fields\n!harvest\n!help\n!inventory\n!plant\n!reap\n!remove\n!sell\n!shop\n!water`);
	

		
		// await Seeds.update({ cost: 15, harvest_age: 16, sell_value: 30 }, { where: { name: 'Pineapple' } });

		// await Seeds.destroy({
		// 	where: { name: 'Ivern' }
		// })
		
		// await Items.destroy({
		// 	where: { name: 'Ivern' }
		// })

		// Seeds.create({ id: 17, name: 'Strawberry', cost: 7, harvest_age: 4, sell_value: 10, generatedItem_id: 17, season: 'spring' })
		// Items.create({ id: 17, name: 'Strawberry', sell_value: 10 })
	},
};