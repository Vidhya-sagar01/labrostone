import React from "react";
import { HiOutlineMail } from "react-icons/hi";
import {
  FaFacebookF,
  FaInstagram,
  FaPinterestP,
  FaLinkedinIn,
} from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";

const Footer = () => {
  return (
    <footer className="bg-[#FAF6EA] pt-10 md:pt-16 pb-6 md:pb-8 font-sans border-t">
      {/* Newsletter Section */}
      <div className="max-w-7xl mx-auto px-4 text-center mb-8 md:mb-16">
        <h2 className="text-xl md:text-3xl font-bold text-gray-800 mb-2">
          Join the Lebrostone Newsletter
        </h2>
        <p className="text-sm text-gray-600 mb-6 md:mb-8">
          Get skincare tips, offers & new launch updates!
        </p>

        <div className="max-w-xl mx-auto flex items-center bg-white rounded-full shadow-sm p-1 pr-1 pl-4 md:pl-6 border border-gray-100">
          <HiOutlineMail className="text-gray-400 text-lg md:text-xl mr-2 md:mr-3" />
          <input
            type="email"
            placeholder="youremail123@gmail.com"
            className="flex-1 bg-transparent border-none outline-none text-gray-700 text-xs md:text-sm py-2 md:py-3"
          />
          <button className="bg-[#C5A987] text-white px-5 md:px-8 py-2 md:py-3 rounded-full font-bold text-xs md:text-sm uppercase tracking-wider hover:bg-[#b09675] transition-colors">
            Subscribe
          </button>
        </div>
      </div>

      {/* Links Section */}
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-y-8 gap-x-4 md:gap-10 mb-8 md:mb-16">
        {/* Shop */}
        <div>
          <h3 className="font-bold text-gray-800 mb-6 uppercase text-sm tracking-widest">
            Shop
          </h3>
          <ul className="space-y-3 text-[13px] text-gray-600">
            <li>
              <a href="#" className="hover:text-[#C5A987]">
                Skin
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-[#C5A987]">
                Bath & Body
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-[#C5A987]">
                Hair
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-[#C5A987]">
                Men
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-[#C5A987]">
                Spa
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-[#C5A987]">
                Anantam
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-[#C5A987]">
                Kits & Gifting
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-[#C5A987]">
                Combos
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-[#C5A987]">
                Exclusive Deals
              </a>
            </li>
          </ul>
        </div>

        {/* About */}
        <div>
          <h3 className="font-bold text-gray-800 mb-6 uppercase text-sm tracking-widest">
            About
          </h3>
          <ul className="space-y-3 text-[13px] text-gray-600">
            <li>
              <a href="#" className="hover:text-[#C5A987]">
                Our Story
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-[#C5A987]">
                About Lebrostone
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-[#C5A987]">
                Media & Press
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-[#C5A987]">
                Blogs
              </a>
            </li>
          </ul>
        </div>

        {/* Customer Care */}
        <div>
          <h3 className="font-bold text-gray-800 mb-6 uppercase text-sm tracking-widest">
            Customer Care
          </h3>
          <ul className="space-y-3 text-[13px] text-gray-600">
            <li>
              <a href="#" className="hover:text-[#C5A987]">
                Contact Us
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-[#C5A987]">
                Shipping Policy
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-[#C5A987]">
                Cancellation Policy
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-[#C5A987]">
                Return & Refund Policy
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-[#C5A987]">
                Privacy Policy
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-[#C5A987]">
                Terms & Conditions
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-[#C5A987]">
                Disclaimer
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-[#C5A987]">
                FAQs
              </a>
            </li>
          </ul>
        </div>

        {/* Available At */}
        <div>
          <h3 className="font-bold text-gray-800 mb-6 uppercase text-sm tracking-widest">
            Available At
          </h3>
          <ul className="space-y-3 text-[13px] text-gray-600">
            <li>
              <a href="#" className="hover:text-[#C5A987]">
                Amazon
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-[#C5A987]">
                Nykaa
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-[#C5A987]">
                Flipkart
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-[#C5A987]">
                Tira
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-[#C5A987]">
                Myntra
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-[#C5A987]">
                Purplle
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-[#C5A987]">
                Firstcry
              </a>
            </li>
          </ul>
        </div>

        {/* Address */}
        <div>
          <h3 className="font-bold text-gray-800 mb-6 uppercase text-sm tracking-widest">
            Address
          </h3>
          <div className="text-[13px] text-gray-600 space-y-4 leading-relaxed">
            <p>
              31, Link Road, Opp. Defence Colony,
              <br />
              Block A, Lajpat Nagar III,
              <br />
              New Delhi – 110024, India
            </p>
            <p>
              Email:{" "}
              <a
                href="mailto:info@lebrostone.in"
                className="hover:text-[#C5A987]"
              >
                info@lebrostone.in
              </a>
            </p>
            <p>Toll-Free : 1800-1028384</p>
            <div className="flex gap-4 pt-4">
              <a
                href="#"
                className="text-gray-800 hover:text-[#C5A987] transition-colors"
              >
                <FaFacebookF />
              </a>
              <a
                href="#"
                className="text-gray-800 hover:text-[#C5A987] transition-colors"
              >
                <FaXTwitter />
              </a>
              <a
                href="#"
                className="text-gray-800 hover:text-[#C5A987] transition-colors"
              >
                <FaInstagram />
              </a>
              <a
                href="#"
                className="text-gray-800 hover:text-[#C5A987] transition-colors"
              >
                <FaPinterestP />
              </a>
              <a
                href="#"
                className="text-gray-800 hover:text-[#C5A987] transition-colors"
              >
                <FaLinkedinIn />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Bottom */}
      <div className="max-w-7xl mx-auto px-4 border-t border-gray-200/50 pt-6 md:pt-8 flex flex-col items-center">
        <div className="flex flex-wrap justify-center gap-3 md:gap-4 mb-4">
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg"
            alt="PayPal"
            className="h-4 md:h-6"
          />
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg"
            alt="Visa"
            className="h-4 md:h-6"
          />
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg"
            alt="Mastercard"
            className="h-4 md:h-6"
          />
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/thumb/f/f2/Google_Pay_Logo.svg/3840px-Google_Pay_Logo.svg.png"
            alt="GPay"
            className="h-4 md:h-6"
          />
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/thumb/e/e1/UPI-Logo-vector.svg/1280px-UPI-Logo-vector.svg.png"
            alt="UPI"
            className="h-4 md:h-6"
          />
        </div>
        <p className="text-[10px] text-gray-400 uppercase tracking-widest">
          © 2026 Lebrostone. All Rights Reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
