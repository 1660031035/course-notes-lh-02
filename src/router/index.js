import Vue from 'vue'
import VueRouter from 'vue-router'
// 1. 导入模块并声明路由规则
// 1.1 导入登录与注册模块
import Reg from '@/views/Reg/Reg.vue'
import Login from '@/views/Login/Login.vue'
import Main from '@/views/Main/Main.vue'
// 导入Home组件
import  Home from '@/views/Menus/Home/Home.vue'
// 导入用户信息模块
import UserInfo from '@/views/Menus/User/UserInfo.vue'
// 导入头像模块
import UserAvatar from '@/views/Menus/User/UserAvatar'
// 导入重置密码模块
import UserPwd from '@/views/Menus/User/UserPwd.vue'
// 导入文章分类模块
import ArtCate from '@/views/Menus/Article/ArtCate.vue'
// 导入文章列表模块
import ArtList from '@/views/Menus/Article/ArtList.vue'
// 把下面的代码粘贴到路由模块中对应的位置，即可防止路由报错的问题
const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err)
}
Vue.use(VueRouter) 

const routes = [ 
  // 1.2 声明路由规则
  // path: 路径, component: 组件。
  { path: '/reg', component: Reg },
  { path: '/login', component: Login },
  { path: '/', component: Main ,
  // 开启路由重定向
  redirect: '/home',
  children: [
    { path: 'home', component: Home },
    { path: 'user-info', component: UserInfo },
    { path: 'user-avatar', component: UserAvatar },
    { path: 'user-pwd', component: UserPwd},
    { path: 'art-cate', component: ArtCate},
    { path: 'art-list', component: ArtList}
  ]
}
]

const router = new VueRouter({
  routes
})

export default router
