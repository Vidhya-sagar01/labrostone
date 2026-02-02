import React, { useEffect, useRef } from 'react';

const Blogs = () => {
  const blogData = [
    {
      id: 1,
      title: "WHY WARM OIL MASSAGE IS ESSENTIAL FOR WINTER WELLNESS",
      excerpt: "Winter often brings more than just cold weather, it also triggers joint pain, muscle stiffness, body fatigue, and dryness, especially in ...",
      image: "/blog/blog0.jpg"
    },
    {
      id: 2,
      title: "WHY KUMKUMADI SERUM IS A WINTER SKINCARE ESSENTIAL FOR DEEP HYDRATION & GLOW",
      excerpt: "As the temperatures drop, our skin tends to lose moisture, making it drier, duller, and a bit more...",
      image: "/blog/blog1.jpg"
    },
    {
      id: 3,
      title: "GULAB ARKA INDIAN ROSE WATER: THE TIMELESS SKINCARE SECRET YOU NEED TODAY",
      excerpt: "Skincare trends change with every season. One day its serums packed with exotic actives, the next its masks with unheard-of superfoods. Y...",
      image: "/blog/blog2.jpg"
    }
  ];

  // CHANGE 1: 'isVisible' wali line hata di kyunki uski zaroorat nahi hai
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          // Jab section dikhega, tab ye classes add hongi
          entry.target.classList.add('opacity-100', 'translate-y-0');
          entry.target.classList.remove('opacity-0', 'translate-y-20');
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div className="py-20 bg-white overflow-hidden">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-16 uppercase tracking-widest text-black">
          Blogs
        </h2>

        {/* Blog Grid with Slide-up Animation */}
        <div 
          ref={sectionRef}
          // Default state: opacity-0 aur niche (translate-y-20)
          className="grid grid-cols-1 md:grid-cols-3 gap-10 transition-all duration-1000 ease-out opacity-0 translate-y-20"
        >
          {blogData.map((blog) => (
            <div key={blog.id} className="group cursor-pointer">
              
              <div className="rounded-2xl overflow-hidden mb-6 h-[250px] shadow-sm">
                <img 
                  src={blog.image} 
                  alt={blog.title} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </div>

              <div className="space-y-4 px-2">
                <h3 className="text-lg font-bold leading-tight text-black group-hover:text-[#A88B56] transition-colors uppercase">
                  {blog.title}
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed line-clamp-3">
                  {blog.excerpt}
                </p>
              </div>

            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Blogs;