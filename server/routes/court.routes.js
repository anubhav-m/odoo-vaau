import express from 'express';
import { authorize } from '../middlewares/auth.middlewares.js';
import {
    createCourt,
    getCourts,
    updateCourt,
    deleteCourt
} from '../controllers/court.controllers.js';

export const courtRouter = express.Router();

// Create new court
courtRouter.post('/create', authorize, createCourt);

// Get courts (with filters / pagination)
courtRouter.get('/getcourts', getCourts);

// Update court
courtRouter.put('/updatecourt/:courtId', authorize, updateCourt);

// Delete court
courtRouter.delete('/deletecourt/:courtId', authorize, deleteCourt);
