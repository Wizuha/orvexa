import { useState, useEffect } from "react";
import { useRole } from "../context/RoleContext";
import { api } from "../lib/api";

const STATS = [
  { label: "Congés payés", value: "12 / 25", color: "text-indigo" },
  { label: "RTT", value: "4 / 10", color: "text-amber" },
  { label: "Maladie", value: "2", color: "text-[#EF4444]" },
];
const STATUS_STYLES = {
  Validé: "bg-[#10B981]/15 text-[#10B981]",
  "En attente": "bg-[#F59E0B]/15 text-[#F59E0B]",
  Refusé: "bg-[#EF4444]/15 text-[#EF4444]",
};

const STATUS_MAP = {
  pending: "En attente",
  approved: "Validé",
  rejected: "Refusé",
};

export default function AbsencesPage() {
  const { role } = useRole();
  const [currentTab, setCurrentTab] = useState("Mes demandes");
  const [requests, setRequests] = useState([]);
  const [loadingRequests, setLoadingRequests] = useState(true);

  useEffect(() => {
    const fetchAbsences = async () => {
      setLoadingRequests(true);
      try {
        const showAll = currentTab === "Toutes les demandes" && (role === "RH" || role === "Manager");
        const res = showAll ? await api.getAllAbsences() : await api.getMyAbsences();
        setRequests(res.data.absences || []);
      } catch {
        setRequests([]);
      } finally {
        setLoadingRequests(false);
      }
    };
    fetchAbsences();
  }, [currentTab, role]);

  const tabs =
    role === "RH"
      ? ["Mes demandes", "Calendrier d'équipe", "Toutes les demandes"]
      : role === "Manager"
      ? ["Mes demandes", "Calendrier d'équipe"]
      : ["Mes demandes"];

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div className="flex bg-white p-1 rounded-[8px] border border-[#E5E7EB]">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setCurrentTab(tab)}
              className={`px-4 py-1.5 rounded-[6px] text-[13px] font-semibold transition-all ${
                currentTab === tab
                  ? "bg-indigo text-white shadow-sm"
                  : "text-[#4B5563] hover:text-indigo"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
        <button className="h-[40px] px-4 bg-indigo text-white rounded-[8px] font-bold text-[14px] hover:bg-indigo-dark transition-colors">
          + Nouvelle demande
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white rounded-[12px] border border-[#E5E7EB] shadow-sm p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-[18px] font-semibold">Mars 2026</h2>
            <div className="flex gap-2">
              <button className="p-1 border border-[#E5E7EB] rounded-md hover:bg-[#F9FAFB]">
                ←
              </button>
              <button className="px-3 py-1 border border-[#E5E7EB] rounded-md text-[13px] font-medium hover:bg-[#F9FAFB]">
                Aujourd'hui
              </button>
              <button className="p-1 border border-[#E5E7EB] rounded-md hover:bg-[#F9FAFB]">
                →
              </button>
            </div>
          </div>
          <div className="grid grid-cols-7 gap-px bg-[#F3F4F6] border border-[#F3F4F6] rounded-lg overflow-hidden">
            {["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"].map((d) => (
              <div
                key={d}
                className="bg-[#F9FAFB] p-2 text-center text-[12px] font-bold text-[#9CA3AF] uppercase"
              >
                {d}
              </div>
            ))}
            {Array.from({ length: 31 }, (_, i) => i + 1).map((day) => (
              <div
                key={day}
                className="bg-white min-h-[60px] p-2 relative hover:bg-[#F9FAFB] transition-colors"
              >
                <span className="text-[13px] font-medium text-gray-700">
                  {day}
                </span>
                <div className="absolute bottom-2 left-2 flex gap-1">
                  {day === 12 && (
                    <div className="w-2 h-2 rounded-full bg-indigo" />
                  )}
                  {day === 20 && (
                    <div className="w-2 h-2 rounded-full bg-[#F59E0B]" />
                  )}
                  {day === 5 && (
                    <div className="w-2 h-2 rounded-full bg-[#EF4444]" />
                  )}
                </div>
              </div>
            ))}
          </div>
          <div className="flex items-center gap-4 mt-6 pt-4 border-t border-[#E5E7EB]">
            {[
              { color: "bg-indigo", label: "Validé" },
              { color: "bg-[#F59E0B]", label: "En attente" },
              { color: "bg-[#EF4444]", label: "Refusé" },
            ].map(({ color, label }) => (
              <div key={label} className="flex items-center gap-2">
                <div className={`w-3 h-3 ${color} rounded-sm`} />
                <span className="text-[12px] text-[#4B5563] font-medium">
                  {label}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-[12px] border border-[#E5E7EB] shadow-sm p-6">
          <h2 className="text-[18px] font-semibold mb-4">Mes soldes</h2>
          <div className="space-y-4">
            {STATS.map((stat, i) => (
              <div
                key={i}
                className="flex justify-between items-center p-3 bg-[#F9FAFB] rounded-[8px] border border-[#E5E7EB]"
              >
                <span className="text-[14px] font-medium text-[#4B5563]">
                  {stat.label}
                </span>
                <span className={`text-[14px] font-bold ${stat.color}`}>
                  {stat.value}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-[12px] border border-[#E5E7EB] shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-[#E5E7EB] bg-[#F9FAFB]">
          <h2 className="text-[18px] font-semibold">Historique et demandes</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-[#E5E7EB] bg-[#F9FAFB]">
                <th className="px-6 py-3 text-[12px] font-bold text-[#4B5563] uppercase">
                  Type
                </th>
                <th className="px-6 py-3 text-[12px] font-bold text-[#4B5563] uppercase">
                  Début
                </th>
                <th className="px-6 py-3 text-[12px] font-bold text-[#4B5563] uppercase">
                  Fin
                </th>
                {role !== "Salarié" && (
                  <th className="px-6 py-3 text-[12px] font-bold text-[#4B5563] uppercase">
                    Employé
                  </th>
                )}
                <th className="px-6 py-3 text-[12px] font-bold text-[#4B5563] uppercase">
                  Statut
                </th>
                <th className="px-6 py-3 text-[12px] font-bold text-[#4B5563] uppercase text-right">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E5E7EB]">
              {loadingRequests ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-[14px] text-[#9CA3AF]">
                    Chargement...
                  </td>
                </tr>
              ) : requests.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-[14px] text-[#9CA3AF]">
                    Aucune demande.
                  </td>
                </tr>
              ) : (
              requests.map((req) => {
                const statusLabel = STATUS_MAP[req.status] || req.status;
                const employeeName = req.employee
                  ? `${req.employee.firstName} ${req.employee.lastName}`
                  : "—";
                const startDate = new Date(req.startDate).toLocaleDateString("fr-FR");
                const endDate = new Date(req.endDate).toLocaleDateString("fr-FR");
                return (
                <tr
                  key={req._id}
                  className="h-[52px] hover:bg-[#F9FAFB] transition-colors"
                >
                  <td className="px-6 py-2 text-[14px] font-semibold">
                    {req.type}
                  </td>
                  <td className="px-6 py-2 text-[14px] text-[#4B5563]">
                    {startDate}
                  </td>
                  <td className="px-6 py-2 text-[14px] text-[#4B5563]">
                    {endDate}
                  </td>
                  {role !== "Salarié" && (
                    <td className="px-6 py-2 text-[14px] text-gray-700 font-medium">
                      {employeeName}
                    </td>
                  )}
                  <td className="px-6 py-2">
                    <span
                      className={`px-3 py-1 rounded-full text-[12px] font-semibold uppercase tracking-wider ${
                        STATUS_STYLES[statusLabel]
                      }`}
                    >
                      {statusLabel}
                    </span>
                  </td>
                  <td className="px-6 py-2 text-right">
                    {role !== "Salarié" && req.status === "pending" ? (
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={async () => {
                            await api.approveAbsence(req._id);
                            setRequests((prev) =>
                              prev.map((r) => r._id === req._id ? { ...r, status: "approved" } : r)
                            );
                          }}
                          className="w-[90px] h-[32px] border border-[#10B981] text-[#10B981] rounded-[6px] text-[12px] font-bold hover:bg-[#10B981] hover:text-white transition-all"
                        >
                          ✓ Accepter
                        </button>
                        <button
                          onClick={async () => {
                            await api.rejectAbsence(req._id);
                            setRequests((prev) =>
                              prev.map((r) => r._id === req._id ? { ...r, status: "rejected" } : r)
                            );
                          }}
                          className="w-[80px] h-[32px] border border-[#EF4444] text-[#EF4444] rounded-[6px] text-[12px] font-bold hover:bg-[#EF4444] hover:text-white transition-all"
                        >
                          ✕ Refuser
                        </button>
                      </div>
                    ) : (
                      <button className="text-[13px] text-indigo font-semibold hover:underline">
                        Détails
                      </button>
                    )}
                  </td>
                </tr>
                );
              })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
