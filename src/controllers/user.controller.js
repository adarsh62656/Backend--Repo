import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import {uploadOnCloudinary} from "../utils/cloudinary.js"
import { ApiResponse } from "../utils/ApiResponse.js";

const generateAccessAndRefreshToken = async(userId) =>{
    try {
        const user = await User.findById(userId)
        const accessToken = user.generateAccessToken()
        const refreshToken = user.generateRefreshToken()
        user.refreshToken = refreshToken
        await user.save({ValidityBeforeSave: false})
        return {accessToken, refreshToken}
    } catch (error) {
        throw new ApiError("Something went wrong while generating Access and Refresh Token",error)
    }
}

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
    const avatarLocalPath = req.files?.avatar[0]?.path
    const coverImagePath = req.files?.coverImage[0]?.path
    
    
    if(!avatarLocalPath) {
        throw new ApiError(400,"Avatar file is Required")   
    }
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

const loginUser = asyncHandler (async (req,res) => {
    // Verify Req fields
    // Verify that user exists in DB
    // check password
    //generate access and refresh token
    //send cookie
    const {email, username, password} = req.body

    if (!username && !email) {
        throw new ApiError(400, "Username or email is Required")
    }

    const user = await User.findOne({
        $or: [{username},{email}]
    })

    if(!user){
        throw new ApiError(404,"User Does not exist in DB")
    }
    const isPasswordValid = await user.isPasswordCorrect(password)
    if(!isPasswordValid){
        throw new ApiError(401,"Invalid User Credentials!!!")
    }
    const {accessToken, refreshToken} =  await generateAccessAndRefreshToken(user._id)
    const loggedInUser =  await User.findById(user._id).select("-password -refreshtoken")

    const options = {
        httpOnly: true,
        secure: true
    }
    console.log(loggedInUser)
    return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
        new ApiResponse(
            200,
            {
                user: loggedInUser,accessToken,refreshToken
            },
            "User Logged in Successfully"
    )   
    )
})

const logoutUser = asyncHandler (async (req,res) => {
    console.log(req.user)
    await User.findByIdAndUpdate(
        req.user._id,
        {
            $set: {
                refreshToken: undefined
            }
        },
        {
            new: true
        }
    )
    const options = {
        httpOnly: true,
        secure: true
    }
    return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200,{},"User Logged Out Successfully"))
    

})
export {registerUser,loginUser,logoutUser}