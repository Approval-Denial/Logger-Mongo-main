const { MessageEmbed } = require("discord.js");
const sett = require("../../sett.json")
const Createlog = require("../../APP_Models/Data_log.js")
const DbLog = require("../../APP_Models/Role Logdb.js")
const Vonage = require('@vonage/server-sdk')
const dayjs = require("dayjs");
require('dayjs/locale/tr');
dayjs.locale('tr');
let utc = require("dayjs/plugin/utc");
let timezone = require("dayjs/plugin/timezone");
let relativeTime = require("dayjs/plugin/relativeTime")
dayjs.extend(timezone);
dayjs.extend(utc);
dayjs.extend(relativeTime);

module.exports = async(role) => {
    const DataLog = await Createlog.findOne({ ServerID: role.guild.id });
    const kanaldb = await DbLog.findOne({ guildID: role.guild.id });
    var entry = await role.guild.fetchAuditLogs({
		limit: 1,
		type: 'ROLE_DELETE',
	}).then(audit => audit.entries.first());
    var member = entry.executor;
    if(!DataLog || !DataLog.roleCreateLog) return;
    let embed = new MessageEmbed().setFooter("Developed By Approval",role.guild.iconURL({dynamic:true})).setAuthor(role.guild.name, role.guild.iconURL({dynamic: true})).setColor("RANDOM")
    role.guild.channels.cache.get(DataLog.roleCreateLog).send({embeds: [embed.setDescription(`**__Rol Silindi__**`).addField("Silen kişi",`Adı: ${member}\n ID: \`${member.id}\``,true).addField("Rol Bilgisi",`Rol Adı: ${role}\nID: \`${role.id}\``,true).addField("Tarih",`${dayjs(new Date()).tz("Europe/Istanbul").format("DD MMMM YYYY HH:mm")}`)]})
   //#region  Sms Api
  if(sett.Bot.SmsSystem === true)
{  const APP_SmsApi = new Vonage({ 
  apiKey: sett.Vonage.apiKey, 
  apiSecret:  sett.Vonage.apiSecret
}); 
const from = "Logger"
const to = sett.Vonage.youPhoneNumber
    const text = `${member.id} İD'li kişi ${role.id} İD'li rolu sildi. \n Tarih : ${dayjs(new Date()).tz("Europe/Istanbul").format("DD MMMM YYYY HH:mm")}`
    APP_SmsApi.message.sendSms(from, to, text, (err, responseData) => {
    if (err) { console.log(err);
    } else {
    if (responseData.messages[0]['status'] === "0") { console.log(" Mesaj başarıyla gönderildi.");
    } else {
    console.log(` Mesaj gönderilirken bir hata ile karşılaşıldı: ${responseData.messages[0]['error-text']}`);
    }}
  })}
  //#endregion
if(!kanaldb) {
  let newData = new DbLog({
    guildID: role.guild.id,
    kullanıcıID: member.id,
    roleCreateLogDB: { 
        roleID: role.id,
      Time: Date.now(),
      executor: member.id,
      type: "🚫" }
  }).save(); 
}else{
  kanaldb.roleCreateLogDB.push({
    roleID: role.id,
  Time: Date.now(),
  executor: member.id,
  type: "🚫"
})
kanaldb.save();
}
}

module.exports.Options = {
        active: true,
        name: 'roleDelete',
}

