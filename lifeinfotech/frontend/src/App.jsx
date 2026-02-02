import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute'; // Import verified

// --- WEB IMPORTS ---
import Navbar from './components/web/comman/Navbar'; 
import HeroSlider from './components/web/HeroSlider';
import TopPicks from './components/web/TopPicks';
import ShopByCategory from './components/web/ShopByCategory'; 
import FindDosha from './components/web/FindDosha';
import ShopByConcern from './components/web/ShopByConcern';   
import OurStory from './components/web/OurStory';
import AnantamCollection from './components/web/AnantamCollection';
import Reviews from './components/web/Reviews';
import Awards from './components/web/Awards';
import Blogs from './components/web/Blogs';
import CertificationBar from './components/web/CertificationBar';
import Footer from './components/web/comman/Footer'; 

// --- ADMIN IMPORTS ---
import Login from './components/admin/pages/Login'; 
import AdminLayout from "./components/admin/layout/AdminLayout";
import Dashboard from "./components/admin/pages/Dashboard";
import Category from './components/admin/pages/Category';
import ProductbycategoryID from './components/admin/pages/ProductbycategoryID';
import Sliders from './components/admin/pages/Sliders';
import Faq from './components/admin/pages/Faq';
import Productlist from './components/admin/pages/Productlist';
import Season from './components/admin/pages/Season';
import  ProductDetailView from './components/admin/pages/ProductDetailView';
import  AnantamBanner from './components/admin/pages/AnantamBanner';


function App() {
  // Authentication check ko component ke bahar ya ProtectedRoute mein handle karna behtar hai
  const isAuthenticated = localStorage.getItem('adminToken');

  return (
    <Routes>
      {/* 1. Website Home Route (Public) */}
      <Route path="/" element={
        <div className="min-h-screen bg-white font-sans">
          <Navbar />
          <HeroSlider />
          <TopPicks />
          <ShopByCategory />
          <FindDosha />
          <ShopByConcern />
          <OurStory />
          <AnantamCollection />
          <Reviews />
          <Awards />
          <Blogs />
          <CertificationBar />
          <Footer />
        </div>
      } />

      {/* 2. Admin LOGIN Route */}
      {/* Agar pehle se login hai toh dashboard bhej do, nahi toh Login page dikhao */}
      <Route path="/admin/login" element={
        isAuthenticated ? <Navigate to="/admin/dashboard" replace /> : <Login />
      } />

      {/* 3. Admin Protected Routes (Lebrostone Dashboard) */}
      <Route path="/admin/*" element={
        <ProtectedRoute>
          <AdminLayout>
            <Routes>
              {/* Index route for /admin */}
              <Route index element={<Dashboard />} />
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="sliders" element={<Sliders />} />
              <Route path="category" element={<Category />} />
              <Route path="faq" element={<Faq />} />
              <Route path="productsshow" element={<Productlist/>} />
              <Route path="season" element={<Season />} />
              <Route path="product/view/:productId" element={<ProductDetailView />} />
              <Route path="anantambanner" element={<AnantamBanner />} />
              
              {/* Dynamic Route for Products */}
              <Route path="products/add/:categoryId" element={<ProductbycategoryID />} />
              
              <Route path="profile" element={<div className="p-6 text-2xl font-bold">Admin Profile Section</div>} />
              
              {/* Fallback for unknown admin paths */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </AdminLayout>
        </ProtectedRoute>
      } />

      {/* 4. Global 404 Redirect */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;