const mongoose = require('mongoose');
const User = require('../models/User.model')
const express = require('express')
const router = express.Router()
const authController = require('../controllers/auth.controller') 
const authMiddleware = require('../middlewares/auth.middleware')

// router.post("/",authMiddleware.checkToken,authMiddleware.checkPermission('USER'),(req, res, next)=>{
//     res.status(200).send('OK')
// })

router.post('/login', authController.login)

router.post('/signup', authController.signup)

module.exports = router