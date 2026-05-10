<template>
  <div class="scan-page">
    <div class="scan-card">
      <div class="scan-icon">🪪</div>
      <h1>社員証をかざしてください</h1>
      <p class="scan-sub">カードリーダーに社員証をタッチしてください</p>

      <div v-if="error" class="error-msg">{{ error }}</div>

      <!-- 見つかった場合：名前を確認して進む -->
      <div v-if="found" class="found-card">
        <p class="found-name">{{ found.name }}（{{ found.department }}）</p>
        <button class="btn-primary proceed-btn" @click="proceed">注文へ進む →</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useOrderStore } from '@/stores/orderStore';
import { useCardReader } from '@/composables/useCardReader';
import { useAutoLogout } from '@/composables/useAutoLogout';
import employees from '@/config/employees';

const router = useRouter();
const store = useOrderStore();
const error = ref('');
const found = ref(null);

onMounted(() => store.reset());

useCardReader((authNumber) => {
  error.value = '';
  found.value = null;
  const emp = employees.find((e) => e.authNumber === authNumber);
  if (!emp) {
    error.value = '社員が見つかりません（認証番号: ' + authNumber + '）';
    return;
  }
  found.value = emp;
});

useAutoLogout(() => {
  found.value = null;
  error.value = '';
});

function proceed() {
  store.setEmployee(found.value);
  router.push('/order/category');
}
</script>

<style scoped>
.scan-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #1a56db 0%, #1e40af 100%);
}
.scan-card {
  background: white;
  border-radius: 24px;
  padding: 64px 48px;
  text-align: center;
  max-width: 480px;
  width: 90%;
  box-shadow: 0 20px 60px rgba(0,0,0,0.2);
}
.scan-icon {
  font-size: 80px;
  margin-bottom: 24px;
  animation: pulse 2s infinite;
}
@keyframes pulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.08); }
}
h1 { font-size: var(--font-xl); color: var(--color-text); margin-bottom: 12px; }
.scan-sub { color: var(--color-text-muted); font-size: 16px; margin-bottom: 24px; }
.found-card {
  margin-top: 24px;
  padding: 20px;
  background: #f0fdf4;
  border-radius: var(--radius);
  border: 2px solid var(--color-success);
}
.found-name { font-size: var(--font-lg); font-weight: bold; margin-bottom: 16px; }
.proceed-btn { width: 100%; }
</style>
