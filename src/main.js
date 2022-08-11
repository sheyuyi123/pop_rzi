import Vue from 'vue'

import 'normalize.css/normalize.css' // A modern alternative to CSS resets

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
// import locale from 'element-ui/lib/locale/lang/en' // lang i18n

import '@/styles/index.scss' // global css

import App from './App'
import store from './store'
import router from './router'

import '@/icons' // icon
import '@/permission' // permission control
// Vue.use(ElementUI, { locale })
import i18n from './lang'
import Components from '@/components/index'
// 打印
import Print from 'vue-print-nb'
Vue.use(Print)
Vue.use(Components)
// 一次性注册使用指令
import * as directives from '@/directives/index'

// console.log(directives)

for (const key in directives) {
  Vue.directive(key, directives[key])
}

import * as filters from '@/filters/index'

Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
})

/**
 * If you don't want to use mock-server
 * you want to use MockJs for mock api
 * you can execute: mockXHR()
 *
 * Currently MockJs will be used in the production environment,
 * please remove it before going online ! ! !
 */

// set ElementUI lang to EN
// Vue.use(ElementUI, { locale })
// 如果想要中文版 element-ui，按如下方式声明
Vue.use(ElementUI, {
  i18n: (key, value) => i18n.t(key, value)
})

Vue.config.productionTip = false

new Vue({
  el: '#app',
  router,
  store,
  i18n,
  render: h => h(App)
})
