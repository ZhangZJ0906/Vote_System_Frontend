import { createRouter, createWebHistory } from 'vue-router'

import { useAuthStore } from '@/stores/auth'
const routes = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/frontend/views/LoginPage.vue'),
    meta: { requiresGuest: true }
  },
  {
    path: '/vote',
    name: 'Vote',
    component: () => import('@/frontend/views/UserVote.vue'),
    meta: { requiresAuth: true, roles: ['user','admin'] }
  },
  {
    path: '/admin',
    meta: { requiresAuth: true, roles: 'admin' },
    component:()=>import('@/backend/views/BackEndIndex.vue')
  },
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/login'
  }
]


const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

// 擋住梅登入的
router.beforeEach((to, from) => {
  const authStore = useAuthStore()
  const isLoggedIn = authStore.isLoggedIn
  const userRole = authStore.role

  // 已登入的使用者想去登入頁 -> 依照角色重導向
  if (to.meta.requiresGuest && isLoggedIn) {
    return userRole === 'admin' ? '/admin' : '/vote'
  }

  // 未登入的使用者 -> 踢回登入頁
  if (to.meta.requiresAuth && !isLoggedIn) {
    return '/login'
  }

  //  檢查角色權限
  if (to.meta.roles && !to.meta.roles.includes(userRole)) {
    
    return userRole === 'admin' ? '/admin' : '/vote'
  }

  return true
})
export default router
