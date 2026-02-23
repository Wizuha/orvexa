import { useRole } from "../context/RoleContext";

const ROLE_COLORS = {
  RH: "bg-indigo/10 text-indigo",
  Manager: "bg-amber/10 text-amber",
  Salarié: "bg-emerald/10 text-emerald",
};

export default function Topbar({ title }) {
  const { role, setRole } = useRole();

  return (
    <header className="h-[64px] bg-white border-b border-[#E5E7EB] flex items-center justify-between px-8 flex-shrink-0">
      <h1 className="text-[18px] font-bold text-gray-900">{title}</h1>

      <div className="flex items-center gap-4">
        {/* Badge rôle */}
        <span
          className={`px-3 py-1 rounded-full text-[12px] font-bold uppercase tracking-wider ${ROLE_COLORS[role]}`}
        >
          {role}
        </span>

        {/* Role switcher */}
        <div className="flex items-center gap-2">
          <span className="text-[12px] text-[#4B5563] font-medium">
            Rôle actif :
          </span>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="h-[32px] px-2 bg-white border border-[#E5E7EB] rounded-[6px] text-[13px] font-medium text-gray-900 focus:outline-none focus:border-indigo cursor-pointer"
          >
            <option value="RH">RH</option>
            <option value="Manager">Manager</option>
            <option value="Salarié">Salarié</option>
          </select>
        </div>
      </div>
    </header>
  );
}
