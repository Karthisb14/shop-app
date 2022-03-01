const mongoose = require('mongoose')

mongoose.connect('mongodb://127.0.0.1:27017/Shopping-App', (error) => {
    console.log('Connected Successfully!')

    if(error){
        console.log('Connection Failure!')
    }
})