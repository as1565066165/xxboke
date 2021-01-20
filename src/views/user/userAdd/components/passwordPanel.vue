<template>
  <div class="card-content" :gutter="20">
    <el-form ref="passwordForm" :model="passwordForm" label-width="80px" :rules="passwordFormRules">
      <el-form-item label="旧密码" prop="oldPassword">
        <el-input v-model="passwordForm.oldPassword" :class="{width50:isActive}" type="password" show-password />
      </el-form-item>
      <el-form-item label="用户密码" prop="password">
        <el-input v-model="passwordForm.password" :class="{width50:isActive}" type="password" show-password />
      </el-form-item>
      <el-form-item label="确认密码" prop="confirmPassword">
        <el-input v-model="passwordForm.confirmPassword" :class="{width50:isActive}" type="password" show-password />
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import userApi from '@/api/user/index.js'
export default {
  props: {
    isActive: {
      type: Boolean,
      default: true
    },
    isLoading: {
      type: Boolean,
      default: false
    }
  },
  data () {
    // 自定义确认密码表单验证规则
    const validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'))
      } else if (value !== this.passwordForm.password) {
        callback(new Error('两次输入密码不一致!'))
      } else {
        callback()
      }
    }
    return {
      passwordForm: {
        id: '',
        oldPassword: '',
        password: '',
        confirmPassword: ''
      },
      passwordFormRules: {
        oldPassword: [
          { required: true, message: '请输入旧密码', trigger: 'blur' },
          { min: 6, max: 32, message: '长度在 6 到 32 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, max: 32, message: '长度在 6 到 32 个字符', trigger: 'blur' }
        ],
        confirmPassword: [
          { required: true, validator: validatePass, trigger: 'blur' }
        ]
      }
    }
  },
  computed: {
    loading: {
      set (val) {
        this.$emit('update:is-loading', val)
      },
      get () {
        return this.isLoading
      }
    }
  },
  created () {
    this.passwordForm.id = this.$route.query.userId
  },
  methods: {
    // 提交
    onSubmit () {
      this.$refs['passwordForm'].validate(async (valid) => {
        if (valid) {
          this.loading = true
          const res = await userApi.editUserPassword(this.passwordForm)
          if (res.status === 200) {
            this.resetData()
            this.$message.success(res.msg)
          } else {
            this.$message.error(res.msg)
          }
        }
        this.loading = false
      })
    },
    // 重置
    resetData () {
      this.$refs['passwordForm'].resetFields()
    }
  }
}
</script>

<style lang="scss">
.width50 {
  width: 50%;
}
</style>
