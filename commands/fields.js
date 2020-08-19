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

// Create associations:
UserSeeds.belongsTo(Seeds, { foreignKey: 'seed_id', as: 'seed' });

module.exports = {
	name: 'fields',
	aliases: ['field'],
	description: '',
	async execute(message, args) {
		args = args.trim().split(/ +/);
		
		let buffer = ''
        
        const check_user = await Users.findOne({
            where: { user_id: message.author.id },
        });

        if (!check_user) {
            Users.create({ user_id: message.author.id, balance: 0})
            Fields.create({ user_id: message.author.id, field_number: 1, plant: '', age: 0, harvest_age: 0, sell_value: 0, generatedItem_id: 0, is_empty: true, level: 0 })
        }

        if ( args.length === 1 && args[0] === '' ) {
			const fields = await Fields.findAll({ 
				where: { user_id: message.author.id },
			});
	
			buffer += `Here are your current fields:\n`;
			
			fields.forEach(field => {
				if (field.is_empty) {
					buffer += `Field ${field.field_number} [Empty]\n`
				} else if (field.is_withered === true) {
					buffer += `Field ${field.field_number} [Lv.${field.level} ${field.plant}] (Withered!)\n`
				} else if (field.harvest_age - field.age <= 0) {
					buffer += `Field ${field.field_number} [Lv.${field.level} ${field.plant}] (Ready!)\n`
				} else {
					buffer += `Field ${field.field_number} [Lv.${field.level} ${field.plant}]\n`
				}
			});
			return message.channel.send(buffer);
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
            return message.channel.send(`I don't understand, try this...\n${PREFIX}field or ${PREFIX}field [Field Number]`);
        }
		
		const water_remaining = field.harvest_age - field.age
		buffer += `Field ${field.field_number} currently has ${field.plant}\n`
		if (field.is_withered) {
			buffer += `Unfortunately, the plant has withered...`
		} else if (water_remaining <= 0) {
			buffer += `Oh! The plant is ready to be harvested!`
		} else {
			buffer += `The plant needs to be watered ${water_remaining} more times before it matures.\nGrow big and strong!`
		}
		return message.channel.send(buffer);











        // if (!fields.length) return message.channel.send(`You have nothing planted!`);
		// return message.channel.send(`You currently have: ${fields.map(i => `${i.plant} field`).join(', ')}`);
		
		return
	},
};