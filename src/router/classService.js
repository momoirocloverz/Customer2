// 客户模块
import profitAnalysisTableRoutes from './profitAnalysisTableRoutes';
import projectManagerRoutes from './projectManagerRoutes'//班务经理
import classManage from './classManage';    //班务管理
// import classTaskManage from './classTaskManage';    //班务管理
import workderRoutes from './workerRoutes'  //零工管理
import scheduleRoutes from './scheduleRoutes' //排版管理
import attendenceRoutes from './attendenceRoutes'//考勤管理
import payableRoutes from './payableRoutes'
import awardAndPunishment from "./awardAndPunishment";
import invoiceRoutes from "./invoiceRoutes";
import customerRoutes from "./customerRoutes"; //yingfu
const Home = () => import( '../views/Home.vue');

const routes = [{
    path: "/classService",
    alias: '班务执行',
    name: 'classService',
    // hidden: true,
    showTop: true,
    component: Home,
    // iconCls: 'icon-classManager',
    children: [
        ...projectManagerRoutes,
        ...workderRoutes,
        ...classManage,
        ...scheduleRoutes,
        ...attendenceRoutes,
        ...payableRoutes,
        ...awardAndPunishment,
        ...invoiceRoutes,
        ...customerRoutes,
        ...profitAnalysisTableRoutes
    ],
    meta: {
        isShow: true,
        breadName: '班务执行',
        isCustomer: true,
    }
}]

export default routes