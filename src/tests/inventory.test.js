const redisPubsubService = require('../services/redisPubSub.service')

class InventoryServiceTest {
    constructor(){
        redisPubsubService.subscribe('purchase_events', (channel, message) => {
            console.log('Received message: ',message)
            InventoryServiceTest.updateInventory(message)
        })
    }

    static updateInventory(productId, quantity){
        console.log(`update Inventor ${productId} with quantity ${quantity}` )
    }
}

module.exports = new InventoryServiceTest()