import Vue from 'vue'
import Router from 'vue-router'
import routes from './routers'
import store from '@/store'
import iView from 'iview'
import { canTurnTo } from '@/libs/util'

Vue.use(Router)
const router = new Router({
  routes,
  mode: 'history'
})
const LOGIN_PAGE_NAME = 'login'
const FORBID_PAGE_NAME = 'forbid'

const turnTo = (to, access, next) => {
  if (canTurnTo(to.name, access, routes)) next() // 有权限，可访问
  else next({ replace: true, name: 'error_401' }) // 无权限，重定向到401页面
}

router.beforeEach((to, from, next) => {
  iView.LoadingBar.start()
  if (to.name === LOGIN_PAGE_NAME || to.name === FORBID_PAGE_NAME) {
    next()
  } else {
    if (store.state.user.hasGetInfo) {
      if (store.state.user.is_admin === 1) {
        next()
      } else {
        turnTo(to, store.state.user.menu, next)
      }
    } else {
      store.dispatch('getUserInfo').then(res => {
        let data, menu
        if (res.errno === 10001) {
          next({
            name: 'login'
          })
        } else if (res.errno === 10002) {
          next({
            name: 'forbid'
          })
        } else {
          data = res.data || {}
          menu = data.menu || []
          // store.commit('setPlatformName', '123')
          if (data.is_inactivity === 1) {
            next({
              name: 'forbid'
            })
          } else if (data.is_admin === 1) {
            next()
          } else {
            turnTo(to, menu, next)
          }
        }
      })
    }
  }
})

router.afterEach(to => {
  iView.LoadingBar.finish()
  window.scrollTo(0, 0)
})

export default router
