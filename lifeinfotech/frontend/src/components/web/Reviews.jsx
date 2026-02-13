import React, { useEffect, useState } from "react";
import { Star } from "lucide-react";

const Reviews = () => {
  const API_BASE_URL =
    "https://lebrostonebackend.lifeinfotechinstitute.com";

  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/reviews/all`);
        const data = await res.json();

        // Only active reviews
        const activeReviews = data.filter((r) => r.status === true);
        setReviews(activeReviews);
      } catch (err) {
        console.error("Review fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, []);

  const getImageUrl = (imagePath) => {
    if (!imagePath) return "";
    if (imagePath.startsWith("http")) return imagePath;
    return `${API_BASE_URL}${imagePath}`;
  };

  if (loading)
    return (
      <div className="py-20 text-center font-semibold">
        Loading Reviews...
      </div>
    );

  if (!reviews.length) return null;

  return (
    <div className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4">

        <h2 className="text-3xl md:text-4xl font-black text-center mb-14 uppercase tracking-widest">
          Customer Reviews
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {reviews.map((review) => (
            <div
              key={review._id}
              className="bg-white rounded-3xl shadow-md p-6 hover:shadow-xl transition"
            >
              {/* Customer Image */}
              <div className="w-20 h-20 mx-auto mb-4 rounded-full overflow-hidden">
                <img
                  src={getImageUrl(review.customerImage)}
                  alt={review.customerName}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Rating */}
              <div className="flex justify-center gap-1 mb-3">
                {[...Array(review.rating)].map((_, i) => (
                  <Star
                    key={i}
                    size={16}
                    fill="#fbbf24"
                    className="text-yellow-400"
                  />
                ))}
              </div>

              {/* Comment */}
              <p className="text-sm text-gray-600 text-center italic mb-4">
                "{review.comment}"
              </p>

              {/* Name */}
              <h3 className="text-center font-bold text-sm uppercase tracking-wide">
                {review.customerName}
              </h3>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Reviews;
