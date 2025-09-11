import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from 'jsonwebtoken';

export const verifyJWT = asyncHandler(async(req, _, next) => {
    try {
        const accessToken = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ","")
        
    if(!accessToken) {
        throw new ApiError(401,"Unauthorised Request")
    }
    // await?
    const decodedToken = jwt.verify(accessToken,process.env.ACCESS_TOKEN_SECRET)
    console.log(decodedToken)

    const user = await User.findById(decodedToken?._id).select("-password")
    if(!user) {
        // NEXT_VIDEO: discuss about frontend
        throw new ApiError(401, "Invalid Access Token")
    }
    req.user = user;
    next()
    } catch (error) {
        throw new ApiError(400,"Invalid Access Token", error)
    }
    
})