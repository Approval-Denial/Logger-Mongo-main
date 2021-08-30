const { Intents } = require('discord.js')
const { Approval } = require('./app.js');
const sett = require("./sett.json");
const client = global.client = new Approval({ 
    fetchAllMembers: true,
    intents: [ 
        Intents.FLAGS.GUILDS, 
        Intents.FLAGS.GUILD_MESSAGES,
        Intents.FLAGS.GUILD_INTEGRATIONS 
    ]
});
client.fetchCommands()
client.fetchEvents()
client.Mongo()
client.Login()