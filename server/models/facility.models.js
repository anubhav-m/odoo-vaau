import mongoose from 'mongoose';

const facilitySchema = new mongoose.Schema({
    ownerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'Facility owner is required']
    },
    name: {
        type: String,
        required: [true, 'Facility name is required'],
        minLength: [3, 'Minimum length is 3 characters'],
        maxLength: [100, 'Maximum length is 100 characters']
    },
    location: {
        type: String,
        required: [true, 'Location is required'],
        maxLength: [200, 'Maximum length is 200 characters']
    },
    description: {
        type: String,
        maxLength: [1000, 'Description cannot exceed 1000 characters']
    },
    sports: {
        type: [String],
        required: [true, 'At least one sport type is required']
    },
    amenities: {
        type: [String],
        default: []
    },
    images: {
        type: [String],
        default: []
    },
    status: {
        type: String,
        enum: ['pending', 'approved', 'rejected'],
        default: 'pending'
    },
    courts:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Court'
    }
}, { timestamps: true });

const Facility = mongoose.model('Facility', facilitySchema);

export default Facility;
