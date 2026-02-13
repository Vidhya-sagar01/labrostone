import React, { useState, useEffect } from 'react';
import { Minus, Plus, Trash2, ShieldCheck, MapPin, Ticket, X, Loader2 } from 'lucide-react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Cart = () => {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [orderLoading, setOrderLoading] = useState(false); // Order process state
  
  // Coupon States
  const [showCouponInput, setShowCouponInput] = useState(false);
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [couponError, setCouponError] = useState("");

  const isLocal = window.location.hostname === "localhost";
  const API_BASE = isLocal ? "http://localhost:5000" : "https://lebrostonebackend.lifeinfotechinstitute.com";
  const user = JSON.parse(localStorage.getItem('user'));

  // 1. Fetch Cart
  useEffect(() => {
    const fetchCart = async () => {
      if (!user?._id) { navigate('/login'); return; }
      try {
        const res = await axios.get(`${API_BASE}/api/user/${user._id}`);
        if (res.data && res.data.data) { setCartItems(res.data.data.cart || []); }
      } catch (err) { console.error("Cart fetch error:", err); } 
      finally { setLoading(false); }
    };
    fetchCart();
  }, [user?._id, navigate, API_BASE]);

  // 2. Sync Cart
  const syncCartWithDB = async (updatedCart) => {
    try { await axios.put(`${API_BASE}/api/user/update-cart/${user._id}`, { cart: updatedCart }); } 
    catch (err) { console.error("Sync error:", err); }
  };

  const updateQuantity = (variantId, type) => {
    const updatedCart = cartItems.map(item => {
      if (item.variantId === variantId) {
        const newQty = type === 'plus' ? item.quantity + 1 : item.quantity - 1;
        return { ...item, quantity: Math.max(1, newQty) };
      }
      return item;
    });
    setCartItems(updatedCart);
    syncCartWithDB(updatedCart);
  };

  const removeItem = async (variantId) => {
    if (window.confirm("Remove item?")) {
      const updatedCart = cartItems.filter(item => item.variantId !== variantId);
      setCartItems(updatedCart);
      syncCartWithDB(updatedCart);
    }
  };

  // --- Coupon Logic ---
  const applyCoupon = async () => {
    setCouponError("");
    try {
      const res = await axios.get(`${API_BASE}/api/coupons/all`);
      const allCoupons = res.data;
      const found = allCoupons.find(c => c.code === couponCode.toUpperCase() && c.isActive);

      if (!found) { setCouponError("Wrong Coupon Code!"); return; }
      if (new Date(found.expiryDate) < new Date()) { setCouponError("Coupon Expired!"); return; }

      setAppliedCoupon(found);
      setShowCouponInput(false);
      alert(`Coupon Applied! ₹${found.discountAmount} saved.`);
    } catch (err) { setCouponError("Server Error validating coupon."); }
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    setCouponCode("");
  };

  // --- 3. Place Order Logic ---
  const handlePlaceOrder = async () => {
    if (!user?.address?.city) return alert("Please add an address first!");
    
    setOrderLoading(true);
    try {
      const orderData = {
        userId: user._id,
        products: cartItems.map(item => ({
          productId: item.productId,
          name: item.name,
          quantity: item.quantity,
          price: item.price,
          image: item.image,
          variantId: item.variantId
        })),
        subTotal: subTotal,
        discount: discount,
        finalTotal: finalTotal,
        address: user.address
      };

      const res = await axios.post(`${API_BASE}/api/orders/place`, orderData);

      if (res.data.success) {
        alert("🎉 Order Placed Successfully!");
        setCartItems([]); // Frontend clear
        navigate('/profile'); // Redirect to profile
      }
    } catch (err) {
      console.error("Order Error:", err);
      alert("Something went wrong while placing the order.");
    } finally {
      setOrderLoading(false);
    }
  };

  // Calculations
  const subTotal = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const discount = appliedCoupon ? appliedCoupon.discountAmount : 0;
  const finalTotal = Math.max(0, subTotal - discount);

  if (loading) return <div className="h-screen flex justify-center items-center font-bold">🛒 Loading...</div>;

  return (
    <div className="bg-[#f1f3f6] min-h-screen py-6 px-2 md:px-10 text-black">
      <div className="container mx-auto flex flex-col lg:flex-row gap-4">
        
        <div className="flex-[2.5] space-y-4">
          {/* Address */}
          <div className="bg-white p-4 shadow-sm rounded-sm border">
            <div className="flex justify-between items-center">
              <h2 className="text-gray-500 font-bold text-sm flex items-center gap-2"><MapPin size={18} className="text-blue-600"/> Delivery Address</h2>
              <button className="text-blue-600 font-bold text-sm border px-4 py-1 rounded-sm" onClick={() => navigate('/profile')}>
                {user?.address?.city ? 'CHANGE' : 'ADD ADDRESS'}
              </button>
            </div>
            {user?.address?.city && (
              <div className="mt-2 text-sm">
                <span className="font-bold">{user.name}</span>
                <p className="text-gray-600">{user.address.houseNo}, {user.address.city}, {user.address.state}</p>
              </div>
            )}
          </div>

          {/* Cart Items */}
          <div className="bg-white shadow-sm rounded-sm overflow-hidden">
            <div className="p-4 border-b bg-slate-50/50"><h1 className="text-lg font-bold">My Cart ({cartItems.length})</h1></div>
            {cartItems.length > 0 ? cartItems.map((item) => (
              <div key={item.variantId || item._id} className="p-4 border-b flex flex-col md:flex-row gap-6">
                <div className="flex flex-col items-center gap-3">
                  <img src={item.image} alt={item.name} className="w-24 h-24 object-contain border p-1" />
                  <div className="flex items-center gap-3 border rounded-full px-2 py-1">
                    <button onClick={() => updateQuantity(item.variantId, 'minus')}><Minus size={14}/></button>
                    <span>{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.variantId, 'plus')}><Plus size={14}/></button>
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-slate-800">{item.name}</h3>
                  <p className="text-2xl font-black mt-3">₹{item.price * item.quantity}</p>
                  <button onClick={() => removeItem(item.variantId)} className="text-red-500 text-xs font-bold mt-4 flex items-center gap-1 uppercase hover:underline"><Trash2 size={14}/> Remove</button>
                </div>
              </div>
            )) : <div className="p-10 text-center text-gray-500 font-bold">Cart is empty!</div>}
          </div>
        </div>

        {/* RIGHT SECTION */}
        <div className="flex-1 self-start sticky top-24">
          <div className="bg-white shadow-lg p-5 space-y-4 rounded-xl border border-slate-100">
            
            {/* Coupon Section */}
            {!appliedCoupon ? (
              <div className="border-b pb-4">
                <button 
                  onClick={() => setShowCouponInput(!showCouponInput)}
                  className="flex items-center gap-2 text-blue-600 font-bold text-sm hover:text-blue-800"
                >
                  <Ticket size={18} /> Do you have any coupon?
                </button>
                
                {showCouponInput && (
                  <div className="mt-3 flex gap-2">
                    <input 
                      type="text" 
                      placeholder="Enter Code" 
                      className={`flex-1 border p-2 rounded outline-none uppercase font-bold text-sm ${couponError ? 'border-red-500' : 'focus:border-blue-500'}`}
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                    />
                    <button onClick={applyCoupon} className="bg-blue-600 text-white px-4 py-2 rounded font-bold text-xs">APPLY</button>
                  </div>
                )}
                {couponError && <p className="text-red-500 text-[10px] font-bold mt-1 uppercase">{couponError}</p>}
              </div>
            ) : (
              <div className="bg-emerald-50 border border-emerald-200 p-3 rounded-lg flex justify-between items-center">
                <div>
                  <p className="text-emerald-700 font-bold text-xs">Coupon Applied: <span className="underline">{appliedCoupon.code}</span></p>
                  <p className="text-emerald-600 text-[10px] font-medium">Extra ₹{appliedCoupon.discountAmount} Off</p>
                </div>
                <button onClick={removeCoupon} className="text-emerald-700 hover:text-red-500"><X size={18}/></button>
              </div>
            )}

            <h3 className="text-gray-400 font-black uppercase text-xs tracking-widest">Price Details</h3>
            <div className="flex justify-between font-medium"><span>Price</span><span>₹{subTotal}</span></div>
            
            {appliedCoupon && (
              <div className="flex justify-between text-emerald-600 font-bold">
                <span>Coupon Discount</span>
                <span>- ₹{appliedCoupon.discountAmount}</span>
              </div>
            )}
            
            <div className="flex justify-between text-emerald-600 font-bold italic"><span>Delivery</span><span>FREE</span></div>
            <div className="flex justify-between text-2xl font-black border-t border-dashed pt-5 text-slate-900">
              <span>Total Amount</span>
              <span>₹{finalTotal}</span>
            </div>
            
            <button 
              disabled={!user?.address?.city || cartItems.length === 0 || orderLoading}
              className={`w-full py-4 rounded-xl font-black uppercase text-white shadow-xl flex items-center justify-center gap-2 transition-all ${user?.address?.city && cartItems.length > 0 ? 'bg-[#fb641b] hover:bg-[#e65a17]' : 'bg-gray-300 cursor-not-allowed'}`}
              onClick={handlePlaceOrder}
            >
              {orderLoading ? <Loader2 className="animate-spin text-white" size={20} /> : "Place Order Now"}
            </button>
          </div>
          
          <div className="mt-4 flex items-center gap-3 text-gray-400 p-3 bg-white rounded-xl border">
             <ShieldCheck size={20} className="text-emerald-500" />
             <span className="text-[10px] uppercase font-bold tracking-tight">100% Safe Payments.</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;