const { Client, Collection,MessageEmbed } = require('discord.js')
const fs = require('fs');
const { set } = require('lodash');
const mongoose = require("mongoose")
const sett = require("./sett.json");

class Approval extends Client {
    constructor(options) {
        super(options);
        this.commands = new Collection()
        this.aliases = new Collection()
        this.on("ready", () => { console.log(`${client.user.username} bot aktif.`) })
        
    }
    
    async Login(){
        client.login(sett.Bot.Token).catch(x=> console.log("[Login Err] Token'e bağlanılamadı."))
        client.on("disconnect", () =>console.log("Bot is disconnecting..."))
.on("reconnecting", () => console.log("Bot reconnecting...", "log"))
.on("error", e => console.log(e))
.on("warn", info => console.log(info));
    }
    async Mongo() {
        mongoose.connect(sett.Bot.MongoURL, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useFindAndModify: false
          })
     }
    async fetchCommands() {
        let dirs = fs.readdirSync("./APP_Commands", { encoding: "utf8" });
        dirs.forEach(dir => {
            let files = fs.readdirSync(`./APP_Commands/${dir}`, { encoding: "utf8" }).filter(file => file.endsWith(".js"));
            files.forEach(file => {
                let reference = require(`./APP_Commands/${dir}/${file}`);
                if(reference.onLoad != undefined && typeof reference.onLoad == "function") reference.onLoad(this);
                if(!reference.active) return;
                this.commands.set(reference.name, reference);
                if (reference.aliases) reference.aliases.forEach(alias => this.aliases.set(alias, reference));
            });
        });
    }
    async fetchEvents() {
        let dirs = fs.readdirSync("./APP_Events", { encoding: "utf8" });
        dirs.forEach(dir => {
            let files = fs.readdirSync(`./APP_Events/${dir}`, { encoding: "utf8" }).filter(file => file.endsWith(".js"));
            files.forEach(file => {
                let reference = require(`./APP_Events/${dir}/${file}`);
                if(!reference.Options.active) return;
                this.on(reference.Options.name, reference);
                console.log(reference.Options.name+ " Eventi Aktif !")
            });
        });
    }
 
}

module.exports = { Approval }