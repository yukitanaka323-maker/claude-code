<template>
  <div class="page">
    <AppHeader />
    <div class="page-content">
      <StepIndicator :current="2" :steps="STEPS" />
      <div class="step-header">
        <h1>{{ currentCategory?.categoryName }} の商品を選択</h1>
      </div>
      <div v-if="!currentCategory" class="error-msg">カテゴリが選択されていません</div>
      <div v-else class="product-list">
        <button
          v-for="p in currentCategory.products"
          :key="p.id"
          class="product-btn"
          @click="select(p)"
        >
          {{ p.name }}
        </button>
      </div>
      <div class="nav-back">
        <button class="btn-ghost" @click="router.back()">← 戻る</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import AppHeader from '@/components/common/AppHeader.vue';
import StepIndicator from '@/components/common/StepIndicator.vue';
import { useProductStore } from '@/stores/productStore';
import { useOrderStore } from '@/stores/orderStore';
import { STEPS } from './steps';

const router = useRouter();
const products = useProductStore();
const order = useOrderStore();

const currentCategory = computed(() =>
  products.categories.find((c) => c.categoryName === order.draft.category)
);

function select(p) {
  order.setDraftField('productName', p.name);
  order.setDraftField('productId', p.id);
  router.push('/order/size');
}
</script>

<style scoped>
.product-list { display: flex; flex-direction: column; gap: 12px; }
.product-btn {
  background: white;
  text-align: left;
  padding: 0 24px;
  border-radius: var(--radius);
  box-shadow: var(--shadow);
  border: 3px solid transparent;
  font-size: var(--font-lg);
}
.product-btn:hover { border-color: var(--color-primary); }
.nav-back { margin-top: 24px; }
</style>
