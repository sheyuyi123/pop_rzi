// 权限拦截 导航守卫 路由守卫  router
import router from '@/router' // 引入路由实例
import store from '@/store' // 引入vuex store实例
import NProgress from 'nprogress' // 引入一份进度条插件
import 'nprogress/nprogress.css' // 引入进度条样式

const loginPath = '/login'
const notFoundPath = '/404'

// 设置白名单(白名单:就是所有人都可以访问的界面，不用权限)
const whiteList = [loginPath, notFoundPath]

// 监听路由的变化
// beforeEach：路由前置守卫(一开始的跳转路由)
router.beforeEach(async(to, from, next) => {
  NProgress.start() // 开启进度条
  // 1.是否有token(是否登录)
  const token = store.getters.token
  if (token) {
    // 判断是否去登录页面
    if (!store.getters.userId) {
      await store.dispatch('user/getUserInfo')
    }
    if (to.ptah === loginPath) {
      next('/') // 跳转到首页
    } else {
      // 直接放行
      next()
    }
  } else {
    // 判断是否去白名单页面 /login  /404
    if (whiteList.includes(to.path)) {
      next()
    } else {
      // 如果你没有token，同时要去界面不是白名单(要去有权限的界面跳转到登录页面)
      next(loginPath)
    }
  }
  NProgress.done()
})
router.afterEach(function() {
  NProgress.done() // 关闭进度条
})

