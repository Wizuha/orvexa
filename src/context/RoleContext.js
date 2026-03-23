import { createContext, useContext, useState, useEffect } from "react";
import { api } from "../lib/api";

const RoleContext = createContext(null);

// Mapping des rôles backend vers les rôles frontend
const ROLE_MAP = {
  RH_ADMIN: "RH",
  MANAGER: "Manager",
  EMPLOYEE: "Salarié",
};

export function RoleProvider({ children }) {
  const [role, setRole] = useState("RH");
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  // Restaurer la session au chargement
  useEffect(() => {
    const token = localStorage.getItem("orvexa_token");
    if (token) {
      api
        .getMe()
        .then((res) => {
          const frontendRole = ROLE_MAP[res.data.role] || "RH";
          setRole(frontendRole);
          setUser(res.data);
          setIsAuthenticated(true);
        })
        .catch(() => {
          localStorage.removeItem("orvexa_token");
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (email, password) => {
    const res = await api.login(email, password);
    const { token, user: userData } = res.data;
    localStorage.setItem("orvexa_token", token);
    const frontendRole = ROLE_MAP[userData.role] || "RH";
    setRole(frontendRole);
    setUser(userData);
    setIsAuthenticated(true);
    return frontendRole;
  };

  const logout = () => {
    localStorage.removeItem("orvexa_token");
    setIsAuthenticated(false);
    setUser(null);
    setRole("RH");
  };

  return (
    <RoleContext.Provider
      value={{ role, setRole, user, isAuthenticated, login, logout, loading }}
    >
      {children}
    </RoleContext.Provider>
  );
}

export function useRole() {
  const context = useContext(RoleContext);
  if (!context) throw new Error("useRole must be used inside RoleProvider");
  return context;
}
