import React, { useState, useEffect } from "react";
import { Logo, Input, Button } from "../components";
import { signIn } from "../services/authService";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export function Login() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");
  const [loading, setLoading] = useState(false);
  const [demorou, setDemorou] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  // Ping para acordar a API assim que o usuário abre o login
  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_BASE_URL}/greeting?name=ping`).catch(() => {});
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault(); setErro(""); setLoading(true); setDemorou(false);

    const timer = setTimeout(() => setDemorou(true), 3000);

    try {
      const data = await signIn(email, senha);
      login(data.token);
      navigate("/map");
    } catch (err) {
      setErro(err.message);
    } finally {
      clearTimeout(timer);
      setLoading(false);
      setDemorou(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-violet-700 via-purple-800 to-violet-900">
      <div className="flex-1 flex flex-col items-center justify-center px-6 pt-16 pb-8">
        <div className="mb-8">
          <Logo />
          <p className="text-center text-purple-200 text-sm mt-2">Acompanhe rotas em tempo real</p>
        </div>
        <div className="w-full bg-white rounded-3xl p-6 shadow-2xl shadow-purple-900/50">
          <h2 className="text-xl font-bold text-gray-800 mb-1">Bem-vindo de volta!</h2>
          <p className="text-sm text-gray-500 mb-6">Faça login para continuar</p>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input label="E-mail" placeholder="seu@email.com" type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
              icon={<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/></svg>}
            />
            <Input label="Senha" placeholder="••••••••" type="password" required value={senha} onChange={(e) => setSenha(e.target.value)}
              icon={<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z"/></svg>}
            />

            {erro && (
              <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 flex items-center gap-2">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="#EF4444"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/></svg>
                <p className="text-red-600 text-sm font-medium">{erro}</p>
              </div>
            )}

            {demorou && !erro && (
              <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 flex items-center gap-2">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="#F59E0B"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/></svg>
                <p className="text-amber-700 text-xs font-medium">
                  A API está acordando do modo inativo. Aguarde alguns segundos...
                </p>
              </div>
            )}

            <div className="pt-2">
              <Button type="submit" disabled={loading}>{loading ? "Entrando..." : "Entrar"}</Button>
            </div>
          </form>
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-500">Não tem conta? <Link to="/register" className="text-violet-600 font-semibold hover:underline">Cadastre-se</Link></p>
          </div>
        </div>
      </div>
      <div className="text-center pb-8"><p className="text-purple-300 text-xs">© 2025 Mobpasso</p></div>
    </div>
  );
}