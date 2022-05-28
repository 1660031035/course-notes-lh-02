import Vue from 'vue'
import Vuex from 'vuex'
// 1.导入vuex-persistedstate
import createPersistedstate from 'vuex-persistedstate'
// 导入axios
import axios from 'axios'
Vue.use(Vuex)

export default new Vuex.Store({
  // 2. 配置为vuex的插件
  plugins: [createPersistedstate()],
  state: {
    token: '',
    userInfo: {}
  },
  getters: {
  },
  mutations: {
    // 更新token
    updateToken(state, newToken) {
      state.token = newToken
    },
    // 更新用户信息
    initUserInfo(state, info) {
      state.userInfo = info
    }
  },
  actions: {
    // 2. 在vuex的actions中定义函数, 使用axios获取用户信息
    async initUserInfo(context) {
      const {data:res} = await axios.get('/my/userinfo')
      // console.log(context)
      // console.log(res)
      if(res.code === 0) {
        // 获取成功,保存到vuex中
        context.commit('initUserInfo', res.data)
      }
    }
  },
  modules: {
  }
})
