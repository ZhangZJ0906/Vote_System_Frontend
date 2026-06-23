<template>
  <div class="min-h-screen bg-slate-100 flex items-center justify-center p-6">
    <div class="w-full max-w-sm">

      <div class="text-center mb-6">
        <div class="inline-flex items-center justify-center w-14 h-14 bg-emerald-500 rounded-2xl mb-4 shadow-lg">
          <svg class="w-7 h-7 text-white" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h1 class="text-2xl font-black text-slate-800">線上投票系統</h1>
        <p class="text-sm text-slate-400 mt-1">Online Voting System</p>
      </div>

      <div class="bg-white rounded-2xl shadow-xl border border-slate-200 p-8">

        <div class="flex border-b border-slate-100 mb-6 text-center font-semibold">
          <button type="button" @click="currentTab = 'login'"
            :class="currentTab === 'login' ? 'border-b-2 border-indigo-600 text-indigo-600' : 'text-slate-400 hover:text-slate-600'"
            class="flex-1 pb-3 transition">
            帳號登入
          </button>
          <button type="button" @click="currentTab = 'register'"
            :class="currentTab === 'register' ? 'border-b-2 border-indigo-600 text-indigo-600' : 'text-slate-400 hover:text-slate-600'"
            class="flex-1 pb-3 transition">
            新用戶註冊
          </button>
        </div>

        <div v-if="errorMsg" class="mb-4 text-sm text-red-500 bg-red-50 border border-red-200 rounded-xl px-4 py-3">
          {{ errorMsg }}
        </div>

        <div v-if="currentTab === 'login'">
          <div class="mb-5">
            <label class="block text-sm font-semibold text-slate-600 mb-1.5">帳號</label>
            <div class="relative">
              <span class="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round"
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </span>
              <input v-model="loginForm.email" type="text" required placeholder="請輸入Email" @keyup.enter="handleLogin"
                class="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 text-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent transition" />
            </div>
          </div>

          <div class="mb-6">
            <label class="block text-sm font-semibold text-slate-600 mb-1.5">密碼</label>
            <div class="relative">
              <span class="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round"
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </span>
              <input v-model="loginForm.password" :type="showPw ? 'text' : 'password'" placeholder="請輸入密碼" required
                @keyup.enter="handleLogin"
                class="w-full pl-10 pr-11 py-3 rounded-xl border border-slate-200 text-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent transition" />
              <button type="button" @click="showPw = !showPw"
                class="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition">
                <svg v-if="!showPw" class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2"
                  viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path stroke-linecap="round" stroke-linejoin="round"
                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                <svg v-else class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round"
                    d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                </svg>
              </button>
            </div>
          </div>

          <button @click="handleLogin" :disabled="loading"
            class="w-full py-3 px-4 bg-indigo-600 text-white font-semibold rounded-xl shadow-md hover:bg-indigo-700 active:scale-95 transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed">
            <span v-if="loading">登入中...</span>
            <span v-else>登入</span>
          </button>
        </div>

        <div v-else>
          <div class="mb-4">
            <label class="block text-sm font-semibold text-slate-600 mb-1.5">帳號名稱</label>
            <div class="relative">
              <span class="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round"
                    d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </span>
              <input v-model="registerForm.username" type="text" required placeholder="請輸入使用者名稱"
                @keyup.enter="handleRegister"
                class="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 text-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition" />
            </div>
          </div>

          <div class="mb-4">
            <label class="block text-sm font-semibold text-slate-600 mb-1.5">電子郵件</label>
            <div class="relative">
              <span class="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round"
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </span>
              <input v-model="registerForm.email" type="email" required placeholder="請輸入Email"
                @keyup.enter="handleRegister"
                class="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 text-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition" />
            </div>
          </div>

          <div class="mb-4">
            <label class="block text-sm font-semibold text-slate-600 mb-1.5">密碼</label>
            <div class="relative">
              <span class="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round"
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </span>
              <input v-model="registerForm.password" :type="showPw ? 'text' : 'password'" placeholder="請設定密碼" required
                @keyup.enter="handleRegister"
                class="w-full pl-10 pr-11 py-3 rounded-xl border border-slate-200 text-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition" />
            </div>
          </div>

          <div class="mb-6">
            <label class="block text-sm font-semibold text-slate-600 mb-1.5">確認密碼</label>
            <div class="relative">
              <span class="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round"
                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </span>
              <input v-model="registerForm.confirmPassword" :type="showPw ? 'text' : 'password'" placeholder="請再次輸入密碼"
                required @keyup.enter="handleRegister"
                class="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 text-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition" />
            </div>
          </div>

          <button @click="handleRegister" :disabled="loading"
            class="w-full py-3 px-4 bg-emerald-600 text-white font-semibold rounded-xl shadow-md hover:bg-emerald-700 active:scale-95 transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed">
            <span v-if="loading">註冊中...</span>
            <span v-else>建立帳號</span>
          </button>
        </div>

      </div>
    </div>
  </div>
</template>

<script setup lang="js">
import { ref, reactive } from 'vue'
import { useHttpClient } from '@/Services/httpClient'
import Swal from 'sweetalert2'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const { postApi } = useHttpClient()
const router = useRouter()
// 控制當前分頁：'login' 或 'register'
const currentTab = ref('login')

const showPw = ref(false)
const errorMsg = ref('')
const loading = ref(false)

//  登入專用表單資料
const loginForm = reactive({
  email: '',
  password: ''
})

//  註冊專用表單資料
const registerForm = reactive({
  username: '',
  email: '',
  password: '',
  confirmPassword: ''
})

// ==================== 處理登入 ====================
const handleLogin = async () => {
  if (!loginForm.email || !loginForm.password) return

  try {
    loading.value = true
    errorMsg.value = ''

    const res = await postApi('api/user/login', loginForm)

    if (res && res.code === 200) {
      const authStore = useAuthStore()
      authStore.setAuth(res)
      Swal.fire({
        icon: 'success', title: '登入成功', timer: 1500, showConfirmButton: false
      }).then(() => {
        router.push('/vote') // 這次守衛就會放行了！
      })

      return

    } else {
      Swal.fire({ icon: 'error', title: '登入錯誤', text: '帳號或密碼錯誤' })
    }
  } catch {
    Swal.fire({ icon: 'error', title: '登入錯誤', text: '伺服器連線失敗' })
  } finally {
    loading.value = false
  }
}

// ====================  處理註冊 ====================
const handleRegister = async () => {

  if (!registerForm.username || !registerForm.email || !registerForm.password || !registerForm.confirmPassword) {
    Swal.fire({ icon: 'warning', title: '提示', text: '請填寫所有必要欄位' })
    return
  }


  if (registerForm.password !== registerForm.confirmPassword) {
    Swal.fire({ icon: 'error', title: '註冊失敗', text: '兩次輸入的密碼不一致！' })
    return
  }

  try {
    loading.value = true
    errorMsg.value = ''


    const submitData = {
      username: registerForm.username,
      email: registerForm.email,
      password: registerForm.password
    }

    const res = await postApi('api/user/register', submitData)

    if (res && res.code === 200) {
      Swal.fire({ icon: 'success', title: '註冊成功！', text: '請使用新帳號登入。' })

      loginForm.email = registerForm.email
      currentTab.value = 'login'


      registerForm.username = ''
      registerForm.email = ''
      registerForm.password = ''
      registerForm.confirmPassword = ''
    } else {
      Swal.fire({ icon: 'error', title: '註冊失敗', text: res.message || '該 Email 可能已被註冊' })
    }
  } catch {
    Swal.fire({ icon: 'error', title: '系統錯誤', text: '伺服器連線失敗' })
  } finally {
    loading.value = false
  }
}
</script>
