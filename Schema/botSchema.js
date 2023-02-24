const mongoose = require('mongoose');

const botSchema = new mongoose.Schema({

    clientId: String,

    whitelist: { type: Array, default: [] },

    autoJoin: { type: Array, default: []},
    autoRoles : { type: Array, default: [] },
    autoMessage: { type: Array, default: [] },

    authorizedServers: { type: Array, default: [] },

});

module.exports = mongoose.model('bots', botSchema);