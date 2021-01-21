<template>
  <div class="comment-list-container">
    <el-card class="comment-list-card" shadow="hover">
      <div v-show="showSearchBox" class="comment-search-box el-row">
        <div class="comment-search-item el-col-6 el-col-xs-24 el-col-sm-24 el-col-md-6 el-col-lg-6 el-col-xl-6">内容：
          <el-input v-model="searchForm.content" prefix-icon="el-icon-search" size="medium" placeholder="根据评论内容模糊查询" :style="isActive?'width:calc(100% - 54px)':'width:calc(100% - 70px)'" />
        </div>
        <div class="comment-search-item el-col-6 el-col-xs-24 el-col-sm-24 el-col-md-6 el-col-lg-6 el-col-xl-6">类型：
          <el-select v-model="searchForm.type" size="medium" placeholder="请选择" :style="isActive?'width:calc(100% - 54px)':'width:calc(100% - 70px)'">
            <el-option v-for="item in commentTypesList" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </div>
        <div class="comment-search-item el-col-6 el-col-xs-24 el-col-sm-24 el-col-md-6 el-col-lg-6 el-col-xl-6">状态：
          <el-select v-model="searchForm.status" size="medium" placeholder="请选择" :style="isActive?'width:calc(100% - 54px)':'width:calc(100% - 70px)'">
            <el-option v-for="item in commentStatusList" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </div>
        <div class="el-col-6 el-col-xs-24 el-col-sm-24 el-col-md-6 el-col-lg-6 el-col-xl-6 ">
          <div class="search-button-box">
            <el-button type="primary" size="medium" @click="getCommentList">查询</el-button>
            <el-button size="medium" @click="resetData">重置</el-button>
          </div>
        </div>
      </div>
      <div class="funtion-button-box el-row">
        <el-button class="el-col-xs-24" icon="el-icon-delete" size="medium" @click="multDeleteCommentData">批量删除</el-button>
        <el-button :style="marginLeft" class="el-col-xs-24" icon="el-icon-refresh" size="medium" @click="$router.go(0)">刷新</el-button>
        <el-button :style="marginLeft" class="el-col-xs-24" :type="showSearchBox?'primary':'warning'" size="medium" plain @click="changeSearchBoxStatus">{{ showSearchBox?'关闭搜索':'开启搜索' }}</el-button>
        <el-button :style="marginLeft" class="el-col-xs-24" :type="showAlert?'danger':'success'" size="medium" plain @click="changeAlertStatus">{{ showAlert?'关闭提示':'开启提示' }}</el-button>
      </div>
      <el-alert v-show="showAlert" :title="'已选中 '+choosedTotol+' 项'" type="warning" :closable="false" />
      <div class="table-box">
        <el-table ref="multipleTable" v-loading="listLoading" :data="tableData" tooltip-effect="dark" style="width: 100%" border stripe @selection-change="handleSelectionChange">
          <el-table-column type="selection" width="70" fixed />
          <el-table-column prop="userName" width="80" label="用户" show-overflow-tooltip />
          <el-table-column prop="content" label="内容" show-overflow-tooltip />
          <el-table-column prop="articleName" label="所属文章" width="255" />
          <el-table-column prop="status" label="状态" width="80">
            <template v-slot="{row}">
              <div>
                <div v-if="row.status==='0'" class="tag-cell tag-cell-warning">待审核</div>
                <div v-else-if="row.status==='1'" class="tag-cell tag-cell-success">已通过</div>
                <div v-else class="tag-cell tag-cell-danger">回收站</div>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="createdTime" label="创建时间" width="180" show-overflow-tooltip />
          <el-table-column label="操作" fixed="right" width="100">
            <template v-slot="{row}">
              <el-button v-if="row.type==='1'" type="text" @click="showApprovalDialog(row)">审批</el-button>
              <el-button v-else type="text" @click="showApprovalDialog(row)">详情</el-button>
              <el-button type="text" @click="deleteCommentData(row.id)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="pager-box">
        <el-pagination :current-page="page" :page-sizes="[10, 20, 50, 100]" :page-size="pageSize" :layout="paginationLayout" :total="total" background :prev-text="text1" :next-text="text2" @size-change="handleSizeChange" @current-change="handleCurrentChange" />
      </div>
    </el-card>
    <!-- 审批对话框 -->
    <approval-dialog :visible.sync="isShowApprovalDialog" :data="approvalData" :dialog-width="dialogWidth" @getCommentList="getCommentList" />
  </div>
</template>

<script>
import commentApi from '@/api/comment'
import approvalDialog from './components/dialog/approvalDialog.vue'
export default {
  components: {
    approvalDialog
  },
  data () {
    return {
      // 搜索表单
      searchForm: {
        content: '',
        type: '',
        status: ''
      },
      // 评论类型列表
      commentTypesList: [],
      // 评论状态列表
      commentStatusList: [],
      // 表格数据
      tableData: [],
      // 是否loading加载表格数据
      listLoading: true,
      // 显示/隐藏搜索框
      showSearchBox: true,
      // 显示/隐藏提示框
      showAlert: true,
      // 当前选中的数据条数
      choosedTotol: 0,
      // 当前页
      page: 1,
      // 当前页显示数据条数
      pageSize: 10,
      // 数据总数
      total: 100,
      // 要删除的评论id数组
      deleteCommentId: [],
      // 是否显示审批对话框
      isShowApprovalDialog: false,
      // 审批数据
      approvalData: {},
      // 审批对话框的宽度
      dialogWidth: '60%',
      // 分页组件布局
      paginationLayout: 'total, prev, pager, next, sizes, jumper',
      // 替代图标显示的上一页文字
      text1: '',
      // 替代图标显示的下一页文字
      text2: '',
      // 按钮样式
      marginLeft: '',
      // 是否激活
      isActive: false
    }
  },
  created () {
    // 获取文章列表数据
    this.getCommentList()
    // 获取评论类型列表
    this.getCommentTypeList()
    // 获取评论状态列表
    this.getCommentStatusList()
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
      const flag = window.document.body.clientWidth < 768
      if (flag) {
        this.isActive = true
        this.dialogWidth = '80%'
        this.paginationLayout = 'total, prev,next, jumper'
        this.text1 = '上一页'
        this.text2 = '下一页'
        this.marginLeft = 'marginLeft:0px'
      } else {
        this.isActive = false
        this.dialogWidth = '60%'
        this.paginationLayout = 'total, prev, pager, next, sizes, jumper'
        this.text1 = ''
        this.text2 = ''
        this.marginLeft = ''
      }
    },
    // 获取评论列表数据
    async getCommentList () {
      this.listLoading = true
      const res = await commentApi.getCommentList({ page: this.page, pageSize: this.pageSize, ...this.searchForm })
      if (res.code === 20000) {
        this.tableData = res.data.data
        this.total = res.data.total
      } else {
        this.$message.error('评论列表数据获取失败！')
      }
      this.listLoading = false
    },
    // 获取评论类型列表
    async getCommentTypeList () {
      const res = await commentApi.getCommentTypeList()
      if (res.code === 20000) {
        this.commentTypesList = res.data
      } else {
        this.$message.error('评论类型列表获取失败！')
      }
    },
    // 获取评论状态列表
    async getCommentStatusList () {
      const res = await commentApi.getCommentStatusList()
      if (res.code === 20000) {
        this.commentStatusList = res.data
      } else {
        this.$message.error('评论状态列表获取失败！')
      }
    },
    // 当表格中的复选框被选中时 触发事件
    handleSelectionChange (selection) {
      const ids = []
      selection.forEach(item => {
        ids.push(item.id)
      })
      this.deleteCommentId = ids
      this.choosedTotol = selection.length
    },
    // 当点击了开启/关闭搜索框 触发事件
    changeSearchBoxStatus () {
      this.showSearchBox = !this.showSearchBox
    },
    // 当点击了开启/关闭提示框 触发事件
    changeAlertStatus () {
      this.showAlert = !this.showAlert
    },
    // 当每页显示记录总数发生改变时 触发事件
    handleSizeChange (val) {
      this.pageSize = val
      this.getCommentList()
    },
    // 当前页发生改变时 触发事件
    handleCurrentChange (val) {
      this.page = val
      this.getCommentList()
    },
    // 当点击了重置按钮 触发事件
    resetData () {
      this.page = 1
      this.searchForm = {
        title: '',
        author: '',
        status: ''
      }
      this.getCommentList()
    },
    // 当点击了删除按钮 删除评论数据
    deleteCommentData (id) {
      this.$confirm('此操作将永久删除该评论, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        center: true
      }).then(async () => {
        const res = await commentApi.deleteCommentData(id)
        if (res.code === 20000) {
          this.getCommentList()
          this.$message.success('删除成功！')
        } else {
          this.$message.error('删除失败！')
        }
      }).catch(() => {
        this.$message.info('已取消删除！')
      })
    },
    // 批量删除文章列表数据
    multDeleteCommentData () {
      if (this.deleteCommentId.length === 0) {
        return this.$message.warning('请选择要删除的数据！')
      }
      this.$confirm('此操作将永久删除这些评论, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        center: true
      }).then(async () => {
        const res = await commentApi.deleteCommentData(this.deleteCommentId)
        if (res.code === 20000) {
          this.getCommentList()
          this.$message.success('删除成功！')
        } else {
          this.$message.error('删除失败！')
        }
      }).catch(() => {
        this.$message.info('已取消删除！')
      })
    },
    // 当点击了审批按钮 触发事件
    showApprovalDialog (data) {
      this.isShowApprovalDialog = true
      this.approvalData = data
    }
  }
}
</script>

<style lang="scss">
.comment-list {
  &-container {
    margin: 10px;
    .search-button-box {
      display: flex;
      margin-bottom: 15px;
      justify-content: flex-end;
      align-content: flex-end;
    }
    .comment-search-item {
      margin-bottom: 15px;
    }
    .funtion-button-box {
      > button {
        margin-bottom: 15px;
      }
    }
    .table-box {
      margin: 15px 0;
    }
    .pager-box {
      display: flex;
      justify-content: flex-end;
    }
  }
  &-card {
    padding: 16px;
  }
}
.tag-cell {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 60px;
  height: 32px;
  border-radius: 4px;

  &-warning {
    color: #eda30f;
    background-color: rgba(237, 163, 15, 0.1);
  }

  &-success {
    color: #6dc41f;
    background-color: rgba(109, 196, 31, 0.1);
  }

  &-danger {
    color: #d11529;
    background-color: rgba(209, 20, 41, 0.1);
  }

  &-primary {
    color: #147bd1;
    background-color: rgba(20, 123, 209, 0.1);
  }
}
</style>
