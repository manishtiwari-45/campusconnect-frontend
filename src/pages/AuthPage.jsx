import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { loginUser, signupUser, fetchCurrentUser } from '../services/api';

const AuthPage = () => {
    // All of this logic remains the same
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [fullName, setFullName] = useState('');
    const [role, setRole] = useState('student');
    const [error, setError] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            if (isLogin) {
                const response = await loginUser({ email, password });
                const token = response.data.access_token;
                localStorage.setItem('accessToken', token);
                const userResponse = await fetchCurrentUser();
                login(token, userResponse.data);
                navigate('/dashboard');
            } else {
                await signupUser({ email, password, full_name: fullName, role: role });
                const response = await loginUser({ email, password });
                const token = response.data.access_token;
                localStorage.setItem('accessToken', token);
                const userResponse = await fetchCurrentUser();
                login(token, userResponse.data);
                navigate('/dashboard');
            }
        } catch (err) {
            setError(err.response?.data?.detail || 'An error occurred. Please try again.');
        }
    };

    // The JSX is completely new to create the split-screen layout
    return (
        <div className="min-h-screen flex flex-col md:flex-row">
            {/* Left Pane: Branding/Image Section */}
            <div className="hidden md:flex md:w-1/2 bg-indigo-600 items-center justify-center p-12 text-white text-center relative overflow-hidden">
                 {/* Decorative Blobs */}
                <div className="absolute top-0 left-0 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-700 rounded-full opacity-50"></div>
                <div className="absolute bottom-0 right-0 translate-x-1/2 translate-y-1/2 w-96 h-96 bg-indigo-500 rounded-full opacity-50"></div>
                <div className="relative z-10">
                    <h1 className="text-5xl font-extrabold mb-4 tracking-tight">CampusConnect</h1>
                    <p className="text-indigo-200 text-lg">Your one-stop platform for college clubs and events. Discover, join, and engage!</p>
                </div>
            </div>

            {/* Right Pane: Form Section */}
            <div className="w-full md:w-1/2 flex items-center justify-center bg-gray-50 p-6 sm:p-12">
                <div className="w-full max-w-md">
                    <h2 className="text-3xl font-bold mb-2 text-gray-800 text-center">
                        {isLogin ? 'Welcome Back!' : 'Create Your Account'}
                    </h2>
                    <p className="text-center text-gray-500 mb-8">{isLogin ? 'Log in to continue your journey.' : 'Join the community today.'}</p>
                    
                    <form onSubmit={handleSubmit} className="space-y-4">
                        {!isLogin && (
                            <>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Full Name</label>
                                    <input type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 transition-shadow duration-200" required />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">I am a...</label>
                                    <select value={role} onChange={(e) => setRole(e.target.value)} className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm bg-white focus:ring-indigo-500 focus:border-indigo-500 transition-shadow duration-200">
                                        <option value="student">Student</option>
                                        <option value="club_admin">Club Admin</option>
                                        <option value="super_admin">Super Admin</option>
                                    </select>
                                </div>
                            </>
                        )}
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Email Address</label>
                            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 transition-shadow duration-200" required />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Password</label>
                            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 transition-shadow duration-200" required />
                        </div>
                        
                        {error && <p className="text-red-500 text-sm text-center">{error}</p>}
                        
                        <div>
                            <button type="submit" className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-300 transform hover:scale-105">
                                {isLogin ? 'Log In' : 'Create Account'}
                            </button>
                        </div>
                    </form>

                    <p className="text-center text-sm text-gray-600 mt-8">
                        {isLogin ? "Don't have an account?" : 'Already have an account?'}
                        <button onClick={() => { setIsLogin(!isLogin); setError(''); }} className="font-medium text-indigo-600 hover:text-indigo-500 ml-2">
                            {isLogin ? 'Sign Up' : 'Log In'}
                        </button>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default AuthPage;