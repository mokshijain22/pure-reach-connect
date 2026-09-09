import { createContext, useContext, useEffect, useState } from "react";
import api from "../api/client";

const CustomerAuthContext = createContext();

export function CustomerAuthProvider({ children }) {
  const [customer, setCustomer] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("prc-customer-token");
    if (!token) {
      setLoading(false);
      return;
    }
    api
      .get("/customers/me", { headers: { Authorization: `Bearer ${token}` } })
      .then((res) => setCustomer(res.data))
      .catch(() => localStorage.removeItem("prc-customer-token"))
      .finally(() => setLoading(false));
  }, []);

  function loginCustomer(token, customerData) {
    localStorage.setItem("prc-customer-token", token);
    localStorage.setItem("prc-token", token);
    setCustomer(customerData);
  }

  function logoutCustomer() {
    localStorage.removeItem("prc-customer-token");
    localStorage.removeItem("prc-token");
    localStorage.removeItem("prc-cart");
    setCustomer(null);
  }

  return (
    <CustomerAuthContext.Provider value={{ customer, setCustomer, loginCustomer, logoutCustomer, loading }}>
      {children}
    </CustomerAuthContext.Provider>
  );
}

export function useCustomerAuth() {
  return useContext(CustomerAuthContext);
}
