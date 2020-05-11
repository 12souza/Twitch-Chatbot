tmi = require("tmi.js")
const fs = require('fs');

let rawdata = fs.readFileSync('sublist.json');
let rawdata2 = fs.readFileSync('referpoints.json');
let rawdata3 = fs.readFileSync('referrerEmail.json');
//let sublist = JSON.parse(rawdata);  

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






twitch.on('connected', (address, port) => {
    twitch.action('coachsouz', 'Hello, I am here baby');
    twitch.raw("CAP REQ :twitch.tv/tags")
    //twitch.action('coachsouz',  points)
});//JUST A MESSAGE ON CONNECT

function subMsg(){
    twitch.say("coachsouz", "Would you like to earn some money while supporting this channel?  Check out my new Subscriber Referral system here https://docs.google.com/document/d/1i5cCcMp70x4IlC9uRI-epwYCoNOLH3d-EJLU2AisVNg")
}

minThirty = (1000 * 60) * 30
setInterval(subMsg, minThirty)

var sublist = JSON.parse(rawdata); 
var referpoints = JSON.parse(rawdata2);
var referrerEmail = JSON.parse(rawdata3);


function syncObj(){
    let rawdata = fs.readFileSync('sublist.json');
    sublist = JSON.parse(rawdata);
    console.log(sublist)
}

twitch.on('chat', (channel, user, message, self) =>{
    referee = user['username'].toLowerCase()
    isSub = user["subscriber"]
    if(message.startsWith('!referredby')){
        var referer = message.split(' ')[1].toLowerCase()
        //referer = refererR
        if(referee == referer){
            twitch.whisper(referee, "You can not refer yourself..")
        }
        else{     
            if (!(referee in sublist)){
                //fs.appendFileSync('referlog.txt', referee + ": " + message, null, 22)
                console.log(isSub)
                if(isSub == true){
                    sublist[referee] = referer
                    referpoints[referer] = 0
                    referpoints[referer] = referpoints[referer] + 1
                    fs.writeFileSync('sublist.json', JSON.stringify(sublist, null, 2));
                    fs.writeFileSync('referpoints.json', JSON.stringify(referpoints, null, 2))
                    twitch.say(referee, "User is already a subscriber.  " + referer + " has been awarded one referral point and is now connected to that user")
                }
                else{
                    sublist[referee] = referer
                    fs.writeFileSync('sublist.json', JSON.stringify(sublist, null, 2));
                    twitch.say(referee, referee + " is now connected to " + referer + " as a sub referral.")
                    referpoints[referer] = 0
                    fs.writeFileSync('referpoints.json', JSON.stringify(referpoints, null, 2))
                    //console.log(isSub)
                    //console.log(referee)
                }
                
            }
            else{
                twitch.say(referee, referee + " is already connected to a user.")
            }
        }
    }
});

twitch.on('chat', (channel, user, message, self) =>{
    bChecker = user['username'].toLowerCase()
    if(message.startsWith('!balance')){
        if(bChecker in referpoints){
            userBalance = referpoints[bChecker] * 1.00
            twitch.say("coachsouz", bChecker + " you have a balance of $" + userBalance)
        }
        else{
            twitch.say("coachsouz", bChecker + " you currently have no referrals..")
        }
    }
});

twitch.on('chat', (channel, user, message, self) =>{
    user = user['username'].toLowerCase()
    if(message.startsWith('!paypal')){
        var userEmail = message.split(' ')[1]
        referrerEmail[user] = userEmail
        fs.writeFileSync('referrerEmail.json', JSON.stringify(referrerEmail, null, 2));
        twitch.say("coachsouz", user + ", your paypal is now registered as " + userEmail)
    }
});

twitch.on('whisper', (channel, user, message, self) =>{
    user = user['username'].toLowerCase()
    if(message.startsWith('!paypal')){
        var userEmail = message.split(' ')[1]
        referrerEmail[user] = userEmail
        fs.writeFileSync('referrerEmail.json', JSON.stringify(referrerEmail, null, 2));
        twitch.whisper(user, "Your paypal is now registered as " + userEmail)
    }
});

twitch.on('whisper', (channel, user, message, self) =>{
    bChecker = user['username'].toLowerCase()
    if(message.startsWith('!balance')){
        if(bChecker in referpoints){
            userBalance = referpoints[bChecker] * 1.00
            twitch.whisper(bChecker, bChecker + " you have a balance of $" + userBalance)
        }
        else{
            twitch.whisper(bChecker, bChecker + " you currently have no referrals..")
        }
    }
});

twitch.on("subscription", (channel, username, method, message, userstate) => {
    user = username.toLowerCase()
    referrer = sublist[user]
    if(user in sublist){
        referpoints[referrer] = referpoints[referrer] + 1
        fs.writeFileSync('referpoints.json', JSON.stringify(referpoints, null, 2))
        twitch.say("coachsouz", "Thank you for subscribing " + username + ".  " + referrer + " has been given credit for one referral!")
    }
    else{
        twitch.say("coachsouz", "Thank you " + username + " for subscribing!")
    }
});

twitch.on("subgift", (channel, username, streakMonths, recipient, methods, userstate) => {
    
    referer = username.toLowerCase()
    referee = recipient.toLowerCase()

    if(!(referee in sublist)){
        sublist[referee] = referer
        fs.writeFileSync('sublist.json', JSON.stringify(sublist, null, 2));
        referpoints[referer] = referpoints[referer] + 1
        fs.writeFileSync('referpoints.json', JSON.stringify(referpoints, null, 2))
        twitch.say("coachsouz", referee + " is not connected to user " + referer)
    }
    else{
        twitch.say("coachsouz", referee + " is already connected to a user..  Thank you for the gifted sub!")
    }
    let senderCount = ~~userstate["msg-param-sender-count"];
});

twitch.on("resub", (channel, username, months, message, userstate, methods) => {
    user = username.toLowerCase()
    referrer = sublist[user]
    if(user in sublist){
        referpoints[referrer] = referpoints[referrer] + 1
        fs.writeFileSync('referpoints.json', JSON.stringify(referpoints, null, 2))
        twitch.say("coachsouz", "Thank you for the re-sub! " + username + ".  " + referrer + " has been given credit for one referral!")
    }
    else{
        twitch.say("coachsouz", "Thank you " + username + " for resubscribing!")
    }
    let cumulativeMonths = ~~userstate["msg-param-cumulative-months"];
});
