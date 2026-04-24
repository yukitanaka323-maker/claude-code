<template>
  <div class="scan-page">
    <div class="scan-card">
      <div class="scan-icon">🪪</div>
      <h1>社員証をかざしてください</h1>
      <p class="scan-sub">カードリーダーに社員証をタッチしてください</p>

      <div v-if="loading" class="scan-loading">認証中...</div>
      <div v-if="error" class="error-msg">{{ error }}</div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/authStore';
import { useCardReader } from '@/composables/useCardReader';
import { useProductStore } from '@/stores/productStore';

const router = useRouter();
const auth = useAuthStore();
const products = useProductStore();
const loading = ref(false);
const error = ref('');

// ログイン済みなら即リダイレクト
onMounted(() => {
  auth.logout();
});

useCardReader(async (authNumber) => {
  if (loading.value) return;
  loading.value = true;
  error.value = '';
  try {
    const employee = await auth.scanCard(authNumber);
    await products.fetchProducts();
    router.push(employee.isAdmin ? '/admin/orders' : '/order/category');
  } catch (err) {
    error.value = typeof err === 'string' ? err : '認証に失敗しました';
  } finally {
    loading.value = false;
  }
});
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
h1 {
  font-size: var(--font-xl);
  color: var(--color-text);
  margin-bottom: 12px;
}
.scan-sub {
  color: var(--color-text-muted);
  font-size: 16px;
  margin-bottom: 24px;
}
.scan-loading {
  color: var(--color-primary);
  font-size: var(--font-lg);
  font-weight: bold;
  padding: 16px;
}
</style>
