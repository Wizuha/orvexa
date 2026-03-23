import { useRole } from "../context/RoleContext";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import { api } from "../lib/api";

const ACTIVITIES = [
  { user: "Jean Dupont", action: "Demande de congés", time: "Il y a 2h" },
  { user: "Marie Curie", action: "Document signé", time: "Il y a 5h" },
  { user: "Pierre Martin", action: "Nouvel employé ajouté", time: "Hier" },
  { user: "Sophie Laurent", action: "Modification profil", time: "Hier" },
];

export default function DashboardPage() {
  const { role, user } = useRole();
  const router = useRouter();
  const [stats, setStats] = useState(null);

  useEffect(() => {
    if (role === "RH" || role === "Manager") {
      api.getEmployeeStats().then((res) => setStats(res.data)).catch(() => {});
    }
  }, [role]);

  const kpis = [
    {
      label: "Nombre d'employés",
      value: stats ? String(stats.total) : "—",
      color: "border-indigo",
      roles: ["RH"],
    },
    {
      label: "Absences aujourd'hui",
      value: "—",
      color: "border-amber",
      roles: ["RH", "Manager"],
    },
    {
      label: "Documents récents",
      value: "—",
      color: "border-sky",
      roles: ["RH"],
    },
    {
      label: "Congés restants",
      value: "—",
      color: "border-emerald",
      roles: ["RH", "Manager", "Salarié"],
    },
  ].filter((k) => k.roles.includes(role));

  const quickActions = [
    { label: "Ajouter un employé", path: "/employes/nouveau", roles: ["RH"] },
    {
      label: "Demander un congé",
      path: "/absences",
      roles: ["RH", "Manager", "Salarié"],
    },
    { label: "Ajouter un document", path: "/documents", roles: ["RH"] },
    {
      label: "Voir mon profil",
      path: "/parametres",
      roles: ["RH", "Manager", "Salarié"],
    },
  ].filter((a) => a.roles.includes(role));

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-[24px] font-bold text-gray-900">
          Bonjour, {user?.email?.split("@")[0] ?? "—"} 👋
        </h2>
        <p className="text-[14px] text-[#4B5563] mt-1">
          Voici un résumé de votre activité RH.
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-[20px]">
        {kpis.map((kpi, i) => (
          <div
            key={i}
            className={`bg-white p-[20px] rounded-[8px] shadow-sm border-l-[4px] ${kpi.color} flex flex-col justify-between`}
          >
            <span className="text-[14px] font-medium text-[#4B5563] mb-4 block">
              {kpi.label}
            </span>
            <div className="text-[28px] font-bold text-gray-900">
              {kpi.value}
            </div>
          </div>
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white rounded-[12px] border border-[#E5E7EB] shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-[#E5E7EB] bg-[#F9FAFB]">
            <h2 className="text-[18px] font-semibold">
              Flux d'activité récent
            </h2>
          </div>
          <div className="divide-y divide-[#E5E7EB]">
            {ACTIVITIES.map((activity, i) => (
              <div
                key={i}
                className="h-[52px] flex items-center px-6 hover:bg-[#F9FAFB] transition-colors"
              >
                <div className="w-[32px] h-[32px] bg-[#E5E7EB] rounded-full flex-shrink-0 mr-4" />
                <div className="flex-1 min-w-0">
                  <p className="text-[14px] font-medium text-gray-900 truncate">
                    {activity.user}{" "}
                    <span className="font-normal text-[#4B5563]">
                      {activity.action}
                    </span>
                  </p>
                </div>
                <div className="text-[12px] text-[#4B5563] ml-4 font-medium whitespace-nowrap">
                  {activity.time}
                </div>
              </div>
            ))}
          </div>
          <div className="p-4 bg-[#F9FAFB] border-t border-[#E5E7EB]">
            <button className="text-indigo text-[13px] font-semibold hover:underline">
              Voir tout le flux →
            </button>
          </div>
        </div>
        <div className="bg-white rounded-[12px] border border-[#E5E7EB] shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-[#E5E7EB] bg-[#F9FAFB]">
            <h2 className="text-[18px] font-semibold">Actions rapides</h2>
          </div>
          <div className="p-6 flex flex-col gap-[12px]">
            {quickActions.map((action, i) => (
              <button
                key={i}
                onClick={() => router.push(action.path)}
                className="w-full h-[40px] px-4 rounded-[8px] border border-[#E5E7EB] text-[14px] font-medium hover:bg-indigo hover:text-white hover:border-indigo transition-all flex items-center justify-between"
              >
                {action.label} <span>→</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
