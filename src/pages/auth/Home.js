import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';
import { useNavigate, BrowserRouter as Router, Link } from 'react-router-dom';

const Home = () => {
    const [selectedTab, setSelectedTab] = useState(0);
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        phone: '',
        address: '',
        profileImage: 'https://via.placeholder.com/150', // Placeholder for profile image
    });
    
    const [editMode, setEditMode] = useState(false); // Toggle edit mode
    const [loading, setLoading] = useState(true); // Loading state
    const [error, setError] = useState(null); // Error state
    const navigate = useNavigate();

    // Fetch profile data from API
    useEffect(() => {
        const fetchProfileData = async () => {
            try {
                const token = localStorage.getItem('access_token'); // Assuming JWT token is stored in localStorage
                const response = await axios.get('http://127.0.0.1:8000/api/profile/', {
                    headers: {
                        Authorization: `Bearer ${token}`, // Set Authorization header
                    },
                });
                const user = response.data;

                // Set the user data in state
                setFormData({
                    fullName: user.full_name,
                    email: user.email,
                    phone: user.phone_number,
                    address: user.address,
                    profileImage: user.profile_image || 'https://via.placeholder.com/150', // Set image or placeholder
                });
            } catch (err) {
                console.error("Error fetching profile data:", err);
                setError('Failed to load user data');
            } finally {
                setLoading(false);
            }
        };

        fetchProfileData();
    }, []);

    // Handle input change for form fields
    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    // Handle profile picture change
    const handleProfileImageChange = (e) => {
        const file = e.target.files[0];
        console.log(file); // Check if the file is being selected
        if (file) {
            const imageUrl = URL.createObjectURL(file); // Create preview URL for the image
            setFormData({
                ...formData,
                profileImage: imageUrl, // Update profile image URL
            });
            console.log(imageUrl); // Log the created image URL
        }
    };

    // Handle form submission (PUT request to API)
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('access_token'); // Get JWT token
    
            // Create FormData object to handle file uploads
            const updatedProfile = new FormData();
            updatedProfile.append('full_name', formData.fullName);
            updatedProfile.append('email', formData.email);
            updatedProfile.append('phone_number', formData.phone);
            updatedProfile.append('address', formData.address);
    
            // Check if an image file is selected
            const profileImageInput = document.querySelector('input[type="file"]');
            if (profileImageInput && profileImageInput.files[0]) {
                updatedProfile.append('profile_picture', profileImageInput.files[0]);
            }
    
            const response = await axios.put('http://127.0.0.1:8000/api/profile/', updatedProfile, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data', // Important for file uploads
                },
            });
    
            console.log('Profile updated:', response.data);
            toast.success("Profile updated successfully!");
            setEditMode(false); // Exit edit mode after successful update
        } catch (err) {
            console.error("Error updating profile:", err);
            setError('Failed to update profile');
            toast.error("Failed to update profile. Please try again.");
        }
    };

    const handleLogout = () => {
        // Clear the token from local storage
        localStorage.removeItem('access_token');
        
        // Optionally clear any user-specific state here if needed

        // Redirect to the login page
        navigate('/login');
    };
    

    // Handle cancel changes
    const handleCancel = () => {
        setEditMode(false); // Exit edit mode without saving changes
    };

    if (loading) {
        return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
    }

    if (error) {
        return <div className="min-h-screen flex items-center justify-center text-red-500">{error}</div>;
    }

    return (
        <div className='w-full h-screen flex'>
            <div className='left-nav w-[13%] h-full flex flex-col justify-between'>
                <div className='logo-container'>
                    <p>RIS</p>
                </div>
                <div className='menu-box'>
                    {/* <div className='menu active'>Home</div> */}
                    <div className='menu active'>Profile</div>
                </div>
                <div></div>
                <button className='text-sm text-white cursor-pointer' onClick={handleLogout}>LOG OUT</button>
                <div></div>
            </div>

            <div className='main w-[87%] h-full'>
                {/* <div className='panel 1 '>Home</div> */}
                <div className='panel 2 active flex items-center justify-center py-10'>
                    <div className="bg-white shadow-lg rounded-lg p-8 max-w-md w-full">
                        <form onSubmit={handleSubmit}>
                            {/* Profile Image */}
                            <div className="flex flex-col items-center">
                                <img
                                    src={formData.profileImage}
                                    alt="Profile"
                                    className="w-32 h-32 rounded-full object-cover mb-4"
                                />
                                {editMode && (
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleProfileImageChange}
                                        className="text-sm text-gray-500 mb-4"
                                    />
                                )}
                            </div>

                            {/* Profile Details */}
                            <div className="space-y-4">
                                <div>
                                    <label className="text-gray-700 font-medium">Full Name</label>
                                    {editMode ? (
                                        <input
                                            type="text"
                                            name="fullName"
                                            value={formData.fullName}
                                            onChange={handleChange}
                                            className="w-full p-2 mt-1 border border-gray-300 rounded-md"
                                        />
                                    ) : (
                                        <p className="text-gray-900">{formData.fullName}</p>
                                    )}
                                </div>
                                <div>
                                    <label className="text-gray-700 font-medium">Email</label>
                                    {editMode ? (
                                        <input
                                            type="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            className="w-full p-2 mt-1 border border-gray-300 rounded-md"
                                        />
                                    ) : (
                                        <p className="text-gray-900">{formData.email}</p>
                                    )}
                                </div>
                                <div>
                                    <label className="text-gray-700 font-medium">Phone</label>
                                    {editMode ? (
                                        <input
                                            type="text"
                                            name="phone"
                                            value={formData.phone}
                                            onChange={handleChange}
                                            className="w-full p-2 mt-1 border border-gray-300 rounded-md"
                                        />
                                    ) : (
                                        <p className="text-gray-900">{formData.phone}</p>
                                    )}
                                </div>
                                <div>
                                    <label className="text-gray-700 font-medium">Address</label>
                                    {editMode ? (
                                        <input
                                            type="text"
                                            name="address"
                                            value={formData.address}
                                            onChange={handleChange}
                                            className="w-full p-2 mt-1 border border-gray-300 rounded-md"
                                        />
                                    ) : (
                                        <p className="text-gray-900">{formData.address}</p>
                                    )}
                                </div>
                            </div>

                            {/* Buttons */}
                            <div className="mt-8">
                                {editMode ? (
                                    <div className="flex justify-between">
                                        <button
                                            type="button"
                                            className="py-2 px-4 bg-gray-400 text-white rounded-lg"
                                            onClick={handleCancel}
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            type="submit"
                                            className="py-2 px-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                                        >
                                            Save Changes
                                        </button>
                                    </div>
                                ) : (
                                    <button
                                        type="button"
                                        className="w-full py-2 px-4 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 transition-colors"
                                        onClick={() => setEditMode(true)}
                                    >
                                        Edit Profile
                                    </button>
                                )}
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Home;
