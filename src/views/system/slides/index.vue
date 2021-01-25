<template>
  <div class="system-slides-container el-row">
    <div v-show="showSlideForm" class="system-slides-card el-col-8 el-col-xs-24 el-col-sm-24 el-col-md-8 el-col-lg-8 el-col-xl-8">
      <el-card shadow="hover" class="card-content">
        <div slot="header" class="clearfix">
          <b>{{ isEdit?'编辑轮播图':'添加轮播图' }}</b>
          <el-button style="float: right; padding: 3px 0" type="text" icon="el-icon-close" @click="showSlideForm=false" />
        </div>
        <el-form ref="slideForm" label-position="top" :rules="slideFormRules" label-width="80px" :model="slideForm">
          <el-form-item label="标题" prop="title">
            <el-input v-model="slideForm.title" placeholder="请输入轮播图片标题" />
          </el-form-item>
          <el-form-item label="链接" prop="link">
            <el-input v-model="slideForm.link" placeholder="请输入文章id链接" />
            <el-button class="icon-a" title="打开文章列表选择链接" type="text" @click="showLinkDialog=true">链接传送门</el-button>
          </el-form-item>
          <el-form-item label="图片" prop="imgUrl">
            <el-upload class="slide-uploader" action="https://jsonplaceholder.typicode.com/posts/" :show-file-list="false" :on-success="handleSlideSuccess" :before-upload="beforeSlideUpload">
              <img v-if="slideForm.imgUrl" :src="slideForm.imgUrl" class="slide">
              <i v-else class="el-icon-plus slide-uploader-icon" />
            </el-upload>
          </el-form-item>
        </el-form>
        <div class="button-box">
          <el-button :loading="loading" type="primary" size="small" @click="submitHandle">{{ isEdit?'修改':'添加' }}</el-button>
          <el-button v-show="isEdit" style="marginLeft:20px" icon="el-icon-document-add" type="success" size="small" @click="resetFormData">新增轮播图</el-button>
        </div>
      </el-card>
    </div>
    <div v-show="showSlideTable" class="system-slides-card el-col-16 el-col-xs-24 el-col-sm-24 el-col-md-16 el-col-lg-16 el-col-xl-16">
      <el-card shadow="hover" class="card-content">
        <div slot="header" class="clearfix">
          <b>轮播图表格</b>
          <el-button style="float: right; padding: 3px 0" type="text" icon="el-icon-close" @click="showSlideTable=false" />
        </div>
        <el-alert v-show="showAlert" :title="'已选中 '+choosedTotol+' 项'" type="warning" close-text="删除" @close="deleteSlideData(deleteSlideId)" />
        <el-table ref="categoryTable" v-loading="listLoading" :data="slideTableData" tooltip-effect="dark" style="width: 100%" @selection-change="handleSelectionChange">
          <el-table-column type="selection" width="55" />
          <el-table-column label="图片" align="center" width="200">
            <template v-slot="{row}">
              <img :src="row.imgUrl" alt="" style="maxHeight:80px;width:auto">
            </template>
          </el-table-column>
          <el-table-column prop="title" label="标题" />
          <el-table-column prop="link" label="链接" width="200" />
          <el-table-column label="操作" fixed="right" width="100">
            <template v-slot="{row}">
              <el-button type="text" @click="editSlideData(row)">编辑</el-button>
              <el-button type="text" @click="deleteSlideData(row.id)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-card>
    </div>
    <link-dialog :visible.sync="showLinkDialog" @getCurrentArticleData="getCurrentArticleData" />
  </div>
</template>

<script>
import systemApi from '@/api/system'
import linkDialog from './components/linkDialog.vue'
const defaultSlideForm = {
  title: '',
  link: '',
  imgUrl: ''
}
export default {
  components: {
    linkDialog
  },
  data () {
    return {
      // 轮播图表单
      slideForm: JSON.parse(JSON.stringify(defaultSlideForm)),
      // 轮播图表单校验规则
      slideFormRules: {
        title: [
          { required: true, message: '请输入轮播图片标题', trigger: 'blur' }
        ],
        link: [
          { required: true, message: '请输入文章id链接', trigger: 'blur' }
        ],
        imgUrl: [
          { required: true, message: '请选择图片' }
        ]
      },
      // 是否loading加载表格数据
      listLoading: true,
      // 轮播图表格数据
      slideTableData: [],
      // 删除轮播图id
      deleteSlideId: [],
      // 是否显示Alert提示框
      showAlert: false,
      // 是否显示轮播表格
      showSlideTable: true,
      // 是否显示轮播表单
      showSlideForm: true,
      // 是否在加载
      loading: false,
      showLinkDialog: false
    }
  },
  computed: {
    // 当前选中的数据条数
    choosedTotol: {
      get () {
        return this.deleteSlideId.length
      },
      set (val) {
        if (val) {
          this.showAlert = true
        } else {
          this.showAlert = false
        }
      }
    },
    isEdit: {
      get () {
        return this.slideForm.id != null
      }
    }
  },
  watch: {
    showSlideTable () {
      if (!this.showSlideTable && !this.showSlideForm) {
        this.$router.go(-1)
      }
    },
    showSlideForm () {
      if (!this.showSlideTable && !this.showSlideForm) {
        this.$router.go(-1)
      }
    }
  },
  created () {
    // 获取轮播图表格数据
    this.getSlideList()
  },
  methods: {
    // 获取轮播图表格数据
    async getSlideList () {
      this.listLoading = true
      const res = await systemApi.getSlideList()
      if (res.code === 20000) {
        this.slideTableData = res.data.data
      } else {
        this.$message.error('轮播图表格数据获取失败！')
      }
      this.listLoading = false
    },
    // 用户头像上传成功钩子
    handleSlideSuccess (res, file) {
      this.slideForm.imgUrl = URL.createObjectURL(file.raw)
      console.log(file)
    },
    // 用户头像上传前的钩子
    beforeSlideUpload (file) {
      const isType = file.type === 'image/jpeg' || file.type === 'image/png'
      const isLt2M = file.size / 1024 / 1024 < 2
      if (!isType) {
        this.$message.error('上传头像图片只能是 JPG/PNG 格式!')
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!')
      }
      return isType && isLt2M
    },
    // 重置表单
    resetFormData () {
      this.slideForm = JSON.parse(JSON.stringify(defaultSlideForm))
    },
    // 返回
    goBack () {
      this.$router.go(-1)
    },
    // 提交表单
    submitHandle () {
      this.$refs.slideForm.validate(async (valid) => {
        if (valid) {
          this.loading = true
          let res
          if (this.slideForm.id) {
            res = await systemApi.editSlideData(this.slideForm)
          } else {
            res = await systemApi.addSlideData(this.slideForm)
          }
          if (res.code === 20000) {
            this.getSlideList()
            this.resetFormData()
            this.$message.success(res.msg)
          } else {
            this.$message.error('操作失败！')
          }
          this.loading = false
        }
      })
    },
    // 当多选框按钮被选中时 触发事件
    handleSelectionChange (selection) {
      this.choosedTotol = selection.length
      const ids = []
      selection.forEach(item => ids.push(item.id))
      this.deleteSlideId = ids
    },
    // 编辑分类数据
    editSlideData (row) {
      this.slideForm = JSON.parse(JSON.stringify(row))
    },
    // 删除分类数据
    deleteSlideData (id) {
      this.$confirm('此操作将永久删除该数据, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        const res = await systemApi.deleteSlideData(id)
        if (res.code === 20000) {
          this.getSlideList()
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
        } else {
          this.$message({
            type: 'error',
            message: '删除失败!'
          })
        }
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    // 当前选中文章数据
    getCurrentArticleData (data) {
      this.slideForm.link = data.id
    }
  }
}
</script>

<style lang="scss">
.system-slides {
  &-card {
    padding: 10px;
    .card-content {
      padding: 16px;
    }
    .el-form-item {
      padding: 0 10px;
    }
    .icon-a {
      color: #409eff;
    }
    .button-box {
      margin: 14px 10px;
    }
    .icon-span {
      display: inline-block;
      margin-left: 10px;
    }
  }
}
.slide-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.slide-uploader .el-upload:hover {
  border-color: #409eff;
}
.slide-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.slide {
  width: 178px;
  height: 178px;
  display: block;
}
</style>
