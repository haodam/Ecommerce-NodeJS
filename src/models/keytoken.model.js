'use trict'

// Save user ID , public Key, Refresh Token

const {Schema, model} = require("mongoose");

const DOCUMENT_NAME = 'Key';
const COLLECTION_NAME = 'Keys';

const keyTokenSchema = Schema({
    user: {
        type: Schema.Types.ObjectId,
        trim: true,
        ref: 'Shop'
    },
    publicKey: {
        type: String,
        trim: true
    },
    privateKey: {
        type: String,
        trim: true
    },
    refreshTokensUsed: {
        type: Array,
        default: [] // Nhung RT da duoc su dung
    },
    refreshToken: {
        type: Array,
        require: true
    }
}, {
    timestamps: true,
    collection: COLLECTION_NAME
});


module.exports = model(DOCUMENT_NAME, keyTokenSchema)