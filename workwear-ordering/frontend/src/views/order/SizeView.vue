<template>
  <div class="page">
    <AppHeader />
    <div class="page-content">
      <StepIndicator :current="3" :steps="STEPS" />
      <div class="step-header">
        <h1>サイズを選択してください</h1>
        <p>{{ store.draft.productName }}</p>
      </div>
      <div v-if="!currentProduct" class="error-msg">商品が選択されていません</div>
      <div v-else class="grid-3">
        <button
          v-for="size in currentProduct.sizes"
          :key="size"
          class="size-btn"
          :class="{ selected: store.draft.size === size }"
          @click="select(size)"
        >
          {{ size }}
        </button>
      </div>
      <div class="nav-back"><button class="btn-ghost" @click="router.back()">← 戻る</button></div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import AppHeader from '@/components/common/AppHeader.vue';
import StepIndicator from '@/components/common/StepIndicator.vue';
import { useOrderStore } from '@/stores/orderStore';
import products from '@/config/products';
import { STEPS } from './steps';

const router = useRouter();
const store = useOrderStore();

const currentProduct = computed(() => {
  const cat = products.find((c) => c.categoryName === store.draft.category);
  return cat?.products.find((p) => p.id === store.draft.productId) || null;
});

function select(size) {
  store.setDraftField('size', size);
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
.size-btn.selected { border-color: var(--color-primary); background: #eff6ff; color: var(--color-primary); }
.nav-back { margin-top: 24px; }
</style>
