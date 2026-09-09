import { createContext, useContext, useState } from "react";

const AdminAuthContext = createContext();

export function AdminAuthProvider({ children }) {
  const [admin, setAdmin] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("prc-admin")) || null;
    } catch {
      return null;
    }
  });

  function loginAdmin(token, adminData) {
    localStorage.setItem("prc-admin-token", token);
    localStorage.setItem("prc-token", token);
    localStorage.setItem("prc-admin", JSON.stringify(adminData));
    setAdmin(adminData);
  }

  function logoutAdmin() {
    localStorage.removeItem("prc-admin-token");
    localStorage.removeItem("prc-admin");
    localStorage.removeItem("prc-token");
    setAdmin(null);
  }

  return <AdminAuthContext.Provider value={{ admin, loginAdmin, logoutAdmin }}>{children}</AdminAuthContext.Provider>;
}

export function useAdminAuth() {
  return useContext(AdminAuthContext);
}
