const rating = require('../models/rating')
const product = require('../models/product')
const express = require('express')
const auth = require('../middleware/auth')

const router = new express.Router()

router.post('/api/v1/ratings', auth, async(req, res) => {

    const productinfo = await product.findOne({name: req.body.title})
    // console.log(data)

    const ratinginfo = new rating({
        ...req.body,
        user: req.shopappdetails._id,
        product: productinfo._id
    })
    console.log(ratinginfo)

    const data = productinfo.rating + req.body.Rating 

    const emp = data / 2
    
    const march = await product.findOneAndUpdate({name: req.body.title}, {rating: emp}, {new: true, runValidators: true})

    try{
        await ratinginfo.save()
        res.status(201).send({ratinginfo})
    }catch(error){
        res.status(400).send(error)
    }

})

module.exports = router