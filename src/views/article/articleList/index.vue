<template>
  <div class="article-list-container">
    <el-card class="article-list-card" shadow="hover">
      <div v-show="showSearchBox" class="article-search-box el-row">
        <div class="article-search-item el-col-6 el-col-xs-24 el-col-sm-24 el-col-md-6 el-col-lg-6 el-col-xl-6">标题：
          <el-input v-model="searchForm.title" prefix-icon="el-icon-search" size="medium" placeholder="请输入文章的标题" style="width:calc(100% - 70px)" />
        </div>
        <div class="article-search-item el-col-6 el-col-xs-24 el-col-sm-24 el-col-md-6 el-col-lg-6 el-col-xl-6">作者：
          <el-input v-model="searchForm.author" size="medium" placeholder="请输入文章的作者" prefix-icon="el-icon-search" style="width:calc(100% - 70px)" />
        </div>
        <div class="article-search-item el-col-6 el-col-xs-24 el-col-sm-24 el-col-md-6 el-col-lg-6 el-col-xl-6">状态：
          <el-select v-model="searchForm.status" size="medium" placeholder="请选择" style="width:calc(100% - 70px);">
            <el-option v-for="item in articleStatusList" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </div>
        <div class="el-col-6 el-col-xs-24 el-col-sm-24 el-col-md-6 el-col-lg-6 el-col-xl-6 ">
          <div class="search-button-box">
            <el-button type="primary" size="medium" @click="getArticleList">查询</el-button>
            <el-button size="medium" @click="resetData">重置</el-button>
          </div>
        </div>
      </div>
      <div class="funtion-button-box el-row">
        <el-button class="el-col-xs-24" icon="el-icon-plus" type="primary" size="medium" @click="goAddArticlePage">发布新文章</el-button>
        <el-button class="el-col-xs-24" icon="el-icon-delete" size="medium" @click="multDeleteArticleData">批量删除</el-button>
        <el-button class="el-col-xs-24" icon="el-icon-refresh" size="medium" @click="$router.go(0)">刷新</el-button>
        <el-button class="el-col-xs-24" :type="showSearchBox?'primary':'warning'" size="medium" plain @click="changeSearchBoxStatus">{{ showSearchBox?'关闭搜索':'开启搜索' }}</el-button>
        <el-button class="el-col-xs-24" :type="showAlert?'danger':'success'" size="medium" plain @click="changeAlertStatus">{{ showAlert?'关闭提示':'开启提示' }}</el-button>
      </div>
      <el-alert v-show="showAlert" :title="'已选中 '+choosedTotol+' 项'" type="warning" :closable="false" />
      <div class="table-box">
        <el-table ref="multipleTable" v-loading="listLoading" :data="tableData" tooltip-effect="dark" style="width: 100%" border stripe @selection-change="handleSelectionChange">
          <el-table-column type="selection" width="70" fixed />
          <el-table-column prop="userName" width="100" label="用户" show-overflow-tooltip />
          <el-table-column prop="title" label="标题" show-overflow-tooltip />
          <el-table-column prop="status" label="状态" width="80">
            <template v-slot="{row}">
              <div>
                <div v-if="row.status==='1'" class="tag-cell tag-cell-success">已发布</div>
                <div v-else class="tag-cell tag-cell-danger">草稿</div>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="createdTime" label="创建时间" width="200" show-overflow-tooltip />
          <el-table-column label="操作" fixed="right" width="100">
            <template v-slot="{row}">
              <el-button type="text" @click="goArticleEditPage(row.id)">编辑</el-button>
              <el-button type="text" @click="deleteArticleData(row.id)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="pager-box">
        <el-pagination :current-page="page" :page-sizes="[10, 20, 50, 100]" :page-size="pageSize" layout="total, prev, pager, next, sizes, jumper" :total="total" background @size-change="handleSizeChange" @current-change="handleCurrentChange" />
      </div>
    </el-card>
  </div>
</template>

<script>
import articleApi from '@/api/article'
export default {
  data () {
    return {
      // 搜索表单
      searchForm: {
        title: '',
        author: '',
        status: ''
      },
      // 文章状态列表
      articleStatusList: [],
      // 表格数据
      tableData: [
        // {
        //   id: 1,
        //   userName: 'luoxu',
        //   title: '最美女主——艾薇莉特',
        //   status: '1',
        //   createdTime: '2020-8-28 08:25:36'
        // },
      ],
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
      // 要删除的文章id数组
      deleteArticleId: []
    }
  },
  created () {
    // 获取文章列表数据
    this.getArticleList()
    // 获取文章状态列表
    this.getArticleStatusList()
  },
  methods: {
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
    // 获取文章状态列表
    async getArticleStatusList () {
      const res = await articleApi.getArticleStatusList()
      if (res.code === 20000) {
        this.articleStatusList = res.data
      } else {
        this.$message.error('文章状态列表获取失败！')
      }
    },
    // 当表格中的复选框被选中时 触发事件
    handleSelectionChange (selection) {
      const ids = []
      selection.forEach(item => {
        ids.push(item.id)
      })
      this.deleteArticleId = ids
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
      this.getArticleList()
    },
    // 当前页发生改变时 触发事件
    handleCurrentChange (val) {
      this.page = val
      this.getArticleList()
    },
    // 当点击了新增文章按钮 触发事件
    goAddArticlePage () {
      this.$router.push('/article/articleAdd')
    },
    // 当点击了编辑按钮 触发事件
    goArticleEditPage (id) {
      this.$router.push(`/article/articleAdd?articleId=${id}`)
    },
    // 当点击了重置按钮 触发事件
    resetData () {
      this.page = 1
      this.searchForm = {
        title: '',
        author: '',
        status: ''
      }
      this.getArticleList()
    },
    // 当点击了删除按钮 删除文章数据
    deleteArticleData (id) {
      this.$confirm('此操作将永久删除该文章, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        center: true
      }).then(async () => {
        const res = await articleApi.deleteArticleData(id)
        if (res.code === 20000) {
          this.getArticleList()
          this.$message.success('删除成功！')
        } else {
          this.$message.error('删除失败！')
        }
      }).catch(() => {
        this.$$message.info('已取消删除！')
      })
    },
    // 批量删除文章列表数据
    multDeleteArticleData () {
      if (this.deleteArticleId.length === 0) {
        return this.$message.warning('请选择要删除的数据！')
      }
      this.$confirm('此操作将永久删除该文章, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        center: true
      }).then(async () => {
        const res = await articleApi.deleteArticleData(this.deleteArticleId)
        if (res.code === 20000) {
          this.getArticleList()
          this.$message.success('删除成功！')
        } else {
          this.$message.error('删除失败！')
        }
      }).catch(() => {
        this.$$message.info('已取消删除！')
      })
    }
  }
}
</script>

<style lang="scss">
.article-list {
  &-container {
    margin: 10px;
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
