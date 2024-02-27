import express from 'express'
import colors from 'colors';
import morgan from 'morgan';
import cors from 'cors'
import dotenv from 'dotenv'

import Stripe from "stripe";


import cludinary from "cloudinary"
import connectDb from './server/config/db.js';
import userroutes from './server/routes/userRoutes.js';

import productroutes from './server/routes/productRoutes.js'

import categoryroutes from './server/routes/catagoryRoutes.js'

import orderroutes from './server/routes/orderRoutes.js'

import nodemailer from "nodemailer"

import twilio from "twilio"












//dotenv config

dotenv.config();

//database connect
connectDb();


//stripe configuration
export const stripe = new Stripe(process.env.STRIPE_API_SECRET);


//cloudinary  config
cludinary.v2.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_SECRET,
});


const accountSid = 'ACed0669dc3e0b8291d9c83d456cafdbfa';
const authToken = '6730baa5f138cb41f1d60c9a425de873';
const twilioClient = twilio(accountSid, authToken);

//  nodemailer.createTransport({
//   service: 'gmail',
//   auth: {
//     user: 'mohit.global67@gmail.com', // Your Gmail email address
//     pass: 'Global@2021' // Your Gmail password
//   }
// });
//rest object
const app = express()


//middlewares
app.use(morgan('dev')) //show request api hit
app.use(express.json());
app.use(cors());




//routes

app.use("/api/v1/user", userroutes)

app.use('/api/v1/product', productroutes)

app.use('/api/v1/category', categoryroutes)

app.use('/api/v1/order', orderroutes)

// app.get('/', (req, res) => {

//     return res.status(200).send("<h1> Welcome back </h1>");
// });


//port

const PORT = process.env.PORT || 8080;


//listen

app.listen(PORT,'192.168.1.113', () => {

    console.log(`port running on ${process.env.PORT}`.bgMagenta.green);
});

