import { getToken, removeToken, setTimeStamp, setToken } from '@/utils/auth'
import { login, getUserInfo, getUserDetailById } from '@/api/user'
import { resetRouter } from '@/router'
// 状态
const state = {
  token: getToken(),
  userInfo: {}
}
// 修改状态
const mutations = {
// 修改token的方法

  // 1.设置token
  // 2.vuex
  // 3.cookie
  setToken(state, token) {
    state.token = token
    setToken(token)
  },
  // 移除token
  removeToken(state) {
    state.token = null
    removeToken()
  },
  removeUserInfo(state) {
    state.userInfo = {}
  },
  // 用 浅拷贝的方式去赋值对象 因为这样数据更新之后，才会触发组件的更新
  setUserInfo(state, userInfo) {
    state.userInfo = userInfo
  }
}
const actions = {
// 登录请求 >> commit >> mutations
  async login(context, data) {
    const res = await login(data)

    console.log(res)

    context.commit('setToken', res)
    setTimeStamp()
  },
  // 获取用户资料的action

  async getUserInfo(context) {
    const res = await getUserInfo()
    // console.log(result)
    const baseInfo = await getUserDetailById(res.userId)
    // console.log(baseInfo)
    // console.log(...result, ...baseInfo)
    // 存储到vuex
    context.commit('setUserInfo', { ...res, ...baseInfo })
    return { ...baseInfo, ...res }
  },

  // 登出的action
  logOut(context) {
  // 删除token
    context.commit('removeToken') // 不仅仅删除了vuex中的 还删除了缓存中的
    // 删除用户资料
    context.commit('removeUserInfo') // 删除用户信息

    // 重置路由
    resetRouter()
    // 还有一步  vuex中的数据是不是还在
    // 要清空permission模块下的state数据
    // vuex中 user子模块  permission子模块
    // 子模块调用子模块的action  默认情况下 子模块的context是子模块的
    // 父模块 调用 子模块的action
    context.commit('permission/setRoutes', [], { root: true })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
