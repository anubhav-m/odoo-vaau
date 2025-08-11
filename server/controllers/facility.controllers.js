import { errorSetter, errorThrower } from "../utils/error.js";
import Facility from "../models/facility.models.js";


export const createFacility = async (req, res, next) => {
    try {
        const { name, location, description, sports, amenities, images } = req.body;

        // Validation
        if (!name?.trim() || !location?.trim() || !Array.isArray(sports) || sports.length === 0) {
            errorThrower(400, 'Please provide all required fields (name, location, and at least one sport)');
        }

        // Create facility
        const newFacility = new Facility({
            ownerId: req.user.id, // from authorize middleware
            name: name.trim(),
            location: location.trim(),
            description: description?.trim() || '',
            sports,
            amenities: amenities || [],
            images: images || []
        });

        const savedFacility = await newFacility.save();

        res.status(201).json({
            success: true,
            message: 'Facility created successfully',
            facility: savedFacility
        });

    } catch (err) {
        // Duplicate entry handling
        if (err.code === 11000) {
            next(errorSetter(409, 'A facility with this name already exists'));
        } else {
            next(err);
        }
    }
};


export const getFacilities = async (req, res, next) => {
    try {
        const { slug } = req.query;

        // If slug is passed, fetch a single facility by slug
        if (slug) {
            const facility = await Facility.findById(slug)
                .populate('ownerId', 'username profilePic email')
                .populate('courts', 'sportType')
                

            if (!facility) {
                return res.status(404).json({
                    success: false,
                    message: 'Facility not found'
                });
            }

            return res.status(200).json({
                success: true,
                message: 'Facility retrieved successfully',
                facility
            });
        }

        // Otherwise, continue with normal paginated search
        const startIndex = parseInt(req.query.startIndex) || 0;
        const limit = parseInt(req.query.limit) || 9;
        const sortDirection = req.query.order === 'desc' ? -1 : 1;

        const query = {
            ...(req.query.ownerId && { ownerId: req.query.ownerId }),
            ...(req.query.facilityId && { _id: req.query.facilityId }),
            ...(req.query.searchTerm && {
                $or: [
                    { name: { $regex: req.query.searchTerm, $options: 'i' } },
                    { description: { $regex: req.query.searchTerm, $options: 'i' } },
                    { location: { $regex: req.query.searchTerm, $options: 'i' } }
                ]
            }),
            ...(req.query.sport && { sports: { $in: [req.query.sport] } })
        };

        const facilities = await Facility.find(query)
            .populate('ownerId', 'username profilePic email')
            .populate('courts', 'sportType')
            .sort({ updatedAt: sortDirection })
            .skip(startIndex)
            .limit(limit);

        const totalFacilities = await Facility.countDocuments(query);

        const now = new Date();
        const oneMonthAgo = new Date(
            now.getFullYear(),
            now.getMonth() - 1,
            now.getDate()
        );

        const lastMonthFacilities = await Facility.countDocuments({
            ...query,
            createdAt: { $gte: oneMonthAgo }
        });

        res.status(200).json({
            success: true,
            message: 'Facilities retrieved successfully',
            facilities,
            totalFacilities,
            lastMonthFacilities
        });

    } catch (err) {
        next(err);
    }
};



export const deleteFacility = async (req, res, next) => {
    try {
        const facility = await Facility.findById(req.params.facilityId);

        if (!facility) {
            errorThrower(404, 'Facility not found');
        }

        const isOwner = facility.ownerId.toString() === req.user._id.toString();
        const isAdmin = req.user.isAdmin;

        if (!isOwner && !isAdmin) {
            errorThrower(403, 'You are not allowed to delete this facility');
        }

        await facility.deleteOne();

        res.status(200).json({
            success: true,
            message: 'Facility deleted successfully'
        });
    } catch (err) {
        next(err);
    }
};


export const updateFacility = async (req, res, next) => {
    try {
        const facility = await Facility.findById(req.params.facilityId);

        if (!facility) {
            errorThrower(404, 'Facility not found');
        }

        const isOwner = facility.ownerId.toString() === req.user._id.toString();
        const isAdmin = req.user.isAdmin;

        if (!isOwner && !isAdmin) {
            errorThrower(403, 'You are not allowed to update this facility');
        }

        const {
            name,
            location,
            description,
            sports,
            amenities,
            images,
        } = req.body;

        // Validate required fields
        if (!name?.trim() || !location?.trim() || !Array.isArray(sports) || sports.length === 0) {
            errorThrower(400, 'Please provide all required fields (name, location, and at least one sport)');
        }

        // Build update object
        const updateData = {
            name: name.trim(),
            location: location.trim(),
            description: description?.trim() || '',
            sports,
            amenities: Array.isArray(amenities) ? amenities : [],
            images: Array.isArray(images) ? images : [],
        };

        const updatedFacility = await Facility.findByIdAndUpdate(
            req.params.facilityId,
            { $set: updateData },
            { new: true }
        );

        res.status(200).json({
            success: true,
            message: 'Facility updated successfully',
            facility: updatedFacility,
        });

    } catch (err) {
        next(err);
    }
};

