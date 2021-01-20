<template>
  <div class="user-add-container">
    <el-card class="user-add-card">
      <div slot="header" class="clearfix">
        <b>用户编撰</b>
        <el-button style="float: right; padding: 3px 0" type="text" icon="el-icon-close" @click="goBack" />
      </div>
      <el-tabs v-model="activeName" :tab-position="position" style="height:100%">
        <el-tab-pane label="基本信息" name="basePanel">
          <base-panel ref="basePanel" :is-active="isActive" :is-edit="isEdit" :is-loading.sync="loading" />
        </el-tab-pane>
        <el-tab-pane v-if="isEdit" label="密码修改" name="passwordPanel">
          <password-panel ref="passwordPanel" :is-active="isActive" :is-loading.sync="loading" />
        </el-tab-pane>
      </el-tabs>
    </el-card>
    <el-card class="submit-button-box" shadow="hover">
      <el-button type="primary" size="small" :loading="loading" @click="onSubmit(activeName)">{{ isEdit?'立即修改':'立即创建' }}</el-button>
      <el-button size="small" @click="goBack">返回
      </el-button>
    </el-card>
  </div>
</template>

<script>
import basePanel from './components/basePanel.vue'
import passwordPanel from './components/passwordPanel.vue'
export default {
  components: {
    basePanel,
    passwordPanel
  },
  data () {
    return {
      // 是否激活class
      isActive: true,
      // 当前选择的tab菜单
      activeName: 'basePanel',
      // tab菜单位置
      position: 'right',
      // 是否在加载
      loading: false
    }
  },
  computed: {
    // 是否为编辑状态
    isEdit: {
      get () {
        return this.$route.query.userId != null
      }
    }
  },
  created () {
    this.layoutHandle()
    // 窗口大小改变触发事件
    this.windowResizeHandle()
  },
  methods: {
    // 窗口大小改变触发事件
    windowResizeHandle () {
      window.addEventListener('resize', () => {
        this.layoutHandle()
      })
    },
    // 改变布局
    layoutHandle () {
      const flag = window.document.body.clientWidth > 868
      if (flag) {
        this.isActive = true
        this.position = 'right'
      } else {
        this.isActive = false
        this.position = 'top'
      }
    },
    // 提交
    onSubmit (name) {
      this.$refs[name].onSubmit()
    },
    // 返回
    goBack () {
      this.$router.go(-1)
    }
  }
}
</script>

<style lang="scss">
.user-add {
  // &-container {
  //   padding: 10px;
  // }
  &-card {
    margin: 10px 10px 55px 10px;
    padding: 16px;
    .card-content {
      margin-top: 16px;
    }
  }
}
.submit-button-box {
  position: fixed;
  width: 100%;
  bottom: 0;
  padding: 10px 15px;
  > button {
    width: 112px;
  }
}
</style>
