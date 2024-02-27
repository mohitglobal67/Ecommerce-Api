import express from "express";
import { createQuestionController, createsubController, getAllQuestion, getAllUser, getUserProfileController, getsubjectchapterController, loginController, logoutController, registerController, updatePasswordController, updateProfileController, updateProfilePicController } from "../controllers/userController.js";
import userAuth from "../middleware/authmiddleware.js";
import { singleUpload } from "../middleware/multar.js";

const routes = express.Router();



// routes
//Resister APi
routes.post("/register", registerController)

// Login Api
routes.post("/login", loginController)

//get profile
routes.get("/profile", userAuth, getUserProfileController)


//Logot
routes.get("/logout", userAuth, logoutController)

//get all user

routes.get("/alluser",  getAllUser)

//update profile

routes.put("/update-profile", userAuth, updateProfileController)


//update password

routes.put("/update-password", userAuth, updatePasswordController)

//update profile pic

routes.put("/update-picture", singleUpload, userAuth, updateProfilePicController)


routes.post("/question", createQuestionController)


//get all user

routes.get("/allquestion/:id", getAllQuestion)

//sub cat subject
routes.post("/subcat", createsubController)

//get chapter question
routes.get('/get-subcat/:id', getsubjectchapterController)

export default routes;