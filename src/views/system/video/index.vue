<template>
  <div class="system-video-container el-row">
    <div v-show="showVideoForm" class="system-video-card el-col-8 el-col-xs-24 el-col-sm-24 el-col-md-8 el-col-lg-8 el-col-xl-8">
      <el-card shadow="hover" class="card-content">
        <div slot="header" class="clearfix">
          <b>{{ isEdit?'编辑视频流':'添加视频流' }}</b>
          <el-button style="float: right; padding: 3px 0" type="text" icon="el-icon-close" @click="showVideoForm=false" />
        </div>
        <el-form ref="videoForm" label-position="top" :rules="videoFormRules" label-width="80px" :model="videoForm">
          <el-form-item label="名称" prop="name">
            <el-input v-model="videoForm.name" placeholder="请输入视频流名称" />
          </el-form-item>
          <el-form-item label="地址" prop="url">
            <el-input v-model="videoForm.url" placeholder="请输入视频流地址" />
            <el-button class="icon-a" title="在下面显示视频流" type="text" @click="showVideoHandle">测试视频流</el-button>
          </el-form-item>
          <el-form-item label="描述" prop="desc">
            <el-input v-model="videoForm.desc" type="textarea" placeholder="请输入视频流的描述" maxlength="300" show-word-limit :autosize="{ minRows: 4, maxRows: 6}" />
          </el-form-item>
          <el-form-item v-if="showVideo" label="显示">
            <my-video :video-url="videoUrl" />
          </el-form-item>
        </el-form>
        <div class="button-box">
          <el-button :loading="loading" type="primary" size="small" @click="submitHandle">{{ isEdit?'修改':'添加' }}</el-button>
          <el-button v-show="isEdit" style="marginLeft:20px" icon="el-icon-document-add" type="success" size="small" @click="resetFormData">新增视频流</el-button>
        </div>
      </el-card>
    </div>
    <div v-show="showVideoTable" class="system-video-card el-col-16 el-col-xs-24 el-col-sm-24 el-col-md-16 el-col-lg-16 el-col-xl-16">
      <el-card shadow="hover" class="card-content">
        <div slot="header" class="clearfix">
          <b>视频流表格</b>
          <el-button style="float: right; padding: 3px 0" type="text" icon="el-icon-close" @click="showVideoTable=false" />
        </div>
        <el-alert v-show="showAlert" :title="'已选中 '+choosedTotol+' 项'" type="warning" close-text="删除" @close="deleteVideoData(deleteVideoId)" />
        <el-table ref="categoryTable" v-loading="listLoading" :data="videoTableData" tooltip-effect="dark" style="width: 100%" @selection-change="handleSelectionChange">
          <el-table-column type="selection" width="55" />
          <el-table-column prop="name" label="名称" width="120" />
          <el-table-column prop="url" label="地址" show-overflow-tooltip />
          <el-table-column prop="desc" label="描述" show-overflow-tooltip />
          <el-table-column label="操作" fixed="right" width="100">
            <template v-slot="{row}">
              <el-button type="text" @click="editVideoData(row)">编辑</el-button>
              <el-button type="text" @click="deleteVideoData(row.id)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-card>
    </div>
  </div>
</template>

<script>
import systemApi from '@/api/system'
import myVideo from './components/myVideo.vue'

const defaultVideoForm = {
  name: '',
  url: '',
  desc: ''
}
export default {
  components: {
    myVideo
  },
  data () {
    return {
      // 视频流表单
      videoForm: JSON.parse(JSON.stringify(defaultVideoForm)),
      // 视频流表单校验规则
      videoFormRules: {
        name: [
          { required: true, message: '请输入视频流名称', trigger: 'blur' }
        ],
        url: [
          { required: true, message: '请输入视频流地址', trigger: 'blur' }
        ],
        desc: [
          { required: true, message: '请输入视频流描述', trigger: 'blur' }
        ]
      },
      // 是否loading加载表格数据
      listLoading: true,
      // 视频流表格数据
      videoTableData: [],
      // 删除视频流id
      deleteVideoId: [],
      // 是否显示Alert提示框
      showAlert: false,
      // 是否显示视频流表格
      showVideoTable: true,
      // 是否显示视频流表单
      showVideoForm: true,
      // 是否在加载
      loading: false,
      // 视频地址
      videoUrl: ''
    }
  },
  computed: {
    // 当前选中的数据条数
    choosedTotol: {
      get () {
        return this.deleteVideoId.length
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
        return this.videoForm.id != null
      }
    },
    // 是否显示视频
    showVideo: {
      get () {
        return this.videoUrl !== ''
      }
    }
  },
  watch: {
    showVideoTable () {
      if (!this.showVideoTable && !this.showVideoForm) {
        this.$router.go(-1)
      }
    },
    showVideoForm () {
      if (!this.showVideoTable && !this.showVideoForm) {
        this.$router.go(-1)
      }
    }
  },
  created () {
    // 获取视频流表格数据
    this.getVideoList()
  },
  methods: {
    // 获取视频流表格数据
    async getVideoList () {
      this.listLoading = true
      const res = await systemApi.getVideoList()
      if (res.code === 20000) {
        this.videoTableData = res.data.data
      } else {
        this.$message.error('视频流表格数据获取失败！')
      }
      this.listLoading = false
    },
    // 重置表单
    resetFormData () {
      this.videoUrl = ''
      this.videoForm = JSON.parse(JSON.stringify(defaultVideoForm))
    },
    // 返回
    goBack () {
      this.$router.go(-1)
    },
    // 提交表单
    submitHandle () {
      this.$refs.videoForm.validate(async (valid) => {
        if (valid) {
          this.loading = true
          let res
          if (this.videoForm.id) {
            res = await systemApi.editVideoData(this.videoForm)
          } else {
            res = await systemApi.addVideoData(this.videoForm)
          }
          if (res.code === 20000) {
            this.getVideoList()
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
      this.deleteVideoId = ids
    },
    // 编辑分类数据
    editVideoData (row) {
      this.videoForm = JSON.parse(JSON.stringify(row))
    },
    // 删除分类数据
    deleteVideoData (id) {
      this.$confirm('此操作将永久删除该数据, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        const res = await systemApi.deleteVideoData(id)
        if (res.code === 20000) {
          this.getVideoList()
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
      this.videoForm.link = data.id
    },
    showVideoHandle () {
      this.videoUrl = this.videoForm.url
    }
  }
}
</script>

<style lang="scss">
.system-video {
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
