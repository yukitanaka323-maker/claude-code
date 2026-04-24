<template>
  <div class="complete-page">
    <div class="complete-card">
      <div class="complete-icon">✅</div>
      <h1>注文が完了しました</h1>
      <p class="complete-sub">総務担当に通知されました</p>
      <div class="countdown">{{ countdown }} 秒後にトップへ戻ります</div>
      <button class="btn-primary return-btn" @click="goHome">トップへ戻る</button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/authStore';
import { useOrderStore } from '@/stores/orderStore';

const router = useRouter();
const auth = useAuthStore();
const order = useOrderStore();
const countdown = ref(5);
let timer = null;

function goHome() {
  clearInterval(timer);
  auth.logout();
  order.resetDraft();
  router.push('/');
}

onMounted(() => {
  timer = setInterval(() => {
    countdown.value--;
    if (countdown.value <= 0) goHome();
  }, 1000);
});

onUnmounted(() => clearInterval(timer));
</script>

<style scoped>
.complete-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #057a55 0%, #03543f 100%);
}
.complete-card {
  background: white;
  border-radius: 24px;
  padding: 64px 48px;
  text-align: center;
  max-width: 480px;
  width: 90%;
  box-shadow: 0 20px 60px rgba(0,0,0,0.2);
}
.complete-icon { font-size: 80px; margin-bottom: 24px; }
h1 { font-size: var(--font-xl); margin-bottom: 12px; }
.complete-sub { color: var(--color-text-muted); margin-bottom: 32px; }
.countdown { font-size: 16px; color: var(--color-text-muted); margin-bottom: 24px; }
.return-btn { width: 100%; }
</style>
