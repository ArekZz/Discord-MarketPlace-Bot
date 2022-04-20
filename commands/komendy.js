const { channel } = require('diagnostics_channel');
const JSONdb = require('simple-json-db');
const db = new JSONdb('database.json');
const { MessageEmbed } = require('discord.js');
const { Permissions } = require('discord.js');
const randomcolor = require('randomcolor');
const request = require('node-fetch');
var fs = require('fs');
const { create } = require('lodash');
var serverids = ['880209196660953188','880209245574950972'];
var zakazaneslowa = ['words']




module.exports = serverids;

function checkSubscription(time)
{
    if(new Date().getTime()>time){
        return true;
    }
    return false;
}

function getHours(millisec) {
    var seconds = (millisec / 1000).toFixed(0);
    var minutes = Math.floor(seconds / 60);
    var hours = "";
    if (minutes > 59) {
        hours = Math.floor(minutes / 60);
        hours = (hours >= 10) ? hours : "0" + hours;
        minutes = minutes - (hours * 60);
        minutes = (minutes >= 10) ? minutes : "0" + minutes;
    }

    seconds = Math.floor(seconds % 60);
    seconds = (seconds >= 10) ? seconds : "0" + seconds;
    if (hours != "") {
        return hours + ":" + minutes + ":" + seconds;
    }
    return minutes + ":" + seconds;
}

Date.prototype.addDays = function(days) {
    var date = new Date(this.valueOf());
    date.setDate(date.getDate() + days);
    return date;
}


module.exports = [
    {
        "name":".createslot",
        "arguments":3,
        "userPermissions": "MANAGE_GUILD",
        "help":"Usage: createslot USER CATEGORYID_SLOT CATEGORYID_MAIN",
         run:async (a,b,c)=>{
            try{
                var date = new Date();
                date.addDays(31);
                var xd ;
                var slotid;
                let guild = a.guilds.cache.get('880209196660953188');
                let user = await a.users.fetch(b[1].split('@!')[1].split(">")[0]);
           
                let main = a.guilds.cache.get('880209245574950972');
                 await guild.channels.create(user.username,{type:"GUILD_TEXT",
                permissionOverwrites: [
                  
                    {
                        id: user.id,
                        allow: [Permissions.FLAGS.SEND_MESSAGES],
                    },
                ],
                
                }).then(async (channel)=>{
                   
                   await  channel.setParent(`${b[2]}`);
                    slotid = channel.id;
                   xd = channel;
                   
                })

                await xd.permissionOverwrites.set([
                    {
                        id: guild.id,
                        deny: [Permissions.FLAGS.VIEW_CHANNEL],
                    },
                    {
                        id: user.id,
                        allow: [Permissions.FLAGS.VIEW_CHANNEL],
                    },
                ]);
                main.channels.create(user.username,{type:"text"}).then((channel)=>{
                    channel.setParent(`${b[3]}`);
                    db.set(`user-${user.id}`,{
                        id:user.id,
                        channelID:channel.id,
                        slotId:slotid,
                        lastping:null,
                        subscription:date.getTime()
                    })
                })
            
            c.channel.send("Channels created!!! \n Commands you can use: \n .ping - everyone mention 2 days cooldown \n .purge - delete messages in both channels  \n Thanks :3")
                
            }catch(err){
                console.log(err)
            }
         }
    },
    {
        "name":".ping",
        "arguments":0,
        "userPermissions": "SEND_MESSAGES",
         run:(a,b,c)=>{
             try{
             if(c.guild.id!="880209196660953188") return;
            
             

            let main = a.guilds.cache.get('880209245574950972');
            var id = db.get(`user-${c.author.id}`);
            var ping = id["lastping"];
            if(!checkSubscription(id["subscription"])){
                c.channel.send("Your subscription has been expired!")
                return;
            }
            if(ping==null){
                db.set(`user-${c.author.id}`,{...id,
                    lastping:new Date().getTime()
                })
            }else{
                var x = parseInt((new Date().getTime()))- parseInt( id["lastping"]) ;
          
                if(x<172800000){
                    var left =  new Date(id["lastping"]).addDays(2).getTime()- new Date().getTime();

                    c.channel.send(`You have to wait ** ${getHours(left)} ** hours before next ping.\n ** Ping CD reset = 10$ ** `)
                    return;
                }

            }
            main.channels.cache.get(id["channelID"]).send("@everyone");
            db.set(`user-${c.author.id}`,{...id,
                lastping:new Date().getTime()
            })
             }catch(err){
                console.log(err)
             }
         }
    },
    {
        "name":".send",
        "arguments":0,
        "userPermissions": "SEND_MESSAGES",
         run:async (a,b,c)=>{
             try{
                
                let user = await a.users.fetch(`${c.author.id}`);
                var filteredcontent = "";
                c.content.split(' ').map(word=>{
                    if(zakazaneslowa.includes(word.toLowerCase())){
                        word = word.replaceAll('a',"4").replaceAll('e','3').replaceAll("A","4").replaceAll("E","3").replaceAll("o","0").replaceAll("O","0");
                    }
                    filteredcontent+=word+' ';
                })
                const exampleEmbed = new MessageEmbed()
                .setColor(randomcolor())
         
                .setAuthor('', `https://cdn.discordapp.com/avatars/${c.author.id}/${user.avatar}.png`,`https://cdn.discordapp.com/avatars/${c.author.id}/${user.avatar}.png`)
                
                .setDescription(`Contact <@!${c.author.id}>\n\n${filteredcontent}`)
               
                .setThumbnail(`https://cdn.discordapp.com/avatars/${c.author.id}/${user.avatar}.png`)
                .setFooter(`Sent by ${user.username}#${user.discriminator}`)
                .setTimestamp()
                 if(c.attachments.size>0){
                     var url = "";
                     c.attachments.map(x=>{
                         url = x.attachment;
                     })
                    exampleEmbed.setImage(url)
                 }
                  
                 
            
            let main = a.guilds.cache.get('880209245574950972');
            var id = db.get(`user-${c.author.id}`);
            
            if(!checkSubscription(id["subscription"])){
                c.channel.send("Your subscription has been expired!")
              
                return;
            }

    
            if(id["slotId"]!==c.channel.id) return

            main.channels.cache.get(id["channelID"]).send({ embeds: [exampleEmbed] });
             }catch(err){
                console.log("Not buyer")
             }
         }
    },
     {
        "name":".reset",
        "arguments":1,
        "userPermissions": "MANAGE_GUILD",
        "help":".reset @user",
         run:async (a,b,c)=>{
             try{
                let user = await a.users.fetch(b[1].split('@!')[1].split(">")[0]);
           
                var dbuser= db.get(`user-${user.id}`);
                db.set(`user-${user.id}`,{...dbuser,lastping:null})
                c.channel.send("Successfully reseted ping time!")
             }catch{

             }
         }
    },{
        "name":".purge",
        "arguments":1,
        "userPermissions": "SEND_MESSAGES",
        "help":"Usage: .purge amount",
         run:async (a,b,c)=>{
           try{
            let main = a.guilds.cache.get('880209245574950972');
            var id = db.get(`user-${c.author.id}`);
            if(!id) return;
       
            
            var del=0;
            let deleted;
            do {
              deleted = await c.channel.bulkDelete(b[1]);
                await      main.channels.cache.get(id["channelID"]).bulkDelete(b[1]);
              del++;
            } while (del>b[1]);
              
              await c.channel.send(`Successfully deleted ${b[1]} messages.`).then(x=>{
                  setTimeout(() => {
                      x.delete(0);
                  }, 2000);
              })
           
            
           }catch(err){
            console.log(err)
           }
         }
    },{
        "name":".addy",
        "arguments":0,
        "userPermissions": "MANAGE_GUILD",
        "help":"Usage: .addy",
         run:async (a,b,c)=>{
           try{
                c.channel.send("**BTC**```INFO```")
           }catch(err){
            console.log(err)
           }
         }
    },{
        "name":".delete",
        "arguments":1,
        "userPermissions": "MANAGE_GUILD",
        "help":"Usage: .delete user",
         run:async (a,b,c)=>{
           try{
            let user = await a.users.fetch(b[1].split('@!')[1].split(">")[0]);
            var id = db.get(`user-${user.id}`);
                console.log(user,id)

            console.log(id["slotID"])
            if(id){
                var fetchedChannel = await a.guilds.cache.get('880209196660953188');
                fetchedChannel = await fetchedChannel.channels.cache.get(id["slotId"]);
                await fetchedChannel.delete();
                var fetchedChannelmain =await a.guilds.cache.get('880209245574950972');
                fetchedChannelmain = await fetchedChannelmain.channels.cache.get(id["channelID"]);

                await fetchedChannelmain.delete();
            }
            

           }catch(err){
            console.log(err)
           }
         }
    },
    {
        "name":".gl",
        "arguments":4,
        "userPermissions": "MANAGE_GUILD",
        "help":"Usage: .gl prefix days true/false howmuch",
         run:async (a,b,c)=>{
           try{
               var createdby="";
               var price = "";
                if(c.author.id=="758800929603977238"){
                    createdby="arek";
                }else{
                    createdby="saigo";
                }
                price = b[4]
                if(b[3]=="true"){
                    price = "Giveaway";
                }
                var req = await request(`https://developers.auth.gg/LICENSES/?type=generate&days=${b[2]}&amount=1&level=1&format=3&prefix=${b[1]}-${createdby}&authorization=UQVNWGIKAVQD`)
                .then(res=>res.json())
                .then(res=>{
                    console.log(res);
                    if(res['0']){
                        c.channel.send(`License Created: \`\`\`${res['0']}\`\`\``)
                        fs.writeFile('licenses.txt', `License: ${res['0']} Sold by: ${createdby} Cost: ${price}`, function (err) {
                            if (err) return console.log(err);
                          });
                    }
                   
                });
            

           }catch(err){
            console.log(err)
           }
         }
    },
]
