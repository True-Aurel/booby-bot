const puppeteer = require('puppeteer');//pupetter pour parcourir site web
require('dotenv').config();//pour le TOKEN dans le .env
const Discord = require("discord.js");

const { MessageEmbed } = require('discord.js');

const Client = new Discord.Client({
    intents: [
        Discord.Intents.FLAGS.GUILDS,
        Discord.Intents.FLAGS.GUILD_MESSAGES,
    ]
});

Client.on("ready",  () => {
    console.log("le bot est connecté");
    envoiJournalier();

});

Client.login(process.env.TOKEN);//token privé du robot dans le .env (les autres ne doivent pas avoir accès à ça)

Client.on("messageCreate",message => {
    if (message.author.bot) return; //si c'est le bot qui a écrit on fait rien    
    message.channel.send("yo");   
    
});

function envoiJournalier() {
    var now = new Date();
    var night = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate() +1,
      9, 0, 0
      /*now.getHours(),
      now.getMinutes()+1,
      now.getSeconds()*/
    );
    var msAvantEnvoi = night.getTime() - now.getTime();
  
    setTimeout(function() {
        getLinkAndName();
        envoiJournalier();    //     Then, reset again next midnight.
    }, msAvantEnvoi);
  }

  
function getLinkAndName() {
    var now = new Date(); //récupérer la date du jour
    var link = "https://boobyday.com/";
  
    var year = now.getFullYear();
    var mois = now.getMonth() + 1; //+1 janvier est 0
    var jour = now.getDate();
  
    if(mois < 10){ //pour qu'il mette bien le 0 si mois est < 10
        mois = "0"+ mois
    }
    if(jour < 10){ //pour qu'il mette bien le 0 si mois est < 10
      jour = "0"+ jour
    }
    var nowUS = year + "/" + mois + "/" + jour //date du jour dans le bon ordre
  
    //console.log(nowUS);// l'afficher
    console.log(now);
    link = link +nowUS;
    //console.log(link);
  
    (async () => {
      const browser = await puppeteer.launch({headless: true});    //passer headless a true pour ne pas voir chronium
      const page = await browser.newPage();                         //ouvrir le browser
      await page.goto(link);                                        //ouvrir ce lien
      let html = await page.content();                              //attendre quela page soit charger
      await page.click('#details-video-cache');                     //clicker sur la l'id #details-video-cache (méthode puppeteer  https://www.tabnine.com/code/javascript/functions/puppeteer/Page/click)
      
      
      const lienVideo = await page.evaluate(()=>{                  //pour pouvoir inspecter les éléments de la page
        let trueLink = document.querySelector('video').src           //chopper le lien de la video du jour (par rapport a la balise video)
        return trueLink;
      });
      const girlName = await page.evaluate(()=>{                  //pour pouvoir inspecter les éléments de la page
        let girlBooby = document.querySelector('#details-title').textContent //pour chopper le nom de la meuf
        return girlBooby;
      });
      console.log(lienVideo);
      console.log(girlName);
      await browser.close();

      Client.channels.cache.get("939071032386539630").send(girlName + " ||@everyone||\n" + lienVideo);//on envoie le message dans le channel de test (ID)
  
    })();
  }
  
