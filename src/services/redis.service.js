
const redis = require('redis')
const { reservationInventory } = require('../models/repository/inventory.repo')
const { promisify } = require('util')
const redisClient = redis.createClient()


const pexpire = promisify(redisClient.pexpire).bind(redisClient)
const setnxAsync = promisify(redisClient.setnx).bind(redisClient)

const acquireLock = async ( productId , quantity, cartId ) => {

    const key = `lock_v2023_${productId}`
    const retryTimes = 10
    const expireTime = 3000

    for (let i = 0; i < retryTimes.length; i++) {
        // Tao mot key ai nam giu key do thi dc vao thanh toan
        const result = await setnxAsync(key, expireTime)
        console.log(`result:::`, result)
        if(result === 1){
            // thao tac voi inventory
            const isReversation = await reservationInventory({productId , quantity, cartId})
            if(isReversation.modifiedCount){ // Kiem tra isReversation co lon hon khong ko
                await pexpire(key, expireTime)
                return key
            }
            return null
        }else {
            await new Promise((resolve) => setTimeout(resolve, 50))
        }
    }
}

// Giai phong lock
const releaseLock = async keyLock => {
    const delAsyncKey = promisify(redisClient.setnx).bind(redisClient)
    return await delAsyncKey(keyLock)
}

module.exports = {
    acquireLock,
    releaseLock
}