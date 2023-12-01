import { createRouter, createWebHistory } from 'vue-router'
import ConversationListView from '@/views/ConversationListView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: ConversationListView
    },
    {
      path: '/conversations/:id',
      name: 'conversation',
      component: () => import('../views/ConversationView.vue'),
      props: true
    },
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/AboutView.vue')
    }
  ]
})

export default router
