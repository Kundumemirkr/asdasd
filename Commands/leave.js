module.exports = class leave {
    constructor() {
        this.name = "leave",
        this.alias = [],
        this.permLevel = 3  
        this.usage = "!leave"
    }

    async run(client, message, args) {
        try{
            message.channel.send("Görüşürüz ;(")
            message.guild.leave();
        }catch(e) {
            throw e;
        }
    }
}