
const express = require('express')
const router = express.Router()
const commentController = require('../../controllers/comment.controller')
const {asyncHandler} = require("../../helpers/asyncHandler")
const { authenticationV2 } = require('../../auth/authUtils')


router.use(authenticationV2)

router.post('',asyncHandler(commentController.createComment))

module.exports = router