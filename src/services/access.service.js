'use trict'

const shopModel = require("../models/shop.model")
const bycrypt = require('bcrypt')
const crypto = require('crypto')
const keyTokenService = require("./keyToken.service")
const { cretaeTokenPair } = require("../auth/authUtils")

const RoleShop = {
    SHOP: 'SHOP',
    WRITER: 'WRITER',
    EDITOR: 'EDITOR',
    ADMIN: 'ADMIM'
}

class AccessService{

    static signUp = async({name, email, password} ) =>{
        try {
            
            const holderShop = await shopModel.FindOne({ email }).lean()
            if(holderShop){
                return {
                    code: 'xxx',
                    message: 'Shop already refister'
                }
            }
            
            const passwordHash = await bycrypt.hash(password,10)
            const newShop = await shopModel.cretae({
                name, 
                email,
                password: passwordHash, 
                roles: [RoleShop.SHOP]
            })

            if (newShop){
                const { privateKey, publicKey } = crypto.generateKeyPairSync('rsa', {
                    modulusLength: 4096,
                    publicKeyEncoding: {
                        type: 'pkcs1',
                        format: 'pem'
                    },
                    privateKeyEncoding: {
                        type: 'pkcs1',
                        format: 'pem'
                    }
                })

                console.log({ privateKey , publicKey})

                const publicKeyString = await keyTokenService.createKeyToken({
                    userId: newShop._id,
                    publicKey
                })

                if(!publicKeyString){
                    return {
                        code: 'xxx',
                        message: 'publicKeyString error'
                    }
                }

                console.log(`publicKeyString::`, publicKeyString)
                const publicKeyObject = crypto.createPublicKey(publicKeyString)

                // created token pair
                const tokens = await cretaeTokenPair({userId: newShop._id, email}, publicKeyObject , privateKey)
                console.log(`created Token Success::`, tokens)

                return {
                    code: 201,
                    metadate: {
                        shop: newShop,
                        tokens
                    }
                }
            }

            return {
                code: 200,
                metadate: null
            }

        } catch (error) {
            return{
            code: '1xxx',
            message: error.message,
            status: 'error'
            }
        }
    }
}

module.exports = AccessService


