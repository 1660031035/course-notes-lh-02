<template>
  <el-container class="main-container">
    <!-- 头部区域 -->
    <el-header>
      <!-- 左侧的 logo -->
      <img src="../../assets/images/logo.png" alt="" />
      <!-- 右侧的菜单 -->
      <el-menu
        class="el-menu-top"
        mode="horizontal"
        background-color="#23262E"
        text-color="#fff"
        active-text-color="#409EFF"
      >
        <el-submenu index="1">
          <template slot="title">
            <!-- 头像 -->
            <!-- 有头像显示头像,没有头像显示默认图片 -->
            <img
              :src="userInfo.user_pic"
              alt=""
              class="avatar"
              v-if="userInfo.user_pic"
            />
            <img src="../../assets/logo.png" alt="" class="avatar" v-else />
            <span>个人中心</span>
          </template>
          <el-menu-item index="1-1"
            ><i class="el-icon-s-operation"></i>基本资料</el-menu-item
          >
          <el-menu-item index="1-2"
            ><i class="el-icon-camera"></i>更换头像</el-menu-item
          >
          <el-menu-item index="1-3"
            ><i class="el-icon-key"></i>重置密码</el-menu-item
          >
        </el-submenu>
        <el-menu-item index="2" @click="logout"
          ><i class="el-icon-switch-button"></i>退出</el-menu-item
        >
      </el-menu>
    </el-header>
    <el-container>
      <!-- 侧边栏区域 -->
      <!-- 2. 渲染数据 -->
      <el-aside width="200px">
        <el-aside width="200px">
          <div class="user-box">
            <img :src="userInfo.user_pic" alt="" v-if="userInfo.user_pic" />
            <img src="../../assets/logo.png" alt="" class="avatar" v-else />
            <span>欢迎 {{ userInfo.nickname || userInfo.username }}</span>
          </div>
          <!-- 将菜单包裹在template中 
          template:模板标签，不会渲染dom结构，起到包裹标签的作用
          template:模板标签 不能使用：key -->
          <!-- router 开启路由模式 -->
          <!-- 通过default-active设置默认值 -->
          <!-- route当前组件 动态设置左侧菜单激活项-->
          <el-menu
            default-active="$route.path"
            class="el-menu-vertical-demo"
            background-color="#23262E"
            text-color="#fff"
            active-text-color="#409EFF"
            unique-opened
            router
          >
            <template v-for="item in menus">
              <!-- 不包含子菜单的“一级菜单” -->
              <el-menu-item
                :index="item.indexPath"
                :key="item.indexPath"
                v-if="!item.children"
                ><i :class="item.icon"></i>{{ item.title }}</el-menu-item
              >
              <!-- 包含子菜单的“一级菜单” -->
              <el-submenu :key="item.indexPath" :index="item.indexPath" v-else>
                <template slot="title">
                  <i :class="item.icon"></i>
                  <span>{{ item.title }}</span>
                </template>
                <el-menu-item
                  :index="itemChild.indexPath"
                  v-for="itemChild in item.children"
                  :key="itemChild.indexPath"
                  ><i :class="itemChild.icon"></i
                  >{{ itemChild.title }}</el-menu-item
                >
              </el-submenu>
            </template>
          </el-menu>
        </el-aside>
      </el-aside>
      <el-container>
        <!-- 页面主体区域 -->
        <el-main> <router-view></router-view> </el-main>
        <!-- 底部 footer 区域 -->
        <el-footer>© www.itheima.com - 黑马程序员</el-footer>
      </el-container>
    </el-container>
  </el-container>
</template>

<script>
// 1. 将vuex中的数据映射到当前组件中
import { mapState } from 'vuex'
export default {
  // 渲染用户数据
  // 1. 将vuex中的数据映射到当前组件中使用
  // 2. 渲染数据
  name: 'Main',
  data () {
    return {
      menus: []
    }
  },
  computed: {
    // 使用数据
    ...mapState(['userInfo', 'token'])
  },
  // 控制后台主页的访问权限
  created () {
    // 判断token是否有值,如果有就请求数据,没有就跳转登录页
    if (this.token) {
      this.$store.dispatch('initUserInfo')
    // 2. 在created钩子函数中触发函数发送请求
    this.initMenus()
    } else {
      // 如果token没有值, 就跳转到主页
      this.$router.push('/login')
    }

    // 将用户信息储存到vuex中,多个组件需要使用到用户信息数据
    // 1. 在Main组件中触发vuex中的函数
    // 2. 在vuex的actions中定义函数, 使用axios获取用户信息
    // 3. 将获取到的数据保存到vuex中
    // 1. 在Main组件中触发vuex中的函数
    
  },
  methods: {
    logout () {
      // 退出登录功能
      // 1. 注册事件 + 弹出询问框 + 跳转主页面 + 清除token
      // 1. 询问用户是否退出登录
      this.$confirm('您确定要退出登录吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$message({
          type: 'success',
          message: '退出登录成功!',
        })
        // 跳转主页面
        this.$router.push('/login')
        // 清除token
        this.$store.commit('updateToken', '')
        // 清除用户信息
        this.$store.commit('initUserInfo', '')
      }).catch(err => err)
    },
    // 获取左侧菜单的数据 + 渲染数据
    // 1. 定义函数发送axios请求, 将获取到的数据保存到data中
    // 2. 在created钩子函数中触发函数发送请求
    // 3. 分析数据 + 遍历一级数据 + 遍历二级数据
    async initMenus () {
      const { data: res } = await this.$http.get('/my/menus')
      if (res.code === 0) {
        // 获取信息成功
        console.log(res)
        this.menus = res.data
      }
    }
  }
}
</script>

<style lang="less" scoped>
.main-container {
  height: 100%;
  .el-header,
  .el-aside {
    background-color: #23262e;
  }
  .el-header {
    padding: 0;
    display: flex;
    justify-content: space-between;
  }
  .el-main {
    overflow-y: scroll;
    height: 0;
    background-color: #f2f2f2;
  }
  .el-footer {
    background-color: #eee;
    font-size: 12px;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  // 左侧边栏用户信息区域
  .user-box {
    height: 70px;
    display: flex;
    justify-content: center;
    align-items: center;
    border-top: 1px solid #000;
    border-bottom: 1px solid #000;
    user-select: none;
    img {
      width: 35px;
      height: 35px;
      border-radius: 50%;
      background-color: #fff;
      margin-right: 15px;
      object-fit: cover;
    }
    span {
      color: white;
      font-size: 12px;
    }
  }
  // 侧边栏菜单的样式
  .el-aside {
    .el-submenu,
    .el-menu-item {
      width: 200px;
      user-select: none;
    }
  }
}

.avatar {
  border-radius: 50%;
  width: 35px;
  height: 35px;
  background-color: #fff;
  margin-right: 10px;
  object-fit: cover;
}
</style>
