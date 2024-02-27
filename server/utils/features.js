import dataUriParser from "datauri/parser.js";

import path from "path";
import twilio from "twilio"



export const getDataUri = (file) => {

    const parser = new dataUriParser()

    const extName = path.extname(file.originalname).toString();
    return parser.format(extName, file.buffer);
}



const accountSid = 'ACed0669dc3e0b8291d9c83d456cafdbfa';
const authToken = '6730baa5f138cb41f1d60c9a425de873';
const twilioClient = twilio(accountSid, authToken);

// Generate OTP
export const generateOTP=() =>{
    const digits = '0123456789';
    let otp = '';
    for (let i = 0; i < 6; i++) {
        otp += digits[Math.floor(Math.random() * 10)];
    }
    return otp;
}

// Send OTP via SMS
export const sendOTP = (phone, otp)=> {
    return twilioClient.messages.create({
        body: `Your OTP is: ${otp}`,
        from: '+15169904942',
        to: phone
    });
}