import { useState } from "react";
import { useRouter } from "next/router";
import { useRole } from "../context/RoleContext";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(false);
  const { login, setRole } = useRole();
  const router = useRouter();

  const handleLogin = (e) => {
    e.preventDefault();
    if (email && password) {
      if (email.toLowerCase().includes("manager")) setRole("Manager");
      else if (
        email.toLowerCase().includes("employe") ||
        email.toLowerCase().includes("salarie")
      )
        setRole("Salarié");
      else setRole("RH");
      login();
      router.push("/dashboard");
    } else {
      setError(true);
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-[#F9FAFB] p-4">
      <div className="w-full max-w-[440px] bg-white p-[40px] rounded-[12px] shadow-[0_4px_24px_rgba(0,0,0,0.08)]">
        <div className="text-center mb-[32px]">
          <div className="w-12 h-12 bg-indigo/10 text-indigo rounded-[10px] mx-auto flex items-center justify-center font-black text-xl mb-4">
            O
          </div>
          <h1 className="text-[24px] font-bold text-gray-900">Orvexa</h1>
          <p className="text-[14px] text-[#4B5563] mt-1">Plateforme RH B2B</p>
        </div>
        <form onSubmit={handleLogin} className="space-y-[20px]">
          <div>
            <label className="block text-[12px] font-medium text-[#4B5563] uppercase tracking-wider mb-1.5">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setError(false);
              }}
              className={`w-full h-[40px] px-3 border rounded-[6px] text-[14px] focus:outline-none transition-colors ${
                error
                  ? "border-[#EF4444]"
                  : "border-[#E5E7EB] focus:border-indigo"
              }`}
              placeholder="email@orvexa.fr"
            />
          </div>
          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="text-[12px] font-medium text-[#4B5563] uppercase tracking-wider">
                Mot de passe
              </label>
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-[12px] text-[#4B5563] hover:text-indigo transition-colors"
              >
                {showPassword ? "Masquer" : "Afficher"}
              </button>
            </div>
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError(false);
              }}
              className={`w-full h-[40px] px-3 border rounded-[6px] text-[14px] focus:outline-none transition-colors ${
                error
                  ? "border-[#EF4444]"
                  : "border-[#E5E7EB] focus:border-indigo"
              }`}
              placeholder="••••••••"
            />
            <div className="mt-2 text-right">
              <button
                type="button"
                className="text-[13px] text-indigo font-medium hover:underline"
              >
                Mot de passe oublié ?
              </button>
            </div>
          </div>
          <button
            type="submit"
            className="w-full h-[44px] bg-indigo text-white rounded-[8px] font-bold uppercase tracking-wider hover:bg-indigo-dark transition-colors shadow-sm"
          >
            Se connecter
          </button>
          {error && (
            <div className="animate-slide-in p-3 bg-[#EF4444]/10 border-l-[3px] border-[#EF4444] rounded-r-[4px] text-[#EF4444] text-[13px] font-medium">
              Identifiants incorrects. Veuillez réessayer.
            </div>
          )}
        </form>
        <p className="text-center text-[11px] text-[#9CA3AF] mt-6">
          Astuce : utilisez "rh@", "manager@" ou "salarie@" pour changer de rôle
        </p>
      </div>
    </div>
  );
}
