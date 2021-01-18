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
  // 获取用户状态列表
  getUserStatusList () {
    return request({
      url: '/user/getUserStatusList',
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
  // 审批评论数据
  approvalCommentData (data) {
    return request({
      url: '/comment/approvalCommentData',
      method: 'put',
      data
    })
  }
}
export default api
