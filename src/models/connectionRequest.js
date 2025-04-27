import mongoose from 'mongoose'
const {Schema, model} = mongoose

const connectionRequestSchema = new Schema({

    fromUserId:{
        type:Schema.Types.ObjectId,
        required:true,
        trim:true
    },
    toUserId:{
        type:Schema.Types.ObjectId,
        required:true,
        trim:true
    },
    status:{
        type:[String],
        required:true,
        trim:true
    }
},{
  timestamps:true  
}) 


connectionRequestSchema.pre('save',function(next){
    const {fromUserId, toUserId} = this
    if(fromUserId.equals(toUserId)){
        throw new Error("You can't send connection request to yourself")
    }
    next()
})

const ConnectionRequest = model("ConnectionRequest", connectionRequestSchema)

export default ConnectionRequest;