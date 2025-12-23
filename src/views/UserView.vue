<template>
  <div :class="['mx-auto transition-all duration-300', isSidebarCollapsed ? 'max-w-full px-2' : 'max-w-7xl']">
    <!-- Summary Cards -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-2 mb-2">
      <!-- Total Users Card -->
      <BankingCard title="Total Users" :value="totalUsers" format="number" icon-bg-class="bg-blue-100"
        :icon="userIcon" />

      <!-- Active Users Card -->
      <BankingCard title="Active Users" :value="activeUsers" format="number" icon-bg-class="bg-green-100"
        :icon="activeIcon" />

      <!-- Admin Users Card -->
      <BankingCard title="Admin Users" :value="adminUsers" format="number" icon-bg-class="bg-purple-100"
        :icon="adminIcon" />

      <!-- Analyst Users Card -->
      <BankingCard title="Analyst Users" :value="analystUsers" format="number" icon-bg-class="bg-orange-100"
        :icon="analystIcon" />
    </div>

    <!-- Tabs for Users and Activity Log -->
    <div class="bg-white dark:bg-gray-800 rounded-sm shadow transition-colors duration-300 mb-2">
      <div class="border-b border-gray-200 dark:border-gray-700">
        <nav class="flex -mb-px">
          <button @click="activeTab = 'users'" :class="[
            'px-6 py-3 text-sm font-medium border-b-2 transition-colors',
            activeTab === 'users'
              ? 'border-blue-600 text-blue-600 dark:text-blue-400'
              : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300'
          ]">
            Users
          </button>
          <button @click="activeTab = 'activity'" :class="[
            'px-6 py-3 text-sm font-medium border-b-2 transition-colors',
            activeTab === 'activity'
              ? 'border-blue-600 text-blue-600 dark:text-blue-400'
              : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300'
          ]">
            Activity Log
          </button>
          <button @click="activeTab = 'permissions'" :class="[
            'px-6 py-3 text-sm font-medium border-b-2 transition-colors',
            activeTab === 'permissions'
              ? 'border-blue-600 text-blue-600 dark:text-blue-400'
              : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300'
          ]">
            Permissions
          </button>
        </nav>
      </div>

      <!-- Users Tab -->
      <div v-if="activeTab === 'users'" class="p-4">
        <!-- Search and Filter Bar -->
        <div class="mb-4">
          <div class="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div class="relative w-[400px]">
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg class="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input v-model="searchQuery" type="text" placeholder="Search users..."
                class="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200" />
            </div>
            <div class="flex items-center gap-4">
              <div class="relative">
                <select v-model="selectedRole"
                  class="appearance-none bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-sm px-4 py-2 pr-8 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 dark:text-gray-200">
                  <option value="">All Roles</option>
                  <option value="Admin">Admin</option>
                  <option value="Analyst">Analyst</option>
                  <option value="Manager">Manager</option>
                  <option value="Viewer">Viewer</option>
                </select>
                <div class="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                  <svg class="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
              <button @click="openAddUserDrawer"
                class="px-6 py-2 bg-blue-600 text-white rounded-sm hover:bg-blue-700 transition-colors font-medium flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24"
                  stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                </svg>
                Add User
              </button>
            </div>
          </div>
        </div>

        <!-- Users Table -->
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
                  Email</th>
                <th
                  class="px-4 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider border-b border-gray-200 dark:border-gray-700">
                  Role</th>
                <th
                  class="px-4 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider border-b border-gray-200 dark:border-gray-700">
                  Status</th>
                <th
                  class="px-4 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider border-b border-gray-200 dark:border-gray-700">
                  Last Login</th>
                <th
                  class="px-4 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider border-b border-gray-200 dark:border-gray-700">
                  Actions</th>
              </tr>
            </thead>
            <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              <tr v-for="(user, index) in filteredUsers" :key="user.id"
                class="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                <td class="px-4 py-3 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">{{ index + 1 }}</td>
                <td class="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">{{
                  user.name }}</td>
                <td class="px-4 py-3 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">{{ user.email }}</td>
                <td class="px-4 py-3 whitespace-nowrap">
                  <span :class="[
                    'px-2 py-1 text-xs font-medium rounded-sm',
                    user.role === 'Admin' ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-400' :
                      user.role === 'Analyst' ? 'bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-400' :
                        user.role === 'Manager' ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-400' :
                          'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300'
                  ]">
                    {{ user.role }}
                  </span>
                </td>
                <td class="px-4 py-3 whitespace-nowrap">
                  <span :class="[
                    'px-2 py-1 text-xs font-medium rounded-sm',
                    user.status === 'Active' ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400' :
                      'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300'
                  ]">
                    {{ user.status }}
                  </span>
                </td>
                <td class="px-4 py-3 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                  {{ user.lastLogin ? new Date(user.lastLogin).toLocaleDateString() : 'Never' }}
                </td>
                <td class="px-4 py-3 whitespace-nowrap text-sm font-medium">
                  <button @click="editUser(user)"
                    class="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 mr-3">
                    Edit
                  </button>
                  <button @click="deleteUser(user)"
                    class="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300">
                    Delete
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Activity Log Tab -->
      <div v-if="activeTab === 'activity'" class="p-4">
        <!-- Filter Bar -->
        <div class="mb-4">
          <div class="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div class="relative w-[400px]">
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg class="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input v-model="activitySearchQuery" type="text" placeholder="Search activity..."
                class="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200" />
            </div>
            <div class="flex items-center gap-4">
              <div class="relative">
                <select v-model="selectedActionType"
                  class="appearance-none bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-sm px-4 py-2 pr-8 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 dark:text-gray-200">
                  <option value="">All Actions</option>
                  <option value="Login">Login</option>
                  <option value="Logout">Logout</option>
                  <option value="Create">Create</option>
                  <option value="Update">Update</option>
                  <option value="Delete">Delete</option>
                  <option value="Export">Export</option>
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

        <!-- Activity Log Table -->
        <div class="max-h-[500px] overflow-y-auto">
          <table class="w-full">
            <thead class="bg-gray-50 dark:bg-gray-800 sticky top-0 z-10">
              <tr>
                <th
                  class="px-4 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider border-b border-gray-200 dark:border-gray-700">
                  No</th>
                <th
                  class="px-4 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider border-b border-gray-200 dark:border-gray-700">
                  User</th>
                <th
                  class="px-4 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider border-b border-gray-200 dark:border-gray-700">
                  Action</th>
                <th
                  class="px-4 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider border-b border-gray-200 dark:border-gray-700">
                  Details</th>
                <th
                  class="px-4 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider border-b border-gray-200 dark:border-gray-700">
                  IP Address</th>
                <th
                  class="px-4 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider border-b border-gray-200 dark:border-gray-700">
                  Timestamp</th>
              </tr>
            </thead>
            <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              <tr v-for="(activity, index) in filteredActivityLogs" :key="activity.id"
                class="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                <td class="px-4 py-3 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">{{ index + 1 }}</td>
                <td class="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">{{
                  activity.userName }}</td>
                <td class="px-4 py-3 whitespace-nowrap">
                  <span :class="[
                    'px-2 py-1 text-xs font-medium rounded-sm',
                    activity.action === 'Login' ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400' :
                      activity.action === 'Logout' ? 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300' :
                        activity.action === 'Create' ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-400' :
                          activity.action === 'Update' ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-400' :
                            activity.action === 'Delete' ? 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-400' :
                              'bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-400'
                  ]">
                    {{ activity.action }}
                  </span>
                </td>
                <td class="px-4 py-3 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">{{ activity.details }}
                </td>
                <td class="px-4 py-3 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">{{ activity.ipAddress
                  }}</td>
                <td class="px-4 py-3 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                  {{ new Date(activity.timestamp).toLocaleString() }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Permissions Tab -->
      <div v-if="activeTab === 'permissions'" class="p-4">
        <h3 class="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">Role-Based Access Control</h3>

        <!-- Permission Matrix Table -->
        <div class="max-h-[500px] overflow-y-auto">
          <table class="w-full">
            <thead class="bg-gray-50 dark:bg-gray-800 sticky top-0 z-10">
              <tr>
                <th
                  class="px-4 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider border-b border-gray-200 dark:border-gray-700">
                  Feature</th>
                <th
                  class="px-4 py-3 text-center text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider border-b border-gray-200 dark:border-gray-700">
                  Admin</th>
                <th
                  class="px-4 py-3 text-center text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider border-b border-gray-200 dark:border-gray-700">
                  Analyst</th>
                <th
                  class="px-4 py-3 text-center text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider border-b border-gray-200 dark:border-gray-700">
                  Manager</th>
                <th
                  class="px-4 py-3 text-center text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider border-b border-gray-200 dark:border-gray-700">
                  Viewer</th>
              </tr>
            </thead>
            <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              <tr v-for="feature in permissionFeatures" :key="feature.name"
                class="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                <td class="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">{{
                  feature.name }}</td>
                <td class="px-4 py-3 whitespace-nowrap text-center">
                  <span v-if="feature.permissions.Admin" class="text-green-600 dark:text-green-400">✓</span>
                  <span v-else class="text-gray-400">✗</span>
                </td>
                <td class="px-4 py-3 whitespace-nowrap text-center">
                  <span v-if="feature.permissions.Analyst" class="text-green-600 dark:text-green-400">✓</span>
                  <span v-else class="text-gray-400">✗</span>
                </td>
                <td class="px-4 py-3 whitespace-nowrap text-center">
                  <span v-if="feature.permissions.Manager" class="text-green-600 dark:text-green-400">✓</span>
                  <span v-else class="text-gray-400">✗</span>
                </td>
                <td class="px-4 py-3 whitespace-nowrap text-center">
                  <span v-if="feature.permissions.Viewer" class="text-green-600 dark:text-green-400">✓</span>
                  <span v-else class="text-gray-400">✗</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Add/Edit User Drawer -->
    <Transition name="drawer">
      <div v-if="showUserDrawer" class="fixed inset-0 bg-black bg-opacity-50 z-50" @click.self="closeUserDrawer">
        <div
          class="absolute right-0 top-0 h-full w-full max-w-md bg-white dark:bg-gray-800 shadow-xl overflow-y-auto transition-colors duration-300">
          <div
            class="sticky top-0 bg-white dark:bg-gray-800 text-black dark:text-gray-200 px-6 py-5 flex items-center justify-between z-10 border-b border-gray-200 dark:border-gray-700">
            <h2 class="text-xl font-bold">{{ editingUser ? 'Edit User' : 'Add New User' }}</h2>
            <button @click="closeUserDrawer"
              class="text-black dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-sm p-2 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24"
                stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div class="p-6 space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Name</label>
              <input v-model="userForm.name" type="text"
                class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200"
                placeholder="Enter user name" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Email</label>
              <input v-model="userForm.email" type="email"
                class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200"
                placeholder="Enter email address" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Role</label>
              <select v-model="userForm.role"
                class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200">
                <option value="Admin">Admin</option>
                <option value="Analyst">Analyst</option>
                <option value="Manager">Manager</option>
                <option value="Viewer">Viewer</option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Status</label>
              <select v-model="userForm.status"
                class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200">
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>
            <div class="flex gap-3 justify-end pt-4">
              <button @click="closeUserDrawer"
                class="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-sm hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors font-medium">
                Cancel
              </button>
              <button @click="saveUser"
                class="px-4 py-2 bg-blue-600 text-white rounded-sm hover:bg-blue-700 transition-colors font-medium">
                {{ editingUser ? 'Update' : 'Create' }}
              </button>
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
import BankingCard from '../components/BankingCard.vue'

// Inject sidebar collapse state
const isSidebarCollapsed = inject('isSidebarCollapsed', ref(false))
const { t } = useI18n()

// Icons
const userIcon = '<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>'
const activeIcon = '<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>'
const adminIcon = '<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>'
const analystIcon = '<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-orange-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>'

// Tab state
const activeTab = ref('users')

// Mock users data
const users = ref([
  { id: 'U001', name: 'John Admin', email: 'john.admin@bank.com', role: 'Admin', status: 'Active', lastLogin: '2024-02-20T10:30:00' },
  { id: 'U002', name: 'Sarah Analyst', email: 'sarah.analyst@bank.com', role: 'Analyst', status: 'Active', lastLogin: '2024-02-20T09:15:00' },
  { id: 'U003', name: 'Mike Manager', email: 'mike.manager@bank.com', role: 'Manager', status: 'Active', lastLogin: '2024-02-19T16:45:00' },
  { id: 'U004', name: 'Lisa Viewer', email: 'lisa.viewer@bank.com', role: 'Viewer', status: 'Active', lastLogin: '2024-02-18T14:20:00' },
  { id: 'U005', name: 'David Analyst', email: 'david.analyst@bank.com', role: 'Analyst', status: 'Inactive', lastLogin: '2024-02-15T11:00:00' }
])

// Mock activity logs
const activityLogs = ref([
  { id: 'A001', userName: 'John Admin', action: 'Login', details: 'Logged into system', ipAddress: '192.168.1.100', timestamp: '2024-02-20T10:30:00' },
  { id: 'A002', userName: 'Sarah Analyst', action: 'Export', details: 'Exported monthly report', ipAddress: '192.168.1.101', timestamp: '2024-02-20T09:15:00' },
  { id: 'A003', userName: 'Mike Manager', action: 'Update', details: 'Updated customer C001', ipAddress: '192.168.1.102', timestamp: '2024-02-19T16:45:00' },
  { id: 'A004', userName: 'Lisa Viewer', action: 'Login', details: 'Logged into system', ipAddress: '192.168.1.103', timestamp: '2024-02-18T14:20:00' },
  { id: 'A005', userName: 'John Admin', action: 'Create', details: 'Created new user', ipAddress: '192.168.1.100', timestamp: '2024-02-17T13:10:00' },
  { id: 'A006', userName: 'Sarah Analyst', action: 'Update', details: 'Updated risk score for C002', ipAddress: '192.168.1.101', timestamp: '2024-02-16T15:30:00' },
  { id: 'A007', userName: 'David Analyst', action: 'Logout', details: 'Logged out of system', ipAddress: '192.168.1.104', timestamp: '2024-02-15T11:00:00' },
  { id: 'A008', userName: 'Mike Manager', action: 'Delete', details: 'Deleted branch BT002', ipAddress: '192.168.1.102', timestamp: '2024-02-14T10:20:00' }
])

// Permission matrix
const permissionFeatures = ref([
  { name: 'View Dashboard', permissions: { Admin: true, Analyst: true, Manager: true, Viewer: true } },
  { name: 'View Risk Scores', permissions: { Admin: true, Analyst: true, Manager: true, Viewer: true } },
  { name: 'Edit Risk Scores', permissions: { Admin: true, Analyst: true, Manager: false, Viewer: false } },
  { name: 'View Customers', permissions: { Admin: true, Analyst: true, Manager: true, Viewer: true } },
  { name: 'Edit Customers', permissions: { Admin: true, Analyst: true, Manager: true, Viewer: false } },
  { name: 'View Loans', permissions: { Admin: true, Analyst: true, Manager: true, Viewer: true } },
  { name: 'Approve Loans', permissions: { Admin: true, Analyst: false, Manager: true, Viewer: false } },
  { name: 'View Deposits', permissions: { Admin: true, Analyst: true, Manager: true, Viewer: true } },
  { name: 'View Branches', permissions: { Admin: true, Analyst: true, Manager: true, Viewer: true } },
  { name: 'Manage Branches', permissions: { Admin: true, Analyst: false, Manager: false, Viewer: false } },
  { name: 'Generate Reports', permissions: { Admin: true, Analyst: true, Manager: true, Viewer: false } },
  { name: 'Export Data', permissions: { Admin: true, Analyst: true, Manager: false, Viewer: false } },
  { name: 'Manage Users', permissions: { Admin: true, Analyst: false, Manager: false, Viewer: false } },
  { name: 'View Activity Logs', permissions: { Admin: true, Analyst: false, Manager: false, Viewer: false } }
])

// Search and filters
const searchQuery = ref('')
const selectedRole = ref('')
const activitySearchQuery = ref('')
const selectedActionType = ref('')

// Computed values
const totalUsers = computed(() => users.value.length)
const activeUsers = computed(() => users.value.filter(u => u.status === 'Active').length)
const adminUsers = computed(() => users.value.filter(u => u.role === 'Admin').length)
const analystUsers = computed(() => users.value.filter(u => u.role === 'Analyst').length)

// Filtered users
const filteredUsers = computed(() => {
  let filtered = users.value

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(user =>
      user.name.toLowerCase().includes(query) ||
      user.email.toLowerCase().includes(query) ||
      user.role.toLowerCase().includes(query)
    )
  }

  if (selectedRole.value) {
    filtered = filtered.filter(user => user.role === selectedRole.value)
  }

  return filtered
})

// Filtered activity logs
const filteredActivityLogs = computed(() => {
  let filtered = activityLogs.value

  if (activitySearchQuery.value) {
    const query = activitySearchQuery.value.toLowerCase()
    filtered = filtered.filter(activity =>
      activity.userName.toLowerCase().includes(query) ||
      activity.action.toLowerCase().includes(query) ||
      activity.details.toLowerCase().includes(query)
    )
  }

  if (selectedActionType.value) {
    filtered = filtered.filter(activity => activity.action === selectedActionType.value)
  }

  return filtered.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
})

// User drawer
const showUserDrawer = ref(false)
const editingUser = ref(null)
const userForm = ref({
  name: '',
  email: '',
  role: 'Viewer',
  status: 'Active'
})

const openAddUserDrawer = () => {
  editingUser.value = null
  userForm.value = {
    name: '',
    email: '',
    role: 'Viewer',
    status: 'Active'
  }
  showUserDrawer.value = true
}

const editUser = (user) => {
  editingUser.value = user
  userForm.value = {
    name: user.name,
    email: user.email,
    role: user.role,
    status: user.status
  }
  showUserDrawer.value = true
}

const deleteUser = (user) => {
  if (confirm(`Are you sure you want to delete ${user.name}?`)) {
    const index = users.value.findIndex(u => u.id === user.id)
    if (index > -1) {
      users.value.splice(index, 1)
    }
  }
}

const saveUser = () => {
  if (editingUser.value) {
    // Update existing user
    const index = users.value.findIndex(u => u.id === editingUser.value.id)
    if (index > -1) {
      users.value[index] = {
        ...users.value[index],
        ...userForm.value
      }
    }
  } else {
    // Add new user
    const newUser = {
      id: `U${String(users.value.length + 1).padStart(3, '0')}`,
      ...userForm.value,
      lastLogin: null
    }
    users.value.push(newUser)
  }
  closeUserDrawer()
}

const closeUserDrawer = () => {
  showUserDrawer.value = false
  editingUser.value = null
  userForm.value = {
    name: '',
    email: '',
    role: 'Viewer',
    status: 'Active'
  }
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
