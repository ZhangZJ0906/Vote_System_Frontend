import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useAuthStore = defineStore('auth', () => {
  const token = ref(localStorage.getItem('token') || '')
  const role  = ref(localStorage.getItem('role')  || '')
  const username = ref(localStorage.getItem('username') || '')

  function setAuth(data) {
    token.value    = data.token
    role.value     = data.role
    username.value = data.username
    localStorage.setItem('token',    data.token)
    localStorage.setItem('role',     data.role)
    localStorage.setItem('username', data.username)
  }

  function clearAuth() {
    token.value    = ''
    role.value     = ''
    username.value = ''
    localStorage.removeItem('token')
    localStorage.removeItem('role')
    localStorage.removeItem('username')
  }

  return { token, role, username, setAuth, clearAuth }
})
