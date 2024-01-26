
const Redis = require('redis');

class RedisPubSubService {

    constructor(){
        this.subscriber = Redis.createClient();
        this.publish = Redis.createClient();

    }
    publish(channel, message) {
        return new Promise( (resovel, reject) => {
            this.publish(channel, message, (err, reply) => {
                if (err){
                    reject(err);
                }else{
                    resovel(reply)
                }
            })
        })
    }

    subscriber(channel, callback) {
        this.subscriber.subscriber(channel)
        this.subscriber.on('message', (subscriberChannel, message) => {
            if(channel === subscriberChannel){
                callback(channel, message)
            }
        })
    }
}

module.exports = new RedisPubSubService();
