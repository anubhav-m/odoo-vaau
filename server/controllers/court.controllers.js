import Court from '../models/court.models.js';
import Facility from '../models/facility.models.js';
import { errorSetter, errorThrower } from '../utils/error.js';

// CREATE COURT
export const createCourt = async (req, res, next) => {
    try {
        const { facilityId, name, sportType, pricePerHour, operatingHours } = req.body;

        // Validation
        if (!facilityId || !name?.trim() || !sportType?.trim() || pricePerHour == null || !operatingHours?.start || !operatingHours?.end) {
            errorThrower(400, 'Please provide all required fields');
        }

        // Verify facility exists and ownership
        const facility = await Facility.findById(facilityId);
        if (!facility) errorThrower(404, 'Facility not found');

        const isOwner = facility.ownerId.toString() === req.user._id.toString();
        const isAdmin = req.user.isAdmin;
        if (!isOwner && !isAdmin) {
            errorThrower(403, 'You are not allowed to add courts to this facility');
        }

        // Create court
        const newCourt = new Court({
            facilityId,
            name: name.trim(),
            sportType: sportType.trim(),
            pricePerHour,
            operatingHours
        });

        const savedCourt = await newCourt.save();

        res.status(201).json({
            success: true,
            message: 'Court created successfully',
            court: savedCourt
        });
    } catch (err) {
        next(err);
    }
};

// GET COURTS
export const getCourts = async (req, res, next) => {
    try {
        const { courtId, facilityId, sportType, searchTerm } = req.query;

        const query = {
            ...(courtId && { _id: courtId }),
            ...(facilityId && { facilityId }),
            ...(sportType && { sportType }),
            ...(searchTerm && { name: { $regex: searchTerm, $options: 'i' } })
        };

        const courts = await Court.find(query)
            .populate('facilityId', 'name location sports')
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            message: 'Courts retrieved successfully',
            courts
        });
    } catch (err) {
        next(err);
    }
};

// UPDATE COURT
export const updateCourt = async (req, res, next) => {
    try {
        const court = await Court.findById(req.params.courtId);
        if (!court) errorThrower(404, 'Court not found');

        // Verify facility ownership
        const facility = await Facility.findById(court.facilityId);
        if (!facility) errorThrower(404, 'Facility not found');

        const isOwner = facility.ownerId.toString() === req.user._id.toString();
        const isAdmin = req.user.isAdmin;
        if (!isOwner && !isAdmin) {
            errorThrower(403, 'You are not allowed to update this court');
        }

        const { name, sportType, pricePerHour, operatingHours } = req.body;

        const updatedCourt = await Court.findByIdAndUpdate(
            req.params.courtId,
            {
                ...(name && { name: name.trim() }),
                ...(sportType && { sportType: sportType.trim() }),
                ...(pricePerHour != null && { pricePerHour }),
                ...(operatingHours && { operatingHours })
            },
            { new: true }
        );

        res.status(200).json({
            success: true,
            message: 'Court updated successfully',
            court: updatedCourt
        });
    } catch (err) {
        next(err);
    }
};

// DELETE COURT
export const deleteCourt = async (req, res, next) => {
    try {
        const court = await Court.findById(req.params.courtId);
        if (!court) errorThrower(404, 'Court not found');

        // Verify facility ownership
        const facility = await Facility.findById(court.facilityId);
        if (!facility) errorThrower(404, 'Facility not found');

        const isOwner = facility.ownerId.toString() === req.user._id.toString();
        const isAdmin = req.user.isAdmin;
        if (!isOwner && !isAdmin) {
            errorThrower(403, 'You are not allowed to delete this court');
        }

        await court.deleteOne();

        res.status(200).json({
            success: true,
            message: 'Court deleted successfully'
        });
    } catch (err) {
        next(err);
    }
};
