import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/components/layout/Home'

import Login from '@/components/login/Login'
import UpdateTime from '@/components/updateTime/UpdateTime'
import UserInfo from '@/components/userInfo/UserInfo'
import FactoryInfo from '@/components/factoryInfo/FactoryInfo'
import ManageUser from '@/components/manageUser/ManageUser'
import Category from '@/components/category/Category'
import Blank from '@/components/category/Blank'

Vue.use(Router)

const vueRouter = new Router({
  mode: 'history',
  routes: [
    {
      path: '/login',
      name: 'login',
      component: Login
    },{
      path: '/',
      name: 'home',
      component: Home,
      redirect: '/factory',
      children: [
        {
          path: 'factory',
          name: 'factory',
          component: Category,
          meta: {
            title: '',
            requireAuth: true,
          }
        },
        {
          path: 'factory/:factoryId',
          name: 'factory',
          component: Category,
          meta: {
            title: '',
            requireAuth: true,
          }
        }, {
          path: 'blank',
          name: 'blank',
          component: Blank,
          meta: {
            title: '',
            requireAuth: true,
          }
        },
        {
          path: 'updatetime',
          name: 'UpdateTime',
          component: UpdateTime,
          meta: {
            title: '',
            requireAuth: true,
          }
        }, {
          path: 'userinfo',
          name: 'UserInfo',
          component: UserInfo,
          meta: {
            title: '',
            requireAuth: true,
          }
        }, {
          path: 'factoryinfo',
          name: 'FactoryInfo',
          component: FactoryInfo,
          meta: {
            title: '',
            requireAuth: true,
          }
        }, {
          path: 'manageuser',
          name: 'ManageUser',
          component: ManageUser,
          meta: {
            title: '',
            requireAuth: true,
          }
        }
      ]
    }
    ,{
      path: '*',
      component: Home,
      redirect: '/'
    }
  ]
})

export default vueRouter;
