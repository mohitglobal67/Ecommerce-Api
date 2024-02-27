
import mongoose from "mongoose";



const questionSchema = new mongoose.Schema({
    question: {
        type: String,
        required: [true, "product name is required"],
        
    },

    //  options: {
    //     type: Array,
    //     required: true
    // },

options: [
    // {
    //          a: {
    //             type: String,
    //             required: [true, "name is required"]
    //         },
    //          b: {
    //             type: String,
    //             required: [true, "name is required"]
    //     },
    //           c: {
    //             type: String,
    //             required: [true, "name is required"]
    //     },
    //            d: {
    //             type: String,
    //             required: [true, "name is required"]
    //         },
    //     },

    ],
    answerindex: {
      type:  Number,
        required: [true, "answer required"],
       
    },

      unitquestionid: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'SubCatagory'
    },
    

}, {
    timestamps: true
});


export const questionModel = mongoose.model('Question', questionSchema);

export default questionModel;



//  {
//     "id": 1,
//     "question":
//         "Flutter is an open-source UI software development kit created by ______",
//     "options": ['Apple', 'Google', 'Facebook', 'Microsoft'],
//     "answer_index": 1,
//   },