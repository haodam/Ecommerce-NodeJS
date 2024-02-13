
const { SuccessResponse } = require("../core/success.response")
const  cartService  = require("../services/cart.service")

class CartController {

    // new
    addToCart = async (req, res , next) => {
        new SuccessResponse({
            message: 'Create new Cart success',
            metadata: await cartService.addToCart(req.body)
        }).send(res)
    }

    // update + -
    updateToCart = async (req, res , next) => {
        new SuccessResponse({
            message: 'Update Cart success',
            metadata: await cartService.addToCartV2(req.body)
        }).send(res)
    }

    // delete
    deleteToCart = async (req, res , next) => {
        new SuccessResponse({
            message: 'Delete Cart success',
            metadata: await cartService.deleteItemInCart(req.body)
        }).send(res)
    }

    // list
    listToCart = async (req, res , next) => {
        new SuccessResponse({
            message: 'List Cart success',
            metadata: await cartService.getListUserCart(req.query)
        }).send(res)
    }
}

module.exports = new CartController()