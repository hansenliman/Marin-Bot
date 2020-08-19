const fs = require('fs');
const Discord = require('discord.js');
const Sequelize = require('sequelize');
const { Op } = require('sequelize');
const seasons = require('./seasons');
const client = new Discord.Client();
const cooldowns = new Discord.Collection();
const PREFIX = '!';

client.commands = new Discord.Collection();
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const command = require(`./commands/${file}`);

	// set a new item in the Collection
	// with the key as the command name and the value as the exported module
	client.commands.set(command.name, command);
}

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

setInterval(seasons.change_season, 172800000); // 172800000 = Two Days

// Wait for messages...
client.on('message', async message => {
	if (message.content.startsWith(PREFIX)) {
		const input = message.content.slice(PREFIX.length).trim().split(' ');
		const commandName = input.shift().toLowerCase();
		const args = input.join(' ');

		// if (!client.commands.has(commandName)) return;

		// const command = client.commands.get(commandName);
		
		const command = client.commands.get(commandName)
			|| client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));

		if (!command) return;
		
			if (!cooldowns.has(command.name)) {
				cooldowns.set(command.name, new Discord.Collection());
			}
	
			const now = Date.now();
			const timestamps = cooldowns.get(command.name);
			const cooldownAmount = (command.cooldown) * 1000;
			
			if (timestamps.has(message.author.id)) {
				const expirationTime = timestamps.get(message.author.id) + cooldownAmount;
			
				if (now < expirationTime) {
					const timeLeft = ((expirationTime - now) / 1000) / 60;
					if (command.name === 'water') {
						return message.reply(` ${timeLeft.toFixed(0)} mins left until you can water your field again.`);
					}
					else if (command.name === 'beg') {
						return message.reply(` ${(timeLeft/60).toFixed(1)} hours left until you can beg again.`);
					}
				}
			}
			
			timestamps.set(message.author.id, now);
			setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);
		
		try {
			command.execute(message, args);
		} catch (error) {
			console.error(error);
			message.reply('There was an error trying to execute that command! Report this to Hansen please.');
		}
	}
});

client.once('ready', () => {
    console.log("Ready!")
});

client.login('Token Here');

