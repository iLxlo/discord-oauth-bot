const { EmbedBuilder, codeBlock, ActionRowBuilder, StringSelectMenuBuilder, ButtonBuilder, ButtonStyle, componentType } = require("discord.js");
const { SlashCommandBuilder } = require("@discordjs/builders");
const config = require('../Settings/config')
let array = []

module.exports = {
  data: new SlashCommandBuilder()
    .setName("about")
    .setNameLocalizations({tr: "hakkimda", fr: "environ"})
    .setDescription("Display information about the bot.")
    .setDescriptionLocalizations({tr: "Botla ilgili bilgileri görüntüleyin.", fr: "Afficher des informations sur le bot."}),
    enabled: true,
    async execute(interaction, client) {
      config.authDevelopers.forEach(async (x) => {
      await client.users.fetch(x).then(t => {
        return array.push(t.username, t.discriminator)
        })
      })
      let btn = new ButtonBuilder()
      .setStyle(5)
      .setURL(client.authInvite)
      .setLabel("Add bot")
      .setEmoji("🤖");
      let btn2 = new ButtonBuilder()
      .setStyle(5)
      .setURL(config.client.serverLink)
      .setLabel("Join support")
      .setEmoji("❓");
      const row = new ActionRowBuilder() 
      .addComponents([btn, btn2]);
      let embed = new EmbedBuilder()
      .setTitle("💯 About")
      .setDescription(`
The bot was created by \`Rowy, iLxloo\`.
Invite it by clicking the button below or join our Discord server.\n\n Thanks to epic for fixing bugs.`)
      await interaction.reply({ ephemeral: true, components: [row], embeds: [embed]})

    }
 };
