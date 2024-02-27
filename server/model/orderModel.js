import mongoose from "mongoose";



const orderSchema = new mongoose.Schema({
    shippingInfo: {
        address: {
            type: String,
            required: [true, "address is required"]
        },
        
        city: {
            type: String,
            required: [true, "city is required"]
        },
        country: {
            type: String,
            required: [true, "country is required"]
        }
    },
    orderItems: [
        {
            name: {
                type: String,
                required: [true, "name is required"]
            },
            price: {
                type: Number,
                required: [true, "name is required"]
            },
            quantity: {
                type: Number,
                required: [true, "quantity is required"]
            },
            image: {
                type: String,
                required: [true, "image is required"]
            },
         product: {
        
        type: mongoose.Schema.Types.ObjectId,
        ref:'Product'
    }
        }
    ],

    paymentMethod: {
        
        type: String,
        enum: ["COD", "ONLINE"],
        default:"COD"
    },

    user: {
         type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, "user id is required"]
        
    },
    paidAt: Date,

    paymentInfo: {       
        id: String,
        status:String
    },

    itemPrice: {       
        type: Number,
        required: [true, "itemprice id is required"]
        
    }, 
       tax: {        
        type: Number,
        required: [true, "itemprice id is required"]
        
    },
          shippingCharges: {       
        type: Number,
        required: [true, "itemprice id is required"]
        
    },
        orderStatus: {
            type: String,
            enum: ["processing", "shiped", "delivered"],
            default: "processing"
        
    },
        totalAmount: {
        type: Number,
        required: [true, "itemprice id is required"]
        
    },
    
   
        deliverAt:Date

}, {
    timestamps: true
});


export const orderModel = mongoose.model('Orders', orderSchema);

export default orderModel;