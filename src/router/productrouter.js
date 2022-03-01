const express = require('express')
const product = require('../models/product')
const auth = require('../middleware/auth')


const router = new express.Router()

router.post('/api/v1/products', auth, async (req, res) => {

    if (req.shopappdetails.role === 'users') {
        return res.status(404).send({ error: 'User is not allowed!' })
    }

    const productinfo = new product({
        ...req.body,
        seller: req.shopappdetails._id,
    })

    try{
        await productinfo.save() 
        res.status(201).send({productinfo})

    }catch(e){
        res.status(400).send(e)
    }

})

router.put('/api/v1/updateproducts', auth, async(req, res) => {

    if (req.shopappdetails.role === 'users') {
        return res.status(404).send({ error: 'User is not allowed!' })
    }

    const updates = Object.keys(req.body)
    const allowedUpdates = ['name', 'brand', 'description','price', 'countInStock', 'address']
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))

    if (!isValidOperation) {
        return res.status(400).send({ error: 'Invalid updates!' })
    }
    
    try {
        const Product = await product.findOneAndUpdate({seller:req.shopappdetails._id}, req.body,{
            new: true, 
            runValidators: true
        })
        // console.log(Product)

        if (!Product) {
            return res.status(404).send()
        }

        res.send({Product})
    } catch (e) {
        res.status(400).send(e)
    }
})

module.exports = router