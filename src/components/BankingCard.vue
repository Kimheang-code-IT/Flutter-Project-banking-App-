<template>
  <div class="bg-white dark:bg-gray-800 rounded-sm shadow p-3 transition-colors duration-300">
    <div class="flex items-center justify-between">
      <div>
        <h3 class="text-gray-600 dark:text-gray-400 text-sm font-medium mb-2">{{ title }}</h3>
        <p class="text-3xl font-bold text-gray-800 dark:text-gray-200">{{ formattedValue }}</p>
        <p v-if="subtitle" class="text-xs text-gray-500 dark:text-gray-400 mt-1">{{ subtitle }}</p>
      </div>
      <div :class="['w-12 h-12 rounded-full flex items-center justify-center', iconBgClass]">
        <span v-html="icon"></span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  title: {
    type: String,
    required: true
  },
  value: {
    type: [Number, String],
    required: true
  },
  subtitle: {
    type: String,
    default: ''
  },
  icon: {
    type: String,
    required: true
  },
  iconBgClass: {
    type: String,
    default: 'bg-blue-100'
  },
  format: {
    type: String,
    default: 'number', // 'number', 'currency', 'percentage'
    validator: (value) => ['number', 'currency', 'percentage'].includes(value)
  }
})

const formattedValue = computed(() => {
  if (props.format === 'currency') {
    return typeof props.value === 'number' 
      ? `$${props.value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
      : props.value
  } else if (props.format === 'percentage') {
    return typeof props.value === 'number'
      ? `${props.value.toFixed(2)}%`
      : props.value
  } else {
    return typeof props.value === 'number'
      ? props.value.toLocaleString()
      : props.value
  }
})
</script>

