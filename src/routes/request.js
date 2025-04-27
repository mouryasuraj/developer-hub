import express from 'express'
import { userAuth } from '../middlewares/auth.js';
import { validateConnectionSentRequestBody } from '../utils/validation.js';
import User from '../models/user.js';
import ConnectionRequest from '../models/connectionRequest.js';

const requestRouter = express.Router()


requestRouter.post('/send/:status/:toUserId', userAuth, async (req,res)=>{

    try {
        //validate send request body
    validateConnectionSentRequestBody(req)

    const {status, toUserId} = req.params
    const {_id:fromUserId} = req.user

    //Check toUser exist or not
    const toUser = await User.findById(toUserId) 
    if(!toUser){
        return res.status(404).json({message:"User not found"})
    }

    //Check connection already exist or not
    const connectionAlreadyExist = await ConnectionRequest.findOne({
        $or:[
            {fromUserId, toUserId},
            {fromUserId:toUserId, toUserId:fromUserId},
        ]
    })
    if(connectionAlreadyExist){
        throw new Error('Connection already exists')
    }

    const newConnectionRequest = new ConnectionRequest({
        fromUserId,
        toUserId,
        status
    })

    await newConnectionRequest.save()

    res.json({message:"Connection request send successfully"})
    } catch (error) {
        console.log("Something went wrong: ",error);
        res.status(400).json({message:error.message})
    }

    



})


export default requestRouter;