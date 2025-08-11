import { Modal, ModalHeader, ModalBody, Table, Button, TableHead, TableHeadCell, TableBody, TableRow, TableCell } from 'flowbite-react';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { HiOutlineExclamationCircle } from 'react-icons/hi';
import { HashLoader } from 'react-spinners'

export default function DashComments() {
    const { currentUser } = useSelector((state) => state.user);
    const [comments, setComments] = useState([]);
    const [showMore, setShowMore] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [commentIdToDelete, setCommentIdToDelete] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchComments = async () => {
            setLoading(true);
            try {
                const res = await fetch(`/api/comment/getcomments`);
                const data = await res.json();
                if (res.ok) {
                    setComments(data.comments);
                    if (data.comments.length < 9) {
                        setShowMore(false);
                    }
                }
            } catch (error) {
                console.log(error.message);
            }
            finally {
                setLoading(false);
            }
        };
        if (currentUser.isAdmin) {
            fetchComments();
        }
        else{
            setLoading(false);
        }
    }, [currentUser._id]);

    const handleShowMore = async () => {
        const startIndex = comments.length;
        try {
            const res = await fetch(
                `/api/comment/getcomments?startIndex=${startIndex}`
            );
            const data = await res.json();
            if (res.ok) {
                setComments((prev) => [...prev, ...data.comments]);
                if (data.comments.length < 9) {
                    setShowMore(false);
                }
            }
        } catch (error) {
            console.log(error.message);
        }
    };

    const handleDeleteComment = async () => {
        setShowModal(false);
        try {
            const res = await fetch(
                `/api/comment/deleteComment/${commentIdToDelete}`,
                {
                    method: 'DELETE',
                }
            );
            const data = await res.json();
            if (res.ok) {
                setComments((prev) =>
                    prev.filter((comment) => comment._id !== commentIdToDelete)
                );
                setShowModal(false);
            } else {
                console.log(data.message);
            }
        } catch (error) {
            console.log(error.message);
        }
    };

    return (
        <div className='max-w-full h-full table-auto overflow-x-auto md:mx-auto p-5 scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300 dark:scrollbar-track-slate-700 dark:scrollbar-thumb-slate-500'>
            {
                loading ? (<div className="w-full flex justify-center items-center h-full">
                    <HashLoader className="text-center" color="aqua" size='50' loading={loading} />
                </div>) : (
                    currentUser.isAdmin ? (
                        comments.length > 0 ? (
                            <>
                                <Table hoverable className='shadow-md'>
                                    <TableHead>
                                        <TableHeadCell>Date updated</TableHeadCell>
                                        {currentUser.isAdmin && <TableHeadCell>User image</TableHeadCell>}
                                        {currentUser.isAdmin && <TableHeadCell>Username</TableHeadCell>}
                                        <TableHeadCell>Comment content</TableHeadCell>
                                        <TableHeadCell>Number of likes</TableHeadCell>
                                        <TableHeadCell>PostId</TableHeadCell>
                                        <TableHeadCell>UserId</TableHeadCell>
                                        <TableHeadCell>Delete</TableHeadCell>
                                    </TableHead>
                                    {comments.map((comment) => (
                                        <TableBody className='divide-y' key={comment._id}>
                                            <TableRow className='bg-white dark:border-gray-700 dark:bg-gray-800'>
                                                <TableCell>
                                                    {new Date(comment.updatedAt).toLocaleDateString()}
                                                </TableCell>
                                                {currentUser.isAdmin &&
                                                    <>
                                                        <TableCell className="truncate">
                                                            <img src={comment.userId.profilePic} alt={comment.userId.username} className="w-10 h-10 object-cover rounded-full bg-gray-500" referrerPolicy="no-referrer" />
                                                        </TableCell>
                                                        <TableCell>
                                                            {comment.userId.username}
                                                        </TableCell>

                                                    </>
                                                }
                                                <TableCell>{comment.content}</TableCell>
                                                <TableCell>{comment.numberOfLikes}</TableCell>
                                                <TableCell>{comment.postId}</TableCell>
                                                <TableCell>{comment.userId._id}</TableCell>
                                                <TableCell>
                                                    <span
                                                        onClick={() => {
                                                            setShowModal(true);
                                                            setCommentIdToDelete(comment._id);
                                                        }}
                                                        className='font-medium text-red-500 hover:underline cursor-pointer'
                                                    >
                                                        Delete
                                                    </span>
                                                </TableCell>
                                            </TableRow>
                                        </TableBody>
                                    ))}
                                </Table>
                                {showMore && (
                                    <button
                                        onClick={handleShowMore}
                                        className='w-full text-teal-500 self-center text-sm py-7'
                                    >
                                        Show more
                                    </button>
                                )}
                            </>
                        ) : (
                            <p className="text-center text-xl">No comments found</p>
                        )

                    ) : (
                        <p className='text-center text-xl'>403 - Unauthorized - Only admins can access this page</p>
                    )
                )
            }


            <Modal
                show={showModal}
                onClose={() => setShowModal(false)}
                popup
                size='md'
            >
                <ModalHeader />
                <ModalBody>
                    <div className='text-center'>
                        <HiOutlineExclamationCircle className='h-14 w-14 text-gray-400 dark:text-gray-200 mb-4 mx-auto' />
                        <h3 className='mb-5 text-lg text-gray-500 dark:text-gray-400'>
                            Are you sure you want to delete this comment?
                        </h3>
                        <div className='flex justify-center gap-4'>
                            <Button color='failure' onClick={handleDeleteComment}>
                                Yes, I'm sure
                            </Button>
                            <Button color='gray' onClick={() => setShowModal(false)}>
                                No, cancel
                            </Button>
                        </div>
                    </div>
                </ModalBody>
            </Modal>
        </div>
    );
}
