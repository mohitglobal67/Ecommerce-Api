import mongoose from "mongoose";


const otpSchema = new mongoose.Schema({

    phone: String,
    otp: String,  
    
   // createdAt: { type: Date, expires: 600, default: Date.now } 
}, {
    timestamps: true
}
);


export const OtpModel = mongoose.model('OTP', otpSchema);

export default OtpModel;