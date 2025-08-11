import { useState } from 'react'
import { Link, useNavigate } from "react-router-dom"
import { Label, TextInput, Button, Alert, Spinner, Select } from "flowbite-react"
import OAuth from '../components/OAuth.jsx'
import { useDispatch, useSelector } from 'react-redux'
import { signUpStart, signUpSuccess, signUpFailure, clearError } from '../redux/user/userSlice.js'

export default function SignUp() {
    const [formData, setFormData] = useState({
        role: 'player',
        username: '',
        email: '',
        password: '',
    });

    const [confirmPassword, setConfirmPassword] = useState('');

    console.log(formData);


    const { error: errorMessage, loading } = useSelector(state => state.user);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleChange = (e) => {
        dispatch(clearError());
        setFormData({ ...formData, [e.target.id]: e.target.value.trim() })
    }

    const handleConfirmPasswordChange = (e) => {
        dispatch(clearError());
        setConfirmPassword(e.target.value.trim());

    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (formData.password !== confirmPassword) {
            return dispatch(signUpFailure('Passwords do not match'));
        }

        //Frontend Form Validation
        if (formData.username.length < 5 || formData.username.length > 30) {
            return dispatch(signUpFailure('Username must be atleast 5 and atmost 30 characters'));
        }

        if (formData.username.includes(' ')) {

            return dispatch(signUpFailure('Username cannot contain spaces'));
        }

        if (formData.username !== formData.username.toLowerCase()) {
            return dispatch(signUpFailure('Username must be in lowercase'));
        }

        if (!formData.username.match(/^[a-z0-9]+$/)) {
            return dispatch(signUpFailure('Username can only contain letters and numbers'));
        }

        if (!formData.username.trim() || !formData.email.trim() || !formData.password.trim()) {
            return dispatch(signUpFailure('Please fill out all fields'));
        }

        if (formData.password.length < 5 || formData.password.length > 14) {
            return dispatch(signUpFailure('Password must be atleast 5 and atmost 14 characters'));
        }

        if (formData.password.includes(' ')) {
            return dispatch(signUpFailure('Password cannot contain spaces'));
        }

        //

        try {
            dispatch(signUpStart());
            const res = await fetch('/api/auth/signup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            })

            const data = await res.json();

            if (!data.success) {
                return dispatch(signUpFailure(data.message));
            }

            if (res.ok) {
                navigate('/sign-in');
                dispatch(signUpSuccess());
            }

        }

        catch (err) {
            dispatch(signUpFailure(err.message));
        }

    }

    return (
        <div className="flex-1 flex justify-center items-center mb-15">
            <div className="flex flex-col md:flex-row gap-10 p-6 max-w-3xl mx-auto md:items-center">
                {/* left */}
                <div className="flex-1">
                    <Link to='/' className='font-bold dark:text-white text-4xl'>
                        <span className='px-2 py-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-lg text-white'>Quick</span>
                        Court
                    </Link>

                    <p className="text-sm mt-5">
                        QuickCourt is a platform that enables sports enthusiasts to book local
                        sports facilities and create or join matches with others in their area.
                    </p>
                </div>



                {/* right */}
                <div className="flex-1">
                    <form className="flex flex-col gap-4" onSubmit={handleSubmit}>

                        <div className="div">
                            <Label className=''>Select your role</Label>
                            <Select className='' onChange={handleChange} id='role'>
                                <option value="player">Player</option>
                                <option value="facility-owner">Facility Owner</option>
                            </Select>
                        </div>

                        <div className="">
                            <Label>Your username</Label>
                            <TextInput
                                type='text'
                                placeholder='Username'
                                id='username'
                                value={formData.username}
                                onChange={handleChange}
                                color={errorMessage ? 'warning' : 'gray'}
                            />
                        </div>

                        <div className="">
                            <Label>Your email</Label>
                            <TextInput
                                type='email'
                                placeholder='name@company.com'
                                id='email'
                                value={formData.email}
                                onChange={handleChange}
                                color={errorMessage ? 'warning' : 'gray'}
                            />
                        </div>

                        <div className="">
                            <Label>Your password</Label>
                            <TextInput
                                type='password'
                                placeholder='Password'
                                id='password'
                                value={formData.password}
                                onChange={handleChange}
                                color={errorMessage ? 'warning' : 'gray'}
                            />
                        </div>

                        <div className="">
                            <Label>Confirm Password</Label>
                            <TextInput
                                type='password'
                                placeholder='Confirm Password'
                                id='password'
                                value={confirmPassword}
                                onChange={handleConfirmPasswordChange}
                                color={errorMessage ? 'warning' : 'gray'}
                            />
                        </div>

                        <Button className='bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:bg-gradient-to-l focus:ring-purple-200 dark:focus:ring-purple-800 cursor-pointer'
                            type='submit'
                            disabled={loading}
                        >
                            {
                                loading ? (
                                    <>
                                        <Spinner size='sm' />
                                        <span className='pl-3'>Loading...</span>
                                    </>
                                ) : 'Sign Up'
                            }
                        </Button>

                        {/* <OAuth /> */}

                    </form>

                    <div className="flex gap-2 text-sm mt-5">
                        <span>Have an account?</span>
                        <Link to='/sign-in' className="text-blue-500">Sign In</Link>
                    </div>

                    {
                        errorMessage && (
                            <Alert className='mt-5' color='failure'>
                                {errorMessage}
                            </Alert>
                        )
                    }
                </div>
            </div>
        </div>
    )
}