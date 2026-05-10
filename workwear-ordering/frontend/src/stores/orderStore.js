import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useOrderStore = defineStore('order', () => {
  const employee = ref(null);  // { name, department }
  const draft = ref({ category: null, productName: null, productId: null, size: null, quantity: 1 });

  function setEmployee(emp) { employee.value = emp; }

  function setDraftField(field, value) { draft.value[field] = value; }

  function reset() {
    employee.value = null;
    draft.value = { category: null, productName: null, productId: null, size: null, quantity: 1 };
  }

  return { employee, draft, setEmployee, setDraftField, reset };
});
