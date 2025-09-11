import mongoose, { Schema } from "mongoose";
const subscriptionSchema = new Schema(
    {
    subscriber:
        {
            type: Schema.Types.ObjectId, // The User who is Subscribing
            ref: "User"
        },
    channel:
        {
            type: Schema.Types.ObjectId, // The User who is Getting Subscribed
            ref: "User"
        },
    password: {
        type: String,
        required: [true, 'Password is Required']
    },
    refreshToken: {
        type: String
    },
    },
    {
        timestamps: true
    }
)



export const Subscription = mongoose.model("Subscription", subscriptionSchema)