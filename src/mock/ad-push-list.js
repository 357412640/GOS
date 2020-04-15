export default {
  addPushList: {
    'errno': 10000,
    'errmsg': 'success',
    'data': {
      'total': 30,
      'page': 1,
      'page_size': 10,
      'data': [
        {
          'id': '5d02ffa20e1bee38e45f3861',
          'title': '名称',
          'ad_name': 'sss',
          'put_type_name': '商广',
          'remarks': '备注',
          'status': 0,
          'operator': '操作人',
          'updated_at': 0
        },
        {
          'id': '5d02ffa20e1bee38e45f3861',
          'title': '名称',
          'ad_name': 'sss',
          'put_type_name': '商广',
          'remarks': '备注',
          'status': 2,
          'operator': '操作人',
          'updated_at': 0
        }
      ]
    }
  },
  edit:
    {
      'errno': 10000,
      'errmsg': 'success',
      'data': {}
    },
  addPosition: {
    'errno': 10000,
    'errmsg': 'success',
    'data': {
      'data': [
        {
          'ad_id': '5d0224f00e1bee38e45f3847',
          'ad_title': '名称'
        }
      ]
    }
  },
  detail: {
    'errno': 10000,
    'errmsg': 'success',
    'data': {
      'id': '5d02ffa20e1bee38e45f3861',
      'title': '名称',
      'cost_type': 'cpd',
      'terminal': 'tv',
      'ad_id': '5d0224f00e1bee38e45f3847',
      'ad_name': 'xx',
      'put_type': 'business',
      'creative_id': '5d02fd1e0e1bee38e45f3858',
      'creative_title': '名称',
      'remarks': '备注',
      'front_put_day': [
        {
          'start_time': '2019-06-07',
          'end_time': '2019-06-07'
        },
        {
          'start_time': '2019-06-11',
          'end_time': '2019-06-11'
        }
      ],
      'device_orientation': {
        'orientation_type': 'all_device',
        'content': [
          'aaa',
          'bbb'
        ]
      }
    }
  },
  preview: {
    'errno': 10000,
    'errmsg': 'success',
    'data': {
      'id': '5d11d1bdfdce2704e13ea785',
      'title': '已生效',
      'cost_type': 'cpd',
      'terminal': 'tv',
      'ad_name': '广告1',
      'ad_id': '5d0224f00e1bee38e45f3847',
      'put_type': 'business',
      'creative': {
        '_id': '5d106a54fdce2705724aa567',
        'title': '创意13',
        'creative_module_id': '5d10265ffdce270573078e13',
        'material': 'https://static.ptguomei.gitv.tv/group1/M00/00/0E/CnOICFzmNGeAYV8AAAAQv7AtZug848.jpg',
        'material_verify': '555tttgfsgfgsf',
        'jump': {
          'openType': 'bestv',
          'openSubType': 'member',
          'openEpId': '',
          'openEqId': '',
          'openSpecialId': '',
          'openGameId': '',
          'openParam': '',
          'title': '11',
          'img': 'https://static.ptguomei.gitv.tv/group1/M00/00/0E/CnOICFzmNGeAYV8AAAAQv7AtZug848.jpg',
          'openAppPackage': '',
          'openAppName': '',
          'openAppId': ''
        },
        'operator': '192.168.10.1',
        'is_del': false,
        'clicks_num': 0,
        'exposures_num': 0,
        'created_at': '2019-06-24 14:14:44',
        'updated_at': '2019-06-24 14:18:20',
        'creative_module_name': '模板video',
        'pre_download': true,
        'days': 2,
        'creative_id': '5d106a54fdce2705724aa567'
      },
      'remarks': '好样的',
      'front_put_day': [
        {
          'start_time': '2019-06-23',
          'end_time': '2019-06-26'
        },
        {
          'start_time': '2019-06-23',
          'end_time': '2019-06-26'
        }
      ],
      'device_orientation': {
        'orientation_type': 'all_device',
        'content': []
      },
      'operator': '192.168.10.1',
      'stutus': 1,
      'stutus_name': '已暂停',
      'updated_at': 1561519771
    }
  },
  checkDate: {
    'errno': 10000,
    'errmsg': 'success',
    'data': {
      '2019-06-19': [
        {
          'id': 'ssssssssss',
          'title': '投放名称',
          'status': 3
        }
      ],
      '2019-06-20': [
        {
          'id': 'ssssssssss',
          'title': '投放名称',
          'status': 1
        }
      ]
    }
  },
  creativeList: {
    'errno': 10000,
    'errmsg': 'success',
    'data': {
      'list': [
        {
          'title': '创意13',
          'id': '5d106a54fdce2705724aa567'
        }
      ]
    }
  },
  groupSel:
    {
      'errno': 10000,
      'errmsg': 'success',
      'data': {
        'list': {
          'G22': [
            {
              'group_name': '测试',
              'group_id': 25,
              'model_name': 'G22',
              'model_id': 31
            },
            {
              'group_name': '测试1',
              'group_id': 28,
              'model_name': 'G22',
              'model_id': 31
            }
          ],
          'G19': [
            {
              'group_name': 'test',
              'group_id': 27,
              'model_name': 'G19',
              'model_id': 28
            }
          ]
        }
      }
    },
  tvpreview: {
    'errno': 10000,
    'errmsg': 'success',
    'data': {}
  },
  statusList: {
    'errno': 10000,
    'errmsg': 'success',
    'data': {
      'list': [
        {
          'code': -1,
          'name': '全部'
        },
        {
          'code': 0,
          'name': '暂存'
        },
        {
          'code': 1,
          'name': '已暂停'
        },
        {
          'code': 2,
          'name': '已下线'
        },
        {
          'code': 3,
          'name': '投放中'
        },
        {
          'code': 4,
          'name': '待投放'
        },
        {
          'code': 5,
          'name': '间歇中'
        },
        {
          'code': 6,
          'name': '已完成'
        },
        {
          'code': 8,
          'name': '已上线'
        }
      ]
    }
  },
  getDetail: {
    'errno': 10000,
    'errmsg': 'success',
    'data': {
      '2019-09-23': {
        'click_num': 8,
        'click_people_num': 2,
        'exposure_num': 4745,
        'exposure_people_num': 5,
        'click_rate': 0
      },
      '2019-09-24': {
        'click_num': 1,
        'click_people_num': 1,
        'exposure_num': 8107,
        'exposure_people_num': 5,
        'click_rate': 0
      },
      '2019-09-25': {
        'click_num': 0,
        'click_people_num': 0,
        'exposure_num': 5354,
        'exposure_people_num': 2,
        'click_rate': 0
      },
      '2019-09-26': {
        'click_num': 0,
        'click_people_num': 0,
        'exposure_num': 3335,
        'exposure_people_num': 4,
        'click_rate': 0
      }
    }
  }
}
