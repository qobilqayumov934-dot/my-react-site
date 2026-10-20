import { useEffect, useState } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import "./App.css";

import TopBar from "./components/TopBar";
import Header from "./components/Header";
import Footer from "./components/Footer";

import HomePage from "./pages/HomePage";
import WishlistPage from "./pages/WishlistPage";
import ProductDetailsPage from "./pages/ProductDetailsPage";
import CartPage from "./pages/CartPage";
import LoginPage from "./pages/LoginPage";
import SignUpPage from "./pages/SignUpPage";

import useLocalStorage from "./hooks/useLocalStorage";
import { fetchProducts, getProductKey } from "./api/products";

export default function App() {
  const { pathname } = useLocation();

  const [products, setProducts] = useState([]);
  const [status, setStatus] = useState("loading"); // "loading" | "success" | "error"
  const [wishlist, setWishlist] = useLocalStorage("wishlist", []); // массив ключей товаров
  const [cart, setCart] = useLocalStorage("cart", []); // [{ key, qty }]
  const [user, setUser] = useLocalStorage("user", null); // вошедший пользователь (без пароля)

  // Загружаем все товары один раз — дальше все страницы берут их отсюда
  useEffect(() => {
    const controller = new AbortController();

    fetchProducts(controller.signal)
      .then((data) => {
        setProducts(data);
        setStatus("success");
      })
      .catch((err) => {
        if (err.name !== "AbortError") setStatus("error");
      });

    return () => controller.abort();
  }, []);

  // При переходе на другую страницу — наверх
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  const toggleWish = (key) =>
    setWishlist((list) =>
      list.includes(key) ? list.filter((k) => k !== key) : [...list, key]
    );

  const addToCart = (key, qty = 1) =>
    setCart((items) =>
      items.some((i) => i.key === key)
        ? items.map((i) => (i.key === key ? { ...i, qty: i.qty + qty } : i))
        : [...items, { key, qty }]
    );

  const setCartQty = (key, qty) =>
    setCart((items) => items.map((i) => (i.key === key ? { ...i, qty: Math.max(1, qty) } : i)));

  const removeFromCart = (key) => setCart((items) => items.filter((i) => i.key !== key));

  const clearCart = () => setCart([]);

  // Строки корзины с полными данными товара (товары, которых нет в API, отбрасываем)
  const cartLines =
    status === "success"
      ? cart
          .map((item) => ({
            ...item,
            product: products.find((p) => getProductKey(p) === item.key),
          }))
          .filter((line) => line.product)
      : [];

  const cartCount = (status === "success" ? cartLines : cart).reduce((n, l) => n + l.qty, 0);

  // Считаем только те товары из вишлиста, которые реально есть в API
  const wishlistCount =
    status === "success"
      ? products.filter((p) => wishlist.includes(getProductKey(p))).length
      : wishlist.length;

  const shared = {
    products,
    status,
    wishlist,
    onToggleWish: toggleWish,
    onAddToCart: addToCart,
  };

  return (
    <div className="page">
      <TopBar />
      <Header
        wishlistCount={wishlistCount}
        cartCount={cartCount}
        user={user}
        onLogout={() => setUser(null)}
      />

      <main className="container">
        <Routes>
          <Route path="/" element={<HomePage {...shared} />} />
          <Route path="/wishlist" element={<WishlistPage {...shared} />} />
          <Route path="/product/:id" element={<ProductDetailsPage {...shared} />} />
          <Route
            path="/cart"
            element={
              <CartPage
                status={status}
                cartLines={cartLines}
                onSetQty={setCartQty}
                onRemove={removeFromCart}
                onClear={clearCart}
                user={user}
              />
            }
          />
          <Route path="/login" element={<LoginPage user={user} onLogin={setUser} />} />
          <Route path="/signup" element={<SignUpPage user={user} onLogin={setUser} />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      <Footer />
    </div>
  );
}
