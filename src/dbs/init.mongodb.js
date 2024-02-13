'use trict'

const mongoose = require('mongoose');
const { db: { host , name , port } } = require('../configs/config.mongodb')
const connectString = `mongodb://${port}/${name}`
const { countConnect } = require('../helpers/check.connect')

console.log(`connectString:`, connectString)

class Database{
    constructor(){
        this.connect()
    }

    // Connect
    connect(type = 'mongodb'){
        if(1 === 1){
            mongoose.set('debug', true)
            mongoose.set('debug',{color: true})
        }

        mongoose.connect(connectString, {
            maxConnecting: 50
        }).then( _ => console.log(`Connected Monggodb Success`, countConnect))
        .catch(err => console.log(`Error Connect!`))
    }

    static getInstance(){
        if(!Database.instance){
            Database.instance = new Database()
        }

        return Database.instance
    }
}

const instanceMongodb = Database.getInstance()
module.exports = instanceMongodb