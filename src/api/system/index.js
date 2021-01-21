import request from '@/utils/request'

const api = {
  // 获取轮播图列表
  getSlideList () {
    return request({
      url: '/system/getSlideList',
      method: 'get'
    })
  },
  // 新增轮播数据
  addSlideData (data) {
    return request({
      url: `/system/addSlideData`,
      method: 'post',
      data
    })
  },
  // 删除轮播图数据
  deleteSlideData (id) {
    if (Array.isArray(id)) {
      return request({
        url: `/system/deleteSlideData?slideId=${id.join(',')}`,
        method: 'delete'
      })
    } else {
      return request({
        url: `/system/deleteSlideData?slideId=${id}`,
        method: 'delete'
      })
    }
  },
  // 编辑轮播表格数据
  editSlideData (data) {
    return request({
      url: `/system/editSlideData`,
      method: 'put',
      params: data
    })
  }
}
export default api
