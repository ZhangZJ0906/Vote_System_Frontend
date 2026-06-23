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
    meta: { requiresAuth: true, role: 'user' }
  },
  // {
  //   path: '/admin',
  //   meta: { requiresAuth: true, role: 'admin' },
  //   children: [
  //     {
  //       path: '',
  //       redirect: '/admin/items'
  //     },
  //     {
  //       path: 'items',
  //       name: 'AdminItems',
  //       component: () => import('@/views/admin/ItemListView.vue')
  //     }
  //   ]
  // },
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

  // 💡 直接讀取 store 裡面的 computed 屬性
  const isLoggedIn = authStore.isLoggedIn
  const userRole = authStore.role

  console.log('路由檢查：', { to: to.path, isLoggedIn, userRole })

  if (to.meta.requiresGuest && isLoggedIn) {
    return userRole === 'admin' ? '/admin/items' : '/vote'
  }

  if (to.meta.requiresAuth && !isLoggedIn) {
    return '/login'
  }

  if (to.meta.role && to.meta.role !== userRole) {
    return userRole === 'admin' ? '/admin/items' : '/vote'
  }

  return true
})
export default router
