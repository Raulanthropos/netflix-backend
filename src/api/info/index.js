import express from "express";
import dotenv from 'dotenv'
dotenv.config()

const infoRouter = express.Router();

infoRouter.get("/docs", (req, res, next) => {
    try {
        res.redirect(`https://documenter.getpostman.com/view/24358339/2s8ZDSbkB1`)
    } catch (error) {
        next(error)
    }
})

export default infoRouter