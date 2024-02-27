import mongoose from "mongoose";



const subcategorySchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, "title name is required"],
     
    },

     discription: {
        type: String,
        required: [true, "discription name is required"],
       
    },
     chapterid: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category'
    },


}, {
    timestamps: true
});


export const subcategoryModel = mongoose.model('SubCatagory', subcategorySchema);

export default subcategoryModel;