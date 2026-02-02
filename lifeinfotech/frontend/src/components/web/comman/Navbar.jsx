import React, { useState, useEffect } from 'react';
import { Search, ShoppingBag, User, Menu } from 'lucide-react';

const Navbar = () => {
  const [isSticky, setIsSticky] = useState(false);

  // Scroll detect karne ka logic
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 100) {
        setIsSticky(true);
      } else {
        setIsSticky(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      {/* Top Notification Bar */}
      <div className="bg-[#d4cbb8] text-xs text-center py-1 font-medium tracking-wide">
        FREE DOCTOR CONSULTATION: CALL 011 424 51255 / 1800 102 8384
      </div>

      {/* Main Navbar */}
      <nav
        className={`w-full z-50 transition-all duration-300 bg-[#Fdfbf7] ${
          isSticky ? 'fixed top-0 shadow-md py-2' : 'relative py-4'
        }`}
      >
        <div className="container mx-auto px-6">
          {/* Top Row: Logos and Icons */}
          <div className="flex justify-between items-center mb-4">
            {/* Left Logo */}
          <div className="hidden md:block w-24">
  <img 
    src="/admin/Lebrostone logo (3).png" 
    alt="Lebrostone Logo" 
    className="w-full h-auto mb-1 ml-3" 
  />
 <span className="text-xs font-bold text-red-600 border border-red-600 p-1 inline-block whitespace-nowrap">
  Lebroid Healthcare
</span>
</div>

            {/* Center Logo  */}
            <div className="text-center">
              <h1 className="text-4xl font-serif text-[#a88b56] tracking-widest uppercase">
                Lebroid Healthcare
              </h1>
            </div>

            {/* Right Icons */}
            <div className="flex items-center gap-6 text-gray-700">
              <User size={20} className="cursor-pointer hover:text-[#a88b56]" />
              <Search size={20} className="cursor-pointer hover:text-[#a88b56]" />
              <ShoppingBag size={20} className="cursor-pointer hover:text-[#a88b56]" />
              {/* Certification Stamp Placeholder */}
              <div className="hidden md:block w-10 h-10 border rounded-full border-gray-400 flex items-center justify-center text-[8px] text-center leading-tight">
                EST <br/> 1917
              </div>
            </div>
          </div>

          {/* Bottom Row: Navigation Links */}
          <div className={`hidden md:flex justify-center gap-8 text-sm font-medium text-gray-600 tracking-wide ${isSticky ? 'mt-0' : 'mt-4 border-t border-gray-200 pt-4'}`}>
            {['SHOP ALL', 'SKIN', 'BATH & BODY', 'HAIR', 'MEN', 'SPA', 'ANANTAM', 'WEDDING EDITS', 'COMBOS'].map((item) => (
              <a key={item} href="#" className="hover:text-[#a88b56] transition-colors">
                {item}
              </a>
            ))}
          </div>
          
          {/* Mobile Menu Icon (Only shows on small screens) */}
          <div className="md:hidden flex justify-center mt-2">
            <Menu className="text-gray-600" />
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navbar;