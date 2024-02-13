
const { BadRequestError, NotFoundError } = require("../core/error.response")
const  discount  = require("../models/discount.model")
const { findAllProducts } = require("../models/repository/product.repo")
const {convertToObjectIdMongodb} = require("../utils")
const { 
    finAllDiscountCodeUnSelect,
    finAllDiscountCodeSelect,
    checkDiscountExists,
    findDiscountByCode
 } = require('../models/repository/discount.repo');



/*
    Discount Service
    1 - Generrator discount code [Shop | Admin ]
    2 - Get discount amount [User]
    3 - Get all discount codes [User | Shop]
    4 - Verify discount code [User]
    5 - Delete discount code [Admin | Shop]
    6 - Cancel discount code [User]

*/


class DiscountService {

    static async createDiscountCode( payload ){
        const {
            code, start_date, end_date, is_activate,
            shopId, min_order_value, product_ids, applies_to, name,
            description, type, value, max_value, max_uses, uses_count, users_used, max_uses_per_user
        } = payload

        // kiem tra
        // if(new Date() > new Date(start_date) || new Date > new Date(end_date)){
        //     throw new BadRequestError('Discount code has exproed')
        // }

        // if (new Date(end_date) < new Date(start_date)) {
        //     throw new BusinessLogicError('End date more than start date')
        // }

        // create index for discount code
        const foundDiscount = await discount.findOne({
                discount_code: code,
                discount_ShopId: convertToObjectIdMongodb(shopId)
        }).lean()

        if(foundDiscount && foundDiscount.discount_is_active){
            throw new BadRequestError("Discount exists!")
        }

        const newDiscount = await discount.create({
            discount_name: name,
            discount_description: description,
            discount_type: type,
            discount_code: code,
            discount_value: value,
            discount_min_order_value: min_order_value || 0,
            discount_max_value: max_value,
            discount_start_date: new Date(start_date),
            discount_end_date: new Date(end_date),
            discount_max_uses: max_uses,
            discount_uses_count: uses_count,
            discount_users_used: users_used, 
            discount_shopId: shopId,
            discount_max_uses_per_user: max_uses_per_user,
            discount_is_active: is_activate,
            discount_applies_to: applies_to,
            discount_product_ids: applies_to === 'all' ? [] : product_ids
        })

        return newDiscount
    }

    static async updateDiscountCode(){

    }

    /*
        get all discount code of Shop
    */

    static async getAllDiscountCodesByShop({ limit, page, shopId }) {
        const discounts = await finAllDiscountCodeSelect({
            limit: +limit,
            page: +page,
            filter: {
                discount_shopId: convertToObjectIdMongodb(shopId),
                discount_is_active: true,
            },
            select: ['discount_code', 'discount_name'],
            model: discount,
        })
        
        return discounts
    }

    static async getDiscountAmount({ codeId, userId, shopId, products }) {

        const foundDiscount = await checkDiscountExists({
            model: discount,
            filter: {
                discount_code: codeId,
                discount_ShopId: convertToObjectIdMongodb(shopId)
            }
        })

        //const foundDiscount = await findDiscountByCode({ codeId, shopId })
        console.log(`----`,foundDiscount)

        if(!foundDiscount){
            throw new NotFoundError(`discount doesn't exitst`)
        }

        const {
            discount_is_active,
            discount_max_uses, 
            discount_min_order_value, 
            discount_users_used,
            discount_max_uses_per_user,
            discount_type,
            discount_value,
            discount_start_date,
            discount_end_date
        } = foundDiscount

        if(!discount_is_active) throw new NotFoundError(`discount expried!`)
        if(!discount_max_uses) throw new NotFoundError(`discount are out!`)

        if(new Date() < new Date(discount_start_date) || new Date() > new Date(discount_end_date)){
            throw new NotFoundError(`discount code has expried!`)
        }

        // check xem co gia tri toi thieu khong
        let totalOrder = 0
        if(discount_min_order_value > 0){
            // get total
            totalOrder = products.reduce((acc, product) => {
                return acc + (product.quantity * product.price)
            },0)

            if(totalOrder < discount_min_order_value){
                throw new NotFoundError(`discount requires a minium order value of ${discount_min_order_value}`)
            }
        }

        if(discount_max_uses_per_user > 0){
            const userUserDiscount = discount_users_used.find(user => user.userId === userId)
            if(userUserDiscount){
                // ...
            }
        }

        // check xem discount nay la fixed_amount - 
        const amount = discount_type === 'fixed_amount' ? discount_value : totalOrder * (discount_value / 100)

        return {
            totalOrder,
            discount: amount,
            totalPrice: totalOrder - amount
        }
    }

    // Delete Discount

    static async deleteDiscountCode({shopId, codeId}){
        const deleted = await discount.findOneAndDelete({
            discount_code: codeId,
            discount_ShopId: convertToObjectIdMongodb(shopId)
        })
        return deleted
    }

    // Cancel Discount

    static async cancelDiscountCode({codeId, shopId, userId}){
        const foundDiscount = await checkDiscountExists({
            model: discount,
            filter: {
                discount_code: codeId,
                discount_ShopId: convertToObjectIdMongodb(shopId)
            }
        })

        if(!foundDiscount) throw new NotFoundError(`discount doesn't exitst`)

        const result = await discount.findByIdAndUpdate(foundDiscount._id, {
            $pull:{
                discount_users_used: userId,
            },
            $inc: {
                discount_max_uses: 1,
                discount_uses_count: -1
            }
        })

        return result
    }

    // get all discount codes available with product

    static async getAllDiscountCodesWithProduct({ code, shopId, limit, page }) {
        // create index for discount code
        const foundDiscount = await findDiscountByCode({ code, shopId })

        if (!foundDiscount || !foundDiscount.discount_is_active) {
            throw new NotFoundError('Discount not exists!')
        }

        const { discount_applies_to, discount_product_ids } = foundDiscount
        console.log(`discount_applies_to: ${discount_applies_to}`)
        console.log(`discount_product_ids: ${discount_product_ids}`)

        let products
        if (discount_applies_to === 'all') {
            // get all products
            products = await findAllProducts({
                filter: {
                    product_shop: convertToObjectIdMongodb(shopId),
                    isPublished: true,
                },
                limit: +limit,
                page: +page,
                sort: 'ctime',
                select: ['product_name'],
            })
        }

        if (discount_applies_to === 'specific') {
        // get products
            products = await findAllProducts({
                filter: {
                _id: { $in: discount_product_ids },
                isPublished: true,
                },
                limit: +limit,
                page: +page,
                sort: 'ctime',
                select: ['product_name'],
            })
        }

        return products
    }

}

module.exports = DiscountService
