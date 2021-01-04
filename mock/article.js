const Mock = require('mockjs')
// const axios = require('axios')
// const result = (async function () { return await axios.get('https://www.ip.cn/api/index?ip=218.104.155.137&type=0') })()
const data = Mock.mock({
  'data|100': [
    {
      id: '@natural()',
      'userName': 'luoxu',
      'title': '@csentence(10,20)',
      'status|1': ['0', '1'],
      createdTime: '@date("yyyy-MM-dd HH:mm:ss")'
    }
  ]
})
module.exports = [
  // 获取文章列表数据
  {
    url: '/acticle/getActicleList',
    type: 'get',
    response: config => {
      // 获取请求参数
      const res = config.query
      const page = parseInt(res.page)
      const pageSize = parseInt(res.pageSize)
      const title = res.title
      const author = res.author
      const status = res.status
      // 开始
      const start = (page - 1) * pageSize
      // 结束
      const end = start + pageSize
      let result
      // 如果有标题查询条件  result赋值
      if (title) {
        result = data.data.filter(item => item.title.indexOf(title) !== -1)
      } else {
        result = data.data
      }
      // 如果有作者查询条件
      if (author) {
        result = result.filter(item => item.userName.indexOf(author) !== -1)
      }
      // 如果有状态查询条件
      if (status) {
        result = result.filter(item => item.status === status)
      }
      return {
        code: 20000,
        data: {
          page,
          pageSize,
          total: result.length,
          data: result.slice(start, end)
        }
      }
    }
  },
  // 获取文章状态列表数据
  {
    url: '/acticle/getArticleStatusList',
    type: 'get',
    response: config => {
      return {
        code: 20000,
        data: [{
          label: '已发布',
          value: '1'
        },
        {
          label: '草稿',
          value: '0'
        }]
      }
    }
  },
  // 删除文章数据
  {
    url: '/acticle/deleteActicleData',
    type: 'delete',
    response: config => {
      const res = config.query
      const acticleId = res.acticleId.split(',')
      for (let i = 0; i < acticleId.length; i++) {
        data.data.some((item, index) => {
          if (item.id.toString() === acticleId[i]) {
            data.data.splice(index, 1)
          }
        })
      }
      return {
        code: 20000,
        msg: '删除成功！'
      }
    }
  }
]
