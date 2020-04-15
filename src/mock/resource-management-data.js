// 资源管理
// =======广告管理=======
// 广告位列表、搜索/adspace/list
export const adList = req => {
  return {
    'errno': 10000,
    'errmsg': 'success',
    'data': {
      'total': 1,
      'page': 1,
      'page_size': 10,
      'data': [
        {
          'id': '5d0224f00e1bee38e45f3847',
          'title': '名称',
          'identification': '标识',
          'terminal': 'tv',
          'creative_module': [
            {
              'creative_module_id': '5d0224f00e1bee38e45f3847',
              'title': '创意模板1'
            },
            {
              'creative_module_id': '5d0224f00e1bee38e45f3846',
              'title': '创意模板2'
            }
          ],
          'status': 0
        },
        {
          'id': '5d0224f00e1bee38e45f3847',
          'title': '名称',
          'identification': '标识',
          'terminal': 'tv',
          'creative_module': [
            {
              'id': '5d0224f00e1bee38e45f3847',
              'name': '创意模板1'
            },
            {
              'id': '5d0224f00e1bee38e45f3846',
              'name': '创意模板2'
            }
          ],
          'status': 1
        }
      ]
    }
  }
}
// 新建/编辑广告位保存
export const adSave = req => {
  return {
    'errno': 10000,
    'errmsg': 'success',
    'data': {

    }
  }
}

// 编辑页获取详情
export const adDetail = req => {
  return {
    'errno': 10000,
    'errmsg': 'success',
    'data': {
      'id': '5d0224f00e1bee38e45f3847',
      'title': '名称',
      'identification': '标识',
      'terminal': 'tv',
      'description': '说明',
      'example_img': '效果示例',
      'creative_module': [
        {
          'id': '5d0224f00e1bee38e45f3847',
          'title': '创意模板1'
        },
        {
          'id': '5d0224f00e1bee38e45f3846',
          'title': '创意模板2'
        }
      ],
      'strategy': 'all'
    }
  }
}

// 广告位上下线切换
export const adUpOrDown = req => {
  return {
    'errno': 10000,
    'errmsg': 'success',
    'data': {

    }
  }
}

// 删除
export const adDelete = req => {
  return {
    'errno': 10000,
    'errmsg': 'success',
    'data': {

    }
  }
}

// =======创意模板管理=======
// 创意模板列表、搜索
export const creativeList = req => {
  return {
    'errno': 10000,
    'errmsg': 'success',
    'data': {
      'total': 1,
      'page': 1,
      'page_size': 10,
      'data': [
        {
          'creative_module_id': '5d0224f00e1bee38e45f3847',
          'title': '创意模板1',
          'description': '说明',
          'status': 0,
          'operator': '操作人',
          'updated_at': 0
        },
        {
          'creative_module_id': '5d0224f00e1bee38e45f3846',
          'title': '创意模板2',
          'description': '说明',
          'status': 1,
          'operator': '操作人',
          'updated_at': 0
        }
      ]
    }
  }
}

// 新建创意模板保存
export const creativeSave = req => {
  return {
    'errno': 10000,
    'errmsg': 'success',
    'data': {

    }
  }
}

// 创意模板上下线
export const creativeUpOrDown = req => {
  return {
    'errno': 10000,
    'errmsg': 'success',
    'data': {

    }
  }
}

export const creativeDelete = req => {
  return {
    'errno': 10000,
    'errmsg': 'success',
    'data': {

    }
  }
}

// 创意模板详情
export const creativeDetail = req => {
  return {
    'errno': 10000,
    'errmsg': 'success',
    'data': {
      'creative_module_id': '5d10265ffdce270573078e13',
      'title': '模板video',
      'description': 'ssss',
      'material_type': 'video',
      'material': {
        'width': 123,
        'height': 123,
        'size': 0.1,
        'video_duration': 123,
        'condition': 'lte',
        'suffix': 'mp4',
        'restrict': '1080P',
        'voice_type': 'aac'
      },
      'pre_download': 'false',
      'days': 2,
      'example_img': 'https://api.ptguomei.gitv.tv/ad/',
      'operator': '192.168.10.1',
      'updated_at': 1561339487,
      'status': 1,
      "custom_fields": [
        {
          "name": "自定义字符串",
          "identification": "custom_string",
          "type": "string",
          "required": true,
          "locked": true,
          "help": "帮助",
          "default": "",
          "long_min": 0,
          "long_max": 0
        }
      ]
    }
  }
}

// 创意=========
// 创意列表
export const creList = req => {
  return {
    'errno': 10000,
    'errmsg': 'success',
    'data': {
      'total': 1,
      'page': 1,
      'page_size': 10,
      'data': [
        {
          'id': '5d02ffa20e1bee38e45f3861',
          'title': '名称',
          'creative_module_name': '创意模板',
          'operator': '操作人',
          'updated_at': 123
        }
      ]
    }
  }
}

// 保存创意
export const creSave = req => {
  return {
    'errno': 10000,
    'errmsg': 'success',
    'data': {}
  }
}

// 创意详情
export const creDetail = req => {
  return {
    'errno': 10000,
    'errmsg': 'success',
    'data': {
      'id': '5d02ffa20e1bee38e45f3861',
      'title': '名称',
      'creative_module_id': '5d0224f00e1bee38e45f3847',
      'creative_module_name': '模板名称',
      'pre_download': true,
      'days': 2,
      'material': 'video',
      'jump': {
        'openType': 'qiyi',
        'openSubType': 'video',
        'openEpId': '123',
        'openEqId': '',
        'openSpecialId': '',
        'openGameId': '',
        'openParam': '',
        'title': '11',
        'img': 'https://static.ptguomei.gitv.tv/group1/M00/00/0E/CnOICFzmNGeAYV8AAAAQv7AtZug848.jpg',
        'openAppPackage': '',
        'openAppName': '',
        'openAppId': ''
      }
    }
  }
}

// 创意删除
export const creDelete = req => {
  return {
    'errno': 10000,
    'errmsg': 'success',
    'data': {}
  }
}

// 跳转列表
export const creTurnList = req => {
  return {
    'errno': 10000,
    'errmsg': 'success',
    'data': {
      'name': '跳转类型',
      'description': '一级跳转',
      'formType': 'select',
      'list': [
        {
          'key': 'openType',
          'value': 'qiyi',
          'description': '爱奇艺',
          'default': false,
          'formType': 'select',
          'list': [
            {
              'name': '类型',
              'key': 'openSubType',
              'value': 'video',
              'description': '视频',
              'default': false,
              'formType': 'input',
              'list': [
                {
                  'name': '资源ID',
                  'key': 'openEpId',
                  'valueType': 'string',
                  'description': '视频 ID',
                  'default': false,
                  'required': true
                }
              ]
            }
          ]
        }
      ] }
  }
}

// 自定义字段类型
export const getCustomList = req => {
  return {
    'errno': 10000,
    'errmsg': 'success',
    'data': [
      {
        '_id': '5e4261e7c20deb305b729be3',
        'name': '字符串',
        'type': 'string',
        'default': '', // string 默认值
        'long_min': 0, // int, 范围小
        'long_max': 0 // int, 范围大
      },
      {
        '_id': '5e4262bec20deb305b729be4',
        'name': '数字',
        'type': 'numeric',
        'default': 0, // int, 默认值
        'long_min': 0, // int, 范围小
        'long_max': 0 // int, 范围大
      },
      {
        '_id': '5e4263e4c20deb305b729be7',
        'name': '单选',
        'type': 'single_choice',
        'option': [] // 选项
      },
      {
        '_id': '5e4266d9c20deb305b729be8',
        'name': '多选',
        'type': 'multiple_choice',
        'option': [] // 选项
      },
      {
        '_id': '5e42675dc20deb305b729be9',
        'name': '日期时间',
        'type': 'datetime',
        'min_unit': '' // 单位，day 天；时 hour；分 minute；秒 second；
      },
      {
        '_id': '5e426784c20deb305b729bea',
        'name': '图片',
        'type': 'img',
        'width': 0, // int, 图片宽
        'height': 0, // int, 图片高
        'condition': 'lte', // string , lte 小于等于；gte 大于等于
        'size': 0, // int, 大小
        'suffix': 'jpg,png,gif,jpeg,bmp,webp' // string 格式
      },
      {
        '_id': '5e426a4ac20deb305b729beb',
        'name': '视频',
        'type': 'video',
        'condition': 'lte', // string , lte 小于等于；gte 大于等于
        'width': 0, // int, 视频宽
        'height': 0, // int, 视频高
        'restrict': '', // string ,视频限制
        'size': 0, // int 视频大小
        'suffix': 'mp4,mkv,avi,rm,vob', // string 视频格式
        'video_duration': 0, // int, 时长 单位：秒
        'voice_type': 'aac,mp3,wav,wmv,cda'// string 音频格式
      },
      {
        '_id': '5e426c3bc20deb305b729bec',
        'name': '跳转',
        'type': 'jump' // 请求跳转接口
      }
    ]
  }
}
