<template>
  <div>
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>文章列表</span>
      </div>
      <!-- 搜索区域 -->
      <div class="search-box">
        <el-form :inline="true" :model="q">
          <el-form-item label="文章分类">
            <el-select
              v-model="q.cate_id"
              placeholder="请选择分类"
              size="small"
            >
              <el-option label="区域一" value="shanghai"></el-option>
              <el-option label="区域二" value="beijing"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="发布状态" style="margin-left: 15px">
            <el-select v-model="q.state" placeholder="请选择状态" size="small">
              <el-option label="已发布" value="已发布"></el-option>
              <el-option label="草稿" value="草稿"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" size="small">筛选</el-button>
            <el-button type="info" size="small">重置</el-button>
          </el-form-item>
        </el-form>
        <!-- 发表文章的按钮 -->
        <el-button
          type="primary"
          size="small"
          class="btn-pub"
          @click="pubDialogVisible = true"
          >发表文章</el-button
        >
        <!-- 发表文件对话框 -->
        <!-- 发表文章对话框start -->
        <el-dialog
          title="发表文章"
          :visible.sync="pubDialogVisible"
          fullscreen
          :before-close="handleClose"
        >
          <!-- 发布文章的对话框 -->
          <!-- 发布文章的表单结构 -->
          <el-form
            :model="pubForm"
            :rules="pubFormRules"
            ref="pubFormRef"
            label-width="100px"
          >
            <el-form-item label="文章标题" prop="title">
              <el-input
                v-model="pubForm.title"
                placeholder="请输入标题"
              ></el-input>
            </el-form-item>
            <el-form-item label="文章分类" prop="cate_id">
              <el-select
                v-model="pubForm.cate_id"
                placeholder="请选择分类"
                style="width: 100%"
              >
                <el-option
                  v-for="item in cateList"
                  :key="item.id"
                  :label="item.cate_name"
                  :value="item.id"
                ></el-option>
              </el-select>
            </el-form-item>
            <!-- 文章内容 富文本编辑器 -->
            <el-form-item label="文章内容" prop="content">
              <quill-editor v-model="pubForm.content"></quill-editor>
            </el-form-item>

          </el-form>
        </el-dialog>
        <!-- 发表文章对话框end -->
      </div>

      <!-- 文章表格区域 -->

      <!-- 分页区域 -->
    </el-card>
  </div>
</template>

<script>
export default {
  name: 'ArtList',
  data () {
    return {
      //文章分类
      cateList: [],
      // 查询参数对象
      q: {
        pagenum: 1,
        pagesize: 2,
        cate_id: '',
        state: ''
      },
      // 控制发表文章对话框的显示与隐藏
      pubDialogVisible: false,
      // 表单的数据对象
      pubForm: {
        title: '',
        cate_id: '',
        // 文章的内容
        content: ''
      },
      // 表单的验证规则对象
      pubFormRules: {
        title: [
          { required: true, message: '请输入文章标题', trigger: 'blur' },
          { min: 1, max: 30, message: '文章标题的长度为1-30个字符', trigger: 'blur' }
        ],
        cate_id: [{ required: true, message: '请选择文章分类', trigger: 'change' }],
        content: [
          { required: true, message: "请输入文章内容", trigger: "blur" },
        ]
      }
    }
  },
  methods: {
    // 关闭事件的处理函数
    // 关闭事件的处理函数
    async handleClose (done) {
      // 询问用户是否确认关闭对话框
      const confirmResult = await this.$confirm('此操作将导致文章信息丢失, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)

      // 取消了关闭
      if (confirmResult === 'cancel') return
      // 确认关闭
      done()
    },
    // 初始化文章分类的列表
    async initArtList () {
      const { data: res } = await this.$http.get('/my/cate/list')
      if (res.code === 0) {
        this.cateList = res.data
      }
    }
  },
  created () {
    // 调用初始化函数
    this.initArtList()
  }
}
</script>

<style lang="less" scoped>
.search-box {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  .btn-pub {
    margin-top: 5px;
  }
}
// 设置富文本编辑器的默认最小高度
/deep/ .ql-editor {
  min-height: 300px;
}
</style>
