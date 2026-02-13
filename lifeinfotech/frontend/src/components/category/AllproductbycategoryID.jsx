import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Loader2, ShoppingCart, Star } from 'lucide-react';
import Navbar from '../web/comman/Navbar'; 
import Footer from '../web/comman/Footer';

const AllProductByCategory = () => {
    const { categoryId } = useParams();
    const navigate = useNavigate();
    const [products, setProducts] = useState([]);
    const [allProductsRaw, setAllProductsRaw] = useState([]); // Store all products for lookup
    const [categoryName, setCategoryName] = useState("");
    const [loading, setLoading] = useState(true);

    const API_BASE = "https://lebrostonebackend.lifeinfotechinstitute.com";

    // --- 1. IMAGE URL HELPER (CLEANUP) ---
    const getCleanImageUrl = (imagePath) => {
        if (!imagePath) return "";
        if (imagePath.startsWith('http')) return imagePath;
        const cleanPath = imagePath.replace('public/', '').replace(/^\/+/, ''); 
        return `${API_BASE}/${cleanPath}`;
    };

    // --- 2. SMART IMAGE FINDER LOGIC ---
    const getProductDisplayImage = (product) => {
        // Priority 1: Product ki apni image
        if (product.images && product.images.length > 0) {
            return getCleanImageUrl(product.images[0]);
        }
        
        // Priority 2: Agar Combo hai aur apni image nahi hai -> Included Product ki image
        if (product.is_combo && product.included_products?.length > 0) {
            const firstItem = product.included_products[0];
            
            // Case A: Agar populated object hai
            if (typeof firstItem === 'object' && firstItem.images?.length > 0) {
                return getCleanImageUrl(firstItem.images[0]);
            }
            
            // Case B: Agar sirf ID hai -> Dusre products me dhundo (Agar data available ho)
            if (typeof firstItem === 'string') {
                // Koshish karo ki shayad ye item products list me maujood ho
                const foundItem = allProductsRaw.find(p => p._id === firstItem);
                if (foundItem?.images?.length > 0) {
                    return getCleanImageUrl(foundItem.images[0]);
                }
            }
        }

        // Priority 3: Placeholder
        return "https://via.placeholder.com/300?text=No+Image";
    };

    // --- 3. PRICE LOGIC (Same as Product Detail) ---
    const getProductPrice = (product) => {
        let sp = Number(product.selling_price) || 0;
        let mrp = Number(product.mrp) || 0;

        // Agar main price 0 hai, to variant check karo
        if (sp === 0 && product.variants?.length > 0) {
            sp = Number(product.variants[0].selling_price) || 0;
            mrp = Number(product.variants[0].mrp) || 0;
        }

        // Agar abhi bhi 0 hai aur Combo hai -> Items ka total karo (Advanced)
        if (sp === 0 && product.is_combo && product.included_products?.length > 0) {
             // Note: Is page par shayad included products fully populated na hon, 
             // to calculation skip kar sakte hain ya basic logic laga sakte hain.
             // Filhal hum variant price fallback use kar rahe hain.
        }

        return { sp, mrp };
    };

    useEffect(() => {
        const fetchCategoryProducts = async () => {
            try {
                setLoading(true);
                
                // 1. Fetch products for this category
                // const res = await axios.get(`${API_BASE}/api/products?category=${categoryId}`);
                const res = await axios.get(`${API_BASE}/api/products/by-category/${categoryId}`);
                const categoryData = res.data.data || [];
                setProducts(categoryData);

                // 2. Fetch ALL products (Sirf image lookup ke liye, agar zaroorat padi)
                // (Optional: Agar performance issue ho to isse hata sakte hain)
                try {
                    const allRes = await axios.get(`${API_BASE}/api/products`);
                    setAllProductsRaw(allRes.data.data || []);
                } catch (e) {
                    console.warn("Could not fetch all products for lookup", e);
                    setAllProductsRaw(categoryData); // Fallback to current list
                }

                if (categoryData.length > 0 && categoryData[0].category) {
                    setCategoryName(categoryData[0].category.name || "Collection");
                }

                setLoading(false);
            } catch (err) {
                console.error("Error fetching category products:", err);
                setLoading(false);
            }
        };

        fetchCategoryProducts();
        window.scrollTo(0, 0);
    }, [categoryId]);

    if (loading) return (
        <div className="flex h-screen items-center justify-center bg-white">
            <Loader2 className="animate-spin text-blue-500" size={50} />
        </div>
    );

    return (
        <div className="bg-white min-h-screen">
  

            {/* Header Section */}
            <div className="bg-slate-50 py-12 border-b border-gray-100">
                <div className="container mx-auto px-4 text-center">
                    <h1 className="text-4xl font-black uppercase tracking-tight text-slate-900 mb-2">
                        {categoryName || "Products"}
                    </h1>
                    <p className="text-gray-500 text-sm">Home / Collections / {categoryName}</p>
                </div>
            </div>

            {/* Products Grid */}
            <div className="container mx-auto px-4 py-16">
                {products.length === 0 ? (
                    <div className="text-center py-20 text-gray-400">
                        No products found in this category.
                    </div>
                ) : (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                        {products.map((product) => {
                            
                            // Calculate Price & Image using helpers
                            const { sp: sellingPrice, mrp } = getProductPrice(product);
                            const displayImage = getProductDisplayImage(product);
                            const discount = mrp > sellingPrice ? Math.round(((mrp - sellingPrice) / mrp) * 100) : 0;

                            return (
                                <div 
                                    key={product._id} 
                                    className="group cursor-pointer"
                                    onClick={() => navigate(`/product/${product._id}`)}
                                >
                                    <div className="relative aspect-[3/4] overflow-hidden bg-gray-100 rounded-2xl mb-4">
                                        {discount > 0 && (
                                            <div className="absolute top-3 left-3 bg-black text-white text-[10px] font-bold px-2 py-1 rounded z-10">
                                                -{discount}%
                                            </div>
                                        )}
                                        <img 
                                            src={displayImage} 
                                            alt={product.name}
                                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                            onError={(e) => e.target.src = "https://via.placeholder.com/300?text=No+Image"}
                                        />
                                        <div className="absolute bottom-4 right-4 bg-white p-2 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity">
                                            <ShoppingCart size={18} />
                                        </div>
                                    </div>

                                    <h3 className="text-sm font-bold text-gray-900 uppercase line-clamp-1 mb-1 px-1">
                                        {product.name}
                                    </h3>
                                    
                                    <div className="flex items-center gap-2 mb-2 px-1">
                                        {mrp > sellingPrice && (
                                            <span className="text-gray-400 line-through text-xs">₹{mrp}</span>
                                        )}
                                        <span className="font-bold text-gray-900">₹{sellingPrice}</span>
                                    </div>

                                    <div className="flex text-yellow-400 mb-4 px-1">
                                        {[...Array(5)].map((_, i) => (
                                            <Star key={i} size={12} fill={i < 4 ? "currentColor" : "none"} />
                                        ))}
                                    </div>

                                    <button className="w-full border border-black py-2 text-[10px] font-bold uppercase tracking-widest hover:bg-black hover:text-white transition-colors rounded-lg">
                                        View Product
                                    </button>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            <Footer />
        </div>
    );
};

export default AllProductByCategory;