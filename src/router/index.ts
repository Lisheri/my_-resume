import { createRouter, createWebHistory } from 'vue-router'
import ResumeEditor from '@/views/ResumeEditor'

const routes = [
  {
    path: '/',
    redirect: '/editor'
  },
  {
    path: '/editor',
    name: 'ResumeEditor',
    component: ResumeEditor
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router 