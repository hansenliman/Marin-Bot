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

// Create associations:
UserSeeds.belongsTo(Seeds, { foreignKey: 'seed_id', as: 'seed' });
UserItems.belongsTo(Items, { foreignKey: 'item_id', as: 'item' });

module.exports = {
	name: 'achievements',
	description: '',
	async execute(message, args) {
		const seeds = await UserSeeds.findAll({ 
            where: { user_id: message.author.id },
            include: ['seed'],
		});
		
		const items = await UserItems.findAll({ 
            where: { user_id: message.author.id },
            include: ['item'],
        });

        if (!seeds.length && !items.length) return message.channel.send(`You have nothing!`);
		message.channel.send(`You currently have:`);
		message.channel.send(`Seeds:\n${seeds.map(i => `${i.amount} Lv.${i.level} ${i.seed.name} Seed`).join(', \n')}`);
		message.channel.send(`Items:\n${items.map(i => `${i.amount} Lv.${i.level} ${i.item.name}`).join(', \n')}`);
		return
	},
};