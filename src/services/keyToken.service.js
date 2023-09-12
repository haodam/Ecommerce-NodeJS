'use trict'

const keytokenModel = require("../models/keytoken.model")
const { Types: { ObjectId } } = require('mongoose')

class KeyTokenService {
    static createKeyToken = async ( {userId, publicKey, privateKey, refreshToken }) => {
        try {

            // const tokens = await keytokenModel.create({
            //     user: userId,
            //     publicKey,
            //     privateKey
            // })

            const filter = {user: userId}, update = {
                publicKey , privateKey, refreshTokensUsed: [], refreshToken
            }, options = { upsert: true, new: true }

            const tokens = await keytokenModel.findOneAndUpdate(filter, update, options)

            return tokens ? tokens.publicKey : null

        } catch (error) {
            return error
        }
    }

    static findByUserId = async (userId) => {
        return await keytokenModel.findOne({ user: new ObjectId(userId) }).lean();
    }

    static removeKeyById = async (id) => {
        return await keytokenModel.deleteOne({ _id: new ObjectId(id) });
    }

    static findByRefreshTokenUsed = async (refreshToken) => {
        return await keytokenModel.findOne({ refreshTokensUsed: refreshToken }).lean()
    }

    static findByRefreshToken = async (refreshToken) => {
        return await keytokenModel.findOne({ refreshToken })
    }

    static deleteKeyById = async (userId) => {
        return await keytokenModel.deleteOne({ user: new ObjectId(userId)})
    }
}

module.exports = KeyTokenService