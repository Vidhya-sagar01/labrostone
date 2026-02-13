import React, { useState, useEffect } from 'react';
import axios from 'axios';

const User = () => {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  
  // Modal states
  const [selectedCart, setSelectedCart] = useState([]); // Cart items store karne ke liye
  const [currentUserName, setCurrentUserName] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const isLocal = window.location.hostname === "localhost";
  const BASE_URL = isLocal 
    ? "http://localhost:5000/api" 
    : "https://lebrostonebackend.lifeinfotechinstitute.com/api";

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${BASE_URL}/user/all`);
      setUsers(Array.isArray(response.data) ? response.data : []); 
      setLoading(false);
    } catch (err) {
      console.error("Fetch Error:", err);
      setLoading(false);
    }
  };

  useEffect(() => { fetchUsers(); }, []);

  // Jab Cart par click ho
  const handleCartClick = (user) => {
    setSelectedCart(user.cart || []); // User ke cart items (products) set karein
    setCurrentUserName(user.name);
    setIsModalOpen(true);
  };

  const filteredUsers = users.filter((u) =>
    u?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u?.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <div className="p-10 text-center text-xl font-bold">Loading Users...</div>;

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h2 className="text-2xl font-bold text-slate-800 mb-6">User Management</h2>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden border">
        <table className="w-full text-left border-collapse">
          <thead className="bg-slate-900 text-white">
            <tr>
              <th className="p-4 uppercase text-xs">User Name</th>
              <th className="p-4 uppercase text-xs">Email</th>
              <th className="p-4 uppercase text-xs text-center">Cart Items</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {filteredUsers.map((user) => (
              <tr key={user._id} className="hover:bg-slate-50 transition-colors">
                <td className="p-4 text-sm font-medium">{user.name}</td>
                <td className="p-4 text-sm text-slate-600">{user.email}</td>
                <td className="p-4 text-sm text-center">
                  <button 
                    onClick={() => handleCartClick(user)}
                    className="bg-emerald-100 text-emerald-700 px-4 py-1.5 rounded-lg text-xs font-black hover:bg-emerald-200 transition-all border border-emerald-200"
                  >
                    View {user.cart?.length || 0} Products 📦
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* --- PRODUCT DETAILS MODAL --- */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[80vh]">
            
            {/* Modal Header */}
            <div className="bg-slate-900 p-5 flex justify-between items-center">
              <div>
                <h3 className="text-white font-bold text-lg">Cart Products</h3>
                <p className="text-slate-400 text-xs uppercase tracking-widest">Customer: {currentUserName}</p>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="text-white hover:text-red-400 text-3xl font-light">&times;</button>
            </div>
            
            {/* Modal Body (Product List) */}
            <div className="p-6 overflow-y-auto bg-slate-50">
              {selectedCart.length > 0 ? (
                <div className="space-y-4">
                  {selectedCart.map((item, index) => (
                    <div key={index} className="flex items-center gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                      {/* Product Placeholder Image */}
                      <div className="h-16 w-16 bg-slate-100 rounded-lg flex items-center justify-center text-2xl">
                        {item.image ? <img src={item.image} alt="product" className="h-full w-full object-cover rounded-lg" /> : "🖼️"}
                      </div>
                      
                      <div className="flex-1">
                        <h4 className="font-bold text-slate-800">{item.name || "Unnamed Product"}</h4>
                        <p className="text-xs text-slate-500 font-mono">ID: {item._id || item.productId || item}</p>
                      </div>

                      <div className="text-right">
                        <p className="text-sm font-black text-emerald-600">₹{item.price || "0"}</p>
                        <p className="text-[10px] text-slate-400 font-bold uppercase">Qty: {item.quantity || 1}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-10">
                  <span className="text-5xl block mb-4">🛒</span>
                  <p className="text-slate-500 font-medium">This user's cart is empty.</p>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t bg-white flex justify-end">
              <button 
                onClick={() => setIsModalOpen(false)}
                className="bg-red-500 text-white px-8 py-2 rounded-xl font-bold hover:bg-red-600 transition-all shadow-lg"
              >
                Close Details
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default User;