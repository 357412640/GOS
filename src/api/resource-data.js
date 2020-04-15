import axios from '@/libs/api.request'
// 资源管理——广告位管理
// 广告位列表、搜索
export const adList = (params) => {
  return axios.request({
    url: '/ad/adspace/list',
    method: 'get',
    params
  })
}
// 新建/编辑广告位保存
export const adSave = (data) => {
  return axios.request({
    url: '/ad/adspace/store',
    method: 'post',
    data
  })
}

// 编辑页获取详情
export const adDetail = (params) => {
  return axios.request({
    url: '/ad/adspace/info',
    method: 'get',
    params
  })
}

// 广告位上下线切换
export const adUpOrDown = (data) => {
  return axios.request({
    url: '/ad/adspace/update',
    method: 'post',
    data
  })
}

// 删除
export const adDelete = (data) => {
  return axios.request({
    url: '/ad/adspace/destroy',
    method: 'post',
    data
  })
}

// 资源管理——创意模板管理
// 创意模板列表、搜索
export const creativeList = (params) => {
  return axios.request({
    url: '/ad/creativemodule/list',
    method: 'get',
    params
  })
}

// 新建创意模板保存
export const creativeSave = (data) => {
  return axios.request({
    url: '/ad/creativemodule/store',
    method: 'post',
    data
  })
}

// 创意模板上下线
export const creativeUpOrDown = (data) => {
  return axios.request({
    url: '/ad/creativemodule/update',
    method: 'post',
    data
  })
}

// 创意模板删除
export const creativeDelete = (data) => {
  return axios.request({
    url: '/ad/creativemodule/destroy',
    method: 'post',
    data
  })
}

// 创意模板详情
export const creativeDetail = (params) => {
  return axios.request({
    url: '/ad/creativemodule/info',
    method: 'get',
    params
  })
}

// 创意列表
export const creList = (params) => {
  return axios.request({
    url: '/ad/creative/list',
    method: 'get',
    params
  })
}

// 保存创意
export const creSave = (data) => {
  return axios.request({
    url: '/ad/creative/store',
    method: 'post',
    data
  })
}

// 创意详情
export const creDetail = (params) => {
  return axios.request({
    url: '/ad/creative/info',
    method: 'get',
    params
  })
}

// 创意删除
export const creDelete = (data) => {
  return axios.request({
    url: '/ad/creative/destroy',
    method: 'post',
    data
  })
}

// 创意跳转列表
export const creTurnList = () => {
  return axios.request({
    url: '/ad/creative/typelist',
    method: 'get'
  })
}

// 自定义字段类型
export const getCustomList = () => {
  return axios.request({
    url: '/ad/creativemodule/customlist',
    method: 'get'
  })
}
