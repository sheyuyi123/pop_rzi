import axios from 'axios'
import { Message } from 'element-ui'
import store from '@/store'
import { getTimeStamp } from '@/utils/auth'
import router from '@/router'

const Timeout = 3600

const server = axios.create({
  baseURL: process.env.VUE_APP_BASE_API,
  timeout: 5000
})
// 请求拦截器
server.interceptors.request.use(config => {
  // 如果token存在，请求的时候需要把token携带到请求头
  const token = store.getters.token
  if (token) {
    // token 携带到请求头
    if (IsCheckTimeOut()) {
      store.dispatch('user/logOut')
      router.push('/login')
      Message.error('登录超时了')
    }
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
}, error => Promise.reject(error))// 错误报错 直接返回
// 响应拦截器
server.interceptors.response.use(response => {
  // 解构从后端返回的数据和状态
  const { data: { data, success, message }} = response
  // 判断success是否为true
  // true >> 请求才是成功的 >> data可用的
  if (success) {
    return data
  }
  // 如果代码走到这里，证明sucess不存在 >> 接口请求有问题
  // 进行错误提示
  Message.error(message || '系统错误')
  // 失败的promise >> 接口请求的地方报错
  return Promise.reject(message || '系统错误')
}, error => {
  // 添加一些错误处理的方式
  // 401 >> 退出登录 >> 跳转登录界面
  // console.dir(error)
  if (error.response.status === 401) {
    // 退出登录
    store.dispatch('user/logOut')
    router.push('/login')
  }
  Message.error(error.response?.data?.message || '系统错误')
  return Promise.reject(error)
}
)

function IsCheckTimeOut() {
  var currentTime = Date.now()
  var timeStamp = getTimeStamp()
  return (currentTime - timeStamp) / 1000 > Timeout
}
// 导出axios实例
export default server // 默认导出request请求
