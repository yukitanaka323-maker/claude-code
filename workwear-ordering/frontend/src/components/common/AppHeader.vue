<template>
  <header class="app-header">
    <span class="header-title">作業服注文システム</span>
    <div v-if="store.employee" class="header-right">
      <span class="employee-name">{{ store.employee.name }}（{{ store.employee.department }}）</span>
      <button class="btn-logout" @click="handleLogout">やめる</button>
    </div>
  </header>
</template>

<script setup>
import { useOrderStore } from '@/stores/orderStore';
import { useRouter } from 'vue-router';

const store = useOrderStore();
const router = useRouter();

function handleLogout() {
  store.reset();
  router.push('/');
}
</script>

<style scoped>
.app-header {
  background: var(--color-primary);
  color: white;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 24px;
  height: 64px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.2);
}
.header-title { font-size: var(--font-lg); font-weight: bold; }
.header-right { display: flex; align-items: center; gap: 16px; }
.employee-name { font-size: 16px; }
.btn-logout {
  background: rgba(255,255,255,0.2);
  color: white;
  min-height: 40px;
  padding: 0 16px;
  font-size: 15px;
  border-radius: 8px;
}
.btn-logout:hover { background: rgba(255,255,255,0.3); }
</style>
