const redisPubsubService = require('../services/redisPubSub.service')

class ProductServiceTest {
    purchaseProduct(productId, quantity){
        const order = {
            productId,
            quantity
        }
        console.log('productId: ', productId)
        redisPubsubService.publish(`purchase_events`, JSON.stringify(order))
    }
}

module.exports = new ProductServiceTest()