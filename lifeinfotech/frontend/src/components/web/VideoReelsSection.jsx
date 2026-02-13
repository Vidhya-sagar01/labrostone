import React, { useRef, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
import { FaStar, FaChevronLeft, FaChevronRight, FaPlay } from "react-icons/fa";
import "swiper/css";
import "swiper/css/navigation";

const videoData = [
  {
    id: 1,
    videoUrl: "https://www.pexels.com/download/video/19227362/",
    thumbnail: "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=400&h=700&fit=crop",
    name: "Sarah M.",
    text: "Game changer for my acne-prone skin!",
  },
  {
    id: 2,
    videoUrl: "https://www.pexels.com/download/video/19164356/",
    thumbnail: "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=400&h=700&fit=crop",
    name: "Emily R.",
    text: "My skin has never looked better.",
  },
  {
    id: 3,
    videoUrl: "https://www.pexels.com/download/video/19164356/",
    thumbnail: "https://images.unsplash.com/photo-1552693673-1bf958298935?w=400&h=700&fit=crop",
    name: "Jessica K.",
    text: "Hydrated, glowing skin all day long!",
  },
  {
    id: 4,  
    videoUrl: "https://www.pexels.com/download/video/19164356/",
    thumbnail: "https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?w=400&h=700&fit=crop",
    name: "Amanda L.",
    text: "Soothes and hydrates perfectly.",
  },
  {
    id: 5,
    videoUrl: "https://www.pexels.com/download/video/19164356/",
    thumbnail: "https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?w=400&h=700&fit=crop",
    name: "Lisa W.",
    text: "My holy grail skincare product!",
  },
];

const VideoReelCard = ({ video }) => {
  const [isHovered, setIsHovered] = useState(false);
  const videoRef = useRef(null);

  const handleMouseEnter = () => {
    setIsHovered(true);
    if (videoRef.current) {
      videoRef.current.play();
    }
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
  };

  return (
    <div
      className="relative aspect-[9/16] rounded-2xl overflow-hidden group/card shadow-2xl cursor-pointer"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Video Element */}
      <video
        ref={videoRef}
        src={video.videoUrl}
        poster={video.thumbnail}
        className="absolute inset-0 w-full h-full object-cover"
        loop
        muted
        playsInline
      />

      {/* Play Icon Overlay (shows when not hovering) */}
      {!isHovered && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/20 transition-opacity duration-300">
          <div className="w-16 h-16 rounded-full bg-white/90 flex items-center justify-center shadow-lg">
            <FaPlay className="text-black ml-1" size={24} />
          </div>
        </div>
      )}

      {/* Bottom linear Overlay */}
      <div className="absolute inset-x-0 bottom-0 h-1/3 bg-linear-to-t from-black/90 via-black/50 to-transparent flex flex-col justify-end p-5">
        {/* Star Rating */}
        <div className="flex items-center gap-1 mb-2">
          {[...Array(5)].map((_, i) => (
            <FaStar key={i} className="text-yellow-400" size={12} />
          ))}
        </div>

        {/* Name */}
        <h3 className="text-white font-bold text-sm mb-1">{video.name}</h3>

        {/* Short Text */}
        <p className="text-white/90 text-xs leading-relaxed">{video.text}</p>
      </div>
    </div>
  );
};

const VideoReelsSection = () => {
  const swiperRef = useRef(null);

  return (
    <section className="py-16 px-4 bg-linear-to-b from-gray-50 to-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
            Customer Love
          </h2>
          <p className="text-gray-600 text-sm md:text-base">
            See what our customers are saying
          </p>
        </div>

        {/* Slider Container */}
        <div className="relative group px-4 md:px-8">
          <Swiper
            modules={[Navigation, Autoplay]}
            spaceBetween={20}
            slidesPerView={2}
            onSwiper={(swiper) => (swiperRef.current = swiper)}
            loop={true}
            autoplay={{
              delay: 5000,
              disableOnInteraction: false,
            }}
            breakpoints={{
              640: { slidesPerView: 2, spaceBetween: 20 },
              768: { slidesPerView: 3, spaceBetween: 24 },
              1024: { slidesPerView: 4, spaceBetween: 24 },
              1280: { slidesPerView: 5, spaceBetween: 28 },
            }}
            className="pb-8"
          >
            {videoData.map((video) => (
              <SwiperSlide key={video.id}>
                <VideoReelCard video={video} />
              </SwiperSlide>
            ))}
          </Swiper>

          {/* Navigation Buttons */}
          <button
            onClick={() => swiperRef.current?.slidePrev()}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-2 md:-translate-x-4 z-20 w-12 h-12 rounded-full bg-white shadow-2xl flex items-center justify-center text-gray-600 hover:text-black hover:bg-gray-100 transition-all opacity-0 group-hover:opacity-100"
            aria-label="Previous"
          >
            <FaChevronLeft size={18} />
          </button>
          <button
            onClick={() => swiperRef.current?.slideNext()}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-2 md:translate-x-4 z-20 w-12 h-12 rounded-full bg-white shadow-2xl flex items-center justify-center text-gray-600 hover:text-black hover:bg-gray-100 transition-all opacity-0 group-hover:opacity-100"
            aria-label="Next"
          >
            <FaChevronRight size={18} />
          </button>
        </div>

        {/* View All Button */}
        <div className="flex justify-center mt-12">
          <button className="group relative px-8 py-3 bg-black text-white font-semibold rounded-full hover:bg-gray-900 transition-all duration-300 shadow-lg hover:shadow-xl overflow-hidden">
            <span className="relative z-10">View All Reviews</span>
            <div className="absolute inset-0 bg-linear-to-r from-gray-800 to-black opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </button>
        </div>
      </div>
    </section>
  );
};

export default VideoReelsSection;