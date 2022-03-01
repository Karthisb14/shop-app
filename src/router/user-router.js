const express = require('express')
const Users = require('../models/user')
const auth = require('../middleware/auth')
const product = require('../models/product')
const order = require('../models/Order')

const router = new express.Router()

router.post('/api/v1/register',  async (req, res) => {

    const user = new Users(req.body)
    // console.log(user)

    try {

        const token = await user.generateAuthToken()
        await user.save()
        res.status(201).send({ user, token })
    } catch (e) {
        res.status(400).send(e)

    }

})

router.post('/api/v1/login',  async (req, res) => {

    try {
        const shoplogin = await Users.findbyCredentials(req.body.email, req.body.password)
        if (shoplogin.isdelete === true) {
            return res.status(400).send({ error: 'Your account already deleted!' })
        }
        const token = await shoplogin.generateAuthToken()
        res.status(200).send({ shoplogin, token })
    } catch (e) {
        res.status(400).send()
    }
})

router.post('/api/v1/logout', auth, async (req, res) => {
    try {
        req.shopappdetails.tokens = req.shopappdetails.tokens.filter((token) => {
            return token.token !== req.token
        })
        await req.shopappdetails.save()
        res.send({ success: 'Logout Successfully!' })

    } catch (e) {
        res.status(500).send(e)

    }
})


router.get('/api/v1/allproducts', auth, async (req, res) => {

    let query

    const reqQuery = { ...req.query }

    const removeFields = ['select', 'page', 'sort', 'limit']

    removeFields.forEach(param => delete reqQuery[param]);

    let queryStr = JSON.stringify(reqQuery)

    query = product.find(JSON.parse(queryStr))

    if (req.query.select) {
        const fields = req.query.select.split(',').join(' ')
        query = query.select(fields)
    }

    if (req.query.sort) {
        const sortBy = req.query.sort.split(',').join(' ')
        query = query.sort(sortBy)
    } else {
        query = query.sort("-createdAt")
    }

    const page = parseInt(req.query.page, 10) || 1
    const limit = parseInt(req.query.limit, 10) || 10
    const startIndex = (page - 1) * limit
    const endIndex = page * limit
    const total = await product.countDocuments()


    query = query.skip(startIndex).limit(limit)

    let pagination = {}

    if (endIndex > total) {
        pagination.next = {
            page: page + 1,
            limit
        }
    }

    if (startIndex > 0) {
        pagination.previous = {
            page: page - 1,
            limit
        }
    }

    const results = await query
    return res.status(200).send({ count: results.length, pagination, results })


})

router.get('/api/v1/products', auth, async (req, res) => {


    try {

        const allproducts = await order.findOne({ name: req.query.name }).populate('user')
        res.status(200).send({ allproducts })

    } catch (e) {
        res.status(500).send(e)

    }
})

module.exports = router