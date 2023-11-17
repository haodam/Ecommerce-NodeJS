
const Logger = require('../loggers/discord.log');

const pushToLogDiscord = async(req, res, next) => {
    try {
        Logger.sendToMessage(req.get('host'))
        return next();
        
    } catch (error) {
        next(error);
    }
}

module.exports = {
    pushToLogDiscord
}