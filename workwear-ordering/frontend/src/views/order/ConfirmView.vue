<template>
  <div class="page">
    <AppHeader />
    <div class="page-content">
      <StepIndicator :current="5" :steps="STEPS" />
      <div class="step-header">
        <h1>注文内容を確認してください</h1>
      </div>

      <div class="card confirm-card">
        <table class="confirm-table">
          <tbody>
            <tr><th>氏名</th><td>{{ auth.employee.value?.employeeName }}</td></tr>
            <tr><th>部署</th><td>{{ auth.employee.value?.department }}</td></tr>
            <tr><th>カテゴリ</th><td>{{ order.draft.category }}</td></tr>
            <tr><th>商品名</th><td>{{ order.draft.productName }}</td></tr>
            <tr><th>サイズ</th><td>{{ order.draft.size }}</td></tr>
            <tr><th>数量</th><td>{{ order.draft.quantity }} 点</td></tr>
          </tbody>
        </table>
      </div>

      <div v-if="error" class="error-msg" style="margin-top:16px">{{ error }}</div>

      <div class="nav-buttons">
        <button class="btn-ghost" @click="router.back()" :disabled="submitting">← 戻る</button>
        <button class="btn-primary confirm-btn" @click="submit" :disabled="submitting">
          {{ submitting ? '送信中...' : '注文する' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import AppHeader from '@/components/common/AppHeader.vue';
import StepIndicator from '@/components/common/StepIndicator.vue';
import { useAuthStore } from '@/stores/authStore';
import { useOrderStore } from '@/stores/orderStore';
import { STEPS } from './steps';

const router = useRouter();
const auth = useAuthStore();
const order = useOrderStore();
const submitting = ref(false);
const error = ref('');

async function submit() {
  submitting.value = true;
  error.value = '';
  try {
    await order.submitOrder();
    router.push('/order/complete');
  } catch (err) {
    error.value = typeof err === 'string' ? err : '注文の送信に失敗しました';
  } finally {
    submitting.value = false;
  }
}
</script>

<style scoped>
.confirm-card { margin-bottom: 24px; }
.confirm-table { width: 100%; border-collapse: collapse; }
.confirm-table th {
  text-align: left;
  padding: 14px 16px;
  width: 120px;
  font-size: 16px;
  color: var(--color-text-muted);
  border-bottom: 1px solid var(--color-border);
  background: #f9fafb;
}
.confirm-table td {
  padding: 14px 16px;
  font-size: var(--font-lg);
  font-weight: 600;
  border-bottom: 1px solid var(--color-border);
}
.nav-buttons {
  display: flex;
  gap: 16px;
}
.confirm-btn { flex: 1; background: var(--color-success); }
</style>
