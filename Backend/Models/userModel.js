const {Schema, model} = require('mongoose')

const userSchema = new Schema({
    name:{
        type: String,
        required: [true, 'Name is required'],
        minLength: [2, 'Name must be at least 3 character long']
    },
    userName:{
        type: String,
        unique: true,
        required: [true, 'Email is requred'],
        match:[
            /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
            'Please enter a valid email address'
        ]
    },
    email:{
        type: String,
        required: true
    },
    password:{
        type: String,
        minLength: [8, 'Password must be at least 8 character long'],
        required: [true, 'Password is required']
    }
},

    {timestamps: true}

)

const userModel = model('User', userSchema)
module.exports = userModel