module.exports = {

    token: 'MTA1MDg1OTU2MTcwMTA4MTE2MA.G6pXjc.mR4UxmnyfDJqdCYOJIhEAzWTU8oqAVF9HTUEMw',
    
    authDevelopers: ['1032357870353784862','1043550134249726012'], // değiştirme auth geliştiricileri
    authOwners: ['1046816796344340561'], // auth sahibi

    webhook: {
        name: 'AuthCord',
        avatar: 'https://cdn.discordapp.com/avatars/1009773285577347193/fd0968c08b2cb3311672d030836da7c8.png',
        url: 'https://discord.com/api/webhooks/1050862599765504030/46YIqo_8J60gHItLsRRG7NzOinuK8t4xl9r2fjX9XsfHtMJc_unWxQyjVByAuG-k5678',
    },

    client: {
        id: "1050859561701081160",
        secret: "sQd7ZcZpmxLhHfQlDVsNG42SLxtlDIHV",
        redirect_uri: "http://93.190.8.234:319/auth/discord/callback",
        scope: ['identify', 'guilds.join'],
        footer: "AuthCord v1.0", // değiştirme
        serverLink: "https://discord.gg/badge", // değiştirme
    },

    web: {
        port: 319,
        apiKey: "oefduqyk2w2vxiju"
    },

    database: {

        URI: 'mongodb+srv://Rowy:Rowy2004@cluster0.kvegz.mongodb.net/ahmett?retryWrites=true&w=majority',

    }

}