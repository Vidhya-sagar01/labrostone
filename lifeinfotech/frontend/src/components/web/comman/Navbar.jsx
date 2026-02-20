import React, { useState, useEffect } from "react";
import { CiUser, CiSearch, CiShoppingBasket } from "react-icons/ci";
import { IoMdClose } from "react-icons/io";
import { HiMenuAlt3 } from "react-icons/hi";
import {
  IoChevronBack,
  IoChevronForward,
} from "react-icons/io5";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user"));
  const [cartCount] = useState(0);

  const getInitials = (name) => {
    if (!name) return "";
    const parts = name.trim().split(" ");
    return parts.length >= 2
      ? (parts[0][0] + parts[1][0]).toUpperCase()
      : parts[0][0].toUpperCase();
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsVisible(window.scrollY === 0);
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
    <nav className="sticky top-0 w-full z-50 bg-[#FAF6EA] shadow-md">

      {/* Top Banner */}
      <div
        className={`bg-[#00a758] text-white flex justify-center items-center text-xs transition-all duration-300 ${isVisible ? "h-10 opacity-100" : "h-0 opacity-0"
          }`}
      >
        <button className="absolute left-4">
          <IoChevronBack />
        </button>

        <span>
          GET 10% OFF YOUR FIRST ORDER – <b>LEBROSTONE10!</b>
        </span>

        <button className="absolute right-4">
          <IoChevronForward />
        </button>
      </div>

      {/* Main Header */}
      <div className="px-14 py-2 flex items-center justify-between">
       
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

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-2xl"
          onClick={() => setMobileMenuOpen(true)}
        >
          <HiMenuAlt3 />
        </button>

        {/* Logo */}
        <div className="flex-1 text-center">
          <img
            src="/logo.png"
            alt="logo"
            className="h-8 mx-auto"
          />
        </div>

        {/* Right Icons */}
        <div className="flex gap-4 items-center">
          <button onClick={() => navigate("/profile")}>
            <CiUser size={24} />
          </button>

          <button onClick={() => setSearchOpen(!searchOpen)}>
            <CiSearch size={24} />
          </button>

          <button onClick={() => navigate("/cart")} className="relative">
            <CiShoppingBasket size={24} />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-black text-white text-xs w-4 h-4 rounded-full flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Desktop Navigation */}
      <div className="hidden md:flex justify-center gap-8 pb-3 text-sm">
        {navItems.map((item, i) => (
          <button key={i} onClick={() => navigate(item.path)}>
            {item.name}
          </button>
        ))}
      </div>

      {/* ================= MOBILE MENU ================= */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 bg-black/40">

          {/* Drawer */}
          <div className="absolute top-0 left-0 h-full w-72 bg-white shadow-xl p-5 overflow-y-auto">

            {/* Close */}
            <button
              className="text-2xl mb-6"
              onClick={() => setMobileMenuOpen(false)}
            >
              <IoMdClose />
            </button>

            {/* Nav Items */}
            <div className="flex flex-col gap-4">
              {navItems.map((item, index) => (
                <button
                  key={index}
                  className="text-left py-2 border-b"
                  onClick={() => {
                    navigate(item.path);
                    setMobileMenuOpen(false);
                  }}
                >
                  {item.name}
                </button>
              ))}
            </div>

          </div>

          {/* Click outside to close */}
          <div
            className="w-full h-full"
            onClick={() => setMobileMenuOpen(false)}
          />
        </div>
      )}
      {/* ================================================= */}

    </nav>
  );
};

export default Navbar;
