import React from 'react';

const OurStory = () => {
  const stories = [
    { 
      id: 1, 
      title: "Rooted in Ayurveda", 
      // Image: Herbs, mortar and pestle, or traditional ingredients
      image: "https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&q=80&w=600" 
    },
    { 
      id: 2, 
      title: "Clean & Conscious Beauty", 
      // Image: Clear serum bottles, water, or minimalist setup
      image: "https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?auto=format&fit=crop&q=80&w=600" 
    },
    { 
      id: 3, 
      title: "Backed by Research", 
      // Image: Laboratory aesthetic, glass droppers, or scientific setup
      image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=600" 
    },
    { 
      id: 4, 
      title: "Ethical & Sustainable", 
      // Image: Green leaves, recycled packaging, or nature
      image: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&q=80&w=600" 
    },
  ];

  return (
    <div className="py-20 bg-[#f9f9f9]">
      <div className="container mx-auto px-4">
        
        {/* HEADING */}
        <div className="text-center mb-16">
             <div className=" text-black py-3 px-12 md:px-24 ">
            <h2 className="text-lg md:text-2xl font-bold uppercase tracking-widest text-center">
              OUR STORY
            </h2>
          </div>
        </div>

        {/* GRID LAYOUT */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 px-4 md:px-0">
          {stories.map((item) => (
            <div key={item.id} className="flex flex-col items-center group cursor-pointer">
              
              {/* IMAGE CONTAINER */}
              <div className="relative w-full aspect-[4/5] overflow-hidden rounded-3xl mb-6 shadow-md transition-all duration-500 group-hover:shadow-2xl group-hover:-translate-y-2">
                <img 
                  src={item.image} 
                  alt={item.title} 
                  className="w-full h-full object-cover transition-transform duration-[1.5s] group-hover:scale-110"
                />
                {/* Subtle Overlay */}
                <div className="absolute inset-0 bg-black/5 group-hover:bg-transparent transition-colors duration-500"></div>
              </div>

              {/* TEXT */}
              <h3 className="text-xl font-bold text-gray-800 tracking-wide text-center group-hover:text-black transition-colors">
                {item.title}
              </h3>
              
              {/* Optional Decoration */}
              <p className="text-sm text-gray-500 mt-2 uppercase tracking-tighter opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                Explore More
              </p>
              
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};

export default OurStory;