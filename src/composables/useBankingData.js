import { ref, computed } from 'vue'
import customersData from '../data/customers.json'
import loansData from '../data/loans.json'
import depositsData from '../data/deposits.json'
import transactionsData from '../data/transactions.json'
import branchesData from '../data/branches.json'
import riskScoresData from '../data/riskScores.json'

/**
 * Composable for loading banking data
 * Structured to easily replace JSON imports with API calls
 * 
 * Future API integration example:
 * const { data: customers } = await useFetch('/api/customers')
 * return customers.value
 */
export function useBankingData() {
  // Load data from JSON files
  // TODO: Replace with API calls when backend is ready
  const customers = ref(customersData)
  const loans = ref(loansData)
  const deposits = ref(depositsData)
  const transactions = ref(transactionsData)
  const branches = ref(branchesData)
  const riskScores = ref(riskScoresData)
  
  // Computed properties for common aggregations
  const totalCustomers = computed(() => customers.value.length)
  const totalLoans = computed(() => loans.value.length)
  const totalDeposits = computed(() => deposits.value.length)
  const totalTransactions = computed(() => transactions.value.length)
  const totalBranches = computed(() => branches.value.length)
  
  // Active customers
  const activeCustomers = computed(() => 
    customers.value.filter(c => c.status === 'Active')
  )
  
  // Active branches
  const activeBranches = computed(() => 
    branches.value.filter(b => b.status === 'Active')
  )
  
  /**
   * Refresh data (placeholder for future API integration)
   */
  const refreshData = async () => {
    // TODO: Implement API calls to refresh data
    // Example:
    // customers.value = await fetch('/api/customers').then(r => r.json())
    // loans.value = await fetch('/api/loans').then(r => r.json())
    // etc.
    console.log('Data refresh - implement API calls here')
  }
  
  /**
   * Get customer by ID
   */
  const getCustomer = (customerId) => {
    return customers.value.find(c => c.id === customerId)
  }
  
  /**
   * Get branch by ID
   */
  const getBranch = (branchId) => {
    return branches.value.find(b => b.id === branchId)
  }
  
  /**
   * Get risk score for customer
   */
  const getRiskScore = (customerId) => {
    return riskScores.value.find(r => r.customerId === customerId)
  }
  
  return {
    // Data
    customers,
    loans,
    deposits,
    transactions,
    branches,
    riskScores,
    
    // Computed
    totalCustomers,
    totalLoans,
    totalDeposits,
    totalTransactions,
    totalBranches,
    activeCustomers,
    activeBranches,
    
    // Methods
    refreshData,
    getCustomer,
    getBranch,
    getRiskScore
  }
}

