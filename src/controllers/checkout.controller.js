
const { SuccessResponse } = require("../core/success.response")
const checkoutService = require("../services/checkout.service")

class CheckController {

    checkoutReview = async (req, res , next) => {
        new SuccessResponse({
            message: 'Create new Checkout success',
            metadata: await checkoutService.checkoutReview(req.body)
        }).send(res)
    }

}

module.exports = new CheckController()