const {MessageEmbed} = require("discord.js")
const mongoose = require("mongoose")
const sett = require("../../sett.json")
const logDB = require("../../APP_Models/Data_log.js")
const denetimlogDB = require("../../APP_Models/Logdb.js")
const RoldenetimlogDB = require("../../APP_Models/Role Logdb.js")
const dayjs = require("dayjs");
require('dayjs/locale/tr');
dayjs.locale('tr');
let utc = require("dayjs/plugin/utc");
let timezone = require("dayjs/plugin/timezone");
let relativeTime = require("dayjs/plugin/relativeTime")
dayjs.extend(timezone);
dayjs.extend(utc);
dayjs.extend(relativeTime);
module.exports = {
    
    name: "log",
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
       
        if (!sett.Bot.Own.includes(message.author.id)) return;
     //   const DataLog = await Setuplog.findOne({ ServerID: message.guild.id });
     const member = message.mentions.members.first() ||message.author
     if(args[0] == "channel"){
      const approval = await denetimlogDB.findOne({ guildID: message.guild.id, kullanıcıID: member.id })
      let listening = approval.channelCreateLogDB.map((v, i) => ` ${v.type}   **Kanal**: ${message.guild.channels.cache.get(v.ChannelID) ? `<#${v.ChannelID}>`: `${v.ChannelID}` /*message.guild.channels.cache.get(v.ChannelID)*/}   **Yetkili:** ${message.guild.members.cache.get(v.executor)}   **Tarih:** \`${dayjs(v.Time).tz("Europe/Istanbul").format("DD MMMM YYYY HH:mm")}\` ` || "\`Veri Yok\`")
      let embed = new MessageEmbed().setFooter("Developed By Approval",message.guild.iconURL({dynamic:true})).setAuthor(message.guild.name, message.guild.iconURL({dynamic: true})).setColor("RANDOM")
      let page = 1;
      const msg = await message.channel.send({embeds: [embed.setDescription(`${listening.slice(page == 1 ? 0 : page * 10 - 10, page * 10).join("\n")}`)]})
      if (approval.channelCreateLogDB.length < 11) return; 
      await msg.react("◀");
      await msg.react("🚫")
      await msg.react("▶");
      const Collector = msg.createReactionCollector((react, user) => ["◀","🚫", "▶"].some(e => e == react.emoji.name) && user.id == message.member.id, { time: 200000 });
      Collector.on("collect", async (react) => {
        await react.users.remove(message.author.id).catch(() => undefined);
        if (react.emoji.name == "▶") {
            if (listening.slice((page + 1) * 10 - 10, (page + 1) * 10).length <= 0) return;
            page += 1;
            let newList = listening.slice(page == 1 ? 0 : page * 10 - 10, page * 10).join("\n");
            msg.edit({embeds: [embed.setDescription(newList)]});
        }
        if (react.emoji.name == "◀") {
            if (listening.slice((page - 1) * 10 - 10, (page - 1) * 10).length <= 0) return;
            page -= 1;
            let newList = listening.slice(page == 1 ? 0 : page * 10 - 10, page * 10).join("\n");
            msg.edit({embeds: [embed.setDescription(newList)]});
        }
    });
    Collector.on("end", () => Collector.stop())

     }
     if(args[0] == "rol"){
        const approval = await RoldenetimlogDB.findOne({ guildID: message.guild.id, kullanıcıID: member.id })
        let listening = approval.roleCreateLogDB.map((v, i) => ` ${v.type} ${message.guild.roles.cache.get(v.roleID) ? ` **Rol**: <@&${v.roleID}>`: ` **RolID**:${v.roleID} \`(Sonradan Silinmiş)\`` /*message.guild.channels.cache.get(v.ChannelID)*/}   **Yetkili:** ${message.guild.members.cache.get(v.executor)}   **Tarih:** \`${dayjs(v.Time).tz("Europe/Istanbul").format("DD MMMM YYYY HH:mm")}\` ` || "\`Veri Yok\`")
        let embed = new MessageEmbed().setFooter("Developed By Approval",message.guild.iconURL({dynamic:true})).setAuthor(message.guild.name, message.guild.iconURL({dynamic: true})).setColor("RANDOM")
        let page = 1;
        const msg = await message.channel.send({embeds: [embed.setDescription(`${listening.slice(page == 1 ? 0 : page * 10 - 10, page * 10).join("\n")}`)]})
        if (approval.roleCreateLogDB.length < 11) return; 
        await msg.react("◀");
        await msg.react("🚫")
        await msg.react("▶");
        const Collector = msg.createReactionCollector((react, user) => ["◀","🚫", "▶"].some(e => e == react.emoji.name) && user.id == message.member.id, { time: 200000 });
        Collector.on("collect", async (react) => {
          await react.users.remove(message.author.id).catch(() => undefined);
          if (react.emoji.name == "▶") {
              if (listening.slice((page + 1) * 10 - 10, (page + 1) * 10).length <= 0) return;
              page += 1;
              let newList = listening.slice(page == 1 ? 0 : page * 10 - 10, page * 10).join("\n");
              msg.edit({embeds: [embed.setDescription(newList)]});
          }
          if (react.emoji.name == "◀") {
              if (listening.slice((page - 1) * 10 - 10, (page - 1) * 10).length <= 0) return;
              page -= 1;
              let newList = listening.slice(page == 1 ? 0 : page * 10 - 10, page * 10).join("\n");
              msg.edit({embeds: [embed.setDescription(newList)]});
          }
      });
      Collector.on("end", () => Collector.stop())
  
       }
    }   
};
