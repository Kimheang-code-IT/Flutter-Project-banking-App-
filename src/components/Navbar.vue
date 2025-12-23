<template>
  <nav
    class="sticky top-0 bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700 px-6 py-2 z-40 transition-colors duration-300">
    <div class="flex items-center justify-between">
      <!-- Left: Sidebar Toggle + Search Bar -->
      <div class="flex items-center gap-2 flex-1 max-w-md">
        <!-- Sidebar Toggle Icon Button -->
        <button @click="toggleSidebar"
          class="p-2 rounded-sm hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors flex-shrink-0"
          title="Toggle Sidebar">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-600 dark:text-gray-300" fill="none"
            viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>

        <!-- Search Bar -->
        <div class="flex-1 relative" ref="searchContainer">
          <div class="relative">
            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg class="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input v-model="searchQuery" @input="handleSearch" @focus="showSearchResults = true" type="text"
              :placeholder="t('search')"
              class="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200" />
          </div>

          <!-- Search Results Dropdown -->
          <div v-if="showSearchResults && searchQuery && searchResults.length > 0"
            class="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-gray-800 rounded-sm shadow-lg border border-gray-200 dark:border-gray-700 max-h-96 overflow-y-auto z-50">
            <div class="p-2">
              <div v-for="result in searchResults" :key="`${result.type}-${result.id}`"
                @click="navigateToResult(result)"
                class="p-3 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-sm cursor-pointer transition-colors">
                <div class="flex items-start gap-3">
                  <div class="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
                    :class="getResultIconClass(result.type)">
                    <span v-html="getResultIcon(result.type)"></span>
                  </div>
                  <div class="flex-1 min-w-0">
                    <div class="flex items-center gap-2">
                      <p class="font-medium text-gray-900 dark:text-gray-100">{{ result.title }}</p>
                      <span class="px-2 py-0.5 text-xs font-medium rounded-full"
                        :class="getResultTypeClass(result.type)">
                        {{ result.type }}
                      </span>
                    </div>
                    <p class="text-sm text-gray-500 dark:text-gray-400 mt-1 truncate">{{ result.subtitle }}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- No Results Message -->
          <div v-if="showSearchResults && searchQuery && searchResults.length === 0"
            class="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-gray-800 rounded-sm shadow-lg border border-gray-200 dark:border-gray-700 p-4 z-50">
            <p class="text-sm text-gray-500 dark:text-gray-400 text-center">{{ t('noResults') }}</p>
          </div>
        </div>
      </div>

      <!-- Right: Language, Fullscreen, Profile, Logout -->
      <div class="flex items-center gap-4 ml-6">
        <!-- Language Dropdown -->
        <div class="relative">
          <button @click="toggleLanguageDropdown"
            class="flex items-center gap-2 px-3 py-2 rounded-sm hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            title="Change Language">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-600 dark:text-gray-300" fill="none"
              viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
            </svg>
            <span class="text-sm font-medium text-gray-700 dark:text-gray-300">{{ currentLanguage === 'en' ? 'English' :
              'ខ្មែរ' }}</span>
            <svg xmlns="http://www.w3.org/2000/svg"
              class="h-4 w-4 text-gray-600 dark:text-gray-300 transition-transform"
              :class="{ 'rotate-180': showLanguageDropdown }" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          <!-- Language Dropdown Menu -->
          <div v-if="showLanguageDropdown"
            class="absolute right-0 mt-2 w-40 bg-white dark:bg-gray-800 rounded-sm shadow-lg border border-gray-200 dark:border-gray-700 py-2 z-50">
            <button @click="selectLanguage('en')"
              class="w-full text-left px-4 py-2 text-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors flex items-center gap-2 text-gray-700 dark:text-gray-300"
              :class="{ 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400': currentLanguage === 'en' }">
              <span class="text-lg">🇬🇧</span>
              <span>English</span>
              <svg v-if="currentLanguage === 'en'" xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 ml-auto"
                fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
              </svg>
            </button>
            <button @click="selectLanguage('km')"
              class="w-full text-left px-4 py-2 text-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors flex items-center gap-2 text-gray-700 dark:text-gray-300"
              :class="{ 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400': currentLanguage === 'km' }">
              <span class="text-lg">🇰🇭</span>
              <span>ខ្មែរ</span>
              <svg v-if="currentLanguage === 'km'" xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 ml-auto"
                fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
              </svg>
            </button>
          </div>
        </div>

        <!-- Dark Mode Toggle Button -->
        <button @click="toggleDarkMode"
          class="p-2 rounded-sm hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          :title="isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'">
          <svg v-if="!isDarkMode" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-600 dark:text-gray-300"
            fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
          </svg>
          <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-600 dark:text-gray-300" fill="none"
            viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
        </button>

        <!-- Fullscreen Icon Button -->
        <button @click="toggleFullScreen"
          class="p-2 rounded-sm hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors" title="Toggle Fullscreen">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-600 dark:text-gray-300" fill="none"
            viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
          </svg>
        </button>

        <!-- Profile Section with Dropdown -->
        <div class="relative">
          <button @click="toggleProfileDropdown"
            class="flex items-center gap-3 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-sm px-2 py-1 transition-colors">
            <div class="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold">
              AD
            </div>
            <span class="text-gray-700 dark:text-gray-300 font-medium">{{ t('admin') }}</span>
            <svg xmlns="http://www.w3.org/2000/svg"
              class="h-4 w-4 text-gray-600 dark:text-gray-300 transition-transform"
              :class="{ 'rotate-180': showProfileDropdown }" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          <!-- Dropdown Menu -->
          <div v-if="showProfileDropdown"
            class="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-sm shadow-lg border border-gray-200 dark:border-gray-700 py-2 z-50">
            <div class="px-4 py-2 border-b border-gray-200 dark:border-gray-700">
              <p class="text-sm font-semibold text-gray-900 dark:text-gray-100">{{ t('admin') }}</p>
              <p class="text-xs text-gray-500 dark:text-gray-400">admin@example.com</p>
            </div>
            <button @click="handleLogout"
              class="w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 transition-colors flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24"
                stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              {{ t('logout') }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { ref, inject, onMounted, onUnmounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { addHistory } from '../utils/history'
import { useBankingData } from '../composables/useBankingData'

const router = useRouter()

// Load banking data for search
const { customers, loans, deposits, transactions, branches } = useBankingData()

// Inject sidebar toggle function from App.vue
const toggleSidebar = inject('toggleSidebar', () => { })

// Inject language state from App.vue
const currentLanguage = inject('currentLanguage', ref('en'))
const changeLanguage = inject('changeLanguage', () => { })
// Inject dark mode state from App.vue
const isDarkMode = inject('isDarkMode', ref(false))
const toggleDarkMode = inject('toggleDarkMode', () => { })

// Create reactive translation function
const t = (key) => {
  // Use the current language from the injected ref
  const lang = currentLanguage.value || 'en'
  const keys = key.split('.')
  const translations = {
    en: {
      search: 'Search everything...',
      logout: 'Log Out',
      admin: 'Admin',
      noResults: 'No results found',
    },
    km: {
      search: 'ស្វែងរកទាំងអស់...',
      logout: 'ចេញ',
      admin: 'អ្នកគ្រប់គ្រង',
      noResults: 'រកមិនឃើញលទ្ធផល',
    }
  }

  let value = translations[lang]
  for (const k of keys) {
    if (value && typeof value === 'object' && k in value) {
      value = value[k]
    } else {
      return key
    }
  }
  return value || key
}

// Search state
const searchQuery = ref('')
const searchResults = ref([])
const showSearchResults = ref(false)
const searchContainer = ref(null)

// Profile dropdown state
const showProfileDropdown = ref(false)

// Language dropdown state
const showLanguageDropdown = ref(false)

// Toggle profile dropdown
const toggleProfileDropdown = () => {
  showProfileDropdown.value = !showProfileDropdown.value
  showLanguageDropdown.value = false // Close language dropdown when opening profile
}

// Toggle language dropdown
const toggleLanguageDropdown = () => {
  showLanguageDropdown.value = !showLanguageDropdown.value
  showProfileDropdown.value = false // Close profile dropdown when opening language
}

// Select language
const selectLanguage = (lang) => {
  changeLanguage(lang)
  showLanguageDropdown.value = false
}

// Close dropdown when clicking outside
const handleClickOutside = (event) => {
  const profileSection = event.target.closest('.relative')
  if (!profileSection) {
    if (showProfileDropdown.value) {
      showProfileDropdown.value = false
    }
    if (showLanguageDropdown.value) {
      showLanguageDropdown.value = false
    }
  }
}

// Force reactivity update when language changes
const languageKey = ref(0)

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
  // Listen for language change events
  window.addEventListener('languagechange', () => {
    languageKey.value++
  })
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
  window.removeEventListener('languagechange', () => { })
})

// Fullscreen toggle method
const toggleFullScreen = () => {
  if (!document.fullscreenElement) {
    // Attempt to enter fullscreen
    document.documentElement.requestFullscreen().catch((err) => {
      console.log(`Error attempting to enable fullscreen: ${err.message}`)
    })
  } else {
    // Exit fullscreen
    document.exitFullscreen().catch((err) => {
      console.log(`Error attempting to exit fullscreen: ${err.message}`)
    })
  }
}

// Logout handler
const handleLogout = () => {
  console.log('Logging out...')
  showProfileDropdown.value = false

  // Log logout history
  addHistory('logout', {
    type: 'system',
    itemName: 'Admin',
    description: 'User logged out successfully',
    user: 'Admin'
  })

  // In a real app, you would:
  // - Clear authentication tokens
  // - Clear user state
  // - Clear any stored data

  // Navigate to login page
  router.push('/login')
}

// Global search functionality
const handleSearch = () => {
  if (!searchQuery.value.trim()) {
    searchResults.value = []
    return
  }

  const query = searchQuery.value.toLowerCase().trim()
  const results = []

  // Search Customers
  customers.value.forEach(customer => {
    if (
      customer.name.toLowerCase().includes(query) ||
      customer.id.toLowerCase().includes(query) ||
      customer.location.toLowerCase().includes(query) ||
      customer.accountType.toLowerCase().includes(query)
    ) {
      results.push({
        type: 'Customer',
        id: customer.id,
        title: customer.name,
        subtitle: `${customer.accountType} - ${customer.location} - ${customer.branch}`,
        route: '/customer'
      })
    }
  })

  // Search Loans
  loans.value.forEach(loan => {
    if (
      loan.id.toLowerCase().includes(query) ||
      loan.loanType.toLowerCase().includes(query) ||
      loan.status.toLowerCase().includes(query)
    ) {
      const customer = customers.value.find(c => c.id === loan.customerId)
      results.push({
        type: 'Loan',
        id: loan.id,
        title: `Loan ${loan.id}`,
        subtitle: `${loan.loanType} - $${loan.amount.toLocaleString()} - ${loan.status} - ${customer?.name || 'Unknown'}`,
        route: '/loan-trans'
      })
    }
  })

  // Search Deposits
  deposits.value.forEach(deposit => {
    if (
      deposit.id.toLowerCase().includes(query) ||
      deposit.depositType.toLowerCase().includes(query)
    ) {
      const customer = customers.value.find(c => c.id === deposit.customerId)
      results.push({
        type: 'Deposit',
        id: deposit.id,
        title: `Deposit ${deposit.id}`,
        subtitle: `${deposit.depositType} - $${deposit.balance.toLocaleString()} - ${customer?.name || 'Unknown'}`,
        route: '/deposit'
      })
    }
  })

  // Search Transactions
  transactions.value.forEach(transaction => {
    if (
      transaction.id.toLowerCase().includes(query) ||
      transaction.type.toLowerCase().includes(query)
    ) {
      const customer = customers.value.find(c => c.id === transaction.customerId)
      results.push({
        type: 'Transaction',
        id: transaction.id,
        title: `Transaction ${transaction.id}`,
        subtitle: `${transaction.type} - $${transaction.amount.toLocaleString()} - ${customer?.name || 'Unknown'}`,
        route: '/loan-trans'
      })
    }
  })

  // Search Branches
  branches.value.forEach(branch => {
    if (
      branch.name.toLowerCase().includes(query) ||
      branch.id.toLowerCase().includes(query) ||
      branch.location.toLowerCase().includes(query)
    ) {
      results.push({
        type: 'Branch',
        id: branch.id,
        title: branch.name,
        subtitle: `${branch.location} - ${branch.totalCustomers} customers`,
        route: '/branch'
      })
    }
  })

  // Limit results to 10
  searchResults.value = results.slice(0, 10)
}

// Navigate to search result
const navigateToResult = (result) => {
  router.push(result.route)
  searchQuery.value = ''
  showSearchResults.value = false
}

// Get result icon
const getResultIcon = (type) => {
  const icons = {
    'Customer': '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" class="h-4 w-4"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>',
    'Loan': '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" class="h-4 w-4"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>',
    'Deposit': '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" class="h-4 w-4"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>',
    'Transaction': '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" class="h-4 w-4"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" /></svg>',
    'Branch': '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" class="h-4 w-4"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>'
  }
  return icons[type] || ''
}

// Get result icon background class
const getResultIconClass = (type) => {
  const classes = {
    'Customer': 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400',
    'Loan': 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400',
    'Deposit': 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400',
    'Transaction': 'bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400',
    'Branch': 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400'
  }
  return classes[type] || 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
}

// Get result type badge class
const getResultTypeClass = (type) => {
  const classes = {
    'Category': 'bg-blue-100 text-blue-800',
    'Product': 'bg-green-100 text-green-800',
    'User': 'bg-purple-100 text-purple-800',
    'Sale': 'bg-orange-100 text-orange-800'
  }
  return classes[type] || 'bg-gray-100 text-gray-800'
}

// Close search results when clicking outside
const handleSearchClickOutside = (event) => {
  if (searchContainer.value && !searchContainer.value.contains(event.target) && showSearchResults.value) {
    showSearchResults.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
  document.addEventListener('click', handleSearchClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
  document.removeEventListener('click', handleSearchClickOutside)
})
</script>
