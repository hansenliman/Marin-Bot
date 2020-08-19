const Sequelize = require('sequelize');

// Login to database:
const sequelize = new Sequelize('database', 'username', 'password', {
	host: 'localhost',
	dialect: 'sqlite',
	logging: false,
	storage: 'database.sqlite',
});

// Import models:
const Seeds = require('./models/Seeds')(sequelize, Sequelize);
require('./models/Users')(sequelize, Sequelize);
require('./models/UserSeeds')(sequelize, Sequelize);
require('./models/Fields')(sequelize, Sequelize);
const Items = require('./models/Items')(sequelize, Sequelize);
const UserItems = require('./models/UserItems')(sequelize, Sequelize);
const SeedsAchievements = require('./models/SeedsAchievements')(sequelize, Sequelize);

const force = process.argv.includes('--force') || process.argv.includes('-f');

// Initialize seeds database:
sequelize.sync({ force }).then(async () => {
	const shop = [
		Seeds.upsert({ id: 1, name: 'Turnip', cost: 1, harvest_age: 2, sell_value: 2, generatedItem_id: 1, season: 'spring' }),
		Seeds.upsert({ id: 2, name: 'Potato', cost: 3, harvest_age: 3, sell_value: 5, generatedItem_id: 2, season: 'spring' }),
		Seeds.upsert({ id: 3, name: 'Cucumber', cost: 5, harvest_age: 6, sell_value: 9, generatedItem_id: 3, season: 'spring' }),
		Seeds.upsert({ id: 4, name: 'Cabbage', cost: 10, harvest_age: 7, sell_value: 18, generatedItem_id: 4, season: 'spring' }),

		Seeds.upsert({ id: 5, name: 'Tomato', cost: 5, harvest_age: 4, sell_value: 8, generatedItem_id: 5, season: 'summer' }),
		Seeds.upsert({ id: 6, name: 'Corn', cost: 7, harvest_age: 6, sell_value: 12, generatedItem_id: 6, season: 'summer' }),
		Seeds.upsert({ id: 7, name: 'Onion', cost: 2, harvest_age: 3, sell_value: 4, generatedItem_id: 7, season: 'summer' }),
		Seeds.upsert({ id: 8, name: 'Pineapple', cost: 22, harvest_age: 12, sell_value: 30, generatedItem_id: 8, season: 'summer' }),

		Seeds.upsert({ id: 9, name: 'Eggplant', cost: 5, harvest_age: 5, sell_value: 8, generatedItem_id: 9, season: 'autumn' }),
		Seeds.upsert({ id: 10, name: 'Carrot', cost: 6, harvest_age: 4, sell_value: 8, generatedItem_id: 10, season: 'autumn' }),
		Seeds.upsert({ id: 11, name: 'Yam', cost: 2, harvest_age: 2, sell_value: 3, generatedItem_id: 11, season: 'autumn' }),
		Seeds.upsert({ id: 12, name: 'ChiliPepper', cost: 7, harvest_age: 7, sell_value: 12, generatedItem_id: 12, season: 'autumn' }),

		Seeds.upsert({ id: 13, name: 'Durian', cost: 10, harvest_age: 25, sell_value: 35, generatedItem_id: 13, season: 'winter' }),
		Seeds.upsert({ id: 14, name: 'CorinaFlower', cost: 20, harvest_age: 16, sell_value: 36, generatedItem_id: 14, season: 'winter' }),
		Seeds.upsert({ id: 15, name: 'IronLeaf', cost: 6, harvest_age: 4, sell_value: 9, generatedItem_id: 15, season: 'winter' }),
		Seeds.upsert({ id: 16, name: 'LampGrass', cost: 3, harvest_age: 3, sell_value: 6, generatedItem_id: 16, season: 'winter' }),
	];
	await Promise.all(shop);

	const items = [
		Items.upsert({ id: 1, name: 'Turnip', sell_value: 2 }),
		Items.upsert({ id: 2, name: 'Potato', sell_value: 5 }),
		Items.upsert({ id: 3, name: 'Cucumber', sell_value: 9 }),
		Items.upsert({ id: 4, name: 'Cabbage', sell_value: 18 }),

		Items.upsert({ id: 5, name: 'Tomato', sell_value: 8 }),
		Items.upsert({ id: 6, name: 'Corn', sell_value: 12 }),
		Items.upsert({ id: 7, name: 'Onion', sell_value: 4 }),
		Items.upsert({ id: 8, name: 'Pineapple', sell_value: 30 }),

		Items.upsert({ id: 9, name: 'Eggplant', sell_value: 8 }),
		Items.upsert({ id: 10, name: 'Carrot', sell_value: 8 }),
		Items.upsert({ id: 11, name: 'Yam', sell_value: 3 }),
		Items.upsert({ id: 12, name: 'ChiliPepper', sell_value: 12 }),

		Items.upsert({ id: 13, name: 'Durian', sell_value: 35 }),
		Items.upsert({ id: 14, name: 'CorinaFlower', sell_value: 40 }),
		Items.upsert({ id: 15, name: 'IronLeaf', sell_value: 9 }),
		Items.upsert({ id: 16, name: 'LampGrass', sell_value: 6 }),
	];
	await Promise.all(items);

	console.log('Database synced');
	sequelize.close();
}).catch(console.error);