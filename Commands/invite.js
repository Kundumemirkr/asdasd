const { RichEmbed } = require("discord.js");
module.exports = class invite {
    constructor() {
        this.name = "invite",
        this.alias = [],
        this.usage = "!invite"
    }

    async run(client, message, args) {
        try{
            let info = client.emojis.get("emojiid") || "ℹ️"
            client.generateInvite(['ADMINISTRATOR']).then(link => {
            let inviteEmbed = new RichEmbed()
            .setTitle(`${info} Info`)
            .setDescription(`**İnvite Xenon**
[Xenon ](${link})
[Xenon](https://discordapp.com/oauth2/authorize?client_id=666655096041373737&scope=bot&permissions=8) 
`)
            .setColor("#5DBCD2")
            message.channel.send(inviteEmbed);
            })
        }catch(e) {
            throw e;
        }
    }
}
