<template>
  <div class="dashboard-container">
    <div class="container-hearder el-row">
      <div class="user-info-box el-col-8 el-col-xs-24 el-col-sm-24 el-col-md-9 el-col-lg-8 el-col-xl-8">
        <el-card class="user-info-card" shadow="hover">
          <div class="box-title">
            <img class="user-info-avatar" src="https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif?imageView2/1/w/80/h/80" alt="">
            <div class="box-title-text">
              <b class="user-info-name">小白</b>
              <p>您好，欢迎访问星选博客</p>
            </div>
          </div>
          <div class="box-bottom">本次登录地点：{{ returnCitySN.cname }}</div>
        </el-card>
      </div>
      <div class="el-row el-col-16 el-col-xs-24 el-col-sm-24 el-col-md-15 el-col-lg-16 el-col-xl-16">
        <div v-for="(item,index) in websiteRecordData" :key="index" class="website-record-box el-col-6 el-col-xs-24 el-col-sm-12 el-col-md-8 el-col-lg-6">
          <div style="margin: 0 5px 10px 5px">
            <el-card shadow="hover">
              <div :class="['card-title',getColorStyle(item.title)]">
                <i :class="item.icon" />
                <span>{{ item.title }}</span>
              </div>
              <div class="card-content-data">
                <b>{{ item.total }}</b>
              </div>
            </el-card>
          </div>
        </div>
      </div>
    </div>
    <div class="container-content">
      <el-card shadow="hover">
        <el-divider content-position="left">每日来访量统计</el-divider>
        <div id="main1" style="width: 100%;height:420px;" class="dataChart" />
      </el-card>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import * as echarts from 'echarts'
export default {
  name: 'Dashboard',
  data () {
    return {
      returnCitySN,
      websiteRecordData: [{
        title: '今日新增用户',
        icon: 'el-icon-user',
        total: 100
      }, {
        title: '今日浏览量',
        icon: 'el-icon-view',
        total: 100
      }, {
        title: '今日新增文章',
        icon: 'el-icon-collection',
        total: 100
      }, {
        title: '今日新增评论',
        icon: 'el-icon-s-comment',
        total: 100
      }, {
        title: '用户总数',
        icon: 'el-icon-user',
        total: 100
      }, {
        title: '浏览量总数',
        icon: 'el-icon-view',
        total: 100
      }, {
        title: '文章总数',
        icon: 'el-icon-collection',
        total: 100
      }, {
        title: '评论总数',
        icon: 'el-icon-s-comment',
        total: 100
      }
      ]
    }
  },
  mounted () {
    this.initBarChart()
  },
  methods: {
    // 初始化柱状图
    initBarChart () {
      const myChart = echarts.init(document.getElementById('main1'))
      const option = {
        legend: {},
        tooltip: {},
        dataset: {
          dimensions: ['product', '登录次数', '浏览量', '注册用户'],
          source: [
            { product: '11-21', '登录次数': 70, '浏览量': 85, '注册用户': 93 },
            { product: '11-22', '登录次数': 83, '浏览量': 73, '注册用户': 55 },
            { product: '11-23', '登录次数': 86, '浏览量': 65, '注册用户': 82 },
            { product: '11-24', '登录次数': 72, '浏览量': 53, '注册用户': 39 }
          ]
        },
        // 这一行是干货grid就代表网格线。只要把宽高设置成百分比就可以了，位置可以通过y值y2值x值和x2值调试。
        grid: { show: 'true', borderWidth: '0', height: '60%', width: '80%', y: '20%', x: '12%' },
        calculable: true,
        xAxis: { type: 'category' },
        yAxis: {},
        // Declare several bar series, each will be mapped
        // to a column of dataset.source by default.
        series: [
          { type: 'bar' },
          { type: 'bar' },
          { type: 'bar' }
        ]
      }
      myChart.setOption(option)
      // 监听屏幕变化
      window.addEventListener('resize', function () {
        myChart.resize()
      })
    },
    // 获取颜色
    getColorStyle (name) {
      let color
      switch (name) {
        case '今日新增用户':
        case '用户总数':
          color = 'card-title-primary'
          break
        case '今日浏览量':
        case '浏览量总数':
          color = 'card-title-success'
          break
        case '今日新增文章':
        case '文章总数':
          color = 'card-title-warning'
          break
        default:
          color = 'card-title-danger'
          break
      }
      return color
    }

  },
  computed: {
    ...mapGetters([
      'name'
    ])
  }
}
</script>

<style lang="scss" scoped>
.dashboard {
  &-container {
    margin: 10px 5px;
    .container-hearder {
      display: flex;
      flex-flow: row wrap;
      .user-info-box {
        padding: 0 5px 10px 5px;
        .user-info-card {
          padding: 20px;
          height: 100%;
          .box-title {
            display: flex;
            flex-flow: row nowrap;
            border-bottom: 2px solid #ccc;
            .user-info-avatar {
              margin: 0px 10px 10px 10px;
              border-radius: 50%;
            }
            .box-title-text {
              display: flex;
              flex-flow: column nowrap;
              justify-content: center;
              .user-info-name {
                font-size: 20px;
                color: #2d8cf0;
              }
              > p {
                margin: 10px 0 0 0;
              }
            }
          }
          .box-bottom {
            margin-top: 20px;
          }
        }
      }
      .website-record-box {
        font-size: 20px;
        .card-title {
          display: flex;
          padding: 0 10px;
          height: 40px;
          justify-content: center;
          align-items: center;
          color: #fff;
          &-primary {
            background-color: rgb(45, 140, 240);
          }
          &-success {
            background-color: rgb(100, 213, 114);
          }
          &-warning {
            background-color: rgb(255, 213, 114);
          }
          &-danger {
            background-color: rgb(242, 94, 67);
          }
          span {
            margin-left: 8px;
          }
        }
        .card-content-data {
          height: 40px;
          line-height: 40px;
          text-align: center;
        }
      }
    }
    .container-content {
      padding: 0 5px;
      width: 100%;
    }
  }
}
</style>
