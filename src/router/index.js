import { usePlaySongsStore } from '@/stores/counter'
import { storeToRefs } from 'pinia'
import { createRouter, createWebHistory } from 'vue-router'
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'Home',
      component: () => import('@/views/Home.vue')
    },
    {
      path: '/itemMusic',
      name: 'itemMusic',
      component: () => import('@/views/ItemMusic.vue')
    },
    {
      path: '/search',
      name: 'Search',
      component: () => import('@/views/SearchMusic.vue')
    },
    {
      path: '/login',
      name: 'Login',
      component: () => import('@/views/Login.vue')
    },
    {
      path: '/infoUser', //路由守卫，没登录不能进入,to即将进入的目标,from正要离开的路由
      name: 'InfoUser', //beforeEnter是某个页面专属的导航守卫，beforeEach是全局的
      beforeEnter: () => {
        //在里面使用，防止路由加载出来的时候,pinia还没加载出来
        const playSongsStore = usePlaySongsStore()
        const { isLogin } = storeToRefs(playSongsStore)
        if (!isLogin.value) return '/login'
        return true
      },
      component: () => import('@/views/InfoUser.vue')
    }
  ]
})

router.beforeEach((to) => {
  const playSongsStore = usePlaySongsStore()
  const { isFooterMusic } = storeToRefs(playSongsStore)
  if (to.path == '/login') {
    isFooterMusic.value = false
  } else isFooterMusic.value = true
})
//component是一个函数，懒加载，需要的时候才会加载
export default router
