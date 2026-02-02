import React from 'react';
import { Facebook, Instagram, Twitter, Youtube, Mail, Phone, MapPin } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-[#F9F6F0] text-black pt-16 pb-8 border-t border-gray-200">
      <div className="container mx-auto px-4 md:px-12">
        
        {/* --- NEWSLETTER SECTION --- */}
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-2xl md:text-3xl font-bold uppercase tracking-wider">Join the Lebroid Healthcare Newsletter</h2>
          <p className="text-gray-600">Get skincare tips, offers & new launch updates!</p>
          <div className="flex flex-col md:flex-row justify-center items-center gap-4 mt-6 max-w-2xl mx-auto">
            <div className="relative w-full">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input 
                type="email" 
                placeholder="youremail123@gmail.com" 
                className="w-full pl-12 pr-4 py-3 rounded-full border border-gray-300 focus:outline-none focus:border-[#A88B56]"
              />
            </div>
            <button className="bg-[#B79B7D] text-white px-10 py-3 rounded-full font-bold uppercase tracking-widest hover:bg-[#8B5A3C] transition-colors w-full md:w-auto">
              Subscribe
            </button>
          </div>
        </div>

        {/* --- MAIN FOOTER LINKS --- */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12 border-t border-gray-200 pt-12">
          {/* About */}
          <div className="space-y-4">
            <h4 className="font-bold uppercase tracking-wider">About</h4>
            <ul className="text-sm text-gray-600 space-y-2">
              <li className="hover:text-black cursor-pointer">Our Story</li>
              <li className="hover:text-black cursor-pointer">About Lebroid Healthcare</li>
              <li className="hover:text-black cursor-pointer">Media & Press</li>
              <li className="hover:text-black cursor-pointer">Blogs</li>
            </ul>
          </div>

          {/* Customer Care */}
          <div className="space-y-4">
            <h4 className="font-bold uppercase tracking-wider">Customer Care</h4>
            <ul className="text-sm text-gray-600 space-y-2">
              <li className="hover:text-black cursor-pointer">Contact Us</li>
              <li className="hover:text-black cursor-pointer">Shipping Policy</li>
              <li className="hover:text-black cursor-pointer">Cancellation Policy</li>
              <li className="hover:text-black cursor-pointer">Return & Refund Policy</li>
              <li className="hover:text-black cursor-pointer">Privacy Policy</li>
              <li className="hover:text-black cursor-pointer">Terms & Conditions</li>
            </ul>
          </div>

          {/* Available At */}
          <div className="space-y-4">
            <h4 className="font-bold uppercase tracking-wider">Available At</h4>
            <ul className="text-sm text-gray-600 space-y-2">
              <li className="hover:text-black cursor-pointer">Amazon</li>
              <li className="hover:text-black cursor-pointer">Nykaa</li>
              <li className="hover:text-black cursor-pointer">Flipkart</li>
              <li className="hover:text-black cursor-pointer">Myntra</li>
              <li className="hover:text-black cursor-pointer">Purplle</li>
            </ul>
          </div>

          {/* Address & Social */}
          <div className="space-y-4">
            <h4 className="font-bold uppercase tracking-wider">Address</h4>
            <div className="text-sm text-gray-600 space-y-4">
              <p>31, Link Road, Opp. Defence Colony, New Delhi - 110024, India</p>
              <p>Email: info@Lebroid Healthcare.com</p>
              <p>Toll-Free: 1800-1028384</p>
              <div className="flex gap-4 pt-2">
                <Facebook size={18} className="cursor-pointer hover:text-[#B79B7D]" />
                <Instagram size={18} className="cursor-pointer hover:text-[#B79B7D]" />
                <Twitter size={18} className="cursor-pointer hover:text-[#B79B7D]" />
                <Youtube size={18} className="cursor-pointer hover:text-[#B79B7D]" />
              </div>
            </div>
          </div>
        </div>

        {/* --- PAYMENT ICONS & COPYRIGHT --- */}
        <div className="border-t border-gray-200 pt-8 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex gap-4 items-center grayscale opacity-70">
            <img src="/payment/visa.png" alt="Visa" className="h-6" />
            <img src="/payment/mastercard.png" alt="Mastercard" className="h-6" />
            <img src="/payment/upi.png" alt="UPI" className="h-6" />
            <img src="/payment/gpay.png" alt="GPay" className="h-6" />
          </div>
          <p className="text-[10px] text-gray-500 uppercase tracking-widest">
            © 2026 Lebroid Healthcare
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;