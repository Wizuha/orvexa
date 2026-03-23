import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { api } from "../../lib/api";

export default function NouvelEmployePage() {
  const [success, setSuccess] = useState(false);
  const [isActive, setIsActive] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    lastName: "",
    firstName: "",
    email: "",
    department: "",
    position: "",
    contractType: "CDI",
  });
  const router = useRouter();

  const handleChange = (e) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  };

  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => {
        setSuccess(false);
        router.push("/employes");
      }, 2500);
      return () => clearTimeout(timer);
    }
  }, [success, router]);

  return (
    <div className="flex flex-col items-center">
      {success && (
        <div className="w-full max-w-[700px] mb-6 p-4 bg-[#10B981]/10 border-l-[3px] border-[#10B981] rounded-r-[6px] flex items-center gap-3 animate-slide-in">
          <span className="text-[#10B981] text-lg">✓</span>
          <span className="text-[14px] font-semibold text-[#10B981]">
            Employé créé avec succès !
          </span>
        </div>
      )}
      <div className="w-full max-w-[700px] bg-white rounded-[12px] border border-[#E5E7EB] shadow-sm p-[40px]">
        <h2 className="text-[24px] font-bold mb-8">
          Informations de l'employé
        </h2>
        <form
          onSubmit={async (e) => {
            e.preventDefault();
            setError("");
            setSubmitting(true);
            try {
              await api.createEmployee({
                ...form,
                status: isActive ? "Actif" : "Inactif",
              });
              setSuccess(true);
              window.scrollTo({ top: 0, behavior: "smooth" });
            } catch (err) {
              setError(err.message || "Erreur lors de la création de l'employé.");
            } finally {
              setSubmitting(false);
            }
          }}
          className="space-y-[20px]"
        >
          <div className="grid grid-cols-2 gap-[20px]">
            <div className="space-y-1.5">
              <label className="text-[12px] font-medium text-[#4B5563] uppercase tracking-wider">
                Nom <span className="text-[#EF4444]">*</span>
              </label>
              <input
                type="text"
                name="lastName"
                value={form.lastName}
                onChange={handleChange}
                required
                placeholder="Ex: Dupont"
                className="w-full h-[40px] px-3 border border-[#E5E7EB] rounded-[6px] text-[14px] focus:outline-none focus:border-indigo transition-colors"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[12px] font-medium text-[#4B5563] uppercase tracking-wider">
                Prénom <span className="text-[#EF4444]">*</span>
              </label>
              <input
                type="text"
                name="firstName"
                value={form.firstName}
                onChange={handleChange}
                required
                placeholder="Ex: Jean"
                className="w-full h-[40px] px-3 border border-[#E5E7EB] rounded-[6px] text-[14px] focus:outline-none focus:border-indigo transition-colors"
              />
            </div>
          </div>
          <div className="space-y-1.5">
            <label className="text-[12px] font-medium text-[#4B5563] uppercase tracking-wider">
              Email professionnel <span className="text-[#EF4444]">*</span>
            </label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              required
              placeholder="jean.dupont@orvexa.fr"
              className="w-full h-[40px] px-3 border border-[#E5E7EB] rounded-[6px] text-[14px] focus:outline-none focus:border-indigo transition-colors"
            />
          </div>
          <div className="grid grid-cols-2 gap-[20px]">
            <div className="space-y-1.5">
              <label className="text-[12px] font-medium text-[#4B5563] uppercase tracking-wider">
                Département <span className="text-[#EF4444]">*</span>
              </label>
              <div className="relative">
                <select
                  name="department"
                  value={form.department}
                  onChange={handleChange}
                  required
                  className="w-full h-[40px] px-3 appearance-none border border-[#E5E7EB] rounded-[6px] text-[14px] focus:outline-none focus:border-indigo bg-white"
                >
                  <option value="">Sélectionner...</option>
                  <option>Tech</option>
                  <option>RH</option>
                  <option>Produit</option>
                  <option>Finance</option>
                  <option>Commercial</option>
                </select>
                <span className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-[#9CA3AF] text-xs">
                  ▼
                </span>
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="text-[12px] font-medium text-[#4B5563] uppercase tracking-wider">
                Rôle / Poste <span className="text-[#EF4444]">*</span>
              </label>
              <input
                type="text"
                name="position"
                value={form.position}
                onChange={handleChange}
                required
                placeholder="Ex: Développeur Senior"
                className="w-full h-[40px] px-3 border border-[#E5E7EB] rounded-[6px] text-[14px] focus:outline-none focus:border-indigo transition-colors"
              />
            </div>
          </div>
          <div className="space-y-1.5 pt-2">
            <label className="text-[12px] font-medium text-[#4B5563] uppercase tracking-wider block mb-2">
              Statut initial
            </label>
            <div className="flex items-center gap-4">
              <span
                className={`text-[13px] font-medium ${
                  !isActive ? "text-gray-900" : "text-[#9CA3AF]"
                }`}
              >
                Inactif
              </span>
              <button
                type="button"
                onClick={() => setIsActive(!isActive)}
                className={`relative w-[48px] h-[24px] rounded-full transition-colors duration-200 focus:outline-none ${
                  isActive ? "bg-[#10B981]" : "bg-[#D1D5DB]"
                }`}
              >
                <div
                  className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full shadow transition-transform duration-200 ${
                    isActive ? "translate-x-6" : "translate-x-0"
                  }`}
                />
              </button>
              <span
                className={`text-[13px] font-medium ${
                  isActive ? "text-[#10B981]" : "text-[#9CA3AF]"
                }`}
              >
                Actif
              </span>
            </div>
          </div>
          {error && (
            <div className="p-3 bg-[#EF4444]/10 border-l-[3px] border-[#EF4444] rounded-r-[4px] text-[#EF4444] text-[13px] font-medium">
              {error}
            </div>
          )}
          <div className="pt-6 border-t border-[#E5E7EB] flex justify-end gap-[12px]">
            <button
              type="button"
              onClick={() => router.push("/employes")}
              className="min-w-[120px] h-[40px] px-4 border border-[#E5E7EB] text-[#4B5563] rounded-[8px] font-semibold text-[14px] hover:bg-[#F9FAFB] transition-colors"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="min-w-[160px] h-[40px] px-6 bg-indigo text-white rounded-[8px] font-bold text-[14px] hover:bg-indigo-dark transition-colors shadow-sm disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {submitting ? "Création..." : "Créer l'employé"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
