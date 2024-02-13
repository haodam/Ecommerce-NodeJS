
const { BadRequestError, NotFoundError } = require("../core/error.response");
const { getDiscountAmount } = require("./discount.service");

const {
    findCartById
} = require('../models/repository/cart.repo')

const {
    checkProductByServer
} = require('../models/repository/product.repo');
const { acquireLock, releaseLock } = require("./redis.service");
const { order } = require("../models/order.model");


class CheckOutService {

    /* Payload
        {
            cartId,
            userId,
            shop_order_ids: [
                {
                    shopId,
                    shop_discounts: []
                    item_product: [
                        {
                            price,
                            quantity,
                            productId
                        }
                    ],
                    shopId,
                    shop_discounts: []
                    item_product: [
                        {
                            price,
                            quantity,
                            productId
                        }
                    ]
                }
            ]
        }
    */
    static async checkoutReview({ cartId, userId, shop_order_ids }){

        // kiem tra cartId co ton tai hay khong
        const foundCart = await findCartById(cartId)
        if(!foundCart) throw new BadRequestError('Cart does not exits!')

        const checkout_order = {
            totalPrice: 0, // tong tien hang
            freeShip: 0, // phi van chuyen
            totalDiscount: 0 , // tong tien discount giam gia
            totalcheckout: 0 // tong tien thanh toan 
        },shop_order_ids_new = [] // tao mot mangtinh tong so tien VD price: 10 , quantitt: 2 thi tong se la 20

        // tinh tong tien hoa don
        for (let i = 0; i<shop_order_ids.length; i++) {
            const {shopId, shop_discounts = [], itemProducts = []} = shop_order_ids[i]

            // check product available
            const checkProductServer = await checkProductByServer(itemProducts)
            if (!checkout_order[0]) throw new BadRequestError('Order invalid')

            // sum total order
            const checkoutPrice = checkProductServer.reduce((acc, product) => {
                return acc + (product.quantity * product.price)
            }, 0)

            // total before
            checkout_order.totalPrice = +checkoutPrice

            const itemCheckout = {
                shopId,
                shop_discounts,
                priceRow: checkoutPrice, // tien truoc khi giam gia
                priceApplyDiscount: checkoutPrice,
                item_products: checkProductServer
            }

            // neu shop_discocunt ton tai ma co don hang lon hon 0 check xem co hop le ko
            if (shop_discounts.length > 0) {
                const { totalPrice, discount = 0 } = await getDiscountAmount({
                    codeId: shop_discounts[0].codeId,
                    userId,
                    shopId,
                    products: checkProductServer
                })
                checkout_order.totalDiscount +=discount

                // neu tien giam gia lon hon 0
                if (discount > 0) {
                    itemCheckout.priceApplyDiscount = checkoutPrice - discount
                }
            }

            // tong thanh toan cuoi cung
            checkout_order.totalCheckout += itemCheckout.priceApplyDiscount
            shop_order_ids_new.push(itemCheckout)
        }

        return {
            shop_order_ids,
            shop_order_ids_new,
            checkout_order
        }
    }

    // Order

    static async orderByUser ({ shop_order_ids, cartId, userId, user_address= {}, user_payment ={} }){

        const { shop_order_ids_new, checkout_order } = await CheckOutService.checkoutReview({
            cartId,
            userId,
            shop_order_ids
        })

        // Kiem tra lai mot lan nua xem vuot qua hang ton kho hay khong
        // lay danh sach san pham
        const products = shop_order_ids_new.flatMap( order => order.item_products )
        console.log(`[1]:`,products)
        const acquireProduct = []
        for (let i = 0; i < products.length; i++) {
            const { quantity, productId } = products[i];
            const keyLock = await acquireLock(quantity, productId, cartId)
            acquireProduct.push(keyLock ? true: false)
            if(keyLock){
                await releaseLock(keyLock)
            }
        }

        // kiem tra neu co mot san pham het han trong kho
        if(acquireProduct.includes(false)){
            throw new BadRequestError('Mot so san pham da duoc cap nhat, vui long quay lai gio hang ... ')
        }
        const newOrder = await order.create({
            order_userId: userId,
            order_checkout: checkout_order,
            order_Shipping: user_address,
            order_payment: user_payment,
            order_products: shop_order_ids_new
        })

        // Neu insert thanh cong thi se xoa san pham co trong gio hang
        if(newOrder){
            // remove product in my cart
        }

        return newOrder
    }

   /*
        Query Orders [User]
   */
   static async getOrderByUser(){

   }

   /*
        Query Orders Using Id [User]
   */
    static async getOneOrderByUser(){

    }

    /*
        Cancel Order [User]
   */
   static async cancelOrderByUser(){

   }

   /*
        Update Order Status [ Shop | User ]
   */
    static async updateOrderStatusByShop(){

    }

}

module.exports = CheckOutService