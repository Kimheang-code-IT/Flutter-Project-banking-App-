<template>
  <span 
    :class="[
      'px-2 py-1 text-xs font-medium rounded-sm',
      riskClass
    ]"
  >
    {{ riskLevel }}
  </span>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  riskLevel: {
    type: String,
    required: true,
    validator: (value) => ['Low', 'Medium', 'High'].includes(value)
  }
})

const riskClass = computed(() => {
  const classes = {
    Low: 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400',
    Medium: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-400',
    High: 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-400'
  }
  return classes[props.riskLevel] || classes.Low
})
</script>

