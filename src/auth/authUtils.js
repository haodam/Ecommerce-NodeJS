'use trict'

const JWT = require('jsonwebtoken');
const { AuthFailureError, NotFoundError } = require('../core/error.response');
const { asyncHandler } = require('../helpers/asyncHandler');
const { findByUserId } = require('../services/keyToken.service')


const HEADER = {
    API_KEY : 'x-api-key',
    CLIENT_ID: 'x-client-id',
    AUTHORIZATION : 'authorization',
    REFRESHTOKEN: 'x-rtoken-id'
}

const createTokenPair = async (payload, publicKey, privateKey) => {
    try {
        // auth token
        const accessToken = await JWT.sign(payload, publicKey, {
            //algorithm: 'RS256',
            expiresIn: '1 days'
        })

        // refresh token
        const refreshToken = await JWT.sign(payload, privateKey, {
            //algorithm: 'RS256',
            expiresIn: '7 days'
        })

        // verify key
        JWT.verify(accessToken, publicKey, (err, decode) => {
            if (err) {
                console.error(`error verify:: `, err)
            } else {
                console.log(`decode verify::`, decode)
            }
        });

        return {
            accessToken,
            refreshToken
        }
    } catch (error) {
        console.error(`createTokenPair error:: `, error);
    }
}

const authentication = asyncHandler (async (req, res, next) => {
    /*
        1 - check UserID missing
        2 - get accessToken
        3 - verifyToken
        4 - check use in dbs
        5 - check keyStore with this userId
        6 - oke all ==> return next
    */

    const userId = req.headers[HEADER.CLIENT_ID]
    if(!userId){
        throw new AuthFailureError('Invalid Request')
    }

    const keyStore = await findByUserId(userId)
    if(!keyStore){
        throw new NotFoundError('Not found keyStore')
    }

    const accessToken = req.headers[HEADER.AUTHORIZATION]
    if(!accessToken){
        throw new AuthFailureError('Invalid Request')
    }

    try {
        const decodeUser = JWT.verify(accessToken, keyStore.publicKey)
        if (userId !== decodeUser.userId){
            throw new AuthFailureError('Invalid Userid')
        }
        req.keyStore = keyStore
        return next()
        
    } catch (error) {
        throw error
    }
})


const authenticationV2 = asyncHandler (async (req, res, next) => {
    /*
        1 - check UserID missing
        2 - get accessToken
        3 - verifyToken
        4 - check use in dbs
        5 - check keyStore with this userId
        6 - oke all ==> return next
    */

    const userId = req.headers[HEADER.CLIENT_ID]
    if(!userId){
        throw new AuthFailureError('Invalid Request')
    }

    const keyStore = await findByUserId(userId)
    if(!keyStore){
        throw new NotFoundError('Not found keyStore')
    }

    if (req.headers[HEADER.REFRESHTOKEN]){
        try {
            const refreshToken = req.headers[HEADER.REFRESHTOKEN]
            const decodeUser = JWT.verify(refreshToken, keyStore.privateKey)
            if (userId !== decodeUser.userId){
                throw new AuthFailureError('Invalid Userid')
            }
            req.keyStore = keyStore
            req.user = decodeUser
            req.refreshToken = refreshToken

            return next()
            
        } catch (error) {
            throw error
        }
    }

    const accessToken = req.headers[HEADER.AUTHORIZATION]
    if(!accessToken){
        throw new AuthFailureError('Invalid Request')
    }

    try {
        const decodeUser = JWT.verify(accessToken, keyStore.publicKey)
        if (userId !== decodeUser.userId){
            throw new AuthFailureError('Invalid Userid')
        }
        req.keyStore = keyStore
        req.user = decodeUser // {userId , email}
        return next()
        
    } catch (error) {
        throw error
    }
})

const verifyJWT = async (token, keySecret) =>{
    return await JWT.verify(token, keySecret)
}

module.exports = {
    createTokenPair,
    authentication,
    authenticationV2,
    verifyJWT
}


