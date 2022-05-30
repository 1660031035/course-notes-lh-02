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
// 3. 导入全局样式表
import '@/assets/global.less'
// 导入富文本编辑器
import VueQuillEditor from 'vue-quill-editor'
// 导入富文本编辑器的样式
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'

// 全局注册富文本编辑器
Vue.use(VueQuillEditor)
// 1.2 把axios挂载到Vue的原型对象中
Vue.prototype.$http = axios
// 1.3 设置axios基地址
axios.defaults.baseURL = 'http://big-event-vue-api-t.itheima.net'
Vue.config.productionTip = false
// 设置拦截器
// 添加请求拦截器
axios.interceptors.request.use(function (config) {
  // 在发送请求之前做些什么
  //设置请求头 如果接口失忆/my开头的则要设置请求头
  // startsWith('')方法判断字符串是否以此开头
  if(config.url.startsWith('/my')) {
    // 如果是,则要设置请求头
    config.headers.Authorization = store.state.token
  }
  // console.log(config)
  return config;
}, function (error) {
  // 对请求错误做些什么
  return Promise.reject(error);
});

// 添加响应拦截器
axios.interceptors.response.use(function (response) {
  // 对响应数据做点什么
  return response;
}, function (error) {
  // 对响应错误做点什么
  // 处理token无效时的响应
  if(error.response.status === 401) {
    // 重置token
    store.commit('updateToken', '')
    // 清除用户信息
    store.commit('initUserInfo', {})
    // 跳转登录页
    router.push('/login')
    }
  return Promise.reject(error);
});
// 2.3 注册ElementUi
Vue.use(ElementUi)
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
