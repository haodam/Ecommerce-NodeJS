'use trict'

const express = require('express')
const accessController = require('../../controllers/access.controller')
const router = express.Router()
const {asyncHandler} = require('../../helpers/asyncHandler')
const { authentication, authenticationV2 } = require('../../auth/authUtils')

// SignUp
router.post('/shop/signup',asyncHandler(accessController.signUp))

// Login
router.post('/shop/login',asyncHandler(accessController.login))


router.use(authenticationV2)
// Logout
router.post('/shop/logout',asyncHandler(accessController.logout))
router.post('/shop/handlerRefreshToken',asyncHandler(accessController.handlerRefreshToken))



module.exports = router
