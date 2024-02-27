import mongoose from "mongoose";


const bannerSchema = new mongoose.Schema({
  

images: [
        {
publicId: String,
  url: String,
        }
    ]
        
    


}, {
    timestamps: true
});


export const bannerModel = mongoose.model('Banner', bannerSchema);

export default bannerModel;