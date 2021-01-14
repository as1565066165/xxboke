<template>
  <el-dialog title="评论信息" :visible.sync="dialogVisible" :width="dialogWidth" :before-close="handleClose">
    <div class="content-box el-row-24">
      <div class="el-col-md-12 el-col-lg-12 el-col-xl-12 el-col-xs-24 el-col-sm-24">用户：<span>{{ data.userName }}</span></div>
      <div class="el-col-md-12 el-col-lg-12 el-col-xl-12 el-col-xs-24 el-col-sm-24">所属文章：<span>{{ data.articleName }}</span></div>
      <div class="el-col-md-12 el-col-lg-12 el-col-xl-12 el-col-xs-24 el-col-sm-24">状态：<span>{{ status }}</span></div>
      <div class="el-col-md-12 el-col-lg-12 el-col-xl-12 el-col-xs-24 el-col-sm-24">创建时间：<span>{{ data.createdTime }}</span></div>
      <div class="el-col-24 el-col-xs-24 el-col-sm-24">内容：<span>{{ data.content }}</span></div>
      <div v-show="!isApproval" class="el-col-md-12 el-col-lg-12 el-col-xl-12 el-col-xs-24 el-col-sm-24">审批人：<span>{{ data.approvalName }}</span></div>
      <div v-show="!isApproval" class="el-col-md-12 el-col-lg-12 el-col-xl-12 el-col-xs-24 el-col-sm-24">审批时间：<span>{{ data.approvalTime }}</span></div>
      <div v-show="!isApproval" class="el-col-24 el-col-xs-24 el-col-sm-24">审批意见：<span>{{ data.approvalComment }}</span></div>
    </div>
    <el-form v-show="isApproval" ref="approvalForm" :model="approvalForm" :rules="approvalFormRules" label-width="100px">
      <el-form-item label="审批结果：" prop="status">
        <el-radio v-model="approvalForm.status" label="1">批准</el-radio>
        <el-radio v-model="approvalForm.status" label="2">驳回</el-radio>
      </el-form-item>
      <el-form-item label="审批意见：" prop="comment">
        <el-input v-model="approvalForm.comment" type="textarea" placeholder="请输入审批意见" maxlength="100" show-word-limit :autosize="{ minRows: 4, maxRows: 6}" />
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button size="small" @click="dialogVisible = false">取 消</el-button>
      <el-button size="small" type="primary" @click="submitHandle">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import commentApi from '@/api/comment'
export default {
  props: {
    // 是否显示对话框
    visible: {
      type: Boolean,
      default: false
    },
    // 对话框的数据
    data: {
      type: Object,
      default: function () {
        return {}
      }
    },
    // 对话框大小
    dialogWidth: {
      type: String,
      default: '50%'
    }
  },
  data () {
    return {
      // 审批表单
      approvalForm: {
        status: '',
        comment: ''
      },
      // 审批表单验证规则
      approvalFormRules: {
        status: [
          { required: true, message: '请选择审批结果', trigger: 'change' }
        ],
        comment: [
          { required: true, message: '请填写审批意见', trigger: 'blur' }
        ]
      }
    }
  },
  computed: {
    // 在父组件visible修改值
    dialogVisible: {
      set (val) {
        this.$emit('update:visible', val)
      },
      get () {
        return this.visible
      }
    },
    status: {
      get () {
        let val = ''
        switch (this.data.status) {
          case '0':
            val = '待审核'
            break
          case '1':
            val = '已通过'
            break
          default:
            val = '回收站'
            break
        }
        return val
      }
    },
    isApproval: {
      get () {
        return this.data.type === '1'
      }
    }
  },
  methods: {
    // 关闭按钮 触发事件
    handleClose (done) {
      this.dialogVisible = false
    },
    // 点击确认按钮 触发事件
    submitHandle () {
      this.$refs['approvalForm'].validate(async (valid) => {
        if (valid) {
          const res = await commentApi.approvalCommentData({ id: this.data.id, ...this.approvalForm })
          if (res.code === 20000) {
            this.$emit('getCommentList')
            this.resetData()
            this.dialogVisible = false
            this.$message.success('审批成功！')
          } else {
            this.$message.error('审批失败！')
          }
        }
      })
    },
    resetData () {
      this.$refs['approvalForm'].resetFields()
    }
  }
}
</script>

<style lang="scss">
.content-box {
  overflow: hidden;
  margin-bottom: 25px;
  border-radius: 4px;
  background-color: #f5f5f5;
  div {
    color: rgba(0, 0, 0, 0.45);
    padding: 16px 16px 8px 16px;
    span {
      color: rgba(0, 0, 0, 0.65);
    }
  }
}
</style>
