'use trict'

const { SuccessResponse } = require('../core/success.response')
const DiscountService = require('../services/discount.service')

class DiscountController {

    createDiscountCodes = async (req, res , next) => {
        new SuccessResponse({
            message: 'Successful code Generations',
            metadata: await DiscountService.createDiscountCode({
                ...req.body,
                shopId: req.user.userId
            })
        }).send(res)
    }

    getAllDiscountCodesByShop = async (req, res , next) => {
        new SuccessResponse({
            message: 'Successful get All Discount Codes',
            metadata: await DiscountService.getAllDiscountCodesByShop({
                ...req.query,
                shopId: req.user.userId
            })
        }).send(res)
    }

    getAllDiscountCodesWithProducts = async (req, res , next) => {
        new SuccessResponse({
            message: 'Successful get All Discount Codes With Products',
            metadata: await DiscountService.getAllDiscountCodesWithProduct({
                ...req.query
            })
        }).send(res)
    }

    getDiscountAmount = async (req, res , next) => {
        new SuccessResponse({
            message: 'Successful code found',
            metadata: await DiscountService.getDiscountAmount({
                ...req.body
            })
        }).send(res)
    }
 
}

module.exports = new DiscountController()