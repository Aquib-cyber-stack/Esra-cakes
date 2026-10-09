import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-cream px-6">
      <div className="text-center max-w-md">
        <span className="font-serif italic text-berry text-[80px] leading-none">404</span>
        <h1 className="heading text-[26px] mt-4 mb-3">This slice doesn't exist.</h1>
        <p className="text-ink-soft mb-8">
          The page you're looking for may have been moved, renamed, or never baked in the first place.
        </p>
        <Link to="/" className="btn btn-primary">
          Back to home
        </Link>
      </div>
    </div>
  );
}
