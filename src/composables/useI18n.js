import { computed, inject } from 'vue'
import { translations, getCurrentLanguage } from '../utils/i18n'

export function useI18n() {
  // Inject language state from App.vue
  const currentLanguage = inject('currentLanguage', computed(() => getCurrentLanguage()))
  
  // Create reactive translation function
  const t = (key) => {
    const lang = currentLanguage.value || getCurrentLanguage()
    const keys = key.split('.')
    let value = translations[lang]
    
    if (!value) {
      return key
    }
    
    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = value[k]
      } else {
        return key // Return key if translation not found
      }
    }
    
    return value || key
  }
  
  return {
    t,
    currentLanguage
  }
}

