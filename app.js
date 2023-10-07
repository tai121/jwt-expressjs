const express = require('express')
const mongoose = require('mongoose')
const createError = require('http-errors')

require('./config/database.config')()
require('dotenv').config()
const app = express()

app.use(express.json())
app.use(express.urlencoded({extended:true}))

const authRouter = require('./routes/auth.route')
app.use('/api/auth',authRouter)

app.use((req, res, next)=>{
    next(createError(404, 'Not Found'));
})

app.use((err, req, res, next)=>{
    // res.status(err.status || 500)
    res.send({
        error: {
            status: err.status || 500,
            message: err.message
        }
    })
})

app.listen(process.env.PORT || 3000, () =>{
    console.log('Server is running')
})

