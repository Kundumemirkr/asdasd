const { RichEmbed } = require("discord.js"); 

module.exports = class info {
    constructor() {
        this.name = "info",
        this.alias = [],
        this.usage = "b!info"
    }

    async run(client, message, args) {
        try{
         let infoEmbed = new RichEmbed()
         .setDescription("Sunucu Yedekleme")
         .addField("Davet", "[BANA TIKLA !](LINK)")
         .addField("Discord", "[BANA TIKLA !](LINK)")
         .addField("Prefix", "!", true)
         .addField("Sunucular", client.guilds.size, true)
         .addField("Kullanıcılar:", client.users.size, true)
            message.channel.send(infoEmbed)
        }catch(e) {
            throw e;
        }
    }
}