import mongoose from 'mongoose'

const commentSchema = new mongoose.Schema({
    content: {
        type: String,
        required: true
    },

    postId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Post',
        required: [true, 'Post id is required'],
        index: true
    },

    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'User id is required'],
        index: true
    },

    likes: {
        type: Array,
        default: [],
    },

    numberOfLikes: {
        type: Number,
        default: 0
    }
}, { timestamps: true });

export const Comment = new mongoose.model('Comment', commentSchema);