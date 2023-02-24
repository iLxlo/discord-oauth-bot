/* Core API */
const Discord = require('discord.js');
const { EmbedBuilder, InteractionType, ActionRowBuilder, ButtonBuilder, SelectMenuBuilder, ButtonStyle, ModalBuilder, TextInputStyle, TextInputBuilder } = require("discord.js");

/* Core Database */
const botSchema = require('../Schema/botSchema');
const userSchema = require('../Schema/userSchema');

/* Core API Configuration */
const config = require('../Settings/config');

/**@param {Discord.Client} client
 * @param {Discord.interactionCreate} interactionCreate
 */

 module.exports = async (interaction,client) => {
    
    /* Core Interaction */
    let rowyValues;
    try {
    rowyValues = interaction.values[0];
    } catch(err) {
    }
    let rowyId = interaction.customId;

    let botData = await botSchema.findOne({ clientId: client.user.id });

    let advancedpanel = new ActionRowBuilder()
    .addComponents(
    
        new SelectMenuBuilder()
        .setCustomId("advancedsettingsmenuupdate")
        .setPlaceholder(interaction.locale == "tr" ? "🔨 Bir seçenek seçin" : interaction.locale == "fr" ? "🔨 Sélectionnez une option" : "🔨 Select an option")
        .addOptions({

            label: interaction.locale == "tr" ? "Yetkili Sunucular" : interaction.locale == "fr" ? "Serveurs Autorisés" : "Authorized Servers",
            description: interaction.locale == "tr" ? "Bot için yetkili sunucular." : interaction.locale == "fr" ? "Serveurs autorisés pour le bot." : "Authorized servers for the bot.",
            value: "authorizedservers",
            emoji: "📂",
  
            },
            {

              label: interaction.locale == "tr" ? "Otomatik Giriş" : interaction.locale == "fr" ? "Menuisier Automatique" : "Auto Joiner",
              description: interaction.locale == "tr" ? "Yetkililendirilmiş hesapları otomatik sunucuya sokar." : interaction.locale == "fr" ? "Insère automatiquement les comptes autorisés dans le serveur." : "Inserts authorized accounts automatically into the server.",
              value: "autojoiner",
              emoji: "👥",
    
            },
            )
        
    )

    global.advancedpanel = advancedpanel;

    /* Core Advanced Settings */
    if(rowyValues === "advancedsettings") {

        const embed = new EmbedBuilder()
        .setTitle(interaction.locale == "tr" ? "AuthClient - Gelişmiş Panel" : interaction.locale == "fr" ? "AuthClient - Panneau Avancé" : "AuthClient - Advanced Panel")
        .setDescription(`\`🔴\` Block VPN and Proxies \`\`\`disabled\`\`\`
        \`🔵\` Redicert URI \`\`\`${config.client.redirect_uri}\`\`\`	
        \`🟡\` Auto Refresh \`\`\`Coming Soon\`\`\`
        ${botData.autoJoin[0]?.status  === true ? `\`🟢\` Auto Join \`\`\`Status: ${botData.autoJoin[0]?.status === true ? "enabled" : ""}\nMode: ${botData.autoJoin[0]?.mode}\nGuild: ${botData.autoJoin[0]?.guildName} (${botData.autoJoin[0]?.guildID})\`\`\`` : `\`🔴\` Auto Join \`\`\`disabled\`\`\``}
        ${botData.autoRoles?.status === true ? `\`🟢\` Auto Roles \`\`\`Status: ${botData.autoRoles?.status === true ? "enabled" : ""}\`\`\`` : `\`🔴\` Auto Roles \`\`\`disabled\`\`\``}
        ${botData.autoMessage?.status === true ? `\`🟢\` Auto Message \`\`\`Status: ${botData.autoRoles?.status === true ? "enabled" : ""}\`\`\`` : `\`🔴\` Auto Message \`\`\`disabled\`\`\``}`)

        interaction.update({ embeds: [embed], components: [advancedpanel] })

    }

    if(rowyValues === "authorizedservers") {

        const embed = new EmbedBuilder()
        .setTitle(interaction.locale == "tr" ? "AuthClient - Yetkili Sunucular" : interaction.locale == "fr" ? "AuthClient - Serveurs Autorisés" : "AuthClient - Authorized Servers")
        .setDescription(`${botData.authorizedServers?.length > 0 ? botData.authorizedServers?.map((value, index) => `\` ${index + 1} \` \` ${client.guilds.cache.get(value)?.name ? client.guilds.cache.get(value)?.name : "Unknown Server"} \` - \` ${value} \``).join("\n") : interaction.locale == "tr" ? "``Yetkili sunucu yok.``" : interaction.locale == "fr" ? "``Il n'y a pas de serveur autorisé.``" : "``No authorized server was found.``"}`)
        .setFooter({ text: `${config.client.footer}`})

        const row = new ActionRowBuilder()
        .addComponents(
        
            new ButtonBuilder()
            .setCustomId("authorizedserversadd")
            .setLabel(interaction.locale == "tr" ? "Ekle" : interaction.locale == "fr" ? "Ajouter" : "Add")
            .setStyle(ButtonStyle.Success),
            new ButtonBuilder()
            .setCustomId("authorizedserversremove")
            .setLabel(interaction.locale == "tr" ? "Kaldır" : interaction.locale == "fr" ? "Retirer" : "Remove")
            .setStyle(ButtonStyle.Danger),
        
        )

        interaction.update({ embeds: [embed], components: [row,global.advancedpanel] })

    }

    /* Core Authorized Server Add */
    if(rowyId === "authorizedserversadd") {

        const addModals = new ModalBuilder()
        .setCustomId("addGuildModals")// Enter the server id you want to add
        .setTitle(interaction.locale == "tr" ? "Eklemek istediğiniz sunucu id girin" : interaction.locale == "fr" ? "Entrez ID de serveur souhaitez ajouter" : "Enter the server id you want to add")
  
      const guildText = new TextInputBuilder()
        .setCustomId("guildIds")
        .setLabel(interaction.locale == "tr" ? "Bir sunucu id gir" : interaction.locale == "fr" ? "Entrez un ID de serveur" : "Enter a server id")
        .setRequired(true)
        .setStyle(1)
  
      const textconverter = new ActionRowBuilder().addComponents(guildText)
  
      addModals.addComponents(textconverter)
  
      await interaction.showModal(addModals)

    }

    /* Core Authorized Server Remove */
    if(rowyId === "authorizedserversremove") {

        const removeModals = new ModalBuilder()
        .setCustomId("removeGuildModals")
        .setTitle(interaction.locale == "tr" ? "Kaldırmak istediğiniz sunucu id girin" : interaction.locale == "fr" ? "Entrez ID du serveur souhaitez supprimer" : "Enter the server id you want to remove")
  
        const guildText = new TextInputBuilder()
        .setCustomId("guildIds")
        .setLabel(interaction.locale == "tr" ? "Bir sunucu id gir" : interaction.locale == "fr" ? "Entrez un ID de serveur" : "Enter a server id")
        .setRequired(true)
        .setStyle(1)
  
      const textconverter = new ActionRowBuilder().addComponents(guildText)
  
      removeModals.addComponents(textconverter)
  
      await interaction.showModal(removeModals)

    }

    /* Core Auto Joiner */
    if(rowyValues === "autojoiner") {

      let options = [];
      botData.authorizedServers?.forEach((value, index) => {
        let guild = client.guilds.cache.get(value)
        options.push({
          label: guild ? guild.name : "Unknown Server",
          value: guild ? guild.id + "+1+" : "Unknown ID" + index,
        })
      })
      options = [
        ...options,
        {
          label: "Click to turn disabled the system",
          value: "disabledauthjoiner",
        }
      ]

      const embed = new EmbedBuilder()
      .setTitle(interaction.locale == "tr" ? "AuthClient - Otomatik Giriş" : interaction.locale == "fr" ? "AuthClient - Menuisier Automatique" : "AuthClient - Auto Joiner")
      .setDescription(`${botData.authorizedServers?.length > 0 ? botData.authorizedServers?.map((value, index) => `\` ${index + 1} \` \` ${client.guilds.cache.get(value)?.name ? client.guilds.cache.get(value)?.name : "Unknown Server"} \` - \` ${value} \``).join("\n") : interaction.locale == "tr" ? "``Yetkili sunucu yok.``" : interaction.locale == "fr" ? "``Il n'y a pas de serveur autorisé.``" : "``No authorized server was found.``"}`)
      .setFooter({ text: `${config.client.footer}`})

      const row = new ActionRowBuilder()
      .addComponents(
        new SelectMenuBuilder()
        .setCustomId("autojoinerselect")
        .setPlaceholder(interaction.locale == "tr" ? "Sunucu Seç" : interaction.locale == "fr" ? "Sélectionnez le serveur" : "Select Server")
        .setOptions(options)
      )

      interaction.update({ embeds: [embed], components: [row,global.advancedpanel] })

    }

    /* Core Auto Joiner Select */
    if(botData.authorizedServers?.includes(rowyValues?.split("+1")[0])) {
      
      await interaction.reply({ ephemeral: true, content: `${interaction.locale == "tr" ? `Otomatik giriş sunucusu \` ${client.guilds.cache.get(rowyValues?.split("+1")[0]).name} \` olarak seçildi.` : interaction.locale == "fr" ? `Le serveur d'entrée automatique a été sélectionné comme \` ${client.guilds.cache.get(rowyValues?.split("+1")[0]).name} \`.` : `The auto joiner server was selected as \` ${client.guilds.cache.get(rowyValues?.split("+1")[0]).name} \`.`}` })
      await botSchema.findOneAndUpdate({ clientId: client.user.id }, { $set: { autoJoin: { status: true, mode: "On first user authorize", guildName: client.guilds.cache.get(rowyValues?.split("+1")[0]).name, guildID: rowyValues?.split("+1")[0] } } }, { upsert: true })

    }

    

}