import axios from '@/libs/http'
import http from '@/libs/api.request'

export const reqList = data => { return axios.get('/ad/putad/list', data) }
export const reqEdit = data => { return axios.send('/ad/putad/store', data) }
export const reqadList = data => { return axios.get('/ad/adspace/simplelist', data) }
export const reqDetail = data => { return axios.get('/ad/putad/info', data) }
export const reqPutPreview = data => { return axios.get('/ad/putad/info', data) }
export const reqDatePreview = data => { return axios.get('/ad/putad/putdays', data) }
export const TVPreview = data => { return axios.send('/ad/putad/preview', data) }
export const reqDestroy = data => { return axios.send('/ad/putad/destroy', data) }
export const reqPpdate = data => { return axios.send('/ad/putad/update', data) }
export const reqStatusList = data => { return axios.get('/ad/putad/getcode', data) }
// export const reqDatePreview = data => { return axios.get('/putad/putdays', data) }
export const reqcreativeList = data => { return axios.get('/ad/creative/getlist', data) }
export const reqcreativeDetail = data => { return axios.get('/ad/creative/info', data) }
export const reqStrategyGroup = data => { return axios.get('/ad/upgrade/strategy/group', data) }

// 数据详情
export const getDetail = (params) => {
  return http.request({
    url: '/ad/putad/data',
    method: 'get',
    params
  })
}
