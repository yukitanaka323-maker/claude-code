import { defineStore } from 'pinia';
import { ref } from 'vue';
import api from '@/services/api';

export const useAuthStore = defineStore('auth', () => {
  const token = ref(sessionStorage.getItem('token') || null);
  const employee = ref(JSON.parse(sessionStorage.getItem('employee') || 'null'));

  function setAuth(newToken, emp) {
    token.value = newToken;
    employee.value = emp;
    sessionStorage.setItem('token', newToken);
    sessionStorage.setItem('employee', JSON.stringify(emp));
  }

  function logout() {
    token.value = null;
    employee.value = null;
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('employee');
  }

  async function scanCard(authNumber) {
    const result = await api.post('/auth/scan', { authNumber });
    setAuth(result.token, result.employee);
    return result.employee;
  }

  const isAuthenticated = () => !!token.value;
  const isAdmin = () => !!employee.value?.isAdmin;

  return { token, employee, scanCard, logout, isAuthenticated, isAdmin };
});
