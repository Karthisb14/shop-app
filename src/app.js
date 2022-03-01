const express = require('express')
require('./db/database')


// Router file
const Userrouter = require('./router/user-router')
const productrouter = require('./router/productrouter')
const orderrouter = require('./router/orderrouter')
const ratingrouter = require('./router/ratingrouter')

const app = express()
const port = process.env.PORT || 3000


app.use(express.json())
app.use(Userrouter)
app.use(productrouter)
app.use(orderrouter)
app.use(ratingrouter)

app.listen(port, () => {
    console.log(`Server is Running on ${port}`)
})