import { createRouter, createWebHistory } from 'vue-router';
import { useOrderStore } from '@/stores/orderStore';

const routes = [
  { path: '/',               component: () => import('@/views/ScanView.vue') },
  { path: '/order/category', component: () => import('@/views/order/CategoryView.vue') },
  { path: '/order/product',  component: () => import('@/views/order/ProductView.vue') },
  { path: '/order/size',     component: () => import('@/views/order/SizeView.vue') },
  { path: '/order/quantity', component: () => import('@/views/order/QuantityView.vue') },
  { path: '/order/confirm',  component: () => import('@/views/order/ConfirmView.vue') },
  { path: '/order/complete', component: () => import('@/views/OrderCompleteView.vue') },
  { path: '/:pathMatch(.*)*', redirect: '/' },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to) => {
  if (to.path === '/') return true;
  const store = useOrderStore();
  if (!store.employee) return '/';
  return true;
});

export default router;
