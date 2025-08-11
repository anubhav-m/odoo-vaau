import mongoose from 'mongoose';

const timeSlotSchema = new mongoose.Schema({
    courtId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Court',
        required: [true, 'Court ID is required']
    },
    date: {
        type: Date,
        required: [true, 'Date is required']
    },
    startTime: {
        type: String,
        required: [true, 'Start time is required']
    },
    endTime: {
        type: String,
        required: [true, 'End time is required']
    },
    isAvailable: {
        type: Boolean,
        default: true
    },
    blockedReason: {
        type: String,
        default: ''
    }
}, { timestamps: true });

const TimeSlot = mongoose.model('TimeSlot', timeSlotSchema);

export default TimeSlot;
