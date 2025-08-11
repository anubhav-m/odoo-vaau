import { useEffect, useState } from "react";
import moment from 'moment';
import { FaThumbsUp } from 'react-icons/fa'
import { useSelector } from "react-redux";
import { Textarea, Button } from 'flowbite-react';

export default function Comment({ comment, onLike, onEdit, onDelete }) {
    const [user, setUser] = useState({});
    const { currentUser } = useSelector(state => state.user);
    const [isEditing, setIsEditing] = useState(false);
    const [editedContent, setEditedContent] = useState(comment.content);

    useEffect(() => {
        const getUser = async () => {
            try {
                const res = await fetch(`/api/user/${comment.userId}`);
                const data = await res.json();

                if (!data.success) {
                    throw new Error('User not found');
                }

                setUser(data.user);

            }
            catch (error) {
                setError('User not found');
            }
        }

        getUser();
    }, [comment])

    const handleEdit = () => {
        setIsEditing(true);
        setEditedContent(comment.content);
    }

    const handleSave = async (comment) => {
        try {
            const res = await fetch(`/api/comment/editComment/${comment._id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ content: editedContent })
            });

            const data = await res.json();

            if (!data.success) {
                throw new Error('Error updating comment');
            }

            setIsEditing(false);
            onEdit(comment, editedContent);
        }

        catch (err) {
            console.error(err);
        }
    }

    return (
        <div className="flex border-b dark:border-gray-600 text-sm mb-10 pb-2">
            <div className="flex-shrink-0 mr-4">
                <img className="w-10 h-10 rounded-full object-cover bg-gray-200" src={user.profilePic} alt={user.username} />
            </div>
            <div className="flex-1">
                <div className="flex items-center mb-3">
                    <span className="font-bold mr-3 text-xs truncate ">{user ? `@${user.username}` : 'anonymous'}</span>
                    <span className="text-gray-500 text-xs">
                        {moment(comment.createdAt).fromNow()}
                    </span>
                </div>

                {
                    isEditing ? (
                        <>
                            <Textarea
                                className="mb-2 resize-none"
                                rows='3'
                                value={editedContent}
                                onChange={(e) => setEditedContent(e.target.value)}
                            />

                            <div className="flex justify-end gap-3 ">
                                <Button
                                    className="cursor-pointer bg-gradient-to-br from-purple-600 to-blue-500 text-white hover:bg-gradient-to-bl focus:ring-blue-300 dark:focus:ring-blue-800"
                                    type="button" size="xs" onClick={() => handleSave(comment, editedContent)}
                                >
                                    Save
                                </Button>

                                <Button
                                    className="cursor-pointer bg-gradient-to-br from-purple-600 to-blue-500 text-white hover:bg-gradient-to-bl focus:ring-blue-300 dark:focus:ring-blue-800"
                                    type="button" size="xs" onClick={() => setIsEditing(false)}
                                >
                                    Cancel
                                </Button>


                            </div>
                        </>
                    ) : (
                        <>
                            <p className="text-gray-500 pb-2">{comment.content}</p>

                            <div className="flex gap-3 items-center text-xs mb-1 border-t dark:border-gray-700 max-w-fit pt-2" >
                                <button
                                    type="button"
                                    className={`pb-1 cursor-pointer text-gray-400 hover:text-blue-500 ${currentUser && comment.likes.includes(currentUser._id) && '!text-blue-600'}`}
                                    onClick={() => onLike(comment._id)}
                                >
                                    <FaThumbsUp className="text-sm" />
                                </button>

                                <p className="text-gray-400">
                                    {
                                        comment.numberOfLikes > 0 && comment.numberOfLikes + " " + (comment.numberOfLikes === 1 ? 'like' : 'likes')
                                    }
                                </p>

                                {
                                    currentUser && (currentUser._id === comment.userId || currentUser.isAdmin) && (
                                        <>
                                            <button
                                                type="button"
                                                className="text-gray-400 hover:text-blue-500 cursor-pointer"
                                                onClick={handleEdit}
                                            >
                                                Edit
                                            </button>

                                            <button
                                                type="button"
                                                className="text-gray-400 hover:text-red-500 cursor-pointer"
                                                onClick={() => onDelete(comment._id)}
                                            >
                                                Delete
                                            </button>
                                        </>
                                    )
                                }
                            </div>
                        </>
                    )
                }


            </div>

        </div>
    )
}