const Mock = require('mockjs')
// const axios = require('axios')
// const result = (async function () { return await axios.get('https://www.ip.cn/api/index?ip=218.104.155.137&type=0') })()
const data = Mock.mock({
  'data|8': [{
    'index|+1': 0,
    'title|+1': ['今日新增用户', '今日浏览量', '今日新增文章', '今日新增评论', '用户总数', '浏览量总数', '文章总数', '评论总数'],
    'icon|+1': ['el-icon-user', 'el-icon-view', 'el-icon-collection', 'el-icon-s-comment', 'el-icon-user', 'el-icon-view', 'el-icon-collection', 'el-icon-s-comment'],
    total: function () {
      if (this.index >= 4) {
        return parseInt(Math.random() * 10000)
      } else {
        return parseInt(Math.random() * 300)
      }
    }
  }]
})

module.exports = [
  {
    url: '/dashboard/getAddressByIp',
    type: 'get',
    response: config => {
      // const data = await axios.get('https://www.ip.cn/api/index?ip=218.104.155.137&type=0')
      // const data = result
      // const address = data.data.address
      // console.log(address)
      return {
        code: 20000,
        data: {
          address: '中国 湖南省 长沙 联通'
          // address
        }
      }
    }
  },
  {
    url: '/dashboard/getWebsiteRecordData',
    type: 'get',
    response: config => {
      const result = data.data
      return {
        code: 20000,
        data: result
      }
    }
  },
  {
    url: '/dashboard/getWebsitePageViews',
    type: 'get',
    response: config => {
      return Mock.mock({
        code: 20000,
        'data|7': [{
          'index|+1': 0,
          'date|+1': function () {
            return formatDateTime(new Date(+new Date() - 24 * 60 * 60 * 1000 * (7 - this.index)))
          },
          'loginCount': '@integer(10,100)',
          'viewCount': '@integer(10,100)',
          'registerCount': '@integer(10,100)'
        }]
      })
    }
  }
]
function formatDateTime (date) {
  const y = date.getFullYear()
  let m = date.getMonth() + 1
  m = m < 10 ? ('0' + m) : m
  let d = date.getDate()
  d = d < 10 ? ('0' + d) : d
  let h = date.getHours()
  h = h < 10 ? ('0' + h) : h
  let minute = date.getMinutes()
  minute = minute < 10 ? ('0' + minute) : minute
  let second = date.getSeconds()
  second = second < 10 ? ('0' + second) : second
  return y + '-' + m + '-' + d + ' ' + h + ':' + minute + ':' + second
}
