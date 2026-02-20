import React, { useState, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import { useNavigate } from "react-router-dom";
import instance, { getImageUrl } from "./api/AxiosConfig";

const defaultConcerns = [
  {
    title: "Acne",
    image:
      "https://dr.rashel.in/cdn/shop/collections/Dr.Rashel_Acne.jpg?v=1759745165&width=400",
  },
  {
    title: "Black Heads",
    image:
      "https://dr.rashel.in/cdn/shop/collections/blackheads_nose.png?v=1750921936&width=400",
  },
  {
    title: "Tanning",
    image:
      "https://dr.rashel.in/cdn/shop/collections/Dr.Rashel_Tann_Skin.jpg?v=1759746391&width=400",
  },
  {
    title: "Dry Skin",
    image:
      "https://dr.rashel.in/cdn/shop/collections/Dr.Rashel_Dry_Skin.jpg?v=1759746209&width=400",
  },
  {
    title: "Wrinkles",
    image:
      "https://dr.rashel.in/cdn/shop/collections/Dr.Rashel_Wrinkles.jpg?v=1759745336&width=400",
  },
  {
    title: "Oily Skin",
    image:
      "https://dr.rashel.in/cdn/shop/collections/Dr.Rashel_Oily_Skin.jpg?v=1759746033&width=400",
  },
];

const defaultIngredients = [
  {
    title: "Rice Water",
    image:
      "https://dr.rashel.in/cdn/shop/collections/Website_Ingrident-03.jpg?v=1759903135&width=600",
  },
  {
    title: "Charcoal",
    image:
      "https://dr.rashel.in/cdn/shop/collections/Rice_Water_Products_11zon.jpg?v=1759902898&width=600",
  },
  {
    title: "Vitamin C",
    image:
      "https://dr.rashel.in/cdn/shop/collections/Charcoal_Skincare_Products.jpg?v=1759902696&width=600",
  },
  {
    title: "Aloe Vera",
    image:
      "https://dr.rashel.in/cdn/shop/collections/vitamin_c_e05f41b5-2e0d-4e03-b9a2-34034460bc90.jpg?v=1759902609&width=600",
  },
  {
    title: "Ubtan",
    image:
      "https://dr.rashel.in/cdn/shop/collections/Ubtan_Collection.jpg?v=1759903025&width=600",
  },
  {
    title: "Coffee",
    image:
      "https://dr.rashel.in/cdn/shop/collections/Website_Ingrident-04.jpg?v=1759903258&width=600",
  },
];

const SectionHeader = ({ title }) => (
  <div className="flex justify-center mb-10">
    <h2 className="text-lg md:text-2xl font-bold uppercase tracking-[0.2em] text-center">
      {title}
    </h2>
  </div>
);

const ShopByConcern = () => {
  const navigate = useNavigate();
  const [concerns, setConcerns] = useState([]);
  const [ingredients, setIngredients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [offerBanner, setOfferBanner] = useState(null);

  useEffect(() => {
    fetchConcerns();
    fetchIngredients();
    fetchOfferBanner();
  }, []);

  const fetchConcerns = async () => {
    try {
      const res = await instance.get("/api/concerns");
      if (res.data.success && res.data.data.length > 0) {
        setConcerns(res.data.data);
      } else {
        setConcerns(defaultConcerns);
      }
    } catch (err) {
      console.error("Error fetching concerns:", err);
      setConcerns(defaultConcerns);
    }
  };

  const fetchIngredients = async () => {
    try {
      const res = await instance.get("/api/ingredients");
      if (res.data.success && res.data.data.length > 0) {
        setIngredients(res.data.data);
      } else {
        setIngredients(defaultIngredients);
      }
    } catch (err) {
      console.error("Error fetching ingredients:", err);
      setIngredients(defaultIngredients);
    } finally {
      setLoading(false);
    }
  };

  const fetchOfferBanner = async () => {
    try {
      const res = await instance.get("/api/offer-content/type/offerBanner");
      if (res.data.success && res.data.data) {
        setOfferBanner(res.data.data);
      }
    } catch (err) {
      console.error("Error fetching offer banner:", err);
    }
  };

  const getConcernImage = (concern) => {
    if (concern.image) {
      return getImageUrl(concern.image);
    }
    // Match by title to default concerns for fallback
    const matched = defaultConcerns.find(
      (c) => c.title.toLowerCase() === concern.title.toLowerCase()
    );
    return matched?.image || defaultConcerns[0]?.image || "";
  };

  const getIngredientImage = (ingredient) => {
    if (ingredient.image) {
      return getImageUrl(ingredient.image);
    }
    // Match by title to default ingredients for fallback
    const matched = defaultIngredients.find(
      (i) => i.title.toLowerCase() === ingredient.title.toLowerCase()
    );
    return matched?.image || defaultIngredients[0]?.image || "";
  };

  return (
    <div className="py-10 md:py-16 bg-white px-4 md:px-8 overflow-hidden">
      {/* ================= SHOP BY CONCERN ================= */}
      <div className="max-w-7xl mx-auto mb-10 md:mb-16">
        <SectionHeader title="Shop By Concern" />

        {!loading && concerns.length > 0 ? (
          <Swiper
            modules={[Autoplay]}
            autoplay={{ delay: 3000, disableOnInteraction: false }}
            loop={true}
            spaceBetween={20}
            slidesPerView={3}
            breakpoints={{
              640: { slidesPerView: 2.5 },
              768: { slidesPerView: 3.5 },
              1024: { slidesPerView: 6 },
            }}
          >
            {concerns.map((item, index) => (
              <SwiperSlide key={item._id || index}>
                <div
                  onClick={() => navigate(`/shop/concern/${item.title}`)}
                  className="flex flex-col items-center group cursor-pointer"
                >
                  <div className="w-full aspect-square overflow-hidden rounded-2xl border border-gray-100 shadow-sm transition-transform duration-300 group-hover:scale-105">
                    <img
                      src={getConcernImage(item)}
                      alt={item.title}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <p className="mt-4 text-xs md:text-sm font-semibold text-gray-700 uppercase tracking-wide text-center">
                    {item.title}
                  </p>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        ) : (
          <Swiper
            modules={[Autoplay]}
            autoplay={{ delay: 3000, disableOnInteraction: false }}
            loop={true}
            spaceBetween={20}
            slidesPerView={3}
            breakpoints={{
              640: { slidesPerView: 2.5 },
              768: { slidesPerView: 3.5 },
              1024: { slidesPerView: 6 },
            }}
          >
            {defaultConcerns.map((item, index) => (
              <SwiperSlide key={index}>
                <div
                  onClick={() => navigate(`/shop/concern/${item.title}`)}
                  className="flex flex-col items-center group cursor-pointer"
                >
                  <div className="w-full aspect-square overflow-hidden rounded-2xl border border-gray-100 shadow-sm transition-transform duration-300 group-hover:scale-105">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <p className="mt-4 text-xs md:text-sm font-semibold text-gray-700 uppercase tracking-wide text-center">
                    {item.title}
                  </p>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        )}
      </div>

      {/* ================= BANNER ================= */}
      {offerBanner && offerBanner.status ? (
        <div 
          className="w-full md:h-80 rounded-[2rem] overflow-hidden mb-10 md:mb-16 cursor-pointer"
          onClick={() => offerBanner.productId ? navigate(`/product/${offerBanner.productId._id}`) : null}
        >
          {offerBanner.image ? (
            <div 
              className="w-full h-full bg-cover bg-center"
              style={{ backgroundImage: `url(${getImageUrl(offerBanner.image)})` }}
            >
              <div className="p-8 md:p-20 text-white">
                <h1 className="text-2xl font-bold">
                  {offerBanner.title || 'Natural Ayurvedic Wellness'}
                </h1>
                <p className="text-sm md:text-base">
                  {offerBanner.description || 'Pure herbal solutions for immunity, skin care, hair growth & complete daily health.'}
                </p>
              </div>
            </div>
          ) : (
            <div className="w-full h-full bg-[#A88B56] flex items-center">
              <div className="p-8 md:p-20 text-white">
                <h1 className="text-2xl font-bold">
                  {offerBanner.title || 'Natural Ayurvedic Wellness'}
                </h1>
                <p className="text-sm md:text-base">
                  {offerBanner.description || 'Pure herbal solutions for immunity, skin care, hair growth & complete daily health.'}
                </p>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="w-full md:h-80 rounded-[2rem] overflow-hidden mb-10 md:mb-16">
          <div className="w-full h-full bg-[url('/banner-ls.jpg')] bg-cover bg-center">
            <div className="p-8 md:p-20 text-white">
              <h1 className="text-2xl font-bold">
                Natural Ayurvedic Wellness
              </h1>
              <p className="text-sm md:text-base">
                Pure herbal solutions for immunity, skin care, hair growth &
                complete daily health.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ================= INGREDIENTS ================= */}
      {/* <div className="max-w-7xl mx-auto mt-10">
        <SectionHeader title="Shop By Ingredients" />

        {!loading && ingredients.length > 0 ? (
          <Swiper
            modules={[Autoplay]}
            autoplay={{ delay: 3000, disableOnInteraction: false }}
            loop={true}
            spaceBetween={20}
            slidesPerView={3}
            breakpoints={{
              640: { slidesPerView: 2.5 },
              768: { slidesPerView: 3.5 },
              1024: { slidesPerView: 5.2 },
            }}
          >
            {ingredients.map((item, index) => (
              <SwiperSlide key={item._id || index}>
                <div
                  onClick={() => navigate(`/shop/ingredient/${item.title}`)}
                  className="relative aspect-square overflow-hidden rounded-3xl border shadow-md cursor-pointer"
                >
                  <img
                    src={getIngredientImage(item)}
                    alt={item.title}
                    className="w-full h-full object-cover"
                  />

                  <div className="absolute bottom-0 w-full bg-black/60 p-3">
                    <p className="white text-sm font-bold uppercase text-center">
                      {item.title}
                    </p>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        ) : (
          <Swiper
            modules={[Autoplay]}
            autoplay={{ delay: 3000, disableOnInteraction: false }}
            loop={true}
            spaceBetween={20}
            slidesPerView={3}
            breakpoints={{
              640: { slidesPerView: 2.5 },
              768: { slidesPerView: 3.5 },
              1024: { slidesPerView: 5.2 },
            }}
          >
            {defaultIngredients.map((item, index) => (
              <SwiperSlide key={index}>
                <div
                  onClick={() => navigate(`/shop/ingredient/${item.title}`)}
                  className="relative aspect-square overflow-hidden rounded-3xl border shadow-md cursor-pointer"
                >
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover"
                  />

                  <div className="absolute bottom-0 w-full bg-black/60 p-3">
                    <p className="white text-sm font-bold uppercase text-center">
                      {item.title}
                    </p>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        )}
      </div> */}
    </div>
  );
};

export default ShopByConcern;
