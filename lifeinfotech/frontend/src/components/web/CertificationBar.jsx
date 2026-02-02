import React from 'react';

const CertificationBar = () => {
  // --- UPDATED DATA WITH YOUR PATH ---
  const certifications = [
    { id: 1, name: "Baidyanath Research", img: "/certified/Artboard_2.png" }, // Aapka path
    { id: 2, name: "WHO-GMP Certified", img: "/certified/Artboard_3.png" }, // Example for other images
    { id: 3, name: "Recyclable Packaging", img: "/certified/Artboard_4.png" },
    { id: 4, name: "PETA Approved", img: "/certified/Artboard_5.png" },
    { id: 5, name: "Cruelty Free", img: "/certified/Artboard_6.png" },
    { id: 6, name: "100% Vegetarian", img: "/certified/Artboard_7.png" },
    { id: 7, name: "Clean Beauty", img: "/certified/Artboard_8.png" },
    { id: 8, name: "Ethically Sourced", img: "/certified/Artboard_9.png" },
    { id: 9, name: "pH Balanced", img: "/certified/Artboard_10.png" },
  ];

  return (
    <div className="py-12 bg-white border-t border-gray-100">
      <div className="container mx-auto px-4 text-center">
        
        <h2 className="text-xl md:text-2xl font-bold mb-10 uppercase tracking-[0.2em] text-black">
          Trusted. Certified. Ethical.
        </h2>

        <div className="flex flex-wrap justify-center items-center gap-6 md:gap-10">
          {certifications.map((cert) => (
            <div 
              key={cert.id} 
              className="w-[80px] md:w-[110px] bg-[#f5f5f5] p-4 rounded-xl flex flex-col items-center justify-center aspect-square grayscale hover:grayscale-0 transition-all duration-300"
            >
              <img 
                src={cert.img} 
                alt={cert.name} 
                className="max-h-full w-auto object-contain"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CertificationBar;