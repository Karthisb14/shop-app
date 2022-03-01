const mongoose = require('mongoose')

const ratingSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true,
        trim: true
    },
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'Users',
        required: true
    },
    product:{
        type: mongoose.Schema.ObjectId,
        ref: 'Product',
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    Rating:{
        type: Number,
        min: 1,
        max: 5,
        required: true
    }
})


const rating = mongoose.model('ratings', ratingSchema)

module.exports = rating