<template>
  <div :class="['mx-auto transition-all duration-300', isSidebarCollapsed ? 'max-w-full px-2' : 'max-w-7xl']">
    <!-- Report Generation Section -->
    <div class="bg-white dark:bg-gray-800 rounded-sm shadow p-6 transition-colors duration-300 mb-2">
      <h2 class="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-6">Report Generation</h2>

      <!-- Report Type Selection -->
      <div class="mb-6">
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Report Type</label>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button v-for="type in reportTypes" :key="type.value" @click="selectedReportType = type.value" :class="[
            'p-4 border-2 rounded-sm transition-colors text-left',
            selectedReportType === type.value
              ? 'border-blue-600 dark:border-blue-400 bg-blue-50 dark:bg-blue-900/30'
              : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500',
            'bg-white dark:bg-gray-700'
          ]">
            <h3 class="font-semibold text-gray-800 dark:text-gray-200 mb-1">{{ type.label }}</h3>
            <p class="text-sm text-gray-600 dark:text-gray-400">{{ type.description }}</p>
          </button>
        </div>
      </div>

      <!-- Date Range Selection -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Start Date</label>
          <input v-model="startDate" type="date"
            class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200" />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">End Date</label>
          <input v-model="endDate" type="date"
            class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200" />
        </div>
      </div>

      <!-- Report Sections Selection -->
      <div class="mb-6">
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Include Sections</label>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-3">
          <label v-for="section in reportSections" :key="section.value"
            class="flex items-center gap-2 p-3 border border-gray-300 dark:border-gray-600 rounded-sm cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
            <input v-model="selectedSections" type="checkbox" :value="section.value"
              class="rounded border-gray-300 dark:border-gray-600 text-blue-600 focus:ring-blue-500" />
            <span class="text-sm text-gray-700 dark:text-gray-300">{{ section.label }}</span>
          </label>
        </div>
      </div>

      <!-- Export Buttons -->
      <div class="flex flex-wrap gap-4">
        <ExportButton label="Export as PDF" format="pdf" variant="primary" @export="handleExport" />
        <ExportButton label="Export as Excel" format="excel" variant="secondary" @export="handleExport" />
        <ExportButton label="Export as PowerPoint" format="powerpoint" variant="secondary" @export="handleExport" />
      </div>
    </div>

    <!-- Report Preview Section -->
    <div class="bg-white dark:bg-gray-800 rounded-sm shadow p-6 transition-colors duration-300">
      <div class="flex items-center justify-between mb-4">
        <h2 class="text-xl font-semibold text-gray-800 dark:text-gray-200">Report Preview</h2>
        <button @click="generatePreview"
          class="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-sm hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors font-medium">
          Generate Preview
        </button>
      </div>

      <!-- Preview Content -->
      <div v-if="showPreview" class="space-y-4">
        <!-- Executive Summary -->
        <div v-if="selectedSections.includes('summary')"
          class="border border-gray-200 dark:border-gray-700 rounded-sm p-4">
          <h3 class="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-3">Executive Summary</h3>
          <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div class="bg-gray-50 dark:bg-gray-700 rounded-sm p-3">
              <p class="text-sm text-gray-600 dark:text-gray-400">Total Customers</p>
              <p class="text-2xl font-bold text-gray-800 dark:text-gray-200">{{ previewData.totalCustomers }}</p>
            </div>
            <div class="bg-gray-50 dark:bg-gray-700 rounded-sm p-3">
              <p class="text-sm text-gray-600 dark:text-gray-400">Total Deposits</p>
              <p class="text-2xl font-bold text-gray-800 dark:text-gray-200">${{
                previewData.totalDeposits.toLocaleString() }}</p>
            </div>
            <div class="bg-gray-50 dark:bg-gray-700 rounded-sm p-3">
              <p class="text-sm text-gray-600 dark:text-gray-400">Total Loans</p>
              <p class="text-2xl font-bold text-gray-800 dark:text-gray-200">${{ previewData.totalLoans.toLocaleString()
                }}</p>
            </div>
            <div class="bg-gray-50 dark:bg-gray-700 rounded-sm p-3">
              <p class="text-sm text-gray-600 dark:text-gray-400">Default Rate</p>
              <p class="text-2xl font-bold text-gray-800 dark:text-gray-200">{{ previewData.defaultRate.toFixed(2) }}%
              </p>
            </div>
          </div>
        </div>

        <!-- Risk Assessment -->
        <div v-if="selectedSections.includes('risk')"
          class="border border-gray-200 dark:border-gray-700 rounded-sm p-4">
          <h3 class="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-3">Risk Assessment</h3>
          <div class="space-y-2">
            <div class="flex justify-between items-center">
              <span class="text-sm text-gray-700 dark:text-gray-300">Low Risk Customers</span>
              <span class="font-medium text-gray-800 dark:text-gray-200">{{ previewData.riskDistribution.Low }}</span>
            </div>
            <div class="flex justify-between items-center">
              <span class="text-sm text-gray-700 dark:text-gray-300">Medium Risk Customers</span>
              <span class="font-medium text-gray-800 dark:text-gray-200">{{ previewData.riskDistribution.Medium
                }}</span>
            </div>
            <div class="flex justify-between items-center">
              <span class="text-sm text-gray-700 dark:text-gray-300">High Risk Customers</span>
              <span class="font-medium text-gray-800 dark:text-gray-200">{{ previewData.riskDistribution.High }}</span>
            </div>
          </div>
        </div>

        <!-- Branch Performance -->
        <div v-if="selectedSections.includes('branch')"
          class="border border-gray-200 dark:border-gray-700 rounded-sm p-4">
          <h3 class="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-3">Branch Performance</h3>
          <p class="text-sm text-gray-600 dark:text-gray-400">Top performing branches and their metrics</p>
        </div>

        <!-- Financial Analytics -->
        <div v-if="selectedSections.includes('financial')"
          class="border border-gray-200 dark:border-gray-700 rounded-sm p-4">
          <h3 class="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-3">Financial Analytics</h3>
          <div class="space-y-2">
            <div class="flex justify-between items-center">
              <span class="text-sm text-gray-700 dark:text-gray-300">Loan-to-Deposit Ratio</span>
              <span class="font-medium text-gray-800 dark:text-gray-200">{{ previewData.loanToDepositRatio.toFixed(2)
                }}%</span>
            </div>
            <div class="flex justify-between items-center">
              <span class="text-sm text-gray-700 dark:text-gray-300">Average CLV</span>
              <span class="font-medium text-gray-800 dark:text-gray-200">${{ previewData.averageCLV.toLocaleString()
                }}</span>
            </div>
          </div>
        </div>
      </div>

      <div v-else class="text-center py-12">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 text-gray-400 dark:text-gray-600 mx-auto mb-4"
          fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        <p class="text-gray-500 dark:text-gray-400 text-lg">No preview generated</p>
        <p class="text-gray-400 dark:text-gray-500 text-sm mt-2">Select report options and click "Generate Preview"</p>
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
  calculateLoanToDepositRatio,
  calculateCustomerLifetimeValue
} from '../utils/bankingCalculations'
import ExportButton from '../components/ExportButton.vue'

// Inject sidebar collapse state
const isSidebarCollapsed = inject('isSidebarCollapsed', ref(false))
const { t } = useI18n()

// Load banking data
const { customers, loans, deposits, transactions, riskScores } = useBankingData()

// Report configuration
const reportTypes = [
  { value: 'monthly', label: 'Monthly Report', description: 'Monthly financial and risk summary' },
  { value: 'quarterly', label: 'Quarterly Report', description: 'Quarterly performance analysis' },
  { value: 'annual', label: 'Annual Report', description: 'Comprehensive annual review' }
]

const reportSections = [
  { value: 'summary', label: 'Executive Summary' },
  { value: 'risk', label: 'Risk Assessment' },
  { value: 'branch', label: 'Branch Performance' },
  { value: 'financial', label: 'Financial Analytics' },
  { value: 'customer', label: 'Customer Analysis' },
  { value: 'loans', label: 'Loan Portfolio' },
  { value: 'deposits', label: 'Deposit Analysis' },
  { value: 'transactions', label: 'Transaction Trends' }
]

const selectedReportType = ref('monthly')
const startDate = ref('')
const endDate = ref('')
const selectedSections = ref(['summary', 'risk', 'branch', 'financial'])
const showPreview = ref(false)

// Preview data
const previewData = computed(() => {
  const totalCustomers = customers.value.length
  const totalDeposits = calculateTotalDeposits(deposits.value)
  const totalLoans = calculateTotalLoans(loans.value)
  const defaultRate = calculateDefaultRate(loans.value)
  const loanToDepositRatio = calculateLoanToDepositRatio(loans.value, deposits.value)

  // Calculate average CLV
  const customerCLVs = customers.value.map(customer =>
    calculateCustomerLifetimeValue(customer, transactions.value, deposits.value)
  )
  const averageCLV = customerCLVs.length > 0
    ? customerCLVs.reduce((sum, clv) => sum + clv, 0) / customerCLVs.length
    : 0

  // Risk distribution
  const riskDistribution = { Low: 0, Medium: 0, High: 0 }
  riskScores.value.forEach(risk => {
    riskDistribution[risk.riskLevel] = (riskDistribution[risk.riskLevel] || 0) + 1
  })

  return {
    totalCustomers,
    totalDeposits,
    totalLoans,
    defaultRate,
    loanToDepositRatio,
    averageCLV,
    riskDistribution
  }
})

const generatePreview = () => {
  showPreview.value = true
}

const handleExport = (format) => {
  // TODO: Implement actual export functionality
  console.log(`Exporting ${selectedReportType.value} report as ${format}...`)
  console.log('Date range:', startDate.value, 'to', endDate.value)
  console.log('Sections:', selectedSections.value)

  // Placeholder: In a real implementation, this would:
  // 1. Generate the report data based on selected options
  // 2. Format it according to the export format (PDF/Excel/PowerPoint)
  // 3. Download the file
  alert(`Exporting ${selectedReportType.value} report as ${format}...\nThis is a placeholder. Implement actual export functionality.`)
}
</script>
