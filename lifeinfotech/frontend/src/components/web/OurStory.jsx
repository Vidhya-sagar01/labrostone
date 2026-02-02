import React from 'react';

const OurStory = () => {
  // ✅ 100% Verified Live Images (Natural/Ayurveda Theme)
  const stories = [
    { 
      id: 1, 
      title: "Rooted in Ayurveda", 
      image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=600&q=80" 
    },
    { 
      id: 2, 
      title: "Clean & Conscious Beauty", 
      image: "https://images.unsplash.com/photo-1612817288484-6f916006741a?auto=format&fit=crop&w=600&q=80" 
    },
    { 
      id: 3, 
      title: "Backed by Research", 
      image: "https://images.unsplash.com/photo-1505944270255-bd2b88a4c915?auto=format&fit=crop&w=600&q=80" 
    },
    { 
      id: 4, 
      title: "Ethical & Sustainable", 
      image: "https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?auto=format&fit=crop&w=600&q=80" 
    },
  ];

  return (
    <div className="py-20 bg-white">
      <div className="container mx-auto px-4">
        
        {/* HEADING SECTION */}
        <div className="flex flex-col items-center mb-16 text-center">
           <h2 className="text-3xl md:text-5xl font-black text-slate-900 uppercase italic tracking-tighter">
             Our <span className="text-[#A88B56]">Story</span>
           </h2>
           <div className="h-1.5 w-24 bg-[#A88B56] mt-4 rounded-full"></div>
        </div>

        {/* GRID LAYOUT - Maine background color add kiya hai taaki agar image na dikhe toh box dikhe */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 max-w-7xl mx-auto px-6">
          {stories.map((item) => (
            <div key={item.id} className="flex flex-col items-center group">
              
              {/* IMAGE CONTAINER - Fixed Aspect Ratio */}
              <div className="relative w-full aspect-square overflow-hidden rounded-[3rem] mb-6 bg-slate-100 shadow-xl border border-slate-200">
                <img 
                  src={item.image} 
                  alt={item.title} 
                  className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                  onLoad={() => console.log(`Image ${item.id} loaded successfully`)}
                  onError={(e) => {
                    console.error(`Failed to load image ${item.id}`);
                    e.target.src = "https://via.placeholder.com/600?text=Lebrostone+Image";
                  }}
                />
                {/* Overlay for premium feel */}
                <div className="absolute inset-0 bg-black/5 group-hover:bg-transparent transition-all"></div>
              </div>

              {/* TITLE */}
              <h3 className="text-xl font-black text-slate-800 tracking-tight text-center uppercase italic group-hover:text-[#A88B56] transition-colors">
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