<template>
  <div :class="['mx-auto transition-all duration-300', isSidebarCollapsed ? 'max-w-full px-2' : 'max-w-7xl']">
    <!-- Summary Cards -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-2 mb-2">
      <!-- Total Customers Card -->
      <BankingCard title="Total Customers" :value="totalCustomers" format="number" icon-bg-class="bg-blue-100"
        :icon="customerIcon" />

      <!-- Active Customers Card -->
      <BankingCard title="Active Customers" :value="activeCustomers" format="number" icon-bg-class="bg-green-100"
        :icon="activeIcon" />

      <!-- Inactive Customers Card -->
      <BankingCard title="Inactive Customers" :value="inactiveCustomers" format="number" icon-bg-class="bg-red-100"
        :icon="inactiveIcon" />

      <!-- New This Month Card -->
      <BankingCard title="New This Month" :value="newThisMonth" format="number" icon-bg-class="bg-purple-100"
        :icon="newIcon" />
    </div>

    <!-- Charts Section -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-2 mb-2">
      <!-- Age Group Bar Chart -->
      <div class="bg-white dark:bg-gray-800 rounded-sm shadow p-3 transition-colors duration-300">
        <h3 class="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">Customer Age Groups</h3>
        <div class="h-[300px]">
          <Bar :data="ageGroupChartData" :options="ageGroupChartOptions" />
        </div>
      </div>

      <!-- Customer Growth Line Chart -->
      <div class="bg-white dark:bg-gray-800 rounded-sm shadow p-3 transition-colors duration-300">
        <h3 class="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">Customer Growth</h3>
        <div class="h-[300px]">
          <Line :data="growthChartData" :options="growthChartOptions" />
        </div>
      </div>
    </div>

    <!-- Account Type and Location Distribution -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-2 mb-2">
      <!-- Account Type Pie Chart -->
      <div class="bg-white dark:bg-gray-800 rounded-sm shadow p-3 transition-colors duration-300">
        <h3 class="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">Account Type Distribution</h3>
        <div class="h-[250px]">
          <Pie :data="accountTypeChartData" :options="accountTypeChartOptions" />
        </div>
      </div>

      <!-- Location/Branch Distribution -->
      <div class="bg-white dark:bg-gray-800 rounded-sm shadow p-3 transition-colors duration-300">
        <h3 class="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">Location Distribution</h3>
        <div class="h-[250px]">
          <Bar :data="locationChartData" :options="locationChartOptions" />
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
            <select v-model="selectedAccountType"
              class="appearance-none bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-sm px-4 py-2 pr-8 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 dark:text-gray-200">
              <option value="">All Account Types</option>
              <option value="Savings">Savings</option>
              <option value="Checking">Checking</option>
              <option value="Business">Business</option>
            </select>
            <div class="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
              <svg class="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
          <div class="relative">
            <select v-model="selectedBranch"
              class="appearance-none bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-sm px-4 py-2 pr-8 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 dark:text-gray-200">
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

    <!-- Customers Table -->
    <div class="bg-white dark:bg-gray-800 rounded-sm shadow transition-colors duration-300">
      <div class="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
        <h3 class="text-lg font-semibold text-gray-800 dark:text-gray-200">Customers</h3>
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
                Name</th>
              <th
                class="px-4 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider border-b border-gray-200 dark:border-gray-700">
                Age</th>
              <th
                class="px-4 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider border-b border-gray-200 dark:border-gray-700">
                Location</th>
              <th
                class="px-4 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider border-b border-gray-200 dark:border-gray-700">
                Branch</th>
              <th
                class="px-4 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider border-b border-gray-200 dark:border-gray-700">
                Account Type</th>
              <th
                class="px-4 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider border-b border-gray-200 dark:border-gray-700">
                Join Date</th>
              <th
                class="px-4 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider border-b border-gray-200 dark:border-gray-700">
                Status</th>
              <th
                class="px-4 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider border-b border-gray-200 dark:border-gray-700">
                Actions</th>
            </tr>
          </thead>
          <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            <tr v-for="(customer, index) in filteredCustomers" :key="customer.id"
              class="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
              <td class="px-4 py-3 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">{{ index + 1 }}</td>
              <td class="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">{{
                customer.name }}</td>
              <td class="px-4 py-3 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">{{ customer.age }}</td>
              <td class="px-4 py-3 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">{{ customer.location }}
              </td>
              <td class="px-4 py-3 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">{{
                getBranchName(customer.branch) }}</td>
              <td class="px-4 py-3 whitespace-nowrap">
                <span :class="[
                  'px-2 py-1 text-xs font-medium rounded-sm',
                  customer.accountType === 'Savings' ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-400' :
                    customer.accountType === 'Checking' ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400' :
                      'bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-400'
                ]">
                  {{ customer.accountType }}
                </span>
              </td>
              <td class="px-4 py-3 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                {{ new Date(customer.joinDate).toLocaleDateString() }}
              </td>
              <td class="px-4 py-3 whitespace-nowrap">
                <span :class="[
                  'px-2 py-1 text-xs font-medium rounded-sm',
                  customer.status === 'Active' ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400' :
                    'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300'
                ]">
                  {{ customer.status }}
                </span>
              </td>
              <td class="px-4 py-3 whitespace-nowrap text-sm font-medium">
                <button @click="viewCustomerDetails(customer)"
                  class="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300">
                  View
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Customer Details Drawer -->
    <Transition name="drawer">
      <div v-if="showDetailsDrawer" class="fixed inset-0 bg-black bg-opacity-50 z-50" @click.self="closeDetailsDrawer">
        <div
          class="absolute right-0 top-0 h-full w-full max-w-md bg-white dark:bg-gray-800 shadow-xl overflow-y-auto transition-colors duration-300">
          <div
            class="sticky top-0 bg-white dark:bg-gray-800 text-black dark:text-gray-200 px-6 py-5 flex items-center justify-between z-10 border-b border-gray-200 dark:border-gray-700">
            <h2 class="text-xl font-bold">Customer Details</h2>
            <button @click="closeDetailsDrawer"
              class="text-black dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-sm p-2 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24"
                stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div v-if="selectedCustomer" class="p-6 space-y-4">
            <div>
              <h3 class="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">{{ selectedCustomer.name }}</h3>
              <div class="space-y-3">
                <div>
                  <p class="text-sm text-gray-600 dark:text-gray-400">Age</p>
                  <p class="text-base font-medium text-gray-800 dark:text-gray-200">{{ selectedCustomer.age }}</p>
                </div>
                <div>
                  <p class="text-sm text-gray-600 dark:text-gray-400">Income</p>
                  <p class="text-base font-medium text-gray-800 dark:text-gray-200">${{
                    selectedCustomer.income.toLocaleString() }}</p>
                </div>
                <div>
                  <p class="text-sm text-gray-600 dark:text-gray-400">Location</p>
                  <p class="text-base font-medium text-gray-800 dark:text-gray-200">{{ selectedCustomer.location }}</p>
                </div>
                <div>
                  <p class="text-sm text-gray-600 dark:text-gray-400">Branch</p>
                  <p class="text-base font-medium text-gray-800 dark:text-gray-200">{{
                    getBranchName(selectedCustomer.branch) }}</p>
                </div>
                <div>
                  <p class="text-sm text-gray-600 dark:text-gray-400">Account Type</p>
                  <p class="text-base font-medium text-gray-800 dark:text-gray-200">{{ selectedCustomer.accountType }}
                  </p>
                </div>
                <div>
                  <p class="text-sm text-gray-600 dark:text-gray-400">Join Date</p>
                  <p class="text-base font-medium text-gray-800 dark:text-gray-200">{{ new
                    Date(selectedCustomer.joinDate).toLocaleDateString() }}</p>
                </div>
                <div>
                  <p class="text-sm text-gray-600 dark:text-gray-400">Status</p>
                  <span :class="[
                    'px-2 py-1 text-xs font-medium rounded-sm inline-block',
                    selectedCustomer.status === 'Active' ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400' :
                      'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300'
                  ]">
                    {{ selectedCustomer.status }}
                  </span>
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
import { groupCustomersByAge, groupCustomersByAccountType, calculateCustomerGrowth } from '../utils/bankingData'
import { getBarChartOptions, getLineChartOptions, getPieChartOptions } from '../utils/chartConfigs'
import BankingCard from '../components/BankingCard.vue'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js'
import { Bar, Line, Pie } from 'vue-chartjs'

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
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
const { customers, branches, getBranch } = useBankingData()

// Icons
const customerIcon = '<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>'
const activeIcon = '<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>'
const inactiveIcon = '<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>'
const newIcon = '<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" /></svg>'

// Search and filter
const searchQuery = ref('')
const selectedAccountType = ref('')
const selectedBranch = ref('')

// Computed values
const totalCustomers = computed(() => customers.value.length)
const activeCustomers = computed(() => customers.value.filter(c => c.status === 'Active').length)
const inactiveCustomers = computed(() => customers.value.filter(c => c.status === 'Inactive').length)

const newThisMonth = computed(() => {
  const currentMonth = new Date().getMonth()
  const currentYear = new Date().getFullYear()
  return customers.value.filter(customer => {
    const joinDate = new Date(customer.joinDate)
    return joinDate.getMonth() === currentMonth && joinDate.getFullYear() === currentYear
  }).length
})

// Filtered customers
const filteredCustomers = computed(() => {
  let filtered = customers.value

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(customer =>
      customer.name.toLowerCase().includes(query) ||
      customer.location.toLowerCase().includes(query) ||
      customer.id.toLowerCase().includes(query)
    )
  }

  if (selectedAccountType.value) {
    filtered = filtered.filter(customer => customer.accountType === selectedAccountType.value)
  }

  if (selectedBranch.value) {
    filtered = filtered.filter(customer => customer.branch === selectedBranch.value)
  }

  return filtered
})

// Age group data
const ageGroups = computed(() => groupCustomersByAge(customers.value))

// Age group chart data
const ageGroupChartData = computed(() => ({
  labels: Object.keys(ageGroups.value),
  datasets: [
    {
      label: 'Number of Customers',
      data: Object.values(ageGroups.value),
      backgroundColor: 'rgba(59, 130, 246, 0.8)',
      borderColor: 'rgb(59, 130, 246)',
      borderWidth: 1
    }
  ]
}))

const ageGroupChartOptions = computed(() => getBarChartOptions(isDarkMode.value))

// Customer growth data
const customerGrowth = computed(() => calculateCustomerGrowth(customers.value))

// Growth chart data
const growthChartData = computed(() => ({
  labels: customerGrowth.value.map(g => new Date(g.date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })),
  datasets: [
    {
      label: 'Total Customers',
      data: customerGrowth.value.map(g => g.count),
      borderColor: 'rgb(16, 185, 129)',
      backgroundColor: 'rgba(16, 185, 129, 0.1)',
      tension: 0.4,
      fill: true
    }
  ]
}))

const growthChartOptions = computed(() => getLineChartOptions(isDarkMode.value))

// Account type data
const accountTypes = computed(() => groupCustomersByAccountType(customers.value))

// Account type chart data
const accountTypeChartData = computed(() => ({
  labels: Object.keys(accountTypes.value),
  datasets: [
    {
      data: Object.values(accountTypes.value),
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

const accountTypeChartOptions = computed(() => getPieChartOptions(isDarkMode.value))

// Location distribution
const locationDistribution = computed(() => {
  const distribution = {}
  customers.value.forEach(customer => {
    distribution[customer.location] = (distribution[customer.location] || 0) + 1
  })
  return distribution
})

// Location chart data
const locationChartData = computed(() => ({
  labels: Object.keys(locationDistribution.value),
  datasets: [
    {
      label: 'Number of Customers',
      data: Object.values(locationDistribution.value),
      backgroundColor: 'rgba(249, 115, 22, 0.8)',
      borderColor: 'rgb(249, 115, 22)',
      borderWidth: 1
    }
  ]
}))

const locationChartOptions = computed(() => getBarChartOptions(isDarkMode.value))

// Details drawer
const showDetailsDrawer = ref(false)
const selectedCustomer = ref(null)

const viewCustomerDetails = (customer) => {
  selectedCustomer.value = customer
  showDetailsDrawer.value = true
}

const closeDetailsDrawer = () => {
  showDetailsDrawer.value = false
  selectedCustomer.value = null
}

// Helper function
const getBranchName = (branchId) => {
  const branch = getBranch(branchId)
  return branch?.name || branchId
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
