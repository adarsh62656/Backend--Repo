import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
const registerUser = asyncHandler ( async (req,res) => {
    // get the data from request body
    const {fullname, email,username,password} = req.body
    //validate the data from req.body weather it is Empty
    if (
        [fullname, email,username,password].send((field) => field.trim()==="")
    ) {
        throw new ApiError(409,"Field Not Found")
    }
    //Check if User exists
    const existingUser = User.findOne({
        $or: [{username},{email}]
    })
    if (existingUser) {
        throw new ApiError(409,"User already exists with this email or username")
    }
    
})

export {registerUser}