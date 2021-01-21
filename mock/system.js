const Mock = require('mockjs')
const slideData = Mock.mock({
  'data|4': [{
    id: '@natural()',
    title: '@ctitle()',
    link: '@natural()',
    imgUrl: "@image('140x80','@color()')"
  }]
})
module.exports = [
  // 获取轮播图列表数据
  {
    url: '/system/getSlideList',
    type: 'get',
    response: config => {
      return {
        code: 20000,
        data: {
          data: slideData.data
        }
      }
    }
  },
  // 新增轮播图列表数据
  {
    url: '/system/addSlideData',
    type: 'post',
    response: config => {
      const res = config.body
      res.id = parseInt(Math.random() * 9999999)
      slideData.data.unshift(res)
      return {
        code: 20000,
        msg: '新增成功！'
      }
    }
  },
  // 删除轮播图列表数据
  {
    url: '/system/deleteSlideData',
    type: 'delete',
    response: config => {
      const res = config.query
      const slideId = res.slideId.split(',')
      for (let i = 0; i < slideId.length; i++) {
        slideData.data.some((item, index) => {
          if (item.id.toString() === slideId[i]) {
            slideData.data.splice(index, 1)
          }
        })
      }
      return {
        code: 20000,
        msg: '删除成功！'
      }
    }
  },
  // 编辑轮播图列表数据
  {
    url: '/system/editSlideData',
    type: 'put',
    response: config => {
      const res = config.query
      const id = res.id
      slideData.data.some(item => {
        if (item.id.toString() === id) {
          Object.assign(item, res)
        }
      })
      return {
        code: 20000,
        msg: '修改成功！'
      }
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
