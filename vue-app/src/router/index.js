import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/store/auth'

// Lazy loading des composants
const Login = () => import('@/views/auth/Login.vue')
const Register = () => import('@/views/auth/Register.vue')
const CharacterList = () => import('@/views/characters/CharacterList.vue')
const CharacterCreate = () => import('@/views/characters/CharacterCreate.vue')
const CharacterProfile = () => import('@/views/characters/CharacterProfile.vue')
const InventoryList = () => import('@/views/inventory/InventoryList.vue')
const ItemEdit = () => import('@/views/inventory/ItemEdit.vue')
const BoardGame = () => import('@/views/game/BoardGame.vue')
const Quests = () => import('@/views/game/Quests.vue')
const Versus = () => import('@/views/game/Versus.vue')

const routes = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    name: 'Login',
    component: Login
  },
  {
    path: '/register',
    name: 'Register',
    component: Register
  },
  {
    path: '/characters',
    name: 'CharacterList',
    component: CharacterList,
    meta: { requiresAuth: true }
  },
  {
    path: '/characters/create',
    name: 'CharacterCreate',
    component: CharacterCreate,
    meta: { requiresAuth: true }
  },
  {
    path: '/character/:id',
    name: 'CharacterProfile',
    component: CharacterProfile,
    meta: { requiresAuth: true }
  },
  {
    path: '/inventory',
    name: 'InventoryList',
    component: InventoryList,
    meta: { requiresAuth: true }
  },
  {
    path: '/inventory/add',
    name: 'ItemAdd',
    component: ItemEdit,
    meta: { requiresAuth: true }
  },
  {
    path: '/inventory/edit/:id',
    name: 'ItemEdit',
    component: ItemEdit,
    meta: { requiresAuth: true }
  },
  {
    path: '/game/board',
    name: 'BoardGame',
    component: BoardGame,
    meta: { requiresAuth: true }
  },
  {
    path: '/game/quests',
    name: 'Quests',
    component: Quests,
    meta: { requiresAuth: true }
  },
  {
    path: '/game/versus',
    name: 'Versus',
    component: Versus,
    meta: { requiresAuth: true }
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/login'
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// Navigation guard pour vérifier l'authentification
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth)
  
  if (requiresAuth && !authStore.isAuthenticated) {
    next('/login')
  } else {
    next()
  }
})

export default router