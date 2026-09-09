import { createContext, useContext, useEffect, useState } from "react";
import api from "../api/client";

const SellerAuthContext = createContext();

export function SellerAuthProvider({ children }) {
  const [seller, setSeller] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("prc-seller-token");
    if (!token) {
      setLoading(false);
      return;
    }
    api
      .get("/sellers/me", { headers: { Authorization: `Bearer ${token}` } })
      .then((res) => setSeller(res.data))
      .catch(() => localStorage.removeItem("prc-seller-token"))
      .finally(() => setLoading(false));
  }, []);

  function loginSeller(token, sellerData) {
    localStorage.setItem("prc-seller-token", token);
    localStorage.setItem("prc-token", token);
    setSeller(sellerData);
  }

  function logoutSeller() {
    localStorage.removeItem("prc-seller-token");
    localStorage.removeItem("prc-token");
    setSeller(null);
  }

  return (
    <SellerAuthContext.Provider value={{ seller, setSeller, loginSeller, logoutSeller, loading }}>
      {children}
    </SellerAuthContext.Provider>
  );
}

export function useSellerAuth() {
  return useContext(SellerAuthContext);
}
