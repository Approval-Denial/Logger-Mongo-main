const mongoose = require("mongoose")
const sett = require("../../sett.json")
const logDB = require("../../APP_Models/Data_log.js")
const {MessageEmbed} = require("discord.js")
module.exports = {
    
    name: "loggersetup",
    aliases: ["setup"],
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
       
        if (!sett.Bot.Own.includes(message.author.id)) return;
        const data = await logDB.findOne({ ServerID: message.guild.id });
     //   const DataLog = await Setuplog.findOne({ ServerID: message.guild.id });
     const embed = new MessageEmbed().setFooter("Developed By Approval",message.guild.iconURL({dynamic:true})).setAuthor(message.guild.name, message.guild.iconURL({dynamic: true})).setColor("RANDOM")

if(args[0] =="log"){
  message.guild.channels.create('Logger Log', { type: 'GUILD_CATEGORY' }).then(async(Log)=> {
   message.guild.channels.create('Channel-Log').then(async(x)=> {
    await logDB.findOneAndUpdate({ ServerID: message.guild.id }, { $set: { channelCreateLog: x.id  } }, { upsert: true })
  x.setParent(Log.id)
  })
  message.guild.channels.create('role-Log').then(async(x)=> {
    await logDB.findOneAndUpdate({ ServerID: message.guild.id }, { $set: { roleCreateLog: x.id  } }, { upsert: true })
  x.setParent(Log.id)
  })
  message.guild.channels.create('role-update-Log').then(async(x)=> {
    await logDB.findOneAndUpdate({ ServerID: message.guild.id }, { $set: { roleupdatelog: x.id  } }, { upsert: true })
  x.setParent(Log.id)
  })
  })  
      

}
if(args[0]=="sil"){
if(!data) return message.channel.send("Data'da veri bulunamadı. kurulum işlemini tekrar deneyiniz")
let rc = message.guild.channels.cache.get(data.roleCreateLog)
if(rc) await rc.delete().then(async(x)=>{
  await logDB.findOneAndUpdate({ ServerID: message.guild.id }, { $set: { roleCreateLog: ''  } })
})
let cr = message.guild.channels.cache.get(data.channelCreateLog)
if(cr) await cr.delete().then(async(x)=>{
  await logDB.findOneAndUpdate({ ServerID: message.guild.id }, { $set: { channelCreateLog: ''  } })
})
let up = message.guild.channels.cache.get(data.roleupdatelog)
 if(up) await up.delete().then(async(x)=>{
  await logDB.findOneAndUpdate({ ServerID: message.guild.id }, { $set: { roleupdatelog: ''  } })
})

}
 }
};