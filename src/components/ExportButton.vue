<template>
  <button
    @click="handleExport"
    :class="[
      'px-4 py-2 rounded-sm font-medium flex items-center gap-2 transition-colors',
      variant === 'primary' 
        ? 'bg-blue-600 text-white hover:bg-blue-700'
        : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
    ]"
    :disabled="disabled"
  >
    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
    {{ label }}
  </button>
</template>

<script setup>
const props = defineProps({
  label: {
    type: String,
    default: 'Export'
  },
  format: {
    type: String,
    default: 'pdf', // 'pdf', 'excel', 'powerpoint'
    validator: (value) => ['pdf', 'excel', 'powerpoint'].includes(value)
  },
  variant: {
    type: String,
    default: 'primary', // 'primary', 'secondary'
    validator: (value) => ['primary', 'secondary'].includes(value)
  },
  disabled: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['export'])

const handleExport = () => {
  // Emit event for parent to handle export logic
  // TODO: Implement actual export functionality
  emit('export', props.format)
  console.log(`Exporting as ${props.format}...`)
}
</script>

