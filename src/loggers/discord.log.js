
const { Client, GatewayIntentBits} = require('discord.js')
const{ CHANNEL_ID_DISCORD, TOKEN_DISCORD } = process.env

class LoggerService {
    constructor() {
        this.client = new Client({
            intents: [
                GatewayIntentBits.DirectMessages,
                GatewayIntentBits.Guilds,
                GatewayIntentBits.GuildMessages,
                GatewayIntentBits.MessageContent
            ]
        })

        // add channel ID
        this.channelId = CHANNEL_ID_DISCORD
        this.client.on('ready', () =>{
            console.log(`Logged is as ${this.client.user.tag}`)
        })
        this.client.login(TOKEN_DISCORD)      
    }

    sendToMessage(message = 'message') {
        const channel = client.channels.cache.get(this.channelId)
        if(!channel){
            console.error(`Could not find the channel...`, this.channelId)
            return
        }

        channel.send(message).cache(e => console.error(e))
    }

}

module.exports = new LoggerService()