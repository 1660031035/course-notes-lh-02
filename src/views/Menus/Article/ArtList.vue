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
              <el-option
                v-for="item in cateList"
                :key="item.id"
                :label="item.cate_name"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="发布状态" style="margin-left: 15px">
            <el-select v-model="q.state" placeholder="请选择状态" size="small">
              <el-option label="已发布" value="已发布"></el-option>
              <el-option label="草稿" value="草稿"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" size="small" @click="initCateList"
              >筛选</el-button
            >
            <el-button type="info" size="small" @click="resetList"
              >重置</el-button
            >
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
          @closed="closeResetForm"
        >
          <!-- 发布文章的对话框 -->
          <!-- 发布文章的表单结构 -->
          <el-form
            :model="pubForm"
            :rules="pubFormRules"
            ref="pubFormRef"
            label-width="100px"
          >
            <!-- 文章标题 -->
            <el-form-item label="文章标题" prop="title">
              <el-input
                v-model="pubForm.title"
                placeholder="请输入标题"
              ></el-input>
            </el-form-item>
            <!-- 文章分类 -->
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
            <!-- 文章封面 -->
            <el-form-item label="文章封面">
              <!-- 用来显示封面的图片 -->
              <img
                src="../../../assets/images/cover.jpg"
                alt=""
                class="cover-img"
                ref="imgRef"
              />
              <br />
              <!-- 文件选择框，默认被隐藏 -->
              <input
                type="file"
                style="display: none"
                accept="image/*"
                ref="iptFile"
                @change="onChangeFlie"
              />
              <!-- 选择封面的按钮 -->
              <el-button type="text" @click="$refs.iptFile.click()"
                >+ 选择封面</el-button
              >
            </el-form-item>
            <el-button type="primary" @click="pubArticle('已发布')"
              >发布文章</el-button
            >
            <el-button type="info" @click="pubArticle('草稿')"
              >存为草稿</el-button
            >
          </el-form>
        </el-dialog>
        <!-- 发表文章对话框end -->
      </div>

      <!-- 文章表格区域 -->
      <el-table :data="articleList" style="width: 100%">
        <el-table-column prop="title" label="文章标题">
          <template v-slot="{ row }">
            <el-link type="primary" @click="showDetail(row.id)">{{
              row.title
            }}</el-link>
          </template>
        </el-table-column>
        <el-table-column prop="cate_name" label="文章分类"> </el-table-column>
        <el-table-column prop="pub_date" label="发表时间">
          <template v-slot="{ row }">
            {{ formDate(row.pub_date) }}
          </template>
        </el-table-column>
        <el-table-column prop="state" label="状态"> </el-table-column>
        <el-table-column label="操作">
          <template v-slot="{ row }">
            <el-button type="danger" size="mini" @click="remove(row.id)"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页区域 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="q.pagenum"
        :page-sizes="[2, 3, 5, 10]"
        :page-size="q.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
      <!-- 文章详情对话框 -->
      <!-- 查看文章详情的对话框0 -->
      <el-dialog
        :title="artDetail.title"
        :visible.sync="detailVisible"
        width="80%"
      >
        <div class="info">
          <span>作者：{{ artDetail.nickname || artDetail.username }}</span>
          <span>发布时间：{{ formDate(artDetail.pub_date) }}</span>
          <span>所属分类：{{ artDetail.cate_name }}</span>
          <span>状态：{{ artDetail.state }}</span>
        </div>
        <!-- 分隔线 -->
        <el-divider></el-divider>
        <img
          :src="'http://big-event-vue-api-t.itheima.net' + artDetail.cover_img"
          alt=""
        />
        <div v-html="artDetail.content"></div>
      </el-dialog>
      <!-- 查看文章详情的对话框1 -->
    </el-card>
  </div>
</template>

<script>
// 导入封面图片
import defaultImg from '@/assets/images/cover.jpg'
// 导入day.js
import dayjs from 'dayjs'
// vue-cli 集中webpack 使用import from 导入一个图片时
// 会判断图片的大小,如果小于8kb,直接转化为base64的字符串 import后面是一个字符串
// 如果大于8kb,会生成一个单独的文件,import后面返回的是一个文件的路径
export default {
  name: 'ArtList',
  data () {
    return {
      // 文章详情对话框
      detailVisible: false,
      // 文章详情
      artDetail: [],
      // 存储文章总条数
      total: 0,
      // 文章列表
      articleList: [],
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
        content: '',
        //文章封面
        cover_img: null,
        // 发布或者存为草稿
        state: '' // 值只能是已发布或者存为草稿

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
    // 重置筛选
    resetList () {
      this.q = {
        pagenum: 1,
        pagesize: 2,
        cate_id: '',
        state: ''
      }
      this.initCateList()
    },
    // 关闭事件的处理函数
    async handleClose (done) {
      // 询问用户是否确认关闭对话框
      const confirmResult = await this.$confirm('此操作将导致文章信息丢失, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
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
    },
    // 展示封面
    // 选择图片 + 获取图片 + 保存图片到程序内存 + 展示图片
    onChangeFlie (e) {
      const files = e.target.files
      // 如果选择了图片
      if (files.length > 0) {
        this.pubForm.cover_img = files[0]
        const url = URL.createObjectURL(files[0])
        this.$refs.imgRef.setAttribute('src', url)
        // 第二次上传无法触发onchange事件
        // 清空value值
        e.target.value = ''
      } else {
        // 没有选择图片
        this.pubForm.cover_img = null
        this.$refs.imgRef.setAttribute('src', defaultImg)
      }

    },
    // 已发布或者存为草稿
    // 注册事件处理函数 + 表单校验
    pubArticle (state) {
      this.pubForm.state = state
      // 表单校验
      this.$refs.pubFormRef.validate(async valid => {
        if (!valid) return this.$message.error('请完善信息!')
        if (this.pubForm.cover_img === null) return this.$message.error('请上传封面!')
        // FormData 网络传输数据的一种格式
        const fd = new FormData()
        Object.keys(this.pubForm).forEach(key => {
          fd.append(key, this.pubForm[key])
        })
        /* fd.forEach(function (value,key) {
          console.log(key,'-------', value);
        }) */
        // 发送请求
        const { data: res } = await this.$http.post('/my/article/add', fd)
        if (res.code !== 0) return this.$message.error(res.message)
        this.$message.success(res.message)
        // 关闭对话框
        this.$refs.imgRef.setAttribute('src', defaultImg)
        console.log(222)
        this.pubDialogVisible = false


        // 重新获取列表
        this.initCateList()
      })
    },
    // 获取文章列表数据
    async initCateList () {
      const { data: res } = await this.$http.get('/my/article/list', {
        params: this.q
      })
      if (res.code === 0) {
        this.articleList = res.data
        // 页数
        this.total = res.total
      }

    },
    // 格式化时间函数
    formDate (time) {
      return dayjs(time).format('YYYY-MM-DD HH:mm:ss')
    },
    //重置表单
    closeResetForm () {
      // 只能重置带有prop属性的表单
      this.$refs.pubFormRef.resetFields()
      // 清空封面 + 发布状态
      this.pubForm.cover_img = null
      this.$refs.imgRef.setAttribute('src', defaultImg)
      this.pubForm.state = ''
    },
    // 切换每页条数时触发
    handleSizeChange (val) {
      // console.log(`每页 ${val} 条`);
      this.q.pagenum = 1
      this.q.pagesize = val
      // 重新渲染列表
      this.initCateList()
    },
    // 切换当前页数时触发
    handleCurrentChange (val) {
      // console.log(`当前页: ${val}`);
      this.q.pagenum = val
      // 重新渲染列表
      this.initCateList()
    },
    // 点击标题显示详情
    // 发送请求获取数据
    async showDetail (id) {
      const { data: res } = await this.$http.get('/my/article/info', {
        params: { id }
      })
      if (res.code === 0) {
        // console.log(res)
        this.artDetail = res.data
        // 打开对话框
        this.detailVisible = true
      }
    },
    // 删除文章详情
    // 根据 id 删除文章
    remove (id) {
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        // 删除成功
        const { data: res } = await this.$http.delete('/my/article/info', {
          params: { id }
        })
        if (res.code !== 0) return this.$message.error(res.message)
        this.$message.success(res.message)
        // 如果在刷新数据之前,当前页的数据只有 1 条，
        // 而且，当前的页码值 > 1，
        // 则说明当前页已没有数据可显示，需要让页码值 -1
        if (this.articleList.length === 1 && this.q.pagenum > 1) {
          this.q.pagenum--
        }
        // 重新获取列表
        this.initCateList()
      }).catch(() => {
        // 删除失败
      })
    }
  },
  created () {
    // 调用初始化函数
    this.initArtList()
    // 调用初始化列表
    this.initCateList()
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
// 设置图片封面的宽高
.cover-img {
  width: 400px;
  height: 280px;
  object-fit: cover;
}
// 分页样式
.el-pagination {
  margin-top: 15px;
}
// 美化文章详情ui结构
.title {
  font-size: 24px;
  text-align: center;
  font-weight: normal;
  color: #000;
  margin: 0 0 10px 0;
}

.info {
  font-size: 12px;
  span {
    margin-right: 20px;
  }
}
</style>
