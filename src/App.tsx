/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import Home from './pages/Home';
import RestaurantDetail from './pages/RestaurantDetail';
import ItemDetail from './pages/ItemDetail';
import OrderTracking from './pages/OrderTracking';
import Checkout from './pages/Checkout';
import SearchResults from './pages/SearchResults';
import Login from './pages/Login';
import Register from './pages/Register';
import VerifyEmail from './pages/VerifyEmail';
import CategoryDetail from './pages/CategoryDetail';
import FlashSale from './pages/FlashSale';
import Profile from './pages/Profile';

// Admin Pages
import AdminDashboard from './features/dashboard/Dashboard';
import AdminProducts from './features/products/Products';
import AdminCategories from './features/categories/Categories';
import AdminOrders from './features/orders/Orders';
import AdminRestaurants from './features/restaurants/Restaurants';
import AdminDrivers from './features/drivers/Drivers';

function ProtectedRoute({ children, adminOnly = false }: { children: React.ReactNode, adminOnly?: boolean }) {
  const { user, isAdmin, isAuthenticated } = useAuth();
  
  if (!isAuthenticated) return <Navigate to="/login" />;
  if (adminOnly && !isAdmin) return <Navigate to="/" />;
  
  return <>{children}</>;
}

export default function App() {
  return (
    <Router>
      <AuthProvider>
        <CartProvider>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/verify-email" element={<VerifyEmail />} />
            <Route path="/restaurant/:id" element={<RestaurantDetail />} />
            <Route path="/item/:itemId" element={<ItemDetail />} />
            <Route path="/category/:categoryId" element={<CategoryDetail />} />
            <Route path="/flash-sale" element={<FlashSale />} />
            <Route path="/search" element={<SearchResults />} />
            
            {/* User Protected Routes */}
            <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
            <Route path="/track/:orderId" element={<ProtectedRoute><OrderTracking /></ProtectedRoute>} />
            <Route path="/checkout" element={<ProtectedRoute><Checkout /></ProtectedRoute>} />

            {/* Admin Routes */}
            <Route path="/admin" element={<ProtectedRoute adminOnly><AdminDashboard /></ProtectedRoute>} />
            <Route path="/admin/products" element={<ProtectedRoute adminOnly><AdminProducts /></ProtectedRoute>} />
            <Route path="/admin/categories" element={<ProtectedRoute adminOnly><AdminCategories /></ProtectedRoute>} />
            <Route path="/admin/orders" element={<ProtectedRoute adminOnly><AdminOrders /></ProtectedRoute>} />
            <Route path="/admin/restaurants" element={<ProtectedRoute adminOnly><AdminRestaurants /></ProtectedRoute>} />
            <Route path="/admin/drivers" element={<ProtectedRoute adminOnly><AdminDrivers /></ProtectedRoute>} />

            <Route path="*" element={<Home />} />
          </Routes>
        </CartProvider>
      </AuthProvider>
    </Router>
  );
}
