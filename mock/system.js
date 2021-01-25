const Mock = require('mockjs')
const slideData = Mock.mock({
  'data|4': [{
    id: '@natural()',
    title: '@ctitle()',
    link: '@natural()',
    imgUrl: "@image('140x80','@color()')"
  }]
})
const videoData = Mock.mock({
  'data|4': [{
    id: '@natural()',
    name: '@ctitle()',
    desc: '@csentence(100,300)',
    url: 'https://d2zihajmogu5jn.cloudfront.net/bipbop-advanced/bipbop_16x9_variant.m3u8'
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
  },
  // 获取视频流列表数据
  {
    url: '/system/getVideoList',
    type: 'get',
    response: config => {
      return {
        code: 20000,
        data: {
          data: videoData.data
        }
      }
    }
  },
  // 新增视频列表数据
  {
    url: '/system/addVideoData',
    type: 'post',
    response: config => {
      const res = config.body
      res.id = parseInt(Math.random() * 9999999)
      videoData.data.unshift(res)
      return {
        code: 20000,
        msg: '新增成功！'
      }
    }
  },
  // 删除视频列表数据
  {
    url: '/system/deleteVideoData',
    type: 'delete',
    response: config => {
      const res = config.query
      const videoId = res.videoId.split(',')
      for (let i = 0; i < videoId.length; i++) {
        videoData.data.some((item, index) => {
          if (item.id.toString() === videoId[i]) {
            videoData.data.splice(index, 1)
          }
        })
      }
      return {
        code: 20000,
        msg: '删除成功！'
      }
    }
  },
  // 编辑视频列表数据
  {
    url: '/system/editVideoData',
    type: 'put',
    response: config => {
      const res = config.query
      const id = res.id
      videoData.data.some(item => {
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
