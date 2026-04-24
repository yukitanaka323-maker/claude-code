import { onMounted, onUnmounted } from 'vue';

const IDLE_MS = 3 * 60 * 1000; // 3分

export function useAutoLogout(onIdle) {
  let timer = null;

  function reset() {
    clearTimeout(timer);
    timer = setTimeout(onIdle, IDLE_MS);
  }

  const events = ['touchstart', 'click', 'keydown'];

  onMounted(() => {
    events.forEach((e) => window.addEventListener(e, reset, { passive: true }));
    reset();
  });

  onUnmounted(() => {
    events.forEach((e) => window.removeEventListener(e, reset));
    clearTimeout(timer);
  });
}
