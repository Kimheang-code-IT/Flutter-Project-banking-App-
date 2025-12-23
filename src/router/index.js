import { createRouter, createWebHistory } from 'vue-router'
import DashboardView from '../views/DashboardView.vue'
import ReportView from '../views/ReportView.vue'
import UserView from '../views/UserView.vue'

const routes = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/LoginView.vue')
  },
  {
    path: '/',
    name: 'Dashboard',
    component: DashboardView
  },
  {
    path: '/risk-scoring',
    name: 'RiskScoring',
    component: () => import('../views/RiskScoringView.vue')
  },
  {
    path: '/customer',
    name: 'Customer',
    component: () => import('../views/CustomerView.vue')
  },
  {
    path: '/loan-trans',
    name: 'LoanTrans',
    component: () => import('../views/LoanTrans.vue')
  },
  {
    path: '/analytic',
    name: 'Analytic',
    component: () => import('../views/Analytic.vue')
  },
  {
    path: '/deposit',
    name: 'Deposit',
    component: () => import('../views/DepositView.vue')
  },
  {
    path: '/branch',
    name: 'Branch',
    component: () => import('../views/BranchView.vue')
  },
  {
    path: '/report',
    name: 'Report',
    component: ReportView
  },
  {
    path: '/user',
    name: 'User',
    component: UserView
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router

