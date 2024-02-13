
const express = require('express')
const router = express.Router()
const {asyncHandler} = require('../../helpers/asyncHandler')
const { authenticationV2 } = require('../../auth/authUtils')
const cartController = require('../../controllers/cart.controller')

router.post('/update',asyncHandler(cartController.updateToCart))
router.get('',asyncHandler(cartController.listToCart))
router.delete('',asyncHandler(cartController.deleteToCart))
router.post('',asyncHandler(cartController.addToCart))

module.exports = router
