tmi = require("tmi.js")
const fs = require('fs');
//const player = require('play-sound')


twitchPass = "oauth:djm8ybqbrz8rojo817o8g74l0zawyt"
const options = {
    options:{
        debug: true,
    },
    connection:{
        cluster: 'aws',
        reconnect: true,
    },
    identity:{
        username: 'SouzBot',
        password: twitchPass,
    },
    channels: ['coachsouz'],


}; //BOT CONNECTION SETTINGS

const twitch = new tmi.client(options);
twitch.connect();
var now = new Date();

gameRunning = 0

function nextStream(){
    let days = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday', 'Saturday'];
    
    var now = new Date();

    let Sunday = "3pm - 9pm PST"
    //let Monday = ""
    //let Tuesday = "12pm - 5pm PST"
    let Wednesday = "6pm - 11pm PST"
    let Thursday = "6pm - 11pm PST"
    let Friday = "6pm - 11pm PST"
    let Saturday = "3pm - 9pm PST"

    let day = days[ now.getDay() ];
    let nextDay = days[ (now.getDay() + 1) % days.length ];

    console.log(day)
    console.log(nextDay)
    
    if(day == "Saturday"){
        twitch.say("coachsouz", "Today is " + day + ".  The next stream will be on Sunday, and will run from " + Sunday)
    }
    if(day == "Sunday"){
        twitch.say("coachsouz", "Today is Sunday, and the next scheduled stream is Wednesday from 6pm to 11pm")
    }
    if(day == "Monday"){
        twitch.say("coachsouz", "Today is Monday, and the next scheduled stream is Wednesday from 6pm to 11pm")
    }
    if(day == "Tuesday"){
        twitch.say("coachsouz", "Today is Tuesday, and the next scheduled stream is Wednesday from 6pm to 11pm")
    }
    if(day == "Wednesday"){
        twitch.say("coachsouz", "Today is " + day + ".  The next stream will be on " + nextDay + " and will run from " + Thursday)
    }
    if(day == "Thursday"){
        twitch.say("coachsouz", "Today is " + day + ".  The next stream will be on " + nextDay + " and will run from " + Friday)
    }
    if(day == "Friday"){
        twitch.say("coachsouz", "Today is " + day + ".  The next stream will be on " + "Saturday " + " and will run from " + Saturday)
    }
    console.log(now.getHours())
}
function sayDiscord(){
    twitch.say("coachsouz", "You can join the Coach on discord at https://discord.gg/shtJh9p ... I would love to play with REGULAR viewers and ppl that chat in my discord.")
}
function sayInstagram(){
    twitch.say("coachsouz", "Come support the channel by following my IG at www.instagram.com/coach_souz")
}
function sayTwitter(){
    twitch.say("coachsouz", "Come support the channel by following my Twitter at www.twitter.com/coach_souz")
}
function sayLoots(){
    twitch.say("Coachsouz", "Support the stream at no cost to you! Send me the loot!  https://loots.com/en/tip-jars/coachsouz")
}
function sayRoyale(){
    twitch.say("coachsouz", "Join the royale community here https://discord.gg/aYeCwmZ .. Be sure to type !referredby @twitch.tv/coachsouz in #commands after registration")
}

function sayRandom(){
    var rList = ["discord", "loots", "instagram", "royale", "twitter", "nextstreamday"]
    var rItem = rList[Math.floor(Math.random()*rList.length)];

    if(rItem == "discord"){
        sayDiscord()
    }
    if(rItem == "twitter"){
        sayTwitter()
    }
    if(rItem == "loots"){
        sayLoots()
    }
    if(rItem == "instagram"){
        sayInstagram()
    }
    if(rItem == "nextstreamday"){
        nextStream()
    }
    if(rItem == "royale"){
        sayRoyale()
    }
}



hour = (60 * 1000) * 15

//setInterval(sayRandom, hour);


twitch.on('chat', (channel, user, message, self) =>{
    owner = user['username']
    if(owner == 'coachsouz'){
        if(message.startsWith('!random')){
            var high = message.split(' ')[1]
            rNumber = Math.floor(Math.random() * high);
            console.log(rNumber)
            var numNotGuessed = 1;
            twitch.action("coachsouz", "********GUESS A RANDOM NUMBER BETWEEN 0 AND " + high + ".. SPAMMING NUMBERS ENCOURAGED*******")
            //while (numNotGuessed == 1){
            twitch.on('chat', (channel2, user2, message2, self2) =>{
                if ((message2 == rNumber) && (numNotGuessed == 1)){
                    wUser = user2["username"]
                    twitch.action("coachsouz", "Hey " + owner + ", " + wUser + " is the winner!!")
                    //load('./gamewon.mp3').then(play);
                    numNotGuessed = 0
                }
                if ((message2 == "!stop") && (owner == 'coachsouz')){
                    numNotGuessed = 0
                    twitch.action("coachsouz", "GAME ENDED, NO WINNER")
                }
            })
        }       
    }
});

twitch.on('chat', (channel, user, message, self) =>{
    if (message.startsWith("!discord")){
        sayDiscord()
    }
});

twitch.on('chat', (channel, user, message, self) =>{
    if (message.startsWith("!royale")){
        sayRoyale()
    }
});

twitch.on('chat', (channel, user, message, self) =>{
    if (message.startsWith("!nextstream")){
        nextStream()
    }
});

twitch.on('chat', (channel, user, message, self) =>{
    var player = user['username']
    if ((message.startsWith("!blackjack")) && (gameRunning == 0)){
        dealerTotal = Math.floor(rNumber(17, 25))
        //gameRunning = 1
        var cardDeck = ["K", "Q", "J", "A", 10, 9, 8, 7, 6, 5, 4, 3, 2]
        var playerTotal = 0
        var playerCards = 0
        //while (gameRunning == 1){
            while(playerCards < 2){
                var rCard = cardDeck[Math.floor(Math.random()*cardDeck.length)];
                if((rCard == "K") || (rCard == "Q") || (rCard == "J")){
                    playerTotal += 10
                }
                else if(rCard == "A"){
                    if(playerTotal > 10){
                        playerTotal += 1
                    }
                    else{
                        playerTotal += 11
                    }
                }
                else{
                    playerTotal += rCard
                }
                playerCards += 1
            }
            twitch.say("coachsouz", "You have a total of " + playerTotal + ".  Do you want to 'HIT' or 'STAND'?")
            twitch.on('chat', (channel2, user2, message2, self2) =>{
                var player2 = user2['username']
                if(player2 == player){
                    if (message2 == "HIT"){
                        rCard = cardDeck[Math.floor(Math.random()*cardDeck.length)];
                        if((rCard == "K") || (rCard == "Q") || (rCard == "J")){
                            playerTotal += 10
                        }
                        else if(rCard == "A"){
                            if(playerTotal > 10){
                                playerTotal += 1
                            }
                            else{
                                playerTotal += 11
                            }
                        }
                        else{
                            playerTotal += rCard
                        }
                        if(playerTotal == 21){
                            twitch.say("coachsouz", "Congratulations " + player + "... You have blackjack!")
                        }
                        if(playerTotal > 21){
                            twitch.say("coachsouz", "Sorry " + player + "... You have busted with a total of " + playerTotal)
                        }   
                    
                    }
                    if (message2 == "STAND"){
                        if(dealerTotal > playerTotal){
                            twitch.say("coachsouz", "Sorry, " + player + ".. The dealer won the game and had " + dealerTotal + " to your " + playerTotal)
                        }
                        if(dealerTotal < playerTotal){
                            twitch.say("coachsouz", "Congrats, " + player + "! You won the game and had " + playerTotal + " to the Dealer's " + dealerTotal)
                        }
                    }
                }

            });
        //}
    }
});

twitch.on('chat', (channel, user, message, self) =>{
    if(message.startsWith('!referredby')){
        fs.appendFileSync('referlog.txt', user["username"] + ": " + message + "\n", null, 2)
    }
});

/*twitch.on('chat', (channel, user, message, self) =>{
    lowerMessage = message.toLowerCase()
    if(message.startsWith(lowerMessage)){
        sayLoots()
    }
});*/

twitch.on('chat', (channel, user, message, self) =>{
    lowerMessage = message.toLowerCase()
    if(lowerMessage == '!loots'){
        sayLoots()
    }
});

twitch.on('chat', (channel, user, message, self) =>{
    if(message.startsWith('!instagram')){
        sayInstagram()
    }
});

twitch.on('chat', (channel, user, message, self) =>{
    if(message.startsWith('!twitter')){
        sayTwitter()
    }
});

