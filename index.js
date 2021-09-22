require('dotenv').config()
const Discord = require("discord.js")
const mongo = require('./mongo')
const profileSchema = require('./schemas/profile.js')

const client = new Discord.Client(
  { 
    intents: [
      "GUILDS", 
      "GUILD_MESSAGES", 
      "DIRECT_MESSAGES"
    ], partials: [
      "CHANNEL"
    ] 
  });

const { MessageEmbed } = require('discord.js');
const cache = {} // id: [result array]
const GNU=`https://cdn.discordapp.com/icons/887577819381653515/19ff87484841f631638ddc2d9366df22.webp?size=128`;

client.on("ready", () => {
  console.log(`Logged in as ${client.user.tag}!`)
});

client.on("messageCreate", async message => {

  if(message.content.startsWith(`!sync`) && (message.author.id==="428902961847205899" 
    || message.member.roles.cache.find(r => r.name === "Club Secretary") 
    || message.member.roles.cache.find(r => r.name === "Moderators"))){
    var data ;
    console.log('FETCHING FROM DATABASE')
    await mongo().then(async (mongoose) => {
      try {
        data = await profileSchema.find()
      } 
      finally {
        mongoose.connection.close()
        data.forEach(element => {
          cache[element.id]=element
        });
        message.channel.send(`Current count of profiles = ${data.length} \nTime taken to fetch data : ${Date.now() - message.createdTimestamp}ms`)
      }
    })
  }
  const filter = m => m.author.id === message.author.id;
  if(message.content.startsWith(`!git `)){
    let text = message.content.slice(5);
    await mongo().then(async (mongoose) => {
      try {
        await profileSchema.findOneAndUpdate({
          _id: message.author.id
        }, {
          _id: message.author.id,
          git: text,
        }, {
          upsert: true
        })
      }
      catch(err) {
        console.error(err)
      } 
      finally {
        mongoose.connection.close()
      }
    })
  }
  if(message.content.startsWith(`!df `)){
    let text = message.content.slice(4);
    await mongo().then(async (mongoose) => {
      try {
        await profileSchema.findOneAndUpdate({
          _id: message.author.id
        }, {
          _id: message.author.id,
          df: text,
        }, {
          upsert: true
        })
      }
      catch(err) {
        console.error(err)
      } 
      finally {
        mongoose.connection.close()
      }
    })
  }
  if(message.content.startsWith(`!img `)){
    let text = message.content.slice(5);
    await mongo().then(async (mongoose) => {
      try {
        await profileSchema.findOneAndUpdate({
          _id: message.author.id
        }, {
          _id: message.author.id,
          img: text,
        }, {
          upsert: true
        })
      }
      catch(err) {
        console.error(err)
      } 
      finally {
        mongoose.connection.close()
      }
    })
  }
  if(message.content.startsWith(`!fetch`)){

    const myProfile = new MessageEmbed()
    var fetchedUserPFP
    var fetchedUser
    if(message.content===`!fetch`){
      fetchedUser = message.author;
      fetchedUserPFP = fetchedUser.displayAvatarURL({size: 1024, dynamic: true})
    }
    else if(message.mentions.users.first()){
      fetchedUser = message.mentions.users.first()
      fetchedUserPFP = fetchedUser.displayAvatarURL({size: 1024, dynamic: true})
      const UserPFP = message.member.user.avatarURL();
      myProfile.setFooter(`Info requested by ${message.author.tag}`, UserPFP)
    }
    else if(message.content.split(' ').length === 2){
      const split = message.content.split(' ')
      split.shift()
      text = split.join(' ')
      await client.users.fetch(text)
        .then((user) => {
          fetchedUser = user
          fetchedUserPFP = fetchedUser.displayAvatarURL({size: 1024, dynamic: true})
        })
        .catch(err => {
          console.log(`unable to fetch user through ID : ${text}`)
          // return
        })
    }
    else{
      message.channel.send("Kindly mention someone.")
      return;
    }
    if(!fetchedUser){
      message.channel.send("Kindly mention someone.")
      return;
    }
    var result = cache[fetchedUser.id]
    if(!result){
      await mongo().then(async (mongoose) => {
        try {
          result = await profileSchema.findOne({ _id: fetchedUser.id })
          var lameHead="My profile"
          if(!result){
            myProfile.setColor('RANDOM')
              .setTimestamp()
              .setDescription("This user is too busy.")
            message.channel.send({ embeds: [myProfile] })
            return;
          }
          if(result.IIITB==="1"){
            lameHead="IIIT Bhopal Student"
          }
          if(result.git) lameGit=result.git
          myProfile.setColor('RANDOM')
            .setTitle(lameHead)
            .setThumbnail(GNU)
            .setTimestamp()
            .setAuthor(result.SName,fetchedUserPFP,"https://discord.gg/M9KMPzBj")
            .addFields(
              { name: 'Scholar No.', value: result.SNo, inline: true },
              { name: 'Branch', value: result.Branch, inline: true },
              { name: 'Year of Graduation', value: result.Year, inline: true },
              { name: '\u200B', value: '\u200B' },
              { name: 'Distro', value: result.Distro, inline: true },
              { name: 'Editor', value: result.Editor, inline: true },
              { name: 'Shell', value: result.Shell, inline: true },
              { name: '\u200B', value: '\u200B' },
              { name: 'CPU', value: result.CPU, inline: true },
              { name: 'GPU', value: result.GPU, inline: true },
              { name: 'Memory', value: result.Memory, inline: true },
              { name: '\u200B', value: '\u200B' },
            )

          if(result.git) myProfile.setDescription(result.git)
          else myProfile.setDescription('\u200B')
          if(result.img) myProfile.setImage(result.img)
          else myProfile.setImage(`https://images-ext-2.discordapp.net/external/TFqqarchefYbJdnbWCxresJG3HA2G1SGpYE3O3_7qDw/https/i.imgur.com/98CUqwqh.jpg`)
          if(result.df) myProfile.addFields({ name: 'Dotfiles', value: result.df,})

          message.channel.send({ embeds: [myProfile] })
        } catch(err) {
          console.error(err)
        } finally {
          mongoose.connection.close()
        }
      }) 
    }
    else{
      var lameHead="My profile" 
      if(result.IIITB==="1"){
        lameHead="IIIT Bhopal Student"
      }
      if(result.git) lameGit=result.git
      myProfile.setColor('RANDOM')
        .setTitle(lameHead)
        .setThumbnail(GNU)
        .setTimestamp()
        .setAuthor(result.SName,fetchedUserPFP,"https://discord.gg/M9KMPzBj")
        .addFields(
          { name: 'Scholar No.', value: result.SNo, inline: true },
          { name: 'Branch', value: result.Branch, inline: true },
          { name: 'Year of Graduation', value: result.Year, inline: true },
          { name: '\u200B', value: '\u200B' },
          { name: 'Distro', value: result.Distro, inline: true },
          { name: 'Editor', value: result.Editor, inline: true },
          { name: 'Shell', value: result.Shell, inline: true },
          { name: '\u200B', value: '\u200B' },
          { name: 'CPU', value: result.CPU, inline: true },
          { name: 'GPU', value: result.GPU, inline: true },
          { name: 'Memory', value: result.Memory, inline: true },
          { name: '\u200B', value: '\u200B' },
        )

      if(result.git) myProfile.setDescription(result.git)
      else myProfile.setDescription('\u200B')
      if(result.img) myProfile.setImage(result.img)
      else myProfile.setImage(`https://images-ext-2.discordapp.net/external/TFqqarchefYbJdnbWCxresJG3HA2G1SGpYE3O3_7qDw/https/i.imgur.com/98CUqwqh.jpg`)
      if(result.df) myProfile.addFields({ name: 'Dotfiles', value: result.df,})

      message.channel.send({ embeds: [myProfile] })
    }
  }// if(message.content.startsWith(`!setfet`)){


  if(message.content.startsWith(`!setfet`) && (message.channel.type === "DM")){
    if(!message.content.includes("Distro")) return;
    if(!message.content.includes("GPU")) return;
    if(!message.content.includes("CPU")) return;
    message.channel.send("If you are from IIIT Bhopal\nReply with *Y*. and if not, reply with *N*")
    const collectorIIITB = message.channel.createMessageCollector({ filter, max:1, time: 20000 });
    collectorIIITB.on('collect', mIB => {

      var IIITB=false;
      if(mIB.content.toUpperCase()===`Y`){IIITB=true}
      else{
        message.channel.send("Currently we are serving for IIIT Bhopal only")
        return;
      }
      const UserPFP = message.author.avatarURL();
      let text=message.content
      const split = text.split('\n')
      split.shift()
      var i=0
      var arr=[];
      for(i=0;i<14;i++){
        if(split[i]){
          if (split[i].indexOf(':') !== -1) {
            if(split[i].split(':')[1])
              arr[i] = split[i].split(':')[1]
            else{
              arr[i]="NULL"
            }
          }
        }
      }
      if(arr[13]){
        var space = arr[13].match(/\d/g);
        space=space.join("")
        space=(space/1048576).toString().substring(0,4);
        space=space+" GB";
      }else{
        arr[13]="NULL"
      }
      const myProfile = new MessageEmbed()
      var yearG="0";
      var branch="0";
      var schn="0";
      var sName="xyz";
      var k=0;
      message.channel.send("Please provide your scholar number.")


      const collectorSchNo = message.channel.createMessageCollector({ filter, max:1, time: 20000 });
      collectorSchNo.on('collect', m => {
        schn=m.content.toUpperCase();
        if(schn.includes("U")){
          let temp=m.content.toUpperCase().split(`U`)
          if(temp[0].startsWith("17")) {yearG="2021"; k++;}
          else if(temp[0].startsWith("18")) {yearG="2022"; k++;}
          else if(temp[0].startsWith("19")) {yearG="2023"; k++;}
          else if(temp[0].startsWith("20")) {yearG="2024"; k++;}
          else{
            message.channel.send("Please provide a valid scholar number.")
            return;
          }
          if(temp[1].startsWith("01")) {branch="ECE"; k++;}
          else if(temp[1].startsWith("02")) {branch="CSE"; k++;}
          else if(temp[1].startsWith("03")) {branch="IT"; k++;}
          else{
            message.channel.send("Please provide a valid scholar number.")
            return;
          }
        }
        else{
          message.channel.send("Please provide a valid scholar number.")
          return;
        }
      });
      collectorSchNo.on('end', async collected => {
        if(k===2){
          message.channel.send("Please provide your name.")
            .catch(err => console.error(err));

          const collectorName = message.channel.createMessageCollector({ filter, max:1, time: 30000 });
          collectorName.on('collect', mN => {
            sName = mN.content.toLowerCase().split(' ');
            for (var i = 0; i < sName.length; i++) {
              sName[i] = sName[i].charAt(0).toUpperCase() +
                sName[i].substring(1);
            }
            sName=sName.join(" ");
            myProfile.setColor('RANDOM')
              .setTitle('My profile')
              .addFields(
                { name: 'Scholar No.', value: schn, inline: true },
                { name: 'Branch', value: branch, inline: true },
                { name: 'Year of Graduation', value: yearG, inline: true },
                { name: '\u200B', value: '\u200B' },
                { name: 'Distro', value: (arr[0])?arr[0]:"NULL", inline: true },
                { name: 'Editor', value: (arr[3])?arr[3]:"NULL", inline: true },
                { name: 'Shell', value: (arr[4])?arr[4]:"NULL", inline: true },
                { name: '\u200B', value: '\u200B' },
                { name: 'CPU', value: (arr[11])?arr[11]:"NULL", inline: true },
                { name: 'GPU', value: (arr[12])?arr[12]:"NULL", inline: true },
                { name: 'Memory', value: (space)?space:"NULL", inline: true },
                { name: '\u200B', value: '\u200B' },
              )
              .setTimestamp()
              .setThumbnail(GNU)
              .setFooter(`We welcome you to our club!`, GNU)
              .setAuthor(sName,UserPFP,"https://discord.gg/M9KMPzBj")
              .setDescription("\u200B")

            message.channel.send({ embeds: [myProfile] })
              .then(
                message.channel.send("If the above information is correct\nReply with **Y**.")
              )
          });
          collectorName.on('end', async collected => {
            const collectorY = message.channel.createMessageCollector({ filter, max:1, time: 20000 });
            collectorY.on('collect',async mY => {
              if(mY.content.toUpperCase()==="Y"){
                message.channel.send("Congratz.")
                await mongo().then(async (mongoose) => {
                  try {
                    await profileSchema.findOneAndUpdate({
                      _id: message.author.id
                    }, {
                      _id: message.author.id,
                      dTag: message.author.tag,
                      SName: sName,
                      SNo: schn,
                      Branch: branch,
                      Year: yearG,
                      Distro: arr[0],
                      Kernel: arr[1],
                      Terminal: arr[2],
                      Editor: arr[3],
                      Shell: arr[4],
                      WM: arr[5],
                      Bar: arr[6],
                      Resolution: arr[7],
                      Display: arr[8],
                      GTK3Theme: arr[9],
                      GTKIconTheme: arr[10],
                      CPU: arr[11],
                      GPU: arr[12],
                      Memory: space,
                      IIITB: "1",
                    }, {
                      upsert: true
                    })
                  }
                  catch(err) {
                    console.error(err)
                  } 
                  finally {
                    client.channels.cache.get('840304064477528107')
                      .send(`Succesfully completed by ${sName} - ${message.author.tag} - ${message.author.id}`)
                    mongoose.connection.close()
                  }
                })
              }
              else{
                message.channel.send("We cant figure out your response. Please start all over again.\nContact moderators for support\nDont DM Club Secretaries. ;)  ")
              }
            });
          })
        }
        else{
          message.channel.send("Please provide a valid scholar number.")
          return;
        }
      });
    }

    )};
})
client.login(process.env.token)
