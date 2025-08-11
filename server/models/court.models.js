import mongoose from 'mongoose';

const courtSchema = new mongoose.Schema({
    facilityId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Facility',
        required: [true, 'Facility ID is required']
    },
    name: {
        type: String,
        required: [true, 'Court name is required'],
        minLength: [2, 'Minimum length is 2 characters'],
        maxLength: [50, 'Maximum length is 50 characters']
    },
    sportType: {
        type: String,
        required: [true, 'Sport type is required']
    },
    pricePerHour: {
        type: Number,
        required: [true, 'Price per hour is required'],
        min: [0, 'Price cannot be negative']
    },
    operatingHours: {
        start: { type: String, required: [true, 'Start time is required'] },
        end: { type: String, required: [true, 'End time is required'] }
    }
}, { timestamps: true });

const Court = mongoose.model('Court', courtSchema);

export default Court;
