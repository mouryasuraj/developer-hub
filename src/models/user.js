import mongoose from "mongoose"

const {Schema} = mongoose

const userSchema = new Schema({
    firstName:{
        type:String,
        required:true,
        trim:true,
        minLength:1,
        maxLength:15,
        // match:/^[a-bA-B ]+$/,
    },
    lastName:{
        type:String,
        required:true,
        trim:true,
        minLength:1,
        maxLength:15,
        // match:/^[a-bA-B ]+$/
    },
    email:{
        type:String,
        unique:true,
        required:true,
        trim:true,
        minLength:6,
        maxLength:254,
        match:/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
    },
    password:{
        type:String,
        required:true,
        minLength:8,
        maxLength:16,
        match:/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@!#$%^&*()_+{}[\]:;"'<>,.?/~\\-]).{8,16}$/

    },
    age:{
        type:Number,
        min:18,
        max:60
    },
    gender:{
        type:String,
        enum:["Male","Female","Others"],
        trim:true,
    }
})

const User = mongoose.model('User', userSchema)

export default User