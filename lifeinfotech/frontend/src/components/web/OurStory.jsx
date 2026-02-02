import React from 'react';

const OurStory = () => {
  const stories = [
    { 
      id: 1, 
      title: "Rooted in Ayurveda", 
      image: "/banar/story1.jpg" // Image path
    },
    { 
      id: 2, 
      title: "Clean & Conscious Beauty", 
      image: "/banar/story2.jpg" 
    },
    { 
      id: 3, 
      title: "Backed by Research", 
      image: "/banar/story3.jpg" 
    },
    { 
      id: 4, 
      title: "Ethical & Sustainable", 
      image: "/banar/story0.jpg" 
    },
  ];

  return (
    <div className="py-16 bg-white">
      <div className="container mx-auto px-4">
        
        {/* HEADING */}
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-12 text-black uppercase tracking-widest">
          Our Story
        </h2>

        {/* GRID LAYOUT */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 px-4 md:px-0">
          {stories.map((item) => (
            <div key={item.id} className="flex flex-col items-center group cursor-pointer">
              
              {/* IMAGE CONTAINER */}
              <div className="w-full aspect-square overflow-hidden rounded-2xl mb-4 shadow-sm">
                <img 
                  src={item.image} 
                  alt={item.title} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
              </div>

              {/* TEXT */}
              <h3 className="text-lg font-semibold text-gray-900 tracking-wide text-center">
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