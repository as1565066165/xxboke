<template>
  <div class="article-add-container">
    <el-card class="article-add-card" shadow="hover">
      <div slot="header" class="clearfix">
        <b>编撰文章</b>
        <el-button style="float: right; padding: 3px 0" type="text" icon="el-icon-close" @click="goBack" />
      </div>
      <div class="card-content el-row" :gutter="20">
        <div style="padding-left: 10px; padding-right: 10px;" class="el-col-16 el-col-xs-24 el-col-sm-24 el-col-md-15 el-col-lg-16 el-col-xl-16">
          <div class="article-title">
            <label for="article-title-input">标题</label>
            <el-input id="article-title-input" v-model="articleForm.title" placeholder="文章标题" />
          </div>
          <div class="article-content">
            <label>内容</label>
            <my-editor class="my-editor" :editor-content.sync="articleForm.content" />
          </div>
        </div>
        <div style="padding-left: 10px; padding-right: 10px;" class="el-col-8 el-col-xs-24 el-col-sm-24 el-col-md-9 el-col-lg-8 el-col-xl-8">
          <div class="article-category">
            <label>分类</label>
            <el-select v-model="articleForm.categoryId" placeholder="请选择" style="width:100%">
              <el-option v-for="item in categoryOptions" :key="item.id" :label="item.name" :value="item.id" />
            </el-select>
          </div>
          <div class="article-status">
            <label>状态</label>
            <el-select v-model="articleForm.status" size="medium" placeholder="请选择" style="width:100%">
              <el-option v-for="item in articleStatusList" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
          </div>
          <div class="article-photo">
            <label>封面</label>
            <el-upload action="https://jsonplaceholder.typicode.com/posts/" accept="image/png,image/jpeg" :on-preview="handlePreview" :on-remove="handleRemove" :before-upload="beforeUpload" :file-list="fileList" list-type="picture" :limit="1" :on-success="handleSuccess" :on-error="handleError">
              <el-button size="small" type="primary">点击上传</el-button>
              <p slot="tip">只能上传jpg/png文件，且不超过500kb</p>
            </el-upload>
          </div>
          <div />
          <div class="article-tag">
            <label>标签</label>
            <el-select v-model="tagId" size="medium" placeholder="请选择" style="width:100%" @change="handleSelectChange">
              <el-option v-for="item in tagsList" :key="item.id" :label="item.name" :value="item.id" />
            </el-select>
            <div v-show="choosedTagList.length" class="tag-box">
              <el-tag v-for="item in choosedTagList" :key="item.id" effect="plain" closable @close="handleClose(item.id)">{{ item.name }}</el-tag>
            </div>
          </div>
        </div>
      </div>
    </el-card>
    <el-card class="submit-button-box" shadow="hover">
      <el-button size="small" type="primary" @click="submitHandle">{{ articleForm.status?'发布':'保存' }}
      </el-button>
      <el-button size="small" @click="goBack">返回
      </el-button>
    </el-card>
  </div>
</template>

<script>
import myEditor from './components/myEditor.vue'
import articleApi from '@/api/article'
export default {
  components: {
    myEditor
  },
  data () {
    return {
      // 文章表单数据
      articleForm: {
        // 文章标题
        title: '',
        // 文章分类id
        categoryId: '',
        // 文章内容
        content: '',
        // 文章标签Id
        tagsId: [],
        // 封面图片id
        uid: '',
        // 文章状态
        status: ''
      },
      // 文章状态列表
      articleStatusList: [],
      // 文件列表
      fileList: [],
      // 标签id
      tagId: '',
      // 标签列表
      tagsList: [],
      // 被选中的标签列表
      // choosedTagList: [],
      // 文章分类
      categoryOptions: []
    }
  },
  computed: {
    choosedTagList: {
      // eslint-disable-next-line vue/return-in-computed-property
      get () {
        if (this.articleForm.tagsId) {
          const arr = []
          this.articleForm.tagsId.forEach(item => {
            this.tagsList.some(item1 => {
              if (item1.id === item) {
                arr.push(item1)
              }
            })
          })
          return arr
        } else {
          return []
        }
      }
    }
  },
  created () {
    const id = this.$route.query.articleId
    if (id) {
      this.queryArticleDataById(id)
    }
    // 获取分类列表
    this.getCategoryData()
    // 获取文章状态列表
    this.getArticleStatusList()
    // 获取标签列表
    this.getTagList()
  },
  methods: {
    // 获取分类表格数据
    async getCategoryData () {
      const res = await articleApi.getCategoryTableData()
      if (res.code === 20000) {
        this.categoryOptions = res.data
      } else {
        this.$message.error('分类表格数据获取失败！')
      }
    },
    // 获取文章状态列表
    async getArticleStatusList () {
      const res = await articleApi.getArticleStatusList()
      if (res.code === 20000) {
        this.articleStatusList = res.data
      } else {
        this.$message.error('文章状态列表获取失败！')
      }
    },
    // 获取所有标签列表
    async getTagList () {
      const res = await articleApi.getTagList()
      if (res.code === 20000) {
        this.tagsList = res.data.data
      } else {
        this.$message.error('标签列表获取失败！')
      }
    },
    // 根据文章id查询文章数据
    async queryArticleDataById (id) {
      const res = await articleApi.queryArticleDataById(id)
      if (res.code === 20000) {
        this.articleForm = res.data
        console.log(this.articleForm)
      } else {
        this.$message.error('文章数据获取失败！')
      }
    },
    // 当移除文件 触发事件
    handleRemove (file, fileList) {
      this.fileList = fileList
    },
    // 上传文件时的钩子 限制文件格式和大小
    beforeUpload (file) {
      const isPhoto = file.type === 'image/jpeg' || file.type === 'image/png'
      const isLimit = file.size / 1024 < 500
      if (!isPhoto) {
        this.$message.error('只能上传 jpg/png 图片!')
      }
      if (!isLimit) {
        this.$message.error('上传图片大小不能超过 500KB!')
      }
      return isPhoto && isLimit
    },
    // 当选中文件 触发事件
    handlePreview (file) {
      console.log(file)
    },
    // 当文件上传成功 触发事件
    handleSuccess (resp, file, fileList) {
      this.fileList = fileList
    },
    // 当文件上传失败触发事件
    handleError (err, file, fileList) {
      this.$message.error(err)
    },
    // 提交表单数据
    submitHandle () {
      console.log(this.articleForm)
    },
    // 返回
    goBack () {
      this.$router.go(-1)
    },
    // 当标签下拉框的选项改变时 触发事件
    handleSelectChange (id) {
      // 如果没有则添加
      const isOnly = !this.articleForm.tagsId.some(item => item === id)
      if (isOnly) {
        this.articleForm.tagsId.push(id)
      }
      // if (isOnly) {
      //   this.articleForm.tagsId.push(id)
      //   this.tagsList.some(item => {
      //     if (item.id === id) {
      //       this.choosedTagList.push(item)
      //     }
      //   })
      // }
    },
    // 当点击了标签的删除按钮 触发事件
    handleClose (id) {
      this.articleForm.tagsId.some((item, index) => {
        if (item === id) {
          this.articleForm.tagsId.splice(index, 1)
        }
      })
      this.choosedTagList.some((item, index) => {
        if (item.id === id) {
          this.choosedTagList.splice(index, 1)
        }
      })
    }
  }
}
</script>

<style lang="scss">
.article-add {
  // &-container {
  //   padding: 10px;
  // }
  &-card {
    margin: 10px 10px 55px 10px;
    padding: 16px;
    .el-form-item__content {
      line-height: 0;
    }
    label {
      display: block;
      font-size: 14px;
      color: #606266;
      font-weight: 600;
      font-size: 14px;
      line-height: 40px;
      padding: 0 12px 0 0;
      box-sizing: border-box;
    }
    .article-tag {
      .tag-box {
        margin-top: 10px;
        padding: 5px;
        border-top: 1px solid #dcdfe6;
        // border-radius: 5px;
        .el-tag {
          margin: 10px 10px 0 0;
        }
        .el-tag:hover {
          background-color: #eee;
        }
      }
    }
  }
}
.submit-button-box {
  position: fixed;
  width: 100%;
  bottom: 0;
  padding: 10px 15px;
  > button {
    width: 112px;
  }
}
</style>
