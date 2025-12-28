<template>
  <div :class="['mx-auto transition-all duration-300', isSidebarCollapsed ? 'max-w-full px-2' : 'max-w-7xl']">
    <!-- Summary Cards -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2 mb-2">
      <!-- Loan-to-Deposit Ratio Card -->
      <BankingCard :title="t('loanToDepositRatio')" :value="loanToDepositRatio" format="percentage"
        icon-bg-class="bg-blue-100" :icon="ratioIcon" />

      <!-- Average CLV Card -->
      <BankingCard :title="t('averageCLV')" :value="averageCLV" format="currency" icon-bg-class="bg-green-100"
        :icon="clvIcon" />

      <!-- Top Branch Profit Card -->
      <BankingCard :title="t('topBranchProfit')" :value="topBranchProfit" format="currency" icon-bg-class="bg-purple-100"
        :icon="profitIcon" />

      <!-- Total Revenue Card -->
      <BankingCard :title="t('totalRevenue')" :value="totalRevenue" format="currency" icon-bg-class="bg-orange-100"
        :icon="revenueIcon" />
    </div>

    <!-- Branch Rankings -->
    <div class="bg-white dark:bg-gray-800 rounded-sm shadow p-3 transition-colors duration-300 mb-2">
      <h3 class="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">Top 10 Branches by Profit</h3>
      <div class="h-[400px]">
        <Bar :data="branchRankingChartData" :options="branchRankingChartOptions" />
      </div>
    </div>

    <!-- CLV Distribution and Branch Comparison -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-2 mb-2">
      <!-- CLV Distribution -->
      <div class="bg-white dark:bg-gray-800 rounded-sm shadow p-3 transition-colors duration-300">
        <h3 class="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">Customer Lifetime Value Distribution
        </h3>
        <div class="h-[300px]">
          <Bar :data="clvDistributionChartData" :options="clvDistributionChartOptions" />
        </div>
      </div>

      <!-- Branch Performance Comparison -->
      <div class="bg-white dark:bg-gray-800 rounded-sm shadow p-3 transition-colors duration-300">
        <h3 class="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">Branch Performance Comparison</h3>
        <div class="h-[300px]">
          <Bar :data="branchComparisonChartData" :options="branchComparisonChartOptions" />
        </div>
      </div>
    </div>

    <!-- Branch Performance Table -->
    <div class="bg-white dark:bg-gray-800 rounded-sm shadow transition-colors duration-300 mb-2">
      <div class="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
        <h3 class="text-lg font-semibold text-gray-800 dark:text-gray-200">Branch Performance Metrics</h3>
      </div>
      <div class="max-h-[500px] overflow-y-auto">
        <table class="w-full">
          <thead class="bg-gray-50 dark:bg-gray-800 sticky top-0 z-10">
            <tr>
              <th
                class="px-4 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider border-b border-gray-200 dark:border-gray-700">
                Rank</th>
              <th
                class="px-4 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider border-b border-gray-200 dark:border-gray-700">
                Branch</th>
              <th
                class="px-4 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider border-b border-gray-200 dark:border-gray-700">
                Location</th>
              <th
                class="px-4 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider border-b border-gray-200 dark:border-gray-700">
                Customers</th>
              <th
                class="px-4 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider border-b border-gray-200 dark:border-gray-700">
                Loans</th>
              <th
                class="px-4 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider border-b border-gray-200 dark:border-gray-700">
                Deposits</th>
              <th
                class="px-4 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider border-b border-gray-200 dark:border-gray-700">
                Revenue</th>
              <th
                class="px-4 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider border-b border-gray-200 dark:border-gray-700">
                Profit</th>
            </tr>
          </thead>
          <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            <tr v-for="(branch, index) in sortedBranches" :key="branch.id"
              class="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
              <td class="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">#{{ index + 1
              }}</td>
              <td class="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">{{
                branch.name }}</td>
              <td class="px-4 py-3 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">{{ branch.location }}
              </td>
              <td class="px-4 py-3 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">{{ branch.totalCustomers
              }}</td>
              <td class="px-4 py-3 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">${{
                branch.totalLoans.toLocaleString() }}</td>
              <td class="px-4 py-3 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">${{
                branch.totalDeposits.toLocaleString() }}</td>
              <td class="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">${{
                branch.revenue.toLocaleString() }}</td>
              <td class="px-4 py-3 whitespace-nowrap text-sm font-medium text-green-600 dark:text-green-400">${{
                branch.profit.toLocaleString() }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Top Customers by CLV -->
    <div class="bg-white dark:bg-gray-800 rounded-sm shadow transition-colors duration-300">
      <div class="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
        <h3 class="text-lg font-semibold text-gray-800 dark:text-gray-200">Top Customers by Lifetime Value</h3>
      </div>
      <div class="max-h-[400px] overflow-y-auto">
        <table class="w-full">
          <thead class="bg-gray-50 dark:bg-gray-800 sticky top-0 z-10">
            <tr>
              <th
                class="px-4 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider border-b border-gray-200 dark:border-gray-700">
                Rank</th>
              <th
                class="px-4 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider border-b border-gray-200 dark:border-gray-700">
                Customer</th>
              <th
                class="px-4 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider border-b border-gray-200 dark:border-gray-700">
                Branch</th>
              <th
                class="px-4 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider border-b border-gray-200 dark:border-gray-700">
                Lifetime Value</th>
              <th
                class="px-4 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider border-b border-gray-200 dark:border-gray-700">
                Total Deposits</th>
              <th
                class="px-4 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider border-b border-gray-200 dark:border-gray-700">
                Total Transactions</th>
            </tr>
          </thead>
          <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            <tr v-for="(customer, index) in topCustomersByCLV" :key="customer.id"
              class="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
              <td class="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">#{{ index + 1
              }}</td>
              <td class="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">{{
                customer.name }}</td>
              <td class="px-4 py-3 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">{{
                getBranchName(customer.branch) }}</td>
              <td class="px-4 py-3 whitespace-nowrap text-sm font-medium text-green-600 dark:text-green-400">${{
                customer.clv.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) }}</td>
              <td class="px-4 py-3 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">${{
                customer.totalDeposits.toLocaleString() }}</td>
              <td class="px-4 py-3 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">{{
                customer.totalTransactions }}</td>
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
import {
  calculateLoanToDepositRatio,
  calculateCustomerLifetimeValue
} from '../utils/bankingCalculations'
import { calculateBranchProfit } from '../utils/bankingData'
import { getBarChartOptions } from '../utils/chartConfigs'
import BankingCard from '../components/BankingCard.vue'
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
const { customers, loans, deposits, transactions, branches, getBranch } = useBankingData()

// Icons
const ratioIcon = '<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>'
const clvIcon = '<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>'
const profitIcon = '<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>'
const revenueIcon = '<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-orange-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>'

// Computed advanced metrics
const loanToDepositRatio = computed(() => {
  return calculateLoanToDepositRatio(loans.value, deposits.value)
})

// Calculate CLV for all customers
const customerCLVs = computed(() => {
  return customers.value.map(customer => ({
    ...customer,
    clv: calculateCustomerLifetimeValue(customer, transactions.value, deposits.value)
  }))
})

const averageCLV = computed(() => {
  if (customerCLVs.value.length === 0) return 0
  const sum = customerCLVs.value.reduce((acc, customer) => acc + customer.clv, 0)
  return sum / customerCLVs.value.length
})

// Calculate profit for all branches
const branchesWithProfit = computed(() => {
  return branches.value.map(branch => ({
    ...branch,
    profit: calculateBranchProfit(loans.value, deposits.value, customers.value, branch.id)
  }))
})

const sortedBranches = computed(() => {
  return [...branchesWithProfit.value].sort((a, b) => b.profit - a.profit)
})

const topBranchProfit = computed(() => {
  if (sortedBranches.value.length === 0) return 0
  return sortedBranches.value[0].profit
})

const totalRevenue = computed(() => {
  return branches.value.reduce((sum, branch) => sum + branch.revenue, 0)
})

// Top customers by CLV
const topCustomersByCLV = computed(() => {
  return [...customerCLVs.value]
    .sort((a, b) => b.clv - a.clv)
    .slice(0, 10)
    .map(customer => {
      const customerDeposits = deposits.value.filter(d => d.customerId === customer.id)
      const customerTransactions = transactions.value.filter(t => t.customerId === customer.id)
      return {
        ...customer,
        totalDeposits: customerDeposits.reduce((sum, d) => sum + d.balance, 0),
        totalTransactions: customerTransactions.length
      }
    })
})

// Branch ranking chart data (top 10)
const topBranches = computed(() => sortedBranches.value.slice(0, 10))
const branchRankingChartData = computed(() => ({
  labels: topBranches.value.map(b => b.name),
  datasets: [
    {
      label: 'Profit',
      data: topBranches.value.map(b => b.profit),
      backgroundColor: 'rgba(139, 92, 246, 0.8)',
      borderColor: 'rgb(139, 92, 246)',
      borderWidth: 1
    }
  ]
}))

const branchRankingChartOptions = computed(() => ({
  ...getBarChartOptions(isDarkMode.value),
  indexAxis: 'y',
  plugins: {
    ...getBarChartOptions(isDarkMode.value).plugins,
    legend: {
      display: false
    }
  }
}))

// CLV distribution (group into ranges)
const clvRanges = computed(() => {
  const ranges = {
    '0-10k': 0,
    '10k-50k': 0,
    '50k-100k': 0,
    '100k-200k': 0,
    '200k+': 0
  }

  customerCLVs.value.forEach(customer => {
    const clv = customer.clv
    if (clv < 10000) ranges['0-10k']++
    else if (clv < 50000) ranges['10k-50k']++
    else if (clv < 100000) ranges['50k-100k']++
    else if (clv < 200000) ranges['100k-200k']++
    else ranges['200k+']++
  })

  return ranges
})

const clvDistributionChartData = computed(() => ({
  labels: Object.keys(clvRanges.value),
  datasets: [
    {
      label: 'Number of Customers',
      data: Object.values(clvRanges.value),
      backgroundColor: 'rgba(16, 185, 129, 0.8)',
      borderColor: 'rgb(16, 185, 129)',
      borderWidth: 1
    }
  ]
}))

const clvDistributionChartOptions = computed(() => getBarChartOptions(isDarkMode.value))

// Branch comparison chart
const branchComparisonChartData = computed(() => ({
  labels: branches.value.map(b => b.name),
  datasets: [
    {
      label: 'Customers',
      data: branches.value.map(b => b.totalCustomers),
      backgroundColor: 'rgba(59, 130, 246, 0.8)',
      borderColor: 'rgb(59, 130, 246)',
      borderWidth: 1
    },
    {
      label: 'Revenue',
      data: branches.value.map(b => b.revenue / 1000), // Scale down for visibility
      backgroundColor: 'rgba(16, 185, 129, 0.8)',
      borderColor: 'rgb(16, 185, 129)',
      borderWidth: 1
    }
  ]
}))

const branchComparisonChartOptions = computed(() => getBarChartOptions(isDarkMode.value))

// Helper function
const getBranchName = (branchId) => {
  const branch = getBranch(branchId)
  return branch?.name || branchId
}
</script>
