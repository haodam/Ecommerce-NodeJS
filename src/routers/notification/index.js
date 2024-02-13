const express = require('express')
const notificationController = require('../../controllers/notification.controller')
const router = express.Router()
const {asyncHandler} = require("../../helpers/asyncHandler")
const { authenticationV2 } = require('../../auth/authUtils')

// here not use authentication
//authentication

router.use(authenticationV2)

router.get('',asyncHandler(notificationController.listNotiByUser))

module.exports = router