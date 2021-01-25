<template>
  <div class="system-settings-container">
    <el-card class="system-settings-card">
      <div slot="header" class="clearfix">
        <b>网站设置</b>
        <el-button style="float: right; padding: 3px 0" type="text" icon="el-icon-close" @click="goBack" />
      </div>
      <el-tabs v-model="activeName" :tab-position="position" style="height:100%">
        <el-tab-pane label="常规设置" name="baseSetting">
          <div>常规设置</div>
        </el-tab-pane>
        <el-tab-pane label="SEO设置" name="seoSetting">
          <div>SEO设置</div>
        </el-tab-pane>
        <el-tab-pane label="文章设置" name="articleSetting">
          <div>文章设置</div>
        </el-tab-pane>
        <el-tab-pane label="评论设置" name="commentSetting">
          <div>评论设置</div>
        </el-tab-pane>
        <el-tab-pane label="其他设置" name="otherSetting">
          <div>其他设置</div>
        </el-tab-pane>
      </el-tabs>
    </el-card>
    <el-card class="submit-button-box" shadow="hover">
      <el-button type="primary" size="small" :loading="loading" @click="onSubmit(activeName)">保存</el-button>
      <el-button size="small" @click="goBack">返回
      </el-button>
    </el-card>
  </div>
</template>

<script>
export default {
  data () {
    return {
      // 是否激活class
      isActive: true,
      // 当前选择的tab菜单
      activeName: 'baseSetting',
      // tab菜单位置
      position: 'right',
      // 是否在加载
      loading: false
    }
  },
  methods: {
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
.system-settings {
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
