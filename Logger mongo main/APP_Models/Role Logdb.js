const { Schema, model } = require('mongoose');

const Denetimlog = new Schema({
    guildID: String,
    kullanıcıID: String,
    roleCreateLogDB:  { type: Array , default: [] }
});

module.exports = model('roldenetimlog', Denetimlog);