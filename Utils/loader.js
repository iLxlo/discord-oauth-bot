/* Core API */
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v10');

/* Core Config */
const config = require('../Settings/config');

/* Core Extra Client Configuration */
const log = authLog => { console.log(`[${chalk.green("+")}] ` + authLog) }
const warn = authLog => { console.log(`[${chalk.red("-")}] ` + authLog) }
const error = authLog => { console.log(`[${chalk.red("!")}] ` + authLog) }

/* Core API Configuration */
const rest = new REST({ version: '10' }).setToken(config.token);
const commands = []; /* Commands Array */

module.exports = function (client) {

   const slashCommands = client.fs.readdirSync('./Commands').filter(file => file.endsWith('.js'));
console.log(`[${client.chalk.magenta('+')}] InteractionContent Loading...`);
const commands = [];

for (const file of slashCommands) {
  try {
    const command = require(`../Commands/${file}`);
    if (command.data) {
      client.slashcommands.set(command.data.name, command);
      console.log(`[${client.chalk.green('+')}] Slash Command loaded ${client.chalk.green(command.data.name)} Command Enabled`);
      commands.push(command.data.toJSON());
    } else {
      console.log(`${client.chalk.red('[-]')} ${file} is missing data`);
    }
  } catch (err) {
    console.log(`${client.chalk.red('[-]')} Error loading ${file}: ${err}`);
  }
}

    const requestEvent = (event) => require(`../Events/${event}`)
    client.on('interactionCreate', (interactionCreate) => requestEvent('interactionHandler')(interactionCreate, client));
    client.on('interactionCreate', (interactionCreate) => requestEvent('interactionCreate')(interactionCreate, client));
    client.on('interactionCreate', (interactionCreate) => requestEvent('interactionCreateII')(interactionCreate, client));
    client.on('interactionCreate', (interactionCreate) => requestEvent('interactionModal')(interactionCreate, client)); 
    
    client.on('ready', async () => {

    /* Core Create Database */
    const botSchema = require('../Schema/botSchema');
    let data = await botSchema.findOne({ clientId: client.user.id });
    if (!data) { 

        let newData = {

            clientId: client.user.id,
            wihtelist: [],
            autoJoin: [],
            autoRoles : [],
            autoMessage: [],
        
            authorizedServers: []

        }

        await new botSchema(newData).save();

    };

    /* Core Interacion Loader */
        try {
            await rest.put(
                Routes.applicationCommands(client.user.id),
                { body: commands },
            );
        } catch (error) {
            error(error);
        }
    
    });

}
