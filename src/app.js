
const express = require('express')
require('./db/mongoose')
const userRouter = require('./routers/user')
const productRouter = require('./routers/product')
const productTypeRouter = require('./routers/productType')
const commentRouter = require('./routers/comment')


const app = express()
app.use(express.json())

app.use(userRouter)
app.use(productRouter)
app.use(productTypeRouter)
app.use(commentRouter)

module.exports=app