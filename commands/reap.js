// CommonJS Modules
const { Random } = require("random-js");
const random = new Random(); // uses the nativeMath engine

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
const SeedsAchievements = require('../models/SeedsAchievements')(sequelize, Sequelize);

// Create associations:
UserSeeds.belongsTo(Seeds, { foreignKey: 'seed_id', as: 'seed' });
UserItems.belongsTo(Items, { foreignKey: 'item_id', as: 'item' });

var dict = {};
dict[1] = 100
dict[2] = 90
dict[3] = 90
dict[4] = 80
dict[5] = 60
dict[6] = 60
dict[7] = 50
dict[8] = 50
dict[9] = 40
dict[10] = 40
dict[11] = 40
dict[12] = 40
dict[13] = 40
dict[14] = 30
dict[15] = 30
dict[16] = 30
dict[17] = 20
dict[18] = 15
dict[19] = 15

const seed_return_chance = 25
const seed_samegrade_chance = 20

module.exports = {
	name: 'reap',
	description: '',
	async execute(message, args) {
        args = args.trim().split(/ +/);
        
        let field_number = 0
        let field = 0

        const check_user = await Users.findOne({
            where: { user_id: message.author.id },
        });

        if (!check_user) {
            Users.create({ user_id: message.author.id, balance: 0})
            Fields.create({ user_id: message.author.id, field_number: 1, plant: '', age: 0, harvest_age: 0, sell_value: 0, generatedItem_id: 0, is_empty: true, level: 0 })
        }

        if ( args.length === 1 && args[0] === '' ) {
            field = await Fields.findOne({
                where: { user_id: message.author.id, is_empty: false },
            });
            if (field) {
            return message.channel.send(`Please also specify the field number in the command:\n${PREFIX}reap [Field Number]`);
            } else {
                return message.channel.send(`All your field(s) are empty.`);
            }
        } else if ( args.length === 1 ) {
            field_number = Number(args[0])
            if (!Number.isInteger(field_number)) {
                return message.channel.send(`You did not enter a valid field number.`);
            }
            field = await Fields.findOne({
                where: { user_id: message.author.id, field_number: field_number },
            });
            if (!field) {
                return message.channel.send(`You don't have that field number.`);
            } else if (field.is_empty == true) {
                return message.channel.send(`There is nothing planted on that field!`);
            }
        } else {
            return message.channel.send(`I don't understand, try this...\n${PREFIX}reap [Field Number]`);
        }
        
        const user = await Users.findOne({
            where: { user_id: message.author.id },
        });

        if (field.is_withered === true) {
            return message.channel.send(`Yikes! The plant on that field has withered!`);
        }

        if (!field || field.age < field.harvest_age) {
            return message.channel.send(`The plant is not ready to be harvested!`);
        }
        
        const random_num = random.integer(1, 100);

        if (random.integer(1, 100) <= dict[field.level]) { // Level up!
            field.is_empty = true
            field.save()

            const new_level = field.level + 1

            if (new_level > 20) {
                new_level = 20
            }

            let seedsAchievement = await SeedsAchievements.findOne({
                where: { user_id: message.author.id, name: field.plant }
            })

            if (!seedsAchievement) { // Create the achievement for that seed if he doesn't have the achievement.
                SeedsAchievements.create({ user_id: message.author.id, name: field.plant })
            }

            seedsAchievement = await SeedsAchievements.findOne({
                where: { user_id: message.author.id, name: field.plant }
            })

            seedsAchievement.total_reaped += 1
            seedsAchievement.highest_reaped = new_level
            seedsAchievement.save()

            message.channel.send(`Congratulations! You have successfully reaped the ${field.plant}! It is now Lv.${new_level}`);
            const userSeed = await UserSeeds.findOne({
                where: { user_id: message.author.id, seed_id: field.generatedSeed_id, level: new_level },
            });
            if (userSeed) {
                userSeed.amount += 1;
                return userSeed.save()
            }
            return UserSeeds.create({ user_id: message.author.id, seed_id: field.generatedSeed_id, amount: 1, level: new_level })
        } else { // No level up
            if (random.integer(1, 100) <= seed_return_chance) { // A seed will be returned.
                if (random.integer(1, 100) <= seed_samegrade_chance) { // The seed will be the same grade.
                    field.is_empty = true
                    field.save()
        
                    message.channel.send(`You have reaped ${field.plant}! But it's the same grade. It is now Lv.${field.level}`);
                    const userSeed = await UserSeeds.findOne({
                        where: { user_id: message.author.id, seed_id: field.generatedSeed_id, level: field.level },
                    });
                    if (userSeed) {
                        userSeed.amount += 1;
                        return userSeed.save()
                    }
                    return UserSeeds.create({ user_id: message.author.id, seed_id: field.generatedSeed_id, amount: 1, level: field.level })
                } else { // The seed will downgrade.
                    field.is_empty = true
                    field.save()
        
                    message.channel.send(`You have reaped ${field.plant}! It evolved! But backwards... it is now Lv.${field.level - 1}`);
                    const userSeed = await UserSeeds.findOne({
                        where: { user_id: message.author.id, seed_id: field.generatedSeed_id, level: field.level - 1 },
                    });
                    if (userSeed) {
                        userSeed.amount += 1;
                        return userSeed.save()
                    }
                    return UserSeeds.create({ user_id: message.author.id, seed_id: field.generatedSeed_id, amount: 1, level: field.level - 1 })
                }
            } else { // The seed is destroyed
                field.is_empty = true
                field.save()
                return message.channel.send(`You have reaped ${field.plant}! But it broke...`);
            }
        }
	},
};