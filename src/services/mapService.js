import axios from 'axios';
const BASE_URL = `${import.meta.env.VITE_API_BASE_URL}/ws/point`;
const authHeader = (token) => ({ Authorization: `Bearer ${token}` });

// GET /ws/point
export async function getPoints(token) {
  try {
    const response = await axios.get(BASE_URL, { headers: authHeader(token) });
    return response.data.map(p => ({
      id: p.id,
      lineNumber: p.lineNumber,
      lineName: p.lineName,
      description: p.description,
      title: `Linha ${p.lineNumber} — ${p.lineName}`,
      position: { lat: p.latitude, lng: p.longitude },
    }));
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Erro ao buscar paradas.');
  }
}

// POST /ws/point  { latitude, longitude, lineNumber, lineName, description }
export async function postPoint(token, pointData) {
  try {
    const response = await axios.post(BASE_URL, pointData, { headers: authHeader(token) });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Erro ao criar parada.');
  }
}

// PUT /ws/point/{id}
export async function updatePoint(token, id, pointData) {
  try {
    const response = await axios.put(`${BASE_URL}/${id}`, pointData, { headers: authHeader(token) });
    return response.data;
  } catch (error) {
    if (error.response?.status === 403) throw new Error('Sem permissão para editar esta parada.');
    throw new Error(error.response?.data?.message || 'Erro ao atualizar parada.');
  }
}

// DELETE /ws/point/{id}
export async function deletePoint(token, id) {
  try {
    await axios.delete(`${BASE_URL}/${id}`, { headers: authHeader(token) });
    return true;
  } catch (error) {
    if (error.response?.status === 403) throw new Error('Sem permissão para remover esta parada.');
    throw new Error(error.response?.data?.message || 'Erro ao remover parada.');
  }
}
