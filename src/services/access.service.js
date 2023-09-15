'use strict'

const shopModel = require("../models/shop.model")
const bcrypt = require('bcrypt')
const crypto = require('node:crypto')
const KeyTokenService = require("./keyToken.service")
const { createTokenPair, verifyJWT } = require("../auth/authUtils")
const { getInfoData } = require("../utils")
const {BadRequestError ,BusinessLogicError, AuthFailureError, ForbiddenError} = require("../core/error.response");
const { findByEmail } = require("./shop.service")

const RoleShop = {
    SHOP: 'SHOP',
    WRITER: 'WRITER',
    EDITOR: 'EDITOR',
    ADMIN: 'ADMIN'
}

class AccessService{


    /*
        check this token used
    */
        handlerRefreshTokenV2 = async ({ keyStore, user , refreshToken } ) =>{

            const { userId, email } = user;

            if (keyStore.refreshTokensUsed.includes(refreshToken)){
                await KeyTokenService.deleteKeyById(userId)
                throw new ForbiddenError('Something wrong happend !! Pls relogin')
            }
            if (KeyStore.refreshToken !== refreshToken) throw new AuthFailureError('Shop not registeted')
            // Check UserId
            const foundShop = await findByEmail( {email} )
            if(!foundShop){
                throw new AuthFailureError('Shop not registeted')
            }
            // Create accessToken and refreshToken
            const tokens = await createTokenPair({ userId , email }, keyStore.publicKey, keyStore.privateKey)
            // Update Token new
            /*
                holderToken.refreshToken = tokens.refreshToken
                holderToken.refreshTokensUsed.push(refreshToken)
                await holderToken.save({
            */
            await keyStore.update({
                $set: {
                    refreshToken: tokens.refreshToken
                },
                $addToSet: {
                    refreshTokensUsed: refreshToken // Da duoc su dung de lay token moi
                }
            })
    
            return {
                user,
                tokens
            }
        }

    /*
        check this token used
    */
    handlerRefreshToken = async ( refreshToken ) =>{
        // kiem tra token nay da duoc su dung hay chua?
        const foundToken = await KeyTokenService.findByRefreshTokenUsed(refreshToken)
        if(foundToken){
            // decode
            const {userId, email} = await verifyJWT(refreshToken, foundToken.privateKey)
            console.log(userId, email)
            // delete token in keyStore
            await KeyTokenService.deleteKeyById(userId)
            throw new ForbiddenError('Something wrong happend !! Pls relogin')
        }

        // NO
        const holderToken = await KeyTokenService.findByRefreshToken(refreshToken)
        if( !holderToken ){
            throw new AuthFailureError('Shop not registeted')
         }

        // Verify Token
        const {userId, email} = await verifyJWT(refreshToken, holderToken.privateKey)
        console.log(['2---'], userId, email)

        // Check UserId
        const foundShop = await findByEmail( {email} )
        if(!foundShop){
            throw new AuthFailureError('Shop not registeted')
        }

        // Create accessToken and refreshToken
        const tokens = await createTokenPair({ userId , email }, holderToken.publicKey, holderToken.privateKey)

        // Update Token new
        /*
            holderToken.refreshToken = tokens.refreshToken
            holderToken.refreshTokensUsed.push(refreshToken)
            await holderToken.save({
        */
        await holderToken.update({
            $set: {
                refreshToken: tokens.refreshToken
            },
            $addToSet: {
                refreshTokensUsed: refreshToken // Da duoc su dung de lay token moi
            }
        })

        return {
            user: {userId , email},
            tokens
        }
    }

    logout = async( keyStore ) => {

        const delKey = await KeyTokenService.removeKeyById(keyStore._id)
        console.log({delKey})
        return delKey
    }
    /*
        1 -  check email in dbs
        2 - match password
        3 - create AT and RT and save
        4 - generate tokens
        5 - get data return login
    */
    login = async({email, password, refreshToken = null }) => {

        const foundShop = await findByEmail({email})
        if (!foundShop){
            throw new BadRequestError('Shop not registered')
        }

        const match = bcrypt.compare(password, foundShop.password)
        if(!match){
            throw new AuthFailureError('Authentication error')
        }

        const privateKey = crypto.randomBytes(64).toString('hex')
        const publicKey = crypto.randomBytes(64).toString('hex')

        const {_id: userId} = foundShop
        const tokens = await createTokenPair({ userId , email }, publicKey, privateKey)

        await KeyTokenService.createKeyToken({
            userId,
            refreshToken: tokens.refreshToken,
            privateKey, 
            publicKey
        })

        return {       
            shop: getInfoData({fileds: ['_id', 'name', 'email'], object: foundShop}),
            tokens
        }
    }

    signUp = async ({name, email, password}) => {

        // step1: check email exists?
        const holderShop = await shopModel.findOne({email}).lean()
        if (holderShop) {
            throw new BadRequestError('Error: Shop already registered!')
        }

        const passwordHash = await bcrypt.hash(password, 10)

        const newShop = await shopModel.create({
            name, email, password: passwordHash, roles: [RoleShop.SHOP]
        })

        if (newShop) {
            // Create privateKey , PublicKey
            // const {privateKey, publicKey} = crypto.generateKeyPairSync('rsa', {
            //     modulusLength: 4096,
            //     publicKeyEncoding: {
            //         type: 'pkcs1',
            //         format: 'pem'
            //     },
            //     privateKeyEncoding: {
            //         type: 'pkcs1',
            //         format: 'pem'
            //     }
            // })

            const privateKey = crypto.randomBytes(64).toString('hex')
            const publicKey = crypto.randomBytes(64).toString('hex')


            // Save collection KeyStore
            console.log({ privateKey, publicKey })

            const KeyStore = await KeyTokenService.createKeyToken({
                userId: newShop._id,
                publicKey,
                privateKey
            }) 

            if(!KeyStore){
                throw new BadRequestError('Error: Key Store already registered!')
                return
            }

            const tokens = await createTokenPair({userId: newShop._id, email}, publicKey, privateKey)
            console.log(`Create Token Success::`, tokens)

            return {
                code: 201,
                metadata: {
                    shop: getInfoData({fileds: ['_id', 'name', 'email'], object: newShop}),
                    tokens
                }
            }         
        }

        return{
            code: 200,
            metadata: null
        }

    }
}

module.exports = new AccessService()


