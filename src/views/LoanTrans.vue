<template>
  <div :class="['mx-auto transition-all duration-300', isSidebarCollapsed ? 'max-w-full px-2' : 'max-w-7xl']">
    <!-- Summary Cards -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-2 mb-2">
      <!-- Total Loans Card -->
      <BankingCard :title="t('totalLoans')" :value="totalLoans" format="currency" icon-bg-class="bg-blue-100"
        :icon="loanIcon" />

      <!-- Loan Approval Rate Card -->
      <BankingCard :title="t('approvalRate')" :value="loanApprovalRate" format="percentage" icon-bg-class="bg-green-100"
        :icon="approvalIcon" />

      <!-- Average Loan Size Card -->
      <BankingCard :title="t('averageLoanSize')" :value="averageLoanSize" format="currency" icon-bg-class="bg-purple-100"
        :icon="averageIcon" />

      <!-- Total Transactions Card -->
      <BankingCard :title="t('totalTransactions')" :value="totalTransactions" format="number" icon-bg-class="bg-orange-100"
        :icon="transactionIcon" />
    </div>

    <!-- Charts Section -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-2 mb-2">
      <!-- Loan Status Pie Chart -->
      <div class="bg-white dark:bg-gray-800 rounded-sm shadow p-3 transition-colors duration-300">
        <h3 class="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">{{ t('loanStatus') }}</h3>
        <div class="h-[300px]">
          <Pie :data="loanStatusChartData" :options="loanStatusChartOptions" />
        </div>
      </div>

      <!-- Loan Type Distribution -->
      <div class="bg-white dark:bg-gray-800 rounded-sm shadow p-3 transition-colors duration-300">
        <h3 class="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">{{ t('loanTypeDistribution') }}</h3>
        <div class="h-[300px]">
          <Pie :data="loanTypeChartData" :options="loanTypeChartOptions" />
        </div>
      </div>
    </div>

    <!-- Monthly Transaction Volume -->
    <div class="bg-white dark:bg-gray-800 rounded-sm shadow p-3 transition-colors duration-300 mb-2">
      <h3 class="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">{{ t('monthlyTransactionVolume') }}</h3>
      <div class="h-[300px]">
        <Line :data="transactionVolumeChartData" :options="transactionVolumeChartOptions" />
      </div>
    </div>

    <!-- Tabs for Loans and Transactions -->
    <div class="bg-white dark:bg-gray-800 rounded-sm shadow transition-colors duration-300">
      <div class="border-b border-gray-200 dark:border-gray-700">
        <nav class="flex -mb-px">
          <button @click="activeTab = 'loans'" :class="[
            'px-6 py-3 text-sm font-medium border-b-2 transition-colors',
            activeTab === 'loans'
              ? 'border-blue-600 text-blue-600 dark:text-blue-400'
              : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300'
          ]">
            {{ t('loans') }}
          </button>
          <button @click="activeTab = 'transactions'" :class="[
            'px-6 py-3 text-sm font-medium border-b-2 transition-colors',
            activeTab === 'transactions'
              ? 'border-blue-600 text-blue-600 dark:text-blue-400'
              : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300'
          ]">
            {{ t('transactions') }}
          </button>
        </nav>
      </div>

      <!-- Search and Filter Bar -->
      <div class="p-4 border-b border-gray-200 dark:border-gray-700">
        <div class="flex flex-col md:flex-row gap-4 items-center justify-between">
          <div class="relative w-[400px]">
            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg class="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input v-model="searchQuery" type="text"
              :placeholder="activeTab === 'loans' ? t('searchLoans') : t('searchTransactions')"
              class="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200" />
          </div>
          <div class="flex items-center gap-4">
            <div v-if="activeTab === 'loans'" class="relative">
              <select v-model="selectedLoanType"
                class="appearance-none bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-sm px-4 py-2 pr-8 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 dark:text-gray-200">
                <option value="">{{ t('allLoanTypes') }}</option>
                <option value="Personal">{{ t('personal') }}</option>
                <option value="Business">{{ t('business') }}</option>
              </select>
              <div class="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                <svg class="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
            <div v-if="activeTab === 'loans'" class="relative">
              <select v-model="selectedLoanStatus"
                class="appearance-none bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-sm px-4 py-2 pr-8 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 dark:text-gray-200">
                <option value="">{{ t('allStatuses') }}</option>
                <option value="Paid">Paid</option>
                <option value="Late">Late</option>
                <option value="Default">Default</option>
              </select>
              <div class="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                <svg class="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
            <div v-if="activeTab === 'transactions'" class="relative">
              <select v-model="selectedTransactionType"
                class="appearance-none bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-sm px-4 py-2 pr-8 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 dark:text-gray-200">
                <option value="">All Types</option>
                <option value="Deposit">Deposit</option>
                <option value="Withdrawal">Withdrawal</option>
                <option value="Transfer">Transfer</option>
                <option value="Loan Payment">Loan Payment</option>
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

      <!-- Loans Table -->
      <div v-if="activeTab === 'loans'" class="max-h-[500px] overflow-y-auto">
        <table class="w-full">
          <thead class="bg-gray-50 dark:bg-gray-800 sticky top-0 z-10">
            <tr>
              <th
                class="px-4 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider border-b border-gray-200 dark:border-gray-700">
                {{ t('number') }}</th>
              <th
                class="px-4 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider border-b border-gray-200 dark:border-gray-700">
                {{ t('customer') }}</th>
              <th
                class="px-4 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider border-b border-gray-200 dark:border-gray-700">
                {{ t('loanType') }}</th>
              <th
                class="px-4 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider border-b border-gray-200 dark:border-gray-700">
                {{ t('amount') }}</th>
              <th
                class="px-4 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider border-b border-gray-200 dark:border-gray-700">
                {{ t('interestRate') }}</th>
              <th
                class="px-4 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider border-b border-gray-200 dark:border-gray-700">
                {{ t('status') }}</th>
              <th
                class="px-4 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider border-b border-gray-200 dark:border-gray-700">
                {{ t('approvalDate') }}</th>
              <th
                class="px-4 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider border-b border-gray-200 dark:border-gray-700">
                {{ t('dueDate') }}</th>
            </tr>
          </thead>
          <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            <tr v-for="(loan, index) in filteredLoans" :key="loan.id"
              class="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
              <td class="px-4 py-3 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">{{ index + 1 }}</td>
              <td class="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">
                {{ getCustomerName(loan.customerId) }}
              </td>
              <td class="px-4 py-3 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">{{ loan.loanType }}</td>
              <td class="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">
                ${{ loan.amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) }}
              </td>
              <td class="px-4 py-3 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">{{ loan.interestRate }}%
              </td>
              <td class="px-4 py-3 whitespace-nowrap">
                <span :class="[
                  'px-2 py-1 text-xs font-medium rounded-sm',
                  loan.status === 'Paid' ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400' :
                    loan.status === 'Late' ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-400' :
                      'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-400'
                ]">
                  {{ loan.status }}
                </span>
              </td>
              <td class="px-4 py-3 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                {{ new Date(loan.approvalDate).toLocaleDateString() }}
              </td>
              <td class="px-4 py-3 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                {{ new Date(loan.dueDate).toLocaleDateString() }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Transactions Table -->
      <div v-if="activeTab === 'transactions'" class="max-h-[500px] overflow-y-auto">
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
                Type</th>
              <th
                class="px-4 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider border-b border-gray-200 dark:border-gray-700">
                Amount</th>
              <th
                class="px-4 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider border-b border-gray-200 dark:border-gray-700">
                Date</th>
              <th
                class="px-4 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider border-b border-gray-200 dark:border-gray-700">
                Branch</th>
              <th
                class="px-4 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider border-b border-gray-200 dark:border-gray-700">
                Status</th>
            </tr>
          </thead>
          <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            <tr v-for="(transaction, index) in filteredTransactions" :key="transaction.id"
              class="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
              <td class="px-4 py-3 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">{{ index + 1 }}</td>
              <td class="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">
                {{ getCustomerName(transaction.customerId) }}
              </td>
              <td class="px-4 py-3 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">{{ transaction.type }}
              </td>
              <td class="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">
                ${{ transaction.amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
                }}
              </td>
              <td class="px-4 py-3 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                {{ new Date(transaction.date).toLocaleDateString() }}
              </td>
              <td class="px-4 py-3 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                {{ getBranchName(transaction.branch) }}
              </td>
              <td class="px-4 py-3 whitespace-nowrap">
                <span :class="[
                  'px-2 py-1 text-xs font-medium rounded-sm',
                  transaction.status === 'Completed' ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400' :
                    'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300'
                ]">
                  {{ transaction.status }}
                </span>
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
import {
  calculateTotalLoans,
  calculateLoanApprovalRate,
  calculateAverageLoanSize,
  calculateMonthlyTotals,
  groupLoansByStatus,
  groupLoansByType
} from '../utils/bankingCalculations'
import { getPieChartOptions, getLineChartOptions } from '../utils/chartConfigs'
import BankingCard from '../components/BankingCard.vue'
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

// Inject sidebar collapse state
const isSidebarCollapsed = inject('isSidebarCollapsed', ref(false))
const isDarkMode = inject('isDarkMode', ref(false))
const { t } = useI18n()

// Load banking data
const { customers, loans, transactions, branches, getCustomer, getBranch } = useBankingData()

// Icons
const loanIcon = '<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>'
const approvalIcon = '<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>'
const averageIcon = '<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>'
const transactionIcon = '<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-orange-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" /></svg>'

// Tab state
const activeTab = ref('loans')

// Search and filters
const searchQuery = ref('')
const selectedLoanType = ref('')
const selectedLoanStatus = ref('')
const selectedTransactionType = ref('')

// Computed values
const totalLoans = computed(() => calculateTotalLoans(loans.value))
const loanApprovalRate = computed(() => calculateLoanApprovalRate(loans.value))
const averageLoanSize = computed(() => calculateAverageLoanSize(loans.value))
const totalTransactions = computed(() => transactions.value.length)

// Filtered loans
const filteredLoans = computed(() => {
  let filtered = loans.value

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(loan =>
      loan.id.toLowerCase().includes(query) ||
      getCustomerName(loan.customerId).toLowerCase().includes(query)
    )
  }

  if (selectedLoanType.value) {
    filtered = filtered.filter(loan => loan.loanType === selectedLoanType.value)
  }

  if (selectedLoanStatus.value) {
    filtered = filtered.filter(loan => loan.status === selectedLoanStatus.value)
  }

  return filtered
})

// Filtered transactions
const filteredTransactions = computed(() => {
  let filtered = transactions.value

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(transaction =>
      transaction.id.toLowerCase().includes(query) ||
      getCustomerName(transaction.customerId).toLowerCase().includes(query)
    )
  }

  if (selectedTransactionType.value) {
    filtered = filtered.filter(transaction => transaction.type === selectedTransactionType.value)
  }

  return filtered.sort((a, b) => new Date(b.date) - new Date(a.date))
})

// Loan status chart data
const loanStatusData = computed(() => groupLoansByStatus(loans.value))
const loanStatusChartData = computed(() => ({
  labels: Object.keys(loanStatusData.value),
  datasets: [
    {
      data: Object.values(loanStatusData.value),
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
      borderWidth: 2
    }
  ]
}))

const loanStatusChartOptions = computed(() => getPieChartOptions(isDarkMode.value))

// Loan type chart data
const loanTypeData = computed(() => groupLoansByType(loans.value))
const loanTypeChartData = computed(() => ({
  labels: Object.keys(loanTypeData.value),
  datasets: [
    {
      data: Object.values(loanTypeData.value),
      backgroundColor: [
        'rgba(59, 130, 246, 0.8)',
        'rgba(139, 92, 246, 0.8)'
      ],
      borderColor: [
        'rgb(59, 130, 246)',
        'rgb(139, 92, 246)'
      ],
      borderWidth: 2
    }
  ]
}))

const loanTypeChartOptions = computed(() => getPieChartOptions(isDarkMode.value))

// Monthly transaction volume
const monthlyTransactions = computed(() => calculateMonthlyTotals(transactions.value, 'date', 'amount'))
const transactionVolumeChartData = computed(() => ({
  labels: monthlyTransactions.value.map(m => m.month),
  datasets: [
    {
      label: 'Transaction Volume',
      data: monthlyTransactions.value.map(m => m.total),
      borderColor: 'rgb(249, 115, 22)',
      backgroundColor: 'rgba(249, 115, 22, 0.1)',
      tension: 0.4,
      fill: true
    }
  ]
}))

const transactionVolumeChartOptions = computed(() => getLineChartOptions(isDarkMode.value))

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

