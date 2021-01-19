import request from '@/utils/request'

const api = {
  // 分页获取用户列表
  getUserList (data) {
    return request({
      url: '/user/getUserList',
      method: 'get',
      params: data
    })
  },
  // 获取用户类型列表
  getUserTypeList () {
    return request({
      url: '/user/getUserTypeList',
      method: 'get'
    })
  },
  // 新增用户信息
  addUserData (data) {
    // 转换status状态的值
    if (data.status) {
      data.status = '1'
    } else {
      data.status = '0'
    }
    // 删除confirmPassword属性
    delete data.confirmPassword
    return request({
      url: '/user/addUserData',
      method: 'post',
      data
    })
  },
  // 获取用户状态列表
  getUserStatusList () {
    return request({
      url: '/user/getUserStatusList',
      method: 'get'
    })
  },
  // 分页获取用户列表
  queryUserDataById (id) {
    return request({
      url: `/user/queryUserDataById?userId=${id}`,
      method: 'get'
    })
  },
  // 删除用户数据
  deleteUserData (id) {
    if (Array.isArray(id)) {
      return request({
        url: `/user/deleteUserData?userId=${id.join(',')}`,
        method: 'delete'
      })
    } else {
      return request({
        url: `/user/deleteUserData?userId=${id}`,
        method: 'delete'
      })
    }
  },
  // 编辑用户信息
  editUserData (data) {
    // 转换status状态的值
    if (data.status) {
      data.status = '1'
    } else {
      data.status = '0'
    }
    return request({
      url: '/user/editUserData',
      method: 'put',
      data
    })
  },
  // 修改用户密码
  editUserPassword (data) {
    // 删除confirmPassword属性
    delete data.confirmPassword
    return request({
      url: '/user/editUserPassword',
      method: 'put',
      data
    })
  }
}
export default api
