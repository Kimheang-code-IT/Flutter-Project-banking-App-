<template>
  <div :class="['mx-auto transition-all duration-300', isSidebarCollapsed ? 'max-w-full px-2' : 'max-w-7xl']">
    <!-- Summary Cards -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-2 mb-2">
      <!-- Total Customers Card -->
      <BankingCard title="Total Customers" :value="totalCustomers" format="number" icon-bg-class="bg-blue-100"
        :icon="customerIcon" />

      <!-- Low Risk Card -->
      <BankingCard title="Low Risk" :value="riskDistribution.Low" format="number" icon-bg-class="bg-green-100"
        :icon="lowRiskIcon" />

      <!-- Medium Risk Card -->
      <BankingCard title="Medium Risk" :value="riskDistribution.Medium" format="number" icon-bg-class="bg-yellow-100"
        :icon="mediumRiskIcon" />

      <!-- High Risk Card -->
      <BankingCard title="High Risk" :value="riskDistribution.High" format="number" icon-bg-class="bg-red-100"
        :icon="highRiskIcon" />
    </div>

    <!-- Charts Section -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-2 mb-2">
      <!-- Risk Distribution Bar Chart -->
      <div class="lg:col-span-2 bg-white dark:bg-gray-800 rounded-sm shadow p-3 transition-colors duration-300">
        <h3 class="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">Risk Distribution</h3>
        <div class="h-[300px]">
          <Bar :data="riskDistributionChartData" :options="riskDistributionChartOptions" />
        </div>
      </div>

      <!-- Risk Score Summary -->
      <div class="bg-white dark:bg-gray-800 rounded-sm shadow p-3 transition-colors duration-300">
        <h3 class="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">Risk Score Summary</h3>
        <div class="space-y-3">
          <div>
            <div class="flex justify-between text-sm mb-1">
              <span class="text-gray-600 dark:text-gray-400">Average Score</span>
              <span class="font-semibold text-gray-800 dark:text-gray-200">{{ averageRiskScore }}</span>
            </div>
            <div class="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div class="bg-blue-600 h-2 rounded-full" :style="{ width: `${averageRiskScore}%` }"></div>
            </div>
          </div>
          <div class="pt-3 border-t border-gray-200 dark:border-gray-700">
            <p class="text-xs text-gray-500 dark:text-gray-400 mb-2">Risk Levels</p>
            <div class="space-y-2">
              <div class="flex items-center justify-between">
                <span class="text-sm text-gray-700 dark:text-gray-300">Low (0-39)</span>
                <RiskBadge risk-level="Low" />
              </div>
              <div class="flex items-center justify-between">
                <span class="text-sm text-gray-700 dark:text-gray-300">Medium (40-69)</span>
                <RiskBadge risk-level="Medium" />
              </div>
              <div class="flex items-center justify-between">
                <span class="text-sm text-gray-700 dark:text-gray-300">High (70-100)</span>
                <RiskBadge risk-level="High" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Search and Filter Bar -->
    <div class="py-3 mb-2">
      <div class="flex flex-col md:flex-row gap-4 items-center justify-between">
        <div class="relative w-[400px]">
          <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg class="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <input v-model="searchQuery" type="text" placeholder="Search customers..."
            class="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200" />
        </div>
        <div class="flex items-center gap-4">
          <div class="relative">
            <select v-model="selectedRiskLevel"
              class="appearance-none bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-sm px-4 py-2 pr-8 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 dark:text-gray-200">
              <option value="">All Risk Levels</option>
              <option value="Low">Low Risk</option>
              <option value="Medium">Medium Risk</option>
              <option value="High">High Risk</option>
            </select>
            <div class="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
              <svg class="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- High Risk Customers Table -->
    <div class="bg-white dark:bg-gray-800 rounded-sm shadow transition-colors duration-300">
      <div class="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
        <h3 class="text-lg font-semibold text-gray-800 dark:text-gray-200">Customer Risk Scores</h3>
      </div>
      <div class="max-h-[500px] overflow-y-auto">
        <table class="w-full">
          <thead class="bg-gray-50 dark:bg-gray-800 sticky top-0 z-10">
            <tr>
              <th
                class="px-4 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider border-b border-gray-200 dark:border-gray-700">
                No</th>
              <th
                class="px-4 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider border-b border-gray-200 dark:border-gray-700">
                Customer</th>
              <th
                class="px-4 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider border-b border-gray-200 dark:border-gray-700">
                Age</th>
              <th
                class="px-4 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider border-b border-gray-200 dark:border-gray-700">
                Income</th>
              <th
                class="px-4 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider border-b border-gray-200 dark:border-gray-700">
                Risk Score</th>
              <th
                class="px-4 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider border-b border-gray-200 dark:border-gray-700">
                Risk Level</th>
              <th
                class="px-4 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider border-b border-gray-200 dark:border-gray-700">
                Default Prediction</th>
              <th
                class="px-4 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider border-b border-gray-200 dark:border-gray-700">
                Actions</th>
            </tr>
          </thead>
          <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            <tr v-for="(item, index) in filteredRiskData" :key="item.customerId"
              class="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
              <td class="px-4 py-3 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">{{ index + 1 }}</td>
              <td class="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">
                {{ getCustomerName(item.customerId) }}
              </td>
              <td class="px-4 py-3 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                {{ getCustomerAge(item.customerId) }}
              </td>
              <td class="px-4 py-3 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                ${{ getCustomerIncome(item.customerId).toLocaleString() }}
              </td>
              <td class="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">
                {{ item.riskScore }}
              </td>
              <td class="px-4 py-3 whitespace-nowrap">
                <RiskBadge :risk-level="item.riskLevel" />
              </td>
              <td class="px-4 py-3 whitespace-nowrap">
                <span :class="[
                  'px-2 py-1 text-xs font-medium rounded-sm',
                  item.riskLevel === 'High' ? 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-400' : 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400'
                ]">
                  {{ item.riskLevel === 'High' ? 'High Risk' : 'Low Risk' }}
                </span>
              </td>
              <td class="px-4 py-3 whitespace-nowrap text-sm font-medium">
                <button @click="viewRiskDetails(item)"
                  class="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300">
                  View Details
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Risk Details Drawer -->
    <Transition name="drawer">
      <div v-if="showDetailsDrawer" class="fixed inset-0 bg-black bg-opacity-50 z-50" @click.self="closeDetailsDrawer">
        <div
          class="absolute right-0 top-0 h-full w-full max-w-md bg-white dark:bg-gray-800 shadow-xl overflow-y-auto transition-colors duration-300">
          <div
            class="sticky top-0 bg-white dark:bg-gray-800 text-black dark:text-gray-200 px-6 py-5 flex items-center justify-between z-10 border-b border-gray-200 dark:border-gray-700">
            <h2 class="text-xl font-bold">Risk Score Details</h2>
            <button @click="closeDetailsDrawer"
              class="text-black dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-sm p-2 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24"
                stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div v-if="selectedRiskData" class="p-6 space-y-4">
            <div>
              <h3 class="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">
                {{ getCustomerName(selectedRiskData.customerId) }}
              </h3>
              <div class="flex items-center gap-2 mb-4">
                <span class="text-3xl font-bold text-gray-800 dark:text-gray-200">{{ selectedRiskData.riskScore
                }}</span>
                <RiskBadge :risk-level="selectedRiskData.riskLevel" />
              </div>
            </div>

            <div>
              <h4 class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Risk Factors</h4>
              <ul class="space-y-2">
                <li v-for="(factor, index) in selectedRiskData.factors" :key="index"
                  class="text-sm text-gray-600 dark:text-gray-400 flex items-start gap-2">
                  <svg class="h-5 w-5 text-gray-400 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {{ factor }}
                </li>
              </ul>
            </div>

            <div class="pt-4 border-t border-gray-200 dark:border-gray-700">
              <p class="text-xs text-gray-500 dark:text-gray-400">
                Last Updated: {{ new Date(selectedRiskData.lastUpdated).toLocaleDateString() }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref, computed, inject } from 'vue'
import { useI18n } from '../composables/useI18n'
import { useBankingData } from '../composables/useBankingData'
import { getHighRiskCustomers } from '../utils/bankingData'
import { getBarChartOptions } from '../utils/chartConfigs'
import BankingCard from '../components/BankingCard.vue'
import RiskBadge from '../components/RiskBadge.vue'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js'
import { Bar } from 'vue-chartjs'

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
)

// Inject sidebar collapse state
const isSidebarCollapsed = inject('isSidebarCollapsed', ref(false))
const isDarkMode = inject('isDarkMode', ref(false))
const { t } = useI18n()

// Load banking data
const { customers, loans, riskScores, getCustomer } = useBankingData()

// Icons
const customerIcon = '<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>'
const lowRiskIcon = '<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>'
const mediumRiskIcon = '<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>'
const highRiskIcon = '<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>'

// Search and filter
const searchQuery = ref('')
const selectedRiskLevel = ref('')

// Risk data with customer info
const riskDataWithCustomer = computed(() => {
  return riskScores.value.map(risk => {
    const customer = getCustomer(risk.customerId)
    return {
      ...risk,
      customerName: customer?.name || 'Unknown',
      customerAge: customer?.age || 0,
      customerIncome: customer?.income || 0
    }
  })
})

// Filtered risk data
const filteredRiskData = computed(() => {
  let filtered = riskDataWithCustomer.value

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(item =>
      item.customerName.toLowerCase().includes(query) ||
      item.customerId.toLowerCase().includes(query)
    )
  }

  if (selectedRiskLevel.value) {
    filtered = filtered.filter(item => item.riskLevel === selectedRiskLevel.value)
  }

  return filtered.sort((a, b) => b.riskScore - a.riskScore)
})

// Risk distribution
const riskDistribution = computed(() => {
  const distribution = { Low: 0, Medium: 0, High: 0 }
  riskScores.value.forEach(risk => {
    distribution[risk.riskLevel] = (distribution[risk.riskLevel] || 0) + 1
  })
  return distribution
})

// Total customers
const totalCustomers = computed(() => customers.value.length)

// Average risk score
const averageRiskScore = computed(() => {
  if (riskScores.value.length === 0) return 0
  const sum = riskScores.value.reduce((acc, risk) => acc + risk.riskScore, 0)
  return Math.round(sum / riskScores.value.length)
})

// Risk distribution chart data
const riskDistributionChartData = computed(() => ({
  labels: ['Low Risk', 'Medium Risk', 'High Risk'],
  datasets: [
    {
      label: 'Number of Customers',
      data: [
        riskDistribution.value.Low,
        riskDistribution.value.Medium,
        riskDistribution.value.High
      ],
      backgroundColor: [
        'rgba(16, 185, 129, 0.8)',
        'rgba(251, 191, 36, 0.8)',
        'rgba(239, 68, 68, 0.8)'
      ],
      borderColor: [
        'rgb(16, 185, 129)',
        'rgb(251, 191, 36)',
        'rgb(239, 68, 68)'
      ],
      borderWidth: 1
    }
  ]
}))

const riskDistributionChartOptions = computed(() => getBarChartOptions(isDarkMode.value))

// Details drawer
const showDetailsDrawer = ref(false)
const selectedRiskData = ref(null)

const viewRiskDetails = (riskData) => {
  selectedRiskData.value = riskData
  showDetailsDrawer.value = true
}

const closeDetailsDrawer = () => {
  showDetailsDrawer.value = false
  selectedRiskData.value = null
}

// Helper functions
const getCustomerName = (customerId) => {
  const customer = getCustomer(customerId)
  return customer?.name || 'Unknown'
}

const getCustomerAge = (customerId) => {
  const customer = getCustomer(customerId)
  return customer?.age || 0
}

const getCustomerIncome = (customerId) => {
  const customer = getCustomer(customerId)
  return customer?.income || 0
}
</script>

<style scoped>
.drawer-enter-active,
.drawer-leave-active {
  transition: opacity 0.3s ease;
}

.drawer-enter-active .absolute,
.drawer-leave-active .absolute {
  transition: transform 0.3s ease;
}

.drawer-enter-from,
.drawer-leave-to {
  opacity: 0;
}

.drawer-enter-from .absolute,
.drawer-leave-to .absolute {
  transform: translateX(100%);
}
</style>
