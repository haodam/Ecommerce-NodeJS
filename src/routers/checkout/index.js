
const express = require('express')
const router = express.Router()
const checkoutController = require('../../controllers/checkout.controller')
const {asyncHandler} = require('../../helpers/asyncHandler')
const { authenticationV2 } = require('../../auth/authUtils')

router.use(authenticationV2)
router.post('/review',asyncHandler(checkoutController.checkoutReview))

module.exports = router
