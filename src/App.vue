<template>
  <div :class="['h-screen flex overflow-hidden transition-colors duration-300', isDarkMode ? 'bg-gray-900' : 'bg-gray-50']">
    <!-- Show Sidebar and Navbar only when not on login page -->
    <template v-if="!isLoginPage">
      <!-- Left Sidebar - Fixed -->
      <Sidebar />
      
      <!-- Main Content Area -->
      <div 
        :class="[
          'flex-1 flex flex-col overflow-hidden transition-all duration-300 border-l border-gray-200 dark:border-gray-700',
          isSidebarCollapsed ? 'ml-14' : 'ml-60'
        ]"
      >
        <!-- Top Navbar - Fixed -->
        <Navbar />
        
        <!-- Router View for Main Content - Scrollable -->
        <main 
          :class="[
            'flex-1 overflow-y-auto transition-all duration-300',
            isSidebarCollapsed ? 'p-2' : 'p-2',
            isDarkMode ? 'bg-gray-900' : 'bg-gray-50'
          ]"
        >
          <router-view />
        </main>
      </div>
    </template>
    
    <!-- Show only router view on login page -->
    <template v-else>
      <div :class="['w-full h-screen transition-colors duration-300', isDarkMode ? 'bg-gray-900' : 'bg-gray-50']">
        <router-view />
      </div>
    </template>
  </div>
</template>

<script setup>
import { ref, provide, computed } from 'vue'
import { useRoute } from 'vue-router'
import Sidebar from './components/Sidebar.vue'
import Navbar from './components/Navbar.vue'
import { getCurrentLanguage, setCurrentLanguage } from './utils/i18n'

const route = useRoute()

// Check if current route is login page
const isLoginPage = computed(() => route.path === '/login')

// Sidebar collapse state
const isSidebarCollapsed = ref(false)

// Language state
const currentLanguage = ref(getCurrentLanguage())

// Dark mode state - load from localStorage or default to false
const isDarkMode = ref(localStorage.getItem('darkMode') === 'true')

// Function to change language
const changeLanguage = (lang) => {
  currentLanguage.value = lang
  setCurrentLanguage(lang)
  // Trigger reactivity update
  window.dispatchEvent(new Event('languagechange'))
}

// Function to toggle dark mode
const toggleDarkMode = () => {
  isDarkMode.value = !isDarkMode.value
  localStorage.setItem('darkMode', isDarkMode.value.toString())
  // Apply dark mode class to html element
  if (isDarkMode.value) {
    document.documentElement.classList.add('dark')
  } else {
    document.documentElement.classList.remove('dark')
  }
}

// Initialize dark mode on mount
if (isDarkMode.value) {
  document.documentElement.classList.add('dark')
}

// Provide sidebar state to child components
provide('isSidebarCollapsed', isSidebarCollapsed)
provide('toggleSidebar', () => {
  isSidebarCollapsed.value = !isSidebarCollapsed.value
})

// Provide language state to child components
provide('currentLanguage', currentLanguage)
provide('changeLanguage', changeLanguage)

// Provide dark mode state to child components
provide('isDarkMode', isDarkMode)
provide('toggleDarkMode', toggleDarkMode)
</script>

