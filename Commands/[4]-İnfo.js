const { EmbedBuilder, codeBlock, ActionRowBuilder, StringSelectMenuBuilder, ButtonBuilder, ButtonStyle, componentType } = require("discord.js");
const { SlashCommandBuilder } = require("@discordjs/builders");
const config = require('../Settings/config')

module.exports = {
  data: new SlashCommandBuilder()
    .setName("info")
    .setNameLocalizations({tr: "bilgi", fr: "info"})
    .setDescription("Display the bot's statistics.")
    .setDescriptionLocalizations({tr: "Botun istatistiklerini görüntüleyin.", fr: "Affichez les statistiques du bot."}),
    enabled: true,
    async execute(interaction, client) {

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
      .setTitle("📈 Statistics")
      .addFields(
        { name: "Servers", value: `${codeBlock("fix", `[ ${client.guilds.cache.size} ]`)}`, inline: true },
        { name: "Members", value: `${codeBlock("fix", `[ ${client.users.cache.size} ]`)}`, inline: true }
      )
      
      await interaction.reply({ ephemeral: true, components: [row], embeds: [embed]})
      
    }
 };