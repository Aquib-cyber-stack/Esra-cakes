import { useState } from "react";
import { Link, NavLink } from "react-router-dom";

const links = [
  { to: "/", label: "Home" },
  { to: "/gallery", label: "Gallery" },
  { to: "/about", label: "About" },
  { to: "/contact", label: "Contact" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-cream/90 backdrop-blur-md border-b border-berry-dark/[0.08]">
      <div className="wrap">
        <nav className="flex items-center justify-between py-4">
          <Link to="/" className="font-serif italic font-semibold text-2xl text-berry-dark">
            Esra Cakes
          </Link>

          <div className="hidden md:flex items-center gap-8">
            {links.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                className={({ isActive }) =>
                  `text-[14.5px] font-medium relative py-1 group ${isActive ? "text-berry" : "text-ink"}`
                }
              >
                {({ isActive }) => (
                  <>
                    {l.label}
                    <span
                      className={`absolute left-0 right-0 -bottom-0.5 h-0.5 bg-gold origin-left transition-transform duration-200 ${
                        isActive ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
                      }`}
                    />
                  </>
                )}
              </NavLink>
            ))}
          </div>

          <div className="flex items-center gap-4">
            <Link to="/order" className="btn btn-primary hidden sm:inline-flex">
              Start your order
            </Link>
            <button
              className="md:hidden p-1.5"
              aria-label="Open menu"
              onClick={() => setOpen((o) => !o)}
            >
              <span className="block w-6 h-0.5 bg-berry-dark mb-1.5 rounded" />
              <span className="block w-6 h-0.5 bg-berry-dark mb-1.5 rounded" />
              <span className="block w-6 h-0.5 bg-berry-dark rounded" />
            </button>
          </div>
        </nav>

        {open && (
          <div className="md:hidden flex flex-col gap-4 pb-6 border-b border-berry-dark/[0.08]">
            {links.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                onClick={() => setOpen(false)}
                className={({ isActive }) => `text-[15px] font-medium ${isActive ? "text-berry" : "text-ink"}`}
              >
                {l.label}
              </NavLink>
            ))}
            <Link to="/order" onClick={() => setOpen(false)} className="btn btn-primary self-start">
              Start your order
            </Link>
          </div>
        )}
      </div>
    </header>
  );
}
