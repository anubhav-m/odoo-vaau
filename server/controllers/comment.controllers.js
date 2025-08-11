import { Comment } from "../models/comment.models.js";
import { errorThrower } from "../utils/error.js";

export const createComment = async (req, res, next) => {
    try {
        const { content, postId } = req.body;
        const userId = req.user._id;

        const newComment = new Comment({
            content,
            postId,
            userId
        });

        await newComment.save();

        res.status(200).json({
            success: true,
            message: 'Comment created successfully',
            comment: newComment
        })
    }

    catch (err) {
        next(err);
    }
}

export const getPostCommentByPostId = async (req, res, next) => {
    try {
        const postId = req.params.postId;

        if (!postId) {
            errorThrower(400, 'Please provide postId');
        }

        const comments = await Comment.find({ postId: req.params.postId }).sort({
            createdAt: -1
        });

        res.status(200).json({
            success: true,
            message: 'Sucessfully retreived all comments',
            comments
        })
    }

    catch (err) {
        next(err);
    }
}

export const likeComment = async (req, res, next) => {
    try {
        const commentId = req.params.commentId;
        const user = req.user.id;

        if (!commentId) {
            errorThrower(400, 'No commentId found');
        }

        const comment = await Comment.findById(commentId);

        if (!comment) {
            errorThrower(404, 'No comment found by the given commentId');
        }

        const userIndex = comment.likes.indexOf(user);

        if (userIndex === -1) {
            comment.numberOfLikes += 1;
            comment.likes.push(user);
        }
        else {
            comment.numberOfLikes -= 1;
            comment.likes.splice(userIndex, 1);
        }

        await comment.save();

        res.status(200).json({
            success: true,
            message: "Successfully updated count of likes",
            comment
        })
    }

    catch (err) {
        next(err);
    }
}


export const editComment = async (req, res, next) => {
    try {
        const commentId = req.params.commentId;

        if (!commentId) {
            errorThrower(400, 'Comment ID is required');
        }

        const comment = await Comment.findById(commentId);

        if (!comment) {
            errorThrower(404, 'Comment not found');
        }

        const isOwner = req.user;
        const isAdmin = req.user.isAdmin;

        if (!isOwner && !isAdmin) {
            errorThrower(403, 'Unauthorized - You cannot eedit this comment');
        }

        const editedComment = await Comment.findByIdAndUpdate(
            commentId,
            {
                content: req.body.content
            },
            { new: true }
        );

        res.status(200).json({
            success: true,
            message: 'Comment successfully updated',
            comment: editedComment
        })
    }

    catch (err) {
        next(err);
    }
}

export const deleteComment = async (req, res, next) => {
    try {
        const commentId = req.params.commentId;

        if (!commentId) {
            errorThrower(400, 'Comment ID is required');
        }

        const comment = await Comment.findById(commentId);

        if (!comment) {
            errorThrower(404, 'Comment not found');
        }

        const isOwner = req.user;
        const isAdmin = req.user.isAdmin;

        if (!isOwner && !isAdmin) {
            errorThrower(403, 'Unauthorized - You cannot delete this comment');
        }

        await Comment.findByIdAndDelete(commentId);

        res.status(200).json({
            success: true,
            message: 'Comment successfully deleted'
        })
    }

    catch (err) {
        next(err);
    }
}

export const getComments = async (req, res, next) => {
    try {
        if (!req.user.isAdmin) {
            errorThrower(403, 'Unauthorized - Only admins can access this route');
        }

        const startIndex = parseInt(req.query.startIndex) || 0;
        const limit = parseInt(req.query.limit) || 9;
        const sortDirection = req.query.sortDirection === 'desc' ? -1 : 1;

        const comments = await Comment.find()
            .populate('userId', 'username profilePic')
            .sort({ createdAt: sortDirection})
            .skip(startIndex)
            .limit(limit);

            const totalComments = await Comment.countDocuments();

            const now = new Date();
            const oneMonthAgo = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
            const lastMonthComments = await Comment.countDocuments();

        res.status(200).json({
            success: true,
            message: 'Successfully retrieved comments',
            comments,
            totalComments,
            lastMonthComments
        });
    } catch (err) {
        next(err);
    }
}