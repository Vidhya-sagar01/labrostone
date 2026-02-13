import React, { useState } from 'react';
import axios from 'axios';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    // ✅ STEP 1: API URL yahan set karein (Comment/Uncomment as needed)
    // const API_BASE = "http://localhost:5000"; 
    const API_BASE = "https://lebrostonebackend.lifeinfotechinstitute.com";

    // ✅ STEP 2: Logo ka sahi Path (Backend ke uploads folder se)
    // Agar filename 'logo.png' hai to end me change kar lein
    const LOGO_URL = `${API_BASE}/uploads/logo/centerlogo.png`; 

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            // ✅ STEP 3: Axios ab API_BASE use karega
            const res = await axios.post(`${API_BASE}/api/admin/login`, { email, password });
            
            if (res.data.success) {
                localStorage.setItem('adminToken', res.data.token);
                alert("Login Successful! ✅");
                window.location.href = '/admin/dashboard';
            }
        } catch (err) {
            console.error(err);
            const errorMsg = err.response?.data?.message || "Connection Error! Backend is down.";
            alert(errorMsg);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-100">
            <div className="bg-white p-10 rounded-[2.5rem] shadow-2xl w-full max-w-md text-center border border-gray-200">
                
                {/* ✅ STEP 4: Image Source Fixed */}
                <img 
                    src={LOGO_URL} 
                    alt="Lebrostone" 
                    className="h-20 mx-auto mb-6 object-contain" 
                    onError={(e) => {
                        e.target.style.display = 'none'; // Agar image na mile to hide kar de
                        console.log("Logo failed to load from:", LOGO_URL);
                    }}
                />
                
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

export default Login;