// 外包模块
const Home = () => import( '@/views/Home.vue'); 
const NoAccess = () => import(  '@/views/NoAccess.vue');
const promise = ()=>import ('@/views/customer/outSourceMaster/promise.vue');
const promitemDetails = ()=>import ('@/views/customer/outSourceMaster/promitemDetails.vue');
const outSourceTaskManagement = ()=>import ('@/views/customer/outSourceMaster/outSourceTaskManagement.vue');
const emptyCon = () => import(  '@/views/customer/task/components/emptyCon.vue');
const TaskDetail = ()=>import ('@/views/customer/outSourceMaster/TaskDetail.vue');
const outClassManageList = ()=>import ('@/views/customer/outSourceMaster/outClassManageList.vue');
const shortcutClassOut = ()=>import ('@/views/customer/outSourceMaster/shortcutClassOut.vue');
const classListsCon = ()=>import ('@/views/customer/outSourceMaster/classLists/classList.vue');
const outSourceDistribution = ()=>import ('@/views/customer/outSourceMaster/outSourceSchedule/scheduleList.vue');
const classDetails = ()=>import ('@/views/customer/outSourceMaster/classLists/classDetail.vue');
const outDistriDetails = ()=>import ('@/views/customer/outSourceMaster/outSourceSchedule/schedulingDetail.vue');
import outAttendenceRoutes from './outAttendenceRoutes';
import outPayableRoutes from './outPayableRoutes';
import outAwardAndPunishment from './outAwardAndPunishment';
const routes = [{
    path: "/outSourceMaster",
    alias: '外包管理',
    name: 'outSourceMaster',
    hidden: true,
    showTop: true,
    component: Home,
    children: [
        {
            path: '',
            name: 'outSourceTaskManagement',
            redirect: 'outSourceTaskManagement',
            hidden: true,
        },
        {
            path: "noaccess",
            name: "noaccesscustomer",
            component: NoAccess,
            alias: '无权限',
            hidden: true,
            meta: {
                isShow: false,
                isRequireAuth: false,
            }
        },
        {
            path: "outSourceTaskManagement",
            component: emptyCon,
            alias: '任务管理',
            name: "outSourceTaskManage",
            meta: {
                breadName: '任务管理'
            },
            children:[
                {
                    path: '',
                    name: 'outSourceTaskMasterSub',
                    redirect: 'outSourceTaskSub',
                    hidden: true,
                },
                {
                    path: "outSourceTaskSub",
                    name: "outSourceTaskSub",
                    component: outSourceTaskManagement,
                    alias: '外包任务',
                    meta: {
                        breadName: '外包任务',
                    },
                },
                {
                    path: "outSourceTaskDetail",
                    name: "outSourceTaskDetail",
                    component: TaskDetail,
                    alias: '任务详情',
                    meta: {
                        breadName: '任务详情',
                    },
                    hidden: true,
                },
                {
                    path: "outClassManageList",
                    name: "outClassManageList",
                    component: outClassManageList,
                    alias: '管理班务',
                    meta: {
                        breadName: '管理班务',
                    },
                    hidden: true,
                },
                {
                    path: "shortcutClassOut",
                    name: "shortcutClassOut",
                    component: shortcutClassOut,
                    alias: '快捷班务',
                    meta: {
                        breadName: '快捷班务',
                    },
                    hidden: true,
                },                
                {
                    path: "noaccess",
                    name: "noaccesscustomer",
                    component: NoAccess,
                    alias: '无权限',
                    hidden: true,
                    meta: {
                        isShow: false,
                        isRequireAuth: false,
                    }
                },
            ]
        },
         {
            path: "outSourceClassBusinessM",
            component: emptyCon,
            alias: '班务管理',
            name: "outSourceClassBusinessM",
            meta: {
                breadName: '班务管理'
            },
             children:[
                {
                    path: '',
                    name: 'outSourceClassBusinessR',
                    redirect: 'outSourceClassBusinessManage',
                    hidden: true,
                },
                {
                    path: "outSourceClassBusinessManage",
                    name: "outSourceClassBusinessManage",
                    component: classListsCon,
                    alias: '班务列表',
                    meta: {
                        breadName: '班务列表',
                    },
                },
                 {
                     path: "outSourceClassDetails",
                     name: "outSourceClassDetails",
                     component: classDetails,
                     hidden: true,
                     alias: '班务详情',
                     meta: {
                         breadName: '班务详情',
                     },
                 },
                 {
                    path: "noaccess",
                    name: "noaccesscustomer",
                    component: NoAccess,
                    alias: '无权限',
                    hidden: true,
                    meta: {
                        isShow: false,
                        isRequireAuth: false,
                    }
                },
             ]
         },        
        {
            path: "outSourceDistribut",
            component: emptyCon,
            alias: '排班管理',
            name: "outSourceDistribut",
            meta: {
                breadName: '排班管理'
            },
             children:[
                {
                    path: '',
                    name: 'outSourceDistriR',
                    redirect: 'outSourceDistribution',
                    hidden: true,
                },
                {
                    path: "outSourceDistribution",
                    name: "outSourceDistribution",
                    component: outSourceDistribution,
                    alias: '排班列表',
                    meta: {
                        breadName: '排班列表',
                    },
                },
                 {
                    path: "outDistriDetails",
                    name: "outDistriDetails",
                    component: outDistriDetails,
                     hidden: true,
                    alias: '排班详情',
                    meta: {
                        breadName: '排班详情',
                    },
                },
                 {
                    path: "noaccess",
                    name: "noaccesscustomer",
                    component: NoAccess,
                    alias: '无权限',
                    hidden: true,
                    meta: {
                        isShow: false,
                        isRequireAuth: false,
                    }
                },
             ]
         },
        ...outAttendenceRoutes,
        ...outPayableRoutes,
        ...outAwardAndPunishment,
        {
            path: "promise",
            component: emptyCon,
            alias: '应收管理',
            name: "promi",
            hidden:true,
            meta: {
                breadName: '应收管理'
            },
            children:[
                {
                    path: '',
                    name: 'outSourcePromise',
                    redirect: 'outSourcePromiseSelf',
                    hidden: true,
                },
                {
                    path: "outSourcePromiseSelf",
                    name: "outSourcePromiseSelf",
                    component: promise,
                    alias: '应收任务',
                    meta: {
                        breadName: '应收任务',
                    },
                },
                {
                    path: "outSourcePromitemDetails",
                    name: "outSourcePromitemDetails",
                    component: promitemDetails,
                    hidden: true,
                    alias: '班务明细',
                    meta: {
                        breadName: '班务明细',
                    },
                },
                {
                    path: "noaccess",
                    name: "noaccesscustomer",
                    component: NoAccess,
                    alias: '无权限',
                    hidden: true,
                    meta: {
                        isShow: false,
                        isRequireAuth: false,
                    }
                },
            ]
        },
    ],
    meta: {
        isShow: true,
        breadName: '外包管理',
        isCustomer: true,
    }
}]
export default routes