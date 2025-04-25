

import React, { useState } from 'react'
import { BACKEND_URL } from '../config';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/UserProvider';
import { Mail, Lock, LogIn, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

function Signin() {
    const { login } = useAuth();

    interface FormType {
        email: string,
        password: string
    }

    interface ErrorsType {
        email?: string,
        password?: string,
        general?: string
    }

    const navigate = useNavigate();
    const [formData, setFormData] = useState<FormType>({ email: "", password: "" });
    const [errors, setErrors] = useState<ErrorsType>({});
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const validateForm = (): boolean => {
        const newErrors: ErrorsType = {};
        let isValid = true;

        // Email validation
        if (!formData.email.trim()) {
            newErrors.email = "Email is required";
            isValid = false;
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = "Please enter a valid email address";
            isValid = false;
        }

        // Password validation
        if (!formData.password) {
            newErrors.password = "Password is required";
            isValid = false;
        } else if (formData.password.length < 6) {
            newErrors.password = "Password must be at least 6 characters";
            isValid = false;
        }

        setErrors(newErrors);
        return isValid;
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));

        // Clear error when user starts typing in a field
        if (errors[name as keyof ErrorsType]) {
            setErrors(prev => ({
                ...prev,
                [name]: undefined
            }));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Clear previous general error
        setErrors(prev => ({ ...prev, general: undefined }));

        // Validate form before submission
        if (!validateForm()) {
            return;
        }

        setIsLoading(true);

        try {
            const { data } = await axios.post(`${BACKEND_URL}/api/auth/login`, formData, { withCredentials: true });
            console.log(JSON.stringify(data) + " i am data from sigin")
            if (data.success) {
                login(data.user.name);
                navigate('/');
            }
        } catch (error: any) {
            console.error("Login error:", error);
            // Handle different types of errors
            if (error.response) {
                // Server responded with an error
                const errorMessage = error.response.data.message ||
                    "Invalid email or password. Please try again.";
                setErrors(prev => ({ ...prev, general: errorMessage }));
            } else if (error.request) {
                // No response received
                setErrors(prev => ({
                    ...prev,
                    general: "Unable to connect to the server. Please check your internet connection."
                }));
            } else {
                // Something else went wrong
                setErrors(prev => ({ ...prev, general: "An unexpected error occurred. Please try again." }));
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-900 text-gray-100">
            <div className="w-full max-w-md p-8 space-y-8 bg-gray-800 rounded-lg shadow-xl">
                <div className="text-center">
                    <h2 className="text-3xl font-bold tracking-tight">Sign In</h2>
                    <p className="mt-2 text-sm text-gray-400">Enter your credentials to access your account</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {errors.general && (
                        <div className="flex items-center p-4 mb-4 text-red-400 bg-red-900 bg-opacity-20 rounded-md">
                            <AlertCircle size={18} className="mr-2 flex-shrink-0" />
                            <span>{errors.general}</span>
                        </div>
                    )}

                    <div className="space-y-1">
                        <label htmlFor="email" className="text-sm font-medium">Email</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                <Mail size={18} className="text-gray-400" />
                            </div>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                required
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="Enter your email"
                                className={`w-full pl-10 pr-3 py-2 bg-gray-700 border rounded-md text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${errors.email ? 'border-red-500' : 'border-gray-600'
                                    }`}
                            />
                        </div>
                        {errors.email && (
                            <p className="mt-1 text-sm text-red-400">{errors.email}</p>
                        )}
                    </div>

                    <div className="space-y-1">
                        <label htmlFor="password" className="text-sm font-medium">Password</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                <Lock size={18} className="text-gray-400" />
                            </div>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                required
                                value={formData.password}
                                onChange={handleChange}
                                placeholder="Enter your password"
                                className={`w-full pl-10 pr-3 py-2 bg-gray-700 border rounded-md text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${errors.password ? 'border-red-500' : 'border-gray-600'
                                    }`}
                            />
                        </div>
                        {errors.password && (
                            <p className="mt-1 text-sm text-red-400">{errors.password}</p>
                        )}
                    </div>

                    <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center">
                            <input
                                id="remember-me"
                                name="remember-me"
                                type="checkbox"
                                className="w-4 h-4 rounded text-blue-500 focus:ring-blue-500 bg-gray-700 border-gray-600"
                            />
                            <label htmlFor="remember-me" className="ml-2 block">Remember me</label>
                        </div>
                        <div>
                            <a href="#" className="text-blue-400 hover:text-blue-300">Forgot password?</a>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className={`w-full flex justify-center items-center py-2 px-4 text-white font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 focus:ring-offset-gray-800 ${isLoading
                            ? 'bg-blue-800 cursor-not-allowed'
                            : 'bg-blue-600 hover:bg-blue-500'
                            }`}
                    >
                        {isLoading ? (
                            <>
                                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Processing...
                            </>
                        ) : (
                            <>
                                <LogIn size={18} className="mr-2" />
                                Sign In
                            </>
                        )}
                    </button>

                    <div className="text-center text-sm">
                        <span className="text-gray-400">Don't have an account?</span>{' '}
                        <Link to="/signup" className="text-blue-400 hover:text-blue-300">Sign up</Link>
                    </div>
                </form>
                <div> email: test1@gmail.com  <br /> password : 12345678</div>
                <div>or you can create new account by signup and then signin</div>
            </div>
        </div>
    );
}

export default Signin;