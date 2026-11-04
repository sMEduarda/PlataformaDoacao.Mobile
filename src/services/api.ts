import axios from 'axios';
import * as SecureStore from 'expo-secure-store';

// ======================================================
// ATENÇÃO: Troque este endereço pelo IP da sua máquina
// ou pelo link do ngrok quando a API estiver rodando.
// ======================================================
const API_URL = 'http://SEU_IP_AQUI:PORTA/api'; 
// Exemplo: 'http://192.168.1.10:5000/api'
// ou 'https://xxxx.ngrok-free.app/api'

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor: coloca o token JWT automaticamente em todas as requisições
api.interceptors.request.use(async (config) => {
  const token = await SecureStore.getItemAsync('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;