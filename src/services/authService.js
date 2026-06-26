import axios from 'axios';
const BASE_URL = import.meta.env.VITE_API_BASE_URL;

// POST /auth/signin
export async function signIn(email, password) {
  try {
    const response = await axios.post(`${BASE_URL}/auth/signin`, { email, password });
    return { token: response.data };
  } catch (error) {
    if (error.response?.status === 400) throw new Error(error.response.data || 'Requisição inválida.');
    if (error.response?.status === 401) throw new Error('E-mail ou senha incorretos.');
    throw new Error('Erro ao autenticar. Tente novamente.');
  }
}

// POST /auth/signup
export async function signUp(name, email, password) {
  try {
    const response = await axios.post(`${BASE_URL}/auth/signup`, { name, email, password });
    return response.data;
  } catch (error) {
    if (error.response?.status === 400) throw new Error(error.response.data || 'Dados inválidos. Verifique os campos.');
    if (error.response?.status === 409) throw new Error('E-mail já cadastrado.');
    throw new Error('Erro ao cadastrar. Tente novamente.');
  }
}