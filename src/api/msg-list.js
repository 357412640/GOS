import axios from '@/libs/api.request'

// 消息列表
export const msgList = (params) => {
  return axios.request({
    url: '/ad/message/list',
    method: 'get',
    params
  })
}

// 消息详情
export const msgInfo = (params) => {
  return axios.request({
    url: '/ad/message/info',
    method: 'get',
    params
  })
}

// 消息启动停用
export const msgUpdate = (data) => {
  return axios.request({
    url: '/ad/message/update',
    method: 'post',
    data
  })
}

// 消息预览
export const msgPreview = (data) => {
  return axios.request({
    url: '/ad/message/preview',
    method: 'post',
    data
  })
}

// 新建编辑保存
export const msgStore = (data) => {
  return axios.request({
    url: '/ad/message/store',
    method: 'post',
    data
  })
}
