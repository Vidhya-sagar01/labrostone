import React, { useState } from 'react';
import { GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from "jwt-decode";
import { useNavigate, Link } from 'react-router-dom';
import { Eye, EyeOff, Lock, Phone, User, Mail, ChevronRight } from 'lucide-react';

// --- AAPKE PROJECT PATHS KE HISAAB SE IMPORTS ---
import Navbar from '../web/comman/Navbar'; 
import Footer from '../web/comman/Footer';

const SignUplogin = () => {
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    
    const [formData, setFormData] = useState({
        firstName: '', 
        lastName: '', 
        email: '', 
        phone: '', 
        password: '', 
        confirmPassword: ''
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSignUp = async (e) => {
        e.preventDefault();
        if (formData.password !== formData.confirmPassword) {
            alert("Passwords do not match!");
            return;
        }

        try {
            const res = await fetch('https://lebrostonebackend.lifeinfotechinstitute.com/api/manual-signup', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: `${formData.firstName} ${formData.lastName}`,
                    email: formData.email,
                    phoneNumber: formData.phone,
                    password: formData.password
                })
            });
            const data = await res.json();
            if (data.success) {
                alert("Registration Successful! Please Login.");
                navigate('/login');
            } else {
                alert(data.message || "Signup failed");
            }
        } catch (error) {
            console.error("Signup Error:", error);
        }
    };

    const handleGoogleSuccess = async (response) => {
        try {
            const details = jwtDecode(response.credential);
            const res = await fetch('https://lebrostonebackend.lifeinfotechinstitute.com/api/google-auth', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email: details.email,
                    name: details.name,
                    sub: details.sub,
                    picture: details.picture
                })
            });
            const data = await res.json();
            if (data.success) {
                localStorage.setItem('user', JSON.stringify(data.user));
                navigate('/');
                window.location.reload(); 
            }
        } catch (error) { console.error("Login Error:", error); }
    };

    return (
        <div className="flex flex-col min-h-screen font-sans">
            <Navbar />

            <main className="flex-grow flex items-center justify-center bg-[#e0f7f3] py-16 px-4 relative overflow-hidden">
                {/* Decorative Blur Orbs as seen in video background */}
                <div className="absolute top-20 left-10 w-64 h-64 bg-[#b2ede2] rounded-full blur-3xl opacity-60"></div>
                <div className="absolute bottom-20 right-10 w-80 h-80 bg-[#cff3ed] rounded-full blur-3xl opacity-60"></div>

                {/* Main Card */}
                <div className="bg-white p-8 md:p-10 rounded-[40px] shadow-sm w-full max-w-[550px] z-10 border border-white/50">
                    
                    {/* Header Icon */}
                    <div className="flex justify-center mb-4">
                        <div className="bg-[#00a688] p-4 rounded-2xl shadow-lg shadow-[#00a688]/20">
                            <User className="text-white" size={28} />
                        </div>
                    </div>

                    <h2 className="text-[28px] md:text-[32px] font-bold text-[#004d40] text-center mb-1">Create Account</h2>
                    <p className="text-gray-500 text-sm text-center mb-8">Join the Lebrostone community today</p>
                    
                    <form className="space-y-5" onSubmit={handleSignUp}>
                        
                        {/* Name Fields */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="relative">
                                <label className="block text-sm font-semibold text-gray-700 mb-2 ml-1">First Name</label>
                                <div className="relative">
                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"><User size={18} /></span>
                                    <input type="text" name="firstName" placeholder="First Name" onChange={handleChange} required className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-[#00a688]/20 focus:border-[#00a688] outline-none transition-all placeholder:text-gray-300" />
                                </div>
                            </div>
                            <div className="relative">
                                <label className="block text-sm font-semibold text-gray-700 mb-2 ml-1">Last Name</label>
                                <div className="relative">
                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"><User size={18} /></span>
                                    <input type="text" name="lastName" placeholder="Last Name" onChange={handleChange} required className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-[#00a688]/20 focus:border-[#00a688] outline-none transition-all placeholder:text-gray-300" />
                                </div>
                            </div>
                        </div>

                        {/* Email & Phone */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="relative">
                                <label className="block text-sm font-semibold text-gray-700 mb-2 ml-1">Email</label>
                                <div className="relative">
                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"><Mail size={18} /></span>
                                    <input type="email" name="email" placeholder="Email Address" onChange={handleChange} required className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-[#00a688]/20 focus:border-[#00a688] outline-none transition-all placeholder:text-gray-300" />
                                </div>
                            </div>
                            <div className="relative">
                                <label className="block text-sm font-semibold text-gray-700 mb-2 ml-1">Mobile Number</label>
                                <div className="relative">
                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"><Phone size={18} /></span>
                                    <input type="text" name="phone" placeholder="Mobile Number" onChange={handleChange} required className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-[#00a688]/20 focus:border-[#00a688] outline-none transition-all placeholder:text-gray-300" />
                                </div>
                            </div>
                        </div>

                        {/* Passwords */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="relative">
                                <label className="block text-sm font-semibold text-gray-700 mb-2 ml-1">Password</label>
                                <div className="relative">
                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"><Lock size={18} /></span>
                                    <input type={showPassword ? "text" : "password"} name="password" placeholder="Create Password" onChange={handleChange} required className="w-full pl-12 pr-12 py-3 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-[#00a688]/20 focus:border-[#00a688] outline-none transition-all placeholder:text-gray-300" />
                                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">{showPassword ? <EyeOff size={18} /> : <Eye size={18} />}</button>
                                </div>
                            </div>
                            <div className="relative">
                                <label className="block text-sm font-semibold text-gray-700 mb-2 ml-1">Confirm Password</label>
                                <div className="relative">
                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"><Lock size={18} /></span>
                                    <input type={showConfirmPassword ? "text" : "password"} name="confirmPassword" placeholder="Confirm Password" onChange={handleChange} required className="w-full pl-12 pr-12 py-3 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-[#00a688]/20 focus:border-[#00a688] outline-none transition-all placeholder:text-gray-300" />
                                    <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">{showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}</button>
                                </div>
                            </div>
                        </div>

                        {/* Terms */}
                        <div className="flex items-center gap-2 px-1 text-sm text-gray-600">
                            <input type="checkbox" id="terms" required className="w-4 h-4 accent-[#00a688] rounded" />
                            <label htmlFor="terms">I agree to the <span className="text-[#00a688] font-bold cursor-pointer">Terms & Conditions</span></label>
                        </div>

                        <button type="submit" className="w-full bg-[#00a688] hover:bg-[#008d74] text-white font-bold py-4 rounded-2xl transition-all shadow-lg shadow-[#00a688]/30 mt-2 flex items-center justify-center gap-2">
                            Create Account <ChevronRight size={18} />
                        </button>
                    </form>

                    {/* Divider */}
                    <div className="relative my-8">
                        <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-gray-100"></span></div>
                        <div className="relative flex justify-center text-xs uppercase text-gray-400"><span className="bg-white px-4">Or register with</span></div>
                    </div>

                    {/* Google Login Styled Button */}
                    <div className="flex justify-center">
                        <div className="relative group">
                            <div className="absolute inset-0 z-0 bg-[#1a73e8] rounded-full flex items-center px-2 pointer-events-none min-w-[240px]">
                                <div className="bg-white rounded-full p-1.5 flex items-center justify-center">
                                    <svg width="18" height="18" viewBox="0 0 18 18"><path fill="#4285F4" d="M17.64 9.2c0-.63-.06-1.25-.16-1.84H9v3.47h4.84a4.14 4.14 0 0 1-1.8 2.71v2.26h2.91a8.78 8.78 0 0 0 2.69-6.6z"/><path fill="#34A853" d="M9 18c2.43 0 4.47-.8 5.96-2.18l-2.91-2.26c-.8.54-1.83.86-3.05.86-2.34 0-4.33-1.58-5.04-3.7H.95v2.33A9 9 0 0 0 9 18z"/><path fill="#FBBC05" d="M3.96 10.71a5.41 5.41 0 0 1 0-3.42V4.96H.95a9 9 0 0 0 0 8.08l3.01-2.33z"/><path fill="#EA4335" d="M9 3.58c1.32 0 2.5.45 3.44 1.35L15 2.4A9 9 0 0 0 9 0 9 9 0 0 0 .95 4.96L3.96 7.29c.71-2.12 2.7-3.71 5.04-3.71z"/></svg>
                                </div>
                                <span className="text-white font-medium ml-4 text-[15px]">Register with Google</span>
                            </div>
                            <div className="opacity-0 relative z-10">
                                <GoogleLogin onSuccess={handleGoogleSuccess} shape="pill" size="large" width="240" />
                            </div>
                        </div>
                    </div>

                    <p className="mt-8 text-sm text-center text-gray-500">
                        Already have an account? {' '}
                        <Link to="/login" className="text-[#00a688] font-bold hover:underline">Login</Link>
                    </p>
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default SignUplogin;