<template>
  <div class="bg-white dark:bg-gray-800 rounded-sm shadow transition-colors duration-300">
    <div v-if="title" class="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
      <h3 class="text-lg font-semibold text-gray-800 dark:text-gray-200">{{ title }}</h3>
    </div>
    <div class="max-h-[500px] overflow-y-auto">
      <table class="w-full">
        <thead class="bg-gray-50 dark:bg-gray-800 sticky top-0 z-10">
          <tr>
            <th
              v-for="column in columns"
              :key="column.key"
              :class="[
                'px-4 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider border-b border-gray-200 dark:border-gray-700',
                column.align === 'center' ? 'text-center' : '',
                column.align === 'right' ? 'text-right' : ''
              ]"
            >
              {{ column.label }}
            </th>
          </tr>
        </thead>
        <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
          <tr
            v-for="(row, index) in data"
            :key="index"
            class="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            <td
              v-for="column in columns"
              :key="column.key"
              :class="[
                'px-4 py-3 whitespace-nowrap text-sm',
                column.align === 'center' ? 'text-center' : '',
                column.align === 'right' ? 'text-right' : '',
                'text-gray-700 dark:text-gray-300'
              ]"
            >
              <slot :name="`cell-${column.key}`" :row="row" :value="row[column.key]">
                {{ formatCellValue(row[column.key], column) }}
              </slot>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <div v-if="data.length === 0" class="p-8 text-center">
      <p class="text-gray-500 dark:text-gray-400">{{ emptyMessage }}</p>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  columns: {
    type: Array,
    required: true
  },
  data: {
    type: Array,
    required: true
  },
  title: {
    type: String,
    default: ''
  },
  emptyMessage: {
    type: String,
    default: 'No data available'
  }
})

const formatCellValue = (value, column) => {
  if (value === null || value === undefined) return '-'
  
  if (column.format === 'currency') {
    return typeof value === 'number'
      ? `$${value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
      : value
  } else if (column.format === 'percentage') {
    return typeof value === 'number'
      ? `${value.toFixed(2)}%`
      : value
  } else if (column.format === 'date') {
    return new Date(value).toLocaleDateString()
  } else if (column.format === 'number') {
    return typeof value === 'number'
      ? value.toLocaleString()
      : value
  }
  
  return value
}
</script>

