import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { Plus, Minus, Loader2 } from "lucide-react";

// Components
import ProductGallery from "../product/ProductGallery";
import ProductInfo from "../product/ProductInfo";
import ProductSidebar from "../product/ProductSidebar";
import Reviews from "../product/Reviews";

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState("Product Description");
  const [openFaqIndex, setOpenFaqIndex] = useState(null);

  const isLocal =
    window.location.hostname === "localhost" ||
    window.location.hostname === "127.0.0.1";
  const API_BASE = "https://lebrostonebackend.lifeinfotechinstitute.com";

  const getCleanUrl = (img) => {
    if (!img) return "";
    if (img.startsWith("http")) return img;
    // Removing leading slash if present to avoid double slashes
    let cleanPath = img.startsWith("/") ? img.substring(1) : img;
    return `${API_BASE}/${cleanPath}`;
  };

  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`${API_BASE}/api/products/${id}`);
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
        setLoading(false);
      } catch (err) {
        console.error("Error fetching product:", err);
        setLoading(false);
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
      </main>
    </div>
  );
};

export default ProductDetail;
