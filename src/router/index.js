import { createRouter, createWebHistory } from 'vue-router'


const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        // 新增：根路径 / 重定向到 FoodRecord 路由
        {
            path: '/',
            name: 'Home',
            component: () => import('@/views/Home.vue') // 你的首页组件
        },
        {
            path: '/food-record',
            name: 'FoodRecord',
            component: () => import('@/components/FoodRecord.vue')
        },
        {
            path: '/snack-analysis',
            name: 'SnackAnalysis',
            component: () => import('@/components/SnackAnalysis.vue')
        }
    ]
})

export default router
