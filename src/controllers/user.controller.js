import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import {uploadOnCloudinary} from "../utils/cloudinary.js"
import { ApiResponse } from "../utils/ApiResponse.js";
const registerUser = asyncHandler ( async (req,res) => {

    // get user details from frontend
    // validation - not empty
    // check if user already exists: username, email
    // check for images, check for avatar
    // upload them to cloudinary, avatar

    // create user object - create entry in db
    // remove password and refresh token field from response
    // check for user creation
    // return res




    // get the data from request body
    const {fullname, email,username,password} = req.body
    //validate the data from req.body weather it is Empty
    if (
        [fullname, email,username,password].some((field) => field.trim()==="")
    ) {
        throw new ApiError(409,"Field Not Found")
    }
    //Check if User exists
    const existingUser = await User.findOne({
        $or: [{username},{email}]
    })
    if (existingUser) {
        throw new ApiError(409,"User already exists with this email or username")
    }
    console.log(req.files)
    const avatarLocalPath = req.files?.avatar[0]?.path
    const coverImagePath = req.files?.coverImage[0]?.path
    
    
    if(!avatarLocalPath) {
        throw new ApiError(400,"Avatar file is Required")   
    }
    console.log(avatarLocalPath)
    const avatar = await uploadOnCloudinary(avatarLocalPath)
    const coverImage = await uploadOnCloudinary(coverImagePath)

    if (!avatar) {
        throw new ApiError(400,"Avatar file is not Uploaded on Cloudinary")
    }
    const user = await User.create({
        fullname,
        avatar: avatar.url,
        coverImage: coverImage?.url || "",
        fullName: fullname,
        email,
        password,
        username: username.toLowerCase()
    })
    const isUserCreated = await User.findById(user._id).select(
        "-password -refreshToken"
    )
    if(!isUserCreated){
        throw new ApiError(500,"User not found in DB")
    }

    const response = new ApiResponse(201,"User Created Successfully",isUserCreated)
    return res.status(201).json(response)


    
})

export {registerUser}