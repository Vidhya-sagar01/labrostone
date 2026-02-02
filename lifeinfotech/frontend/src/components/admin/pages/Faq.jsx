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

  // ✅ BASE URL for FAQ module
  const FAQ_BASE = "https://labrostone-backend.onrender.com/api/admin/faqs";

  const getAuthHeader = () => {
    const token = localStorage.getItem('adminToken');
    return { headers: { 'Authorization': token ? `Bearer ${token}` : '' } };
  };

  // 1. Fetch Categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data } = await axios.get(`${FAQ_BASE}/categories`);
        setCategories(data.categories || []);
      } catch (err) { console.error("Error categories"); }
    };
    fetchCategories();
  }, []);

  // 2. Fetch Products
  useEffect(() => {
    if (!selectedCategory) return;
    const fetchProducts = async () => {
      try {
        const { data } = await axios.get(`${FAQ_BASE}/products?category=${selectedCategory}`);
        setProducts(data.products || []);
      } catch (err) { console.error("Error products"); }
    };
    fetchProducts();
  }, [selectedCategory]);

  // 3. Fetch FAQs
  useEffect(() => {
    if (!selectedProduct) return;
    const fetchFaqs = async () => {
      try {
        const { data } = await axios.get(`${FAQ_BASE}?productId=${selectedProduct}`);
        setFaqs(data.faqs || []);
      } catch (err) { console.error("Error FAQs"); }
    };
    fetchFaqs();
  }, [selectedProduct]);

  const handleAddFaq = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await axios.post(FAQ_BASE, {
        question, answer, productId: selectedProduct
      }, getAuthHeader());
      if (data.success) {
        setFaqs([data.faq, ...faqs]);
        setQuestion(""); setAnswer("");
        alert("FAQ Created! ✅");
      }
    } catch (err) { alert("Failed to add FAQ"); }
    setLoading(false);
  };

  const handleDeleteFaq = async (id) => {
    if (window.confirm("Delete FAQ?")) {
      try {
        await axios.delete(`${FAQ_BASE}/${id}`, getAuthHeader());
        setFaqs(faqs.filter(f => f._id !== id));
      } catch (err) { alert("Delete failed"); }
    }
  };

  return (
    <div className="p-6 bg-slate-900 min-h-screen text-white font-sans">
      <h1 className="text-2xl font-black text-blue-500 uppercase italic mb-8">FAQ Control Panel</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-slate-800 p-6 rounded-3xl border border-slate-700">
            <label className="text-[10px] font-bold text-slate-500 uppercase block mb-2">Category Selection</label>
            <select className="w-full bg-slate-900 border border-slate-700 p-3 rounded-xl outline-none" value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}>
              <option value="">-- Select Category --</option>
              {categories.map(cat => <option key={cat._id} value={cat._id}>{cat.name}</option>)}
            </select>
            {selectedCategory && (
              <div className="mt-4">
                <label className="text-[10px] font-bold text-slate-500 uppercase block mb-2">Product Selection</label>
                <select className="w-full bg-slate-900 border border-slate-700 p-3 rounded-xl outline-none" value={selectedProduct} onChange={(e) => setSelectedProduct(e.target.value)}>
                  <option value="">-- Select Product --</option>
                  {products.map(prod => <option key={prod._id} value={prod._id}>{prod.name}</option>)}
                </select>
              </div>
            )}
          </div>
          {selectedProduct && (
            <div className="bg-slate-800 p-6 rounded-3xl border border-slate-700">
              <form onSubmit={handleAddFaq} className="space-y-4">
                <input type="text" placeholder="Question" value={question} onChange={(e) => setQuestion(e.target.value)} className="w-full bg-slate-900 border border-slate-700 p-3 rounded-xl outline-none" required />
                <textarea placeholder="Answer" value={answer} onChange={(e) => setAnswer(e.target.value)} className="w-full bg-slate-900 border border-slate-700 p-3 rounded-xl h-32 outline-none resize-none" required />
                <button type="submit" disabled={loading} className="w-full bg-blue-600 p-3 rounded-xl font-black uppercase text-xs">{loading ? "Wait..." : "+ Create FAQ"}</button>
              </form>
            </div>
          )}
        </div>
        <div className="lg:col-span-2 bg-slate-800 rounded-3xl border border-slate-700 overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-slate-700/50 text-[10px] uppercase text-slate-400 font-black">
              <tr><th className="p-5">FAQ Content</th><th className="p-5 text-right pr-10">Action</th></tr>
            </thead>
            <tbody className="divide-y divide-slate-700">
              {faqs.map(faq => (
                <tr key={faq._id} className="hover:bg-slate-700/30 transition-all">
                  <td className="p-6">
                    <div className="font-bold text-blue-400 text-sm uppercase mb-1">Q: {faq.question}</div>
                    <div className="text-slate-400 text-sm">A: {faq.answer}</div>
                  </td>
                  <td className="p-6 text-right pr-10 align-top">
                    <button onClick={() => handleDeleteFaq(faq._id)} className="text-red-500 border border-red-500/30 px-3 py-1 rounded-lg text-[10px] font-black uppercase">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Faq;