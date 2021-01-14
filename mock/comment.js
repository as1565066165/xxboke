const Mock = require('mockjs')
const nameData = Mock.mock({
  'data|100': [{
    name: '@cName()'
  }
  ]
})
const sentenceData = Mock.mock({
  'data|100': [
    {
      sentence: '@csentence()'
    }
  ]
})
const data = Mock.mock({
  'data|100': [
    {
      id: '@natural()',
      userId: '@natural()',
      articleId: '@natural()',
      name: '@cname()',
      userName: function () {
        if (this.type === '1') {
          return this.name
        } else {
          return 'luoxu'
        }
      },
      articleName: '@ctitle(10,20)',
      content: '@csentence(5,100)',
      'type|1': ['0', '1'],
      'status|1': ['0', '1', '2'],
      createdTime: '@date("yyyy-MM-dd HH:mm:ss")',
      approvalName: function () {
        if (parseInt(this.status)) {
          return nameData.data[parseInt(Math.random() * 100)].name
        } else {
          return '--'
        }
      },
      approvalTime: function () {
        if (parseInt(this.status)) {
          return formatDateTime(new Date(+new Date(this.createdTime) + parseInt(Math.random() * 24000000)))
        } else {
          return '--'
        }
      },
      approvalComment: function () {
        if (parseInt(this.status)) {
          return sentenceData.data[parseInt(Math.random() * 100)].sentence
        } else {
          return '--'
        }
      }
    }
  ]
})
module.exports = [
  // 获取评论列表数据
  {
    url: '/comment/getCommentList',
    type: 'get',
    response: config => {
      // 获取请求参数
      const res = config.query
      const page = parseInt(res.page)
      const pageSize = parseInt(res.pageSize)
      const content = res.content
      const type = res.type
      const status = res.status
      // 开始
      const start = (page - 1) * pageSize
      // 结束
      const end = start + pageSize
      let result
      // 如果有内容查询条件  result赋值
      if (content) {
        result = data.data.filter(item => item.content.indexOf(content) !== -1)
      } else {
        result = data.data
      }
      // 如果有作者查询条件
      if (type) {
        result = result.filter(item => item.type === type)
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
  // 获取评论类型列表数据
  {
    url: '/comment/getCommentTypeList',
    type: 'get',
    response: config => {
      return {
        code: 20000,
        data: [{
          value: '0',
          label: '发送的评论'
        },
        {
          value: '1',
          label: '收到的评论'
        }]
      }
    }
  },
  // 获取评论状态列表数据
  {
    url: '/comment/getCommentStatusList',
    type: 'get',
    response: config => {
      return {
        code: 20000,
        data: [{
          value: '0',
          label: '待审核'
        },
        {
          value: '1',
          label: '已通过'
        },
        {
          value: '2',
          label: '回收站'
        }]
      }
    }
  },
  // 删除评论数据
  {
    url: '/comment/deleteCommentData',
    type: 'delete',
    response: config => {
      const res = config.query
      const commentId = res.commentId.split(',')
      for (let i = 0; i < commentId.length; i++) {
        data.data.some((item, index) => {
          if (item.id.toString() === commentId[i]) {
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
  // 审批评论数据
  {
    url: '/comment/approvalCommentData',
    type: 'put',
    response: config => {
      const res = config.body
      console.log(res)
      const id = res.id
      const status = res.status
      const approvalComment = res.comment
      const approvalName = 'luoxu'
      const approvalTime = formatDateTime(new Date())
      data.data.some(item => {
        if (item.id === id) {
          item.status = status
          item.approvalComment = approvalComment
          item.approvalName = approvalName
          item.approvalTime = approvalTime
          console.log(item)
        }
      })
      return {
        code: 20000,
        msg: '审批成功！'
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
