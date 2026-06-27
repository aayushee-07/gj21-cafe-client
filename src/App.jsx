import React, { useState, useEffect } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import Navbar from "./components/navbar.jsx";
import AdminHeader from "./components/AdminHeader.jsx";
import RecentOrders from "./components/RecentOrders.jsx";
import Sidebar from "./components/Sidebar.jsx";
import StatsCard from "./components/StatsCard.jsx";
import Home from "./pages/home.jsx";
import Menu from "./pages/menu.jsx";
import About from "./pages/about.jsx";
import AdminDashboard from "./pages/admindashboard.jsx";
import AdminAnalytics from "./pages/adminanalytics.jsx";
import AdminFeedback from "./pages/adminfeedback.jsx";
import AdminMenu from "./pages/adminmenu.jsx";
import AdminOrders from "./pages/adminorders.jsx";
import AdminCoupons from "./pages/admincoupons.jsx";
import AdminLayout from "./pages/adminlayout.jsx";
import AdminTransactions from "./pages/admintransaction.jsx";
import AdminMessages from "./pages/adminmessages.jsx";
import Cart from "./pages/cart.jsx";
import Checkout from "./pages/checkout.jsx";
import Favorites from "./pages/favourite.jsx";
import Login from "./pages/login.jsx";
import Profile from "./pages/profile.jsx";
import Register from "./pages/register.jsx";
import TrackOrder from "./pages/trackorder.jsx";
import OrderHistory from "./pages/orderhistory.jsx";
import OrderSuccess from "./pages/ordersuccess.jsx";
import PaymentSuccess from "./pages/payment-success.jsx";
import PaymentCancel from "./pages/payment-cancel";
import Contact from "./pages/contact";
import AdminUsers from "./pages/adminuser.jsx";
import DeliveryDashboard from "./pages/deliverydashboard.jsx";
import MyDeliveries from "./pages/mydelivery.jsx";
import AdminDeliveryManagement from "./pages/admindeliverymanagement.jsx";
import ForgotPassword from "./pages/forgotpassword.jsx";
import ResetPassword from "./pages/resetpassword.jsx";

import api from "./lib/apiClient";

function App() {

  const [user, setUser] = useState(() =>
    JSON.parse(localStorage.getItem("user")) || null
  );

  useEffect(() => {
    const storedUser = localStorage.getItem("user");

    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const [cartItems, setCartItems] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [notification, setNotification] = useState(null);

  const location = useLocation();
  const isAdminPage = location.pathname.startsWith("/admin");

  useEffect(() => {
    const fetchData = async () => {
      if (!user || !user.token) {
        setCartItems([]);
        setFavorites([]);
        return;
      }
      try {
        const favRes = await api.get("/favourites");
        setFavorites(favRes.data.map((item) => ({ ...item.menuItem })));
        const cartRes = await api.get("/cart");
        setCartItems(cartRes.data.map((item) => ({ ...item.menuItem, quantity: item.quantity })));
      } catch (err) {
        console.error("Error loading data:", err.response?.data || err.message);
      }
    };
    fetchData();
  }, [user]);

  const showMessage = (message) => {
    setNotification(message);
    setTimeout(() => setNotification(null), 3000);
  };

  const addToCart = async (item, decrease = false) => {
    if (!user) return alert("Please login first!");
    let updatedCart = [...cartItems];
    const index = updatedCart.findIndex((i) => i._id === item._id);
    try {
      if (index !== -1) {
        updatedCart[index].quantity += decrease ? -1 : 1;
        if (updatedCart[index].quantity <= 0) {
          updatedCart.splice(index, 1);
          await api.delete(`/cart/${item._id}`);
          showMessage(`${item.name} removed from cart 🗑️`);
        } else {
          await api.post("/cart", { menuItemId: item._id });
          if (!decrease) showMessage(`${item.name} added to cart 🛒`);
        }
      } else if (!decrease) {
        updatedCart.push({ ...item, quantity: 1 });
        await api.post("/cart", { menuItemId: item._id });
        showMessage(`${item.name} added to cart 🛒`);
      }
      setCartItems(updatedCart);
    } catch (err) {
      showMessage("Cart action failed ❌");
    }
  };

  const removeFromCart = async (id) => {
    const item = cartItems.find((i) => i._id === id);
    try {
      await api.delete(`/cart/${id}`);
      setCartItems(cartItems.filter((i) => i._id !== id));
      showMessage(`${item?.name} removed from cart 🗑️`);
    } catch (err) {
      showMessage("Remove failed ❌");
    }
  };

  const clearCart = async () => {
    try {
      await api.delete("/cart/clear");
      setCartItems([]);
      localStorage.removeItem("cart");
      showMessage("Cart cleared 🛒");
    } catch (err) {
      showMessage("Clear failed ❌");
    }
  };

  const toggleFavorite = async (item) => {
    if (!user) return alert("Please login first!");
    const exists = favorites.find((fav) => fav._id === item._id);
    try {
      if (exists) {
        await api.delete(`/favourites/${item._id}`);
        setFavorites(favorites.filter((fav) => fav._id !== item._id));
        showMessage(`${item.name} removed from favorites 💔`);
      } else {
        await api.post("/favourites", { menuItemId: item._id });
        setFavorites([...favorites, item]);
        showMessage(`${item.name} added to favorites ❤️`);
      }
    } catch (err) {
      showMessage("Favorite action failed ❌");
    }
  };

  return (
    <>
      {/* Hide Navbar on admin pages — AdminLayout has its own navbar */}
      {!isAdminPage && (
        <Navbar
          cartItems={cartItems}
          favorites={favorites}
          user={user}
          setUser={setUser}
        />
      )}

      {notification && (
        <div className="fixed top-5 left-1/2 -translate-x-1/2 bg-black text-white
        px-6 py-3 rounded-lg shadow-lg z-50 transition-all duration-300">
          {notification}
        </div>
      )}

      <Routes>

        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/login" element={<Login setUser={setUser} />} />
        <Route
          path="/forgot-password"
          element={<ForgotPassword />}
        />
        <Route
          path="/reset-password"
          element={<ResetPassword />}
        />
        <Route path="/register" element={<Register setUser={setUser} />} />

        <Route path="/menu" element={
          <Menu
            user={user}
            addToCart={addToCart}
            toggleFavorite={toggleFavorite}
            favorites={favorites}
            cartItems={cartItems}
          />
        } />

        <Route path="/favorites" element={
          user ? <Favorites favorites={favorites} toggleFavorite={toggleFavorite}
            addToCart={addToCart} /> : <Navigate to="/login" />
        } />

        <Route path="/cart" element={
          user ? <Cart cartItems={cartItems} removeFromCart={removeFromCart}
            clearCart={clearCart} addToCart={addToCart} /> : <Navigate to="/login" />
        } />

        <Route path="/checkout" element={
          user ? <Checkout cartItems={cartItems} clearCart={clearCart} />
            : <Navigate to="/login" />
        } />

        <Route path="/order-success/:id" element={
          user ? <OrderSuccess setCartItems={setCartItems} /> : <Navigate to="/login" />
        } />

        <Route path="/payment-success" element={<PaymentSuccess />} />
        <Route path="/payment-cancel" element={<PaymentCancel />} />

        <Route path="/track-order/:id" element={
          user ? <TrackOrder /> : <Navigate to="/login" />
        } />

        <Route path="/orders" element={
          user ? <OrderHistory addToCart={addToCart} user={user} />
            : <Navigate to="/login" />
        } />

        <Route path="/profile" element={
          user ? <Profile user={user} setUser={setUser} /> : <Navigate to="/login" />
        } />

        <Route path="/delivery" element={
          user?.role === "delivery" ? <DeliveryDashboard user={user} /> : <Navigate to="/" />
        } />
        <Route
          path="/delivery/orders"
          element={
            user?.role === "delivery"
              ? <MyDeliveries user={user} />
              : <Navigate to="/" />
          }
        />
        {/* ── ADMIN ROUTES — ✅ props now passed to AdminLayout ── */}
        <Route
          path="/admin"
          element={
            user?.role === "admin" ? (
              <AdminLayout
                user={user}
                setUser={setUser}
                cartItems={cartItems}
                favorites={favorites}
              />
            ) : (
              <Navigate to="/" replace />
            )
          }
        >

          {/* ✅ Default page */}
          <Route index element={<AdminDashboard />} />

          {/* ✅ Child routes (NO leading slash) */}
          <Route path="orders" element={<AdminOrders />} />
          <Route path="menu" element={<AdminMenu />} />
          <Route path="feedback" element={<AdminFeedback />} />
          <Route path="coupons" element={<AdminCoupons />} />
          <Route path="analytics" element={<AdminAnalytics />} />
          <Route path="messages" element={<AdminMessages />} />
          <Route path="transactions" element={<AdminTransactions />} />
          <Route path="users" element={<AdminUsers />} />
          <Route path="delivery" element={<AdminDeliveryManagement />} />

        </Route>
      </Routes>
    </>

  );
}

export default App;