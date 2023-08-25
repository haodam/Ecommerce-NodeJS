'use trict'

//const mongoose = require('mongoose'); // Erase if already required
const {model, Schema, Types} = require('mongoose')

const DOCUMENT_NAME = 'Shop'
const COLLECTION_NAME = 'Shops'

// Declare the Schema of the Mongo model
var shopSchema = new Schema({
    name:{
        type: String,
        trim: true,
        maxLength: 150
    },
    email:{
        type: String,
        required: true,
        trim: true,
    },
    password:{
        type: String,
        required: true,
    },
    status:{
        type: String,
        enum:['active','inactive'],
        default:'inactive',
    },
    verify:{
        type: Schema.Types.Boolean,
        default: false,
    },

    roles:{
        type: Array,
        default: [],
    }
}, {
    collection: COLLECTION_NAME,
    timestamps: true,
});

//Export the model
module.exports = model(DOCUMENT_NAME, shopSchema);