import axios from 'axios'
import { useAuthStore } from '@/stores/auth'
const httpClient = axios.create({
  baseURL: 'http://localhost:8080/',
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json',
  },
})

httpClient.interceptors.request.use(
  (config) => {
    const authStore = useAuthStore()
    if (authStore.token) {
      config.headers.Authorization = `Bearer ${authStore.token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)
export function useHttpClient() {
  const getApi = (url, config = {}) => {
    return httpClient.get(url, config).then((res) => res.data)
  }

  const postApi = (url, data = {}, config = {}) => {
    return httpClient.post(url, data, config).then((res) => res.data)
  }

  const putApi = (url, data = {}, config = {}) => {
    return httpClient.put(url, data, config).then((res) => res.data)
  }

  const deleteApi = (url, config = {}) => {
    return httpClient.delete(url, config).then((res) => res.data)
  }

  return {
    getApi,
    postApi,
    putApi,
    deleteApi,
  }
}
