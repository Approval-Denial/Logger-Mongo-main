const { Schema, model } = require('mongoose');

const LoggerLog = new Schema({
    _id: Schema.Types.ObjectId,
    ServerID: { type: String, default: '' },
    channelCreateLog:  { type: String , default: '' },
    roleCreateLog:  { type: String , default: '' },
    roleupdatelog:{type: String, default:''}

});

module.exports = model('loggerlog', LoggerLog);