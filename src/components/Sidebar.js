import { useRouter } from "next/router";
import { useRole } from "../context/RoleContext";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

const PAGE_TITLES = {
  "/dashboard": "Tableau de bord",
  "/employes": "Employés",
  "/employes/nouveau": "Ajouter un employé",
  "/absences": "Absences & Congés",
  "/documents": "Documents",
  "/parametres": "Paramètres",
};

export default function Layout({ children }) {
  const router = useRouter();
  const { logout } = useRole();

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  const title = PAGE_TITLES[router.pathname] || "Orvexa";

  return (
    <div className="flex min-h-screen bg-[#F9FAFB]">
      <Sidebar onLogout={handleLogout} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Topbar title={title} />
        <main className="flex-1 overflow-y-auto p-8">{children}</main>
      </div>
    </div>
  );
}
