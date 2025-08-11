import { useSelector, useDispatch } from 'react-redux'
import { TextInput, Button, Spinner, Alert, Modal, ModalHeader, ModalBody } from 'flowbite-react';
import { Link } from 'react-router-dom'
import { useState, useRef } from 'react';
import {
    updateStart,
    updateSuccess,
    updateFailure,
    clearError,
    setError,
    deleteUserStart,
    deleteUserSuccess,
    deleteUserFailure,
    signOutStart,
    signOutSuccess,
    signOutFailure
} from '../redux/user/userSlice.js';
import { HiOutlineExclamationCircle } from 'react-icons/hi'
import { supabase } from '../supabase/supabaseClient.js'

export default function DashProfile() {
    const { currentUser, loading, error } = useSelector(state => state.user);
    const dispatch = useDispatch();
    const [formData, setFormData] = useState({});
    const [updateUserSuccess, setUserUpdateSuccess] = useState(null);
    const [showModal, setShowModal] = useState(false);

    const [uploadingImage, setUploadingImage] = useState(false);
    const [imageFileUrl, setImageFileUrl] = useState(null);
    const filePickerRef = useRef(null);


    const handleChange = (e) => {
        dispatch(clearError());
        setUserUpdateSuccess(null);
        setFormData({ ...formData, [e.target.id]: e.target.value });
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (Object.keys(formData).length === 0) {
            dispatch(setError('Nothing to update'));
            return;
        }

        try {
            dispatch(updateStart());

            const res = await fetch(`/api/user/update/${currentUser._id.toString()}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            const data = await res.json();

            if (!res.ok) {
                dispatch(updateFailure(data.message));
                setUserUpdateSuccess(false);
            }

            else {
                dispatch(updateSuccess(data.user));
                setUserUpdateSuccess(true);
            }
        }
        catch (err) {
            dispatch(updateFailure(err.message));
            setUserUpdateSuccess(false);
        }
    }


    const handleDeleteUser = async () => {
        setShowModal(false);

        try {
            dispatch(deleteUserStart());
            const res = await fetch(`/api/user/delete/${currentUser._id.toString()}`, {
                method: 'DELETE',
                'Content-Type': 'application/json'
            })

            const data = await res.json();

            if (!res.ok) {
                dispatch(deleteUserFailure(data.message));
            }

            else {
                dispatch(deleteUserSuccess());
            }
        }
        catch (error) {
            dispatch(deleteUserFailure(error.message));
        }
    }

    const handleSignOut = async () => {
        try {
            dispatch(signOutStart());
            const res = await fetch('/api/user/signout', {
                method: 'POST',
                'Content-Type': 'application/json'
            })

            if (!res.ok) {
                dispatch(signOutFailure());
            }

            else {
                dispatch(signOutSuccess());
            }
        }

        catch (error) {
            dispatch(signOutFailure());
        }
    }


    const handleImageChange = async (e) => {
        const file = e.target.files[0];
        if (file) {
            await handleUpload(e, file);
        }
    };

    const handleUpload = async (e, file) => {
        dispatch(clearError());
        setUploadingImage(true);

        try {
            if (!file) {
                throw new Error("No file selected.");
            }

            const fileExt = file.name.split('.').pop();
            const fileName = `${Date.now()}.${fileExt}`;
            const filePath = `${fileName}`;

            const { data, error } = await supabase.storage
                .from('profile-pic')
                .upload(filePath, file);

            if (error) {
                throw new Error(error.message);
            }

            const { data: publicUrlData } = supabase
                .storage
                .from('profile-pic')
                .getPublicUrl(filePath);

            if (!publicUrlData || !publicUrlData.publicUrl) {
                throw new Error('Public URL not available');
            }

            setImageFileUrl(publicUrlData.publicUrl);
            setUserUpdateSuccess(null);
            setFormData({ ...formData, profilePic: publicUrlData.publicUrl });

        }
        catch (err) {
            dispatch(setError(err.message || 'Upload failed'));
        }
        finally {
            setUploadingImage(false);
        }
    };

    return (
        <div className='flex flex-col items-center'>
            <h1 className='my-7 font-semibold text-3xl'>Profile</h1>
            <form className='flex flex-col gap-5 w-full items-center' onSubmit={handleSubmit}>
                <input type="file" accept='image/*' onChange={handleImageChange} ref={filePickerRef} hidden />
                <div className='relative w-32 h-32 shadow-md overflow-hidden rounded-full'
                    onClick={() => filePickerRef.current.click()}
                >
                    <img src={
                        imageFileUrl ||
                        currentUser.profilePic} referrerPolicy="no-referrer" alt="user" className='rounded-full w-full h-full object-cover border-8 border-[lightgray] cursor-pointer' />

                </div>

                <div className='flex flex-col gap-5 p-5 w-full md:w-100'>
                    <TextInput type='text' id='username' placeholder='username' defaultValue={currentUser.username} onChange={handleChange} />
                    <TextInput type='password' id='password' placeholder='password' onChange={handleChange} />
                    <button type='submit' className="relative inline-flex items-center justify-center p-0.5 mb-2 me-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-purple-600 to-blue-500 group-hover:from-purple-600 group-hover:to-blue-500 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 cursor-pointer" disabled={loading}>
                        <span className="w-full relative px-5 py-2.5 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-transparent group-hover:dark:bg-transparent">
                            {
                                (loading || uploadingImage) ? (
                                    <>
                                        <Spinner size='sm' />
                                        <span className='pl-3'>{uploadingImage ? 'Uploading image...' : 'Loading'}</span>
                                    </>
                                ) : 'Update'
                            }
                        </span>
                    </button>

                    {
                        currentUser.isFacilityOwner && (
                            <Link to='/create-facility'>
                                <Button
                                    type='button'
                                    className='cursor-pointer bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:bg-gradient-to-l focus:ring-purple-200 dark:focus:ring-purple-800 w-full'
                                >
                                    Create a facility
                                </Button>
                            </Link>

                        )
                    }

                </div>
            </form>

            <div className='flex justify-between px-5 w-full md:w-100 mt-3 mb-5'>
                <Button onClick={() => setShowModal(true)} outline color='red' className='cursor-pointer'>Delete Account</Button>
                <Button onClick={() => handleSignOut()} outline color='yellow' className='cursor-pointer'>Sign Out</Button>
            </div>

            {
                error && (
                    <Alert color='failure' className='mt-5'>{error}</Alert>
                )
            }

            {
                (updateUserSuccess) && (
                    <Alert color='green' className='mt-5'>User updated successfully</Alert>
                )
            }

            <Modal show={showModal} onClose={() => setShowModal(false)} popup size='md'>
                <ModalHeader />
                <ModalBody>
                    <div className="text-center">
                        <HiOutlineExclamationCircle className='h-14 w-14 text-gray-400 dark:text-gray-200 mb-4 mx-auto' />
                        <h3 className='mb-5 text-lg text-gray-500 dark:text-gray-400'>Are you sure you want to delete your account?</h3>
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