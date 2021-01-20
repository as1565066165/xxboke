<template>
  <div class="card-content" :gutter="20">
    <el-form ref="userForm" :model="userForm" label-width="80px" :rules="userFormRules">
      <el-form-item label="用户昵称" prop="userName">
        <el-input v-model="userForm.userName" :class="{width50:isActive}" clearable />
      </el-form-item>
      <el-form-item label="用户名称" prop="name">
        <el-input v-model="userForm.name" :class="{width50:isActive}" clearable />
      </el-form-item>
      <el-form-item v-if="!isEdit" label="用户密码" prop="password">
        <el-input v-model="userForm.password" :class="{width50:isActive}" type="password" show-password />
      </el-form-item>
      <el-form-item v-if="!isEdit" label="确认密码" prop="confirmPassword">
        <el-input v-model="userForm.confirmPassword" :class="{width50:isActive}" type="password" show-password />
      </el-form-item>
      <el-form-item label="用户邮箱" prop="email">
        <el-input v-model="userForm.email" :class="{width50:isActive}" type="email" clearable />
      </el-form-item>
      <el-form-item label="用户头像">
        <el-upload class="avatar-uploader" action="https://jsonplaceholder.typicode.com/posts/" :show-file-list="false" :on-success="handleAvatarSuccess" :before-upload="beforeAvatarUpload">
          <img v-if="userForm.avatar" :src="userForm.avatar" class="avatar">
          <i v-else class="el-icon-plus avatar-uploader-icon" />
        </el-upload>
      </el-form-item>
      <el-form-item label="是否激活">
        <el-switch v-model="userForm.status" />
      </el-form-item>
      <el-form-item label="用户角色" prop="role">
        <el-radio-group v-model="userForm.role">
          <el-radio label="normal">普通用户</el-radio>
          <el-radio label="admin">超级管理员</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="个人主页">
        <el-input v-model="userForm.homePage" :class="{width50:isActive}" />
      </el-form-item>
      <el-form-item label="个人介绍">
        <el-input v-model="userForm.desc" :class="{width50:isActive}" type="textarea" :autosize="{ minRows: 4, maxRows: 6}" maxlength="100" show-word-limit />
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
    isEdit: {
      type: Boolean,
      default: false
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
      } else if (value !== this.userForm.password) {
        callback(new Error('两次输入密码不一致!'))
      } else {
        callback()
      }
    }
    return {
      userForm: {
        userName: '', // 用户昵称
        name: '', // 用户名称
        password: '', // 密码
        confirmPassword: '', // 确认密码
        avatar: '', // 头像
        email: '', // 邮箱
        status: false, // 状态
        role: '', // 角色
        homePage: '', // 主页
        desc: '' // 个人介绍
      },
      userFormRules: {
        userName: [
          { required: true, message: '请输入用户昵称', trigger: 'blur' },
          { min: 2, max: 13, message: '长度在 2 到 13 个字符', trigger: 'blur' }
        ],
        name: [
          { required: true, message: '请输入用户名称', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, max: 32, message: '长度在 6 到 32 个字符', trigger: 'blur' }
        ],
        confirmPassword: [
          { required: true, validator: validatePass, trigger: 'blur' }
        ],
        email: [
          { required: true, message: '请输入邮箱地址', trigger: 'blur' },
          { type: 'email', message: '请输入正确的邮箱地址', trigger: ['blur', 'change'] }
        ],
        role: [
          { required: true, message: '请选择用户角色', trigger: 'change' }
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
    // 如果有用户id 根据id查询用户信息
    const id = this.$route.query.userId
    if (id) {
      this.queryUserDataById(id)
    }
  },
  methods: {
    // 根据用户id查询用户数据
    async queryUserDataById (id) {
      const res = await userApi.queryUserDataById(id)
      if (res.code === 20000) {
        if (res.data.status === '1') {
          res.data.status = true
        } else {
          res.data.status = false
        }
        this.userForm = res.data
      } else {
        this.$message.error('用户数据获取失败！')
      }
    },
    // 用户头像上传成功钩子
    handleAvatarSuccess (res, file) {
      this.userForm.avatar = URL.createObjectURL(file.raw)
      console.log(file)
    },
    // 用户头像上传前的钩子
    beforeAvatarUpload (file) {
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
    // 提交
    onSubmit () {
      this.$refs['userForm'].validate(async (valid) => {
        if (valid) {
          this.loading = true
          let res = {}
          if (this.isEdit) {
            res = await userApi.editUserData(this.userForm)
          } else {
            res = await userApi.addUserData(this.userForm)
          }
          if (res.code === 20000) {
            this.$message.success('编撰成功！')
            this.$router.push('/user/userList')
          } else {
            this.$message.error('编撰失败！')
          }
          this.loading = false
        }
      })
    }
  }
}
</script>

<style lang="scss">
.width50 {
  width: 50%;
}
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>
