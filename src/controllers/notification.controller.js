const { SuccessResponse } = require('../core/success.response')
const { listNotiByUser , pushNotiToSystem } = require('../services/notification.service')


class NotificationController {
    

    listNotiByUser = async (req , res, next) => {
        new SuccessResponse({
            message: 'List Notification By User',
            metadata: await listNotiByUser(req.query)
        }).send(res)
    }

}

module.exports = new NotificationController()