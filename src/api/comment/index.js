import request from '@/utils/request'

const api = {
  // 分页获取评论列表
  getCommentList (data) {
    return request({
      url: '/comment/getCommentList',
      method: 'get',
      params: data
    })
  },
  // 获取评论类型列表
  getCommentTypeList () {
    return request({
      url: '/comment/getCommentTypeList',
      method: 'get'
    })
  },
  // 获取评论状态列表
  getCommentStatusList () {
    return request({
      url: '/comment/getCommentStatusList',
      method: 'get'
    })
  },
  // 删除评论数据
  deleteCommentData (id) {
    if (Array.isArray(id)) {
      return request({
        url: `/comment/deleteCommentData?commentId=${id.join(',')}`,
        method: 'delete'
      })
    } else {
      return request({
        url: `/comment/deleteCommentData?commentId=${id}`,
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
