import React, { useState } from 'react';
// Relative paths check: Ye files ../common/ folder mein honi chahiye
import Sidebar from '../common/Sidebar';
import Topbar from '../common/Topbar';
import Footer from '../common/Footer';

const AdminLayout = ({ children }) => {
  // Mobile screens ke liye sidebar default close rakhna better hota hai
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden font-sans">
      
      {/* Sidebar Overlay for Mobile */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 z-20 bg-black opacity-50 transition-opacity md:hidden"
          onClick={toggleSidebar}
        ></div>
      )}

      {/* Sidebar Container */}
      <div className={`
        fixed inset-y-0 left-0 z-30 transform transition duration-300 ease-in-out
        ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}
        md:relative md:translate-x-0
      `}>
        <Sidebar />
      </div>

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Topbar: toggleSidebar function pass kar rahe hain */}
        <Topbar toggleSidebar={toggleSidebar} />

        {/* Main Content: Yahan Dashboard render hoga */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 p-4 md:p-8">
          <div className="container mx-auto">
            {children}
          </div>
        </main>

        <Footer />
      </div>
    </div>
  );
};

export default AdminLayout;