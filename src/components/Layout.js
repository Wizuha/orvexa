import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useRole } from "../context/RoleContext";

const NAV_ITEMS = [
  {
    label: "Tableau de bord",
    path: "/dashboard",
    roles: ["RH", "Manager", "Salarié"],
  },
  { label: "Employés", path: "/employes", roles: ["RH"] },
  { label: "Ajouter un employé", path: "/employes/nouveau", roles: ["RH"] },
  {
    label: "Absences & Congés",
    path: "/absences",
    roles: ["RH", "Manager", "Salarié"],
  },
  {
    label: "Documents",
    path: "/documents",
    roles: ["RH", "Manager", "Salarié"],
  },
  {
    label: "Paramètres",
    path: "/parametres",
    roles: ["RH", "Manager", "Salarié"],
  },
];

const PAGE_TITLES = {
  "/dashboard": "Tableau de bord",
  "/employes": "Employés",
  "/employes/nouveau": "Ajouter un employé",
  "/absences": "Absences & Congés",
  "/documents": "Gestion Documentaire",
  "/parametres": "Paramètres",
};

export default function Layout({ children }) {
  const { role, setRole, logout, isAuthenticated } = useRole();
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) router.push("/");
  }, [isAuthenticated, router]);

  if (!isAuthenticated) return null;

  const pageTitle = PAGE_TITLES[router.pathname] || "Orvexa";

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  return (
    <div className="flex h-screen w-full bg-[#F9FAFB] text-[#111827] overflow-hidden">
      {/* SIDEBAR */}
      <aside className="w-64 bg-white border-r border-[#E5E7EB] flex flex-col z-20 flex-shrink-0">
        <div className="h-16 flex items-center px-6 border-b border-[#E5E7EB]">
          <div className="text-xl font-black uppercase tracking-tighter text-indigo">
            ORVEXA
          </div>
        </div>
        <nav className="flex-1 py-4 overflow-y-auto">
          {NAV_ITEMS.filter((item) => item.roles.includes(role)).map((item) => {
            const isActive = router.pathname === item.path;
            return (
              <Link
                key={item.path}
                href={item.path}
                className={[
                  "flex items-center px-6 py-4 text-[14px] transition-colors relative",
                  isActive
                    ? "text-indigo font-semibold bg-indigo/5"
                    : "text-[#4B5563] hover:bg-[#F9FAFB]",
                ].join(" ")}
              >
                {isActive && (
                  <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-indigo rounded-r-sm" />
                )}
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="p-4 border-t border-[#E5E7EB]">
          <button
            onClick={() => setShowLogoutModal(true)}
            className="flex items-center w-full px-4 py-3 text-[14px] text-red-600 hover:bg-red-50 rounded-md transition-colors font-medium"
          >
            <svg
              className="mr-3"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line x1="21" y1="12" x2="9" y2="12" />
            </svg>
            Déconnexion
          </button>
        </div>
      </aside>

      {/* MAIN */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="h-[64px] bg-white border-b border-[#E5E7EB] flex items-center justify-between px-8 z-10 flex-shrink-0">
          <h1 className="text-[24px] font-bold text-gray-900 truncate">
            {pageTitle}
          </h1>
          <div className="flex items-center gap-2 bg-[#F9FAFB] border border-[#E5E7EB] px-3 py-1.5 rounded-full">
            <span className="text-[12px] font-medium text-[#4B5563]">
              Rôle :
            </span>
            <div className="relative">
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="appearance-none bg-transparent text-[12px] font-bold text-indigo pr-5 outline-none cursor-pointer"
              >
                <option value="RH">RH (Admin)</option>
                <option value="Manager">Manager</option>
                <option value="Salarié">Salarié</option>
              </select>
              <svg
                className="absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none text-indigo"
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </div>
          </div>
        </header>
        <main className="flex-1 overflow-auto p-8">
          <div className="max-w-[1440px] mx-auto">{children}</div>
        </main>
      </div>

      {/* MODAL DÉCONNEXION */}
      {showLogoutModal && (
        <div className="fixed inset-0 flex items-center justify-center z-[100]">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setShowLogoutModal(false)}
          />
          <div className="bg-white rounded-[12px] p-[32px] w-[400px] relative z-[101] shadow-xl text-center">
            <div className="w-12 h-12 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                <line x1="12" y1="9" x2="12" y2="13" />
                <line x1="12" y1="17" x2="12.01" y2="17" />
              </svg>
            </div>
            <h2 className="text-[18px] font-bold mb-2">Déconnexion</h2>
            <p className="text-[14px] text-[#4B5563] mb-8">
              Cette action mettra fin à votre session actuelle. Voulez-vous
              continuer ?
            </p>
            <div className="flex flex-col gap-2">
              <button
                onClick={handleLogout}
                className="w-full h-[40px] bg-red-600 text-white rounded-[8px] font-semibold hover:bg-red-700 transition-colors"
              >
                Se déconnecter
              </button>
              <button
                onClick={() => setShowLogoutModal(false)}
                className="w-full h-[40px] bg-white border border-[#E5E7EB] text-[#4B5563] rounded-[8px] font-semibold hover:bg-[#F9FAFB] transition-colors"
              >
                Annuler
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
