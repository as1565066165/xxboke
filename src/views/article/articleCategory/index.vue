<template>
  <div class="article-category-container el-row">
    <el-card v-show="showCategoryForm" shadow="hover" class="article-category-card el-col-12 el-col-xs-24 el-col-sm-24 el-col-md-12 el-col-lg-12 el-col-xl-12">
      <div slot="header" class="clearfix">
        <b>{{ isEdit?'编辑分类':'添加分类' }}</b>
        <el-button style="float: right; padding: 3px 0" type="text" icon="el-icon-close" @click="showCategoryForm=false" />
      </div>
      <el-form ref="articleCategoryForm" label-position="top" :rules="articleCategoryFormRules" label-width="80px" :model="articleCategoryForm">
        <el-form-item label="名称" prop="name">
          <el-input v-model="articleCategoryForm.name" placeholder="请输入分类名称" />
        </el-form-item>
        <el-form-item label="图标" prop="icon">
          <el-input v-model="articleCategoryForm.icon" placeholder="请输入element-ui的icon" />
          <a class="icon-a" title="传送至element-ui图标集合" href="https://element.eleme.cn/#/zh-CN/component/icon#tu-biao-ji-he" target="blank">图标传送门</a>
        </el-form-item>
      </el-form>
      <div class="button-box">
        <el-button type="primary" size="small" @click="submitHandle">{{ isEdit?'修改':'添加' }}</el-button>
        <el-button v-show="isEdit" style="marginLeft:20px" icon="el-icon-document-add" type="success" size="small" @click="resetFormData">新增分类</el-button>
      </div>
    </el-card>
    <el-card v-show="showCategoryTable" shadow="hover" class="article-category-card el-col-12 el-col-xs-24 el-col-sm-24 el-col-md-12 el-col-lg-12 el-col-xl-12">
      <div slot="header" class="clearfix">
        <b>分类表格</b>
        <el-button style="float: right; padding: 3px 0" type="text" icon="el-icon-close" @click="showCategoryTable=false" />
      </div>
      <el-alert v-show="showAlert" :title="'已选中 '+choosedTotol+' 项'" type="warning" close-text="删除" @close="deleteCategory(deleteCategoryId)" />
      <el-table ref="categoryTable" :data="categoryTableData" tooltip-effect="dark" style="width: 100%" height="292" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55" />
        <el-table-column prop="name" label="名称" />
        <el-table-column prop="icon" label="图标" />
        <el-table-column label="展示" align="center">
          <template v-slot="{row}">
            <i :class="row.icon" />
          </template>
        </el-table-column>
        <el-table-column label="操作" fixed="right" width="100">
          <template v-slot="{row}">
            <el-button type="text" @click="editCategory(row)">编辑</el-button>
            <el-button type="text" @click="deleteCategory(row.id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
const defaultArticleCategoryForm = {
  name: '',
  icon: ''
}
export default {
  data () {
    // 自定义icon表单验证规则
    const validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('icon名称不能为空'))
      } else if (!/^el\-icon\-/.test(value)) {
        callback(new Error('请输入正确的icon名称'))
      } else {
        callback()
      }
    }
    return {
      // 文章分类表单
      articleCategoryForm: JSON.parse(JSON.stringify(defaultArticleCategoryForm)),
      // 文章分类表单校验规则
      articleCategoryFormRules: {
        name: [
          { required: true, message: '请输入分类名称', trigger: 'blur' },
          { min: 2, max: 6, message: '长度在 2 到 6 个字符', trigger: 'blur' }
        ],
        icon: [
          { required: true, validator: validatePass, trigger: 'blur' }
        ]
      },
      // 分类表格数据
      categoryTableData: [
        {
          id: 1,
          name: '科技',
          icon: 'el-icon-cpu'
        },
        {
          id: 2,
          name: '游戏',
          icon: 'el-icon-coordinate'
        },
        {
          id: 3,
          name: '服装',
          icon: 'el-icon-s-goods'
        },
        {
          id: 4,
          name: '美食',
          icon: 'el-icon-food'
        },
        {
          id: 5,
          name: '天气',
          icon: 'el-icon-heavy-rain'
        },
        {
          id: 6,
          name: '运动',
          icon: 'el-icon-bangzhu'
        }

      ],
      // 删除分类id
      deleteCategoryId: [],
      // 是否显示Alert提示框
      showAlert: false,
      // 是否显示分类表格
      showCategoryTable: true,
      // 是否显示分类表单
      showCategoryForm: true
    }
  },
  computed: {
    // 当前选中的数据条数
    choosedTotol: {
      get () {
        return this.deleteCategoryId.length
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
        return this.articleCategoryForm.id != null
      }
    }
  },
  watch: {
    showCategoryTable () {
      if (!this.showCategoryTable && !this.showCategoryForm) {
        this.$router.go(-1)
      }
    },
    showCategoryForm () {
      if (!this.showCategoryTable && !this.showCategoryForm) {
        this.$router.go(-1)
      }
    }
  },
  methods: {
    // 重置表单
    resetFormData () {
      this.articleCategoryForm = JSON.parse(JSON.stringify(defaultArticleCategoryForm))
    },
    // 返回
    goBack () {
      this.$router.go(-1)
    },
    // 提交表单
    submitHandle () {
      this.$refs.articleCategoryForm.validate((valid) => {
        if (valid) {
          this.$message.success('校验通过')
        }
      })
    },
    handleSelectionChange (selection) {
      this.choosedTotol = selection.length
      const ids = []
      selection.forEach(item => ids.push(item.id))
      this.deleteCategoryId = ids
    },
    handleCurrentChange () { },
    // 编辑分类数据
    editCategory (row) {
      this.articleCategoryForm = row
    },
    // 删除分类数据
    deleteCategory (id) {
      if (Array.isArray(id)) {
        for (let i = 0; i < id.length; i++) {
          this.categoryTableData.some((item, index) => {
            if (item.id === id[i]) {
              this.categoryTableData.splice(index, 1)
            }
          })
        }
      } else {
        this.categoryTableData.some((item, index) => {
          if (item.id === id) {
            this.categoryTableData.splice(index, 1)
          }
        })
      }
    }
  }
}
</script>

<style lang="scss">
.article-category {
  &-container {
    padding: 10px;
  }
  &-card {
    padding: 16px;
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
</style>
