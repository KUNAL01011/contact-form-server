import express, { NextFunction, Request, Response } from 'express';
import cors from 'cors';
import dotevn from 'dotenv';
import mailRouter from './routes/mail.route';
dotevn.config();
const app = express();

app.use(express.json({
    limit: '50mb'
}));
app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
}));

app.use("/api/v1", mailRouter);

app.use(/(.*)/, (req: Request, res: Response, next: NextFunction) => {
    res.status(404).json({
        success: false,
        message: 'Route not found'
    })
})

app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
});