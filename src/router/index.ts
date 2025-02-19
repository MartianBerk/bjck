import { createRouter, createWebHistory } from 'vue-router'
import BasicStrategyView from '@/views/BasicStrategyView.vue'
import CountingView from '@/views/CountingView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: BasicStrategyView,
    },
    {
      path: '/count',
      name: 'count',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: CountingView,
    }
    // {
    //   path: '/basic/practice',
    //   name: 'practicebasicstrategy',
    //   component: PracticeBasicStrategy
    // }
    // {
    //   path: '/about',
    //   name: 'about',
    //   // route level code-splitting
    //   // this generates a separate chunk (About.[hash].js) for this route
    //   // which is lazy-loaded when the route is visited.
    //   component: () => import('../views/AboutView.vue'),
    // },
  ],
})

export default router
