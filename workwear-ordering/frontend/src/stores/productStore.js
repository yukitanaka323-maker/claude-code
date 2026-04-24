import { defineStore } from 'pinia';
import { ref } from 'vue';
import api from '@/services/api';

export const useProductStore = defineStore('product', () => {
  const categories = ref([]);

  async function fetchProducts() {
    if (categories.value.length > 0) return;
    categories.value = await api.get('/products');
  }

  function getCategory(id) {
    return categories.value.find((c) => c.id === id) || null;
  }

  return { categories, fetchProducts, getCategory };
});
