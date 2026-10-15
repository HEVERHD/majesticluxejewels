"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.SyntheticEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      if (res.ok) {
        router.push("/admin");
      } else {
        const data = await res.json();
        setError(data.error || "Credenciales incorrectas");
      }
    } catch {
      setError("Error de conexión. Intenta de nuevo.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex flex-col items-center justify-center px-6">
      {/* Subtle grid background */}
      <div
        className="fixed inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "repeating-linear-gradient(0deg,#c9a84c,#c9a84c 1px,transparent 1px,transparent 60px),repeating-linear-gradient(90deg,#c9a84c,#c9a84c 1px,transparent 1px,transparent 60px)",
        }}
      />

      <div className="w-full max-w-sm relative">
        {/* Logo */}
        <div className="text-center mb-10">
          <div className="w-20 h-20 rounded-full bg-[#0f0f0f] border border-[#c9a84c]/30 overflow-hidden flex items-center justify-center mx-auto mb-5">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/logoOficial.jpeg"
              alt="Majestic Luxe Jewels"
              className="w-full h-full object-cover"
            />
          </div>
          <h1 className="font-serif text-xl font-semibold text-white tracking-[0.2em] uppercase">
            Majestic Luxe
          </h1>
          <p className="text-[0.6rem] tracking-[0.4em] text-[#c9a84c] uppercase mt-1">
            Panel de administración
          </p>
        </div>

        {/* Card */}
        <div className="bg-[#111111] border border-white/8 p-8">
          <p className="text-xs tracking-[0.25em] uppercase text-[#c9a84c] mb-6">
            Acceso seguro
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div>
              <label className="block text-[10px] tracking-[0.2em] uppercase text-gray-500 mb-2">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
                className="w-full bg-[#0a0a0a] border border-white/10 text-white text-sm px-4 py-3 focus:outline-none focus:border-[#c9a84c] transition-colors placeholder:text-gray-700"
                placeholder="admin@majesticluxe.com"
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-[10px] tracking-[0.2em] uppercase text-gray-500 mb-2">
                Contraseña
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                  className="w-full bg-[#0a0a0a] border border-white/10 text-white text-sm px-4 py-3 pr-11 focus:outline-none focus:border-[#c9a84c] transition-colors placeholder:text-gray-700"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 hover:text-gray-400 transition-colors"
                  aria-label={showPassword ? "Ocultar contraseña" : "Ver contraseña"}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Error */}
            {error && (
              <div className="flex items-center gap-2 bg-red-950/50 border border-red-800/50 px-4 py-3">
                <span className="w-1.5 h-1.5 bg-red-500 rounded-full shrink-0" />
                <p className="text-red-400 text-xs">{error}</p>
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#c9a84c] text-white py-3.5 text-xs tracking-[0.2em] uppercase font-medium hover:bg-[#9a7a2e] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-2"
            >
              {loading ? (
                <>
                  <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Verificando...
                </>
              ) : (
                "Ingresar"
              )}
            </button>
          </form>
        </div>

        <p className="text-center text-[10px] text-gray-700 mt-6">
          Majestic Luxe Jewels © {new Date().getFullYear()}
        </p>
      </div>
    </div>
  );
}
