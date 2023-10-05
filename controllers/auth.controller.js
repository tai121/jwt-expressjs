const jwt = require('jsonwebtoken')
require('dotenv').config()
const User = require('../models/User.model')
const createError = require('http-errors')
const bcrypt = require('bcrypt')
const {timeExpire} = require('../config/constant.config')
const {registerValidator} = require('../validations/auth.validations')


module.exports = {
    login : async(req, res, next) => {
        
        try {

            //get email, password
            let {email, password} = req.body

            //check email exist
            const user = await User.findOne({email})
            if(!user)
                throw createError(403, 'email or password was wrong')

            //compair with db
            let isMatch = await bcrypt.compare(password, user.password)
            if(!isMatch)
                throw createError(403, 'email or password was wrong')

            //Check enabled account
            if(!user.isEnable)
                throw createError(403, 'your account is locked by us')

            //Check active account
            if(!user.isActive)
                throw createError(403, 'your account is not active')

            // create jwt
            let roleString = user.permissions.toString()
            let token = jwt.sign({
                permissions: roleString,
                name: user.name,
                email: user.email
            },
            process.env.APP_SECRET,{
                expiresIn: timeExpire
            })
            //send responce

            let result = {
                name: user.name,
                role: user.role,
                email: user.email,
                token: `Bearer ${token}`
              };
            return res.status(200).json({
                ...result,
                message: "You are now logged in.",
              })

            } catch (error) {
                console.log(error.message)
                next(error)
            }
        
    },


    signup : async(req, res, next) => {
        try {
            //validate email password
            const { error } = registerValidator(req.body)
            if(error)
                throw createError(422,error.details[0].message)

            //check valid email
            const existEmail = async (email) => {
                let user = await User.findOne({ email });
                return user ?? true
            }
            if(existEmail)
                throw createError(400,'this email is alreadly taken')

            //Add user to db
            let password = await bcrypt.hash(req.body.password,10)
            const user = new User({
                ...req.body,
                password,
                permissions: ['USER'],
                isActive: false,
                isEnable: true,
                avatar: '../image/user.png'
            })

            await user.save()

            //TODO send email to active account

            //send OK 
            return res.status(200).json({
                'message': 'oke'
            })
            
        } catch (error) {
            console.log(error.message)
                next(error)
        }

    },

}