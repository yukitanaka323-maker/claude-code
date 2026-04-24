import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '@/stores/authStore';

const routes = [
  { path: '/', component: () => import('@/views/ScanView.vue'), meta: { public: true } },
  { path: '/order/category', component: () => import('@/views/order/CategoryView.vue') },
  { path: '/order/product', component: () => import('@/views/order/ProductView.vue') },
  { path: '/order/size', component: () => import('@/views/order/SizeView.vue') },
  { path: '/order/quantity', component: () => import('@/views/order/QuantityView.vue') },
  { path: '/order/confirm', component: () => import('@/views/order/ConfirmView.vue') },
  { path: '/order/complete', component: () => import('@/views/OrderCompleteView.vue') },
  { path: '/admin/orders', component: () => import('@/views/admin/OrderManageView.vue'), meta: { admin: true } },
  { path: '/admin/inventory', component: () => import('@/views/admin/InventoryView.vue'), meta: { admin: true } },
  { path: '/:pathMatch(.*)*', redirect: '/' },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to) => {
  const auth = useAuthStore();
  if (to.meta.public) return true;
  if (!auth.isAuthenticated()) return '/';
  if (to.meta.admin && !auth.isAdmin()) return '/order/category';
  return true;
});

export default router;
