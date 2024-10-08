import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast, Toaster } from 'react-hot-toast';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await axios.post('http://127.0.0.1:8000/api/login/', {
                email,
                password,
            });

            const { access, refresh } = response.data;
            localStorage.setItem('access_token', access); // Store access token
            localStorage.setItem('refresh_token', refresh); // Store refresh token
            toast.success('Login successful!'); // Toast success message
            navigate('/home'); // Redirect to your dashboard or home page
        } catch (error) {
            if (error.response) {
                // Request made and server responded
                toast.error(`Error: ${error.response.data.detail || 'Login failed!'}`);
            } else {
                // Something happened in setting up the request that triggered an Error
                toast.error('An error occurred! Please try again.');
            }
        } finally {
            setLoading(false);
        }
    };

    const handleSignupRedirect = () => {
        navigate('/signup'); // Navigate to the login page when "SIGN IN" is clicked
    };

    return (
        <div className='w-full flex'>
            <Toaster />
            <div className='left-container'>
                <div className='inner-container flex flex-col justify-evenly items-center'>
                    <p className='title'>RADIOLOGY INFORMATION SYSTEM</p>
                    <div>
                        <p className='welcome-txt'>Welcome!</p>
                        <p className='welcome-txt small'>Enter your personal details to start your journey with us</p>
                    </div>

                    <button className='s-btn' onClick={handleSignupRedirect}>SIGN UP</button>
                </div>
            </div>
            <div className='right-container w-[50%] flex flex-col items-center justify-evenly'>
                <p className='tag'>SIGN IN</p>
                <form className='w-[100%] flex flex-col items-center' onSubmit={handleLogin}>
                    <input
                        className='input'
                        type='email'
                        placeholder='Email'
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    <input
                        className='input'
                        type='password'
                        placeholder='Password'
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    <div className='w-[60%] flex justify-between'>
                        <div className='text-white flex items-center'>
                            <input type='checkbox' />
                            <p className='mx-1 cursor-pointer custome-txt'>Remember me</p>
                        </div>
                        <p className='cursor-pointer custome-txt'>Forgot password?</p>
                    </div>
                    <button className='btn' type='submit' disabled={loading}>
                        {loading ? 'Loading...' : 'LOGIN'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Login;
