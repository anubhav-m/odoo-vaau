import { useEffect, useState } from "react"
import { useSelector, useDispatch } from 'react-redux'
import { setError, clearError } from '../redux/user/userSlice.js'
import { Table, TableHead, TableHeadCell, TableBody, TableRow, TableCell, Button, Modal, ModalHeader, ModalBody } from 'flowbite-react'
import { Link } from 'react-router-dom'
import { HashLoader } from 'react-spinners'
import { HiOutlineExclamationCircle } from 'react-icons/hi'
import { FaCheck, FaTimes } from 'react-icons/fa'

export default function DashUsers() {
    const { currentUser } = useSelector(state => state.user);
    const [users, setUsers] = useState([]);
    const [showMore, setShowMore] = useState(true);
    const [loadingUsers, setLoadingUsers] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [userIdToDelete, setUserIdToDelete] = useState(null);
    const dispatch = useDispatch();

    console.log(users);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                dispatch(setError(false));
                setLoadingUsers(true);
                const res = await fetch(`api/user/getusers`);
                const data = await res.json();

                console.log(data);

                if (!data.success) {
                    new Error('Error fetching data from server');
                }

                else {
                    setUsers(data.users);

                    if (data.users.length < 9) {
                        setShowMore(false);
                    }
                }
            }
            catch (err) {
                dispatch(setError(err.message));
            }
            finally {
                setLoadingUsers(false);
            }
        }
        fetchUsers();
    }, [currentUser._id])

    const handleShowMore = async () => {
        const startIndex = users.length;

        try {
            const res = await fetch(`/api/user/getusers/?startIndex=${startIndex}`);
            const data = await res.json();

            if (!data.success) {
                throw new Error('Error fetching more posts');
            }

            else {
                setUsers((prev) => [...prev, ...data.users]);
                if (data.users.length < 9) {
                    setShowMore(false);
                }
            }
        }

        catch (err) {
            dispatch(setError(err.message));
        }
    }

    const handleDeleteUser = async () => {
        console.log('Ye le delete ho gya user');
        setShowModal(false);
        dispatch(clearError());
        try {
            const res = await fetch(`/api/user/delete/${userIdToDelete}`, {
                method: 'DELETE',
            })

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.message);
            }

            else {
                setUsers((prev) => prev.filter((user) => user._id !== userIdToDelete))
            }
        }
        catch (error) {
            dispatch(setError(error.message));
        }
    }

    return (
        <div className="max-w-full h-full overflow-x-auto p-5
        scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300 dark:scrollbar-track-slate-700 dark:scrollbar-thumb-slate-500">
            {loadingUsers ?
                (
                    <div className="w-full flex justify-center items-center h-full">
                        <HashLoader className="text-center" color="aqua" size='50' loading={loadingUsers} />
                    </div>
                ) : (
                    currentUser.isAdmin ?
                        (
                            users.length > 0 ? (
                                <>
                                    <Table hoverable className="shadow-md">
                                        <TableHead>
                                            <TableHeadCell>Date created</TableHeadCell>
                                            <TableHeadCell>User image </TableHeadCell>
                                            <TableHeadCell>Username </TableHeadCell>
                                            <TableHeadCell>Email </TableHeadCell>
                                            <TableHeadCell>Admin </TableHeadCell >
                                            <TableHeadCell>Delete</TableHeadCell >
                                        </TableHead>


                                        <TableBody className="divide-y">
                                            {
                                                users.map((user) => (

                                                    <TableRow className="bg-white dark:border-gray-700 dark:bg-gray-800">
                                                        <TableCell>
                                                            {new Date(user.createdAt).toLocaleDateString()}
                                                        </TableCell>
                                                        <TableCell>
                                                            <img src={user.profilePic} alt={user.username} className="w-10 h-10 object-cover rounded-full bg-gray-500" referrerPolicy="no-referrer" />
                                                        </TableCell>
                                                        <TableCell className="truncate">
                                                            {user.username}
                                                        </TableCell>
                                                        <TableCell>
                                                            {user.email}
                                                        </TableCell>
                                                        <TableCell>
                                                            {user.isAdmin ? (<FaCheck className='text-green-500' />) : (<FaTimes className='text-red-500' />)}
                                                        </TableCell>
                                                        <TableCell>
                                                            <span onClick={() => {
                                                                setShowModal(true);
                                                                setUserIdToDelete(user._id);
                                                            }} className="font-medium text-red-500 hover:underline cursor-pointer"> Delete</span>
                                                        </TableCell>
                                                    </TableRow>

                                                ))
                                            }
                                        </TableBody>
                                    </Table>

                                    {
                                        showMore && (
                                            <Button onClick={handleShowMore} className="mt-5 mx-auto cursor-pointer" color='blue' outline>
                                                Show More
                                            </Button>
                                        )
                                    }

                                </>
                            ) : (
                                <p className="text-center text-xl">No users found</p>
                            )


                        ) : (
                            <p className="text-center text-xl">403 - Unauthorized - Only admins can access this page</p>
                        )
                )
            }

            <Modal show={showModal} onClose={() => setShowModal(false)} popup size='md'>
                <ModalHeader />
                <ModalBody>
                    <div className="text-center">
                        <HiOutlineExclamationCircle className='h-14 w-14 text-gray-400 dark:text-gray-200 mb-4 mx-auto' />
                        <h3 className='mb-5 text-lg text-gray-500 dark:text-gray-400'>Are you sure you want to delete this user?</h3>
                        <div className='flex justify-between px-7'>
                            <Button color='red' onClick={handleDeleteUser} className='cursor-pointer'>
                                Yes, I am sure
                            </Button>

                            <Button onClick={() => setShowModal(false)} className='cursor-pointer'>No, cancel</Button>
                        </div>
                    </div>
                </ModalBody>
            </Modal>

        </div>
    )
}