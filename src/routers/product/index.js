'use trict'

const express = require('express')
const router = express.Router()
const {asyncHandler} = require('../../helpers/asyncHandler')
const { authenticationV2 } = require('../../auth/authUtils')
const productController = require('../../controllers/product.controller')


router.get('/search/:keySearch',asyncHandler(productController.getListSearchProduct))
router.get('',asyncHandler(productController.findAllProducts))
router.get('/:product_id',asyncHandler(productController.findProduct))


router.use(authenticationV2)
// Product
router.post('',asyncHandler(productController.createProduct))
router.post('/published/:id',asyncHandler(productController.getPublishProductByShop))
router.post('/unpublished/:id',asyncHandler(productController.unPublishProductByShop))


// QUERY // 
router.get('/draft/all',asyncHandler(productController.getAllDraftsForShop))
router.get('/published/all',asyncHandler(productController.getAllPublishForShop))


module.exports = router
