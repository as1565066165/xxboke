<template>
  <el-dialog :fullscreen="isActive" top="10px" title="文章列表" :visible.sync="dialogVisible" :width="dialogWidth" :before-close="handleClose">
    <div class="article-search-box el-row">
      <div class="article-search-item el-col-8 el-col-xs-24 el-col-sm-24 el-col-md-8 el-col-lg-8 el-col-xl-8">标题：
        <el-input v-model="searchForm.title" prefix-icon="el-icon-search" size="small" placeholder="请输入文章的标题" :style="isActive?'width:calc(100% - 46px)':'width:calc(100% - 70px)'" />
      </div>
      <div class="article-search-item el-col-8 el-col-xs-24 el-col-sm-24 el-col-md-8 el-col-lg-8 el-col-xl-8">作者：
        <el-input v-model="searchForm.author" size="small" placeholder="请输入文章的作者" prefix-icon="el-icon-search" :style="isActive?'width:calc(100% - 46px)':'width:calc(100% - 70px)'" />
      </div>
      <div class="el-col-8 el-col-xs-24 el-col-sm-24 el-col-md-8 el-col-lg-8 el-col-xl-8 ">
        <div class="search-button-box">
          <el-button type="primary" size="small" @click="getArticleList">查询</el-button>
          <el-button size="small" @click="resetData">重置</el-button>
        </div>
      </div>
    </div>
    <div class="table-box">
      <el-table ref="multipleTable" v-loading="listLoading" :data="tableData" tooltip-effect="dark" height="450" style="width: 100%" border stripe highlight-current-row @row-dblclick="handleCurrentRow" @current-change="changeCurrentRow">
        <el-table-column prop="userName" width="80" label="用户" show-overflow-tooltip />
        <el-table-column prop="title" label="标题" show-overflow-tooltip />
        <el-table-column prop="status" label="状态" width="80">
          <template v-slot="{row}">
            <div>
              <div v-if="row.status==='1'" class="tag-cell tag-cell-success">已发布</div>
              <div v-else class="tag-cell tag-cell-danger">草稿</div>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="createdTime" label="创建时间" width="180" show-overflow-tooltip />
      </el-table>
    </div>
    <div class="pager-box">
      <el-pagination :current-page="page" :page-sizes="[10, 20, 50, 100]" :page-size="pageSize" :layout="paginationLayout" :total="total" background :prev-text="text1" :next-text="text2" @size-change="handleSizeChange" @current-change="handleCurrentChange" />
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button size="small" @click="dialogVisible = false">取 消</el-button>
      <el-button size="small" type="primary" @click="submitHandle">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import articleApi from '@/api/article'
export default {
  props: {
    visible: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      // 搜索表单
      searchForm: {
        title: '',
        author: '',
        status: '1'
      },
      // 表格数据
      tableData: [],
      // 是否loading加载表格数据
      listLoading: true,
      // 当前页
      page: 1,
      // 当前页显示数据条数
      pageSize: 10,
      // 数据总数
      total: 100,
      // 分页组件布局
      paginationLayout: 'total, prev, pager, next, sizes, jumper',
      // 替代图标显示的上一页文字
      text1: '',
      // 替代图标显示的下一页文字
      text2: '',
      // 对话框宽度
      dialogWidth: '60%',
      // 当前选中的行
      currentRow: '',
      // 是否激活
      isActive: false
    }
  },
  computed: {
    dialogVisible: {
      set (val) {
        this.resetData()
        this.$emit('update:visible', val)
      },
      get () {
        return this.visible
      }
    }
  },
  created () {
    // 获取文章列表数据
    this.getArticleList()
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
      const flag = window.document.body.clientWidth < 868
      if (flag) {
        this.isActive = true
        this.paginationLayout = 'total, prev,next, jumper'
        this.text1 = '上一页'
        this.text2 = '下一页'
      } else {
        this.isActive = false
        this.dialogWidth = '60%'
        this.paginationLayout = 'total, prev, pager, next, sizes, jumper'
        this.text1 = ''
        this.text2 = ''
      }
    },
    // 获取文章列表数据
    async getArticleList () {
      this.listLoading = true
      const res = await articleApi.getArticleList({ page: this.page, pageSize: this.pageSize, ...this.searchForm })
      if (res.code === 20000) {
        this.tableData = res.data.data
        this.total = res.data.total
      } else {
        this.$message.error('文章列表数据获取失败！')
      }
      this.listLoading = false
    },
    // 当每页显示记录总数发生改变时 触发事件
    handleSizeChange (val) {
      this.pageSize = val
      this.getArticleList()
    },
    // 当前页发生改变时 触发事件
    handleCurrentChange (val) {
      this.page = val
      this.getArticleList()
    },
    // 当双击某一行触发事件
    handleCurrentRow (val) {
      this.$emit('getCurrentArticleData', val)
      this.dialogVisible = false
    },
    // 当选中某一行触发事件
    changeCurrentRow (val) {
      this.currentRow = val
    },
    // 当点击确认按钮触发事件
    submitHandle () {
      if (this.currentRow) {
        this.$emit('getCurrentArticleData', this.currentRow)
        this.dialogVisible = false
      } else {
        this.$message.error('请先选择表格数据！')
      }
    },
    // 点击关闭图标或遮罩关闭 Dialog 时起效
    handleClose () {
      this.dialogVisible = false
    },
    // 当点击了重置按钮 触发事件
    resetData () {
      this.page = 1
      this.searchForm = {
        title: '',
        author: '',
        status: '1'
      }
      this.getArticleList()
    }
  }
}
</script>

<style lang="scss">
.search-button-box {
  display: flex;
  margin-bottom: 15px;
  justify-content: flex-end;
  align-content: flex-end;
}
.article-search-item {
  margin-bottom: 15px;
}
.funtion-button-box {
  > button {
    margin-bottom: 15px;
  }
}
.table-box {
  margin: 0 0 15px 0;
}
.pager-box {
  display: flex;
  justify-content: flex-end;
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
