const Discord = require('discord.js')
const ketse = new Discord.Client()
const config = require('./config.json')
const axios = require('axios')


ketse.on("ready", () =>{
    console.log(`${ketse.user.tag} is online!`)
})

ketse.on('message', async message => {
	if (!message.content.startsWith(config.prefix) || message.author.bot) return;

	const args = message.content.slice(config.prefix.length).trim().split(/ +/);
	const command = args.shift().toLowerCase();
    let ketseoff = message.guild.channels.cache.get(config['on-off-logs'])


try{

    if (command === 'on') {
        if(!message.member.roles.cache.has(config['Staff Team Role ID'])) return message.reply("you do not have permissions to execute this command");
        start = new Date().getTime();
        message.react('✅');
}

      
      else if(command === 'off'){
        if(!message.member.roles.cache.has(config['Staff Team Role ID'])) return message.reply("you do not have permissions to execute this command");
        
        const end = new Date().getTime();
  
        const diff = end - start;

          let days = Math.floor(diff / 86400000);
          let hours = Math.floor(diff / 3600000) % 24;
          let minutes = Math.floor(diff / 60000) % 60;
          let seconds = Math.floor(diff / 1000) % 60;          


          const embed = new Discord.MessageEmbed()
          .setTitle(message.guild.name)
          
          .addFields(
              {name: "```Name```", value: `<@!${message.author.id}>`},
              {name: "```Days:```", value: `${days}`},
              {name: "```Hours:```", value: `${hours}`},
              {name: "```Minutes:```", value: `${minutes}`},
              {name: "```Seconds:```", value: `${seconds}`}
          )
          .setColor(config.color)



          ketseoff.send(embed)
        message.react('✅');




      }

}catch{
const channel = message.guild.channels.cache.find(ch => ch.id === config['on-off-logs'])
const ketse = new Discord.MessageEmbed()
.setTitle('🆘SOS Some type again !off but already has off🆘')
.addFields(
    {name: "```User```", value: `<@!${message.author.id}>`},
    {name: "```Channel```", value: `<#${message.channel.id}>`},
)
.setColor(config.color)
channel.send(ketse)
}

if(command === 'support'){
    message.channel.send(`<@&${config['Staff Team Role ID']}> παρακαλείστε να εξυπήρεσετε τον <@!${message.author.id}>`)
}

if(command === 'clear'){
    const usage = '```\clear <amount>\clear <amount> --users\clear <amount> --bots\n```';
    if (!args.length) return message.channel.send(`No Amount Specified.\n${usage}`);
    let amount = parseInt(args[0]);
    if (isNaN(amount)) return message.channel.send(`Invalid Number Specified.\n${usage}`);
    if (args[1]) {
        const flag = args[1].toLowerCase();
        if (flag != '--users' && flag != '--bots') return message.channel.send(`Invalid Flag Specified.\n${usage}`);
        const messages = await message.channel.messages.fetch({limit: 100});
        let count = 0, toDelete = [];
        messages.forEach(message => {
            if (count > amount) return;
            if (flag === '--users') {
                if (!message.author.bot) toDelete.push(message);
                count++;
            } else if (flag === '--bots') {
                if (message.author.bot) toDelete.push(message);
                count++;
            }
        });
        if (toDelete.length) {
            try {
                await message.delete();
                await message.channel.bulkDelete(toDelete, true)
                .then(num => message.channel.send(`Deleted ${num.size} Message(s)!`));
            } catch (err) {
                return message.channel.send(err.message);
            }
        } else {
            return message.channel.send('No messages found with that flag.');
        }
    } else {
        try {
            await message.delete();
            await message.channel.bulkDelete(amount, true)
            .then(num => message.channel.send(`Deleted ${num.size} Message(s)!`));
        } catch (err) {
            return message.channel.send(err.message);
        }
    }
}


if(command === 'lock'){
    if (!message.member.hasPermission('MANAGE_SERVER', 'MANAGE_CHANNELS')) {
        return message.channel.send("You don't have enough Permissions")
        }
        message.channel.overwritePermissions([
          {
             id: message.guild.id,
             deny : ['SEND_MESSAGES'],
          },
         ],);
        const embed = new Discord.MessageEmbed()
        .setTitle("Channel Updates")
        .setDescription(`${message.channel} has been Locked`)
        .setColor(config.color);
        await message.channel.send(embed);
        message.delete();
}
else if(command === 'unlock'){
    if (!message.member.hasPermission('MANAGE_SERVER', 'MANAGE_CHANNELS')) {
        return message.channel.send("You don't have enough Permissions")
        }
        message.channel.overwritePermissions([
          {
             id: message.guild.id,
             allow : ['SEND_MESSAGES'],
          },
         ],);
        const embed = new Discord.MessageEmbed()
        .setTitle("Channel Updates")
        .setDescription(`${message.channel} has been unlocked`)
        .setColor(config.color);
        await message.channel.send(embed);
        message.delete();
}

})

ketse.on("message", async message =>{
    if(message.author.bot) return;
      if (message.content === '!status'){
        try {
            const serverIP = `${config.ketse.ip}:${config.ketse.port}`
            const { data } = await axios.get(`http://${serverIP}/dynamic.json`);
            const regex = /\[([0-9]+)\]/;
            const queue = data.hostname.match(regex);
            if (queue) {
              return message.channel.send(new Discord.MessageEmbed()
              .setColor(config.color)
              .addFields(
                  {name: "**Players**", value: `${data.clients}/${data.sv_maxclients}`, inline: true},
                  {name: "**Queue**", value: `${queue[1]}`, inline: true}
              )
              .setThumbnail(ketse.user.displayAvatarURL()));
            } else {
              return message.channel.send(new Discord.MessageEmbed()
              .setColor(config.color)
              .addFields(
                  {name: "**Players**", value: `${data.clients}/${data.sv_maxclients}`, inline: true},
                  {name: "**Queue**", value: `0`, inline: true}
              )
              .setThumbnail(ketse.user.displayAvatarURL())
              );
            }
          } catch (e) {
            console.log(e.message);
            message.channel.send(new Discord.MessageEmbed()
            .setColor(config.color)
            .addFields(
                {name: "**Fetching info From Server**", value: `**Fetching info From Server**`, inline:true}
            )
            .setThumbnail(ketse.user.displayAvatarURL()));
          }
        


}})


ketse.login(config.token).catch(e =>{
    console.log(e.message)
})