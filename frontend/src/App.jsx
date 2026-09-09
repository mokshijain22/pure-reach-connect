import { Routes, Route, Link, useLocation } from "react-router-dom";
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
import CustomerLogin from "./pages/CustomerLogin";
import CustomerAccount from "./pages/CustomerAccount";

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

function getZone(pathname) {
  if (pathname === "/admin") return "admin";
  if (pathname.startsWith("/seller") || pathname.startsWith("/sell")) return "seller";
  return "customer";
}

function ZoneRoot({ children }) {
  const { pathname } = useLocation();
  const zone = getZone(pathname);
  return (
    <div key={zone} data-zone={zone} className="min-h-screen animate-fade-up" style={{ background: "var(--bg)" }}>
      {children}
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <SellerAuthProvider>
        <CustomerAuthProvider>
          <AdminAuthProvider>
            <CartProvider>
              <ZoneRoot>
                <Navbar />
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/marketplace" element={<Marketplace />} />
                  <Route path="/store/:slug" element={<Storefront />} />
                  <Route path="/product/:id" element={<ProductDetail />} />
                  <Route path="/cart" element={<Cart />} />
                  <Route path="/checkout" element={<Checkout />} />
                  <Route path="/login" element={<CustomerLogin />} />
                  <Route path="/account" element={<CustomerAccount />} />

                  <Route path="/sell" element={<SellerRegister />} />
                  <Route path="/sell/plans" element={<SellerPlanSelect />} />
                  <Route path="/seller/login" element={<SellerLogin />} />
                  <Route path="/seller/dashboard" element={<SellerDashboard />} />

                  <Route path="/admin" element={<Admin />} />
                </Routes>
                <CartBadge />
              </ZoneRoot>
            </CartProvider>
          </AdminAuthProvider>
        </CustomerAuthProvider>
      </SellerAuthProvider>
    </ThemeProvider>
  );
}
