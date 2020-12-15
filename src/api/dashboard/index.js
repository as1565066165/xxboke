import request from '@/utils/request'

const api = {
  // 根据ip获取登录地址
  getAddress () {
    return request({
      url: '/dashboard/getAddressByIp',
      method: 'get'
    })
  },
  // 获取网站数据
  getWebsiteRecordData () {
    return request({
      url: '/dashboard/getWebsiteRecordData',
      method: 'get'
    })
  },
  // 获取近一周每日来访统计数据
  getWebsitePageViews () {
    return request({
      url: '/dashboard/getWebsitePageViews',
      method: 'get'
    })
  }
}
export default api
