import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { api } from "../../lib/api";

export default function EmployesPage() {
  const router = useRouter();
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [department, setDepartment] = useState("");
  const [status, setStatus] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(null); // id de l'employé à supprimer

  const fetchEmployees = async () => {
    setLoading(true);
    try {
      const params = {};
      if (search) params.search = search;
      if (department) params.department = department;
      if (status) params.status = status;
      const res = await api.getEmployees(params);
      setEmployees(res.data.employees);
    } catch {
      setEmployees([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, [search, department, status]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-4 rounded-[12px] border border-[#E5E7EB] shadow-sm">
        <div className="flex flex-1 items-center gap-4">
          <div className="relative flex-1 max-w-[320px]">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9CA3AF] text-sm">
              🔍
            </span>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Rechercher un employé..."
              className="w-full h-[40px] pl-10 pr-4 bg-[#F9FAFB] border border-[#E5E7EB] rounded-[6px] text-[14px] focus:outline-none focus:border-indigo"
            />
          </div>
          <select
            value={department}
            onChange={(e) => setDepartment(e.target.value === "Département" ? "" : e.target.value)}
            className="h-[40px] w-[160px] px-3 bg-[#F9FAFB] border border-[#E5E7EB] rounded-[6px] text-[14px] outline-none focus:border-indigo"
          >
            <option value="">Département</option>
            <option>Tech</option>
            <option>RH</option>
            <option>Produit</option>
            <option>Finance</option>
          </select>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value === "Statut" ? "" : e.target.value)}
            className="h-[40px] w-[160px] px-3 bg-[#F9FAFB] border border-[#E5E7EB] rounded-[6px] text-[14px] outline-none focus:border-indigo"
          >
            <option value="">Statut</option>
            <option>Actif</option>
            <option>Inactif</option>
          </select>
        </div>
        <button
          onClick={() => router.push("/employes/nouveau")}
          className="h-[40px] px-4 bg-indigo text-white rounded-[8px] font-semibold text-[14px] flex items-center gap-2 hover:bg-indigo-dark transition-colors"
        >
          + Nouvel employé
        </button>
      </div>

      <div className="bg-white rounded-[12px] border border-[#E5E7EB] shadow-sm overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-[#F9FAFB] border-b border-[#E5E7EB]">
              <th className="px-6 py-3 text-[12px] uppercase font-semibold text-[#4B5563] tracking-wider">
                Nom / Email
              </th>
              <th className="px-6 py-3 text-[12px] uppercase font-semibold text-[#4B5563] tracking-wider">
                Rôle
              </th>
              <th className="px-6 py-3 text-[12px] uppercase font-semibold text-[#4B5563] tracking-wider">
                Département
              </th>
              <th className="px-6 py-3 text-[12px] uppercase font-semibold text-[#4B5563] tracking-wider">
                Statut
              </th>
              <th className="px-6 py-3 text-[12px] uppercase font-semibold text-[#4B5563] tracking-wider text-right">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E5E7EB]">
            {loading ? (
              <tr>
                <td colSpan={5} className="px-6 py-8 text-center text-[14px] text-[#9CA3AF]">
                  Chargement...
                </td>
              </tr>
            ) : employees.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-8 text-center text-[14px] text-[#9CA3AF]">
                  Aucun employé trouvé.
                </td>
              </tr>
            ) : (
              employees.map((emp, index) => (
                <tr
                  key={emp._id}
                  className={`h-[52px] hover:bg-[#F9FAFB] transition-colors ${
                    index % 2 === 0 ? "bg-white" : "bg-[#F9FAFB]"
                  }`}
                >
                  <td className="px-6 py-2">
                    <div className="flex flex-col">
                      <span className="text-[14px] font-bold text-gray-900">
                        {emp.firstName} {emp.lastName}
                      </span>
                      <span className="text-[12px] text-[#9CA3AF]">
                        {emp.email}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-2 text-[14px] text-gray-700">
                    {emp.position}
                  </td>
                  <td className="px-6 py-2 text-[14px] text-gray-700">
                    {emp.department}
                  </td>
                  <td className="px-6 py-2">
                    <span
                      className={`px-[6px] py-[2px] rounded-[6px] text-[13px] font-medium ${
                        emp.status === "Actif"
                          ? "bg-[#10B981]/15 text-[#10B981]"
                          : "bg-[#6B7280]/15 text-[#6B7280]"
                      }`}
                    >
                      {emp.status}
                    </span>
                  </td>
                  <td className="px-6 py-2 text-right">
                    <div className="flex items-center justify-end gap-4">
                      <button
                        onClick={() => setShowDeleteModal(emp._id)}
                        className="text-[14px] font-medium text-[#EF4444] hover:underline"
                      >
                        Supprimer
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {showDeleteModal && (
        <div className="fixed inset-0 flex items-center justify-center z-[100]">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setShowDeleteModal(null)}
          />
          <div className="bg-white rounded-[12px] p-8 w-[480px] relative z-[101] shadow-xl">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-red-100 text-[#EF4444] rounded-full flex items-center justify-center flex-shrink-0 text-xl">
                ⚠️
              </div>
              <div>
                <h3 className="text-[18px] font-bold text-gray-900">
                  Confirmer la suppression
                </h3>
                <p className="text-[14px] text-[#4B5563] mt-1">
                  Cette action est irréversible. Voulez-vous vraiment supprimer
                  cet employé ?
                </p>
              </div>
            </div>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowDeleteModal(null)}
                className="h-[40px] px-6 border border-[#E5E7EB] text-[#4B5563] rounded-[8px] font-semibold hover:bg-[#F9FAFB] transition-colors"
              >
                Annuler
              </button>
              <button
                onClick={async () => {
                  try {
                    await api.deleteEmployee(showDeleteModal);
                  } finally {
                    setShowDeleteModal(null);
                    fetchEmployees();
                  }
                }}
                className="h-[40px] px-6 bg-[#EF4444] text-white rounded-[8px] font-semibold hover:bg-red-700 transition-colors"
              >
                Supprimer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
