const Mock = require('mockjs')
// const axios = require('axios')
// const result = (async function () { return await axios.get('https://www.ip.cn/api/index?ip=218.104.155.137&type=0') })()
const categoryData = Mock.mock({
  'data|6': [{
    id: '@natural()',
    'name|+1': ['科技', '游戏', '服装', '美食', '天气', '运动'],
    'icon|+1': ['el-icon-cpu', 'el-icon-coordinate', 'el-icon-s-goods', 'el-icon-food', 'el-icon-heavy-rain', 'el-icon-bangzhu']
  }
  ]
})
const data = Mock.mock({
  'data|100': [
    {
      id: '@natural()',
      userName: 'luoxu',
      title: '@csentence(10,20)',
      content: '@csentence(50,300)',
      'status|1': ['0', '1'],
      createdTime: '@date("yyyy-MM-dd HH:mm:ss")',
      categoryId: function () {
        return categoryData.data[parseInt(Math.random() * 6)].id
      }
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
  },
  // 根据文章id获取文章数据
  {
    url: '/acticle/queryActicleDataById',
    type: 'get',
    response: config => {
      const res = config.query
      const id = res.acticleId
      // eslint-disable-next-line no-return-assign
      const result = data.data.filter(item => item.id.toString() === id)
      return {
        code: 20000,
        data: result[0]
      }
    }
  },
  // 获取文章分类列表数据
  {
    url: '/acticle/getCategoryTableData',
    type: 'get',
    response: config => {
      return {
        code: 20000,
        data: categoryData.data
      }
    }
  },
  // 新增文章分类列表数据
  {
    url: '/acticle/addCategoryData',
    type: 'post',
    response: config => {
      const res = config.body
      res.id = parseInt(Math.random() * 9999999)
      categoryData.data.unshift(res)
      return {
        code: 20000,
        msg: '新增成功！'
      }
    }
  },
  // 删除文章分类列表数据
  {
    url: '/acticle/deleteCategoryData',
    type: 'delete',
    response: config => {
      const res = config.query
      const categoryId = res.categoryId.split(',')
      for (let i = 0; i < categoryId.length; i++) {
        categoryData.data.some((item, index) => {
          if (item.id.toString() === categoryId[i]) {
            categoryData.data.splice(index, 1)
          }
        })
      }
      return {
        code: 20000,
        msg: '删除成功！'
      }
    }
  },
  // 编辑文章分类列表数据
  {
    url: '/acticle/editCategoryData',
    type: 'put',
    response: config => {
      const res = config.query
      const id = res.id
      const name = res.name
      const icon = res.icon
      categoryData.data.some(item => {
        if (item.id.toString() === id) {
          item.name = name
          item.icon = icon
        }
      })
      return {
        code: 20000,
        msg: '修改成功！'
      }
    }
  }
]
