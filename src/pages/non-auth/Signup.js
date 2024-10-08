import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';

const Signup = () => {
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [address, setAddress] = useState('');
    const [password, setPassword] = useState('');
    const [verifyPassword, setVerifyPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        // Basic validation
        if (password !== verifyPassword) {
            toast.error("Passwords do not match!");
            setLoading(false);
            return;
        }

        if (password.length < 8) {
            toast.error("Password must be at least 8 characters long!");
            setLoading(false);
            return;
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            toast.error("Please enter a valid email address!");
            setLoading(false);
            return;
        }

        // Phone number validation (basic format: 10 digits)
        const phoneRegex = /^\d{10}$/;
        if (!phoneRegex.test(phoneNumber)) {
            toast.error("Phone number must be 10 digits long!");
            setLoading(false);
            return;
        }

        const userData = {
            full_name: fullName,
            email,
            phone_number: phoneNumber,
            address,
            password,
        };

        try {
            const response = await fetch('http://127.0.0.1:8000/api/register/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(userData),
            });

            const data = await response.json();
            console.log('Server response:', data); // Log the server response for debugging

            if (response.ok) {
                toast.success('Signup successful!');
                navigate('/login'); // Redirect after successful signup
            } else {
                console.error('Signup error:', data); // Log error details
                toast.error(data.detail || 'Signup failed. Please try again.');
            }
        } catch (error) {
            console.error('Fetch error:', error); // Log fetch errors
            toast.error('An error occurred. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleLoginRedirect = () => {
        navigate('/login'); // Navigate to the login page when "SIGN IN" is clicked
    };

    return (
        <div className='w-full flex'>
            <div className='left-container'>
                <div className='inner-container flex flex-col justify-evenly items-center'>
                    <p className='title'>RADIOLOGY INFORMATION SYSTEM</p>
                    <div>
                        <p className='welcome-txt'>Welcome back!</p>
                        <p className='welcome-txt small'>Already have an account? Enter your credentials to login</p>
                    </div>
                    <button className='s-btn' onClick={handleLoginRedirect}>SIGN IN</button>
                </div>
            </div>
            <div className='right-container w-[50%] flex flex-col items-center justify-evenly'>
                <p className='tag'>SIGN UP</p>
                <form className='w-[100%] flex flex-col items-center' onSubmit={handleSubmit}>
                    <input
                        className='input'
                        type='text'
                        placeholder='Full name'
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        required
                    />
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
                        type='number'
                        placeholder='Phone'
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        required
                    />
                    <input
                        className='input'
                        type='text'
                        placeholder='Address'
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
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
                    <input
                        className='input'
                        type='password'
                        placeholder='Verify password'
                        value={verifyPassword}
                        onChange={(e) => setVerifyPassword(e.target.value)}
                        required
                    />
                    <button className='btn' type='submit' disabled={loading}>
                        {loading ? "Loading..." : "SIGN UP"}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Signup;
