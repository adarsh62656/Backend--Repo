import mongoose, {Schema} from 'mongoose';
import mongooseAggregatePaginate from 'mongoose-aggregate-paginate-v2';
import bcrypt from "bcrypt";
import { JsonWebTokenError } from 'jsonwebtoken';
const videosSchema = new Schema(
    {
        id: {
            type: String,
            required: true,
            trim: true,
            index: true
        },
        videoFile: {
            type: String, //cloudinary url,
            required: true
        },
        thumbnail: {
            type: String, //cloudinary url,
            required: true
        },
        owner: {
            type: Schema.ObjectId,
            ref: "User"
        },
        title: {
            type: String,
            required: true
        },
        description: {
            type: String,
            required: true
        },
        duration: {
            type: Number,
            required: true
        },
        views: {
            type: Number,
            default: 0
        },
        isPublished: {
            type: Number,
            default: true
        }

    },
    {
        timestamps: true
    }
);

videoSchema.plugin(mongooseAggregatePaginate)

export const Videos = mongoose.model('Video', videosSchema)