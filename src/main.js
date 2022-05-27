import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
// 1. 配置axios 
// 1.1 导入axios
import axios from 'axios'
// 2. 配置element-ui
// 2.1 导入element-ui组件
import ElementUi from 'element-ui'
// 2.2 引入element-ui样式
import 'element-ui/lib/theme-chalk/index.css'
// 1.2 把axios挂载到Vue的原型对象中
Vue.prototype.$http = axios
// 1.3 设置axios基地址
axios.defaults.baseURL = 'http://www.liulongbin.top:3008'
Vue.config.productionTip = false
// 2.3 注册ElementUi
Vue.use(ElementUi)
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
