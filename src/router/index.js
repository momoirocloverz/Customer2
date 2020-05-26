import Vue from 'vue'
import Router from 'vue-router'
import commonRoutes from './commonRoutes'
import taskRoutes from './taskRoutes'
import outSourceMaster from './outSourceMaster'
// import privateRoutes from './privateRoutes'  // 个体户管理暂不需要
// import recruitmentRoutes from './recruitmentRoute'
import accountRoutes from './accountRoutes'
import systemRoutes from './systemRoutes'
import receivableCustomer from './receivableCustomer'
import taskTrack from './taskTrack';//任务追踪
import classService from './classService';
// 路由配置中 hidden: 在导航栏中隐藏  isCustomer: 是否在客户登录时显示
Vue.use(Router)
const routes = [
  ...commonRoutes,
  ...receivableCustomer,
  // ...privateRoutes,
  // ...recruitmentRoutes,
  ...classService,
  ...taskTrack,
     ...outSourceMaster,
  ...taskRoutes,
  ...accountRoutes,
  ...systemRoutes,   
  //...profitAnalysisTableRoutes,
  {
    path: '*',
    hidden: true,
    redirect: {
      path: '/404'
    }
  }
]
const router = new Router({
  routes
})
export default router