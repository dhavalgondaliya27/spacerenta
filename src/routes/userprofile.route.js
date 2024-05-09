import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { addIntrest,createUserprofile, updateUserprofile } from "../controllers/userprofile.controller.js";

const userprofileRouter = Router();

userprofileRouter.route("/userprofile/createuserprofile").post(verifyJWT, createUserprofile);
userprofileRouter.route("/userprofile/updateuserprofile/:id").put(verifyJWT, updateUserprofile);
userprofileRouter.route("/userprofile/addintrest").get(addIntrest);

export default userprofileRouter;
