var discord = require('discord.js');
const { Client, Intents } = require('discord.js');
const { Server } = require('http');
var bot = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });
var commands = require("../commands/komendy.js");
const { MessageEmbed } = require('discord.js');
const { Console } = require('console');

function isCommand(user,message)
{
    
    try{
        var com = message.split(" ");  console.log(com)
        if(commands.some(e=>e.name == com[0])){
            var found = commands.find(e=>e.name == com[0]);
            if(found.arguments==com.length-1){
                if(checkPermissions(user,found)){
                    console.log('run')
                    found.run(bot,[...com],user);
                    return true;
                }
            }else{
                console.log(com)
                user.channel.send(found.help)
                return false;
            }

        }
    }catch{
        
        return false;
    }
    return false;
}

function checkPermissions(user,command)
{
    
    try{

        if(user.member.permissions.has(command.userPermissions)){
            return true;

        }else{
            return false;
        }

    }catch{
        return false;
    }
   
}

bot.once('ready', () => {
    console.log("ready");

});

bot.on('messageReactionAdd', async (reaction, user) => {
    //Filter the reaction
    console.log(reaction);
    if (reaction.id === '<The ID of the Reaction>') {
     // Define the emoji user add
     let role = message.guild.roles.cache.find((role) => role.name === 'Member');
     if (message.channel.name !== 'alerts') {
      message.reply(':x: You must go to the channel #alerts');
     } else {
      message.member.addRole(role.id);
     }
    }
   });

bot.on('message',(message,self)=>{
       
    if (message.author.bot) return;
    if(message.content.toString().startsWith(".")){
        if(isCommand(message,message.content.toString())){
          
        }else{

        }
        return;
    }
    if(message.guild.id=="880209196660953188"){
        if(isCommand(message,".send")){
           
         }else{
 
         }

    }
});

bot.login("dc token");