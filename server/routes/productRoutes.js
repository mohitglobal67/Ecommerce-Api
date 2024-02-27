import express from "express";
import { bannerController, createProductController, deleteProductController, deleteProductImageController, getAllBanners, getAllProducts, getSingleProductController, otpcreate, sendemail, updateProductController, updateproductImageController, verifiedOtp } from "../controllers/productController.js";
import userAuth from "../middleware/authmiddleware.js";
import { singleUpload, uploadmultiple } from "../middleware/multar.js";

import http  from 'http';
import  {HubConnectionBuilder} from '@microsoft/signalr';


const routes = express.Router();


//Get All products
routes.get('/get-all', getAllProducts)

//Get single products
routes.get('/get-singleproduct/:id', getSingleProductController)

routes.post('/create-product', userAuth, singleUpload, createProductController)

//UPDATE Product

routes.put('/update-product/:id', userAuth, updateProductController)

//update product image


routes.put('/update-image/:id', userAuth, singleUpload, updateproductImageController)

// delete product image

routes.delete('/delete-image/:id', userAuth, deleteProductImageController)

// delete product 

routes.delete('/delete-product/:id', userAuth, deleteProductController)


//banner routes


routes.post('/create-banner', singleUpload, bannerController)


//Get banners


routes.get('/get-banner', getAllBanners)


routes.post('/send-email', sendemail)

//otp send

routes.post('/send-otp', otpcreate)

routes.post('/verify-otp', verifiedOtp)



const hubConnection = new HubConnectionBuilder()
  .withUrl('http://192.168.1.113:8080/chatHub')
  .build();

hubConnection.on('ReceiveMessage', (user, message) => {
  console.log(`${user}: ${message}`);
});



routes.post('/api/sendMessage', (req, res) => {
    const { user, message } = req.body;
    
    
    hubConnection.invoke('SendMessage', user, message)
      
        
        .catch(err => console.error(err));
    console.log(`${user}: ${message}`);
  res.sendStatus(200);
});

export default routes;