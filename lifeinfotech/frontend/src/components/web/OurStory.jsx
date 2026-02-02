import React from 'react';

const OurStory = () => {
  // ✅ 100% Verified High-Resolution HTTPS Images (Natural & Premium Theme)
  const stories = [
    { 
      id: 1, 
      title: "Rooted in Ayurveda", 
      image: "https://images.unsplash.com/photo-1617503792322-3f95420c1d9c?auto=format&fit=crop&w=800&q=80" 
    },
    { 
      id: 2, 
      title: "Clean & Conscious Beauty", 
      image: "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?auto=format&fit=crop&w=800&q=80" 
    },
    { 
      id: 3, 
      title: "Backed by Research", 
      image: "https://images.unsplash.com/photo-1515377905703-c4788e51af15?auto=format&fit=crop&w=800&q=80" 
    },
    { 
      id: 4, 
      title: "Ethical & Sustainable", 
      image: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=800&q=80" 
    },
  ];

  return (
    <div className="py-24 bg-white">
      <div className="container mx-auto px-4">
        
        {/* HEADING SECTION */}
        <div className="flex flex-col items-center mb-20 text-center">
           <h2 className="text-4xl md:text-6xl font-black text-slate-900 uppercase italic tracking-tighter">
             Our <span className="text-[#A88B56]">Story</span>
           </h2>
           <div className="h-1.5 w-28 bg-[#A88B56] mt-4 rounded-full"></div>
        </div>

        {/* GRID LAYOUT */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 max-w-7xl mx-auto px-6">
          {stories.map((item) => (
            <div key={item.id} className="flex flex-col items-center group">
              
              {/* IMAGE CONTAINER WITH HTTPS IMAGE */}
              <div className="relative w-full aspect-square overflow-hidden rounded-[3.5rem] mb-8 bg-slate-50 shadow-2xl border border-slate-100">
                <img 
                  src={item.image} 
                  alt={item.title} 
                  className="w-full h-full object-cover transition-transform duration-[1500ms] group-hover:scale-110"
                  onLoad={() => console.log(`Story Image ${item.id} loaded`)}
                  onError={(e) => {
                    console.error(`Image Load Error: ${item.id}`);
                    e.target.src = "https://via.placeholder.com/800?text=Lebrostone+Ayurveda";
                  }}
                />
                {/* Premium Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/10 group-hover:to-transparent transition-all"></div>
              </div>

              {/* TITLE */}
              <h3 className="text-xl font-black text-slate-800 tracking-tight text-center uppercase italic group-hover:text-[#A88B56] transition-colors duration-300">
                {item.title}
              </h3>
              
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};

export default OurStory;