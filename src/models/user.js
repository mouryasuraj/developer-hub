import mongoose from "mongoose"
import validator from "validator"
import { allowedGenders } from "../constants.js"

const {Schema} = mongoose

const userSchema = new Schema({
    firstName:{
        type:String,
        required:true,
        trim:true,
        minLength:1,
        maxLength:15,
        // match:/^[a-bA-B ]+$/,    // we can also add regex to validate the value
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
        // match:/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error("Email is not valid")
            }
        }
    },
    password:{
        type:String,
        required:true,
        // match:/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@!#$%^&*()_+{}[\]:;"'<>,.?/~\\-]).{8,16}$/
        validate(value){
            if(!validator.isStrongPassword(value)){
                throw new Error("Your password is weak")
            }
        }
    },
    age:{
        type:Number,
        min:18,
        max:60
    },
    gender:{
        type:String,
        enum:allowedGenders,
        trim:true,
    },
    about:{
        type:String,
        maxLength:200,
        trim:true
    },
    photoUrl:{
        type:String,
        trim:true,
        validate(value){
            if(!validator.isURL(value)){
                throw new Error("Invalid url")
            }
        }
    }
})

const User = mongoose.model('User', userSchema)

export default User