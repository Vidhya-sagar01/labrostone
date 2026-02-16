import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import instance, { getImageUrl } from "./api/AxiosConfig";
import { Plus, Minus, Loader2 } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import "swiper/css";
import "swiper/css/navigation";

// Components
import ProductGallery from "../product/ProductGallery";
import ProductInfo from "../product/ProductInfo";
import ProductSidebar from "../product/ProductSidebar";
import Reviews from "../product/Reviews";
import { useRef } from "react";

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState("Product Description");
  const [openFaqIndex, setOpenFaqIndex] = useState(null);
  const [suggestedProducts, setSuggestedProducts] = useState([]);
  const swiperRef = useRef(null);

  const getCleanUrl = (img) => {
    if (!img) return "";
    return getImageUrl(img);
  };

  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        setLoading(true);
        const res = await instance.get(`/api/products/${id}`);
        const data = res.data.data;

        // --- IMAGE LOGIC ---
        const finalImages =
          data.images && data.images.length > 0
            ? data.images.map(getCleanUrl)
            : [getCleanUrl(data.thumbnail)];

        // --- PRICE & VARIANT MAPPING ---
        // Mapping your specific API fields (unitPrice, discountAmount)
        const formattedProduct = {
          ...data,
          images: finalImages,
          categoryName: data.category?.name || "Product",
          brandName: data.brand?.name || "LEBROSTONE",
          subtitle: data.sku || "Premium Quality",
          rating: 5.0, // Default if not in API
          reviewsCount: 270, // Placeholder as per screenshot style

          // Creating a variant from the main product data
          variants: [
            {
              id: data._id,
              size: `${data.unitPrice > 0 ? "Standard Pack" : "Default"}`,
              price: data.unitPrice,
              selling_price: data.unitPrice,
              mrp: data.unitPrice + (data.discountAmount || 0), // Assuming MRP = Price + Discount
              discount:
                data.discountType === "Percent"
                  ? `${data.discountAmount}% Off`
                  : `₹${data.discountAmount} Off`,
              usp: `₹${(data.unitPrice / 1).toFixed(2)} / ${data.unit || "unit"}`,
            },
          ],
          long_description: data.description, // HTML from API
          ingredientsList: [], // Map if available in your expanded API
          faqs: [],
          reviewsList: [],
        };

        setProduct(formattedProduct);
        setSelectedVariant(formattedProduct.variants[0]);
        
        // Fetch suggested products (same category or random)
        fetchSuggestedProducts(data.category?._id, data._id);
        
        setLoading(false);
      } catch (err) {
        console.error("Error fetching product:", err);
        setLoading(false);
      }
    };
    
    const fetchSuggestedProducts = async (categoryId, currentProductId) => {
      try {
        const res = await instance.get("/api/products");
        let products = res.data.data || [];
        // Filter out current product and take 8 random products
        products = products
          .filter(p => p._id !== currentProductId)
          .slice(0, 8);
        setSuggestedProducts(products);
      } catch (err) {
        console.error("Error fetching suggested products:", err);
      }
    };

    fetchProductDetails();
    window.scrollTo(0, 0);
  }, [id]);

  const toggleFaq = (index) =>
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  const createMarkup = (html) => ({ __html: html });

  if (loading)
    return (
      <div className="flex h-screen items-center justify-center bg-white">
        <Loader2 className="animate-spin text-[#00AFEF]" size={48} />
      </div>
    );

  if (!product)
    return <div className="text-center py-20">Product not found!</div>;

  const tabs = ["Product Description", "How to Use", "Key Ingredients"];

  return (
    <div className="font-sans text-[#212121] bg-white">
      {/* Breadcrumbs */}
      <div className="hidden md:flex max-w-[1280px] mx-auto px-4 py-3 text-[13px] text-gray-500 items-center gap-2">
        <a href="/" className="hover:text-[#00AFEF]">
          Home
        </a>
        <span>›</span>
        <span className="capitalize">{product.categoryName}</span>
        <span>›</span>
        <span className="text-gray-900 font-medium">{product.name}</span>
      </div>

      <main className="max-w-[1280px] mx-auto px-4 py-4 mb-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 relative">
          <div className="lg:col-span-9">
            <div className="flex flex-col lg:flex-row gap-8 mb-10">
              <div className="w-full lg:w-[55%]">
                <ProductGallery images={product.images} />
              </div>
              <div className="w-full lg:w-[45%]">
                <ProductInfo
                  product={product}
                  selectedVariant={selectedVariant}
                  setSelectedVariant={setSelectedVariant}
                />
              </div>
            </div>

            {/* Tab Section */}
            <div className="mb-12">
              <div className="flex border border-gray-200 rounded-md overflow-x-auto mb-8 no-scrollbar">
                {tabs.map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`flex-1 min-w-[150px] py-4 text-[15px] font-medium transition-all text-center border-r border-gray-200 last:border-r-0 ${
                      activeTab === tab
                        ? "bg-blue-50 text-[#00AFEF] border-b-2 border-b-[#00AFEF]"
                        : "bg-white text-gray-600"
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>

              <div className="min-h-[250px] py-4">
                {activeTab === "Product Description" && (
                  <div className="space-y-8 animate-in fade-in duration-300">
                    {/* Text Description */}
                    <div
                      className="text-gray-600 leading-relaxed text-lg"
                      dangerouslySetInnerHTML={createMarkup(
                        product.long_description,
                      )}
                    />

                    {/* --- Visual Images Section (Like Mamaearth) --- */}
                    <div className="mt-10 space-y-4">
                      <h3 className="text-2xl font-bold text-gray-800 border-l-4 border-[#00AFEF] pl-4">
                        About {product.name}
                      </h3>
                      <div className="flex flex-col gap-0 overflow-hidden rounded-xl shadow-sm border border-gray-100">
                        {product.images.map((img, idx) => (
                          <img
                            key={idx}
                            src={img}
                            alt={`${product.name} detail ${idx + 1}`}
                            className="w-full h-auto object-cover"
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* How to Use Tab */}
                {activeTab === "How to Use" && (
                  <div className="animate-in fade-in duration-300 p-6 bg-slate-50 rounded-xl">
                    <p className="text-gray-700">
                      Detailed usage instructions for {product.name} coming
                      soon.
                    </p>
                  </div>
                )}

                {/* Ingredients Tab */}
                {activeTab === "Key Ingredients" && (
                  <div className="animate-in fade-in duration-500">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="p-5 bg-[#F8FBFD] rounded-2xl border border-blue-100 flex items-center gap-4">
                        <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm">
                          🌿
                        </div>
                        <div>
                          <h4 className="font-bold uppercase text-sm">
                            Natural Extracts
                          </h4>
                          <p className="text-xs text-gray-500">
                            Pure ingredients sourced for {product.brandName}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Reviews Section */}
            <Reviews
              reviews={product.reviewsList}
              overallRating={product.rating}
              totalReviews={product.reviewsCount}
            />
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-3">
            <div className="sticky top-24">
              <ProductSidebar
                product={product}
                selectedVariant={selectedVariant}
                quantity={quantity}
                setQuantity={setQuantity}
              />
            </div>
          </div>
        </div>

        {/* Suggested Products Section */}
        {suggestedProducts.length > 0 && (
          <div className="mt-16 border-t border-gray-200 pt-12">
            <h2 className="text-2xl font-bold mb-8 text-center uppercase tracking-wider">
              You May Also Like
            </h2>
            
            <div className="relative px-4 md:px-12">
              {/* Navigation Buttons */}
              <button
                onClick={() => swiperRef.current?.slidePrev()}
                className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-gray-50 transition-colors"
              >
                <FaChevronLeft className="text-gray-600" />
              </button>
              <button
                onClick={() => swiperRef.current?.slideNext()}
                className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-gray-50 transition-colors"
              >
                <FaChevronRight className="text-gray-600" />
              </button>

              <Swiper
                modules={[Navigation]}
                spaceBetween={24}
                slidesPerView={2}
                onSwiper={(swiper) => (swiperRef.current = swiper)}
                breakpoints={{
                  640: { slidesPerView: 2 },
                  768: { slidesPerView: 3 },
                  1024: { slidesPerView: 4 },
                }}
                className="pb-4"
              >
                {suggestedProducts.map((item) => (
                  <SwiperSlide key={item._id}>
                    <div
                      className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-all cursor-pointer border border-gray-100 group"
                      onClick={() => navigate(`/product/${item._id}`)}
                    >
                      <div className="aspect-square overflow-hidden bg-gray-50">
                        <img
                          src={getCleanUrl(item.thumbnail || (item.images && item.images[0]))}
                          alt={item.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                      <div className="p-4">
                        <h3 className="font-bold text-sm mb-2 line-clamp-2 text-gray-900">{item.name}</h3>
                        <p className="text-gray-500 text-xs mb-2">{item.category?.name || item.brand?.name || "Product"}</p>
                        <div className="flex items-center justify-between">
                          <span className="text-[#00AFEF] font-bold">₹{item.unitPrice}</span>
                          {item.discountAmount > 0 && (
                            <span className="text-xs text-gray-400 line-through">₹{item.unitPrice + item.discountAmount}</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default ProductDetail;
