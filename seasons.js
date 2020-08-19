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
const Users = require('./models/Users')(sequelize, Sequelize);
const Seeds = require('./models/Seeds')(sequelize, Sequelize);
const UserSeeds = require('./models/UserSeeds')(sequelize, Sequelize);
const Fields = require('./models/Fields')(sequelize, Sequelize);
const Items = require('./models/Items')(sequelize, Sequelize);
const UserItems = require('./models/UserItems')(sequelize, Sequelize);

// Create associations:
UserSeeds.belongsTo(Seeds, { foreignKey: 'seed_id', as: 'seed' });
UserItems.belongsTo(Items, { foreignKey: 'item_id', as: 'item' });

const seasons = ['spring', 'summer', 'autumn', 'winter']
let season_counter = 0
const season_time = 172800000 // 2 days
let season_timestamp = Date.now()

async function change_season() {
	// console.log("Changing seasons...")
	season_timestamp = Date.now()
	season_counter += 1
	if (season_counter == 4) { season_counter = 0 }
	//message.channel.send(`It is now ${seasons[season_counter]}!`);
	await Fields.update({ is_withered: true }, { where: { is_empty: false } });
}

function get_season_counter() {
	return season_counter
}

function get_season_timeleft() {
	const elapsed_time = Date.now() - season_timestamp
	const timeleft = season_time - elapsed_time
	return timeleft
}

module.exports = {
    change_season: change_season,
    seasons: seasons,
	get_season_counter: get_season_counter,
	get_season_timeleft: get_season_timeleft
}