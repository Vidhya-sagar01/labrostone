import React, { useState, useEffect } from 'react';
import instance from '../../web/api/AxiosConfig';
import { Trash2, Ticket, Plus, Loader2, Clock, AlertCircle, Calendar } from 'lucide-react';

const Coupon = () => {
    const [coupons, setCoupons] = useState([]);
    const [loading, setLoading] = useState(false);
    
    // Form state
    const [formData, setFormData] = useState({
        code: '',
        discountAmount: '',
        minOrderAmount: '',
        startDate: '', 
        expiryDate: '' 
    });

    useEffect(() => { fetchCoupons(); }, []);

    const fetchCoupons = async () => {
        try {
            const res = await instance.get("/api/coupons/all");
            setCoupons(res.data);
        } catch (err) { console.error("Fetch Error:", err); }
    };

    const handleAddCoupon = async (e) => {
        e.preventDefault();
        
        // Date Validation
        if (new Date(formData.expiryDate) <= new Date(formData.startDate)) {
            return alert("Expiry date must be after start date!");
        }

        setLoading(true);
        try {
            const res = await instance.post("/api/coupons/add", formData);
            if (res.data.success) {
                alert("Coupon Created Successfully! ✅");
                setFormData({ code: '', discountAmount: '', minOrderAmount: '', startDate: '', expiryDate: '' });
                fetchCoupons();
            }
        } catch (err) { 
            alert(err.response?.data?.message || "Error adding coupon"); 
        } finally { setLoading(false); }
    };

    const deleteCoupon = async (id) => {
        if(window.confirm("Pakka delete karna hai?")) {
            try {
                await instance.delete(`/api/coupons/delete/${id}`);
                fetchCoupons();
            } catch (err) { alert("Delete failed"); }
        }
    };

    // Helper to format date and time separately
    const formatDateTime = (dateStr) => {
        const d = new Date(dateStr);
        return {
            date: d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
            time: d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
    };

    return (
        <div className="p-6 bg-gray-50 min-h-screen text-slate-800 font-sans">
            <h2 className="text-3xl font-black uppercase tracking-tighter mb-8 flex items-center gap-3">
                <Ticket className="text-blue-600" size={32} /> 
                Coupon <span className="text-blue-600">Engine</span>
            </h2>

            {/* --- CREATE FORM --- */}
            <form onSubmit={handleAddCoupon} className="bg-white p-8 rounded-[2rem] shadow-xl border border-slate-100 mb-10">
                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6 items-end">
                    
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Code</label>
                        <input required type="text" placeholder="PROMO20" className="w-full bg-slate-50 border-none p-4 rounded-2xl font-bold uppercase ring-1 ring-slate-100 focus:ring-blue-500 outline-none transition-all" 
                        value={formData.code} onChange={(e) => setFormData({...formData, code: e.target.value.toUpperCase()})} />
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Discount (₹)</label>
                        <input required type="number" placeholder="500" className="w-full bg-slate-50 border-none p-4 rounded-2xl font-bold ring-1 ring-slate-100 focus:ring-blue-500 outline-none" 
                        value={formData.discountAmount} onChange={(e) => setFormData({...formData, discountAmount: e.target.value})} />
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1"><Calendar size={12}/> Start Date & Time</label>
                        <input required type="datetime-local" className="w-full bg-slate-50 border-none p-4 rounded-2xl font-bold text-slate-600 ring-1 ring-slate-100 focus:ring-blue-500 outline-none cursor-pointer" 
                        value={formData.startDate} onChange={(e) => setFormData({...formData, startDate: e.target.value})} />
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1"><Clock size={12}/> Expiry Date & Time</label>
                        <input required type="datetime-local" className="w-full bg-slate-50 border-none p-4 rounded-2xl font-bold text-slate-600 ring-1 ring-slate-100 focus:ring-blue-500 outline-none cursor-pointer" 
                        value={formData.expiryDate} onChange={(e) => setFormData({...formData, expiryDate: e.target.value})} />
                    </div>
                    
                    <button disabled={loading} className="bg-slate-900 text-white h-[58px] rounded-2xl font-black uppercase text-xs tracking-[0.2em] flex items-center justify-center gap-2 hover:bg-blue-600 transition-all shadow-lg active:scale-95 disabled:opacity-50">
                        {loading ? <Loader2 className="animate-spin" /> : <Plus size={18} />} Create
                    </button>
                </div>
            </form>

            {/* --- LIST TABLE --- */}
            <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-slate-50 border-b border-slate-100">
                        <tr>
                            <th className="p-6 text-[10px] font-black uppercase text-slate-400">Coupon</th>
                            <th className="p-6 text-[10px] font-black uppercase text-slate-400">Discount</th>
                            <th className="p-6 text-[10px] font-black uppercase text-slate-400 text-center">Duration (Time & Date)</th>
                            <th className="p-6 text-[10px] font-black uppercase text-slate-400 text-center">Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                        {coupons.map((c) => {
                            const now = new Date();
                            const start = new Date(c.startDate);
                            const end = new Date(c.expiryDate);
                            const isExpired = end < now;
                            const isUpcoming = start > now;

                            const startFormatted = formatDateTime(c.startDate);
                            const endFormatted = formatDateTime(c.expiryDate);

                            return (
                                <tr key={c._id} className="group hover:bg-slate-50/50 transition-all">
                                    <td className="p-6">
                                        <span className="bg-blue-50 text-blue-600 px-4 py-2 rounded-xl font-black text-sm uppercase tracking-tight ring-1 ring-blue-100">
                                            {c.code}
                                        </span>
                                    </td>
                                    <td className="p-6 font-black text-emerald-600 text-xl italic">₹{c.discountAmount}</td>
                                    
                                    <td className="p-6">
                                        <div className="flex flex-col items-center gap-2">
                                            <div className="flex items-center gap-3">
                                                {/* Start Box */}
                                                <div className="text-center bg-slate-50 p-2 rounded-xl border border-slate-100">
                                                    <p className="text-[9px] uppercase font-black text-slate-400">Start</p>
                                                    <p className="text-[11px] font-bold text-slate-700">{startFormatted.date}</p>
                                                    <p className="text-[10px] font-black text-blue-500">{startFormatted.time}</p>
                                                </div>
                                                <span className="text-slate-300 font-bold">→</span>
                                                {/* End Box */}
                                                <div className="text-center bg-slate-50 p-2 rounded-xl border border-slate-100">
                                                    <p className="text-[9px] uppercase font-black text-slate-400">Expiry</p>
                                                    <p className="text-[11px] font-bold text-slate-700">{endFormatted.date}</p>
                                                    <p className="text-[10px] font-black text-red-500">{endFormatted.time}</p>
                                                </div>
                                            </div>
                                            
                                            {/* Status Badge */}
                                            {isExpired ? (
                                                <span className="text-[9px] bg-red-50 text-red-500 px-3 py-1 rounded-full font-black tracking-widest uppercase italic border border-red-100">Expired</span>
                                            ) : isUpcoming ? (
                                                <span className="text-[9px] bg-blue-50 text-blue-500 px-3 py-1 rounded-full font-black tracking-widest uppercase italic border border-blue-100">Upcoming</span>
                                            ) : (
                                                <span className="text-[9px] bg-emerald-50 text-emerald-500 px-3 py-1 rounded-full font-black tracking-widest uppercase italic border border-emerald-100 flex items-center gap-1">
                                                   <span className="w-1 h-1 bg-emerald-500 rounded-full animate-ping"></span> Active Now
                                                </span>
                                            )}
                                        </div>
                                    </td>

                                    <td className="p-6 text-center">
                                        <button onClick={() => deleteCoupon(c._id)} className="text-slate-300 hover:text-red-500 hover:bg-red-50 p-3 rounded-2xl transition-all">
                                            <Trash2 size={20} />
                                        </button>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
                {coupons.length === 0 && (
                    <div className="p-20 text-center flex flex-col items-center gap-2">
                        <AlertCircle className="text-slate-200" size={48} />
                        <p className="text-slate-300 font-black uppercase italic tracking-widest">No active coupons found</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Coupon;