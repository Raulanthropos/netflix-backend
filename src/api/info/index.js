import express from "express";
import dotenv from 'dotenv'
dotenv.config()

const infoRouter = express.Router();

infoRouter.get("/docs", (req, res, next) => {
    try {
        res.redirect(`https://api.postman.com/collections/24358339-a6f1de49-86c9-43ec-b435-54145fc5590c?access_key=PMAT-01GPNKQP7S2QXZ32KAY3SY7VKT`)
    } catch (error) {
        next(error)
    }
})

export default infoRouter