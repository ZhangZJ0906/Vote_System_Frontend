
<template>
<div class="min-h-screen bg-slate-100 flex flex-col items-center justify-center p-6">
    <div class="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full border border-slate-200">

      <div class="flex items-center gap-3 mb-6">
        <div class="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center">
          <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
          </svg>
        </div>
        <div>
          <h1 class="text-xl font-black text-emerald-600 leading-tight">線上投票系統</h1>
          <p class="text-xs text-slate-400">Online Voting System</p>
        </div>
      </div>

      <div class="mb-4">
        <label class="block text-sm font-semibold text-slate-600 mb-1">帳號</label>
        <div class="relative">
          <span class="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
            </svg>
          </span>
          <input
            v-model="username"
            type="text"
            placeholder="請輸入帳號"
            @keyup.enter="handleLogin"
            class="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent transition"
          />
        </div>
      </div>

      <div class="mb-5">
        <label class="block text-sm font-semibold text-slate-600 mb-1">密碼</label>
        <div class="relative">
          <span class="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
            </svg>
          </span>
          <input
            v-model="password"
            :type="showPw ? 'text' : 'password'"
            placeholder="請輸入密碼"
            @keyup.enter="handleLogin"
            class="w-full pl-9 pr-10 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent transition"
          />
          <button
            type="button"
            @click="showPw = !showPw"
            class="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition"
          >
            <svg v-if="!showPw" class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
              <path stroke-linecap="round" stroke-linejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
            </svg>
            <svg v-else class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"/>
            </svg>
          </button>
        </div>
      </div>

      <div v-if="errorMsg" class="mb-4 text-sm text-red-500 bg-red-50 border border-red-200 rounded-xl px-4 py-2.5">
        {{ errorMsg }}
      </div>

      <button
        @click="handleLogin"
        :disabled="loading"
        class="w-full py-3 px-4 bg-indigo-600 text-white font-semibold rounded-xl shadow-md hover:bg-indigo-700 active:scale-95 transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
      >
        <span v-if="loading">登入中...</span>
        <span v-else>登入</span>
      </button>
    </div>
  </div>
</template>


<script setup lang="js">
// import { ref } from 'vue'
import { useHttpClient } from '@/Services/httpClient'
const {  postApi } = useHttpClient()



const handleLogin = () => {
postApi('');
}
</script>

<style lang="scss" scoped>

</style>
