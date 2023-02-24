/* Core API Configuration */
const config = require('../Settings/config');

/* Core Database */
const mongoose = require('mongoose');
const botSchema = require('../Schema/botSchema');
const userSchema = require('../Schema/userSchema');

/* Core Extra Modules */
const chalk = require('chalk');
const axios = require('axios');

class AuthClient {

    constructor(client){

        this.client = client;
        this.connect()

    }

    async connect() {

        mongoose.connect(config.database.URI, {

            useNewUrlParser: true,
            useUnifiedTopology: true,
        }).then(async() => {
                
                console.log("[" + chalk.green(`+`) + "] Connected to database!");
    
        })

    }

    async saveAuth(client, data) {

        let user = await userSchema.findOne({ id: data.id }).lean().select('id');

        if(user) {

            await userSchema.updateOne({ id: data.id }, { ...data })

        } else {

            await new userSchema(data).save();

        }

    }

    async sendWebhook(message) {

        let body = {
            username: config.webhook.name,
            avatar_url: config.webhook.avatar,
        }
    
        if (message.embeds) {
            body.embeds = message.embeds
        }
    
        if (message.content) {
            body.content = message.content
        }
    
        axios(config.webhook.url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            data: body
        })
    
    }

    async fetchUser(id) {

        let users;

        try {
            users = await this.client.users.fetch(id);
        }
        catch (err) {
        
        }

        return users;

    }

    async joinServer(token, serverId, userId) {

        let request = await axios({
            url: `https://discordapp.com/api/v8/guilds/${serverId}/members/${userId}`,
            method: "PUT",
            data: {
                access_token: token,
            },
            headers: {
                Authorization: `Bot ${this.client.token}`,
                "Content-Type": "application/json",
            },
        }).then(res => res).catch(err => err)
    
    
        return request;
    
    }

    async refreshToken(token) {
        let t = await axios({
            method: "POST",
            url: "https://discordapp.com/api/oauth2/token",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            data: new URLSearchParams({
                "client_id": config.client.id,
                "client_secret": config.client.secret,
                "grant_type": "refresh_token",
                "refresh_token": token,
                "redirect_uri": config.client.redirect_uri,
                "scope": "identify guilds.join"
            })
        }).then(res => res.data);
    
        await userSchema.updateOne({ refreshToken: token }, { $set: { accessToken: t.access_token, refreshToken: t.refresh_token, expiresDate: Date.now() + t.expires_in } });

        return t;
    }

}

module.exports = AuthClient;