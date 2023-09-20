const Discord = require('discord.js');
const client = new Discord.Client({ intents: [3276799]});
client.slashcommands = new Discord.Collection();
client.newCollection = new Discord.Collection();

client.login(require('../Settings/config').token).then(() => {
  console.log(
    ` Successfully logged in as: ${client.user.tag} ${client.user.id}`);
});

module.exports = client;
