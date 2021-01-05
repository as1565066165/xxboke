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
  },
  // 根据文章id获取文章数据
  queryActicleDataById (id) {
    return request({
      url: `/acticle/queryActicleDataById?acticleId=${id}`,
      method: 'get'
    })
  },
  // 获取分类表格数据
  getCategoryTableData () {
    return request({
      url: `/acticle/getCategoryTableData`,
      method: 'get'
    })
  },
  // 新增分类数据
  addCategoryData (data) {
    return request({
      url: `/acticle/addCategoryData`,
      method: 'post',
      data
    })
  },
  // 删除分类数据
  deleteCategoryData (id) {
    if (Array.isArray(id)) {
      return request({
        url: `/acticle/deleteCategoryData?categoryId=${id.join(',')}`,
        method: 'delete'
      })
    } else {
      return request({
        url: `/acticle/deleteCategoryData?categoryId=${id}`,
        method: 'delete'
      })
    }
  },
  // 编辑分类表格数据
  editCategoryData (data) {
    return request({
      url: `/acticle/editCategoryData`,
      method: 'put',
      params: data
    })
  }
}
export default api
