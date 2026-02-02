import React, { useState } from 'react';
import axios from 'axios';


const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            // Backend API call
            // const res = await axios.post('http://localhost:5000/api/admin/login', { email, password });
            const res = await axios.post('https://labrostone-backend.onrender.com/api/admin/login', { email, password });
           console.log("Token received:", res.data.token); 
           console.log("Success status:", res.data.success);
           console.log("Response from Backend:", res.data); 
            if (res.data.success) {
                // Backend se aane wala token save karein
                localStorage.setItem('adminToken', res.data.token);

                alert("Login Successful!✅");
                
                // Full page refresh taaki App.jsx protection hat jaye
                window.location.href = '/admin/dashboard';
            }
        } catch (err) {
            const errorMsg = err.response?.data?.message || "Connection Error! Backend .";
            alert(errorMsg);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-100">
            <div className="bg-white p-10 rounded-[2.5rem] shadow-2xl w-full max-w-md text-center border border-gray-200">
                <img src="/admin/Lebrostone logo (3).png" alt="Lebrostone" className="h-20 mx-auto mb-6" />
                
                <h2 className="text-3xl font-black text-slate-800 mb-2 uppercase tracking-tighter italic">Admin Portal</h2>
                <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mb-8">Inventory Control System</p>
                
                <form onSubmit={handleLogin} className="space-y-6">
                    <div className="text-left">
                        <label className="text-[10px] font-black text-slate-400 uppercase ml-2 tracking-widest">Email Access</label>
                        <input 
                            type="email" 
                            placeholder="admin@lebrostone.com" 
                            className="w-full p-4 mt-1 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:border-blue-500 transition-all font-bold"
                            onChange={(e) => setEmail(e.target.value)}
                            required 
                        />
                    </div>
                    
                    <div className="text-left">
                        <label className="text-[10px] font-black text-slate-400 uppercase ml-2 tracking-widest">Security Password</label>
                        <input 
                            type="password" 
                            placeholder="••••••••" 
                            className="w-full p-4 mt-1 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:border-blue-500 transition-all font-bold"
                            onChange={(e) => setPassword(e.target.value)}
                            required 
                        />
                    </div>

                    <button type="submit" className="w-full bg-slate-900 text-white p-5 rounded-2xl font-black uppercase tracking-[0.3em] hover:bg-blue-600 shadow-xl transition-all active:scale-95">
                        Access Dashboard
                    </button>
                </form>
            </div>
        </div>
    );
};

// --- IS LINE KO CHECK KAREIN, YAHI MISSING THI ---
export default Login;