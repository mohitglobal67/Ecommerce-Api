import orderModel from "../model/orderModel.js";
import productModel from "../model/productModel.js";
import { stripe } from "../../server.js";


export const createOrderController =async (req, res) => {
 
    try {

        const {shippingInfo,orderItems,paymentMethod,paymentInfo,itemPrice,tax,shippingCharges,totalAmount } = req.body;
        
        // if (!shippingInfo || !orderItems || !paymentMethod || !paymentInfo || !itemPrice || !tax || !shippingCharges || !totalAmount) {
        
        // }
        
        await orderModel.create({ user: req.user.userId, shippingInfo, orderItems, paymentMethod, paymentInfo, itemPrice, tax, shippingCharges, totalAmount });

        for (let i = 0; i < orderItems.length; i++){
            const product =await productModel.findById(orderItems[i].product);

            product.stock -= orderItems[i].quantity;

            await product.save();
        }

        res.status(201).send({
            success: true,
            message:"Order Created succesfully"
            
        })
    
    } catch (error) {
         console.log(error);

        res.status(500).send({
            success: false,
            message: "Error in Getall Products",
            error
        })
    }

}

///////get my all order
export const getMyOrdersCotroller = async (req, res) => {
  try {
    // find orders
    const orders = await orderModel.find({ user: req.user.userId });
    //valdiation
    if (!orders) {
      return res.status(404).send({
        success: false,
        message: "no orders found",
      });
    }
    res.status(200).send({
      success: true,
      message: "your orders data",
      totalOrder: orders.length,
      orders,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error In My orders Order API",
      error,
    });
  }
};


// show single order details 

// GET SINGLE ORDER INFO
export const singleOrderDetrailsController = async (req, res) => {
  try {
    // find orders
    const order = await orderModel.findById(req.params.id);
    //valdiation
    if (!order) {
      return res.status(404).send({
        success: false,
        message: "no order found",
      });
    }
    res.status(200).send({
      success: true,
      message: "your order fetched",
      order,
    });
  } catch (error) {
    console.log(error);
    // cast error ||  OBJECT ID
    if (error.name === "CastError") {
      return res.status(500).send({
        success: false,
        message: "Invalid Id",
      });
    }
    res.status(500).send({
      success: false,
      message: "Error In Get UPDATE Products API",
      error,
    });
  }
};



// ACCEPT PAYMENTS
export const paymetsController = async (req, res) => {
  try {
    // get ampunt
    const { totalAmount } = req.body;
    // validation
    if (!totalAmount) {
      return res.status(404).send({
        success: false,
        message: "Total Amount is require",
      });
    }
    const { client_secret } = await stripe.paymentIntents.create({
      amount: Number(totalAmount * 100),
      currency: "usd",
      // payment_method:  req.user.userId,
     // confirm: true,
    });
    res.status(200).send({
      success: true,
      client_secret,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error In Payment API",
      error,
    });
  }
};