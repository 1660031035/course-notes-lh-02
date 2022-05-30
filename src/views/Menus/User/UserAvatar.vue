<template>
  <el-card class="box-card">
    <div slot="header" class="clearfix">
      <span>更换头像</span>
    </div>
    <div>
      <!-- 图片，用来展示用户选择的头像 -->
      <img :src="avatar" alt="" class="preview" v-if="avatar" />
      <img
        src="../../../assets/images/avatar.jpg"
        alt=""
        class="preview"
        v-else
      />

      <!-- 按钮区域 -->
      <div class="btn-box">
        <input
          type="file"
          accept="image/*"
          @change="onFileChange"
          style="display: none"
          ref="iptRef"
        />
        <!-- // @click="$refs.iptRef.click() 模拟文件上传点击事件 -->
        <el-button
          type="primary"
          icon="el-icon-plus"
          @click="$refs.iptRef.click()"
          >选择图片</el-button
        >
        <!-- 没有上传头像时禁用按钮 -->
        <el-button
          @click="uploadAvatar"
          type="success"
          :disabled="avatar === ''"
          icon="el-icon-upload"
          >上传头像</el-button
        >
      </div>
    </div>
  </el-card>
</template>

<script>
export default {
  name: 'UserAvatar',
  data () {
    return {
      avatar: ''
    }
  },
  methods: {
    // 获取用户选择的图片并渲染到页面上
    onFileChange (e) {
      // 获取用户选择的文件列表
      const files = e.target.files
      console.log(files)
      // 判断有没有选择图片
      if (files.length > 0) {
        //选择了图片
        // 创建FileReader对象
        var reader = new FileReader()
        // 调用readAsDataURL函数读取文件内容
        reader.readAsDataURL(files[0])
        // 监听onload事件，读取完成触发回调函数
        reader.addEventListener('load', () => {
          // 获取到base64字符串，存储到data中
          this.avatar = reader.result
        })
      } else {
        // 没有选择图片
        this.avatar = ''
      }
    },
    // 实现更换头像功能
    // 注册事件处理函数 + 发送请求 + 清空头像框 + 更新vuex中的数据
    async uploadAvatar () {
      const { data: res } = await this.$http.patch('/my/update/avatar',{ avatar: this.avatar })
       // 判断是否上传成功
      if(res.code !== 0) return this.$message.error('上传头像失败')
      this.$message.success('上传头像成功')
      // 清空头像框
      this.avatar = ''
      // 更新vuex中的数据
      this.$store.dispatch('initUserInfo')
    }
  }
}
</script>

<style lang="less" scoped>
.btn-box {
  margin-top: 10px;
}
.preview {
  object-fit: cover;
  width: 350px;
  height: 350px;
}
</style>
