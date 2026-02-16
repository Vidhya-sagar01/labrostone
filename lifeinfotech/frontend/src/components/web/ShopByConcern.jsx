import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import { useNavigate } from "react-router-dom";

const concerns = [
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

const ingredients = [
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
    <div className=" text-black py-3 px-12 md:px-24 ">
      <h2 className="text-lg md:text-2xl font-bold uppercase tracking-[0.2em] text-center">
        {title}
      </h2>
    </div>
  </div>
);

const ShopByConcern = () => {
  const navigate = useNavigate();

  return (
    <div className="py-10 md:py-16 bg-white px-4 md:px-8 overflow-hidden">
      {/* Shop By Concern Section */}
      <div className="max-w-7xl mx-auto mb-10 md:mb-16">
        <div className="flex justify-center mb-6 md:mb-10">
          <div className="text-black py-3 px-12 md:px-24">
            <h2 className="text-lg md:text-2xl font-bold uppercase tracking-[0.2em] text-center">
              Shop By Concern
            </h2>
          </div>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4 md:gap-6 mt-8">
          {concerns.map((item, index) => (
            <div
              key={index}
              className="flex flex-col items-center group cursor-pointer"
              onClick={() => navigate(`/shop/concern/${item.title}`)}
            >
              <div className="w-full aspect-square overflow-hidden rounded-2xl border border-gray-100 shadow-sm transition-transform duration-300 group-hover:scale-105">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <p className="mt-4 text-xs md:text-sm font-semibold text-gray-700 uppercase tracking-wide">
                {item.title}
              </p>
            </div>
          ))}
        </div>
      </div>
      <div className="w-full h-fit md:h-80 rounded-[2rem] overflow-hidden mb-10 md:mb-16">
        <div className="w-full h-full rounded-xl bg-[url('/banner-ls.jpg')] bg-cover bg-center bg-no-repeat">
          <div className="flex flex-col p-8 md:p-20 text-white text-xs md:text-base font-bold uppercase tracking-wide">
            <h1 className="text-2xl font-bold">Natural Ayurvedic Wellness</h1>
            <p className="text-sm md:text-base font-normal tracking-wide">
              Pure herbal solutions for immunity, skin care, hair growth &
              complete daily health.
            </p>
          </div>
        </div>
      </div>
      {/* Shop By Ingredients Section */}
      <div className="max-w-7xl mx-auto mt-10">
        <SectionHeader title="Shop By Ingredients" />
        <div className="mt-10 relative">
          <Swiper
            modules={[Autoplay]}
            autoplay={{
              delay: 1000,
              disableOnInteraction: false,
            }}
            spaceBetween={20}
            slidesPerView={1.5}
            pagination={{ clickable: true, el: ".custom-pagination" }}
            breakpoints={{
              640: { slidesPerView: 2.5 },
              768: { slidesPerView: 3.5 },
              1024: { slidesPerView: 5.2 },
            }}
            className="pb-16"
          >
            {ingredients.map((item, index) => (
              <SwiperSlide key={index}>
                <div
                  className="relative aspect-square overflow-hidden rounded-3xl group cursor-pointer border border-gray-100 shadow-md"
                  onClick={() => navigate(`/shop/ingredient/${item.title}`)}
                >
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  {/* Overlay for text */}
                  <div className="absolute inset-x-0 bottom-0 bg-linear-to-t from-black/70 to-transparent p-4">
                    <p className="text-white text-sm md:text-base font-bold uppercase tracking-wide">
                      {item.title}
                    </p>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>

          {/* Custom Pagination Container */}
          <div className="custom-pagination flex justify-center gap-2 -mt-8"></div>
        </div>
      </div>

      <style jsx>{`
        .custom-pagination :global(.swiper-pagination-bullet) {
          width: 8px;
          height: 8px;
          background-color: #d1d5db;
          opacity: 1;
        }
        .custom-pagination :global(.swiper-pagination-bullet-active) {
          background-color: #1a1a1a;
          width: 12px;
          border-radius: 4px;
        }
      `}</style>
    </div>
  );
};

export default ShopByConcern;
