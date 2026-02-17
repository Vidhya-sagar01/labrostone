import React from "react";

const TrustedBar = () => {
  const items = [
    {
      image:
        "https://mantraherbal.in/cdn/shop/files/Artboard_1.png?v=1754030614&width=180",
    },
    {
      image:
        "https://mantraherbal.in/cdn/shop/files/Artboard_4.png?v=1754030614&width=180",
    },
    {
      image:
        "https://mantraherbal.in/cdn/shop/files/Artboard_6.png?v=1754030614&width=180",
    },
    {
      image:
        "https://mantraherbal.in/cdn/shop/files/Artboard_2.png?v=1754030614&width=180",
    },
    {
      image:
        "https://mantraherbal.in/cdn/shop/files/Artboard_10.png?v=1754030614&width=180",
    },
    {
      image:
        "https://mantraherbal.in/cdn/shop/files/Artboard_3.png?v=1754030614&width=180",
    },
    {
      image:
        "https://mantraherbal.in/cdn/shop/files/Artboard_8.png?v=1754030614&width=180",
    },
    {
      image:
        "https://mantraherbal.in/cdn/shop/files/Artboard_1.png?v=1754030614&width=180",
    },
    {
      image:
        "https://mantraherbal.in/cdn/shop/files/Artboard_1.png?v=1754030614&width=180",
    },
    {
      image:
        "https://mantraherbal.in/cdn/shop/files/Artboard_9.png?v=1754030614&width=180",
    },
  ];

  return (
    <section className="py-10 md:py-16 bg-white overflow-hidden">
      <div className="flex justify-center mb-6 md:mb-10">
        <div className="text-black py-3 px-12 md:px-24">
          <h2 className="text-lg md:text-2xl font-bold uppercase tracking-[0.2em] text-center">
            Our Trusted Partners
          </h2>
        </div>
      </div>
      <div className="flex flex-wrap justify-center items-center gap-4 md:gap-8 px-4 opacity-70 grayscale hover:grayscale-0 transition-all">
        {items.map((item, index) => (
          <div
            className="w-12  md:w-24 aspect-square flex items-center justify-center"
            key={index}
          >
            <img
              className="h-full w-full object-cover"
              src={item.image}
              alt=""
            />
          </div>
        ))}
      </div>
    </section>
  );
};

export default TrustedBar;
