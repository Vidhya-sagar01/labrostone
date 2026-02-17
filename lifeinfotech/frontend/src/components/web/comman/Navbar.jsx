import React, { useState, useEffect } from "react";
import { CiUser, CiSearch, CiShoppingBasket } from "react-icons/ci";
import { IoMdClose } from "react-icons/io";
import { HiMenuAlt3 } from "react-icons/hi";
import {
  IoChevronDown,
  IoChevronBack,
  IoChevronForward,
} from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import instance from "../api/AxiosConfig";

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true); 
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));
  const [cartCount, setCartCount] = useState(0);

  // Helper function to get initials (e.g., "John Doe" -> "JD")
  const getInitials = (name) => {
    if (!name) return "";
    const parts = name.trim().split(" ");
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return parts[0][0].toUpperCase();
  };

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 0) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navItems = [
    { name: "HOME", path: "/" },
    { name: "SHOP ALL", path: "/shop" }, 
    { name: "DAILY WELLNESS", path: "/shop/category/daily-wellness" },
    { name: "WEIGHT MANAGEMENT", path: "/shop/category/weight-management" },
    { name: "HAIR CARE", path: "/shop/category/hair-care" },
    { name: "SKIN CARE", path: "/shop/category/skin-care" },
    { name: "MEN'S HEALTH", path: "/shop/category/mens-health" },
    { name: "WOMEN'S HEALTH", path: "/shop/category/womens-health" },
    { name: "BLOG", path: "/blogs" },
  ];

  return (
    <nav className="sticky top-0 left-0 w-full z-50 bg-[#FAF6EA] shadow-md font-sans">
      {/* Top Banner */}
      <div
        className={`bg-[#00a758] text-white flex justify-center items-center relative text-[10px] md:text-xs font-thin tracking-widest transition-all duration-300 overflow-hidden ${isVisible ? "h-10 opacity-100 py-2" : "h-0 opacity-0 py-0"
          }`}
      >
        <button className="absolute left-4 md:left-20 text-white/80 hover:text-white">
          <IoChevronBack size={16} />
        </button>
        <span>
          GET 10% OFF YOUR FIRST ORDER – USE CODE{" "}
          <span className="font-bold">LEBROSTONE10!</span>
        </span>
        <button className="absolute right-4 md:right-20 text-white/80 hover:text-white">
          <IoChevronForward size={16} />
        </button>
      </div>

      {/* Main Header Area */}
      <div className="max-w-360 mx-auto px-4 sm:px-6 lg:px-8 pt-4 pb-2">
        <div className="flex items-center justify-between">
          <a
            href="/"
            className="hidden md:flex flex-col text-[10px] items-start font-bold text-gray-800 leading-tight"
          >
            <p className="text-center w-full text-sm uppercase font-medium ml-3">
              from the house of
            </p>
            <span className="h-10 w-auto ">
              <img
                className="h-full w-full object-contain "
                src="/leftlogo.png"
                alt="leftlogo"
              />
            </span>
          </a>

          <button
            className="md:hidden text-2xl text-gray-800"
            onClick={() => setMobileMenuOpen(true)}
          >
            <HiMenuAlt3 />
          </button>

          <div className="flex-1 flex justify-center items-center mb-4">
            <a href="/" className="h-8 md:h-12 w-auto">
              <img
                className="h-full w-auto object-contain"
                src="/logo.png"
                alt=""
              />
            </a>
          </div>

          <div className="flex items-center gap-4 md:gap-6">
            <div className="flex items-center gap-3 md:gap-4 text-gray-800">
              
              {/* Profile Button Logic Starts Here */}
              <button
                onClick={() => navigate("/profile")}
                className="hover:text-[#C5A987] transition-colors flex items-center gap-2"
              >
                <CiUser size={24} strokeWidth={0.5} />
                {user && user.name && (
                  <span className="text-xs font-bold tracking-tighter border-l border-gray-400 pl-2">
                    {getInitials(user.name)}
                  </span>
                )}
              </button>
              {/* Profile Button Logic Ends Here */}

              <button
                onClick={() => setSearchOpen(!searchOpen)}
                className="hover:text-[#C5A987] transition-colors"
              >
                <CiSearch size={24} strokeWidth={0.5} />
              </button>
              <button
                onClick={() => navigate("/cart")}
                className="relative hover:text-[#C5A987] transition-colors"
              >
                <CiShoppingBasket size={24} strokeWidth={0.5} />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-black text-white text-[10px] w-4 h-4 flex items-center justify-center rounded-full">
                    {cartCount}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Links */}
      <div className="hidden md:block border-b border-gray-100/50 pb-4">
        <div className="flex justify-center items-center gap-8 text-[11px] lg:text-xs font-medium tracking-widest text-gray-700">
          {navItems.map((item, index) => (
            <div
              key={index}
              className="group cursor-pointer relative"
              onClick={() => item.path && navigate(item.path)}
            >
              <span className="hover:text-[#C5A987] transition-colors duration-300">
                {item.name}
              </span>
              <span className="absolute -bottom-1 left-0 w-0 h-px bg-[#C5A987] transition-all duration-300 group-hover:w-full"></span>
            </div>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;