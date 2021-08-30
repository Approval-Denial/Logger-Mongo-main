const mongoose = require("mongoose")
const logDB = require("../../APP_Models/Data_log.js")
module.exports = {
    
    name: "eval",
    aliases: [],
    description: "Approval Logger MongoDb https://github.com/Approval-Denial",
    permissions: ["OWNER"],
    category: [],
    active: true,

    /**
    * @param {Client} client 
    */
   
    onLoad: function (client) {

    },

    /**
    * @param {Client} client 
    * @param {Message} message 
    * @param {Array<String>} args 
    */

    onRequest: async function (client, message, args) {
      const sett = require("../../sett.json")
              if (!sett.Bot.Own.includes(message.author.id)) return;
              let DataLog = await logDB.findOne({ ServerID: message.guild.id });
      if (!args[0]) return message.channel.send(`not content.`);
    let code = args.join(' ');

    function clean(text) {
      if (typeof text !== 'string') text = require('util').inspect(text, { depth: 0 })
      text = text.replace(/`/g, '`' + String.fromCharCode(8203)).replace(/@/g, '@' + String.fromCharCode(8203))
      return text;
    };
    try { 
      var evaled = clean(await eval(code));
      if(evaled.match(new RegExp(`${client.token}`, 'g')));
      message.channel.send(`\`\`\`js
${evaled}\`\`\``);
    } catch(err) { message.channel.send(`\`\`\`js
${err}\`\`\``) };
    }
};