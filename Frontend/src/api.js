import axios from 'axios'

const backendUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000'

export const api = axios.create({
  baseURL: backendUrl,
  withCredentials: true,
})
