import { FormEvent, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useAuth } from "@/context/AuthContext";
import { apiErrorMessage } from "@/lib/api";

export default function AdminLogin() {
  const { login, admin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation() as { state?: { from?: { pathname: string } } };
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (admin) {
    navigate("/admin", { replace: true });
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      await login(email, password);
      toast.success("Welcome back!");
      navigate(location.state?.from?.pathname || "/admin", { replace: true });
    } catch (err) {
      setError(apiErrorMessage(err, "Invalid email or password."));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen bg-berry-dark flex items-center justify-center px-6">
      <div className="bg-paper rounded-card p-8 w-full max-w-sm">
        <span className="font-serif italic text-2xl text-berry-dark block text-center mb-1">Esra Cakes</span>
        <p className="text-center text-ink-soft text-[13.5px] mb-7">Admin dashboard</p>

        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          <div>
            <label className="field-label">Email</label>
            <input
              type="email"
              required
              className="input-field"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoFocus
            />
          </div>
          <div>
            <label className="field-label">Password</label>
            <input
              type="password"
              required
              className="input-field"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          {error && <p className="text-[13.5px] text-red-600">{error}</p>}
          <button type="submit" disabled={submitting} className={`btn btn-primary w-full justify-center ${submitting ? "btn-disabled" : ""}`}>
            {submitting ? "Signing in…" : "Sign in"}
          </button>
        </form>
      </div>
    </div>
  );
}
