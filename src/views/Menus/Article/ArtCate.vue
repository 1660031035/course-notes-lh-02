<template>
  <div>
    <el-card class="box-card">
      <div slot="header" class="clearfix header-box">
        <span>文章分类</span>
        <!-- 注册点击事件,显示添加分类对话框 -->
        <el-button type="primary" size="mini" @click="addVisible = true"
          >添加分类</el-button
        >
      </div>
      <!-- 表格区域 -->
      <el-table style="width: 100%" :data="cateList" border stripe>
        <el-table-column label="序号" type="index" width="50"></el-table-column>
        <el-table-column label="分类名称" prop="cate_name"></el-table-column>
        <el-table-column label="分类别名" prop="cate_alias"></el-table-column>
        <el-table-column label="操作">
          <template v-slot="{ row }">
            <el-button
              type="primary"
              size="mini"
              @click="showEditDialog(row.id)"
              >修改</el-button
            >
            <el-button type="danger" size="mini" @click="remove(row.id)"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <!-- 添加分类对话框 -->
    <el-dialog
      title="添加文章分类"
      @closed="$refs.addRef.resetFields()"
      :visible.sync="addVisible"
      width="35%"
    >
      <!-- 添加的表单 -->
      <!-- 对话框关闭时重置表单 -->
      <el-form
        :model="addForm"
        :rules="addRules"
        ref="addRef"
        label-width="70px"
      >
        <el-form-item label="分类名称" prop="cate_name">
          <el-input
            v-model="addForm.cate_name"
            minlength="1"
            maxlength="10"
          ></el-input>
        </el-form-item>
        <el-form-item label="分类别名" prop="cate_alias">
          <el-input
            v-model="addForm.cate_alias"
            minlength="1"
            maxlength="15"
          ></el-input>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button size="mini" @click="addVisible = false">取 消</el-button>
        <el-button size="mini" type="primary" @click="addCate">添 加</el-button>
      </span>
    </el-dialog>
    <!-- 修改文章分类对话框 -->
    <!-- 对话框关闭, 重置表单 -->
    <el-dialog
      title="修改文章分类"
      @closed="$refs.editFormRef.resetFields()"
      :visible.sync="editVisible"
      width="35%"
    >
      <!-- 修改的表单 -->
      <el-form
        :model="editForm"
        :rules="addRules"
        ref="editFormRef"
        label-width="100px"
      >
        <el-form-item label="分类名称" prop="cate_name">
          <el-input v-model="editForm.cate_name"></el-input>
        </el-form-item>
        <el-form-item label="分类别名" prop="cate_alias">
          <el-input v-model="editForm.cate_alias"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editVisible = false">取 消</el-button>
        <el-button type="primary" @click="editCate">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'ArtCate',
  data () {
    return {
      // 文章的分类列表
      cateList: [],
      // 添加分类的对话框
      addVisible: false,
      // 修改文章分类的对话框
      editVisible: false,
      // 添加表单的数据对象
      addForm: {
        cate_name: '',
        cate_alias: ''
      },
      // 添加表单的验证规则对象
      addRules: {
        cate_name: [
          { required: true, message: '请输入分类名称', trigger: 'blur' },
          { pattern: /^\S{1,10}$/, message: '分类名必须是1-10位的非空字符', trigger: 'blur' }
        ],
        cate_alias: [
          { required: true, message: '请输入分类别名', trigger: 'blur' },
          { pattern: /^[a-zA-Z0-9]{1,15}$/, message: '分类别名必须是1-15位的字母数字', trigger: 'blur' }
        ]
      },
      // 存储修改文章分数据对象
      editForm: {
        cate_name: "",
        cate_alias: "",
      },


    }
  },
  methods: {
    // 请求文章分类数据
    // 定义函数 + 初始化数据
    async initCateList () {
      const { data: res } = await this.$http.get('/my/cate/list')
      if (res.code === 0) {
        this.cateList = res.data
      }
    },
    // 添加文章分类
    // 注册事件处理函数 + 表单预校验 + 发送请求 + 渲染列表 + 关闭对话框
    addCate () {
      this.$refs.addRef.validate(async valid => {
        if (!valid) return
        const { data: res } = await this.$http.post('/my/cate/add', this.addForm)
        if (res.code !== 0) return this.$message.error('添加分类失败！')
        this.$message.success('添加分类成功！')
        // 渲染列表
        this.initCateList()
        // 关闭对话框
        this.addVisible = false
      })
    },
    // 修改文章分类
    // 注册事件处理函数 + 表单预验证 + 发送请求 + 关闭对话框 +重置表单
    editCate () {
      // 表单验证
      // 1. 表单预验证
      this.$refs.editFormRef.validate(async valid => {
        if (!valid) return
        // 2. 发起请求
        const { data: res } = await this.$http.put('/my/cate/info', this.editForm)
        // 3. 修改失败
        if (res.code !== 0) return this.$message.error('修改分类失败！')
        // 4. 修改成功：提示用户、关闭对话框、刷新列表数据
        this.$message.success('修改分类成功！')
        this.editVisible = false
        this.initCateList()
      })
    },
    // 修改功能 
    async showEditDialog (id) {
      // 获取分类的基本信息
      const { data: res } = await this.$http.get('/my/cate/info', {
        params: { id }
      })

      if (res.code === 0) {
        // 2. 为 data 中的 editForm 赋值
        this.editForm = res.data
        // 3. 展示对话框
        this.editVisible = true
      }
    },
    // 删除功能
    // 询问框 + 发送请求 + 重置表单
    remove (id) {
      this.$confirm("此操作将永久删除该文件, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {
          // 发起请求删除对应的分类
          const { data: res } = await this.$http.delete("/my/cate/del", {
            params: { id },
          });

          // 判断是否删除成功
          if (res.code !== 0) return this.$message.error("删除分类失败！");
          this.$message.success("删除分类成功！");
          this.initCateList();
        })
        .catch((err) => err);
    }

  },
  created () {
    // 页面加载就调用初始化函数
    this.initCateList()
  }
}
</script>

<style lang="less" scoped>
.header-box {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
