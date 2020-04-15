import Mock from 'mockjs'
import { login, logout, getUserInfo } from './login'
import { getTableData, getDragList } from './data'
// import adPutList from './ad-push-list'
// import * as resource from './resource-management-data'
// import msgList from './msg-list'

// 配置Ajax请求延时，可用来测试网络延迟大时项目中一些效果
Mock.setup({
  timeout: 1000
})

// 登录相关和获取用户信息
Mock.mock(/\/platform\/user\/login/, login)
Mock.mock(/\/platform\/showTree/, getUserInfo)
Mock.mock(/\/platform\/logout/, logout)
Mock.mock(/\/platform\/get_table_data/, getTableData)
Mock.mock(/\/platform\/get_drag_list/, getDragList)
Mock.mock(/\/platform\/save_error_logger/, 'success')

// 投放列表
// Mock.mock(/\/putad\/list/, adPutList.addPushList)
// Mock.mock(/\/putad\/store/, adPutList.edit)
// Mock.mock(/\/adspace\/simplelist/, adPutList.addPosition)
// Mock.mock(/\/putad\/info/, adPutList.detail)
// Mock.mock(/\/putad\/info/, adPutList.preview)
// Mock.mock(/\/putad\/preview/, adPutList.tvpreview)
// Mock.mock(/\/putad\/destroy/, adPutList.tvpreview)
// Mock.mock(/\/putad\/update/, adPutList.tvpreview)
// Mock.mock(/\/putad\/getcode/, adPutList.statusList)
// Mock.mock(/\/putad\/putdays/, adPutList.checkDate)
// Mock.mock(/\/creative\/getlist/, adPutList.creativeList)
// Mock.mock(/\/upgrade\/strategy\/group/, adPutList.groupSel)
// // Mock.mock(/\/platform\/save_error_logger/, adPutList.)
// Mock.mock(/\/ad\/putad\/data/, adPutList.getDetail)
//
// // 资源管理——广告位管理
// Mock.mock(/\/ad\/adspace\/list/, resource.adList)
// Mock.mock(/\/ad\/adspace\/store/, resource.adSave)
// Mock.mock(/\/ad\/adspace\/info/, resource.adDetail)
// Mock.mock(/\/ad\/adspace\/update/, resource.adUpOrDown)
// Mock.mock(/\/ad\/adspace\/destroy/, resource.adDelete)
//
// // 资源管理——创意模板管理
// Mock.mock(/\/ad\/creativemodule\/list/, resource.creativeList)
// Mock.mock(/\/ad\/creativemodule\/store/, resource.creativeSave)
// Mock.mock(/\/ad\/creativemodule\/update/, resource.creativeUpOrDown)
// Mock.mock(/\/ad\/creativemodule\/info/, resource.creativeDetail)
// Mock.mock(/\/ad\/creativemodule\/destroy/, resource.creativeDelete)
// Mock.mock(/\/ad\/creativemodule\/customlist/, resource.getCustomList)
//
// // 创意管理
// Mock.mock(/\/ad\/creative\/list/, resource.creList)
// Mock.mock(/\/ad\/creative\/store/, resource.creSave)
// Mock.mock(/\/ad\/creative\/info/, resource.creDetail)
// Mock.mock(/\/ad\/creative\/destroy/, resource.creDelete)
// Mock.mock(/\/ad\/creative\/typelist/, resource.creTurnList)
//
// // 消息管理
// Mock.mock(/\/ad\/message\/list/, msgList.msgList)
// Mock.mock(/\/ad\/message\/info/, msgList.msgInfo)
// Mock.mock(/\/ad\/message\/update/, msgList.msgUpdate)
// Mock.mock(/\/ad\/message\/preview/, msgList.msgPreview)
// Mock.mock(/\/ad\/message\/store/, msgList.msgStore)

export default Mock
