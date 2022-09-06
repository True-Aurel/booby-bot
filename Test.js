// require('dotenv').config();//pour le TOKEN dans le .env
// const Discord = require("discord.js");
// const { MessageEmbed } = require('discord.js');

// let tab;
// const paragraph = '691290712163090522 907027594761887784';

// // any character that is not a word character or whitespace
// const regex = /[^465213678751646]/g;

// console.log(paragraph.search(regex));
// // expected output: 43

/*var scores = [10, 20, 30, 10, 40, 20];

var lesIDs = [691290712163090522, 907027594761887784, 888888888888888888 ]
var lesIDc= [6]*/

// console.log(tab.length);

// console.log(lesID.indexOf(691290712163090522));

// lesID[lesID.length] = 99999;
// console.log(lesID);

/*temp = 888888888888888888;
console.log(lesIDs);

if(lesIDs.indexOf(temp) == -1){ //si il y a pas l'id, dans le tableau, du server d'où provient le message
    lesIDs[lesIDs.length] = temp;//on rajoute l'id dans le tableau
}
console.log(lesIDs)*/

var lesServer = [691290712163090522, 907027594761887784, 888888888888888888];
var lesSalonsBooby = [777777777777777777, 444444444444444444, 555555555555555555];

var tempServer = 907027594761887784;
var tempSalon = 444444444444444444;

console.log(lesServer);
console.log(lesSalonsBooby);

if(lesServer.indexOf(tempServer) == -1){ //si il y a pas l'id du serveur (du message) n'est pas présent dans le tableau
    lesServer[lesServer.length] = tempServer;//on rajoute l'id dans le tableau lesServer[]
                
    if(lesSalonsBooby.indexOf(tempSalon) == -1){ //si l'id du salon (du message) n'est pas présent dans le tableau
        lesSalonsBooby[lesSalonsBooby.length] = tempSalon;//on rajoute l'id dans le tableau lesSalonsBooby[]
    }
}
else{//si l'id du server existe dans le tableau
    lesSalonsBooby[lesServer.indexOf(tempServer)] = tempSalon;  //on remplace l'ancien salon par le nouveau 
                                                                //(ne pas oublier que le server eu son salon sont à la mêm position dans les 2 tableau)
}



console.log(lesServer);
console.log(lesSalonsBooby);

for (let pas = 0; pas < lesServer.length; pas++) {
    console.log(lesServer[pas]);
}

