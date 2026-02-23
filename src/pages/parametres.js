import { useState } from "react";

export default function ParametresPage() {
  const [password, setPassword] = useState("");
  const getStrength = () => {
    if (!password) return { width: "0%", color: "bg-transparent" };
    if (password.length < 6) return { width: "33%", color: "bg-[#EF4444]" };
    if (password.length < 10) return { width: "66%", color: "bg-[#F59E0B]" };
    return { width: "100%", color: "bg-[#10B981]" };
  };
  const strength = getStrength();

  return (
    <div className="flex flex-col items-center space-y-[24px]">
      <div className="w-full max-w-[600px] bg-white rounded-[10px] border border-[#E5E7EB] shadow-sm p-[32px]">
        <div className="border-b border-[#E5E7EB] pb-4 mb-[16px]">
          <h2 className="text-[18px] font-semibold">Mon profil</h2>
        </div>
        <form className="space-y-6">
          <div className="flex items-center gap-6 pb-4">
            <div className="relative">
              <div className="w-20 h-20 bg-[#F3F4F6] rounded-full border-2 border-white shadow-sm flex items-center justify-center text-[#9CA3AF] text-3xl">
                👤
              </div>
              <button
                type="button"
                className="absolute -bottom-1 -right-1 w-8 h-8 bg-white border border-[#E5E7EB] rounded-full flex items-center justify-center text-[#4B5563] hover:text-indigo shadow-sm transition-colors"
              >
                📷
              </button>
            </div>
            <div>
              <p className="text-[16px] font-bold text-gray-900">Jean Dupont</p>
              <p className="text-[13px] text-[#4B5563]">
                Développeur Senior (Tech)
              </p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-[12px] font-medium text-[#4B5563] uppercase tracking-wider">
                Email
              </label>
              <input
                type="email"
                defaultValue="j.dupont@orvexa.fr"
                className="w-full h-[40px] px-3 border border-[#E5E7EB] rounded-[6px] text-[14px] focus:outline-none focus:border-indigo transition-colors"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[12px] font-medium text-[#4B5563] uppercase tracking-wider">
                Téléphone
              </label>
              <input
                type="tel"
                defaultValue="06 12 34 56 78"
                className="w-full h-[40px] px-3 border border-[#E5E7EB] rounded-[6px] text-[14px] focus:outline-none focus:border-indigo transition-colors"
              />
            </div>
          </div>
          <div className="flex justify-end">
            <button
              type="button"
              className="min-w-[160px] h-[40px] px-6 bg-indigo text-white rounded-[8px] font-bold text-[14px] hover:bg-indigo-dark transition-colors"
            >
              Enregistrer
            </button>
          </div>
        </form>
      </div>

      <div className="w-full max-w-[600px] bg-white rounded-[10px] border border-[#E5E7EB] shadow-sm p-[32px]">
        <div className="border-b border-[#E5E7EB] pb-4 mb-[16px]">
          <h2 className="text-[18px] font-semibold">🔒 Sécurité</h2>
        </div>
        <form className="space-y-6">
          <div className="space-y-1.5">
            <label className="text-[12px] font-medium text-[#4B5563] uppercase tracking-wider">
              Ancien mot de passe
            </label>
            <input
              type="password"
              placeholder="••••••••"
              className="w-full h-[40px] px-3 border border-[#E5E7EB] rounded-[6px] text-[14px] focus:outline-none focus:border-indigo transition-colors"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-[12px] font-medium text-[#4B5563] uppercase tracking-wider">
              Nouveau mot de passe
            </label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full h-[40px] px-3 border border-[#E5E7EB] rounded-[6px] text-[14px] focus:outline-none focus:border-indigo transition-colors"
            />
            <div className="w-full h-[4px] bg-[#F3F4F6] rounded-full mt-2 overflow-hidden">
              <div
                className={`h-full transition-all duration-300 ${strength.color}`}
                style={{ width: strength.width }}
              />
            </div>
            <p className="text-[11px] text-[#9CA3AF] mt-1">
              Utilisez au moins 8 caractères avec des chiffres et symboles.
            </p>
          </div>
          <div className="space-y-1.5">
            <label className="text-[12px] font-medium text-[#4B5563] uppercase tracking-wider">
              Confirmer le mot de passe
            </label>
            <input
              type="password"
              placeholder="••••••••"
              className="w-full h-[40px] px-3 border border-[#E5E7EB] rounded-[6px] text-[14px] focus:outline-none focus:border-indigo transition-colors"
            />
          </div>
          <div className="flex justify-end">
            <button
              type="button"
              className="min-w-[160px] h-[40px] px-6 bg-indigo text-white rounded-[8px] font-bold text-[14px] hover:bg-indigo-dark transition-colors"
            >
              Mettre à jour
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
