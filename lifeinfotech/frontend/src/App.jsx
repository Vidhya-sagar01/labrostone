import React from "react";
import { Routes, Route, Navigate, useParams } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";

// --- WEB (USER) COMPONENTS ---
import Navbar from "./components/web/comman/Navbar";
import Footer from "./components/web/comman/Footer";
import HeroSlider from "./components/web/HeroSlider";
import TopPicks from "./components/web/TopPicks";
import ShopByCategory from "./components/web/ShopByCategory";
import FindDosha from "./components/web/FindDosha";
import ShopByConcern from "./components/web/ShopByConcern";
import OurStory from "./components/web/OurStory";
import AnantamCollection from "./components/web/AnantamCollection";
import Reviews from "./components/web/Reviews";
import Blogs from "./components/web/Blogs";
import BlogDetail from "./components/web/BlogDetail";
import ProductDetail from "./components/web/ProductDetail";
import ComboDetail from "./components/web/ComboDetail";
import AllProductByCategory from "./components/category/AllproductbycategoryID";

// --- NEW USER AUTH & PROFILE COMPONENTS ---
import SignInogin from "./components/web/auth/SignInogin";
import SignUplogin from "./components/web/signUpLogin";
import UserProfile from "./components/web/UserProfile";
import Cart from "./components/web/Cart";
import Checkout from "./components/web/Checkout";

// --- ADMIN COMPONENTS ---
import Login from "./components/admin/pages/Login";
import AdminLayout from "./components/admin/layout/AdminLayout";
import Dashboard from "./components/admin/pages/Dashboard";
import Category from "./components/admin/pages/Category";
import ProductbycategoryID from "./components/admin/pages/ProductbycategoryID";
import Sliders from "./components/admin/pages/Sliders";
import Faq from "./components/admin/pages/Faq";
import Productlist from "./components/admin/pages/Productlist";
import Season from "./components/admin/pages/Season";
import ProductDetailView from "./components/admin/pages/ProductDetailView";
import AnantamBanner from "./components/admin/pages/AnantamBanner";
import User from "./components/admin/pages/user";
import Coupon from "./components/admin/pages/Coupon";
import AdminOrders from "./components/admin/pages/AdminOrders";
import Payment from "./components/admin/pages/Payment";
import Brand from "./components/admin/pages/Brand";
import Brandlist from "./components/admin/pages/Brandlist";
import Subcategory from "./components/admin/pages/Subcategory";
import SubSubCategory from "./components/admin/pages/SubSubCategory";
import Addproduct from "./components/admin/pages/Addproduct";
import Productadminlist from "./components/admin/pages/Productadminlist";
import Editprodoct from "./components/admin/pages/Editprodoct";
import Reviewsadmin from "./components/admin/pages/Reviewadmin";
import Real from "./components/admin/pages/Real";
import Blogadmin from "./components/admin/pages/Blogadmin";
import Variant from "./components/admin/pages/Variant";
import Features from "./components/admin/pages/Features";
import ComboView from "./components/admin/pages/ComboView";
import ComboList from "./components/admin/pages/ComboList";
import VideoReelsSection from "./components/web/VideoReelsSection";
import TrustedBar from "./components/web/TrustedBar";
import Subscribe from "./components/admin/pages/Subscribe";
// ✅ HELPER COMPONENT: URL se ID nikalne ke liye
const ComboViewWrapper = () => {
  const { id } = useParams();
  return <ComboView comboId={id} />;
};

function App() {
  const isAdminAuthenticated = localStorage.getItem("adminToken");
  const isUserAuthenticated = localStorage.getItem("user");

  return (
    <Routes>
      {/* 1. HOME ROUTE */}
      <Route
        path="/"
        element={
          <>
            <Navbar />
            <HeroSlider />
            <TopPicks />
            <ShopByCategory />
            <FindDosha />
            <ShopByConcern />
            <OurStory />
            <AnantamCollection />
          
            <VideoReelsSection />
            <Blogs />

            <TrustedBar />
              <Reviews />
            <Footer />
          </>
        }
      />

      {/* 2. AUTH ROUTES */}
      <Route
        path="/login"
        element={
          isUserAuthenticated ? <Navigate to="/" replace /> : <SignInogin />
        }
      />
      <Route
        path="/signup"
        element={
          isUserAuthenticated ? <Navigate to="/" replace /> : <SignUplogin />
        }
      />

      {/* 3. USER PROTECTED ROUTES */}
      <Route
        path="/profile"
        element={
          isUserAuthenticated ? (
            <>
              <Navbar />
              <UserProfile />
              <Footer />
            </>
          ) : (
            <Navigate to="/login" />
          )
        }
      />
      <Route
        path="/cart"
        element={
          isUserAuthenticated ? (
            <>
              <Navbar />
              <Cart />
              <Footer />
            </>
          ) : (
            <Navigate to="/login" />
          )
        }
      />
      <Route
        path="/checkout"
        element={
          isUserAuthenticated ? (
            <>
              <Navbar />
              <Checkout />
              <Footer />
            </>
          ) : (
            <Navigate to="/login" />
          )
        }
      />

      {/* 4. PRODUCT & SHOP ROUTES */}
      <Route
        path="/product/:id"
        element={
          <>
            <Navbar />
            <ProductDetail />
            <Footer />
          </>
        }
      />
      <Route
        path="/combo/:id"
        element={
          <>
            <Navbar />
            <ComboDetail />
            <Footer />
          </>
        }
      />
      <Route
        path="/shop"
        element={
          <>
            <Navbar />
            <AllProductByCategory />
            <Footer />
          </>
        }
      />
      <Route
        path="/shop/category/:categoryId"
        element={
          <>
            <Navbar />
            <AllProductByCategory />
            <Footer />
          </>
        }
      />
      <Route
        path="/shop/concern/:concernName"
        element={
          <>
            <Navbar />
            <AllProductByCategory />
            <Footer />
          </>
        }
      />
      <Route
        path="/shop/ingredient/:ingredientName"
        element={
          <>
            <Navbar />
            <AllProductByCategory />
            <Footer />
          </>
        }
      />
      <Route
        path="/collections/:categoryId"
        element={
          <>
            <Navbar />
            <AllProductByCategory />
            <Footer />
          </>
        }
      />
      <Route
        path="/blogs"
        element={
          <>
            <Navbar />
            <Blogs />
            <Footer />
          </>
        }
      />
      <Route
        path="/blog/:id"
        element={
          <>
            <Navbar />
            <BlogDetail />
            <Footer />
          </>
        }
      />

      {/* 5. ADMIN LOGIN */}
      <Route
        path="/admin/login"
        element={
          isAdminAuthenticated ? (
            <Navigate to="/admin/dashboard" replace />
          ) : (
            <Login />
          )
        }
      />

      {/* 6. ADMIN PROTECTED ROUTES */}
      <Route
        path="/admin/*"
        element={
          <ProtectedRoute>
            <AdminLayout>
              <Routes>
                <Route index element={<Dashboard />} />
                <Route path="dashboard" element={<Dashboard />} />
                <Route path="sliders" element={<Sliders />} />
                <Route path="category" element={<Category />} />
                <Route path="faq" element={<Faq />} />
                <Route path="productsshow" element={<Productlist />} />
                <Route path="season" element={<Season />} />{" "}
                {/* Season is your Add Combo Page */}
                <Route
                  path="product/view/:productId"
                  element={<ProductDetailView />}
                />
                <Route path="anantambanner" element={<AnantamBanner />} />
                <Route
                  path="products/add/:categoryId"
                  element={<ProductbycategoryID />}
                />
                <Route path="users" element={<User />} />
                <Route path="coupons" element={<Coupon />} />
                <Route path="orders" element={<AdminOrders />} />
                <Route path="payments" element={<Payment />} />
                <Route path="brand" element={<Brand />} />
                <Route path="brandslist" element={<Brandlist />} />
                <Route path="subcategory" element={<Subcategory />} />
                <Route path="subsubcategory" element={<SubSubCategory />} />
                <Route path="productadminlist" element={<Productadminlist />} />
                <Route path="addproduct" element={<Addproduct />} />
                <Route path="reviews" element={<Reviewsadmin />} />
                <Route path="real" element={<Real />} />
                <Route path="blog" element={<Blogadmin />} />
                <Route path="variant" element={<Variant />} />
                <Route path="features" element={<Features />} />
                <Route path="subscribe" element={<Subscribe />} />
                {/* ✅ COMBO ROUTES (CLEANED) */}
                <Route path="comboslist" element={<ComboList />} />
                <Route path="combo/view/:id" element={<ComboViewWrapper />} />
                <Route path="product/edit/:id" element={<Editprodoct />} />
                <Route
                  path="*"
                  element={<Navigate to="/admin/dashboard" replace />}
                />
              </Routes>
            </AdminLayout>
          </ProtectedRoute>
        }
      />

      {/* 7. GLOBAL 404 REDIRECT */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
