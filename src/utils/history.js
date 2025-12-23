// History logging utility
// Stores all system activities in localStorage

const HISTORY_KEY = 'system_history'
const MAX_HISTORY_ITEMS = 1000 // Keep last 1000 items

// Get all history
export const getHistory = () => {
  try {
    const history = localStorage.getItem(HISTORY_KEY)
    return history ? JSON.parse(history) : []
  } catch (error) {
    console.error('Error reading history:', error)
    return []
  }
}

// Add history entry
export const addHistory = (action, details = {}) => {
  try {
    const history = getHistory()
    const entry = {
      id: Date.now() + Math.random(),
      timestamp: new Date().toISOString(),
      action, // 'login', 'logout', 'add', 'update', 'delete', etc.
      type: details.type || 'general', // 'category', 'product', 'user', 'system', etc.
      itemName: details.itemName || '',
      itemId: details.itemId || null,
      description: details.description || '',
      user: details.user || 'Admin',
      ...details
    }
    
    history.unshift(entry) // Add to beginning
    
    // Keep only last MAX_HISTORY_ITEMS
    if (history.length > MAX_HISTORY_ITEMS) {
      history.splice(MAX_HISTORY_ITEMS)
    }
    
    localStorage.setItem(HISTORY_KEY, JSON.stringify(history))
    return entry
  } catch (error) {
    console.error('Error adding history:', error)
    return null
  }
}

// Clear all history
export const clearHistory = () => {
  try {
    localStorage.removeItem(HISTORY_KEY)
    return true
  } catch (error) {
    console.error('Error clearing history:', error)
    return false
  }
}

// Filter history by action or type
export const filterHistory = (filters = {}) => {
  const history = getHistory()
  
  return history.filter(entry => {
    if (filters.action && entry.action !== filters.action) return false
    if (filters.type && entry.type !== filters.type) return false
    if (filters.search) {
      const searchLower = filters.search.toLowerCase()
      return (
        entry.itemName.toLowerCase().includes(searchLower) ||
        entry.description.toLowerCase().includes(searchLower) ||
        entry.action.toLowerCase().includes(searchLower)
      )
    }
    return true
  })
}

// Format timestamp for display
export const formatTimestamp = (timestamp) => {
  const date = new Date(timestamp)
  const now = new Date()
  const diffMs = now - date
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMs / 3600000)
  const diffDays = Math.floor(diffMs / 86400000)
  
  if (diffMins < 1) return 'Just now'
  if (diffMins < 60) return `${diffMins} minute${diffMins > 1 ? 's' : ''} ago`
  if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`
  if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`
  
  return date.toLocaleDateString() + ' ' + date.toLocaleTimeString()
}

