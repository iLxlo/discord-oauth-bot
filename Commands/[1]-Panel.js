const { EmbedBuilder, ActionRowBuilder, StringSelectMenuBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");
const { SlashCommandBuilder } = require("@discordjs/builders");
const botSchema = require('../Schema/botSchema');
const config = require('../Settings/config');

module.exports = {
  data: new SlashCommandBuilder()
    .setName("panel")
    .setNameLocalizations({tr: "panel", fr: "bord"})
    .setDescription("Shows the bot management panel.")
    .setDescriptionLocalizations({tr: "Bot yönetim panelini gösterir.", fr: "Affiche le panneau de gestion du bot."}),
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
  
      let menu1 = new StringSelectMenuBuilder()
        .setCustomId("menu1")
        .setPlaceholder(interaction.locale == "tr" ? "🔨 Bir seçenek seçin" : interaction.locale == "fr" ? "🔨 Sélectionnez une option" : "🔨 Select an option")
        .addOptions({

          label: interaction.locale == "tr" ? "Gelişmiş Panel" : interaction.locale == "fr" ? "Paramètres Avancés" : "Advanced Panel",
          description: interaction.locale == "tr" ? "Bot için gelişmiş panel." : interaction.locale == "fr" ? "Paramètres avancés pour le bot." : "Advanced panel for the bot.",
          value: "advancedsettings",
          emoji: "⚒️",

          },
          {

          label: interaction.locale == "tr" ? "Kullanıcıları Girdir" : interaction.locale == "fr" ? "Rejoindre des Utilisateurs" : "Join Users",
          description: interaction.locale == "tr" ? "Kullanıcıları sunucuya davet eder. (Sadece yetkili sunucular)" : interaction.locale == "fr" ? "Invitez des utilisateurs sur le serveur. (Serveurs autorisés uniquement)" : "Invite users to the server. (Just authorized servers)",
          value: "joinusers",
          emoji: "🧑‍🚀",

        },
        {

          label: interaction.locale == "tr" ? "Beyazliste" : interaction.locale == "fr" ? "Gérer la liste blanche" : "Manage whitelist",
          description: interaction.locale == "tr" ? "Botu kullanmasına izin verilen beyaz listeye alınmış üyelerin listesini görüntüler." : interaction.locale == "fr" ? "Affiche la liste des membres de la liste blanche autorisés à utiliser le bot." : "Displays the list of whitelisted members allow to use the bot.",
          value: "manageWhitelist",
          emoji: "🥷",

        },
        {

          label: interaction.locale == "tr" ? "Kullanıcılara bak" : interaction.locale == "fr" ? "Regardez les utilisateurs" : "Look at users",
          description: interaction.locale == "tr" ? "Doğrulanmış ve kimliği doğrulanmış kullanıcıların tam listesini görüntüler." : interaction.locale == "fr" ? "Affiche la liste complète des utilisateurs vérifiés et authentifiés." : "Displays the complete list of verified and authenticated users.",
          value: "manageusers",
          emoji: "🍧",

        })

      const row = new ActionRowBuilder()
      .addComponents(menu1)

      await interaction.reply({ components: [row] })

    }
 };