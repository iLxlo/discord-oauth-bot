/* Core API */
const Discord = require('discord.js');
const { EmbedBuilder, InteractionType, ActionRowBuilder, ButtonBuilder, StringSelectMenuBuilder, ButtonStyle, ModalBuilder, TextInputStyle, TextInputBuilder, Collection } = require("discord.js");

/* Core Database */
const botSchema = require('../Schema/botSchema');
const userSchema = require('../Schema/userSchema');

/* Core API Configuration */
const config = require('../Settings/config');

/**@param {Discord.Client} client
 * @param {Discord.SelectMenuInteraction} interaction
 */

module.exports = async (interaction, client) => {

  /* Core Interaction */
  let rowyValues;
  try {
    rowyValues = interaction.values[0];
  } catch (err) {
  }
  let rowyId = interaction.customId;

  let botDatas = await botSchema.findOne({ clientId: client.user.id });

  /* Core Whitelist */
  if (rowyValues === "manageWhitelist") {

    /* Core Client Owner Security */
    //if(!config.authOwners.includes(interaction.user.id) && !config.authDevelopers.includes(interaction.user.id)) return interaction.reply({ content: interaction.locale == "tr" ? ":x: `` Bu menüye giriş izniniz bulunmamakta. ``" : interaction.locale == "fr" ? ":x: `` Vous n'avez pas la permission d'accéder à ce menu. ``" : ":x: `` You do not have permission to access this menu. ``", ephemeral: true });
    /* Core Whitelist Interaction Update */
    let data = await botSchema.findOne({ clientId: client.user.id });
    data.whitelist = data.whitelist.reverse();

    /* Core Whitelist Page */
    let page = 0;
    let maxPage = Math.ceil(data.whitelist?.length / 5);

    /* Core Whitelist Interaction Page Update */
    let slicedData = data.whitelist.slice(page * 5, (page + 1) * 5);

    let embed = new EmbedBuilder()
      .setTitle(interaction.locale == "tr" ? "AuthClient - Beyaz Liste" : interaction.locale == "fr" ? "AuthClient - Liste blanche" : "AuthClient - Whitelist")
      .setDescription(`${data.whitelist?.length > 0 ? slicedData?.map((value, index) => `\` ${index + 1} \` \` ${value.name} \` - \` ${value.id} \``).join("\n") : interaction.locale == "tr" ? "`` Beyazliste boş görünüyor. ``" : interaction.locale == "fr" ? "`` La liste blanche semble vide. ``" : "`` The white list looks empty. ``"}`)
      .setFooter({ text: `${config.client.footer} | Page ${page + 1} of ${maxPage}` })

    /* Core Whitelist Builder */

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

    const row2 = new ActionRowBuilder()
      .addComponents(menu1)

    let row = new ActionRowBuilder()
      .addComponents(
        new ButtonBuilder()
          .setStyle(ButtonStyle.Success)
          .setLabel(interaction.locale == "tr" ? "Ekle" : interaction.locale == "fr" ? "Ajouter" : "Add")
          .setCustomId("addWhitelist"),
        new ButtonBuilder()
          .setStyle(ButtonStyle.Danger)
          .setLabel(interaction.locale == "tr" ? "Çıkar" : interaction.locale == "fr" ? "Bénéfice" : "Remove")
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
          .setLabel(interaction.locale == "tr" ? "Ekle" : interaction.locale == "fr" ? "Ajouter" : "Add")
          .setCustomId("addWhitelist"),
        new ButtonBuilder()
          .setStyle(ButtonStyle.Danger)
          .setLabel(interaction.locale == "tr" ? "Çıkar" : interaction.locale == "fr" ? "Bénéfice" : "Remove")
          .setCustomId("removeWhitelist"),
      )

    /* Core Whitelist Message */
    let whitelist = [];
    if (data.whitelist?.length > 5) whitelist = [row3, row2];
    else whitelist = [row, row2];
    await interaction.update({ embeds: [embed], components: whitelist }).then(async (msg) => {

      var iFilter = x => x.user.id === interaction.user.id;
      const collector = msg.createMessageComponentCollector({ filter: iFilter, componentType: 2, time: 60 * 1000 })
      collector.on('collect', async (interac) => {

        if (interac.customId == "nextPage") {

          page++;
          slicedData = data.whitelist.slice(page * 5, (page + 1) * 5);
          embed.setDescription(slicedData?.map((value, index) => `\` ${(index + 1) + (page * 5)} \` \` ${value.name} \` - \` ${value.id} \``).join("\n"));
          embed.setFooter({ text: `${config.client.footer} | Page ${page + 1} of ${maxPage}` })
          row3.components[0].setDisabled(page === 0)
          row3.components[1].setDisabled(page === maxPage - 1);
          await interac.update({ embeds: [embed], components: whitelist }).catch(err => { })

        } else if (interac.customId == "previousPage") {

          page--;
          slicedData = data.whitelist.slice(page * 5, (page + 1) * 5);
          embed.setDescription(slicedData?.map((value, index) => `\` ${(index + 1) + (page * 5)} \` \` ${value.name} \` - \` ${value.id} \``).join("\n"));
          embed.setFooter({ text: `${config.client.footer} | Page ${page + 1} of ${maxPage}` })
          row3.components[0].setDisabled(page === 0);
          row3.components[1].setDisabled(page === maxPage - 1);
          await interac.update({ embeds: [embed], components: whitelist }).catch(err => { })

        }

        collector.on('end', async () => {

          row3.components[0].setDisabled(true)
          row3.components[1].setDisabled(true)

        })

      })

    })


  }

  /* Core Whitelist Add */
  if (rowyId === "addWhitelist") {

    /* Core Whitelist Add Modal Builder */
    const addModals = new ModalBuilder()
      .setCustomId("addWhitelistModal")
      .setTitle(interaction.locale == "tr" ? "AuthClient - Beyaz Liste Ekle" : interaction.locale == "fr" ? "AuthClient - Ajouter à la liste blanche" : "AuthClient - Add to Whitelist")

    /* Core Whitelist Add Modal Text Input */
    const guildText = new TextInputBuilder()
      .setCustomId("addWhitelistModalText")
      .setLabel(interaction.locale == "tr" ? "Beyazlisteye eklemek için kullanici id gir." : interaction.locale == "fr" ? "Entrez un identifiant à ajouter liste blanche" : "Enter an id to add to the white list")
      .setRequired(true)
      .setMaxLength(25)
      .setStyle(TextInputStyle.Short)

    const textconverter = new ActionRowBuilder().addComponents(guildText)

    addModals.addComponents(textconverter)

    await interaction.showModal(addModals)

  }

  /* Core Whitelist Remove */
  if (rowyId === "removeWhitelist") {

    /* Core Whitelist Add Modal Builder */
    const removeModals = new ModalBuilder()
      .setCustomId("removeWhitelistModal")
      .setTitle(interaction.locale == "tr" ? "AuthClient - Beyaz Liste Çıkar" : interaction.locale == "fr" ? "AuthClient - Supprimer de la liste blanche" : "AuthClient - Remove to Whitelist")

    /* Core Whitelist Add Modal Text Input */
    const guildText = new TextInputBuilder()
      .setCustomId("removeWhitelistModalText")
      .setLabel(interaction.locale == "tr" ? "Beyazlisteden çıkarmak için kullanici id gir." : interaction.locale == "fr" ? "Entrez l'ID à supprimer de la liste blanche." : "Enter an id to remove to the white list")
      .setRequired(true)
      .setMaxLength(25)
      .setStyle(TextInputStyle.Short)

    const textconverter = new ActionRowBuilder().addComponents(guildText)

    removeModals.addComponents(textconverter)

    await interaction.showModal(removeModals)

  }

  if (rowyValues === "manageusers") {

    /* Core Database */
    let data = await userSchema.find({});

    /* Core Page */
    let page = 0;
    let maxPage = Math.ceil(data.length / 10);

    let slicedData = data.slice(page * 10, (page + 1) * 10);

    let embed = new EmbedBuilder()
      .setTitle(`${interaction.locale == "tr" ? "AuthClient - Kullanıcılar" : interaction.locale == "fr" ? "AuthClient - Utilisateurs" : "AuthClient - Users"}`)
      .setDescription(data.length > 0 ? slicedData?.map((value, index) => `\` ${(index + 1)} \` \` ${value.username}#${value.discriminator} \` - \` ${value.id} \` - ${value.locale}`).join("\n") : interaction.locale == "tr" ? "Bu sunucuda kimse yok." : interaction.locale == "fr" ? "Il n'y a personne dans ce serveur." : "There is no one in this server.")
      .setFooter({ text: `${config.client.footer} | Page ${page + 1} of ${maxPage}` })
    /* Core Interaction Builder */
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
          .setDisabled(page === maxPage - 1)
      )

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

    const row2 = new ActionRowBuilder()
      .addComponents(menu1)

    let whitelist = []
    if (data.length > 10) whitelist = [row3, row2]
    else whitelist = [row2]

    /* Core Interaction */
    interaction.update({ embeds: [embed], components: whitelist }).then(async (msg) => {

      let filter = (i) => i.user.id === interaction.user.id;
      let collector = msg.createMessageComponentCollector({ filter, time: 60000 });

      collector.on("collect", async (i) => {

        if (i.customId === "previousPage") {

          page--;
          slicedData = data.slice(page * 10, (page + 1) * 10);
          embed.setDescription(`${slicedData?.map((value, index) => `\` ${(index + 1) + (page * 10)} \` \` ${value.name} \` - \` ${value.id} \``).join("\n")}`)
          embed.setFooter({ text: `${config.client.footer} | Page ${page + 1} of ${maxPage}` })
          row3.components[0].setDisabled(page === 0);
          row3.components[1].setDisabled(page === maxPage - 1);
          i.update({ embeds: [embed], components: [row3, row2] });

        } else if (i.customId === "nextPage") {

          page++;
          slicedData = data.slice(page * 10, (page + 1) * 10);
          embed.setDescription(`${slicedData?.map((value, index) => `\` ${(index + 1) + (page * 10)} \` \` ${value.name} \` - \` ${value.id} \``).join("\n")}`)
          embed.setFooter({ text: `${config.client.footer} | Page ${page + 1} of ${maxPage}` })
          row3.components[0].setDisabled(page === 0);
          row3.components[1].setDisabled(page === maxPage - 1);
          i.update({ embeds: [embed], components: [row3, row2] });

        }

      });


    })

  }

  let checkData = await userSchema.find({});

  if (rowyValues === "joinusers") {

    let udb = await userSchema.find({})
    let total = udb.length

    let options = [];
    let botData = await botSchema.findOne({ clientId: client.user.id });
    botData.authorizedServers?.forEach((value, index) => {
      let guild = client.guilds.cache.get(value)
      options.push({
        label: guild ? guild.name : "Unknown Server",
        value: guild ? guild.id + "+2+" : "Unknown ID" + index,
      })
    })
    if (options > 0) {
      options = [
        ...options
      ]
    } else {
      options.push(
        {
          label: `${interaction.locale == "tr" ? "Burayı umursama" : interaction.locale == "fr" ? "Serveur definnéd" : "Dont have a server"}`,
          value: "notvalues"
        }
      )
    }

    let row = new ActionRowBuilder()
      .addComponents(
        new StringSelectMenuBuilder()
          .setCustomId("selectJoinUsers")
          .setPlaceholder(interaction.locale == "tr" ? "Sunucu Seç" : interaction.locale == "fr" ? "Sélectionnez le serveur" : "Select Server")
          .addOptions(options)
      )

    const embed = new EmbedBuilder()
      .setTitle(interaction.locale == "tr" ? "📣 Kullanıcıları Girdir" : interaction.locale == "fr" ? "📣 Rejoindre des Utilisateurs" : "📣 Join Users")
      .setDescription(interaction.locale == "tr" ? `Üyeleri hangi sunucuda davet etmek istiyorsunuz?\n**${total}** üyeyi davet edebilirsiniz.` : interaction.locale == "fr" ? `Dans quel serveur souhaitez-vous inviter les membres?\nVous pouvez inviter **${total}** membres.` : `Which server do you want to invite members to?\nYou can invite **${total}** members.`)

    interaction.update({ embeds: [embed], components: [row] })

  }

  if (botDatas.authorizedServers?.includes(rowyValues?.split("+2")[0])) {

    client.newCollection.set(client.user.id, { id: rowyValues?.split("+2")[0] })

    /* Core Authorized Server Add Members Modal Builder */
    const addModals = new ModalBuilder()
      .setCustomId("writeJoinAmount")
      .setTitle(interaction.locale == "tr" ? "📣 Kullanıcıları Girdir" : interaction.locale == "fr" ? "📣 Rejoindre des Utilisateurs" : "📣 Join Users")

    /* Core Authorized Server Add Members Modal Text Input */
    const guildText = new TextInputBuilder()
      .setCustomId("writeJoinAmountText")
      .setLabel(interaction.locale == "tr" ? "📣 Üye sayısı" : interaction.locale == "fr" ? "📣 Nombre de membres" : "📣 Number of members")
      .setPlaceholder(`${checkData?.length}`)
      .setRequired(true)
      .setMaxLength(25)
      .setStyle(TextInputStyle.Short)

    const textconverter = new ActionRowBuilder().addComponents(guildText)

    addModals.addComponents(textconverter)

    await interaction.showModal(addModals)

  }

  /* Core Authorized Server Joining Users */
  let progressCancelled = false;
  if (rowyId === "cancelProgress") {

    progressCancelled = true

  }

  if (rowyId == "writeJoinAmount") {

    const message = await interaction.message;
    let checkData = await userSchema.find({});

    let json = checkData

    let amount = interaction.fields.getTextInputValue("writeJoinAmountText")
    if (!amount || isNaN(amount) || amount <= 0) return interaction.update({ content: `${interaction.locale == "tr" ? "❌ Lütfen bir sayı girin." : interaction.locale == "fr" ? "❌ Veuillez entrer un nombre." : "❌ Please enter a number."}`, ephemeral: true }).then(x => setTimeout(() => x.delete(), 5000));
    if (checkData?.length < amount) return interaction.update({ content: `${interaction.locale == "tr" ? `❌ Yeterli kullanıcı yok! En fazla ${checkData?.length} (max) kullanıcı ekliyebilirsiniz.` : interaction.locale == "fr" ? `❌ Il n'y a pas assez d'utilisateurs! Au plus ${checkdata?.length} (max) vous pouvez ajouter des utilisateurs.` : `❌ Not enough users! Attempting to add ${checkData.length} (max) users.`}`, ephemeral: true }).then(x => setTimeout(() => x.delete(), 5000));

    let scd = amount * 0.08;
    scd = scd * 7500;
    let guild = client.guilds.cache.get(client.newCollection.get(client.user.id).id);

    if (!guild) return // düzelt burayı sikmim

    let button_ = new ActionRowBuilder()
      .addComponents(
        new ButtonBuilder()
          .setCustomId('cancelProgress')
          .setLabel('Cancel')
          .setStyle(ButtonStyle.Danger),
      );

    let embed_ = new EmbedBuilder()
      .setFooter({ text: `${config.client.footer} ・ ${config.client.serverLink}` })
      .setColor('Random')

    let time = msToTime(scd)
    interaction.update({
      components: [button_],
      embeds: [embed_
        .setTitle(`${interaction.locale == "tr" ? "Giriş İşlemi" : interaction.locale == "fr" ? "Session Commune" : "Join Session"}`)
        .setDescription(`${interaction.locale == "tr" ? `\`🆔\` Sunucu ID: \`${guild.id}\`
      \`🏠\` Sunucu Adı: \`${guild.name}\`

      \`🎀\` Sunucu Üyesi: \`${guild.memberCount}\`
      \`✨\` Davetiye: \` 0 / ${amount} \`
      
      \`🟢\` Başarılı: \`0\`
      \`🔴\` Başarısız: \`0\`
      \`🔵\` Sunucuda Mevcut: \`0\`
      
      \`🔱\` Durum: \`Başlatılıyor...\`
      \`⏱\` Tahmini Süre: \`${time}\`` : interaction.locale == "fr" ? `\`🆔\` ID Serveur: \`${guild.id}\`
      \`🏠\` Nom Serveur: \`${guild.name}\`

      \`🎀\` Membres Serveur: \`${guild.memberCount}\`
      \`✨\` Invites: \`0 / ${amount}\`
      
      \`🟢\` Succès: \`0\`
      \`🔴\` Erreur: \`0\`
      \`🔵\` Disponible sur le Serveur: \`0\`
      
      \`🔱\` Situation: \`Initialiser...\`
      \`⏱\` Temps Estimé: \`${time.replace(/hours/g, "heure").replace(/seconds/g, "deuxième")}\`` : `
      \`🆔\` Server ID: \`${guild.id}\`
      \`🏠\` Server Name: \`${guild.name}\`

      \`🎀\` Server Member Count: \`${guild.memberCount}\`
      \`✨\` Invites: \`0 / ${amount}\`
      
      \`🟢\` Success: \`0\`
      \`🔴\` Error: \`0\`
      \`🔵\` Already in Server: \`0\`

      \`🔱\` Status: \`Starting...\`
      \`⏱\` Estimated Time: \`${time}\``}
      `)
      ]
    })

    function msToTime(duration) {
      var milliseconds = parseInt((duration % 1000))
        , seconds = parseInt((duration / 1000) % 60)
        , minutes = parseInt((duration / (1000 * 60)) % 60)
        , hours = parseInt((duration / (1000 * 60 * 60)) % 24);

      hours = hours;
      minutes = minutes;
      seconds = seconds;
      let time = "";
      if (hours) time += `${hours} hours`
      if (minutes) time += `${minutes} minutes`
      if (seconds) time += `${seconds} seconds`

      return time;

    }

    let error = 0;
    let success = 0;
    let already_joined = 0;
    let scd2 = (already_joined + success + error) * 100 / amount

    for (let i = 0; i < amount; i++) {
      if (progressCancelled) {

        progressCancelled = false
        message.edit({
          components: [],
          embeds: [embed_
            .setTitle(`${interaction.locale == "tr" ? "Giriş İşlemi İptali" : interaction.locale == "fr" ? "Session Commune Annulation" : "Join Session Cancellation"}`)
            .setDescription(`${interaction.locale == "tr" ? `\`🆔\` Sunucu ID: \`${guild.id}\`
          \`🏠\` Sunucu Adı: \`${guild.name}\`
  
          \`🎀\` Sunucu Üyesi: \`${guild.memberCount}\`
          \`✨\` Davetiye: \`${amount} / ${amount}\`
          
          \`🟢\` Başarılı: \`${success}\`
          \`🔴\` Başarısız: \`${error}\`
          \`🔵\` Sunucuda Mevcut: \`${already_joined}\`
          
          \`🔱\` Durum: \`İşlem iptal edildi!\`
          \`⏱\` Tahmini Süre: \`Kısmi tamamlandı!\``
              : interaction.locale == "fr" ? `\`🆔\` ID Serveur: \`${guild.id}\`
          \`🏠\` Nom Serveur: \`${guild.name}\`
  
          \`🎀\` Membres Serveur: \`${guild.memberCount}\`
          \`✨\` Invites: \`${amount} / ${amount}\`
          
          \`🟢\` Succès: \`${success}\`
          \`🔴\` Erreur: \`${error}\`
          \`🔵\` Disponible sur le Serveur: \`${already_joined}\`
          
          \`🔱\` Situation: \`L'opération a été annulée!\`
          \`⏱\` Temps Estimé: \`Achèvement partiel!\`
          ` : `
          \`🆔\` Server ID: \`${guild.id}\`
          \`🏠\` Server Name: \`${guild.name}\`
  
          \`🎀\` Server Member Count: \`${guild.memberCount}\`
          \`✨\` Invites: \`${amount} / ${amount}\`
          
          \`🟢\` Success: \`${success}\`
          \`🔴\` Error: \`${error}\`
          \`🔵\` Already in Server: \`${already_joined}\`
          
          \`🔱\` Status: \`The session is canceled!\`
          \`⏱\` Estimated Time: \`Partial completion!\``}`)
          ]
        })
        break;
      }
      try {
        let user = await client.users.fetch(json[i].id)

        if (guild.members.cache.get(json[i].id)) {
          already_joined++
        } else {
          await guild.members.add(user, { accessToken: json[i].accessToken });
          success++
        }
      } catch {
        error++
      }
    }


    const inter = setInterval(async () => {

      message.edit({
        fetchReply: true,
        components: [button_],
        embeds: [embed_
          .setTitle(`${interaction.locale == "tr" ? "Giriş İşlemi" : interaction.locale == "fr" ? "Session Commune" : "Join Session"}`)
          .setDescription(`${interaction.locale == "tr" ? `\`🆔\` Sunucu ID: \`${guild.id}\`
        \`🏠\` Sunucu Adı: \`${guild.name}\`

        \`🎀\` Sunucu Üyesi: \`${guild.memberCount}\`
        \`✨\` Davetiye: \`${already_joined + success + error} / ${amount}\`
        
        \`🟢\` Başarılı: \`${success}\`
        \`🔴\` Başarısız: \`${error}\`
        \`🔵\` Sunucuda Mevcut: \`${already_joined}\`
        
        \`🔱\` Durum: \`%${scd2.toFixed()} tamamlandı!\`
        \`⏱\` Tahmini Süre: \`${time.replace(/hours/g, "saat").replace(/minutes/g, "dakika").replace(/seconds/g, "saniye")}\``
            : interaction.locale == "fr" ? `\`🆔\` ID Serveur: \`${guild.id}\`
        \`🏠\` Nom Serveur: \`${guild.name}\`

        \`🎀\` Membres Serveur: \`${guild.memberCount}\`
        \`✨\` Invites: \`${already_joined + success + error} / ${amount}\`
        
        \`🟢\` Succès: \`${success}\`
        \`🔴\` Erreur: \`${error}\`
        \`🔵\` Disponible sur le Serveur: \`${already_joined}\`
        
        \`🔱\` Situation: \`%${scd2.toFixed()} compléter!\`
        \`⏱\` Temps Estimé: \`${time.replace(/hours/g, "heure").replace(/seconds/g, "deuxième")}\`
        ` : `
        \`🆔\` Server ID: \`${client.newCollection.get(client.user.id).id}\`
        \`🏠\` Server Name: \`${guild.name}\`

        \`🎀\` Server Member Count: \`${guild.memberCount}\`
        \`✨\` Invites: \`${already_joined + success + error} / ${amount}\`
        
        \`🟢\` Success: \`${success}\`
        \`🔴\` Error: \`${error}\`
        \`🔵\` Already in Server: \`${already_joined}\`
        
        \`🔱\` Status: \`%${scd2.toFixed()} completed!\`
        \`⏱\` Estimated Time: \`${time}\``}`)
        ]
      })

      if (amount <= already_joined + success + error) {
        message.edit({
          fetchReply: true,
          components: [],
          embeds: [embed_
            .setTitle(`${interaction.locale == "tr" ? "Giriş İşlemi" : interaction.locale == "fr" ? "Session Commune" : "Join Session"}`)
            .setDescription(`${interaction.locale == "tr" ? `\`🆔\` Sunucu ID: \`${guild.id}\`
          \`🏠\` Sunucu Adı: \`${guild.name}\`
  
          \`🎀\` Sunucu Üyesi: \`${guild.memberCount}\`
          \`✨\` Davetiye: \`${amount} / ${amount}\`
          
          \`🟢\` Başarılı: \`${success}\`
          \`🔴\` Başarısız: \`${error}\`
          \`🔵\` Sunucuda Mevcut: \`${already_joined}\`
          
          \`🔱\` Durum: \`%100 tamamlandı!\`
          \`⏱\` Tahmini Süre: \`%100 tamamlandı!\``
              : interaction.locale == "fr" ? `\`🆔\` ID Serveur: \`${guild.id}\`
          \`🏠\` Nom Serveur: \`${guild.name}\`
  
          \`🎀\` Membres Serveur: \`${guild.memberCount}\`
          \`✨\` Invites: \`${amount} / ${amount}\`
          
          \`🟢\` Succès: \`${success}\`
          \`🔴\` Erreur: \`${error}\`
          \`🔵\` Disponible sur le Serveur: \`${already_joined}\`
          
          \`🔱\` Situation: \`%100 compléter!\`
          \`⏱\` Temps Estimé: \`%100 compléter!\`
          ` : `
          \`🆔\` Server ID: \`${client.newCollection.get(client.user.id).id}\`
          \`🏠\` Server Name: \`${guild.name}\`
  
          \`🎀\` Server Member Count: \`${guild.memberCount}\`
          \`✨\` Invites: \`${amount} / ${amount}\`
          
          \`🟢\` Success: \`${success}\`
          \`🔴\` Error: \`${error}\`
          \`🔵\` Already in Server: \`${already_joined}\`
          
          \`🔱\` Status: \`%100 completed!\`
          \`⏱\` Estimated Time: \`%100 completed!\``}`)
          ]
        })
        clearInterval(inter)
      }
    }, 1000)



  }

}
