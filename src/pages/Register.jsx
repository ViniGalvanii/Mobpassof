import React, { useState } from "react";
import { Logo, Input, Button } from "../components";
import { Link, useNavigate } from "react-router-dom";
import { signUp } from "../services/authService";
export function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault(); setErro(""); setLoading(true);
    try { await signUp(name, email, senha); navigate("/login"); }
    catch (err) { setErro(err.message); }
    finally { setLoading(false); }
  };
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-violet-700 via-purple-800 to-violet-900">
      <div className="flex-1 flex flex-col items-center justify-center px-6 pt-12 pb-8">
        <div className="mb-6"><Logo /></div>
        <div className="w-full bg-white rounded-3xl p-6 shadow-2xl shadow-purple-900/50">
          <h2 className="text-xl font-bold text-gray-800 mb-1">Criar conta</h2>
          <p className="text-sm text-gray-500 mb-6">Junte-se ao Mobpasso hoje</p>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input label="Nome completo" placeholder="Seu nome" type="text" required value={name} onChange={e=>setName(e.target.value)}
              icon={<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>}
            />
            <Input label="E-mail" placeholder="seu@email.com" type="email" required value={email} onChange={e=>setEmail(e.target.value)}
              icon={<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/></svg>}
            />
            <Input label="Senha" placeholder="Ex: Senha123" type="password" required value={senha} onChange={e=>setSenha(e.target.value)}
              icon={<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z"/></svg>}
            />
            <p className="text-xs text-gray-400">A senha deve ter letras maiúsculas, minúsculas e números.</p>
            {erro && <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 flex items-center gap-2"><svg width="16" height="16" viewBox="0 0 24 24" fill="#EF4444"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/></svg><p className="text-red-600 text-sm font-medium">{erro}</p></div>}
            <div className="pt-2"><Button type="submit" disabled={loading}>{loading?"Cadastrando...":"Criar conta"}</Button></div>
          </form>
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-500">Já tem conta? <Link to="/login" className="text-violet-600 font-semibold hover:underline">Fazer login</Link></p>
          </div>
        </div>
      </div>
    </div>
  );
}
