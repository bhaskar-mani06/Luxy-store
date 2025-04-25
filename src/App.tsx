import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { CartProvider } from './context/CartContext';
import { Toaster } from 'react-hot-toast';
import ScrollToTop from './components/ScrollToTop';
import AdminGuard from './components/AdminGuard';

// Public Components
import Header from './components/Header';
import Footer from './components/Footer';
import MainLayout from './layout/MainLayout';
import HomePage from './pages/HomePage';
import AllProductsPage from './pages/AllProductsPage';
import CategoryPage from './pages/CategoryPage';
import ContactPage from './pages/ContactPage';
import AboutPage from './pages/AboutPage';
import ProductDetailPage from './pages/ProductDetailPage';
import ReturnPolicyPage from './pages/ReturnPolicyPage';
import PrivacyPolicyPage from './pages/PrivacyPolicyPage';
import AuthPage from './components/AuthPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import ProfilePage from './pages/ProfilePage';
import NotFoundPage from './pages/NotFoundPage';

// Admin Components
import AdminLayout from './components/admin/AdminLayout';
import LoginPage from './pages/admin/LoginPage';
import DashboardPage from './pages/admin/DashboardPage';
import MessagesPage from './pages/admin/MessagesPage';
import CategoriesPage from './pages/admin/CategoriesPage';
import ProductsPage from './pages/admin/ProductsPage';
import OrdersPage from './pages/admin/OrdersPage';
import UsersPage from './pages/admin/UsersPage';
import DebugAdminPage from './pages/admin/DebugAdminPage';
import AdminLoginPage from './pages/admin/AdminLoginPage';

const App: React.FC = () => {
  return (
    <ThemeProvider>
      <CartProvider>
        <Router>
          <ScrollToTop />
          <Toaster position="top-center" reverseOrder={false} />
          <Routes>
            {/* Admin Routes */}
            <Route path="/admin/login" element={<AdminLoginPage />} />
            <Route path="/admin" element={
              <AdminGuard>
                <AdminLayout>
                  <DashboardPage />
                </AdminLayout>
              </AdminGuard>
            } />
            <Route path="/admin/dashboard" element={
              <AdminGuard>
                <AdminLayout>
                  <DashboardPage />
                </AdminLayout>
              </AdminGuard>
            } />
            <Route path="/admin/products" element={
              <AdminGuard>
                <AdminLayout>
                  <ProductsPage />
                </AdminLayout>
              </AdminGuard>
            } />
            <Route path="/admin/categories" element={
              <AdminGuard>
                <AdminLayout>
                  <CategoriesPage />
                </AdminLayout>
              </AdminGuard>
            } />
            <Route path="/admin/orders" element={
              <AdminGuard>
                <AdminLayout>
                  <OrdersPage />
                </AdminLayout>
              </AdminGuard>
            } />
            <Route path="/admin/users" element={
              <AdminGuard>
                <AdminLayout>
                  <UsersPage />
                </AdminLayout>
              </AdminGuard>
            } />
            <Route path="/admin/messages" element={
              <AdminGuard>
                <AdminLayout>
                  <MessagesPage />
                </AdminLayout>
              </AdminGuard>
            } />
            <Route path="/admin/debug" element={<DebugAdminPage />} />

            {/* Public Routes */}
            <Route path="/" element={
              <>
                <Header />
                <MainLayout>
                  <HomePage />
                </MainLayout>
                <Footer />
              </>
            } />
            <Route path="/products" element={
              <>
                <Header />
                <MainLayout>
                  <AllProductsPage />
                </MainLayout>
                <Footer />
              </>
            } />
            <Route path="/category/:slug" element={
              <>
                <Header />
                <MainLayout>
                  <CategoryPage />
                </MainLayout>
                <Footer />
              </>
            } />
            <Route path="/product/:id" element={
              <>
                <Header />
                <MainLayout>
                  <ProductDetailPage />
                </MainLayout>
                <Footer />
              </>
            } />
            <Route path="/product/slug/:slug" element={
              <>
                <Header />
                <MainLayout>
                  <ProductDetailPage />
                </MainLayout>
                <Footer />
              </>
            } />
            <Route path="/contact" element={
              <>
                <Header />
                <MainLayout>
                  <ContactPage />
                </MainLayout>
                <Footer />
              </>
            } />
            <Route path="/about" element={
              <>
                <Header />
                <MainLayout>
                  <AboutPage />
                </MainLayout>
                <Footer />
              </>
            } />
            <Route path="/return-policy" element={
              <>
                <Header />
                <MainLayout>
                  <ReturnPolicyPage />
                </MainLayout>
                <Footer />
              </>
            } />
            <Route path="/privacy-policy" element={
              <>
                <Header />
                <MainLayout>
                  <PrivacyPolicyPage />
                </MainLayout>
                <Footer />
              </>
            } />
            <Route path="/auth" element={<AuthPage />} />
            <Route path="/cart" element={
              <>
                <Header />
                <MainLayout>
                  <CartPage />
                </MainLayout>
                <Footer />
              </>
            } />
            <Route path="/checkout" element={
              <>
                <Header />
                <MainLayout>
                  <CheckoutPage />
                </MainLayout>
                <Footer />
              </>
            } />
            <Route path="/profile" element={
              <>
                <Header />
                <MainLayout>
                  <ProfilePage />
                </MainLayout>
                <Footer />
              </>
            } />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </Router>
      </CartProvider>
    </ThemeProvider>
  );
};

export default App;