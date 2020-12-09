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
              <el-option v-for="item in categoryOptions" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
          </div>
          <div class="article-photo">
            <label>封面</label>
            <el-upload action="https://jsonplaceholder.typicode.com/posts/" :on-preview="handlePreview" :on-remove="handleRemove" :file-list="fileList" list-type="picture" :limit="1" :on-success="handleSuccess" :on-error="handleError">
              <el-button size="small" type="primary">点击上传</el-button>
              <p slot="tip">只能上传jpg/png文件，且不超过500kb</p>
            </el-upload>
          </div>
          <div />
          <div class="article-tag">
            <label>标签</label>
            <el-tree :data="tagsList" show-checkbox node-key="id" default-expand-all :props="defaultProps" highlight-current @check="checkHandle" />
          </div>
          <div class="article-status">
            <el-button-group>
              <label>状态</label>
              <el-button size="small" @click="articleForm.status=1">发布</el-button>
              <el-button size="small" @click="articleForm.status=0">草稿</el-button>
            </el-button-group>
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
        status: 0
      },
      // 文件列表
      fileList: [],
      // 标签列表
      tagsList: [{
        id: 1,
        label: 'Java',
        children: [{
          id: 4,
          label: 'Java基础',
          children: [{
            id: 9,
            label: 'Java多线程'
          }, {
            id: 10,
            label: 'Java开发模式'
          }]
        }]
      }, {
        id: 2,
        label: '计算机科学',
        children: [{
          id: 5,
          label: '数据结构和算法'
        }, {
          id: 6,
          label: '操作系统'
        }]
      }, {
        id: 3,
        label: '其他文章',
        children: [{
          id: 7,
          label: '科研前线'
        }, {
          id: 8,
          label: '地方美食'
        }]
      }],
      // 树配置
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      // 文章分类
      categoryOptions: [
        {
          value: '1',
          label: '科技'
        },
        {
          value: '2',
          label: '学术'
        },
        {
          value: '3',
          label: '服装'
        },
        {
          value: '4',
          label: '美食'
        },
        {
          value: '5',
          label: '自然'
        }
      ]
    }
  },
  methods: {
    // 当移除文件 触发事件
    handleRemove (file, fileList) {
      this.fileList = fileList
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
    // 当选中树的复选框 触发事件
    checkHandle (dataNode, checkedNodes, currentNode) {
      this.articleForm.tagsId = checkedNodes.checkedKeys
    },
    // 提交表单数据
    submitHandle () {
      console.log(this.articleForm)
    },
    // 返回
    goBack () {
      this.$router.go(-1)
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
