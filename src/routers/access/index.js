'use trict'

const express = require('express')
const accessController = require('../../controllers/access.controller')
const router = express.Router()
const {asyncHandler} = require('../../helpers/asyncHandler')
const { authentication } = require('../../auth/authUtils')

// SignUp
router.post('/shop/signup',asyncHandler(accessController.signUp))

// Login
router.post('/shop/login',asyncHandler(accessController.login))


router.use(authentication)
// Logout
router.post('/shop/logout',asyncHandler(accessController.logout))
router.post('/shop/handlerRefreshToken',asyncHandler(accessController.handlerRefreshToken))



module.exports = router
