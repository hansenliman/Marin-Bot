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

await Seeds.update({ cost: 15, harvest_age: 16, sell_value: 30 }, { where: { name: 'Pineapple' } });

await Seeds.destroy({
	where: { name: 'Ivern' }
})
await Seeds.destroy({
	where: { name: 'Zyra' }
})
await Seeds.destroy({
	where: { name: 'Maokai' }
})
await Seeds.destroy({
	where: { name: 'GoldenTurnip' }
})

await Seeds.destroy({
	where: { name: 'Ivern' }
})
await Seeds.destroy({
	where: { name: 'Zyra' }
})
await Seeds.destroy({
	where: { name: 'Maokai' }
})
await Seeds.destroy({
	where: { name: 'GoldenTurnip' }
})

Seeds.upsert({ id: 17, name: 'Strawberry', cost: 7, harvest_age: 4, sell_value: 10, generatedItem_id: 17, season: 'spring' })
Items.upsert({ id: 17, name: 'Strawberry', sell_value: 10 })
