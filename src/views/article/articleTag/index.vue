<template>
  <div class="article-tag-container el-row">
    <div v-show="showTagForm" class="article-tag-card el-col-9 el-col-xs-24 el-col-sm-24 el-col-md-9 el-col-lg-9 el-col-xl-9">
      <el-card class="card-content" shadow="hover">
        <div slot="header" class="clearfix">
          <b>{{ isEdit ? "修改标签" : "添加标签" }}</b>
          <el-button style="float: right; padding: 3px 0" type="text" icon="el-icon-close" @click="showTagForm = false" />
        </div>
        <el-form ref="articleTagForm" label-position="top" :rules="articleTagFormRules" label-width="80px" :model="articleTagForm">
          <el-form-item label="名称" prop="name">
            <el-input v-model="articleTagForm.name" placeholder="请输入标签名称" />
          </el-form-item>
        </el-form>
        <div class="button-box">
          <el-button type="primary" size="small" @click="submitHandle">{{
            isEdit ? "确认修改" : "确认添加"
          }}</el-button>
          <el-button v-show="isEdit" style="marginLeft:20px" icon="el-icon-document-add" type="success" size="small" @click="resetFormData">返回添加</el-button>
          <el-button v-show="isEdit" style="marginLeft:20px" icon="el-icon-delete" type="danger" size="small" @click="handleClose(articleTagForm.id)">永久删除</el-button>
        </div>
      </el-card>
    </div>
    <div v-show="showTagList" class="article-tag-card el-col-15 el-col-xs-24 el-col-sm-24 el-col-md-15 el-col-lg-15 el-col-xl-15">
      <el-card class="card-content" shadow="hover">
        <div slot="header" class="clearfix">
          <b>所有标签</b>
          <el-button style="float: right; padding: 3px 0" type="text" icon="el-icon-close" @click="showTagList = false" />
        </div>
        <div>
          <el-tag v-for="item in articleTags" :key="item.id" effect="plain" :disable-transitions="false" @click="handleEdit(item)">
            {{ item.name }}
          </el-tag>
        </div>
        <div class="pager-box">
          <el-pagination
            :prev-text="text1"
            :next-text="text2"
            :current-page="page"
            :page-sizes="[50, 100, 200, 500]"
            :pager-count="5"
            hide-on-single-page
            :page-size="pageSize"
            :layout="paginationLayout"
            :total="total"
            background
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
          />
        </div>
      </el-card>
    </div>
  </div>
</template>

<script>
import articleApi from '@/api/article'
const defaultArticleTagForm = {
  name: ''
}
export default {
  data () {
    return {
      // 标签表单
      articleTagForm: JSON.parse(JSON.stringify(defaultArticleTagForm)),
      // 标签表单校验规则
      articleTagFormRules: {
        name: [
          { required: true, message: '请输入标签名称', trigger: 'blur' },
          { min: 2, max: 5, message: '长度在 2 到 5 个字符', trigger: 'blur' }
        ]
      },
      // 标签数据
      articleTags: [],
      // 显示/隐藏标签表单卡片
      showTagForm: true,
      // 显示/隐藏标签列表卡片
      showTagList: true,
      // 当前页
      page: 1,
      // 当前页记录条数
      pageSize: 50,
      // 数据总数
      total: 100,
      // 分页组件布局
      paginationLayout: 'total, prev, pager, next, sizes, jumper',
      // 替代图标显示的上一页文字
      text1: '',
      // 替代图标显示的下一页文字
      text2: ''
    }
  },
  computed: {
    // 是否为编辑状态
    isEdit: {
      get () {
        return this.articleTagForm.id != null
      }
    }
  },
  watch: {
    showTagForm () {
      if (!this.showTagForm && !this.showTagList) {
        this.$router.go(-1)
      }
    },
    showTagList () {
      if (!this.showTagForm && !this.showTagList) {
        this.$router.go(-1)
      }
    }
  },
  created () {
    this.getTagList()
    // 根据窗口大小获取分页配置
    this.getPaginationOptions()
    // 窗口大小改变触发事件
    this.windowResizeHandle()
  },
  methods: {
    // 窗口大小改变触发事件
    windowResizeHandle () {
      window.addEventListener('resize', () => {
        this.getPaginationOptions()
      })
    },
    // 根据窗口大小获取分页配置
    getPaginationOptions () {
      const flag = window.document.body.clientWidth < 750
      if (flag) {
        this.paginationLayout = 'total, prev,next, jumper'
        this.text1 = '上一页'
        this.text2 = '下一页'
      } else {
        this.paginationLayout = 'total, prev, pager, next, sizes, jumper'
        this.text1 = ''
        this.text2 = ''
      }
    },
    // 获取标签列表
    async getTagList () {
      const res = await articleApi.getTagList({
        page: this.page,
        pageSize: this.pageSize
      })
      if (res.code === 20000) {
        this.articleTags = res.data.data
        this.total = res.data.total
      } else {
        this.$message.error('标签列表获取失败！')
      }
    },
    // 当每页显示记录总数发生改变时 触发事件
    handleSizeChange (val) {
      this.pageSize = val
      this.getTagList()
    },
    // 当前页发生改变时 触发事件
    handleCurrentChange (val) {
      this.page = val
      this.getTagList()
    },
    // 当点击标签时 触发事件
    handleEdit (data) {
      this.articleTagForm = JSON.parse(JSON.stringify(data))
    },
    // 重置表单数据
    resetFormData () {
      this.page = 1
      this.articleTagForm = JSON.parse(JSON.stringify(defaultArticleTagForm))
    },
    // 删除标签
    handleClose (id) {
      this.$confirm('此操作将永久删除该标签, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        center: true
      })
        .then(async () => {
          const res = await articleApi.deleteTagData(id)
          if (res.code === 20000) {
            this.resetFormData()
            this.getTagList()
            this.$message.success('删除成功！')
          } else {
            this.$message.error('删除失败！')
          }
        })
        .catch(() => {
          this.$message.info('已取消删除！')
        })
    },
    // 提交表单
    submitHandle () {
      this.$refs.articleTagForm.validate(async valid => {
        if (valid) {
          if (this.isEdit) {
            const res = await articleApi.editTagData(this.articleTagForm)
            if (res.code === 20000) {
              this.resetFormData()
              this.getTagList()
              this.$message.success('修改成功！')
            } else {
              this.$message.error('修改失败！')
            }
          } else {
            const res = await articleApi.addTagData(this.articleTagForm)
            if (res.status === 1) {
              this.resetFormData()
              this.getTagList()
              this.$message.success('新增成功！')
            } else {
              this.$message.error('新增失败！' + res.msg)
            }
          }
        }
      })
    }
  }
}
</script>

<style lang="scss">
.article-tag {
  &-card {
    padding: 10px;
    .card-content {
      padding: 16px;
      .el-tag {
        margin: 10px 15px 0 0;
        cursor: pointer;
      }
      .el-tag:hover {
        background-color: #eee;
      }
    }
    .pager-box {
      margin-top: 15px;
      display: flex;
      justify-content: flex-end;
    }
  }
}
</style>
