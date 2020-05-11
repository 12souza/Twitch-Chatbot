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

