<template>
  <nav class="w-full bg-slate-900 text-slate-100 shadow-md border-b border-slate-800">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
      <RouterLink to="/">

        <div class="flex items-center space-x-2">
          <span
            class="text-xl font-black tracking-wider text-indigo-400 bg-indigo-950/50 px-3 py-1.5 rounded-lg border border-indigo-800/50">
            VOTE
          </span>
          <h1 class="text-lg font-bold tracking-wide hidden sm:block">
            線上投票系統
          </h1>
        </div>
      </RouterLink>
      <div class="flex items-center space-x-4">
        <template v-if="isLoggedIn">
          <span :class="[
            'text-xs px-2.5 py-1 rounded-full font-medium uppercase tracking-wider',
            userRole === 'admin'
              ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
              : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
          ]">
            {{ username }}
          </span>
          <RouterLink to="/vote">
            <button
              class="px-4 py-2 text-sm font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white rounded-lg border border-slate-700 hover:border-slate-600 active:scale-95 transition-all duration-200">
              首頁
            </button>
          </RouterLink>
          <RouterLink to="/admin">
            <button v-if="authStore.role == 'admin'"
              class="px-4 py-2 text-sm font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white rounded-lg border border-slate-700 hover:border-slate-600 active:scale-95 transition-all duration-200">
              後台
            </button>
          </RouterLink>
          <button @click="handleLogout"
            class="px-4 py-2 text-sm font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white rounded-lg border border-slate-700 hover:border-slate-600 active:scale-95 transition-all duration-200">
            登出
          </button>

        </template>


      </div>

    </div>
  </nav>
</template>

<script setup lang="js">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

// 宣告路由與狀態倉庫
const router = useRouter()
const authStore = useAuthStore()


const isLoggedIn = computed(() => !!authStore.isLoggedIn)
const username = computed(() => authStore.username)

// 登出點擊事件
const handleLogout = () => {
  authStore.clearAuth()
  router.push('/login')
}
</script>

<style scoped></style>
