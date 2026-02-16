import React, { useState, useEffect } from "react";
import {
  User,
  Package,
  MapPin,
  Power,
  ChevronRight,
  Loader2,
  CheckCircle2,
  XCircle,
  Clock,
} from "lucide-react";
import axios from "axios";

const ProfilePage = () => {
  const [userData, setUserData] = useState(
    JSON.parse(localStorage.getItem("user")) || {},
  );
  const [activeTab, setActiveTab] = useState("orders");
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [orders, setOrders] = useState([]);
  const [fetchingOrders, setFetchingOrders] = useState(false);

  const API_BASE = "https://lebrostonebackend.lifeinfotechinstitute.com/api";

  const [addressForm, setAddressForm] = useState(
    userData.address || {
      houseNo: "",
      nearby: "",
      city: "",
      state: "",
      pincode: "",
    },
  );

  // 1. Fetch User Orders
  useEffect(() => {
    if (activeTab === "orders" && userData._id) {
      fetchUserOrders();
    }
  }, [activeTab]);

  const fetchUserOrders = async () => {
    setFetchingOrders(true);
    try {
      const res = await axios.get(`${API_BASE}/orders/user/${userData._id}`);
      setOrders(res.data.success ? res.data.data : []);
    } catch (err) {
      console.error("Orders fetch error:", err);
    } finally {
      setFetchingOrders(false);
    }
  };

  // 2. Update Status in Database
  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      const res = await axios.put(
        `${API_BASE}/orders/update-status/${orderId}`,
        {
          status: newStatus,
        },
      );
      if (res.data.success) {
        alert(`Order marked as ${newStatus}`);
        fetchUserOrders(); // UI refresh
      }
    } catch (err) {
      alert("Failed to update status.");
    }
  };

  const handleInputChange = (e) => {
    setAddressForm({ ...addressForm, [e.target.name]: e.target.value });
  };

  const saveAddressToDB = async () => {
    if (!userData._id) return alert("Please login again.");
    setLoading(true);
    try {
      const response = await axios.put(
        `${API_BASE}/user/update-address/${userData._id}`,
        {
          address: addressForm,
        },
      );
      if (response.data) {
        const updatedUser = { ...userData, address: addressForm };
        setUserData(updatedUser);
        localStorage.setItem("user", JSON.stringify(updatedUser));
        setIsEditing(false);
        alert("Address saved!");
      }
    } catch (error) {
      alert("Update failed!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#f1f3f6] min-h-screen py-6 px-4 md:px-10 flex flex-col md:flex-row gap-4 text-black font-sans">
      {/* SIDEBAR */}
      <div className="w-full md:w-1/4 space-y-4">
        <div className="bg-white p-4 flex items-center gap-4 shadow-sm">
          <img
            src={
              userData.picture ||
              `https://ui-avatars.com/api/?name=${userData.name || "User"}&background=random&color=fff`
            }
            className="w-12 h-12 rounded-full border shadow-sm"
            alt="User"
          />
          <div>
            <p className="text-xs text-gray-500">Hello,</p>
            <h2 className="font-bold text-lg">{userData.name}</h2>
          </div>
        </div>

        <div className="bg-white shadow-sm rounded-sm overflow-hidden">
          <div
            className={`p-4 border-b flex items-center justify-between cursor-pointer font-bold ${activeTab === "orders" ? "text-blue-600 bg-blue-50" : "text-gray-600"}`}
            onClick={() => setActiveTab("orders")}
          >
            <div className="flex items-center gap-3">
              <Package size={20} /> MY ORDERS
            </div>
            <ChevronRight size={18} />
          </div>
          <div className="p-4 border-b">
            <div className="flex items-center gap-3 text-gray-400 font-bold mb-4 uppercase text-xs tracking-wider">
              <User size={20} /> Account Settings
            </div>
            <ul className="pl-8 space-y-4 text-sm font-medium">
              <li
                className={`cursor-pointer hover:text-blue-600 ${activeTab === "address" ? "text-blue-600 font-bold" : "text-gray-600"}`}
                onClick={() => setActiveTab("address")}
              >
                Manage Addresses
              </li>
            </ul>
          </div>
          <div
            className="p-4 flex items-center gap-3 text-gray-600 font-bold cursor-pointer hover:text-red-600"
            onClick={() => {
              localStorage.clear();
              window.location.href = "/";
            }}
          >
            <Power size={20} /> LOGOUT
          </div>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div className="w-full md:w-3/4 bg-white p-6 shadow-sm min-h-[500px] rounded-sm">
        {activeTab === "address" && (
          <div>
            <h3 className="text-xl font-bold mb-6 text-slate-800">
              Manage Addresses
            </h3>
            {!isEditing ? (
              <>
                <div
                  className="border p-4 rounded-sm border-dashed border-blue-600 text-blue-600 cursor-pointer text-center font-bold mb-6 hover:bg-blue-50 transition-all"
                  onClick={() => setIsEditing(true)}
                >
                  +{" "}
                  {userData.address?.city
                    ? "EDIT ADDRESS"
                    : "ADD A NEW ADDRESS"}
                </div>
                {userData.address?.city && (
                  <div className="border p-5 bg-slate-50 rounded-sm">
                    <p className="font-bold text-slate-900">{userData.name}</p>
                    <p className="text-sm text-gray-700 mt-2">
                      {userData.address.houseNo}, {userData.address.nearby},
                      <br />
                      {userData.address.city}, {userData.address.state} -{" "}
                      <b>{userData.address.pincode}</b>
                    </p>
                  </div>
                )}
              </>
            ) : (
              <div className="space-y-4 bg-gray-50 p-6 rounded-sm border text-black">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input
                    name="houseNo"
                    placeholder="House No"
                    className="border p-3 rounded bg-white"
                    value={addressForm.houseNo}
                    onChange={handleInputChange}
                  />
                  <input
                    name="nearby"
                    placeholder="Landmark"
                    className="border p-3 rounded bg-white"
                    value={addressForm.nearby}
                    onChange={handleInputChange}
                  />
                  <input
                    name="city"
                    placeholder="City"
                    className="border p-3 rounded bg-white"
                    value={addressForm.city}
                    onChange={handleInputChange}
                  />
                  <input
                    name="state"
                    placeholder="State"
                    className="border p-3 rounded bg-white"
                    value={addressForm.state}
                    onChange={handleInputChange}
                  />
                  <input
                    name="pincode"
                    placeholder="Pincode"
                    className="border p-3 rounded bg-white"
                    value={addressForm.pincode}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="flex gap-4">
                  <button
                    onClick={saveAddressToDB}
                    className="bg-[#fb641b] text-white px-10 py-3 font-bold uppercase shadow-sm"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => setIsEditing(false)}
                    className="text-gray-600 font-bold uppercase px-6"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === "orders" && (
          <div className="animate-in slide-in-from-right duration-300">
            <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
              My Orders{" "}
              {fetchingOrders && (
                <Loader2 className="animate-spin text-blue-600" size={18} />
              )}
            </h3>

            {orders.length > 0 ? (
              <div className="space-y-6">
                {orders.map((order) => (
                  <div
                    key={order._id}
                    className="border rounded-xl overflow-hidden bg-white shadow-sm border-slate-200"
                  >
                    {/* Header */}
                    <div className="bg-slate-50 p-4 border-b flex flex-col md:flex-row justify-between gap-3">
                      <div className="text-[11px] uppercase tracking-wider font-bold text-slate-500">
                        <p>
                          Order ID:{" "}
                          <span className="text-slate-900">
                            #{order._id.slice(-8).toUpperCase()}
                          </span>
                        </p>
                        <p>
                          Placed On:{" "}
                          {new Date(order.orderDate).toLocaleString()}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span
                          className={`px-3 py-1 rounded-full text-[10px] font-black uppercase border ${
                            order.deliveryStatus === "Delivered"
                              ? "bg-emerald-50 text-emerald-600 border-emerald-200"
                              : "bg-orange-50 text-orange-600 border-orange-200"
                          }`}
                        >
                          ● {order.deliveryStatus}
                        </span>
                      </div>
                    </div>

                    <div className="p-5 grid grid-cols-1 lg:grid-cols-3 gap-6">
                      {/* Products */}
                      <div className="lg:col-span-2 space-y-4">
                        {order.products.map((item, idx) => (
                          <div
                            key={idx}
                            className="flex gap-4 items-center bg-slate-50/50 p-3 rounded-xl border border-slate-100"
                          >
                            <img
                              src={item.image}
                              className="w-16 h-16 object-contain bg-white rounded-lg border p-1"
                              alt="p"
                            />
                            <div className="flex-1">
                              <p className="text-sm font-bold text-slate-800">
                                {item.name}
                              </p>
                              <p className="text-[10px] text-slate-500 font-medium">
                                Qty: {item.quantity} × ₹{item.price}
                              </p>
                            </div>
                            <p className="font-black text-slate-900 text-sm">
                              ₹{item.price * item.quantity}
                            </p>
                          </div>
                        ))}
                      </div>

                      {/* Summary */}
                      <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 flex flex-col justify-between">
                        <div>
                          <p className="text-[10px] font-black text-slate-400 uppercase mb-2">
                            Shipping Address
                          </p>
                          <p className="text-[11px] font-bold text-slate-700">
                            {order.shippingAddress?.houseNo},{" "}
                            {order.shippingAddress?.nearby}
                            <br />
                            {order.shippingAddress?.city},{" "}
                            {order.shippingAddress?.state}
                            <br />
                            Pin: {order.shippingAddress?.pincode}
                          </p>
                        </div>
                        <div className="mt-4 pt-4 border-t border-slate-200 space-y-1">
                          <div className="flex justify-between text-[10px] font-bold text-slate-500 uppercase">
                            <span>Subtotal</span>
                            <span>₹{order.subTotal}</span>
                          </div>
                          <div className="flex justify-between text-[10px] font-bold text-emerald-600 uppercase">
                            <span>Discount</span>
                            <span>- ₹{order.discount}</span>
                          </div>
                          <div className="flex justify-between text-sm font-black text-slate-900 pt-1 border-t border-dashed border-slate-300">
                            <span>Total</span>
                            <span>₹{order.finalTotal}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="p-4 bg-white border-t flex flex-wrap gap-3">
                      <button
                        onClick={() =>
                          updateOrderStatus(order._id, "Delivered")
                        }
                        disabled={order.deliveryStatus === "Delivered"}
                        className={`flex-1 md:flex-none px-6 py-2 rounded-xl text-[10px] font-black uppercase flex items-center justify-center gap-2 transition-all ${
                          order.deliveryStatus === "Delivered"
                            ? "bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed"
                            : "bg-emerald-600 text-white hover:bg-emerald-700 shadow-md"
                        }`}
                      >
                        <CheckCircle2 size={14} />
                        {order.deliveryStatus === "Delivered"
                          ? "Order Delivered ✓"
                          : "Mark as Delivered"}
                      </button>

                      {/* ✅ AGAR STATUS DELIVERED HAI TOH REPORT ISSUE BUTTON NAHI DIKHEGA */}
                      {order.deliveryStatus !== "Delivered" && (
                        <button
                          onClick={() =>
                            alert("Reporting issue for order #" + order._id)
                          }
                          className="flex-1 md:flex-none px-6 py-2 rounded-xl text-[10px] font-black uppercase border border-red-200 text-red-500 hover:bg-red-50 transition-all"
                        >
                          <XCircle size={14} /> Report Issue
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-20 bg-slate-50 rounded-3xl border border-dashed border-slate-200">
                <Package className="mx-auto text-slate-300 mb-4" size={60} />
                <p className="text-slate-500 font-black uppercase text-xs tracking-widest">
                  No orders found
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;
