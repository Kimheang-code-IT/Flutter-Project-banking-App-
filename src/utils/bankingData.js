/**
 * Banking data utility functions
 * Helper functions for aggregating and processing banking data
 */

/**
 * Get customer by ID
 * @param {Array} customers - Array of customer objects
 * @param {string} customerId - Customer ID
 * @returns {Object|null} Customer object or null
 */
export function getCustomerById(customers, customerId) {
  return customers.find(c => c.id === customerId) || null
}

/**
 * Get loans for a customer
 * @param {Array} loans - Array of loan objects
 * @param {string} customerId - Customer ID
 * @returns {Array} Array of loan objects
 */
export function getCustomerLoans(loans, customerId) {
  return loans.filter(loan => loan.customerId === customerId)
}

/**
 * Get deposits for a customer
 * @param {Array} deposits - Array of deposit objects
 * @param {string} customerId - Customer ID
 * @returns {Array} Array of deposit objects
 */
export function getCustomerDeposits(deposits, customerId) {
  return deposits.filter(deposit => deposit.customerId === customerId)
}

/**
 * Get transactions for a customer
 * @param {Array} transactions - Array of transaction objects
 * @param {string} customerId - Customer ID
 * @returns {Array} Array of transaction objects
 */
export function getCustomerTransactions(transactions, customerId) {
  return transactions.filter(transaction => transaction.customerId === customerId)
}

/**
 * Get customers by branch
 * @param {Array} customers - Array of customer objects
 * @param {string} branchId - Branch ID
 * @returns {Array} Array of customer objects
 */
export function getCustomersByBranch(customers, branchId) {
  return customers.filter(customer => customer.branch === branchId)
}

/**
 * Get loans by branch
 * @param {Array} loans - Array of loan objects
 * @param {Array} customers - Array of customer objects
 * @param {string} branchId - Branch ID
 * @returns {Array} Array of loan objects
 */
export function getLoansByBranch(loans, customers, branchId) {
  const branchCustomers = getCustomersByBranch(customers, branchId)
  const branchCustomerIds = branchCustomers.map(c => c.id)
  return loans.filter(loan => branchCustomerIds.includes(loan.customerId))
}

/**
 * Get deposits by branch
 * @param {Array} deposits - Array of deposit objects
 * @param {string} branchId - Branch ID
 * @returns {Array} Array of deposit objects
 */
export function getDepositsByBranch(deposits, branchId) {
  return deposits.filter(deposit => deposit.branch === branchId)
}

/**
 * Get transactions by branch
 * @param {Array} transactions - Array of transaction objects
 * @param {string} branchId - Branch ID
 * @returns {Array} Array of transaction objects
 */
export function getTransactionsByBranch(transactions, branchId) {
  return transactions.filter(transaction => transaction.branch === branchId)
}

/**
 * Group customers by age group
 * @param {Array} customers - Array of customer objects
 * @returns {Object} Object with age group keys and counts
 */
export function groupCustomersByAge(customers) {
  const groups = {
    '18-25': 0,
    '26-35': 0,
    '36-50': 0,
    '51-65': 0,
    '65+': 0
  }
  
  customers.forEach(customer => {
    const age = customer.age
    if (age >= 18 && age <= 25) groups['18-25']++
    else if (age >= 26 && age <= 35) groups['26-35']++
    else if (age >= 36 && age <= 50) groups['36-50']++
    else if (age >= 51 && age <= 65) groups['51-65']++
    else if (age > 65) groups['65+']++
  })
  
  return groups
}

/**
 * Group customers by account type
 * @param {Array} customers - Array of customer objects
 * @returns {Object} Object with account type keys and counts
 */
export function groupCustomersByAccountType(customers) {
  const groups = {}
  
  customers.forEach(customer => {
    const type = customer.accountType
    groups[type] = (groups[type] || 0) + 1
  })
  
  return groups
}

/**
 * Group loans by status
 * @param {Array} loans - Array of loan objects
 * @returns {Object} Object with status keys and counts
 */
export function groupLoansByStatus(loans) {
  const groups = {}
  
  loans.forEach(loan => {
    const status = loan.status
    groups[status] = (groups[status] || 0) + 1
  })
  
  return groups
}

/**
 * Group loans by type
 * @param {Array} loans - Array of loan objects
 * @returns {Object} Object with loan type keys and counts
 */
export function groupLoansByType(loans) {
  const groups = {}
  
  loans.forEach(loan => {
    const type = loan.loanType
    groups[type] = (groups[type] || 0) + 1
  })
  
  return groups
}

/**
 * Group deposits by type
 * @param {Array} deposits - Array of deposit objects
 * @returns {Object} Object with deposit type keys and counts
 */
export function groupDepositsByType(deposits) {
  const groups = {}
  
  deposits.forEach(deposit => {
    const type = deposit.depositType
    groups[type] = (groups[type] || 0) + 1
  })
  
  return groups
}

/**
 * Group transactions by type
 * @param {Array} transactions - Array of transaction objects
 * @returns {Object} Object with transaction type keys and counts
 */
export function groupTransactionsByType(transactions) {
  const groups = {}
  
  transactions.forEach(transaction => {
    const type = transaction.type
    groups[type] = (groups[type] || 0) + 1
  })
  
  return groups
}

/**
 * Calculate customer growth over time
 * @param {Array} customers - Array of customer objects
 * @returns {Array} Array of { date, count } objects sorted by date
 */
export function calculateCustomerGrowth(customers) {
  const growth = []
  const sortedCustomers = [...customers].sort((a, b) => 
    new Date(a.joinDate) - new Date(b.joinDate)
  )
  
  let count = 0
  const dateCounts = {}
  
  sortedCustomers.forEach(customer => {
    const date = customer.joinDate
    if (!dateCounts[date]) {
      dateCounts[date] = 0
    }
    dateCounts[date]++
  })
  
  Object.keys(dateCounts).sort().forEach(date => {
    count += dateCounts[date]
    growth.push({ date, count })
  })
  
  return growth
}

/**
 * Get high-risk customers
 * @param {Array} riskScores - Array of risk score objects
 * @param {string} threshold - Risk level threshold ('High' or 'Medium')
 * @returns {Array} Array of risk score objects
 */
export function getHighRiskCustomers(riskScores, threshold = 'High') {
  if (threshold === 'High') {
    return riskScores.filter(risk => risk.riskLevel === 'High')
  } else {
    return riskScores.filter(risk => risk.riskLevel === 'High' || risk.riskLevel === 'Medium')
  }
}

/**
 * Get top depositors
 * @param {Array} deposits - Array of deposit objects
 * @param {number} limit - Number of top depositors to return
 * @returns {Array} Array of deposit objects sorted by balance
 */
export function getTopDepositors(deposits, limit = 10) {
  return [...deposits]
    .sort((a, b) => b.balance - a.balance)
    .slice(0, limit)
}

/**
 * Calculate branch profit
 * @param {Array} loans - Array of loan objects
 * @param {Array} deposits - Array of deposit objects
 * @param {Array} customers - Array of customer objects
 * @param {string} branchId - Branch ID
 * @returns {number} Calculated profit
 */
export function calculateBranchProfit(loans, deposits, customers, branchId) {
  const branchLoans = getLoansByBranch(loans, customers, branchId)
  const branchDeposits = getDepositsByBranch(deposits, branchId)
  
  // Simplified profit calculation: loan interest - deposit interest
  const loanInterest = branchLoans.reduce((sum, loan) => {
    return sum + (loan.amount * loan.interestRate / 100)
  }, 0)
  
  const depositInterest = branchDeposits.reduce((sum, deposit) => {
    return sum + deposit.interestEarned
  }, 0)
  
  // Simplified: profit = loan interest - deposit interest paid out
  return loanInterest - (depositInterest * 0.5) // Assuming 50% of interest is paid to customers
}

