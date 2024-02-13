'use strict'

const HEADER = {
    API_KEY : 'x-api-key',
    AUTHORIZATION : 'authorization'
}

const { finById } = require('../services/apiKey.service')

const apiKey = async(req, res, next) => {
    try {
        const key = req.headers[HEADER.API_KEY]?.toString()
        if( !key ){
            return res.status(403).json({
                message: 'Forbidden Error'
            })
        }

        // check objectKey
        const objKey = await finById(key)
        if (!objKey){
            return res.status(403).json({
                message: 'Forbidden Error'
            })
        }

        req.objKey = objKey
        return next()

    } catch (error) {
        
    }
}

const permission = ( permission ) => {
    return (req, res, next) => {
        if (! req.objKey.permissions){
            return res.status(403).json({
                message: 'Forbidden denied'
            })
        }

        console.log(`permissions::`, req.objKey.permissions)
        const valiPermission = req.objKey.permissions.includes(permission)
        if (! valiPermission){
            return res.status(403).json({
                message: 'Forbidden denied'
            })
        }

        return next()
    }
}


module.exports = {
    apiKey,
    permission,

}