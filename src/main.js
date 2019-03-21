// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'

import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import session from './components/session.js'

Vue.config.productionTip = false
Vue.use(ElementUI);

router.beforeEach((to, from, next) => {
  let roleId = session.get('roleId');
  if (to.path === '/login' && roleId) {
    // 前往登录页则删除roleId
    next();
  } else if (to.meta.requireAuth && !roleId) {
    // 未登录转向登录页
    next({ path: '/login' })
  } else if (roleId != "1002" && (to.path === '/updatetime' || to.path === '/factoryinfo')) {
    // 不是超级管理员时不能前往更新时间页面和工厂信息页面
    next({path: '/'})
  } else {
    next()
  }
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>',
  render: h => h(App)
})
