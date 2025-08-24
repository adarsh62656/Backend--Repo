import dotenv from "dotenv";
import connectDB from "./db/index.js";

dotenv.config({
    path: "./env"
})


console.log("PORT", process.env.PORT);
connectDB()
.then(())=> {
    app.listen(process.env.PORT || 8000, () => {
        console.log(`Server is Listening on port ${process.env.PORT || 8000}`);
    } )
})
.catch((error) => {
    console.log("error in DB connection",error)
} )









// import { DB_NAME } from "./constants.js";

// import express from "express";
// const app = express();
// ( async () => {
//     try {
//         await mongoose.connect(`${process.env.MONGODB_URI}/${process.env.DB_NAME}`)
//         app.on("errror", (err) => {
//             console.log("Errorr", err);
//             throw err
//         })
//         app.listen(process.env.PORT, () => {
//             console.log(`Server is Listening on port ${process.env.PORT}`);
//         })
//     } catch (error) {
//         console.log("Error in DB connection", error);
//         throw error
//     }
// })()