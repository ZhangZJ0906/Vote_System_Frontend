import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useAuthStore = defineStore('auth', () => {
  const role = ref(localStorage.getItem('role') || '')
  const username = ref(localStorage.getItem('username') || '')
  const userId = ref(localStorage.getItem('id') || '')
  const isLoggedIn = computed(() => !!username.value)

  function setAuth(data) {
    userId.value = data.id
    role.value = data.role || 'user'
    username.value = data.username

    localStorage.setItem('role', role.value)
    localStorage.setItem('id', data.id)
    localStorage.setItem('username', data.username)
  }

  // 登出時清空資料
  function clearAuth() {
    role.value = ''
    username.value = ''
    userId.value = ''
    localStorage.removeItem('role')
    localStorage.removeItem('username')
    localStorage.removeItem('id')
    localStorage.removeItem('user')
  }

  return { userId, role, username, isLoggedIn, setAuth, clearAuth }
})
