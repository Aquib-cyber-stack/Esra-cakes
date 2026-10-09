import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

const links = [
  { to: "/admin", label: "Dashboard", end: true },
  { to: "/admin/orders", label: "Orders" },
  { to: "/admin/cakes", label: "Cakes" },
  { to: "/admin/reviews", label: "Reviews" },
  { to: "/admin/messages", label: "Messages" },
];

export default function AdminSidebar() {
  const { admin, logout } = useAuth();
  const navigate = useNavigate();

  async function handleLogout() {
    await logout();
    navigate("/admin/login");
  }

  return (
    <aside className="w-full md:w-60 shrink-0 md:min-h-screen bg-berry-dark text-cream flex md:flex-col">
      <div className="p-6 hidden md:block">
        <span className="font-serif italic text-xl">Esra Cakes</span>
        <p className="text-[12px] text-cream/60 mt-0.5">Admin dashboard</p>
      </div>
      <nav className="flex md:flex-col gap-1 p-3 md:p-3 md:flex-1 overflow-x-auto">
        {links.map((l) => (
          <NavLink
            key={l.to}
            to={l.to}
            end={l.end}
            className={({ isActive }) =>
              `px-4 py-2.5 rounded-lg text-[14px] font-medium whitespace-nowrap transition-colors ${
                isActive ? "bg-cream/15 text-cream" : "text-cream/70 hover:bg-cream/10 hover:text-cream"
              }`
            }
          >
            {l.label}
          </NavLink>
        ))}
      </nav>
      <div className="p-4 hidden md:block border-t border-cream/10">
        <p className="text-[13px] text-cream/70 truncate">{admin?.name}</p>
        <button onClick={handleLogout} className="text-[13px] font-semibold text-gold hover:underline mt-1">
          Log out
        </button>
      </div>
    </aside>
  );
}
