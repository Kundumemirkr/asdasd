const { RichEmbed, Client, Util, Message } = require("discord.js");
const fs = require("fs");
const hastebins = require('hastebin-gen');

var backups = JSON.parse(fs.readFileSync("./Data/backups.json", "utf8"));


module.exports = class backup {
    constructor() {
        this.name = "yedekleme",
        this.alias = [""],
        this.permLevel = 3  
        this.usage = ".backup"
    }



    async run(client, message, args) {
        try{
            let info = client.emojis.get("655091815401127966") || "ℹ️" //https://cdn.discordapp.com/emojis/655091815401127966.png?v=1
            let waiting = client.emojis.get("655695570769412096") || "⌛" //https://images-ext-1.discordapp.net/external/lWj3uW4qvfFB9t0QgGsDJ8vLvh5bSObQ-wwUxYFH4wo/https/images-ext-1.discordapp.net/external/AzWR8HxPJ4t4rPA1DagxJkZsOCOMp4OTgwxL3QAjF4U/https/cdn.discordapp.com/emojis/424900448663633920.gif
            let green = client.emojis.get("655696285286006784") || "✅"//https://images-ext-2.discordapp.net/external/NU9I3Vhi79KV6srTXLJuHxOgiyzmEwgS5nFAbA13_YQ/https/cdn0.iconfinder.com/data/icons/small-n-flat/24/678134-sign-check-512.png
            let error = client.emojis.get("655704809483141141") || "❌" //https://cdn.discordapp.com/emojis/655704809483141141.png?v=1
            let warning = client.emojis.get("656030540310380574") || "⚠️" //https://cdn.discordapp.com/emojis/656030540310380574.png?v=1


            let guildsonlyEmbed = new RichEmbed()
            .setTitle(`${error} Hata`)
            .setDescription(`Bu Kodu Özel Mesajlarında Kullanamassınız
            
            [DESTEK](EKLENMEDİ)`)
            .setColor("#a11616")
            if (message.channel.type === 'dm') return message.channel.send(guildsonlyEmbed);
            if(args[1] === "oluştur") {
             await   message.guild.roles.filter(r => r.name !== message.guild.member(client.user.id).highestRole.name).forEach(r => {
                    if (r.comparePositionTo(message.guild.member(client.user.id).highestRole) > 0){
                        let havnthighest = new RichEmbed()
                            .setTitle(`${warning}  Hata`)
                            .setDescription(`Basilisk Botun Rolunu En Üste ALın , Aksı Takdirde Backup Yapılamaz. !
                            
                            [DESTEK](Eklenmedi)`)
                            .setColor("#a11616")
                        message.channel.send(havnthighest) 
                    }
                })

                

                let creatingEmbed = new RichEmbed()
                .setTitle(`${waiting}  Lütfen Bekle ...`)
                .setDescription("Yedekleme Kuruluyor ... Lütfen Bekle")
                message.channel.send(creatingEmbed).then(m => {

                let id = makeid(16)

                    const channels = message.guild.channels.sort(function (a, b) { return a.position - b.position; }).array().map(c => {
                    const channel = {
                        type: c.type,
                        name: c.name,
                        postion: c.calculatedPosition
                    }
                    if (c.parent) channel.parent = c.parent.name
                    return channel;
                });

      
            
                    const roles = message.guild.roles.filter(r => r.name !== "@everyone").sort(function (a, b) { return a.position - b.position; }).array().map(r => {
                    const role = {
                        name: r.name,
                        color: r.color,
                        hoist: r.hoist,
                        permissions: r.permissions,
                        mentionable: r.mentionable,
                        position: r.position
                    }
                    return role;
                });

                if(!backups[message.author.id]) backups[message.author.id] = {}
                backups[message.author.id][id] = {
                    icon: message.guild.iconURL,
                    name: message.guild.name,
                    owner: message.guild.ownerID,
                    members: message.guild.memberCount,
                    createdAt: message.guild.createdAt,
                    roles,
                    channels
                }
                
            save();
                let result = new RichEmbed()
                .setTitle(`${info}  Bilgi`)
                .setDescription(`Backup Kuruldu **${message.guild.name}** Adlı Sunucuda Kuruldu İD İse \`${id}\``)
                .addField("Kullanım", `\`\`\`&yedekleme yükle ${id}\`\`\`
\`\`\`.yedekleme bilgi ${id}\`\`\``)
                .setColor("#5DBCD2")

            message.author.send(result)

            let resultPublic = new RichEmbed()
            .setTitle(`${green}  Hazır!`)
            .setDescription(`İŞTE BU BACKUP Kuruldu**${message.guild.name}** Sunucusuna Ait Olan İD\`${id}\``)
            .addField("Usage", `\`\`\`.yedekleme yükle ${id}\`\`\`
\`\`\`.yedekleme bilgi ${id}\`\`\``)
            .setColor("#59C57B")

        m.edit(resultPublic)
            
              })
            }


            if(args[1] === "sil") {
                let code = args[2];
                let errorEmbed = new RichEmbed()
                .setTitle(`${error}  Error`)
                .setDescription(`Backup_id argümanını tanımlamayı unuttunuz.
[DESTEK](EKLENMEDİ)`)
                .setColor("#a11616")
                if(!code) return message.channel.send(errorEmbed)

                let cantfindbackup = new RichEmbed()
                .setTitle(`${error} HATA`)
                .setTitle(`İdye Sahip deilsiniz ${code}.`)
                .setDescription(`
[Destek](Eklenmedi)`)
                .setColor("#a11616")
                if(!backups[message.author.id][code]) return message.channel.send(cantfindbackup)

                delete backups[message.author.id][code];
                save();

                let deletedsuc = new RichEmbed()
                    .setTitle(`${green}  Hazır!`)
                    .setDescription(`Başarı ile **yedekleme silindi**.`)
                    .setColor("#59C57B")
                    message.channel.send(deletedsuc)

            }

            if(args[1] === "yükle") {
                let error = client.emojis.get("655704809483141141") || "❌"
                let code = args[2];
                let errorEmbed = new RichEmbed()
                .setTitle(`${error}  Hata`)
                .setDescription(`Backup_id argümanını tanımlamayı unuttunuz.
[Support](Eklenmedi)`)
                if(!code) return message.channel.send(errorEmbed)
                let cantfindbackup = new RichEmbed()
                .setTitle(`${error}  HATA`)
                .setTitle(`Yedekleme İdsine Sahip Deilsin ${code}.`)
                .setDescription("[Support](Eklenmedi)")
                .setColor("#a11616")
                if(!backups[message.author.id][code]) return message.channel.send(cantfindbackup)
                
                message.guild.channels.forEach(channel => {
                    channel.delete('Yedekleme Hazırlanıyor')
                })

                message.guild.roles.filter(role => role.members.every(member => !member.user.bot)).forEach(role => {
                    role.delete('Yedekleme Hazırlanıyor')
                })
                await backups[message.author.id][code].roles.forEach(async function (role) {
                        message.guild.createRole({ name: role.name, color: role.color, permissions: role.permissions, hoist: role.hoist, mentionable: role.mentionable, position: role.position }).then(role => {
                            role.setPosition(role.position)
                        })
                
                });
 
               await backups[message.author.id][code].channels.filter(c => c.type === "category").forEach(async function (ch)  {
                        message.guild.createChannel(ch.name, ch.type, ch.permissionOverwrites)
                }); 

               await backups[message.author.id][code].channels.filter(c => c.type !== "category").forEach(async function(ch) {
                        message.guild.createChannel(ch.name, ch.type, ch.permissionOverwrites).then(c => {
                            const parent = message.guild.channels.filter(c => c.type === 'category').find(c => c.name === ch.parent);
                            ch.parent ? c.setParent(parent) : '';
                        });
                });
                 message.guild.setName(backups[message.author.id][code].name)
                 message.guild.setIcon(backups[message.author.id][code].icon)

            }


            if(args[1] === "bilgi") {
                let id = args[2];
                let MissingbackupinfoEmbed = new RichEmbed()
                .setTitle(`${error}  Hata`)
                    .setDescription(`Backup_id argümanını tanımlamayı unuttunuz.  
                    [Destek](Eklenmedi)`)
                .setColor("#a11616")
                if(!id) return message.channel.send(MissingbackupinfoEmbed)

                let cantfindEmbed = new RichEmbed()
                .setTitle(`${error}  Hata`)
                .setDescription(`Bu kimliğe sahip ** yedeklemeniz yok ** \`${id}\`.
                "[Destek](Eklenmedi)`)
                .setColor("#a11616")
                if(!backups[message.author.id][id]) return message.channel.send(cantfindEmbed)

                try{
                let infoEmbed = new RichEmbed()
                .setTitle(backups[message.author.id][id].name)
                .setThumbnail(backups[message.author.id][id].icon)
                .addField("Admin", `<@${backups[message.author.id][id].owner}>`, true)
                .addField("Üyeler", backups[message.author.id][id].members, true)
                .addField("Kurulum Zamanı", backups[message.author.id][id].createdAt)
                .addField("Kanallar", `\`\`\`${backups[message.author.id][id].channels.map(channel => channel.name).join('\n')}\`\`\``, true)
                .addField("Roller", `\`\`\`${backups[message.author.id][id].roles.map(role => role.name).join('\n')}\`\`\``, true)
                message.channel.send(infoEmbed)
                }catch(e) {
                    hastebins(backups[message.author.id][id].channels.map(channel => channel.name).join('\n'), 'txt').then(ch => {
                        hastebins(backups[message.author.id][id].roles.map(role => role.name).join('\n'), 'txt').then(ro => {
                    let infoEmbed = new RichEmbed()
                        .setTitle(backups[message.author.id][id].name)
                        .setThumbnail(backups[message.author.id][id].icon)
                        .addField("Admim", `<@${backups[message.author.id][id].owner}>`, true)
                        .addField("Üyeler", backups[message.author.id][id].members, true)
                        .addField("Kurulum Zamanı", backups[message.author.id][id].createdAt)
                        .addField("Kanallar", ch, true)
                        .addField("Roller", ro, true)
                    message.channel.send(infoEmbed)
                    })
                })
                }

                
            }

            if(args === "yoket") {
                let warningEmbed = new RichEmbed()
                .setTitle(`${warning}  UYARI`)
                .setDescription(`Gerçekten Tüm Backuplarını Silecekmisin !
__Geri Alınamaz !__`)
                message.channel.sendEmbed(warningEmbed).then(msg => {
                    msg.react('✅')
                        .then(() => msg.react('❌'))


                    let yesFilter = (reaction, user) => reaction.emoji.name === '✅' && user.id === message.author.id;
                    let noFilter = (reaction, user) => reaction.emoji.name === '❌' && user.id === message.author.id;

                    let yes = msg.createReactionCollector(yesFilter, { time: 0 });
                    let no = msg.createReactionCollector(noFilter, { time: 0});


                    yes.on("collect", r => {
                        delete backups[message.author.id];

                        let deletedsuc = new RichEmbed()
                            .setTitle(`${green}  Hazır !`)
                            .setDescription(`Tüm Backupların Silindi `)
                            .setColor("#59C57B")
                        message.channel.send(deletedsuc)
                    })

                    no.on("collect", r => {
                        msg.delete();
                    })

                })
              }

            if(!args[1]) {
                
                const embed = new RichEmbed()
                .setTitle(`**.yedekleme**

 Backuplarınız Kurun Yada Yükleyin
__**Komutlar**__
`)
                .setDescription(`
                .yedekleme oluştur        Yedekleme Kurulumu
                .yedekleme sil        1 Adet Yedekleme Silinir
                .yedekleme bilgi          Yedekleme Hakkında Bilgi
                .yedekleme list          Yedekleme Listesi
                .yedekleme yükle          Yedeklemelerini Yükle !
                .yedekleme yoket         Tüm Yedeklemelerini Sil !`)
                .addBlankField()
                .setFooter(`Basilisk !`)
                .setColor("#5DBCD2")
                message.channel.send(embed)
                return;
            }

            function makeid(length) {
                var result           = '';
                var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
                var charactersLength = characters.length;
                for ( var i = 0; i < length; i++ ) {
                   result += characters.charAt(Math.floor(Math.random() * charactersLength));
                }
                return result;
             }

             function save() {
                fs.writeFile("./Data/backups.json", JSON.stringify(backups), (err) => {
                    if (err) console.error(err)
                  })
              }
             
        }catch(e) {
            throw e;
        }
    }
}