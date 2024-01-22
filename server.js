//const express = require('express')
import express from 'express';
import dotenv from 'dotenv'
import cors from 'cors'
import morgan from 'morgan'
import connectDB from './config/db.js';
import testRoutes from './routes/testRoutes.js';
import authRoutes from './routes/authRoutes.js';
import errorMiddleware from './middlewares/errorMiddleware.js';
import 'express-async-errors';
//Dot ENV config
dotenv.config()
connectDB();

const app = express()


app.use(express.json());
app.use(cors())
app.use(morgan('dev'));
app.use('/api/v1/test',testRoutes);
app.use('/api/v1/auth',authRoutes);


//validation middleware
app.use(errorMiddleware)
const PORT = process.env.PORT || 8080
app.listen(PORT , ()=>{
    console.log(`Node Server is running on ${process.env.DEV_MODE} Node on port no ${PORT}`);
});