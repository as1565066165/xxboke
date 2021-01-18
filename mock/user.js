const Mock = require('mockjs')
const { pinyin } = require('pinyin-pro')
const tokens = {
  admin: {
    token: 'admin-token'
  },
  editor: {
    token: 'editor-token'
  }
}

const users = {
  'admin-token': {
    roles: ['admin'],
    introduction: 'I am a super administrator',
    avatar: 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif',
    name: 'Super Admin'
  },
  'editor-token': {
    roles: ['editor'],
    introduction: 'I am an editor',
    avatar: 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif',
    name: 'Normal Editor'
  }
}

const data = Mock.mock({
  'data|100': [
    {
      id: '@natural()',
      'userName|1': ['@cword(2,13)', '@first()'],
      name: '@cname()',
      ename: function () {
        return pinyin(this.name, { tone: false })
      },
      avatar: "@image('40x40','@color()')",
      email: "@email('qq.com')",
      'status|1': ['0', '1'],
      'role|1': ['admin', 'normal'],
      registerTime: "@date('yyyy-MM-dd HH:mm:ss')"
    }
  ]
})

module.exports = [
  // user login
  {
    url: '/vue-admin-template/user/login',
    type: 'post',
    response: config => {
      const { username } = config.body
      const token = tokens[username]

      // mock error
      if (!token) {
        return {
          code: 60204,
          message: 'Account and password are incorrect.'
        }
      }

      return {
        code: 20000,
        data: token
      }
    }
  },

  // get user info
  {
    url: '/vue-admin-template/user/info\.*',
    type: 'get',
    response: config => {
      const { token } = config.query
      const info = users[token]

      // mock error
      if (!info) {
        return {
          code: 50008,
          message: 'Login failed, unable to get user details.'
        }
      }

      return {
        code: 20000,
        data: info
      }
    }
  },

  // user logout
  {
    url: '/vue-admin-template/user/logout',
    type: 'post',
    response: _ => {
      return {
        code: 20000,
        data: 'success'
      }
    }
  },
  // 获取用户列表
  {
    url: '/user/getUserList',
    type: 'get',
    response: config => {
      // 获取请求参数
      const res = config.query
      const page = parseInt(res.page)
      const pageSize = parseInt(res.pageSize)
      const name = res.name
      const role = res.role
      const email = res.email
      const status = res.status
      const userName = res.userName
      const dateTime = res.dateTime
      const startDate = +new Date(dateTime[0])
      const endDate = +new Date(dateTime[dateTime.length - 1])
      // 开始
      const start = (page - 1) * pageSize
      // 结束
      const end = start + pageSize
      let result
      // 如果有名称查询条件  result赋值
      if (name) {
        result = data.data.filter(item => item.name.indexOf(name) !== -1)
      } else {
        result = data.data
      }
      // 如果有邮箱查询条件
      if (email) {
        result = result.filter(item => item.email.indexOf(email) !== -1)
      }
      // 如果有昵称查询条件
      if (userName) {
        result = result.filter(item => item.userName.indexOf(userName) !== -1)
      }
      // 如果有角色查询条件
      if (role) {
        result = result.filter(item => item.role === role)
      }
      // 如果有状态查询条件
      if (status) {
        result = result.filter(item => item.status === status)
      }
      // 如果有时间查询条件
      if (startDate && endDate) {
        result = result.filter(item => +new Date(item.registerTime) >= startDate)
        result = result.filter(item => +new Date(item.registerTime) <= endDate)
      } else if (startDate) {
        result = result.filter(item => +new Date(item.registerTime) >= startDate)
      } else if (endDate) {
        result = result.filter(item => +new Date(item.registerTime) <= endDate)
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
  // 获取用户类型列表数据
  {
    url: '/user/getUserTypeList',
    type: 'get',
    response: config => {
      return {
        code: 20000,
        data: [{
          value: 'normal',
          label: '普通用户'
        },
        {
          value: 'admin',
          label: '超级管理员'
        }]
      }
    }
  },
  // 获取用户状态列表数据
  {
    url: '/user/getUserStatusList',
    type: 'get',
    response: config => {
      return {
        code: 20000,
        data: [
          {
            value: '1',
            label: '激活'
          },
          {
            value: '0',
            label: '未激活'
          }]
      }
    }
  },
  // 删除用户数据
  {
    url: '/user/deleteUserData',
    type: 'delete',
    response: config => {
      const res = config.query
      const userId = res.userId.split(',')
      for (let i = 0; i < userId.length; i++) {
        data.data.some((item, index) => {
          if (item.id.toString() === userId[i]) {
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
