<template>
  <div class="page">
    <AppHeader />
    <div class="page-content">
      <StepIndicator :current="3" :steps="STEPS" />
      <div class="step-header">
        <h1>サイズを選択してください</h1>
        <p>{{ order.draft.productName }}</p>
      </div>
      <div v-if="!currentProduct" class="error-msg">商品が選択されていません</div>
      <div v-else class="grid-3">
        <button
          v-for="size in currentProduct.sizes"
          :key="size"
          class="size-btn"
          :class="{ selected: order.draft.size === size }"
          @click="select(size)"
        >
          {{ size }}
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

const currentProduct = computed(() => {
  const cat = products.categories.find((c) => c.categoryName === order.draft.category);
  return cat?.products.find((p) => p.id === order.draft.productId) || null;
});

function select(size) {
  order.setDraftField('size', size);
  router.push('/order/quantity');
}
</script>

<style scoped>
.size-btn {
  background: white;
  min-height: 80px;
  border-radius: var(--radius);
  box-shadow: var(--shadow);
  font-size: var(--font-lg);
  font-weight: bold;
  border: 3px solid transparent;
}
.size-btn:hover { border-color: var(--color-primary); }
.size-btn.selected {
  border-color: var(--color-primary);
  background: #eff6ff;
  color: var(--color-primary);
}
.nav-back { margin-top: 24px; }
</style>
