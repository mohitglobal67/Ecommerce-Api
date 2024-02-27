import productModel from "../model/productModel.js";
import { generateOTP, getDataUri, sendOTP } from "../utils/features.js";
import coludinary from 'cloudinary';

import { get_category } from './catagoryController.js';
import bannerModel from "../model/bannerModel.js";

import nodemailer from "nodemailer"
import OtpModel from "../model/otpcreate.js";

export const getAllProducts = async (req, res) => {

    try {


        var send_data = [];
        var cat_data = await get_category();



        if (cat_data.length > 0) {

            for (var i = 0; i < cat_data.length; i++) {
                var Product_data = [];

                var cat_id = cat_data[i]['_id'].toString();
                // var subcat_id = subcat_data[i]['_id'].toString();

                const cat_product = await productModel.find({ category: cat_id });

                if (cat_product.length > 0) {

                    for (var j = 0; j < cat_product.length; j++) {


                        // var store_data = await store_controller.get_store(cat_product[j]["store_id"]);
                        //  var subcat_category = await subCategory_controller.sub_category(cat_product[j]["sub_cat_id"]);
                        Product_data.push({

                            // "category": cat_product["category"],
                            "product_name": cat_product[j]['name'],
                            "description": cat_product[j]['description'],
                            "price": cat_product[j]['price'],
                            "stock": cat_product[j]['stock'],
                            "images": cat_product[j]['images'],
                            "product_id":cat_product[j]['_id'],

                        });
                    }

                }

                send_data.push({
                    "category":cat_data[i]['category'],
                    "product":   Product_data ,

                });


            }
            res.status(200).send({ seccess: true, msg: "product details", data: send_data })

        } else {

            res.status(200).send({

                success: true,
                message: "All product fetch Succesfully",
                send_data,
                // total: product.length,
                // product
            })

        }
        /// const product = await productModel.find({});




    } catch (error) {

        console.log(error);

        res.status(500).send({
            success: false,
            message: "Error in Getall Products",
            error
        })

    }


}


export const getSingleProductController = async (req, res) => {
    try {
        const product = await productModel.findById(req.params.id);
        if (!product) {
            return res.status(404).send({

                success: false,
                message: "Product Not Found"
            })
        }

        res.status(200).send({
            success: true,
            message: "Product Found",
            product
        })

    } catch (error) {
        console.log(error);
        if (error.name === "CastError") {
            return res.status(500).send({
                success: false,
                message: "Invalid Id",

            })
        }
        res.status(500).send({
            success: false,
            message: "Error in Get Single Products",
            error
        })
    }
}


//create product 


export const createProductController = async (req, res) => {

    try {

        const { name, description, price, stock, category } = req.body;

        if (!name || !description || !price || !stock || !category) {

            return res.status(500).send({
                success: false,
                message: "Provide All fileds"
            })
        }

        if (!req.file) {

            return res.status(500).send({
                success: false,
                message: "Please Provide Images",
                error
            })
        }
        const file = getDataUri(req.file)

        const cdb = await coludinary.v2.uploader.upload(file.content)

        const image = {

            public_id: cdb.public_id,
            url: cdb.secure_url
        };

        await productModel.create({
            name, description, price, stock, category, images: [image]
        })

        res.status(201).send({
            success: true,
            message: "Product Created Succesfully"

        })

    } catch (error) {

        console.log(error);

        res.status(500).send({
            success: false,
            message: "Error in create Products",
            error
        })

    }

}



//update product controller 


export const updateProductController = async (req, res) => {


    try {

        const product = await productModel.findById(req.params.id);


        if (!product) {

            return res.status(404).send({
                success: false,
                message: "Product Not Found"
            })
        }



        const { name, description, price, stock, category } = req.body;

        if (name) product.name = name;
        if (description) product.description = description;
        if (price) product.price = price;
        if (stock) product.stock = stock;
        if (category) product.category = category;

        await product.save();

        res.status(200).send({
            success: true,
            message: "Product details Updated",


        })


    } catch (error) {

        console.log(error);
        if (error.name === "CastError") {
            return res.status(500).send({
                success: false,
                message: "Invalid Id",

            })
        }

        res.status(500).send({
            success: false,
            message: "Error in update Products",
            error
        })

    }
}



export const updateproductImageController = async (req, res) => {

    try {

        const product = await productModel.findById(req.params.id);

        if (!product) {
            return res.status(404).send({
                success: false,
                message: "Product Not Found"
            })

        }
        //check file
        if (!req.file) {

            return res.status(500).send({
                success: false,
                message: "Please Provide Images",
                error
            })
        }

        const file = getDataUri(req.file)
        //delete previous image 


        const cdb = await coludinary.v2.uploader.upload(file.content)

        const image = {

            public_id: cdb.public_id,
            url: cdb.secure_url
        }

        product.images.push(image);

        await product.save();

        res.status(200).send({
            success: true,
            message: "Product Image Updated",


        })

    } catch (error) {

        console.log(error);

        res.status(500).send({
            success: false,
            message: "Error in create image Products",
            error
        })

    }
}


export const deleteProductImageController = async (req, res) => {

    try {
        const product = await productModel.findById(req.params.id);

        if (!product) {
            return res.status(404).send({
                success: false,
                message: "Product Not Found"
            })

        }
        //image id find

        const id = req.query.id;

        if (!id) {
            return res.status(404).send({
                success: false,
                message: "Product image Not Found"
            })
        }

        let isexist = -1;

        product.images.forEach((item, index) => {

            if (item._id.toString() === id.toString()) isexist = index;


        })

        if (isexist < 0) {
            return res.status(404).send({
                success: false,
                message: " image Not Found"
            })
        }
        //delete previous image 
        await coludinary.v2.uploader.destroy(product.images[isexist].public_id);
        product.images.splice(isexist, 1);

        await product.save();


        res.status(200).send({
            success: true,
            message: "Product Image deleted",


        })

    } catch (error) {

        console.log(error);

        res.status(500).send({
            success: false,
            message: "Error in delete image Products",
            error
        })
    }

}


export const deleteProductController = async (req, res) => {

    try {
        const product = await productModel.findById(req.params.id);

        if (!product) {
            return res.status(404).send({
                success: false,
                message: "Product Not Found"
            })

        }

        //find and delete image from coludanary

        for (let i = 0; i < product.images.length; i++) {

            await coludinary.v2.uploader.destroy(product.images[i].public_id);
        }

        await product.deleteOne();
        res.status(200).send({
            success: true,
            message: "Product deleted Succesfully",


        })

    } catch (error) {
        console.log(error);

        res.status(500).send({
            success: false,
            message: "Error in delete image Products",
            error
        })
    }
}





// export const bannerController = async (req, res) => {

//     try {

//         // const { name, description, price, stock, category } = req.body;

//         // if (!name || !description || !price || !stock || !category) {

//         //     return res.status(500).send({
//         //         success: false,
//         //         message: "Provide All fileds"
//         //     })
//         // }

//         // if (!req.file) {

//         //     return res.status(500).send({
//         //         success: false,
//         //         message: "Please Provide Images",
//         //         error
//         //     })
//         // }
//         const file = getDataUri(req.file)

//         const cdb = await coludinary.v2.uploader.upload(file.content)

//         const image = {

//             public_id: cdb.public_id,
//             url: cdb.secure_url
//         };

//         await bannerModel.create({
//              images: [image]
//         })

//         res.status(201).send({
//             success: true,
//             message: "Product Created Succesfully"

//         })

//     } catch (error) {

//         console.log(error);

//         res.status(500).send({
//             success: false,
//             message: "Error in create Products",
//             error
//         })

//     }

// }


export const bannerController = async (req, res) => {

    try {
    
   
        if (!req.file) {

            return res.status(500).send({
                success: false,
                message: "Please Provide Images",
                error
            })
        }
        const file = getDataUri(req.file)

        const cdb = await coludinary.v2.uploader.upload(file.content)

        const image = {

            public_id: cdb.public_id,
            url: cdb.secure_url
        };

        await bannerModel.create({
           images: [image]
        })

        res.status(201).send({
            success: true,
            message: "Product Created Succesfully"

        })
  } catch (error) {
    console.error('Error uploading images:', error);
    res.status(500).json({ error: 'Error uploading images' });
  }
};






export const getAllBanners = async (req, res) => {

    try {

        const banner = await bannerModel.find({});

        res.status(200).send({

            success: true,
            message: "All Category fetch Succesfully",

            total: banner.length,
            banner
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





// Endpoint to send email
export const sendemail   = async(req, res) => {
    try {
      
const transporter =nodemailer.createTransport({
      service: 'gmail',
       host: 'smtp.gmail.com',
   port: 465,
   secure: false,
  auth: {
    user: 'appsupport@global-opportunities.co.in', // Your Gmail email address
    pass: '45824582' // Your Gmail password
  }
});
    // Extract email details from request body
      const { to, subject, text } = req.body;
      
 

    // Create email options
    const mailOptions = {
      to: 'mohit.global67@gmail.com',
    //   to :"mohit@global-opportunities.net",
      subject:"test data",
      text:"efnkjnkj" 
    };

    // Send email
    await transporter.sendMail(mailOptions);

    res.json({ success: true, message: 'Email sent successfully' });
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({ success: false, error: 'Error sending email' });
  }
};





// API endpoint to request OTP
export const otpcreate =  async (req, res) => {
    const { phone } = req.body;
    
   const existingOTP = await OtpModel.findOne({ phone }).exec();
    if (existingOTP) {
        await existingOTP.deleteOne();
    }
    const otp = generateOTP();

    try {
        await OtpModel.create({ phone, otp });
        //    await sendOTP(phone, otp);
        
       await sendOTP( phone, otp );
        res.status(200).json({ message: 'OTP sent successfully' , otp});
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal server error' });
    }
};



export const verifiedOtp = async(req, res) => {
    const { phone, otp } = req.body;
    try {
        const existingOTP = await OtpModel.findOne({ phone, otp }).exec();
        if (existingOTP) {
            res.status(200).json({ message: 'OTP verified successfully' });
        } else {
            res.status(400).json({ message: 'Invalid OTP' });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal server error' });
    }
};