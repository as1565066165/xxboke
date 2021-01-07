import request from '@/utils/request'
// import { keysMappingReverse, keysMapping } from '@/utils/keysMapping'
// const mapping = {
//   value: 'name'
// }
const api = {
  // 分页获取文章列表
  getArticleList (data) {
    return request({
      url: '/article/getArticleList',
      method: 'get',
      params: data
    })
  },
  // 获取文章状态列表
  getArticleStatusList () {
    return request({
      url: '/article/getArticleStatusList',
      method: 'get'
    })
  },
  // 删除文章数据
  deleteArticleData (id) {
    if (Array.isArray(id)) {
      return request({
        url: `/article/deleteArticleData?articleId=${id.join(',')}`,
        method: 'delete'
      })
    } else {
      return request({
        url: `/article/deleteArticleData?articleId=${id}`,
        method: 'delete'
      })
    }
  },
  // 根据文章id获取文章数据
  queryArticleDataById (id) {
    return request({
      url: `/article/queryArticleDataById?articleId=${id}`,
      method: 'get'
    })
  },
  // 获取分类表格数据
  getCategoryTableData () {
    return request({
      url: `/article/getCategoryTableData`,
      method: 'get'
    })
  },
  // 新增分类数据
  addCategoryData (data) {
    return request({
      url: `/article/addCategoryData`,
      method: 'post',
      data
    })
  },
  // 删除分类数据
  deleteCategoryData (id) {
    if (Array.isArray(id)) {
      return request({
        url: `/article/deleteCategoryData?categoryId=${id.join(',')}`,
        method: 'delete'
      })
    } else {
      return request({
        url: `/article/deleteCategoryData?categoryId=${id}`,
        method: 'delete'
      })
    }
  },
  // 编辑分类表格数据
  editCategoryData (data) {
    return request({
      url: `/article/editCategoryData`,
      method: 'put',
      params: data
    })
  },
  // 获取标签列表数据
  getTagList (data) {
    if (data) {
      return request({
        url: `/article/getTagList`,
        method: 'get',
        params: data
      })
    } else {
      return request({
        url: `/article/getAllTagList`,
        method: 'get'
      })
      //   .then(resp => {
      //   // eslint-disable-next-line no-return-assign
      //   resp.data = keysMappingReverse(resp.data, mapping)
      //   resp.status = 200
      //   return resp
      // }).catch(err => err)
    }
  },
  // 新增标签数据
  addTagData (data) {
    return request({
      url: `/article/addTagData`,
      method: 'post',
      data
    })
  },
  // 删除标签数据
  deleteTagData (id) {
    return request({
      url: `/article/deleteTagData?tagId=${id}`,
      method: 'delete'
    })
  },
  // 编辑分类表格数据
  editTagData (data) {
    return request({
      url: `/article/editTagData`,
      method: 'put',
      params: data
    })
  }
}
export default api
