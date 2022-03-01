const mongoose = require('mongoose')

const orderSchema = new mongoose.Schema({
    orderItems: [
        {
            name: {
                type: String,
                required: true
            },
            brand: {
                type:String,
                required: true
            },
            qty: {
                type: Number,
                required: true
            },
            price: {
                type: Number,
                required: true
            }
        },
    ],
    shippingAddress: {
        fullName: {
            type: String,
            required: true
        },
        address: {
            type: String,
            required: true
        },
        city: {
            type: String,
            required: true
        },
        postalCode: {
            type: String,
            required: true
        },
        country: {
            type: String,
            required: true
        }
    },
    Totalprice:{
        type: Number,
    },
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Users',
        required: true
    }
})

orderSchema.methods.toJSON = function() {
    const sellerdata = this
    const seller = sellerdata.toObject()
    // console.log(seller)

    delete seller._id,
    delete seller.user
    return seller
}
const orderdetails = mongoose.model('Orderdetails', orderSchema)

module.exports = orderdetails