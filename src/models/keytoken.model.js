'use trict'

// Save user ID , public Key, Refresh Token

const { Schema, model} = require('mongoose'); // Erase if already required

const DOCUMENT_NAME = 'Key'
const COLLECTION_NAME = 'Keys'

// Declare the Schema of the Mongo model
var keyTokenSchema = new Schema({
    user:{
        type: Schema.Types.ObjectId,
        require: true,
        ref: 'Shop'
       
    },
    publicKey:{
        type: String,
        required: true  
    },
    refreshToken:{
        type: Array, 
        default: []
    }
}, {
    collection: COLLECTION_NAME,
    timeseries: true
});

//Export the model
module.exports = model(DOCUMENT_NAME, keyTokenSchema);