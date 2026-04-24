import { ref, onMounted, onUnmounted } from 'vue';

const MIN_CARD_LENGTH = 6;
const MAX_BURST_MS = 200;

export function useCardReader(onCardScanned) {
  const buffer = ref('');
  const firstKeystrokeTime = ref(null);
  let clearTimer = null;

  function handleKeydown(event) {
    if (event.key === 'Enter') {
      const elapsed = firstKeystrokeTime.value ? Date.now() - firstKeystrokeTime.value : Infinity;
      if (buffer.value.length >= MIN_CARD_LENGTH && elapsed <= MAX_BURST_MS) {
        onCardScanned(buffer.value);
      }
      buffer.value = '';
      firstKeystrokeTime.value = null;
      clearTimeout(clearTimer);
      return;
    }

    if (event.key.length === 1) {
      if (!firstKeystrokeTime.value) firstKeystrokeTime.value = Date.now();
      buffer.value += event.key;

      clearTimeout(clearTimer);
      clearTimer = setTimeout(() => {
        buffer.value = '';
        firstKeystrokeTime.value = null;
      }, MAX_BURST_MS * 2);
    }
  }

  onMounted(() => window.addEventListener('keydown', handleKeydown));
  onUnmounted(() => {
    window.removeEventListener('keydown', handleKeydown);
    clearTimeout(clearTimer);
  });
}
