import { constantRoutes, asyncRoutes } from '@/router'

const state = {
  router: constantRoutes
}

const mutations = {
  setRouter(state, newRouter) {
    state.routes = [...constantRoutes, ...newRouter]
  }
}
const actions = {
  // 动态路由 asyncRoutes
  // 用户拥有的路由name值
  // 筛选
  filterRoutes(context, menus) {
    const resRoutes = asyncRoutes.filter(item => {
      return menus.includes(item.name)
    })
    // console.log(resRoutes)
    context.commit('setRouter', resRoutes)
    return resRoutes
  }
}
export default {
  namespaced: true,
  state,
  mutations,
  actions
}
