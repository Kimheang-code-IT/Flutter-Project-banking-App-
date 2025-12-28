<template>
  <div :class="['mx-auto transition-all duration-300', isSidebarCollapsed ? 'max-w-full px-2' : 'max-w-7xl']">
    <!-- Summary Cards -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2 mb-2">
      <!-- Total Deposits Card -->
      <BankingCard
        :title="t('totalDeposits')"
        :value="totalDeposits"
        format="currency"
        icon-bg-class="bg-blue-100"
        :icon="depositIcon"
      />
      
      <!-- Total Interest Earned Card -->
      <BankingCard
        :title="t('totalInterestEarned')"
        :value="totalInterestEarned"
        format="currency"
        icon-bg-class="bg-green-100"
        :icon="interestIcon"
      />
      
      <!-- Average Deposit Card -->
      <BankingCard
        :title="t('averageDeposit')"
        :value="averageDeposit"
        format="currency"
        icon-bg-class="bg-purple-100"
        :icon="averageIcon"
      />
      
      <!-- High Value Customers Card -->
      <BankingCard
        :title="t('highValueCustomers')"
        :value="highValueCustomersCount"
        format="number"
        icon-bg-class="bg-orange-100"
        :icon="highValueIcon"
      />
    </div>

    <!-- Charts Section -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-2 mb-2">
      <!-- Deposit Growth Chart -->
      <div class="bg-white dark:bg-gray-800 rounded-sm shadow p-3 transition-colors duration-300">
        <h3 class="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">Deposit Growth Over Time</h3>
        <div class="h-[300px]">
          <Line :data="depositGrowthChartData" :options="depositGrowthChartOptions" />
        </div>
      </div>

      <!-- Balance Distribution Chart -->
      <div class="bg-white dark:bg-gray-800 rounded-sm shadow p-3 transition-colors duration-300">
        <h3 class="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">Balance Distribution</h3>
        <div class="h-[300px]">
          <Bar :data="balanceDistributionChartData" :options="balanceDistributionChartOptions" />
        </div>
      </div>
    </div>

    <!-- Deposit Type Distribution -->
    <div class="bg-white dark:bg-gray-800 rounded-sm shadow p-3 transition-colors duration-300 mb-2">
      <h3 class="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">Deposit Type Breakdown</h3>
      <div class="h-[250px]">
        <Pie :data="depositTypeChartData" :options="depositTypeChartOptions" />
      </div>
    </div>

    <!-- Search and Filter Bar -->
    <div class="py-3 mb-2">
      <div class="flex flex-col md:flex-row gap-4 items-center justify-between">
        <div class="relative w-[400px]">
          <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg class="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Search deposits..."
            class="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200"
          />
        </div>
        <div class="flex items-center gap-4">
          <div class="relative">
            <select
              v-model="selectedDepositType"
              class="appearance-none bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-sm px-4 py-2 pr-8 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 dark:text-gray-200"
            >
              <option value="">All Types</option>
              <option value="Savings">Savings</option>
              <option value="Checking">Checking</option>
              <option value="Fixed">Fixed</option>
            </select>
            <div class="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
              <svg class="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
          <div class="relative">
            <select
              v-model="selectedBranch"
              class="appearance-none bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-sm px-4 py-2 pr-8 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 dark:text-gray-200"
            >
              <option value="">All Branches</option>
              <option v-for="branch in branches" :key="branch.id" :value="branch.id">{{ branch.name }}</option>
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

    <!-- High Value Customers Section -->
    <div class="bg-white dark:bg-gray-800 rounded-sm shadow transition-colors duration-300 mb-2">
      <div class="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
        <h3 class="text-lg font-semibold text-gray-800 dark:text-gray-200">High Value Customers (Top 10)</h3>
      </div>
      <div class="max-h-[300px] overflow-y-auto">
        <table class="w-full">
          <thead class="bg-gray-50 dark:bg-gray-800 sticky top-0 z-10">
            <tr>
              <th class="px-4 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider border-b border-gray-200 dark:border-gray-700">Rank</th>
              <th class="px-4 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider border-b border-gray-200 dark:border-gray-700">Customer</th>
              <th class="px-4 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider border-b border-gray-200 dark:border-gray-700">Deposit Type</th>
              <th class="px-4 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider border-b border-gray-200 dark:border-gray-700">Balance</th>
              <th class="px-4 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider border-b border-gray-200 dark:border-gray-700">Interest Earned</th>
              <th class="px-4 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider border-b border-gray-200 dark:border-gray-700">Branch</th>
            </tr>
          </thead>
          <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            <tr
              v-for="(deposit, index) in topDepositors"
              :key="deposit.id"
              class="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              <td class="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">#{{ index + 1 }}</td>
              <td class="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">
                {{ getCustomerName(deposit.customerId) }}
              </td>
              <td class="px-4 py-3 whitespace-nowrap">
                <span
                  :class="[
                    'px-2 py-1 text-xs font-medium rounded-sm',
                    deposit.depositType === 'Savings' ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-400' :
                    deposit.depositType === 'Checking' ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400' :
                    'bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-400'
                  ]"
                >
                  {{ deposit.depositType }}
                </span>
              </td>
              <td class="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">
                ${{ deposit.balance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) }}
              </td>
              <td class="px-4 py-3 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                ${{ deposit.interestEarned.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) }}
              </td>
              <td class="px-4 py-3 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                {{ getBranchName(deposit.branch) }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- All Deposits Table -->
    <div class="bg-white dark:bg-gray-800 rounded-sm shadow transition-colors duration-300">
      <div class="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
        <h3 class="text-lg font-semibold text-gray-800 dark:text-gray-200">All Deposits</h3>
      </div>
      <div class="max-h-[500px] overflow-y-auto">
        <table class="w-full">
          <thead class="bg-gray-50 dark:bg-gray-800 sticky top-0 z-10">
            <tr>
              <th class="px-4 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider border-b border-gray-200 dark:border-gray-700">No</th>
              <th class="px-4 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider border-b border-gray-200 dark:border-gray-700">Customer</th>
              <th class="px-4 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider border-b border-gray-200 dark:border-gray-700">Deposit Type</th>
              <th class="px-4 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider border-b border-gray-200 dark:border-gray-700">Balance</th>
              <th class="px-4 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider border-b border-gray-200 dark:border-gray-700">Interest Earned</th>
              <th class="px-4 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider border-b border-gray-200 dark:border-gray-700">Open Date</th>
              <th class="px-4 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider border-b border-gray-200 dark:border-gray-700">Branch</th>
            </tr>
          </thead>
          <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            <tr
              v-for="(deposit, index) in filteredDeposits"
              :key="deposit.id"
              class="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              <td class="px-4 py-3 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">{{ index + 1 }}</td>
              <td class="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">
                {{ getCustomerName(deposit.customerId) }}
              </td>
              <td class="px-4 py-3 whitespace-nowrap">
                <span
                  :class="[
                    'px-2 py-1 text-xs font-medium rounded-sm',
                    deposit.depositType === 'Savings' ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-400' :
                    deposit.depositType === 'Checking' ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400' :
                    'bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-400'
                  ]"
                >
                  {{ deposit.depositType }}
                </span>
              </td>
              <td class="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">
                ${{ deposit.balance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) }}
              </td>
              <td class="px-4 py-3 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                ${{ deposit.interestEarned.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) }}
              </td>
              <td class="px-4 py-3 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                {{ new Date(deposit.openDate).toLocaleDateString() }}
              </td>
              <td class="px-4 py-3 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                {{ getBranchName(deposit.branch) }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, inject } from 'vue'
import { useI18n } from '../composables/useI18n'
import { useBankingData } from '../composables/useBankingData'
import { calculateTotalDeposits, calculateMonthlyTotals } from '../utils/bankingCalculations'
import { groupDepositsByType, getTopDepositors } from '../utils/bankingData'
import { getLineChartOptions, getBarChartOptions, getPieChartOptions } from '../utils/chartConfigs'
import BankingCard from '../components/BankingCard.vue'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js'
import { Line, Bar, Pie } from 'vue-chartjs'

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
)

// Inject sidebar collapse state
const isSidebarCollapsed = inject('isSidebarCollapsed', ref(false))
const isDarkMode = inject('isDarkMode', ref(false))
const { t } = useI18n()

// Load banking data
const { customers, deposits, branches, getCustomer, getBranch } = useBankingData()

// Icons
const depositIcon = '<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>'
const interestIcon = '<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>'
const averageIcon = '<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>'
const highValueIcon = '<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-orange-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" /></svg>'

// Search and filters
const searchQuery = ref('')
const selectedDepositType = ref('')
const selectedBranch = ref('')

// Computed values
const totalDeposits = computed(() => calculateTotalDeposits(deposits.value))
const totalInterestEarned = computed(() => {
  return deposits.value.reduce((sum, deposit) => sum + deposit.interestEarned, 0)
})
const averageDeposit = computed(() => {
  if (deposits.value.length === 0) return 0
  return totalDeposits.value / deposits.value.length
})

// High value customers (balance > 50000)
const highValueCustomersCount = computed(() => {
  return deposits.value.filter(d => d.balance > 50000).length
})

// Top depositors
const topDepositors = computed(() => getTopDepositors(deposits.value, 10))

// Filtered deposits
const filteredDeposits = computed(() => {
  let filtered = deposits.value
  
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(deposit => 
      deposit.id.toLowerCase().includes(query) ||
      getCustomerName(deposit.customerId).toLowerCase().includes(query)
    )
  }
  
  if (selectedDepositType.value) {
    filtered = filtered.filter(deposit => deposit.depositType === selectedDepositType.value)
  }
  
  if (selectedBranch.value) {
    filtered = filtered.filter(deposit => deposit.branch === selectedBranch.value)
  }
  
  return filtered.sort((a, b) => b.balance - a.balance)
})

// Deposit growth over time (by open date)
const depositGrowthData = computed(() => {
  const sorted = [...deposits.value].sort((a, b) => new Date(a.openDate) - new Date(b.openDate))
  const monthlyGrowth = {}
  
  sorted.forEach(deposit => {
    const date = new Date(deposit.openDate)
    const monthKey = date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
    
    if (!monthlyGrowth[monthKey]) {
      monthlyGrowth[monthKey] = { count: 0, total: 0 }
    }
    monthlyGrowth[monthKey].count++
    monthlyGrowth[monthKey].total += deposit.balance
  })
  
  return Object.keys(monthlyGrowth).sort().map(month => ({
    month,
    total: monthlyGrowth[month].total
  }))
})

const depositGrowthChartData = computed(() => ({
  labels: depositGrowthData.value.map(d => d.month),
  datasets: [
    {
      label: 'Total Deposits',
      data: depositGrowthData.value.map(d => d.total),
      borderColor: 'rgb(59, 130, 246)',
      backgroundColor: 'rgba(59, 130, 246, 0.1)',
      tension: 0.4,
      fill: true
    }
  ]
}))

const depositGrowthChartOptions = computed(() => getLineChartOptions(isDarkMode.value))

// Balance distribution (group into ranges)
const balanceRanges = computed(() => {
  const ranges = {
    '0-10k': 0,
    '10k-50k': 0,
    '50k-100k': 0,
    '100k-200k': 0,
    '200k+': 0
  }
  
  deposits.value.forEach(deposit => {
    const balance = deposit.balance
    if (balance < 10000) ranges['0-10k']++
    else if (balance < 50000) ranges['10k-50k']++
    else if (balance < 100000) ranges['50k-100k']++
    else if (balance < 200000) ranges['100k-200k']++
    else ranges['200k+']++
  })
  
  return ranges
})

const balanceDistributionChartData = computed(() => ({
  labels: Object.keys(balanceRanges.value),
  datasets: [
    {
      label: 'Number of Deposits',
      data: Object.values(balanceRanges.value),
      backgroundColor: 'rgba(16, 185, 129, 0.8)',
      borderColor: 'rgb(16, 185, 129)',
      borderWidth: 1
    }
  ]
}))

const balanceDistributionChartOptions = computed(() => getBarChartOptions(isDarkMode.value))

// Deposit type distribution
const depositTypes = computed(() => groupDepositsByType(deposits.value))
const depositTypeChartData = computed(() => ({
  labels: Object.keys(depositTypes.value),
  datasets: [
    {
      data: Object.values(depositTypes.value),
      backgroundColor: [
        'rgba(59, 130, 246, 0.8)',
        'rgba(16, 185, 129, 0.8)',
        'rgba(139, 92, 246, 0.8)'
      ],
      borderColor: [
        'rgb(59, 130, 246)',
        'rgb(16, 185, 129)',
        'rgb(139, 92, 246)'
      ],
      borderWidth: 2
    }
  ]
}))

const depositTypeChartOptions = computed(() => getPieChartOptions(isDarkMode.value))

// Helper functions
const getCustomerName = (customerId) => {
  const customer = getCustomer(customerId)
  return customer?.name || 'Unknown'
}

const getBranchName = (branchId) => {
  const branch = getBranch(branchId)
  return branch?.name || branchId
}
</script>
