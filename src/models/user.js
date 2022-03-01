const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error('Invalid Email.Please Enter Correct Email')
            }
        }
    },
    password: {
        type: String,
        required: true,
        trim: true,
        minlength: 7
    },
    role: {
        type: String,
        default: 'users',
        enum: ['users', 'seller']
    },
    isdelete: {
        type: Boolean,
        default: false
    },
    tokens:[{
        token: {
            type: String,
            required: true
        }
    }]
}, {
    timestamps: true
})

userSchema.methods.toJSON = function() {
    const userdetails = this
    const userObject = userdetails.toObject()

    delete userObject.role,
    delete userObject.password,
    delete userObject.tokens
    return userObject
}

userSchema.methods.generateAuthToken = async function() {

    const authtoken = this

    const Gentoken = jwt.sign({_id: authtoken._id.toString() }, 'shoppingapp')

    authtoken.tokens = authtoken.tokens.concat({token: Gentoken})
    await authtoken.save()
    return Gentoken
}

userSchema.statics.findbyCredentials = async(email, password) => {

    const useremail = await user.findOne({email})

    if(!useremail){
        throw new Error('Unable to login')
    }
    
    const ismatch = await bcrypt.compare(password, useremail.password)

    if(!ismatch){
        throw new Error('Unable to login')
    }

    return useremail

}

userSchema.pre('save', async function(next) {
    const shoppassword = this

    if(shoppassword.isModified('password')){
        shoppassword.password = await bcrypt.hash(shoppassword.password, 8)
    }

    next()

})

const user = mongoose.model('Users', userSchema)

module.exports = user