import React, { useEffect, useState } from "react";
import axios from "axios";

const Faq = () => {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState("");
  const [faqs, setFaqs] = useState([]);
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);

  // ✅ LIVE BACKEND URL (Prefix check karein: /api ya /api/admin)
  const API_BASE = "https://labrostone-backend.onrender.com/api";

  // ✅ HELPER: Auth Header Setup
  const getAuthHeader = () => {
    const token = localStorage.getItem('adminToken');
    return { headers: { 'Authorization': token ? `Bearer ${token}` : '' } };
  };

  // 1. Fetch Categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data } = await axios.get(`${API_BASE}/categories`);
        const catData = data.categories || data.data || data || [];
        setCategories(catData);
      } catch (err) {
        console.error("Error fetching categories:", err);
      }
    };
    fetchCategories();
  }, []);

  // 2. Fetch Products by Category
  useEffect(() => {
    if (!selectedCategory) {
      setProducts([]);
      return;
    }
    const fetchProducts = async () => {
      try {
        // Aapke backend route ke hisaab se path sahi kiya
        const { data } = await axios.get(`${API_BASE}/products/by-category/${selectedCategory}`);
        setProducts(data.data || data.products || []);
        setSelectedProduct(""); 
        setFaqs([]); 
      } catch (err) {
        console.error("Error fetching products:", err);
      }
    };
    fetchProducts();
  }, [selectedCategory]);

  // 3. Fetch FAQs for Product
  useEffect(() => {
    if (!selectedProduct) {
      setFaqs([]);
      return;
    }
    const fetchFaqs = async () => {
      try {
        const { data } = await axios.get(`${API_BASE}/faqs?productId=${selectedProduct}`);
        setFaqs(data.faqs || data.data || []);
      } catch (err) {
        console.error("Error fetching FAQs:", err);
      }
    };
    fetchFaqs();
  }, [selectedProduct]);

  // 4. Add FAQ (POST Request Fix)
  const handleAddFaq = async (e) => {
    e.preventDefault();
    if (!question || !answer || !selectedProduct) return alert("All fields are required");

    setLoading(true);
    try {
      // ⚠️ Agar abhi bhi 404 aaye, toh niche wale path ko `/admin/faqs` karke dekhein
      const { data } = await axios.post(`${API_BASE}/faqs`, {
        question,
        answer,
        productId: selectedProduct,
      }, getAuthHeader());

      if (data.success || data.faq) {
        setFaqs([data.faq || data.data, ...faqs]);
        setQuestion("");
        setAnswer("");
        alert("FAQ Added Successfully! ✅");
      }
    } catch (err) {
      console.error("Add FAQ Error:", err);
      if (err.response?.status === 404) {
        alert("Backend Route Not Found! Please check if the route is /api/faqs or /api/admin/faqs");
      } else {
        alert("Failed to add FAQ");
      }
    }
    setLoading(false);
  };

  // 5. Delete FAQ
  const handleDeleteFaq = async (id) => {
    if (window.confirm("Are you sure you want to delete this FAQ?")) {
      try {
        await axios.delete(`${API_BASE}/faqs/${id}`, getAuthHeader());
        setFaqs(faqs.filter((item) => item._id !== id));
        alert("Deleted! 🗑️");
      } catch (err) {
        console.error("Delete Error:", err);
        alert("Failed to delete FAQ");
      }
    }
  };

  return (
    <div className="p-6 bg-slate-900 min-h-screen text-white font-sans">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-black text-blue-500 uppercase italic tracking-widest">
          FAQ Control Panel
        </h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Selection column */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-slate-800 p-6 rounded-3xl border border-slate-700 shadow-xl">
            <h2 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Selection Filter</h2>
            <div className="space-y-4">
              <label className="text-[10px] font-bold text-slate-500 uppercase block">Category</label>
              <select className="w-full bg-slate-900 border border-slate-700 p-3 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none" value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}>
                <option value="">-- Select Category --</option>
                {categories.map((cat) => (
                  <option key={cat._id} value={cat._id}>{cat.name}</option>
                ))}
              </select>

              {selectedCategory && (
                <>
                  <label className="text-[10px] font-bold text-slate-500 uppercase block mt-4">Product</label>
                  <select className="w-full bg-slate-900 border border-slate-700 p-3 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none" value={selectedProduct} onChange={(e) => setSelectedProduct(e.target.value)}>
                    <option value="">-- Select Product --</option>
                    {products.map((prod) => (
                      <option key={prod._id} value={prod._id}>{prod.name}</option>
                    ))}
                  </select>
                </>
              )}
            </div>
          </div>

          {selectedProduct && (
            <div className="bg-slate-800 p-6 rounded-3xl border border-slate-700 shadow-xl">
              <h2 className="text-[10px] font-black text-blue-500 uppercase tracking-widest mb-4">Add New Question</h2>
              <form onSubmit={handleAddFaq} className="space-y-4">
                <input type="text" placeholder="Question" value={question} onChange={(e) => setQuestion(e.target.value)} className="w-full bg-slate-900 border border-slate-700 p-3 rounded-xl text-sm focus:border-blue-500 outline-none" required />
                <textarea placeholder="Answer" value={answer} onChange={(e) => setAnswer(e.target.value)} className="w-full bg-slate-900 border border-slate-700 p-3 rounded-xl text-sm h-32 focus:border-blue-500 outline-none resize-none" required />
                <button type="submit" disabled={loading} className="w-full bg-blue-600 hover:bg-blue-700 p-3 rounded-xl font-black uppercase tracking-widest text-xs transition-all">
                  {loading ? "Adding..." : "+ Create FAQ"}
                </button>
              </form>
            </div>
          )}
        </div>

        {/* List column */}
        <div className="lg:col-span-2">
          <div className="bg-slate-800 rounded-3xl border border-slate-700 overflow-hidden shadow-xl">
            <table className="w-full text-left">
              <thead className="bg-slate-700/50 text-[10px] uppercase text-slate-400 font-black tracking-widest">
                <tr>
                  <th className="p-5">Product FAQ List</th>
                  <th className="p-5 text-right pr-10">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700">
                {!selectedProduct ? (
                  <tr><td className="p-20 text-center text-slate-500 italic text-sm">Select Category & Product to manage FAQs.</td></tr>
                ) : faqs.length === 0 ? (
                  <tr><td className="p-20 text-center text-slate-500 italic text-sm">No FAQs found for this product.</td></tr>
                ) : (
                  faqs.map((faq) => (
                    <tr key={faq._id} className="hover:bg-slate-700/30 transition-colors">
                      <td className="p-6">
                        <div className="font-bold text-blue-400 text-sm uppercase mb-2">Q: {faq.question}</div>
                        <div className="text-slate-400 text-sm leading-relaxed ml-4">A: {faq.answer}</div>
                      </td>
                      <td className="p-6 text-right pr-10 align-top">
                        <button onClick={() => handleDeleteFaq(faq._id)} className="text-red-500 border border-red-500/30 px-3 py-1 rounded-lg text-[10px] font-black uppercase hover:bg-red-500/10">Delete</button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Faq;