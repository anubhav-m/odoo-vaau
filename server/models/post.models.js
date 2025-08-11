import mongoose from "mongoose";

const postSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'User is required'],
        index: true
    },

    content: {
        type:String,
        required: true,
    },

    title: {
        type: String,
        required: true,
        unique: true
    },

    image: {
        type: String,
        default:'https://contenthub-static.grammarly.com/blog/wp-content/uploads/2017/11/how-to-write-a-blog-post.jpeg'
    },
    
    category:{
        type: String,
        default: 'uncategorized'
    },

    slug:{
        type: String,
        required: true,
        unique: true
    }
}, { timestamps: true })

export const Post = new mongoose.model('Post', postSchema);