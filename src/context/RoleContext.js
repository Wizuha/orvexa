import { createContext, useContext, useState } from "react";

const RoleContext = createContext(null);

export function RoleProvider({ children }) {
  const [role, setRole] = useState("RH");
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const login = () => setIsAuthenticated(true);
  const logout = () => {
    setIsAuthenticated(false);
    setRole("RH");
  };

  return (
    <RoleContext.Provider
      value={{ role, setRole, isAuthenticated, login, logout }}
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
