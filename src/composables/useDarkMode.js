import { inject } from 'vue'

export function useDarkMode() {
  const isDarkMode = inject('isDarkMode', null)
  const toggleDarkMode = inject('toggleDarkMode', null)
  
  return {
    isDarkMode,
    toggleDarkMode
  }
}

