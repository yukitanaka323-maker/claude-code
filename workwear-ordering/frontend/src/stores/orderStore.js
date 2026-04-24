import { defineStore } from 'pinia';
import { ref } from 'vue';
import api from '@/services/api';

export const useOrderStore = defineStore('order', () => {
  const draft = ref({ category: null, productName: null, productId: null, size: null, quantity: 1 });
  const orders = ref([]);

  function setDraftField(field, value) {
    draft.value[field] = value;
  }

  function resetDraft() {
    draft.value = { category: null, productName: null, productId: null, size: null, quantity: 1 };
  }

  async function submitOrder(notes = '') {
    const { category, productName, size, quantity } = draft.value;
    const result = await api.post('/orders', { category, productName, size, quantity, notes });
    return result.orderId;
  }

  async function fetchOrders(params = {}) {
    const query = new URLSearchParams(params).toString();
    orders.value = await api.get(`/orders${query ? '?' + query : ''}`);
  }

  async function cancelOrder(id) {
    await api.patch(`/orders/${id}/status`, { status: 'キャンセル' });
  }

  return { draft, orders, setDraftField, resetDraft, submitOrder, fetchOrders, cancelOrder };
});
