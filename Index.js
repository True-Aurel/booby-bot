require('dotenv').config();//pour le TOKEN dans le .env
const Discord = require("discord.js");

const bdd = require("./bdd.json")
const fs = require('fs')

const { MessageEmbed } = require('discord.js');

const Client = new Discord.Client({
    intents: [
        Discord.Intents.FLAGS.GUILDS,
        Discord.Intents.FLAGS.GUILD_MESSAGES,
    ]
});

Client.on("ready",  () => {
    console.log("le bot est connecté");
    Client.user.setActivity(`PornHub(${prefix}help)`, {type: 'WATCHING'});
    Client.channels.cache.get('907029853163880528').send("yo");
    envoiJournalier();

});

const prefix = "-"

Client.login(process.env.TOKEN);//token privé du robot dans le .env (les autres ne doivent pas avoir accès à ça)

Client.on("messageCreate",message => {
    // if (message.author.bot) return; //si c'est le bot qui a écrit on fait rien
    // message.channel.send("yo");

    // var leSalon = message.channelId;
    // //console.log(salon)
    // Client.channels.cache.get(leSalon).send("hello");

    //-----------------------------------------------------------------------Suppression de message-----------------------------------------------------------------------
    if(message.content.startsWith(prefix +"clear")){
        message.delete();//supprimer le message de le commande directement 

        if(message.member.permissions.has('MANAGE_MESSAGES')){ //si le menbre a la permissions de gérer les messages
            let args = message.content.trim().split(/ +/g)

            if(args[1]){//si il y a un argument

                if(!isNaN(args[1]) && args[1] >= 1 && args[1] <= 99){//si argument 1 est un nb et entre 1 et 99
                    message.channel.bulkDelete(args[1]);
                    message.channel.send(`:white_check_mark:Vous avez supprimé ${args[1]} message(s)`);
                }
                else{
                    message.channel.send("La valeur doit être entre 1 et 99")
                }
            }
            else{
                message.channel.send("Il manque le nombre de message a supprimer")
            }
        }
        else{
            message.channel.send("Vous n'avez pas le permissions de gérer les messages")
        }
        setTimeout(() =>{ //supprimer le message d'erreur/confirmation au bout de 4s
            message.channel.bulkDelete(1);
        }, 4000)         
    }
    //-----------------------------------------------------------------------Definir le channel booby----------------------------------------------------------------------
    if(message.content.startsWith(prefix + "ici")){
        message.delete();//supprimer le message de le commande directement 
        if(message.member.permissions.has('ADMINISTRATOR')){
            var tempServer = message.guildId;
            var tempSalon = message.channelId;
            var tempNomServer = message.guild.name;            

            //console.log(bdd);

            if(bdd["lesServeurs"].findIndex(obj => obj.server ===  tempServer) == -1){ //si l'id du serveur (du message) n'est pas présent dans le tableau
                bdd["lesServeurs"].push({name: tempNomServer, server: tempServer, channel: tempSalon});//on rajoute l'id dans le tableau + son channel + son nom
                SaveBdd();
            }
            else{//si l'id du server existe dans le tableau
                let indexServer = bdd["lesServeurs"].findIndex(obj => obj.server ===  tempServer);
                bdd["lesServeurs"][indexServer]["channel"] = tempSalon;  //on remplace l'ancien salon par le nouveau
                SaveBdd();
            }

            //console.log(bdd);
            
            message.channel.send("Les BoobyDay seront envoyés dans ce salon");
            console.log("salon configuré");
        }
        else{
            message.channel.send("Vous devez être administrateur pour éxécuter cette commande");
            setTimeout(() =>{ //supprimer le message d'erreur au bout de 4s
                message.channel.bulkDelete(1);
            }, 4000)
        }
        
    }
    //-----------------------------------------------------------------------------Help Command----------------------------------------------------------------------------
    if(message.content.startsWith(prefix + "help")){
        message.delete();//supprimer le message de le commande directement 
        const exampleEmbed = new MessageEmbed()
            .setColor('#e4c1f9')//2bfafa
            .setTitle('Commands')
            .setAuthor({ name: 'BoobyDay Bot Guide', iconURL: 'https://urlz.fr/hZQb', url: 'https://boobyday.com/' })
            .setDescription('BoobyDay bot, source : https://boobyday.com/\nInvite link : https://urlz.fr/iCcv')
            .setThumbnail('https://urlz.fr/hZQb')
            .addFields(
                { name: 'Prefixe', value: `Le préfixe des commandes est : "${prefix}"` },
                { name: '\u200B', value: '\u200B' },
                { name: `${prefix}help`, value: 'Afficher toutes les commandes', inline: true },
                { name: `${prefix}ici`, value: 'Définir le salon pour envoyer les boobyday', inline: true },
                { name: `${prefix}clear`, value: `supprimer plusieurs messages (ex => ${prefix}clear 5)`, inline: true },
                { name: `${prefix}send`, value: `envoyer le boobyday si il y a eu un beug`, inline: true },
                { name: '\u200B', value: '\u200B' }
            )
            .setTimestamp()
            .setFooter({ text: 'Boobyday bot V4', iconURL: 'https://urlz.fr/hZQb' });

        message.channel.send({ embeds: [exampleEmbed] });
    }
    //-----------------------------------------------------------------------------Envoie si beug----------------------------------------------------------------------------

    if(message.content.startsWith(prefix + "send")){
        message.delete();//supprimer le message de le commande directement 
        getLinkAndName();
    }

});
/*
function envoiJournalier() {
    var now = new Date();
    var night = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate(),
    now.getHours(),
    now.getMinutes(),
    now.getSeconds() + 5
  );
  var msToMidnight = night.getTime() - now.getTime();
  console.log(msToMidnight);
  

  setTimeout(function() {
    //console.log(leSalonBooby);
    if(typeof(leSalonBooby) != 'undefined'){//seulement si leSalonBooby est défini
        console.log("channel = " + leSalonBooby);
        Client.channels.cache.get(leSalonBooby).send("hello");
    }    
    envoiJournalier();  
  }, msToMidnight);
}
*/
function envoiJournalier() {
    var now = new Date();
    var night = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate() +1,
      9, 0, 0		//10h
      /*now.getHours(),
      now.getMinutes()+1,
      now.getSeconds()*/
    );
    var msAvantEnvoi = night.getTime() - now.getTime();
  
    setTimeout(function() {
        if(bdd["lesServeurs"].length > 0){//seulement si il y a une valeur dans le tableau
            getLinkAndName();
        }
        envoiJournalier();    //reset et recommence
    }, msAvantEnvoi);
}

function getLinkAndName() {
    var now = new Date(); //récupérer la date du jour

    var year = now.getFullYear();
    var mois = now.getMonth() + 1; //+1 janvier est 0
    var jour = now.getDate();
    
    if(mois < 10){ //pour qu'il mette bien le 0 si mois est < 10
        mois = "0"+ mois
    }
    if(jour < 10){ //pour qu'il mette bien le 0 si mois est < 10
        jour = "0"+ jour
    }
    var nowUS = year + mois + jour //date du jour dans le bon ordre

    //console.log(now);
    //console.log(nowUS);// l'afficher
    link = "https://medias.boobyday.com/vidz/";
    link = link + nowUS + "-";
    //console.log(link);

    //marche pas
    /*
    //https://stackoverflow.com/questions/53749179/how-to-get-text-between-two-custom-html-tags-in-javascript
    const a = "/medias.boobyday.com\/vidz\/20220316-G8H7vz.mp4";
    var regex3 = /20220316-(.*?)\.mp4/g.exec(a);
    var clef = regex3[1];
    console.log(clef);
    console.log(link);*/

    //marche
    /*
    //https://www.youtube.com/watch?v=9BVw7OOdqU4
    //https://gist.github.com/magician11/ddb7828ddf0a48d3fa9efa06f3a35b92
    var endLink = ".mp4";
    const a = "/medias.boobyday.com\/vidz\/20220316-G8H7vz.mp4";
    var regex = new RegExp(nowUS + '-(.+)' + endLink);
    var clef = a.split(regex)[1];
    console.log(clef);

    link = link + clef + endLink;
    console.log(link);*/

    //https://stackoverflow.com/questions/5801453/in-node-js-express-how-do-i-download-a-page-and-gets-its-html
    //rien compris mais ça marche
    //https://stackoverflow.com/questions/6287297/reading-content-from-url-with-node-js


    const getScript = (url) => {
        return new Promise((resolve, reject) => {
            const http      = require('http'),
                https     = require('https');

            let client = http;

            if (url.toString().indexOf("https") === 0) {
                client = https;
            }

            client.get(url, (resp) => {
                let data = '';

                // A chunk of data has been recieved.
                resp.on('data', (chunk) => {
                    data += chunk;
                });

                // The whole response has been received. Print out the result.
                resp.on('end', () => {
                    resolve(data);
                });

            }).on("error", (err) => {
                reject(err);
            });
        });
    };

    (async (url) => {
        var a = await getScript(url); //code source de boobyday stocké dans a
        //console.log(a);
        //code à moi
        //pour le nom
        //console.log(nowUS);
        var regex2 = new RegExp(nowUS + '.:..model.:[0-9]+,.name.:.(.+)' + ".,.image"); //20220616":{"model":945,"name":"Madison","image
        var girlName = a.split(regex2)[1];
        //console.log(girlName);
        //pour la clef
        nowUS = "vidz.." + nowUS; //pour ne pas qu'il prenne depuis la thumbnail, .. = n'importe quel caractère, j'arriva a mette un antislash dans le regex (même en faisant \\)
        var endLink = ".mp4";
        var regex = new RegExp(nowUS + '-(.+)' + endLink);
        var clef = a.split(regex)[1];
        //console.log(clef);
        link = link + clef + endLink;
        console.log(link);

        //effacer de la bdd les server ou le bot n'est plus présent
        var tabb = Client.guilds.cache.map(guild => guild.id);//stocker les ID des server ou le bot est présent dans tabb
        // console.log(tabb)
        // console.log(tabb.indexOf(907027594761887784));
        // if(tabb.indexOf(907027594761887784) == -1){
        //     console.log("true");            
        // }
        for (let pas = 0; pas < bdd["lesServeurs"].length; pas++) {
            if(tabb.indexOf(bdd["lesServeurs"][pas]["server"]) === -1){//si le bot n'est plus dans le server présent dans bdd
                bdd["lesServeurs"].splice(pas, 1);//on le supprime lui + son channel + son nom de la bdd                
            }
        }
        SaveBdd();

        //Client.channels.cache.get(leSalonBooby).send("Nom : " + girlName + " ||@everyone||\n" + link);//on envoie le message dans le channel de test (ID)
        //bdd["lesServeurs"].forEach(element => console.log(element["channel"]));
        bdd["lesServeurs"].forEach(element => Client.channels.cache.get(element["channel"]).send("Nom : " + girlName + " ||@everyone||\n" + link));//on envoie le message dans le channel de test (ID));

        //fin code à moi
    })('https://boobyday.com/');
}


function SaveBdd(){
    fs.writeFile('./bdd.json', JSON.stringify(bdd, null, 4), (err)=> {
      if(err) console.log("Une erreur est survenue")
    })
}
function ReadBdd(){
    fs.readFile('./bdd.json', (err, data) => {
       if(err) console.log("Une erreur est survenue");
       let tempVariable = JSON.parse(data);
       console.log(tempVariable);
    })
}