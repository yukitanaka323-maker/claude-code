<template>
  <div class="page">
    <AppHeader />
    <div class="page-content">
      <StepIndicator :current="4" :steps="STEPS" />
      <div class="step-header">
        <h1>数量を入力してください</h1>
        <p>{{ order.draft.productName }} / {{ order.draft.size }}</p>
      </div>
      <div class="quantity-wrapper">
        <button class="qty-btn" @click="dec">－</button>
        <span class="qty-value">{{ qty }}</span>
        <button class="qty-btn" @click="inc">＋</button>
      </div>
      <div class="nav-buttons">
        <button class="btn-ghost" @click="router.back()">← 戻る</button>
        <button class="btn-primary next-btn" @click="next">次へ →</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import AppHeader from '@/components/common/AppHeader.vue';
import StepIndicator from '@/components/common/StepIndicator.vue';
import { useOrderStore } from '@/stores/orderStore';
import { STEPS } from './steps';

const router = useRouter();
const order = useOrderStore();
const qty = ref(order.draft.quantity || 1);

function inc() { qty.value++; }
function dec() { if (qty.value > 1) qty.value--; }

function next() {
  order.setDraftField('quantity', qty.value);
  router.push('/order/confirm');
}
</script>

<style scoped>
.quantity-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 32px;
  padding: 40px 0;
}
.qty-btn {
  width: 88px;
  height: 88px;
  border-radius: 50%;
  font-size: 36px;
  background: var(--color-primary);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: unset;
  padding: 0;
}
.qty-value {
  font-size: 72px;
  font-weight: bold;
  min-width: 120px;
  text-align: center;
  color: var(--color-text);
}
.nav-buttons {
  display: flex;
  gap: 16px;
  margin-top: 32px;
}
.next-btn { flex: 1; }
</style>
