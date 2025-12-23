/**
 * Banking calculation utilities
 * All functions accept data arrays for easy API integration
 */

/**
 * Calculate default rate percentage
 * @param {Array} loans - Array of loan objects
 * @returns {number} Default rate as percentage
 */
export function calculateDefaultRate(loans) {
  if (!loans || loans.length === 0) return 0
  const defaultedLoans = loans.filter(loan => loan.defaulted === true || loan.status === 'Default')
  return (defaultedLoans.length / loans.length) * 100
}

/**
 * Calculate loan-to-deposit ratio
 * @param {Array} loans - Array of loan objects
 * @param {Array} deposits - Array of deposit objects
 * @returns {number} Loan-to-deposit ratio
 */
export function calculateLoanToDepositRatio(loans, deposits) {
  if (!deposits || deposits.length === 0) return 0
  const totalLoans = loans.reduce((sum, loan) => sum + loan.amount, 0)
  const totalDeposits = deposits.reduce((sum, deposit) => sum + deposit.balance, 0)
  return totalDeposits > 0 ? (totalLoans / totalDeposits) * 100 : 0
}

/**
 * Calculate customer lifetime value
 * @param {Object} customer - Customer object
 * @param {Array} transactions - Array of transaction objects
 * @param {Array} deposits - Array of deposit objects
 * @returns {number} Customer lifetime value
 */
export function calculateCustomerLifetimeValue(customer, transactions, deposits) {
  // Simple CLV calculation: deposits + transaction value - costs
  const customerDeposits = deposits.filter(d => d.customerId === customer.id)
  const customerTransactions = transactions.filter(t => t.customerId === customer.id)
  
  const depositValue = customerDeposits.reduce((sum, d) => sum + d.balance, 0)
  const transactionValue = customerTransactions
    .filter(t => t.type === 'Deposit' || t.type === 'Loan Payment')
    .reduce((sum, t) => sum + t.amount, 0)
  
  // Simplified: CLV = deposits + positive transactions
  return depositValue + transactionValue
}

/**
 * Calculate risk score for a customer
 * Placeholder implementation - can be replaced with actual ML model
 * @param {Object} customer - Customer object
 * @param {Array} loans - Array of loan objects
 * @param {Array} transactions - Array of transaction objects
 * @returns {Object} Risk score object with score (0-100) and level (Low/Medium/High)
 */
export function calculateRiskScore(customer, loans, transactions) {
  let score = 50 // Base score
  
  // Age factor (younger = higher risk)
  if (customer.age < 25) score += 15
  else if (customer.age < 35) score += 5
  else if (customer.age >= 50) score -= 10
  
  // Income factor (lower income = higher risk)
  if (customer.income < 40000) score += 20
  else if (customer.income < 60000) score += 10
  else if (customer.income >= 100000) score -= 15
  
  // Credit history factor
  if (customer.creditHistory === 'Excellent') score -= 20
  else if (customer.creditHistory === 'Good') score -= 10
  else if (customer.creditHistory === 'Poor') score += 25
  
  // Late payments factor
  score += customer.latePayments * 5
  
  // Employment status factor
  if (customer.employmentStatus === 'Unemployed') score += 20
  else if (customer.employmentStatus === 'Self-Employed') score += 5
  else if (customer.employmentStatus === 'Business Owner') score -= 10
  
  // Loan default history
  const customerLoans = loans.filter(l => l.customerId === customer.id)
  const hasDefaulted = customerLoans.some(l => l.defaulted === true)
  if (hasDefaulted) score += 30
  
  // Clamp score between 0 and 100
  score = Math.max(0, Math.min(100, score))
  
  // Determine risk level
  let riskLevel = 'Low'
  if (score >= 70) riskLevel = 'High'
  else if (score >= 40) riskLevel = 'Medium'
  
  return {
    score: Math.round(score),
    level: riskLevel
  }
}

/**
 * Calculate loan approval rate
 * @param {Array} loans - Array of loan objects
 * @returns {number} Approval rate as percentage
 */
export function calculateLoanApprovalRate(loans) {
  if (!loans || loans.length === 0) return 0
  // Assuming all loans in the data are approved (have approvalDate)
  // In real scenario, you'd have rejected applications too
  return 100 // Placeholder - would need application data
}

/**
 * Calculate average loan size
 * @param {Array} loans - Array of loan objects
 * @returns {number} Average loan amount
 */
export function calculateAverageLoanSize(loans) {
  if (!loans || loans.length === 0) return 0
  const total = loans.reduce((sum, loan) => sum + loan.amount, 0)
  return total / loans.length
}

/**
 * Get risk factors description
 * @param {Object} customer - Customer object
 * @param {Array} loans - Array of loan objects
 * @returns {Array} Array of risk factor strings
 */
export function getRiskFactors(customer, loans) {
  const factors = []
  
  if (customer.creditHistory === 'Excellent') factors.push('Excellent credit history')
  else if (customer.creditHistory === 'Poor') factors.push('Poor credit history')
  else factors.push(`${customer.creditHistory} credit history`)
  
  if (customer.latePayments === 0) factors.push('No late payments')
  else factors.push(`${customer.latePayments} late payment${customer.latePayments > 1 ? 's' : ''}`)
  
  if (customer.employmentStatus === 'Unemployed') factors.push('Unemployed')
  else if (customer.employmentStatus === 'Business Owner') factors.push('Business owner')
  else factors.push('Stable employment')
  
  const customerLoans = loans.filter(l => l.customerId === customer.id)
  const hasDefaulted = customerLoans.some(l => l.defaulted === true)
  if (hasDefaulted) factors.push('Defaulted loan')
  
  return factors
}

/**
 * Calculate total deposits
 * @param {Array} deposits - Array of deposit objects
 * @returns {number} Total deposit amount
 */
export function calculateTotalDeposits(deposits) {
  if (!deposits || deposits.length === 0) return 0
  return deposits.reduce((sum, deposit) => sum + deposit.balance, 0)
}

/**
 * Calculate total loans
 * @param {Array} loans - Array of loan objects
 * @returns {number} Total loan amount
 */
export function calculateTotalLoans(loans) {
  if (!loans || loans.length === 0) return 0
  return loans.reduce((sum, loan) => sum + loan.amount, 0)
}

/**
 * Group data by month
 * @param {Array} data - Array of objects with date field
 * @param {string} dateField - Field name containing date
 * @returns {Object} Object with month keys and data arrays
 */
export function groupByMonth(data, dateField = 'date') {
  const grouped = {}
  
  data.forEach(item => {
    const date = new Date(item[dateField])
    const monthKey = date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
    
    if (!grouped[monthKey]) {
      grouped[monthKey] = []
    }
    grouped[monthKey].push(item)
  })
  
  return grouped
}

/**
 * Calculate monthly totals
 * @param {Array} data - Array of objects with date and amount fields
 * @param {string} dateField - Field name containing date
 * @param {string} amountField - Field name containing amount
 * @returns {Array} Array of { month, total } objects
 */
export function calculateMonthlyTotals(data, dateField = 'date', amountField = 'amount') {
  const grouped = groupByMonth(data, dateField)
  const months = Object.keys(grouped).sort()
  
  return months.map(month => ({
    month,
    total: grouped[month].reduce((sum, item) => sum + (item[amountField] || 0), 0)
  }))
}

