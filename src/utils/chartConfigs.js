/**
 * Chart configuration utilities for banking dashboard
 * Provides reusable chart options with banking-specific styling
 */

/**
 * Get banking color scheme
 * @param {boolean} isDarkMode - Whether dark mode is active
 * @returns {Object} Color palette object
 */
export function getBankingColors(isDarkMode = false) {
  if (isDarkMode) {
    return {
      primary: 'rgb(59, 130, 246)',      // blue-500
      secondary: 'rgb(16, 185, 129)',    // green-500
      warning: 'rgb(251, 191, 36)',      // yellow-400
      danger: 'rgb(239, 68, 68)',        // red-500
      purple: 'rgb(139, 92, 246)',       // purple-500
      orange: 'rgb(249, 115, 22)',       // orange-500
      background: 'rgba(31, 41, 55, 0.5)', // gray-800 with opacity
      text: 'rgb(243, 244, 246)'         // gray-100
    }
  } else {
    return {
      primary: 'rgb(59, 130, 246)',      // blue-500
      secondary: 'rgb(16, 185, 129)',    // green-500
      warning: 'rgb(251, 191, 36)',      // yellow-400
      danger: 'rgb(239, 68, 68)',        // red-500
      purple: 'rgb(139, 92, 246)',       // purple-500
      orange: 'rgb(249, 115, 22)',       // orange-500
      background: 'rgba(243, 244, 246, 0.5)', // gray-100 with opacity
      text: 'rgb(17, 24, 39)'            // gray-900
    }
  }
}

/**
 * Get common chart options with dark mode support
 * @param {boolean} isDarkMode - Whether dark mode is active
 * @returns {Object} Chart.js options object
 */
export function getCommonChartOptions(isDarkMode = false) {
  const colors = getBankingColors(isDarkMode)
  
  return {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        labels: {
          color: colors.text,
          font: {
            size: 12
          }
        }
      },
      tooltip: {
        backgroundColor: isDarkMode ? 'rgba(31, 41, 55, 0.9)' : 'rgba(255, 255, 255, 0.9)',
        titleColor: colors.text,
        bodyColor: colors.text,
        borderColor: colors.primary,
        borderWidth: 1
      }
    },
    scales: {
      x: {
        ticks: {
          color: colors.text
        },
        grid: {
          color: isDarkMode ? 'rgba(75, 85, 99, 0.3)' : 'rgba(229, 231, 235, 0.5)'
        }
      },
      y: {
        ticks: {
          color: colors.text
        },
        grid: {
          color: isDarkMode ? 'rgba(75, 85, 99, 0.3)' : 'rgba(229, 231, 235, 0.5)'
        }
      }
    }
  }
}

/**
 * Get line chart options for time series data
 * @param {boolean} isDarkMode - Whether dark mode is active
 * @returns {Object} Chart.js line chart options
 */
export function getLineChartOptions(isDarkMode = false) {
  const baseOptions = getCommonChartOptions(isDarkMode)
  return {
    ...baseOptions,
    elements: {
      line: {
        tension: 0.4
      },
      point: {
        radius: 4,
        hoverRadius: 6
      }
    }
  }
}

/**
 * Get bar chart options
 * @param {boolean} isDarkMode - Whether dark mode is active
 * @returns {Object} Chart.js bar chart options
 */
export function getBarChartOptions(isDarkMode = false) {
  const baseOptions = getCommonChartOptions(isDarkMode)
  return {
    ...baseOptions,
    plugins: {
      ...baseOptions.plugins,
      legend: {
        display: false
      }
    }
  }
}

/**
 * Get pie/doughnut chart options
 * @param {boolean} isDarkMode - Whether dark mode is active
 * @returns {Object} Chart.js pie chart options
 */
export function getPieChartOptions(isDarkMode = false) {
  const colors = getBankingColors(isDarkMode)
  return {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          color: colors.text,
          font: {
            size: 11
          },
          padding: 15
        }
      },
      tooltip: {
        backgroundColor: isDarkMode ? 'rgba(31, 41, 55, 0.9)' : 'rgba(255, 255, 255, 0.9)',
        titleColor: colors.text,
        bodyColor: colors.text,
        borderColor: colors.primary,
        borderWidth: 1
      }
    }
  }
}

/**
 * Get risk level colors
 * @returns {Object} Color mapping for risk levels
 */
export function getRiskLevelColors() {
  return {
    Low: {
      background: 'rgba(16, 185, 129, 0.2)',
      border: 'rgb(16, 185, 129)',
      text: 'rgb(5, 150, 105)'
    },
    Medium: {
      background: 'rgba(251, 191, 36, 0.2)',
      border: 'rgb(251, 191, 36)',
      text: 'rgb(217, 119, 6)'
    },
    High: {
      background: 'rgba(239, 68, 68, 0.2)',
      border: 'rgb(239, 68, 68)',
      text: 'rgb(220, 38, 38)'
    }
  }
}

/**
 * Get status colors for loans/deposits
 * @returns {Object} Color mapping for statuses
 */
export function getStatusColors() {
  return {
    Paid: {
      background: 'rgba(16, 185, 129, 0.1)',
      text: 'rgb(5, 150, 105)'
    },
    Late: {
      background: 'rgba(251, 191, 36, 0.1)',
      text: 'rgb(217, 119, 6)'
    },
    Default: {
      background: 'rgba(239, 68, 68, 0.1)',
      text: 'rgb(220, 38, 38)'
    },
    Active: {
      background: 'rgba(59, 130, 246, 0.1)',
      text: 'rgb(37, 99, 235)'
    },
    Inactive: {
      background: 'rgba(107, 114, 128, 0.1)',
      text: 'rgb(75, 85, 99)'
    }
  }
}

