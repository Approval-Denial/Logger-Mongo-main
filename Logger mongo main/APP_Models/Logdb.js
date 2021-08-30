const { Schema, model } = require('mongoose');

const Denetimlog = new Schema({
    guildID: String,
    kullanıcıID: String,
    channelCreateLogDB:  { type: Array , default: [] },
    roleCreateLogDB:  { type: Array , default: [] }
});

module.exports = model('denetimlog', Denetimlog);