'use trict'

const { SuccessResponse } = require("../core/success.response")
const ProductService = require("../services/product.service")

class ProductController {

    createProduct = async (req, res , next) => {
        new SuccessResponse({
            message: 'Cretae new Product success!',
            metadata: await ProductService.createProduct(req.body.product_type,{
                ...req.body,
                product_shop: req.user.userId
            })
        }).send(res)
    }

    updateProduct = async (req, res , next) => {
        new SuccessResponse({
            message: 'update new Product success!',
            metadata: await ProductService.updateProduct(req.body.product_type, req.params.productId, {
                ...req.body,
                product_shop: req.user.userId
            })
        }).send(res)
    }


    getPublishProductByShop = async (req, res , next) => {
        new SuccessResponse({
            message: 'Get Publish Product By Shop !',
            metadata: await ProductService.publishProductByShop({
                product_id: req.params.id,
                product_shop: req.user.userId
            })
        }).send(res)
    }

    unPublishProductByShop = async (req, res , next) => {
        new SuccessResponse({
            message: 'UnPublish Product By Shop !',
            metadata: await ProductService.unPublishProductByShop({
                product_id: req.params.id,
                product_shop: req.user.userId
            })
        }).send(res)
    }

    getListSearchProduct = async (req, res , next) => {
        new SuccessResponse({
            message: 'Get List getAllPublishForShop success',
            metadata: await ProductService.searchProducts(req.params)
        }).send(res)
    }

    findAllProducts = async (req, res , next) => {
        new SuccessResponse({
            message: 'Get List getAllPublishForShop success',
            metadata: await ProductService.findAllProducts(req.query)
        }).send(res)
    }

    findProduct = async (req, res , next) => {
        new SuccessResponse({
            message: 'Get List findProduct success',
            metadata: await ProductService.findProduct({
                product_id: req.params.product_id
            })
        }).send(res)
    }


    // QUERY //

    /**
     * @description Get all Draflt for shop
     * @param {Number} limit
     * @param {Number} skip 
     * @return { JSON } 
     */
    getAllDraftsForShop = async(req, res , next) => {
        new SuccessResponse({
            message: 'Get list Draft Success !',
            metadata: await ProductService.findAllDraftsForShop({
                product_shop: req.user.userId
            })
        }).send(res)
    }

    getAllPublishForShop = async(req, res , next) => {
        new SuccessResponse({
            message: 'Get list Publish Success !',
            metadata: await ProductService.findAllPublishForShop({
                product_shop: req.user.userId
            })
        }).send(res)
    }

    // END QUERY //
}

module.exports = new ProductController()