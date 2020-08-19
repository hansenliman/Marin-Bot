const Discord = require('discord.js');
const Sequelize = require('sequelize');
const { Op } = require('sequelize');
const seasons = require('../seasons');
const { season_counter } = require('../seasons');
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
	name: 'plant',
	description: '',
	async execute(message, args) {
        args = args.trim().split(/ +/);
        
        const check_user = await Users.findOne({
            where: { user_id: message.author.id },
        });

        if (!check_user) {
            Users.create({ user_id: message.author.id, balance: 0})
            Fields.create({ user_id: message.author.id, field_number: 1, plant: '', age: 0, harvest_age: 0, sell_value: 0, generatedItem_id: 0, generatedSeed_id: 0, is_empty: true, level: 0 })
        }

        level = 0

        field_number = 0
        
        field = 0
        seed = 0

        if ( args.length === 1 && args[0] === '' ) {
            return message.channel.send(`The proper usage for planting is:\n${PREFIX}plant [Seed] or ${PREFIX}plant [Seed] [Field Number] or ${PREFIX}plant [Level] [Seed] or ${PREFIX}plant [Level] [Seed] [Field Number]`);
        } else if (args.length === 1) {
            level = 1
            field = await Fields.findOne({
                where: { user_id: message.author.id, is_empty: true },
            });
            if (!field) {
                return message.channel.send(`You don't have an empty field.`);
            }
            seed = await Seeds.findOne({
                where: { name: { [Op.like]: args[0] } },
            })
    
            if (!seed) return message.channel.send(`That item doesn't exist.`);
        } else if ( args.length === 2 ) {
            const temp = Number(args[0])
            if (Number.isInteger(temp)) { // If int, then it must be [level] [plant]
                level = args[0]
                field = await Fields.findOne({
                    where: { user_id: message.author.id, is_empty: true },
                });
                if (!field) {
                    return message.channel.send(`You don't have an empty field.`);
                }
                seed = await Seeds.findOne({
                    where: { name: { [Op.like]: args[1] } },
                })
        
                if (!seed) return message.channel.send(`That item doesn't exist.`);
            } else { // else, must be [plant] [field number]
                level = 1
                field_number = Number(args[1])
                if (!Number.isInteger(field_number)) {
                    return message.channel.send(`You did not enter a valid field number.`);
                }
                field = await Fields.findOne({
                    where: { user_id: message.author.id, field_number: field_number },
                });
                if (!field) {
                    return message.channel.send(`You don't have that field number.`);
                }
                seed = await Seeds.findOne({
                    where: { name: { [Op.like]: args[0] } },
                })
        
                if (!seed) return message.channel.send(`That item doesn't exist.`);
            }
        } else if ( args.length === 3 ) { // [level] [plant] [field number]
            level = args[0]
            field_number = Number(args[2])
            if (!Number.isInteger(field_number)) {
                return message.channel.send(`You did not enter a valid field number.`);
            }
            field = await Fields.findOne({
                where: { user_id: message.author.id, field_number: field_number },
            });
            if (!field) {
                return message.channel.send(`You don't have that field number.`);
            }
            seed = await Seeds.findOne({
                where: { name: { [Op.like]: args[1] } },
            })
    
            if (!seed) return message.channel.send(`That item doesn't exist.`);
        } else { // Command must be invalid
            return message.channel.send(`I don't understand, try this...\n${PREFIX}plant [Seed] or ${PREFIX}plant [Seed] [Field Number] or ${PREFIX}plant [Level] [Seed] or ${PREFIX}plant [Level] [Seed] [Field Number]`);
        }
        
        if (field.is_empty === false) {
            return message.channel.send(`You already have something on that field!`)
        }

        if (seed.season != seasons.seasons[seasons.get_season_counter()]) {
            return message.channel.send(`That seed is not in season.`)
        }

        const userSeed = await UserSeeds.findOne({ 
            where: { user_id: message.author.id, seed_id: seed.id, level: level }, 
        });
        
        if (!userSeed) return message.channel.send(`You don't have such item in your inventory.`);

        if (userSeed) {
            userSeed.amount -= 1;
            userSeed.save()
        }

        if (userSeed.amount === 0){
            await userSeed.destroy({
                where: { user_id: message.author.id, seed_id: seed.id, level: level }
            })
        }

        field.plant = seed.name;
        field.age = 0;
        field.harvest_age = seed.harvest_age;
        field.sell_value = seed.sell_value;
        field.generatedItem_id = seed.generatedItem_id
        field.generatedSeed_id = seed.id
        field.is_empty = false;
        field.level = level
        field.save()

        // Fields.create({ user_id: message.author.id, field_number: field_number, plant: seed.name, age: 0, harvest_age: seed.harvest_age, sell_value: seed.sell_value, generatedItem_id: seed.generatedItem_id, is_empty: false })
        return message.channel.send(`You've planted the Lv.${field.level} ${seed.name} seed!`)
	},
};