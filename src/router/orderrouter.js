const express = require('express')
const product = require('../models/product')
const auth = require('../middleware/auth')
const order = require('../models/Order')
const sgMail = require('@sendgrid/mail')

const router = new express.Router()

router.post('/api/v1/Productsorder', auth, async (req, res) => {

    if(req.shopappdetails.role === 'seller'){
        return res.status(404).send({ error: 'Seller is not allowed!' })
    }

    const findproduct = await product.findOne({name:req.body.orderItems[0].name})
    // console.log(findproduct)


    if (!findproduct) {
        return res.status(400).send({ error: 'Cannot find Product!' })
    }

   
    if(findproduct.countInStock === 0){
        return res.status(400).send({error: 'Out of Stock'})
    }

    const update = findproduct.countInStock - req.body.orderItems[0].qty

    const productupdate = await product.findOneAndUpdate({ name: req.body.orderItems[0].name }, {countInStock:update}, { new: true })
   
    
    const updateprice = req.body.orderItems[0].price * req.body.orderItems[0].qty
    // console.log(updateprice)

    const orderdetails = new order({

        orderItems: req.body.orderItems,
        shippingAddress: req.body.shippingAddress,
        user: req.shopappdetails._id,
        Totalprice: updateprice
    })
    
    // console.log(orderdetails)
    sgMail.setApiKey('SG.KBTPWdL4RlGaKZQtzmVYIQ.INVEMa7hFdTdTseIqtvammtbZzdsvTUNLNdvCCjNqvo')

    sgMail.send({
        to: req.shopappdetails.email,
        from: 'karthisb14@gmail.com',
        subject: 'Order Purchase Details',
        text: `Your Order is Placed Sucessfully Mr.${req.shopappdetails.name}`
    })

    try{
        await orderdetails.save()
        res.status(201).send({success: 'Order Placed Sucessfully!', orderdetails})
    }catch(e){
        res.status(400).send(e)
    }
})

router.get('/api/v1/order-history', auth, async(req, res) => {

    if(req.shopappdetails.role === 'seller'){
        return res.status(404).send({ error: 'Seller is not allowed!' })
    }

    try{

        const data = await order.find({user: req.shopappdetails._id})
    
        res.status(200).send({count: data.length, data})
    }catch(e){
        res.status(400).send(e)

    }
})

module.exports = router