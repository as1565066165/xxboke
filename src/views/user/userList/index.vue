<template>
  <div class="user-list-container">
    <el-card class="user-list-card" shadow="hover">
      <div v-show="showSearchBox" class="user-search-box el-row">
        <div class="user-search-item el-col-6 el-col-xs-24 el-col-sm-24 el-col-md-6 el-col-lg-6 el-col-xl-6">用户：
          <el-input v-model="searchForm.name" prefix-icon="el-icon-search" size="medium" placeholder="根据用户名称模糊查询" style="width:calc(100% - 70px)" />
        </div>
        <div class="user-search-item el-col-6 el-col-xs-24 el-col-sm-24 el-col-md-6 el-col-lg-6 el-col-xl-6">角色：
          <el-select v-model="searchForm.role" size="medium" placeholder="请选择" style="width:calc(100% - 70px);">
            <el-option v-for="item in userTypesList" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </div>
        <div class="user-search-item el-col-6 el-col-xs-24 el-col-sm-24 el-col-md-6 el-col-lg-6 el-col-xl-6">状态：
          <el-select v-model="searchForm.status" size="medium" placeholder="请选择" style="width:calc(100% - 70px);">
            <el-option v-for="item in userStatusList" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </div>
        <div v-show="moreSearchCondition" class="user-search-item el-col-6 el-col-xs-24 el-col-sm-24 el-col-md-6 el-col-lg-6 el-col-xl-6">昵称：
          <el-input v-model="searchForm.userName" prefix-icon="el-icon-search" size="medium" placeholder="根据用户昵称模糊查询" style="width:calc(100% - 70px)" />
        </div>
        <div v-show="moreSearchCondition" class="user-search-item el-col-6 el-col-xs-24 el-col-sm-24 el-col-md-6 el-col-lg-6 el-col-xl-6">邮箱：
          <el-input v-model="searchForm.email" prefix-icon="el-icon-search" size="medium" placeholder="根据用户邮箱模糊查询" style="width:calc(100% - 70px)" />
        </div>
        <div v-show="moreSearchCondition" class="user-search-item el-col-12 el-col-xs-24 el-col-sm-24 el-col-md-12 el-col-lg-12 el-col-xl-12">时间：
          <el-date-picker v-model="searchForm.dateTime" type="datetimerange" style="width:calc(100% - 70px);height:36px" :picker-options="pickerOptions" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" align="right" />
        </div>
        <div class="el-col-6 el-col-xs-24 el-col-sm-24 el-col-md-6 el-col-lg-6 el-col-xl-6">
          <div class="search-button-box">
            <el-button size="medium" style="marginRight:10px" type="text" :icon="moreSearchCondition?'el-icon-arrow-up':'el-icon-arrow-down'" @click="moreSearchCondition=!moreSearchCondition">{{ moreSearchCondition?'收起':'展开' }}</el-button>
            <el-button type="primary" size="medium" @click="getUserList">查询</el-button>
            <el-button size="medium" @click="resetData">重置</el-button>
          </div>
        </div>
      </div>
      <div class="funtion-button-box el-row">
        <el-button class="el-col-xs-24" icon="el-icon-plus" type="primary" size="medium" @click="goAddUserPage">新增用户</el-button>
        <el-button :style="marginLeft" class="el-col-xs-24" icon="el-icon-delete" size="medium" @click="multDeleteUserData">批量删除</el-button>
        <el-button :style="marginLeft" class="el-col-xs-24" icon="el-icon-refresh" size="medium" @click="$router.go(0)">刷新</el-button>
        <el-button :style="marginLeft" class="el-col-xs-24" :type="showSearchBox?'primary':'warning'" size="medium" plain @click="changeSearchBoxStatus">{{ showSearchBox?'关闭搜索':'开启搜索' }}</el-button>
        <el-button :style="marginLeft" class="el-col-xs-24" :type="showAlert?'danger':'success'" size="medium" plain @click="changeAlertStatus">{{ showAlert?'关闭提示':'开启提示' }}</el-button>
      </div>
      <el-alert v-show="showAlert" :title="'已选中 '+choosedTotol+' 项'" type="warning" :closable="false" />
      <div class="table-box">
        <el-table ref="multipleTable" v-loading="listLoading" :data="tableData" tooltip-effect="dark" style="width: 100%" border stripe @selection-change="handleSelectionChange">
          <el-table-column type="selection" width="70" fixed />
          <el-table-column width="80" label="头像">
            <template v-slot="{row}">
              <img :src="row.avatar" alt="" style="width:40px;borderRadius:10px">
            </template>
          </el-table-column>
          <el-table-column prop="userName" label="昵称" show-overflow-tooltip />
          <el-table-column label="用户">
            <template v-slot="{row}">
              <span>{{ row.name+' ('+row.ename+')' }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="email" label="邮箱" show-overflow-tooltip />
          <el-table-column prop="role" label="角色" width="100">
            <template v-slot="{row}">
              <span>{{ row.role==='admin'?'超级管理员':'普通用户' }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="status" label="状态" width="80">
            <template v-slot="{row}">
              <div>
                <div v-if="row.status==='1'" class="tag-cell tag-cell-success">激活</div>
                <div v-else class="tag-cell tag-cell-danger">未激活</div>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="registerTime" label="注册时间" width="180" show-overflow-tooltip />
          <el-table-column label="操作" fixed="right" width="100">
            <template v-slot="{row}">
              <el-button type="text" @click="goUserEditPage(row.id)">编辑</el-button>
              <el-button type="text" @click="deleteUserData(row.id)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="pager-box">
        <el-pagination :current-page="page" :page-sizes="[10, 20, 50, 100]" :page-size="pageSize" :layout="paginationLayout" :total="total" background :prev-text="text1" :next-text="text2" @size-change="handleSizeChange" @current-change="handleCurrentChange" />
      </div>
    </el-card>
  </div>
</template>

<script>
import userApi from '@/api/user/index.js'
export default {
  data () {
    return {
      // 搜索表单
      searchForm: {
        name: '', // 姓名
        role: '', // 角色
        status: '', // 状态
        userName: '', // 昵称
        email: '', // 邮箱
        dateTime: '' // 时间
      },
      // 用户类型列表
      userTypesList: [],
      // 评论状态列表
      userStatusList: [],
      // 表格数据
      tableData: [],
      // 是否loading加载表格数据
      listLoading: true,
      // 显示/隐藏搜索框
      showSearchBox: true,
      // 显示/隐藏提示框
      showAlert: true,
      // 显示更多查询条件
      moreSearchCondition: false,
      // 当前选中的数据条数
      choosedTotol: 0,
      // 当前页
      page: 1,
      // 当前页显示数据条数
      pageSize: 10,
      // 数据总数
      total: 100,
      // 要删除的用户id数组
      deleteUserId: [],
      // 分页组件布局
      paginationLayout: 'total, prev, pager, next, sizes, jumper',
      // 替代图标显示的上一页文字
      text1: '',
      // 替代图标显示的下一页文字
      text2: '',
      // 按钮样式
      marginLeft: '',
      // 日期时间选择器的配置项
      pickerOptions: {
        shortcuts: [{
          text: '最近一周',
          onClick (picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '最近一个月',
          onClick (picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '最近三个月',
          onClick (picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
            picker.$emit('pick', [start, end])
          }
        }]
      }
    }
  },
  created () {
    // 获取用户列表数据
    this.getUserList()
    // 获取用户类型列表
    this.getUserTypeList()
    // 获取用户状态列表
    this.getUserStatusList()
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
        this.dialogWidth = '80%'
        this.paginationLayout = 'total, prev,next, jumper'
        this.text1 = '上一页'
        this.text2 = '下一页'
        this.marginLeft = 'marginLeft:0px'
      } else {
        this.dialogWidth = '60%'
        this.paginationLayout = 'total, prev, pager, next, sizes, jumper'
        this.text1 = ''
        this.text2 = ''
        this.marginLeft = ''
      }
    },
    // 获取用户列表数据
    async getUserList () {
      this.listLoading = true
      const res = await userApi.getUserList({ page: this.page, pageSize: this.pageSize, ...this.searchForm })
      if (res.code === 20000) {
        this.tableData = res.data.data
        this.total = res.data.total
      } else {
        this.$message.error('用户列表数据获取失败！')
      }
      this.listLoading = false
    },
    // 获取用户类型列表
    async getUserTypeList () {
      const res = await userApi.getUserTypeList()
      if (res.code === 20000) {
        this.userTypesList = res.data
      } else {
        this.$message.error('用户类型列表获取失败！')
      }
    },
    // 获取用户状态列表
    async getUserStatusList () {
      const res = await userApi.getUserStatusList()
      if (res.code === 20000) {
        this.userStatusList = res.data
      } else {
        this.$message.error('用户状态列表获取失败！')
      }
    },
    // 当表格中的复选框被选中时 触发事件
    handleSelectionChange (selection) {
      const ids = []
      selection.forEach(item => {
        ids.push(item.id)
      })
      this.deleteUserId = ids
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
      this.getUserList()
    },
    // 当前页发生改变时 触发事件
    handleCurrentChange (val) {
      this.page = val
      this.getUserList()
    },
    // 当点击了重置按钮 触发事件
    resetData () {
      this.page = 1
      this.searchForm = {
        name: '',
        role: '',
        status: '',
        userName: '',
        email: '',
        dateTime: ''
      }
      this.getUserList()
    },
    // 点击了新增用户 触发事件
    goAddUserPage () {
      this.$router.push('/user/userAdd')
    },
    // 当点击了编辑按钮 触发事件
    goUserEditPage (id) {
      this.$router.push(`/user/userAdd?userId=${id}`)
    },
    // 当点击了删除按钮 删除评论数据
    deleteUserData (id) {
      this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        center: true
      }).then(async () => {
        const res = await userApi.deleteUserData(id)
        if (res.code === 20000) {
          this.getUserList()
          this.$message.success('删除成功！')
        } else {
          this.$message.error('删除失败！')
        }
      }).catch(() => {
        this.$message.info('已取消删除！')
      })
    },
    // 批量删除用户列表数据
    multDeleteUserData () {
      if (this.deleteUserId.length === 0) {
        return this.$message.warning('请选择要删除的数据！')
      }
      this.$confirm('此操作将永久删除这些用户, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        center: true
      }).then(async () => {
        const res = await userApi.deleteUserData(this.deleteUserId)
        if (res.code === 20000) {
          this.getUserList()
          this.$message.success('删除成功！')
        } else {
          this.$message.error('删除失败！')
        }
      }).catch(() => {
        this.$message.info('已取消删除！')
      })
    }
  }
}
</script>

<style lang="scss">
.user-list {
  &-container {
    margin: 10px;
    .search-button-box {
      display: flex;
      margin-bottom: 15px;
      justify-content: flex-end;
      align-content: flex-end;
    }
    .user-search-item {
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
