import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
})

api.interceptors.request.use((config) => {
  const storedAuth = localStorage.getItem('kameez-wala-auth')

  if (storedAuth) {
    const parsedAuth = JSON.parse(storedAuth)
    if (parsedAuth?.token) {
      config.headers.Authorization = `Bearer ${parsedAuth.token}`
    }
  }

  return config
})

export default api
