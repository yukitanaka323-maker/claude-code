<template>
  <div class="page">
    <AppHeader />
    <div class="page-content">
      <StepIndicator :current="1" :steps="STEPS" />
      <div class="step-header">
        <h1>カテゴリを選択してください</h1>
      </div>
      <div class="grid-2">
        <button
          v-for="cat in products"
          :key="cat.id"
          class="category-btn"
          @click="select(cat)"
        >
          <span class="cat-icon">{{ ICONS[cat.id] || '👕' }}</span>
          <span class="cat-name">{{ cat.categoryName }}</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router';
import AppHeader from '@/components/common/AppHeader.vue';
import StepIndicator from '@/components/common/StepIndicator.vue';
import { useOrderStore } from '@/stores/orderStore';
import products from '@/config/products';
import { STEPS } from './steps';

const ICONS = { hat: '🧢', jacket: '🥼', polo: '👔', winter: '🧥', shoes: '👟' };
const router = useRouter();
const store = useOrderStore();

function select(cat) {
  store.setDraftField('category', cat.categoryName);
  store.setDraftField('productName', null);
  store.setDraftField('productId', null);
  store.setDraftField('size', null);
  router.push('/order/product');
}
</script>

<style scoped>
.category-btn {
  background: white;
  border-radius: var(--radius);
  box-shadow: var(--shadow);
  min-height: 140px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
  border: 3px solid transparent;
  transition: border-color 0.15s, transform 0.1s;
}
.category-btn:hover { border-color: var(--color-primary); transform: translateY(-2px); }
.cat-icon { font-size: 48px; }
.cat-name { font-size: var(--font-lg); font-weight: bold; }
</style>
