import React, { useState } from 'react';
const API_BASE ='https://lebrostonebackend4.lifeinfotechinstitute.com';
const Topbar = ({ toggleSidebar }) => {
  // Demo data (Inhe aap props ya API se replace kar sakte hain)
  const [currentLang, setCurrentLang] = useState({ name: 'English', code: 'en' });
  const [isLangOpen, setIsLangOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const notifications = {
    messages: 3,
    orders: 5
  };

  return (
    <header className="h-16 bg-white border-b px-4 flex items-center justify-between shadow-sm sticky top-0 z-40">
      
      {/* Left Section: Sidebar Toggle & Brand */}
      <div className="flex items-center gap-4">
        <button 
          onClick={toggleSidebar} 
          className="p-2 hover:bg-gray-100 rounded-lg text-gray-600 transition-colors"
        >
          <span className="text-2xl">☰</span>
        </button>
        <div className="hidden md:block">
          <h1 className="text-gray-700 font-bold text-lg tracking-tight">Admin System</h1>
        </div>
      </div>

      {/* Right Section: Icons & Profile */}
      <div className="flex items-center gap-2 md:gap-5">
        
       

        {/* 2. Messages Icon */}
        <button className="relative p-2 text-gray-500 hover:bg-gray-100 rounded-full transition-colors">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
          </svg>
          {notifications.messages > 0 && (
            <span className="absolute top-1 right-1 bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full border-2 border-white">
              {notifications.messages}
            </span>
          )}
        </button>

        {/* 3. Orders/Cart Icon */}
        <button className="relative p-2 text-gray-500 hover:bg-gray-100 rounded-full transition-colors">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          {notifications.orders > 0 && (
            <span className="absolute top-1 right-1 bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full border-2 border-white">
              {notifications.orders}
            </span>
          )}
        </button>

        {/* 4. Admin Profile Dropdown */}
        <div className="relative ml-2 border-l pl-4">
          <button 
            onClick={() => setIsProfileOpen(!isProfileOpen)}
            className="flex items-center gap-3 hover:bg-gray-50 p-1 rounded-lg transition-all"
          >
            <div className="text-right hidden md:block">
              <p className="text-sm font-bold text-gray-800 leading-none">{currentLang.name}</p>
              <p className="text-[11px] text-gray-500 mt-1 uppercase font-semibold">Master Admin</p>
            </div>
           <img 
  // Placeholder ko hata kar backend URL aur file path likhein
  src={`${API_BASE}/uploads/logo/logo.png`} 
  className="w-9 h-9 rounded-full border-2 border-blue-100 object-cover" 
  alt="profile" 
  // Agar image load na ho toh placeholder dikhane ke liye onError logic
  onError={(e) => { e.target.src = "https://via.placeholder.com/40"; }}
/>
          </button>

          {isProfileOpen && (
            <div className="absolute right-0 mt-3 w-56 bg-white border rounded-xl shadow-2xl py-2 z-50">
              <a href="#profile" className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-blue-50 transition-colors">Settings</a>
              <div className="border-t my-1"></div>
              <button className="block w-full text-left px-4 py-2.5 text-sm text-red-600 font-medium hover:bg-red-50 transition-colors">
                Logout
              </button>
            </div>
          )}
        </div>

      </div>
    </header>
  );
};

export default Topbar;