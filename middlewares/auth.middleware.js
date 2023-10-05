const jwt = require('jsonwebtoken')
require('dotenv').config()
const createError = require('http-errors')
const {timeExpire} = require('../config/constant.config')


module.exports = {
    checkToken : (req, res, next) =>{
        try {
            const authHeader = req.headers["authorization"]
            if (!authHeader)
                throw createError(403,'Something went wrong')
            const token = authHeader.split(" ")[1]
            jwt.verify(token, process.env.APP_SECRET, (err, decoded) => {
                if (err) 
                    throw err
            res.locals.userInfo = decoded
            let token = jwt.sign({
                permissions: decoded.permissions,
                name: decoded.name,
                email: decoded.email
            },
            process.env.APP_SECRET,{
                expiresIn: timeExpire
            })
            res.locals.newToken = `Bearer ${token}`
            next()
            })
        } catch (error) {
            console.log(error.message)
                next(error)
        }  
    },

    checkPermission: (requirePermission) => {
        return (req, res, next) => {
            try {
                let userInfo = res.locals.userInfo
                let listPermission = userInfo.permissions.split(',')
                
                if(listPermission.includes(requirePermission))
                    next()
                else
                throw createError(403,"You don't have permission to do this!!!")
            } catch (error) {
                console.log(error.message)
                next(error)
            }
            
        }

    }
}