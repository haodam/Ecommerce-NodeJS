
const express = require('express')
const router = express.Router()
const discountController = require('../../controllers/discount.controller')
const {asyncHandler} = require('../../helpers/asyncHandler')
const { authenticationV2 } = require('../../auth/authUtils')


router.post('/amount',asyncHandler(discountController.getDiscountAmount))
router.get('/list_product_code',asyncHandler(discountController.getAllDiscountCodesWithProducts))


router.use(authenticationV2)

router.post('',asyncHandler(discountController.createDiscountCodes))
router.get('',asyncHandler(discountController.getAllDiscountCodesByShop))

module.exports = router
