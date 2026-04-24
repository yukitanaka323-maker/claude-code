<template>
  <div class="step-indicator">
    <div
      v-for="(label, i) in steps"
      :key="i"
      class="step"
      :class="{ active: i + 1 === current, done: i + 1 < current }"
    >
      <div class="step-circle">{{ i + 1 < current ? '✓' : i + 1 }}</div>
      <div class="step-label">{{ label }}</div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  current: { type: Number, required: true },
  steps: { type: Array, required: true },
});
</script>

<style scoped>
.step-indicator {
  display: flex;
  justify-content: center;
  gap: 8px;
  padding: 16px 0 24px;
  overflow-x: auto;
}
.step {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  opacity: 0.4;
  flex-shrink: 0;
}
.step.active, .step.done { opacity: 1; }
.step-circle {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  border: 2px solid var(--color-border);
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 15px;
  background: white;
}
.step.active .step-circle {
  border-color: var(--color-primary);
  color: var(--color-primary);
}
.step.done .step-circle {
  background: var(--color-success);
  border-color: var(--color-success);
  color: white;
}
.step-label { font-size: 13px; color: var(--color-text-muted); }
.step.active .step-label { color: var(--color-primary); font-weight: 600; }
</style>
