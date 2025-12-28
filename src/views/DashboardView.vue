<template>
  <div :class="['mx-auto transition-all duration-300', isSidebarCollapsed ? 'max-w-full px-2' : 'max-w-7xl']">
    <!-- Summary Cards -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2 mb-2">
      <!-- Total Customers Card -->
      <div class="bg-white dark:bg-gray-800 rounded-sm shadow p-3 transition-colors duration-300">
        <div class="flex items-center justify-between">
          <div>
            <h3 class="text-gray-600 dark:text-gray-400 text-sm font-medium mb-2">{{ t('totalCustomers') }}</h3>
            <p class="text-3xl font-bold text-gray-800 dark:text-gray-200">{{ totalCustomers.toLocaleString() }}</p>
          </div>
          <div class="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24"
              stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
        </div>
      </div>

      <!-- Total Deposits Card -->
      <div class="bg-white dark:bg-gray-800 rounded-sm shadow p-3 transition-colors duration-300">
        <div class="flex items-center justify-between">
          <div>
            <h3 class="text-gray-600 dark:text-gray-400 text-sm font-medium mb-2">{{ t('totalDeposits') }}</h3>
            <p class="text-3xl font-bold text-gray-800 dark:text-gray-200">${{ totalDeposits.toLocaleString('en-US', {
              minimumFractionDigits: 2, maximumFractionDigits: 2
            }) }}</p>
          </div>
          <div class="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24"
              stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        </div>
      </div>

      <!-- Total Loans Card -->
      <div class="bg-white dark:bg-gray-800 rounded-sm shadow p-3 transition-colors duration-300">
        <div class="flex items-center justify-between">
          <div>
            <h3 class="text-gray-600 dark:text-gray-400 text-sm font-medium mb-2">{{ t('totalLoans') }}</h3>
            <p class="text-3xl font-bold text-gray-800 dark:text-gray-200">${{ totalLoans.toLocaleString('en-US', {
              minimumFractionDigits: 2, maximumFractionDigits: 2
            }) }}</p>
          </div>
          <div class="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-purple-600" fill="none" viewBox="0 0 24 24"
              stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
        </div>
      </div>

      <!-- Default Rate Card -->
      <div class="bg-white dark:bg-gray-800 rounded-sm shadow p-3 transition-colors duration-300">
        <div class="flex items-center justify-between">
          <div>
            <h3 class="text-gray-600 dark:text-gray-400 text-sm font-medium mb-2">{{ t('defaultRate') }}</h3>
            <p class="text-3xl font-bold text-gray-800 dark:text-gray-200">{{ defaultRate.toFixed(2) }}%</p>
          </div>
          <div class="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24"
              stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
        </div>
      </div>
    </div>

    <!-- Charts Section -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-2">
      <!-- Left: Line Chart - Deposits vs Loans -->
      <div class="lg:col-span-2 bg-white dark:bg-gray-800 rounded-sm shadow p-3 transition-colors duration-300">
        <h3 class="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">{{ t('depositsVsLoans') }}</h3>
        <div class="h-[450px]">
          <Line :data="lineChartData" :options="lineChartOptions" />
        </div>
      </div>

      <!-- Right: Pie Chart - Customer Types -->
      <div class="lg:col-span-1 space-y-3">
        <!-- Customer Types Pie Chart -->
        <div class="bg-white dark:bg-gray-800 rounded-sm shadow p-3 transition-colors duration-300">
          <h3 class="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">{{ t('customerTypes') }}</h3>
          <div class="h-[195px]">
            <Pie :data="pieChartData" :options="pieChartOptions" />
          </div>
        </div>

        <!-- Monthly Transactions -->
        <div class="bg-white dark:bg-gray-800 rounded-sm shadow p-3 transition-colors duration-300">
          <h3 class="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">{{ t('monthlyTransactions') }}</h3>
          <div class="h-[195px]">
            <Line :data="transactionChartData" :options="transactionChartOptions" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, inject } from 'vue'
import { useI18n } from '../composables/useI18n'
import { useBankingData } from '../composables/useBankingData'
import {
  calculateTotalDeposits,
  calculateTotalLoans,
  calculateDefaultRate,
  calculateMonthlyTotals,
  groupByMonth
} from '../utils/bankingCalculations'
import { groupCustomersByAccountType } from '../utils/bankingData'
import { getLineChartOptions, getPieChartOptions } from '../utils/chartConfigs'

// Inject sidebar collapse state
const isSidebarCollapsed = inject('isSidebarCollapsed', ref(false))
const isDarkMode = inject('isDarkMode', ref(false))
const { t } = useI18n()

// Load banking data
const { customers, loans, deposits, transactions } = useBankingData()

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js'
import { Line, Pie } from 'vue-chartjs'

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
)

// Computed banking KPIs
const totalCustomers = computed(() => customers.value.length)

const totalDeposits = computed(() => {
  return calculateTotalDeposits(deposits.value)
})

const totalLoans = computed(() => {
  return calculateTotalLoans(loans.value)
})

const defaultRate = computed(() => {
  return calculateDefaultRate(loans.value)
})

// Process deposits and loans by month for line chart
const processDepositsLoansByMonth = () => {
  const monthlyData = {
    'Jan': { deposits: 0, loans: 0 },
    'Feb': { deposits: 0, loans: 0 },
    'Mar': { deposits: 0, loans: 0 },
    'Apr': { deposits: 0, loans: 0 },
    'May': { deposits: 0, loans: 0 },
    'Jun': { deposits: 0, loans: 0 },
    'Jul': { deposits: 0, loans: 0 },
    'Aug': { deposits: 0, loans: 0 },
    'Sep': { deposits: 0, loans: 0 },
    'Oct': { deposits: 0, loans: 0 },
    'Nov': { deposits: 0, loans: 0 },
    'Dec': { deposits: 0, loans: 0 }
  }

  // Process deposits by open date
  deposits.value.forEach(deposit => {
    const date = new Date(deposit.openDate)
    const monthName = date.toLocaleDateString('en-US', { month: 'short' })
    if (monthlyData[monthName]) {
      monthlyData[monthName].deposits += deposit.balance
    }
  })

  // Process loans by approval date
  loans.value.forEach(loan => {
    const date = new Date(loan.approvalDate)
    const monthName = date.toLocaleDateString('en-US', { month: 'short' })
    if (monthlyData[monthName]) {
      monthlyData[monthName].loans += loan.amount
    }
  })

  return monthlyData
}

const monthlyData = processDepositsLoansByMonth()
const monthLabels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

// Line Chart Data - Deposits vs Loans
const lineChartData = ref({
  labels: monthLabels,
  datasets: [
    {
      label: t('totalDeposits'),
      data: monthLabels.map(month => monthlyData[month].deposits),
      borderColor: 'rgb(16, 185, 129)',
      backgroundColor: 'rgba(16, 185, 129, 0.1)',
      tension: 0.4,
      fill: true
    },
    {
      label: t('totalLoans'),
      data: monthLabels.map(month => monthlyData[month].loans),
      borderColor: 'rgb(59, 130, 246)',
      backgroundColor: 'rgba(59, 130, 246, 0.1)',
      tension: 0.4,
      fill: true
    }
  ]
})

const lineChartOptions = computed(() => getLineChartOptions(isDarkMode.value))

// Process customer types for pie chart
const customerTypes = computed(() => groupCustomersByAccountType(customers.value))
const customerTypeLabels = computed(() => Object.keys(customerTypes.value))
const customerTypeValues = computed(() => Object.values(customerTypes.value))

// Color palette for customer types
const getCustomerTypeColors = (count) => {
  const colors = [
    'rgb(59, 130, 246)',   // blue - Savings
    'rgb(16, 185, 129)',   // green - Checking
    'rgb(139, 92, 246)',   // purple - Business
    'rgb(251, 191, 36)',   // yellow
    'rgb(239, 68, 68)'     // red
  ]

  return {
    backgroundColor: colors.slice(0, count),
    borderColor: colors.slice(0, count)
  }
}

const customerTypeColors = computed(() => getCustomerTypeColors(customerTypeLabels.value.length))

// Pie Chart Data - Customer Types
const pieChartData = computed(() => ({
  labels: customerTypeLabels.value,
  datasets: [
    {
      data: customerTypeValues.value,
      backgroundColor: customerTypeColors.value.backgroundColor,
      borderColor: customerTypeColors.value.borderColor,
      borderWidth: 2
    }
  ]
}))

const pieChartOptions = computed(() => getPieChartOptions(isDarkMode.value))

// Monthly Transactions Chart
const monthlyTransactions = computed(() => {
  return calculateMonthlyTotals(transactions.value, 'date', 'amount')
})

const transactionChartData = computed(() => ({
  labels: monthlyTransactions.value.map(m => m.month),
  datasets: [
    {
      label: t('transactions'),
      data: monthlyTransactions.value.map(m => m.total),
      borderColor: 'rgb(249, 115, 22)',
      backgroundColor: 'rgba(249, 115, 22, 0.1)',
      tension: 0.4,
      fill: true
    }
  ]
}))

const transactionChartOptions = computed(() => getLineChartOptions(isDarkMode.value))
</script>
