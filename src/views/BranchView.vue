<template>
  <div :class="['mx-auto transition-all duration-300', isSidebarCollapsed ? 'max-w-full px-2' : 'max-w-7xl']">
    <!-- Summary Cards -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2 mb-2">
      <!-- Total Branches Card -->
      <BankingCard
        title="Total Branches"
        :value="totalBranches"
        format="number"
        icon-bg-class="bg-blue-100"
        :icon="branchIcon"
      />
      
      <!-- Active Branches Card -->
      <BankingCard
        title="Active Branches"
        :value="activeBranches"
        format="number"
        icon-bg-class="bg-green-100"
        :icon="activeIcon"
      />
      
      <!-- Total Revenue Card -->
      <BankingCard
        title="Total Revenue"
        :value="totalRevenue"
        format="currency"
        icon-bg-class="bg-purple-100"
        :icon="revenueIcon"
      />
      
      <!-- Average Profit Card -->
      <BankingCard
        title="Average Profit"
        :value="averageProfit"
        format="currency"
        icon-bg-class="bg-orange-100"
        :icon="profitIcon"
      />
    </div>

    <!-- Branch Comparison Charts -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-2 mb-2">
      <!-- Branch Comparison Bar Chart -->
      <div class="bg-white dark:bg-gray-800 rounded-sm shadow p-3 transition-colors duration-300">
        <h3 class="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">Branch Comparison</h3>
        <div class="h-[400px]">
          <Bar :data="branchComparisonChartData" :options="branchComparisonChartOptions" />
        </div>
      </div>

      <!-- Revenue by Branch -->
      <div class="bg-white dark:bg-gray-800 rounded-sm shadow p-3 transition-colors duration-300">
        <h3 class="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">Revenue by Branch</h3>
        <div class="h-[400px]">
          <Bar :data="revenueChartData" :options="revenueChartOptions" />
        </div>
      </div>
    </div>

    <!-- Branch Performance Table -->
    <div class="bg-white dark:bg-gray-800 rounded-sm shadow transition-colors duration-300 mb-2">
      <div class="px-4 py-3 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
        <h3 class="text-lg font-semibold text-gray-800 dark:text-gray-200">Branch Performance</h3>
        <button
          @click="viewBranchDetails(null)"
          class="px-4 py-2 bg-blue-600 text-white rounded-sm hover:bg-blue-700 transition-colors font-medium flex items-center gap-2"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
          </svg>
          Add Branch
        </button>
      </div>
      <div class="max-h-[500px] overflow-y-auto">
        <table class="w-full">
          <thead class="bg-gray-50 dark:bg-gray-800 sticky top-0 z-10">
            <tr>
              <th class="px-4 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider border-b border-gray-200 dark:border-gray-700">No</th>
              <th class="px-4 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider border-b border-gray-200 dark:border-gray-700">Branch Name</th>
              <th class="px-4 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider border-b border-gray-200 dark:border-gray-700">Location</th>
              <th class="px-4 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider border-b border-gray-200 dark:border-gray-700">Total Customers</th>
              <th class="px-4 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider border-b border-gray-200 dark:border-gray-700">Total Loans</th>
              <th class="px-4 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider border-b border-gray-200 dark:border-gray-700">Total Deposits</th>
              <th class="px-4 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider border-b border-gray-200 dark:border-gray-700">Revenue</th>
              <th class="px-4 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider border-b border-gray-200 dark:border-gray-700">Profit</th>
              <th class="px-4 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider border-b border-gray-200 dark:border-gray-700">Status</th>
              <th class="px-4 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider border-b border-gray-200 dark:border-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            <tr
              v-for="(branch, index) in branchesWithProfit"
              :key="branch.id"
              class="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              <td class="px-4 py-3 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">{{ index + 1 }}</td>
              <td class="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">{{ branch.name }}</td>
              <td class="px-4 py-3 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">{{ branch.location }}</td>
              <td class="px-4 py-3 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">{{ branch.totalCustomers }}</td>
              <td class="px-4 py-3 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">${{ branch.totalLoans.toLocaleString() }}</td>
              <td class="px-4 py-3 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">${{ branch.totalDeposits.toLocaleString() }}</td>
              <td class="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">${{ branch.revenue.toLocaleString() }}</td>
              <td class="px-4 py-3 whitespace-nowrap text-sm font-medium text-green-600 dark:text-green-400">${{ branch.profit.toLocaleString() }}</td>
              <td class="px-4 py-3 whitespace-nowrap">
                <span
                  :class="[
                    'px-2 py-1 text-xs font-medium rounded-sm',
                    branch.status === 'Active' ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400' :
                    'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300'
                  ]"
                >
                  {{ branch.status }}
                </span>
              </td>
              <td class="px-4 py-3 whitespace-nowrap text-sm font-medium">
                <button
                  @click="viewBranchDetails(branch)"
                  class="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
                >
                  View Details
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Branch Details Drawer -->
    <Transition name="drawer">
      <div
        v-if="showDetailsDrawer"
        class="fixed inset-0 bg-black bg-opacity-50 z-50"
        @click.self="closeDetailsDrawer"
      >
        <div class="absolute right-0 top-0 h-full w-full max-w-md bg-white dark:bg-gray-800 shadow-xl overflow-y-auto transition-colors duration-300">
          <div class="sticky top-0 bg-white dark:bg-gray-800 text-black dark:text-gray-200 px-6 py-5 flex items-center justify-between z-10 border-b border-gray-200 dark:border-gray-700">
            <h2 class="text-xl font-bold">{{ selectedBranch ? 'Branch Details' : 'Add New Branch' }}</h2>
            <button
              @click="closeDetailsDrawer"
              class="text-black dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-sm p-2 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          <div v-if="selectedBranch" class="p-6 space-y-4">
            <div>
              <h3 class="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">{{ selectedBranch.name }}</h3>
              <div class="space-y-3">
                <div>
                  <p class="text-sm text-gray-600 dark:text-gray-400">Location</p>
                  <p class="text-base font-medium text-gray-800 dark:text-gray-200">{{ selectedBranch.location }}</p>
                </div>
                <div>
                  <p class="text-sm text-gray-600 dark:text-gray-400">Total Customers</p>
                  <p class="text-base font-medium text-gray-800 dark:text-gray-200">{{ selectedBranch.totalCustomers }}</p>
                </div>
                <div>
                  <p class="text-sm text-gray-600 dark:text-gray-400">Total Loans</p>
                  <p class="text-base font-medium text-gray-800 dark:text-gray-200">${{ selectedBranch.totalLoans.toLocaleString() }}</p>
                </div>
                <div>
                  <p class="text-sm text-gray-600 dark:text-gray-400">Total Deposits</p>
                  <p class="text-base font-medium text-gray-800 dark:text-gray-200">${{ selectedBranch.totalDeposits.toLocaleString() }}</p>
                </div>
                <div>
                  <p class="text-sm text-gray-600 dark:text-gray-400">Revenue</p>
                  <p class="text-base font-medium text-gray-800 dark:text-gray-200">${{ selectedBranch.revenue.toLocaleString() }}</p>
                </div>
                <div>
                  <p class="text-sm text-gray-600 dark:text-gray-400">Profit</p>
                  <p class="text-base font-medium text-green-600 dark:text-green-400">${{ selectedBranch.profit.toLocaleString() }}</p>
                </div>
                <div>
                  <p class="text-sm text-gray-600 dark:text-gray-400">Status</p>
                  <span
                    :class="[
                      'px-2 py-1 text-xs font-medium rounded-sm inline-block',
                      selectedBranch.status === 'Active' ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400' :
                      'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300'
                    ]"
                  >
                    {{ selectedBranch.status }}
                  </span>
                </div>
                <div>
                  <p class="text-sm text-gray-600 dark:text-gray-400">Opened Date</p>
                  <p class="text-base font-medium text-gray-800 dark:text-gray-200">{{ new Date(selectedBranch.openedDate).toLocaleDateString() }}</p>
                </div>
              </div>
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
const { customers, loans, deposits, branches } = useBankingData()

// Icons
const branchIcon = '<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>'
const activeIcon = '<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>'
const revenueIcon = '<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>'
const profitIcon = '<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-orange-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>'

// Computed values
const totalBranches = computed(() => branches.value.length)
const activeBranches = computed(() => branches.value.filter(b => b.status === 'Active').length)

// Calculate profit for all branches
const branchesWithProfit = computed(() => {
  return branches.value.map(branch => ({
    ...branch,
    profit: calculateBranchProfit(loans.value, deposits.value, customers.value, branch.id)
  }))
})

const totalRevenue = computed(() => {
  return branches.value.reduce((sum, branch) => sum + branch.revenue, 0)
})

const averageProfit = computed(() => {
  if (branchesWithProfit.value.length === 0) return 0
  const sum = branchesWithProfit.value.reduce((acc, branch) => acc + branch.profit, 0)
  return sum / branchesWithProfit.value.length
})

// Branch comparison chart data
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
      label: 'Loans (in thousands)',
      data: branches.value.map(b => b.totalLoans / 1000),
      backgroundColor: 'rgba(139, 92, 246, 0.8)',
      borderColor: 'rgb(139, 92, 246)',
      borderWidth: 1
    },
    {
      label: 'Deposits (in thousands)',
      data: branches.value.map(b => b.totalDeposits / 1000),
      backgroundColor: 'rgba(16, 185, 129, 0.8)',
      borderColor: 'rgb(16, 185, 129)',
      borderWidth: 1
    }
  ]
}))

const branchComparisonChartOptions = computed(() => getBarChartOptions(isDarkMode.value))

// Revenue chart data
const revenueChartData = computed(() => ({
  labels: branches.value.map(b => b.name),
  datasets: [
    {
      label: 'Revenue',
      data: branches.value.map(b => b.revenue),
      backgroundColor: 'rgba(249, 115, 22, 0.8)',
      borderColor: 'rgb(249, 115, 22)',
      borderWidth: 1
    }
  ]
}))

const revenueChartOptions = computed(() => ({
  ...getBarChartOptions(isDarkMode.value),
  plugins: {
    ...getBarChartOptions(isDarkMode.value).plugins,
    legend: {
      display: false
    }
  }
}))

// Details drawer
const showDetailsDrawer = ref(false)
const selectedBranch = ref(null)

const viewBranchDetails = (branch) => {
  selectedBranch.value = branch
  showDetailsDrawer.value = true
}

const closeDetailsDrawer = () => {
  showDetailsDrawer.value = false
  selectedBranch.value = null
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
