import { Router } from 'express';
import { verifyJWT } from '../middlewares/auth.middleware.js';
import {
  addIntrest,
  createUserprofile,
  updateUserprofile,
} from '../controllers/userprofile.controller.js';
import { upload } from '../middlewares/multer.middleware.js';

const userprofileRouter = Router();

userprofileRouter.route('/userprofile/createuserprofile').post(
  verifyJWT,
  upload.fields([
    {
      name: 'profileImage',
      maxCount: 1,
    },
  ]),
  createUserprofile
);
userprofileRouter.route('/userprofile/updateuserprofile/:id').put(verifyJWT, updateUserprofile);
userprofileRouter.route('/userprofile/addintrest').get(addIntrest);

export default userprofileRouter;
