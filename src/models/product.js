const mongoose = require('mongoose')
const geocoder = require('../utilis/geocoder')

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    brand: {
        type: Array,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    countInStock: {
        type: Number,
        required: true
    },
    rating: {
        type: Number,
        required: true,
        default: 1
    },
    seller: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Users'
    },
    address: {
        type: String,
        required: [true, 'please provide an address']
    },
    location: {
        type: {
            type: String,
            enum: ['Point'],
        },
        formattedAddress: String,
        street: String,
        city: String,
        state: String,
        zipcode: String,
        country: String
    },
}, {
    timestamps: true
})

productSchema.methods.toJSON = function() {
    const sellerdata = this
    const seller = sellerdata.toObject()
    // console.log(seller)

    delete seller.seller,
    delete seller.location,
    delete seller._id
    return seller
}

productSchema.pre('save', async function(next) {
    const locationdata = await geocoder.geocode(this.address)
    this.location = {
        type: 'Point',
        formattedAddress: locationdata[0].formattedAddress,
        street: locationdata[0].streetName,
        city: locationdata[0].city,
        state: locationdata[0].stateCode,
        zipcode: locationdata[0].zipcode,
        country: locationdata[0].countryCode,
    }

    this.address = undefined
    next()
    
})

const product = mongoose.model('Product', productSchema)

module.exports = product