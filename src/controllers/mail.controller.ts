import { NextFunction, Request, Response } from "express";
import ErrorHandler from "../customResponses/ErrorHandler";
import path from 'path';
import dotenv from 'dotenv';
import { sendMail } from "@kunal_kumar/mail-sender-sdk";
dotenv.config();

sendMail.config({
    SMTP_HOST: process.env.SMTP_HOST as string, // your mail server host
    SMTP_PORT: parseInt(process.env.SMTP_PORT || "587"),              // default port
    SMTP_SERVICE: process.env.SMTP_SERVICE as string,       // mail service
    SMTP_MAIL: process.env.SMTP_MAIL as string, // your email
    SMTP_PASSWORD: process.env.SMTP_PASSWORD as string      // app password (not Gmail password!)
});
const mailSender = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { name, email, message } = req.body;

        if (!name || !email || !message) {
            return next(new ErrorHandler("all filed's are requreid", 400));
        }
        const templatePath = path.resolve(__dirname,"..","mails","contact-mail.ejs")
        try {
            await sendMail.send({
                name: name,
                email,
                message,
            })
            res.status(201).json({
                success: true,
                message: 'Message send',
            });
        } catch (error:any) {
            return next(new ErrorHandler(error.message, 400));
        }
    } catch (error:any) {
        return next(new ErrorHandler(error.message, 400));
    }
}

export {
    mailSender
}