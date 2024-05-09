import { Router } from 'express';
import { verifyJWT } from '../middlewares/auth.middleware.js';
import {
  addFacility,
  createGuestSafety,
  createHouseRule,
  createProperty,
  showOwnProperties,
  showProperties,
  updateProperty,
} from '../controllers/properties.controller.js';
import { upload } from '../middlewares/multer.middleware.js';

const propertyRouter = Router();

propertyRouter
  .route('/property/createproperty')
  .post(verifyJWT, upload.array('photo', 5), createProperty);
propertyRouter.route('/property/updateproperty/:id').put(verifyJWT, updateProperty);
propertyRouter.route('/property/addfacility').post(addFacility);
propertyRouter.route('/property/showproperty').get(verifyJWT, showProperties);
propertyRouter.route('/property/showOwnProperty').get(verifyJWT, showOwnProperties);
propertyRouter.route('/property/houserule/:id').post(verifyJWT, createHouseRule);
propertyRouter.route('/property/guestsafety/:id').post(verifyJWT, createGuestSafety);

export default propertyRouter;
