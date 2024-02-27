import express from "express";
import userAuth from "../middleware/authmiddleware.js";
import { createOrderController, getMyOrdersCotroller, paymetsController, singleOrderDetrailsController } from "../controllers/orderControllere.js";


const routes = express.Router();



routes.post('/create-order', userAuth, createOrderController)


//  GET ALL ORDERS
routes.get("/get-orders", userAuth, getMyOrdersCotroller);


routes.get("/single-orders-details/:id", userAuth, singleOrderDetrailsController);


// acceipt payments
routes.post("/payments",  paymetsController);

export default routes;