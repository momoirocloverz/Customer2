// 排班模块
const Home = () => import( '../views/Home.vue')
const scheduleList = () => import( '../views/customer/schedule/scheduleList.vue')
const schedulingDetail = () => import('../views/customer/schedule/schedulingDetail.vue')
const schedulingExport = () => import( '../views/customer/schedule/Export.vue')
const NoAccess = () => import( '../views/NoAccess.vue')
const empty = () => import(  '../views/customer/task/components/emptyCon.vue')
const routes = [{
    path: "/schedule",
    name: "schedule",
    component: empty,
    alias: '排班管理',
    iconCls: 'icon-schedule',
    meta: {
        isShow: true,
        breadName: '排班管理',
        isCustomer: true,
    },
    children: [{
        path: '',
        name: 'scheduleList',
        redirect: 'scheduleList',
        component: scheduleList,
        hidden: true,
    },
        {
            path: "noaccess",
            name: "noaccessschedule",
            component: NoAccess,
            alias: '无权限',
            hidden: true,
            meta: {
                isShow: false,
                isRequireAuth: false,
            }
        },
        {
            path: "scheduleList",
            name: "scheduleList",
            component: scheduleList,
            alias: '排班列表',
            meta: {
                isShow: true,
                breadName: '排班列表'
            }
        },
        {
            path: "schedulingDetail",
            name: "schedulingDetail",
            hidden: true,
            component: schedulingDetail,
            meta: {
                breadName: '排班详情表'
            }
        },
        {
            path: "export",
            name: "schedulingExport",
            hidden: true,
            component: schedulingExport,
            meta: {
                breadName: '批量导出客户确认表'
            },
        },
    ]
}]

export default routes
