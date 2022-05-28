<template>
  <!-- 注册页面的整体盒子 -->
  <div class="reg-container">
    <!-- 注册的盒子 -->
    <div class="reg-box">
      <!-- 标题的盒子 -->
      <div class="title-box"></div>
      <!-- 注册的表单区域 -->
      <!-- model用来存储表单采集的数据对象 -->
      <el-form :model="regForm" :rules="regFormRules" ref="regFormRef">
        <!-- 用户名 -->
        <el-form-item prop="username">
          <el-input
            placeholder="请输入用户名"
            prefix-icon="el-icon-user"
            v-model="regForm.username"
          >
          </el-input>
        </el-form-item>
        <!-- 密码 -->
        <el-form-item prop="password">
          <el-input
            placeholder="请输入密码"
            prefix-icon="el-icon-lock"
            v-model="regForm.password"
          >
          </el-input>
        </el-form-item>
        <!-- 确认密码 -->
        <el-form-item prop="repassword">
          <el-input
            placeholder="请确认密码"
            prefix-icon="el-icon-lock"
            v-model="regForm.repassword"
          >
          </el-input>
        </el-form-item>
        <el-form-item>
          <el-button style="width: 100%" type="primary" @click="regNewUser">注册</el-button>
          <el-link type="info" @click="$router.push('/login')">去登录</el-link>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Reg-name',
  methods: {
    regNewUser() {
      this.$refs.regFormRef.validate(async vaild => {
        if(!vaild) return // 未通过校验
        const { data:res } = await this.$http.post('/api/reg', this.regForm)
        if(res.code !== 0) return this.$message.error(res.message)
        this.$message.success(res.message)
        this.$router.push('/login')
      })
    }
  },
  data () {
    // 校验密码是否一致
    var samePwd = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'));
      } else if (value !== this.regForm.password) {
        callback(new Error('两次输入密码不一致!'));
      } else {
        callback();
      }
    }
    return {
      // 存储表单的数据对象
      regForm: {
        username: '',
        password: '',
        repassword: ''
      },
      // 存储表单验证规则对象
      regFormRules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { pattern: /^[a-zA-Z][a-zA-Z0-9]{0,9}$/, message: '用户名必须是1~10位且必须以英文字母开头', trigger: 'blur' }
        ],
        password: [{ required: true, message: '请输入密码', trigger: 'blur' },
        { pattern: /^\S{6,15}$/, message: '密码必须是6~15位', trigger: 'blur' }
        ],
        repassword: [
          { pattern: /^\S{6,15}$/, message: '密码必须是6~15位', trigger: 'blur' },
          { validator: samePwd, trigger: 'blur' }
        ]
      }
    }
  },
}
</script>

<style lang="less" scoped>
.reg-container {
  background: url('../../assets/images/login_bg.jpg') center;
  background-size: cover;
  height: 100%;

  .reg-box {
    width: 400px;
    height: 335px;
    background-color: #fff;
    border-radius: 3px;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);

    .title-box {
      height: 60px;
      background: url('../../assets/images/login_title.png') center no-repeat;
    }
  }

  .el-form {
    padding: 0 25px;
  }
}
</style>

