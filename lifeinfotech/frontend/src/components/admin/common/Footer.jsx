import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-white border-t py-4 px-8">
      <div className="flex flex-col md:flex-row justify-between items-center text-sm text-gray-500">
        <p>© 2026 Lebrostone Admin Panel. All rights reserved.</p>
        <div className="flex gap-4 mt-2 md:mt-0">
          <a href="#" className="hover:text-green-600 transition">Privacy Policy</a>
          <a href="#" className="hover:text-green-600 transition">Terms of Service</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;