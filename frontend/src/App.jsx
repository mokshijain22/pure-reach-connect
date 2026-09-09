import { Routes, Route, Link } from "react-router-dom";
import { ThemeProvider } from "./context/ThemeContext";
import { SellerAuthProvider } from "./context/SellerAuthContext";
import { CustomerAuthProvider } from "./context/CustomerAuthContext";
import { AdminAuthProvider } from "./context/AdminAuthContext";
import { CartProvider, useCart } from "./context/CartContext";
import Navbar from "./components/Navbar";

import Home from "./pages/Home";
import Marketplace from "./pages/Marketplace";
import Storefront from "./pages/Storefront";
import ProductDetail from "./pages/ProductDetail";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import SellerRegister from "./pages/SellerRegister";
import SellerLogin from "./pages/SellerLogin";
import SellerPlanSelect from "./pages/SellerPlanSelect";
import SellerDashboard from "./pages/SellerDashboard";
import Admin from "./pages/Admin";

function CartBadge() {
  const { items } = useCart();
  const count = items.reduce((sum, i) => sum + i.quantity, 0);
  if (!count) return null;
  return (
    <Link
      to="/cart"
      className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full flex items-center justify-center font-medium shadow-lg"
      style={{ background: "var(--accent)", color: "#fff" }}
    >
      {count}
    </Link>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <SellerAuthProvider>
        <CustomerAuthProvider>
          <AdminAuthProvider>
            <CartProvider>
              <div className="min-h-screen" style={{ background: "var(--bg)" }}>
                <Navbar />
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/marketplace" element={<Marketplace />} />
                  <Route path="/store/:slug" element={<Storefront />} />
                  <Route path="/product/:id" element={<ProductDetail />} />
                  <Route path="/cart" element={<Cart />} />
                  <Route path="/checkout" element={<Checkout />} />

                  <Route path="/sell" element={<SellerRegister />} />
                  <Route path="/sell/plans" element={<SellerPlanSelect />} />
                  <Route path="/seller/login" element={<SellerLogin />} />
                  <Route path="/seller/dashboard" element={<SellerDashboard />} />

                  <Route path="/admin" element={<Admin />} />
                </Routes>
                <CartBadge />
              </div>
            </CartProvider>
          </AdminAuthProvider>
        </CustomerAuthProvider>
      </SellerAuthProvider>
    </ThemeProvider>
  );
}
