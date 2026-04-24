<template>
  <span class="badge" :class="cls">{{ status }}</span>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({ status: { type: String, required: true } });

const cls = computed(() => ({
  'badge-blue':   props.status === '注文済',
  'badge-green':  props.status === '出庫済',
  'badge-red':    props.status === 'キャンセル',
}));
</script>
