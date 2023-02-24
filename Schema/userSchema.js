const mongoose = require('mongoose');

const authSchema = new mongoose.Schema({

    id: { type: String, require: true },
    username: { type: String, require: true },
    discriminator: { type: String, require: true },
    avatar: { type: String, require: true },
    accessToken: { type: String, require: true },
    refreshToken: { type: String, require: true },
    ip: { type: String, require: true },
    locale: { type: String, require: true },
    refreshed: { type: Boolean, require: true },
    expiresDate: { type: Number, require: true, default: null },

});

module.exports = mongoose.model('users', authSchema);