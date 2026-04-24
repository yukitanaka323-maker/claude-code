<template>
  <header class="app-header">
    <div class="header-inner">
      <span class="header-title">作業服注文システム</span>
      <div class="header-right" v-if="auth.employee.value">
        <span class="employee-name">{{ auth.employee.value.employeeName }}（{{ auth.employee.value.department }}）</span>
        <button class="btn-logout" @click="handleLogout">ログアウト</button>
      </div>
    </div>
    <nav class="admin-nav" v-if="auth.isAdmin()">
      <router-link to="/order/category">注文</router-link>
      <router-link to="/admin/orders">注文管理</router-link>
      <router-link to="/admin/inventory">在庫管理</router-link>
    </nav>
  </header>
</template>

<script setup>
import { useAuthStore } from '@/stores/authStore';
import { useRouter } from 'vue-router';

const auth = useAuthStore();
const router = useRouter();

function handleLogout() {
  auth.logout();
  router.push('/');
}
</script>

<style scoped>
.app-header {
  background: var(--color-primary);
  color: white;
  box-shadow: 0 2px 4px rgba(0,0,0,0.2);
}
.header-inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 24px;
  height: 64px;
}
.header-title {
  font-size: var(--font-lg);
  font-weight: bold;
}
.header-right {
  display: flex;
  align-items: center;
  gap: 16px;
}
.employee-name {
  font-size: 16px;
}
.btn-logout {
  background: rgba(255,255,255,0.2);
  color: white;
  min-height: 40px;
  padding: 0 16px;
  font-size: 15px;
  border-radius: 8px;
}
.btn-logout:hover { background: rgba(255,255,255,0.3); }

.admin-nav {
  background: var(--color-primary-dark);
  display: flex;
  gap: 4px;
  padding: 0 16px;
}
.admin-nav a {
  color: rgba(255,255,255,0.8);
  text-decoration: none;
  padding: 10px 20px;
  font-size: 16px;
  display: block;
  border-bottom: 3px solid transparent;
}
.admin-nav a.router-link-active {
  color: white;
  border-bottom-color: white;
}
</style>
