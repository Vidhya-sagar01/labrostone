import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Sidebar = () => {
  const location = useLocation();

  // FIX: Path match check karne ke liye helper
  const isActive = (path) => location.pathname === path ? 'bg-blue-600 shadow-lg text-white' : 'hover:bg-slate-800 text-slate-400';

  return (
    <aside className="w-64 bg-slate-900 text-white h-screen flex flex-col shadow-2xl sticky top-0">
      {/* Branding Section */}
      <div className="p-6 border-b border-slate-800 flex flex-col items-center">
        <img 
          src="/admin/Lebrostone logo (3).png" 
          alt="Lebrostone Logo" 
          className="h-12 w-auto mb-2 object-contain" 
        />
        <span className="text-[10px] font-black text-emerald-500 uppercase tracking-[3px]">Admin Panel</span>
      </div>
      
      {/* Navigation Links */}
      <nav className="flex-1 mt-6 px-4 space-y-2 overflow-y-auto">
        <Link to="/admin/dashboard" className={`flex items-center p-3 rounded-xl transition-all ${isActive('/admin/dashboard')}`}>
          <span className="mr-3">📊</span>
          <span className="text-sm font-semibold uppercase tracking-wider text-[11px]">Dashboard</span>
        </Link>

        <Link to="/admin/sliders" className={`flex items-center p-3 rounded-xl transition-all ${isActive('/admin/sliders')}`}>
          <span className="mr-3">🖼️</span>
          <span className="text-sm font-semibold uppercase tracking-wider text-[11px]">Sliders</span>
        </Link>

        <Link to="/admin/category" className={`flex items-center p-3 rounded-xl transition-all ${isActive('/admin/category')}`}>
          <span className="mr-3">📁</span>
          <span className="text-sm font-semibold uppercase tracking-wider text-[11px]">Categories</span>
        </Link>

        <Link to="/admin/productsshow" className={`flex items-center p-3 rounded-xl transition-all ${isActive('/admin/productsshow')}`}>
          <span className="mr-3">📦</span>
          <span className="text-sm font-semibold uppercase tracking-wider text-[11px]">Master Inventory</span>
        </Link>

        {/* --- FIXED: Anantam Banner Link --- */}
        <Link to="/admin/anantambanner" className={`flex items-center p-3 rounded-xl transition-all ${isActive('/admin/anantambanner')}`}>
          <span className="mr-3">✨</span>
          <span className="text-sm font-semibold uppercase tracking-wider text-[11px]">Anantam Banner</span>
        </Link>

        <Link to="/admin/Faq" className={`flex items-center p-3 rounded-xl transition-all ${isActive('/admin/Faq')}`}>
          <span className="mr-3">❓</span>
          <span className="text-sm font-semibold uppercase tracking-wider text-[11px]">Faq</span>
        </Link>

        <Link to="/admin/season" className={`flex items-center p-3 rounded-xl transition-all ${isActive('/admin/season')}`}>
          <span className="mr-3">🍂</span>
          <span className="text-sm font-semibold uppercase tracking-wider text-[11px]">Season</span>
        </Link>

        <div className="pt-4 pb-2 text-[10px] font-bold text-slate-500 uppercase tracking-widest pl-3">
          Account Settings
        </div>

        <Link to="/admin/profile" className={`flex items-center p-3 rounded-xl transition-all ${isActive('/admin/profile')}`}>
          <span className="mr-3">👤</span>
          <span className="text-sm font-semibold uppercase tracking-wider text-[11px]">User Profile</span>
        </Link>
      </nav>

      {/* Logout Footer Section */}
      <div className="p-4 border-t border-slate-800">
        <button 
          onClick={() => {
            localStorage.removeItem('adminToken');
            window.location.href = '/admin/login';
          }}
          className="w-full flex items-center justify-center p-3 bg-red-600/10 text-red-500 hover:bg-red-600 hover:text-white rounded-xl transition-all font-bold text-sm"
        >
          <span className="mr-2">🚪</span> LOGOUT
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;