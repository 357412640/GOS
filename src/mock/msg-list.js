export default {
  // 消息列表
  msgList: {
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
          'ad_title': '广告位名称',
          'status': 0,
          'create_time': '0',
          'modify_time': '0',
          'modify_user': 'admin',
          'predict_num': 100,
          'receive_num': 80
        }
      ]
    }
  },

  // 消息详情
  msgInfo: {
    'errno': 10000,
    'errmsg': 'success',
    'data': {
      'id': '5d0224f00e1bee38e45f3847',
      'title': '广告标题',
      'put_type': 'business ',
      'terminal': 'tv',
      'ad_id': 1,
      'creative_module_id': 2,
      'popul_id': 1,
      'remark': '说明内容',
      'send_type': 1,
      'set_time': 1574061094,
      'valid_time': 1574061094,
      'creative': {
        'title': '创意标题',
        'content': '创意内容',
        'material': 'http://test.zz.com/vidzz',
        'material_preview': 'http://test.zz.com/vidzz',
        'is_focus': 0,
        'message_level': 0,
        'show_scene': 1,
        'jump': {
          'title': '跳转视频'
        }
      },
      'device_orientation': {
        'orientation_type': 'all_device',
        'url': 'http://test.zz.com/vidzz',
        'filename': '',
        'content': ''
      }
    }
  },

  // 消息启动停用
  msgUpdate: {
    'errno': 10000,
    'errmsg': 'success',
    'data': {

    }
  },

  // 消息预览
  msgPreview: {
    'errno': 10000,
    'errmsg': 'success',
    'data': {
      'msg_id': '5d313d0ed22980304b301c12'
    }
  },

  // 新建编辑保存
  msgStore: {
    'errno': 10000,
    'errmsg': 'success',
    'data': {

    }
  }
}
