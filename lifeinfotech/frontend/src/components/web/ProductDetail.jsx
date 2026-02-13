import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Plus, Minus, Loader2 } from 'lucide-react';

// Components
import Navbar from "../web/comman/Navbar";
import Footer from "../web/comman/Footer";
import ProductGallery from '../product/ProductGallery';
import ProductInfo from '../product/ProductInfo';
import ProductSidebar from '../product/ProductSidebar';
import Reviews from '../product/Reviews';

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('Product Description');
  const [openFaqIndex, setOpenFaqIndex] = useState(null);

  const API_BASE = "https://lebrostonebackend.lifeinfotechinstitute.com"; 

  const getCleanUrl = (img) => {
    if (!img) return "";
    if (img.startsWith('http')) return img;
    let cleanPath = img.replace('public/', '');
    if (cleanPath.startsWith('/')) cleanPath = cleanPath.substring(1);
    return `${API_BASE}/${cleanPath}`;
  };

  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`${API_BASE}/api/products/${id}`);
        const data = res.data.data;

        // --- IMAGE LOGIC ---
        let finalImages = [];
        if (data.images && data.images.length > 0) {
            finalImages = data.images.map(getCleanUrl);
        } else if (data.is_combo && data.included_products?.length > 0) {
            finalImages = data.included_products
                .map(item => item.images?.[0])
                .filter(Boolean)
                .map(getCleanUrl);
        } else {
            finalImages = ["https://via.placeholder.com/600?text=No+Image"];
        }

        // =========================================================
        // ✅ STRICT PRICE LOGIC (FORCE 500)
        // =========================================================
        let calculatedVariants = [];

        // Database Values
        const rootSP = Number(data.selling_price); // 500
        const rootMRP = Number(data.mrp); // 713

        // Logic: Agar Root Selling Price (500) maujood hai, to sab kuch ignore karke use hi maano
        if (rootSP > 0) {
             calculatedVariants = [{
                id: data._id,
                size: 'Standard Pack', // Name change kiya taaki UI update reflect ho
                selling_price: rootSP, // 500
                mrp: rootMRP > 0 ? rootMRP : rootSP // 713
            }];
        } 
        else if (data.variants && data.variants.length > 0 && data.variants.some(v => v.selling_price > 0)) {
            // Agar Root price 0 hai, tabhi variants use karo
            calculatedVariants = data.variants;
        } 
        else if (data.is_combo && data.included_products?.length > 0) {
            // Agar upar ke dono nahi hain, tabhi calculation karo
            let totalSellingPrice = 0;
            data.included_products.forEach(item => {
                const itemSP = Number(item.selling_price) || Number(item.variants?.[0]?.selling_price) || 0;
                totalSellingPrice += itemSP;
            });

            calculatedVariants = [{
                id: 'combo-calc',
                size: 'Combo Bundle',
                selling_price: totalSellingPrice, 
                mrp: totalSellingPrice * 1.2 
            }];
        }
        else {
             // Fallback
             calculatedVariants = [{
                id: 'fallback',
                size: 'Standard',
                selling_price: 0,
                mrp: 0
            }];
        }

        // --- MAPPING (Double Check) ---
        let formattedProduct = {
          ...data,
          images: finalImages,
          subtitle: data.tagline || "Premium Natural Care",
          rating: data.rating || 4.5,
          reviewsCount: data.reviews_count || 0,
          variants: calculatedVariants.map((v, idx) => ({ 
            id: v._id?.$oid || v._id || idx || v.id,
            size: v.size || "Standard",
            
            // ✅ Yahan ensure kar rahe hain ki price 500 hi jaye
            price: v.selling_price, 
            selling_price: v.selling_price, 
            
            // ✅ MRP 713 hi jaye
            mrp: v.mrp || v.selling_price, 

            // Discount Calculation: (713 - 500)
            discount: (v.mrp > v.selling_price)
              ? `${Math.round(((v.mrp - v.selling_price) / v.mrp) * 100)}% Off` 
              : "",
            usp: `₹${(v.selling_price / (data.net_content || 100)).toFixed(2)}/unit`,
            hasTimer: idx === 0 
          })),
          ingredientsList: data.ingredients || [],
          faqs: data.faqs || [],
          reviewsList: data.reviews || []
        };

        // --- COMBO MERGING ---
        if (formattedProduct.is_combo && formattedProduct.included_products?.length > 0) {
            if (!formattedProduct.features || formattedProduct.features.length === 0) {
                let comboFeatures = [];
                formattedProduct.included_products.forEach(item => {
                    if (item.features && Array.isArray(item.features)) {
                        const taggedFeatures = item.features.map(f => ({
                            ...f,
                            description: f.description ? `${f.description} (${item.name})` : `From ${item.name}`
                        }));
                        comboFeatures = [...comboFeatures, ...taggedFeatures];
                    }
                });
                formattedProduct.features = comboFeatures;
            }
            if (!formattedProduct.long_description) {
                const combinedDesc = formattedProduct.included_products
                    .map(item => `<strong>${item.name}</strong><br/>${item.long_description || item.short_description || "Description coming soon."}`)
                    .join("<br/><br/>"); 
                formattedProduct.long_description = combinedDesc;
            }
            if (!formattedProduct.how_to_use) {
                 const combinedUsage = formattedProduct.included_products
                    .filter(item => item.how_to_use)
                    .map(item => `✨ For ${item.name}:\n${item.how_to_use}`)
                    .join("\n\n");
                 formattedProduct.how_to_use = combinedUsage;
            }
            if (!formattedProduct.faqs || formattedProduct.faqs.length === 0) {
                let comboFaqs = [];
                formattedProduct.included_products.forEach(item => {
                    if (item.faqs && Array.isArray(item.faqs)) {
                        const taggedFaqs = item.faqs.map(f => ({
                            question: `${f.question} (${item.name})`,
                            answer: f.answer
                        }));
                        comboFaqs = [...comboFaqs, ...taggedFaqs];
                    }
                });
                formattedProduct.faqs = comboFaqs;
            }
        }

        setProduct(formattedProduct);
        setSelectedVariant(formattedProduct.variants[0]); 
        setLoading(false);
      } catch (err) {
        console.error("Error fetching product:", err);
        setLoading(false);
      }
    };

    fetchProductDetails();
    window.scrollTo(0, 0);
  }, [id]);

  const toggleFaq = (index) => setOpenFaqIndex(openFaqIndex === index ? null : index);
  const createMarkup = (html) => { return { __html: html }; }

  if (loading) return <div className="flex h-screen items-center justify-center bg-white"><Loader2 className="animate-spin text-[#00AFEF]" size={48} /></div>;
  if (!product) return <div className="text-center py-20 text-xl font-bold">Product not found!</div>;

  const tabs = ["Product Description", "How to Use", "Key Ingredients"];

  return (
    <div className="font-sans text-[#212121] bg-white">

      <div className="hidden md:flex max-w-[1280px] mx-auto px-4 py-3 text-[13px] text-gray-500 items-center gap-2">
        <a href="/" className="hover:text-[#00AFEF]">Home</a> <span>›</span> <span className="text-gray-900 font-medium capitalize">Product</span> <span>›</span> <span className="text-gray-900 font-medium">{product.name}</span>
      </div>

      <main className="max-w-[1280px] mx-auto px-4 py-4 mb-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 relative">
          <div className="lg:col-span-9">
            <div className="flex flex-col lg:flex-row gap-8 mb-10">
               <div className="w-full lg:w-[55%]"><ProductGallery images={product.images} /></div>
               <div className="w-full lg:w-[45%]"><ProductInfo product={product} selectedVariant={selectedVariant} setSelectedVariant={setSelectedVariant} /></div>
            </div>

            <div className="mb-12">
               <div className="flex border border-gray-200 rounded-md overflow-x-auto mb-8 no-scrollbar">
                 {tabs.map((tab) => (
                   <button key={tab} onClick={() => setActiveTab(tab)} className={`flex-1 min-w-[120px] py-4 text-[15px] font-medium transition-all text-center border-r border-gray-200 last:border-r-0 ${activeTab === tab ? 'bg-blue-50 text-[#00AFEF] border-b-2 border-b-[#00AFEF]' : 'bg-white text-gray-600 hover:text-[#00AFEF]'}`}>{tab}</button>
                 ))}
               </div>
               
             <div className="min-h-[250px] py-4">
               {activeTab === "Product Description" && (
                 <div className="text-gray-600 leading-relaxed animate-in fade-in duration-300" dangerouslySetInnerHTML={createMarkup(product.long_description || product.short_description || "No description available.")} />
               )}
               {activeTab === "How to Use" && (
                 <div className="animate-in fade-in duration-300">
                   {product.how_to_use ? (
                     <div className="space-y-4">
                       {product.how_to_use.includes("Step") 
                         ? product.how_to_use.split(/(?=Step \d:)/).map((step, index) => (
                             <div key={index} className="flex gap-4 p-4 bg-slate-50 rounded-xl border-l-4 border-[#00AFEF] shadow-sm">
                               <div className="flex-shrink-0 w-8 h-8 bg-[#00AFEF] text-white rounded-full flex items-center justify-center font-bold text-sm">{index + 1}</div>
                               <p className="text-gray-700 text-[14px] leading-relaxed font-medium">{step.trim()}</p>
                             </div>
                           ))
                         : <div className="whitespace-pre-line p-4 bg-slate-50 rounded-xl border border-slate-200 text-gray-700 leading-relaxed">{product.how_to_use}</div>
                       }
                     </div>
                   ) : <p className="text-gray-500 italic">Usage instructions coming soon...</p>}
                 </div>
               )}
               {activeTab === "Key Ingredients" && (
                 <div className="animate-in fade-in slide-in-from-top-2 duration-500">
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                     {product.features && product.features.length > 0 ? (
                       product.features.map((feature, idx) => (
                         <div key={feature._id || idx} className="flex items-start gap-4 p-5 bg-[#F8FBFD] rounded-2xl border border-blue-50/50 hover:shadow-md transition-all group">
                           <div className="w-12 h-12 bg-white rounded-full flex-shrink-0 flex items-center justify-center shadow-sm border border-blue-100 group-hover:scale-110 transition-transform"><span className="text-xl">🌿</span></div>
                           <div className="flex flex-col gap-1">
                             <h4 className="text-[13px] font-black uppercase text-slate-800 tracking-tight leading-tight">{feature.title}</h4>
                             {feature.description && <p className="text-[11px] text-gray-500 leading-normal font-medium italic">{feature.description}</p>}
                           </div>
                         </div>
                       ))
                     ) : <div className="col-span-full py-10 text-center opacity-50 italic">Natural Ingredients coming soon for {product.name}...</div>}
                   </div>
                 </div>
               )}
             </div>
           </div>

           {product.faqs.length > 0 && (
             <div className="mb-8 border-t border-gray-200 pt-8">
               <h2 className="text-[20px] font-bold mb-6 text-gray-800">Frequently Asked Questions</h2>
               <div className="space-y-1">
                 {product.faqs.map((faq, idx) => (
                   <div key={idx} className="border-b border-gray-200">
                     <div onClick={() => toggleFaq(idx)} className="flex justify-between items-center py-4 font-bold text-gray-800 cursor-pointer text-[15px] hover:text-[#00AFEF]">
                       {faq.question} {openFaqIndex === idx ? <Minus className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                     </div>
                     {openFaqIndex === idx && <div className="pb-4 text-[14px] text-gray-600 animate-fadeIn">{faq.answer}</div>}
                   </div>
                 ))}
               </div>
             </div>
           )}
           <Reviews reviews={product.reviewsList} overallRating={product.rating} totalReviews={product.reviewsCount} />
         </div>
         <div className="lg:col-span-3"><div className="sticky top-24"><ProductSidebar product={product} selectedVariant={selectedVariant} quantity={quantity} setQuantity={setQuantity} /></div></div>
       </div>
     </main>
     <Footer />
   </div>
 );
};

export default ProductDetail;