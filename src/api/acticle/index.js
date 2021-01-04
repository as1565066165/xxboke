import request from '@/utils/request'

const api = {
  // 分页获取文章列表
  getActicleList (data) {
    return request({
      url: '/acticle/getActicleList',
      method: 'get',
      params: data
    })
  },
  // 获取文章状态列表
  getArticleStatusList () {
    return request({
      url: '/acticle/getArticleStatusList',
      method: 'get'
    })
  },
  // 删除文章数据
  deleteActicleData (id) {
    if (Array.isArray(id)) {
      return request({
        url: `/acticle/deleteActicleData?acticleId=${id.join(',')}`,
        method: 'delete'
      })
    } else {
      return request({
        url: `/acticle/deleteActicleData?acticleId=${id}`,
        method: 'delete'
      })
    }
  }
}
export default api
