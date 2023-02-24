/* Core API */
const Discord = require('discord.js');

/* Core API Configuration */
const config = require('../Settings/config');

/* Core Database */
const botSchema = require('../Schema/botSchema');
/**@param {Discord.Client} client
 * @param {Discord.interactionCreate} interactionCreate
 */

 module.exports = async (interaction,client) => {

    const command = client.slashcommands.get(interaction.commandName);
    if (!command) return;
    let botData = await botSchema.findOne({ clientId: client.user.id });

   // if(!config.authDevelopers.includes(interaction.user.id) || !config.authOwners.includes(interaction.user.id)) return interaction.reply({ content: `${interaction.locale == "tr" ? "Beyaz listede yoksun." : interaction.locale == "fr" ? "Tu n'es pas sur la liste blanche." : "You're not on the white list."}`, ephemeral: true });

    try {
      await command.execute(interaction, client);
    } catch (error) {
      console.error(error);
      return interaction.reply({
        content: 'Komutu çalıştırırken hata ile karşılaştım geliştiricime ulaşın.',
        ephemeral: true
      });
    };

}