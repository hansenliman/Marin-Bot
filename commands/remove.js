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
	name: 'remove',
	description: '',
	async execute(message, args) {
        args = args.trim().split(/ +/);
        
        field_number = 0
        field = 0

        const check_user = await Users.findOne({
            where: { user_id: message.author.id },
        });

        if (!check_user) {
            Users.create({ user_id: message.author.id, balance: 0})
            Fields.create({ user_id: message.author.id, field_number: 1, plant: '', age: 0, harvest_age: 0, sell_value: 0, generatedItem_id: 0, is_empty: true, level: 0 })
        }

        if ( args.length === 1 && args[0] === '' ) { // Remove withered plants
            const fields = await Fields.update({ is_withered: false, is_empty: true }, { where: { user_id: message.author.id, is_withered: true } });
            if (fields[0]) {
                console.log(fields)
                return message.channel.send(`Cleared all withered plants!`);
            }
            return message.channel.send(`No plants to clear. Maybe try ${PREFIX}remove or ${PREFIX}remove [Field Number]`);
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
            } else {
                if (field.is_empty === true) {
                    return message.channel.send(`That field is already empty.`);
                } else {
                    if (field.is_withered === true) {
                        await Fields.update({ is_withered: false, is_empty: true }, { where: { user_id: message.author.id, field_number: field.field_number } });
                        return message.channel.send(`Nice! You just removed your withered Lv.${field.level} ${field.plant} from field ${field.field_number}`);
                    } else {
                        await Fields.update({ is_withered: false, is_empty: true }, { where: { user_id: message.author.id, field_number: field.field_number } });
                        return message.channel.send(`Nice! You just removed your Lv.${field.level} ${field.plant} from field ${field.field_number}`);
                    }
                }
            }
        } else {
            return message.channel.send(`I don't understand, try this...\n${PREFIX}remove or ${PREFIX}remove [Field Number]`);
        }
	},
};