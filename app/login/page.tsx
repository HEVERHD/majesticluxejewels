"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
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
        setError(data.error || "Error al iniciar sesión");
      }
    } catch {
      setError("Error de conexión");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#0f0f0f] flex items-center justify-center px-6">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-10">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/MAJESTIClogosolo.png"
            alt="Majestic Luxe Jewels"
            className="h-16 w-auto object-contain mx-auto mb-3"
          />
          <div className="font-serif text-2xl font-semibold text-white tracking-[0.25em] uppercase mb-1">
            Majestic Luxe
          </div>
          <div className="font-serif text-[0.6rem] tracking-[0.35em] text-[#c9a84c] uppercase">
            Jewels · Admin
          </div>
        </div>

        <div className="bg-white p-10">
          <h1 className="font-serif text-2xl text-[#0f0f0f] mb-8">Iniciar sesión</h1>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="text-xs tracking-widest uppercase text-[#6b6b6b] block mb-2">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full border border-[#ddd] px-4 py-3 text-sm focus:outline-none focus:border-[#c9a84c] transition-colors"
                placeholder="admin@ejemplo.com"
              />
            </div>

            <div>
              <label className="text-xs tracking-widest uppercase text-[#6b6b6b] block mb-2">
                Contraseña
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full border border-[#ddd] px-4 py-3 text-sm focus:outline-none focus:border-[#c9a84c] transition-colors"
                placeholder="••••••••"
              />
            </div>

            {error && (
              <p className="text-red-500 text-sm bg-red-50 px-4 py-3">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#c9a84c] text-white py-4 text-sm tracking-widest uppercase hover:bg-[#9a7a2e] transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? "Ingresando..." : "Ingresar"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
