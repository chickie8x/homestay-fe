import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      component: () => import('@/views/home/index.vue'),
      name: 'home',
    },
    {
      path: '/admin/dashboard',
      component: () => import('@/views/dashboard/index.vue'),
      name: 'admin-dashboard',
    },
    {
      path: '/admin/login',
      component: () => import('@/views/login/index.vue'),
      name: 'admin-login',
    },
    {
      path: '/payment/:id',
      component: () => import('@/views/payment/index.vue'),
      name: 'payment',
    },
    {
      path: '/payment/success',
      component: () => import('@/views/payment-success/index.vue'),
      name: 'payment-success',
    },
    {
      path: '/payment/cancel',
      component: () => import('@/views/payment-cancel/index.vue'),
      name: 'payment-cancel',
    },
  ],
})

export default router
