import Main from '@/components/main'

/**
 * iview-admin中meta除了原生参数外可配置的参数:
 * meta: {
 *  title: { String|Number|Function }
 *         显示在侧边栏、面包屑和标签栏的文字
 *         使用'{{ 多语言字段 }}'形式结合多语言使用，例子看多语言的路由配置;
 *         可以传入一个回调函数，参数是当前路由对象，例子看动态路由和带参路由
 *  hideInBread: (false) 设为true后此级路由将不会出现在面包屑中，示例看QQ群路由配置
 *  hideInMenu: (false) 设为true后在左侧菜单不会显示该页面选项
 *  notCache: (false) 设为true后页面在切换标签后不会缓存，如果需要缓存，无需设置这个字段，而且需要设置页面组件name属性和路由配置的name一致
 *  access: (null) 可访问该页面的权限数组，当前路由设置的权限会影响子路由
 *  icon: (-) 该页面在左侧菜单、面包屑和标签导航处显示的图标，如果是自定义图标，需要在图标名称前加下划线'_'
 *  beforeCloseName: (-) 设置该字段，则在关闭当前tab页时会去'@/router/before-close.js'里寻找该字段名对应的方法，作为关闭前的钩子函数
 * }
 */

export default [
  {
    path: '/login',
    name: 'login',
    meta: {
      title: 'Login - 登录',
      hideInMenu: true
    },
    component: () => import('@/view/login/login.vue')
  },
  {
    path: '/view/system_management',
    name: 'system_management',
    component: Main,
    meta: {
      title: '系统管理'
    },
    children: [
      {
        path: 'role_management',
        name: 'role_management',
        meta: {
          title: '角色管理',
          // notCache: true,
          key: 'role_management'
        },
        component: () => import('@/view/system-management/role-management/role-management.vue')
      },
      {
        path: 'role_add',
        name: 'role_management',
        meta: {
          title: '角色添加',
          hideInMenu: true
        },
        component: () => import('@/view/system-management/role-add/role-add')
      },
      {
        path: 'role_edit',
        name: 'role_management',
        meta: {
          title: '角色修改',
          hideInMenu: true
        },
        component: () => import('@/view/system-management/role-add/role-add')
      },
      {
        path: 'user_management',
        name: 'user_management',
        meta: {
          title: '用户管理',
          key: 'user_management'
        },
        component: () => import('@/view/system-management/user-management/user-management.vue')
      }
    ]
  },
  {
    path: '/view/resource_management',
    name: 'resource_management',
    component: Main,
    meta: {
      title: '资源管理'
    },
    children: [
      {
        path: 'advertising_management',
        name: 'advertising_management',
        meta: {
          title: '广告位管理',
          key: 'advertising_management'
        },
        component: () => import('@/view/resource-management/advertising-management/advertising-management')
      },
      {
        path: 'advertising_add',
        name: 'advertising_management',
        meta: {
          title: '广告位添加',
          hideTab: true,
          hideInMenu: true,
          name: 'advertising_management'
        },
        component: () => import('@/view/resource-management/advertising-management/advertising-add')
      },
      {
        path: 'advertising_edit',
        name: 'advertising_management',
        meta: {
          title: '广告位编辑',
          hideTab: true,
          hideInMenu: true,
          name: 'advertising_management'
        },
        component: () => import('@/view/resource-management/advertising-management/advertising-add')
      },
      {
        path: 'creative_module_management',
        name: 'creative_module_management',
        meta: {
          title: '创意模板管理',
          key: 'creative_module_management'
        },
        component: () => import('@/view/resource-management/creative-management/creative-management')
      },
      {
        path: 'creative_add',
        name: 'creative_module_management',
        meta: {
          title: '创意模板添加',
          hideTab: true,
          hideInMenu: true,
          name: 'creative_module_management'
        },
        component: () => import('@/view/resource-management/creative-management/creative-add')
      },
      {
        path: 'creative_edit',
        name: 'creative_module_management',
        meta: {
          title: '创意模板编辑',
          hideTab: true,
          hideInMenu: true,
          name: 'creative_module_management'
        },
        component: () => import('@/view/resource-management/creative-management/creative-add')
      }
    ]
  },
  {
    path: '/view/ad_push_management',
    name: 'ad_push_management',
    component: Main,
    meta: {
      title: '投放管理',
      notCache: true
    },
    children: [
      {
        path: 'ad_push_list',
        name: 'ad_push_list',
        meta: {
          title: '投放列表',
          key: 'ad_push_list',
          notCache: true
        },
        component: () => import('@/view/ad-push-management/ad-push-list/list')
      },
      {
        path: 'creative_management',
        name: 'creative_management',
        meta: {
          title: '创意管理',
          notCache: true,
          key: 'creative_management'
        },
        component: () => import('@/view/ad-push-management/creative-management/list')
      },
      {
        path: 'edit-page',
        name: 'edit-page',
        meta: {
          name: 'ad_push_list',
          hideInMenu: true,
          hideTab: true,
          title: '新建投放',
          notCache: true
        },
        component: () => import('@/view/ad-push-management/ad-push-list/editpage')
      },
      {
        path: 'data-detail',
        name: 'data-detail',
        meta: {
          name: 'ad_push_list',
          hideInMenu: true,
          hideTab: true,
          title: '数据详情',
          notCache: true
        },
        component: () => import('@/view/ad-push-management/ad-push-list/dataDetail')
      },
      {
        path: 'calender-page',
        name: 'calender-page',
        meta: {
          name: 'ad_push_list',
          hideInMenu: true,
          hideTab: true,
          title: '查看排期',
          notCache: true
        },
        component: () => import('@/view/ad-push-management/ad-push-list/calender-page')
      },
      {
        path: 'creative_add',
        name: 'creative_management',
        meta: {
          title: '创意添加',
          hideTab: true,
          hideInMenu: true,
          name: 'creative_management'
        },
        component: () => import('@/view/ad-push-management/creative-management/add')
      },
      {
        path: 'creative_edit',
        name: 'creative_management',
        meta: {
          title: '创意编辑',
          hideTab: true,
          hideInMenu: true,
          name: 'creative_management'
        },
        component: () => import('@/view/ad-push-management/creative-management/add')
      }
    ]
  },
  {
    path: '/view/msg_management',
    name: 'msg_management',
    component: Main,
    meta: {
      title: '消息管理'
    },
    children: [
      {
        path: 'msg_list',
        name: 'msg_list',
        meta: {
          title: '消息列表',
          key: 'msg_list'
        },
        component: () => import('@/view/msg-management/msg-list/list.vue')
      },
      {
        path: 'msg_add',
        name: 'msg_list',
        meta: {
          name: 'msg_list',
          title: '新建消息',
          hideTab: true,
          hideInMenu: true
        },
        component: () => import('@/view/msg-management/msg-list/add.vue')
      },
      {
        path: 'msg_edit',
        name: 'msg_list',
        meta: {
          name: 'msg_list',
          title: '编辑消息',
          hideTab: true,
          hideInMenu: true
        },
        component: () => import('@/view/msg-management/msg-list/add.vue')
      },
      {
        path: 'msg_copy',
        name: 'msg_list',
        meta: {
          name: 'msg_list',
          title: '复制消息',
          hideTab: true,
          hideInMenu: true
        },
        component: () => import('@/view/msg-management/msg-list/add.vue')
      }
    ]
  },
  {
    path: '/',
    name: '_home',
    redirect: '/home',
    component: Main,
    meta: {
      hideInMenu: true,
      notCache: true
    },
    children: [
      {
        path: '/home',
        name: 'home',
        meta: {
          hideInMenu: true,
          title: '首页',
          notCache: true,
          icon: 'md-home'
        },
        component: () => import('@/view/single-page/home')
      }
    ]
  },
  {
    path: '/error_logger',
    name: 'error_logger',
    meta: {
      hideInBread: true,
      hideInMenu: true
    },
    component: Main,
    children: [
      {
        path: 'error_logger_page',
        name: 'error_logger_page',
        meta: {
          icon: 'ios-bug',
          title: '错误收集'
        },
        component: () => import('@/view/single-page/error-logger.vue')
      }
    ]
  },
  {
    path: '/401',
    name: 'forbid',
    meta: {
      hideInMenu: true
    },
    component: () => import('@/view/error-page/401.vue')
  },
  {
    path: '/500',
    name: 'error_500',
    meta: {
      hideInMenu: true
    },
    component: () => import('@/view/error-page/500.vue')
  },
  {
    path: '*',
    name: 'error_404',
    meta: {
      hideInMenu: true
    },
    component: () => import('@/view/error-page/404.vue')
  }
]
