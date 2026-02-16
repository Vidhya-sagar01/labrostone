import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Calendar, User } from "lucide-react";
import instance, { getImageUrl } from "./api/AxiosConfig";
import Navbar from "./comman/Navbar";
import Footer from "./comman/Footer";

const BlogDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const getBlogImageUrl = (url) => {
    if (!url) return "https://via.placeholder.com/800x400?text=Blog";
    return getImageUrl(url) || "https://via.placeholder.com/800x400?text=Blog";
  };

  useEffect(() => {
    const fetchBlogDetail = async () => {
      try {
        setLoading(true);
        const res = await instance.get(`/api/blogs/${id}`);
        
        if (res.data.success && res.data.data) {
          setBlog(res.data.data);
        } else {
          throw new Error("Blog not found");
        }
      } catch (err) {
        console.error("Blog Detail Fetch Error:", err);
        setError(err.response?.data?.message || "Failed to load blog");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchBlogDetail();
    }
    window.scrollTo(0, 0);
  }, [id]);

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const createMarkup = (html) => {
    if (!html) return { __html: "" };
    return { __html: html };
  };

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <div className="flex-grow flex items-center justify-center bg-gray-50">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#00a688]"></div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !blog) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <div className="flex-grow flex items-center justify-center bg-gray-50">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Blog Not Found</h2>
            <p className="text-gray-600 mb-6">{error || "The blog you're looking for doesn't exist."}</p>
            <button
              onClick={() => navigate("/blogs")}
              className="bg-[#00a688] text-white px-6 py-2 rounded-lg hover:bg-[#008d74] transition-colors"
            >
              Back to Blogs
            </button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Navbar />
      
      <main className="flex-grow">
        <div className="max-w-4xl mx-auto px-4 pt-6">
          <button
            onClick={() => navigate("/blogs")}
            className="flex items-center gap-2 text-gray-600 hover:text-[#00a688] transition-colors"
          >
            <ArrowLeft size={20} />
            <span className="font-medium">Back to Blogs</span>
          </button>
        </div>

        <article className="max-w-4xl mx-auto px-4 py-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6 leading-tight">
            {blog.title}
          </h1>

          <div className="flex flex-wrap items-center gap-6 mb-8 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <User size={16} className="text-[#00a688]" />
              <span className="font-medium">{blog.author || "Admin"}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar size={16} className="text-[#00a688]" />
              <span>{formatDate(blog.createdAt)}</span>
            </div>
          </div>

          <div className="rounded-2xl overflow-hidden mb-8 shadow-lg">
            <img
              src={getBlogImageUrl(blog.image)}
              alt={blog.title}
              className="w-full h-auto max-h-[500px] object-cover"
            />
          </div>

          {blog.shortDescription && (
            <div className="bg-gray-50 border-l-4 border-[#00a688] p-6 mb-8 rounded-r-lg">
              <p className="text-lg text-gray-700 font-medium italic leading-relaxed">
                {blog.shortDescription}
              </p>
            </div>
          )}

          <div 
            className="prose prose-lg max-w-none text-gray-700 leading-relaxed blog-content"
            dangerouslySetInnerHTML={createMarkup(blog.longDescription)}
          />
        </article>
      </main>

      <Footer />
    </div>
  );
};

export default BlogDetail;
