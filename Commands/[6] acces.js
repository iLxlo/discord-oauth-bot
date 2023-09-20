const { EmbedBuilder, ActionRowBuilder, StringSelectMenuBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");
const { SlashCommandBuilder } = require("@discordjs/builders");
const botSchema = require('../Schema/botSchema');
const config = require('../Settings/config');

module.exports = {
  data: new SlashCommandBuilder()
    .setName("owners")
    .setDescription("🏭 Manage the owners list"),

    async execute(interaction, client) {

    

            const embed1 = new EmbedBuilder()
      .setTitle(interaction.locale == "tr" ? "❌ Erişim reddetildi" : interaction.locale == "fr" ? "❌ Acces refuse" : "❌ Access denied")
      .setColor(2829617)
      let btn = new ButtonBuilder()
      .setStyle(5)
      .setURL(client.authInvite)
      .setLabel("Add bot")
      .setEmoji("🤖");
      let btn2 = new ButtonBuilder()
      .setStyle(5)
      .setURL("https://https://github.com/iLxlo/discord-oauth-bot")
      .setLabel("Join support")
      .setEmoji("❓");
      const row31 = new ActionRowBuilder() 
      .addComponents([btn, btn2]);

      let data = await botSchema.findOne({ clientId: client.user.id })
      let abc = data.whitelist.find(x => x.id === interaction.user.id)
      if(!config.authDevelopers.includes(interaction.user.id) && !config.authOwners.includes(interaction.user.id) && whitelist?.id !== interaction.user.id) return interaction.reply({ ephemeral: true, embeds: [embed1], components: [row31]})
  

    data.whitelist = data.whitelist.reverse();

    /* Core Whitelist Page */
    let page = 0;
    let maxPage = Math.ceil(data.whitelist?.length / 5);

    /* Core Whitelist Interaction Page Update */
    let slicedData = data.whitelist.slice(page * 5, (page + 1) * 5);

    let embed = new EmbedBuilder()
      .setTitle("Whitelist")
      .setColor(2829617)
      .setDescription(`${data.whitelist?.length > 0 ? slicedData?.map((value, index) => `\` ${index + 1} \` \` ${value.name} \` - \` ${value.id} \``).join("\n") : "`` No people added on this list. ``"}`)
      .setFooter({ text: `v1.0 ・ https://github.com/iLxlo/discord-oauth-bot` })

    /* Core Whitelist Builder */

    

   

    let row = new ActionRowBuilder()
      .addComponents(
        new ButtonBuilder()
          .setStyle(ButtonStyle.Success)
          .setLabel("Add")
          .setCustomId("addWhitelist"),
        new ButtonBuilder()
          .setStyle(ButtonStyle.Danger)
          .setLabel("Remove")
          .setCustomId("removeWhitelist"),

      )

    let row3 = new ActionRowBuilder()
      .addComponents(
        new ButtonBuilder()
          .setStyle(ButtonStyle.Primary)
          .setLabel("◀")
          .setCustomId("previousPage")
          .setDisabled(page === 0),
        new ButtonBuilder()
          .setStyle(ButtonStyle.Primary)
          .setLabel("▶")
          .setCustomId("nextPage")
          .setDisabled(page === maxPage - 1),
        new ButtonBuilder()
          .setStyle(ButtonStyle.Success)
          .setLabel("Add")
          .setCustomId("addWhitelist"),
        new ButtonBuilder()
          .setStyle(ButtonStyle.Danger)
          .setLabel("Remove")
          .setCustomId("removeWhitelist"),
      )

    /* Core Whitelist Message */
    let whitelist = [];
    if (data.whitelist?.length > 5) whitelist = [row3];
    else whitelist = [row];
    await interaction.reply({ embeds: [embed], components: whitelist }).then(async (msg) => {

      var iFilter = x => x.user.id === interaction.user.id;
      const collector = msg.createMessageComponentCollector({ filter: iFilter, componentType: 2, time: 60 * 1000 })
      



    })
    }
 };
