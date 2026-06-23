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
  const getApi = async (url, config = {}) => {
    const res = await httpClient.get(url, config)
    return res.data
  }

  const postApi = async (url, data = {}, config = {}) => {
    const res = await httpClient.post(url, data, config)
    return res.data
  }

  const putApi = async (url, data = {}, config = {}) => {
    const res = await httpClient.put(url, data, config)
    return res.data
  }

  const deleteApi = async (url, config = {}) => {
    const res = await httpClient.delete(url, config)
    return res.data
  }

  return {
    getApi,
    postApi,
    putApi,
    deleteApi,
  }
}
