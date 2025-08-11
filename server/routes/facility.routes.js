import express from 'express';
import { authorize } from '../middlewares/auth.middlewares.js'
import { createFacility, getFacilities, deleteFacility, updateFacility, getFacilitiesByUser } from '../controllers/facility.controllers.js';

export const facilityRouter = express.Router();

facilityRouter.post('/create', authorize, createFacility);
facilityRouter.get('/getfacilities', getFacilities);
facilityRouter.delete('/deletefacility/:facilityId', authorize, deleteFacility);
facilityRouter.put('/updatefacility/:facilityId', authorize, updateFacility);
facilityRouter.get('/getFacilitiesByUser', getFacilitiesByUser);