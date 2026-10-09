import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="py-11">
      <div className="wrap">
        <div className="flex flex-wrap items-center justify-between gap-4 border-t border-berry-dark/10 pt-7">
          <span className="font-serif italic text-[19px] text-berry-dark">Esra Cakes</span>
          <div className="flex flex-wrap gap-6 text-[13.5px] text-ink-soft">
            <Link to="/gallery" className="hover:text-berry">Gallery</Link>
            <Link to="/about" className="hover:text-berry">About</Link>
            <Link to="/contact" className="hover:text-berry">Contact</Link>
            <Link to="/order" className="hover:text-berry">Order</Link>
          </div>
          <span className="text-[13.5px] text-ink-soft">© {new Date().getFullYear()} Esra Cakes. Baked to order.</span>
        </div>
      </div>
    </footer>
  );
}
