const jwt = require('jsonwebtoken')
const user = require('../models/user')

const auth = async(req, res, next) => {

    try{
        const token = req.header('Authorization').replace('Bearer ', '')
        const decodetoken = jwt.verify(token, 'shoppingapp')
        const shopappdetails = await user.findOne({_id: decodetoken._id, 'tokens.token': token})

        if(!shopappdetails){
            throw new Error()
        }
        req.shopappdetails = shopappdetails
        req.tokens = token

        next()

    }catch(e){
        res.status(401).send({ error: 'Please Authenticate'})

    }
}


module.exports = auth 