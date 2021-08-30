const { Message, MessageEmbed } = require("discord.js");
const waitCommand = new Set();
const sett = require("../../sett.json")
 /**
 * @param {Message} message 
 */


module.exports = (message) => {
    if (message.author.bot || !sett.Bot.Prefix.some(x => message.content.startsWith(x)) || !message.channel || message.channel.type == "dm") return;
    let args = message.content.substring(sett.Bot.Prefix.some(x => x.length)).split(" ")
    let commandOn = message.client.commands.get(args[0]) || message.client.aliases.get(args[0]) 
    args = args.splice(1);
    let uye = message.guild.members.cache.get(message.member.id) || message.author;
    if(commandOn) {

        if(waitCommand.has(uye.id)) return message.channel.send("**Bir kaç saniye sonra tekrar dene.**");
        if(!sett.Bot.Own.some(id => uye.id == id) && !uye.permissions.has('ADMINISTRATOR')) waitCommand.add(uye.id);
        if(commandOn.permissions && commandOn.permissions.length) {
            if(commandOn.permissions.includes("OWNER")) {
                if(!sett.Bot.Own.some(id => uye.id == id)) return message.channel.send("**`Approval` gibi değilsen (onun gibi olunmaz zaten o bitanedir.) kullanamazsın. **");
            }
            if(commandOn.permissions.includes("o-c")) {
                if(!sett.Bot.Own.some(id => uye.id == id)) return message.channel.send(`**bu komudu kullanmak için ${commandOn.permissions.map(x => message.guild.roles.cache.get(x)).join(' ')} rollerine sahip olmalısın.**`);
            }
        };
 commandOn.onRequest(message.client, message, args) 

          setTimeout(() => { waitCommand.delete(uye.id) }, 2000);
        
    }
}

module.exports.Options = {
        active: true,
        name: 'messageCreate',
}