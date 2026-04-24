import { defineStore } from 'pinia';
import { ref } from 'vue';
import api from '@/services/api';

export const useInventoryStore = defineStore('inventory', () => {
  const inventory = ref([]);
  const history = ref([]);

  async function fetchInventory() {
    inventory.value = await api.get('/inventory');
  }

  async function fetchHistory(params = {}) {
    const query = new URLSearchParams(params).toString();
    history.value = await api.get(`/stock/history${query ? '?' + query : ''}`);
  }

  async function receiveStock(payload) {
    return await api.post('/stock/receive', payload);
  }

  async function issueStock(orderId, notes = '') {
    return await api.post('/stock/issue', { orderId, notes });
  }

  return { inventory, history, fetchInventory, fetchHistory, receiveStock, issueStock };
});
