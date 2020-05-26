// 考勤
const OutAttendenceList = () => import(  '../views/customer/outAttendence/AttendenceList.vue')
const OutAttendenceListOut = () => import(  '../views/customer/outAttendence/AttendenceListOut.vue')
const OutAttendenceExport = () => import( '../views/customer/outAttendence/Export.vue')
const NoAccess = () => import( '../views/NoAccess.vue')
const OutEmpty = () => import(  '../views/customer/task/components/emptyCon.vue')
const routes = [{
    path: "/outAttendence",
    alias: '考勤管理',
    name: 'outAttendence',
    component: OutEmpty,
    iconCls: 'icon-attendence',
    meta: {
        isShow: true,
        breadName: '考勤管理',
        isCustomer: true,
    },
    children: [{
        path: '',
        name: 'outAttendenceList',
        redirect: 'outAttendenceList',
        hidden: true,
    },
        {
            path: "noaccess",
            name: "noaccessattendence",
            component: NoAccess,
            alias: '无权限',
            hidden: true,
            meta: {
                isShow: false,
                isRequireAuth: false,
            }
        },
        {
            path: "outAttendenceList",
            name: "outAttendenceList",
            component: OutAttendenceList,
            alias: '对外考勤',
            meta: {
                isShow: true,
                breadName: '对外考勤'
            },
        },
        {
            path: "outAttendenceListOut",
            name: "outAttendenceListOut",
            component: OutAttendenceListOut,
            alias: '对内考勤',
            meta: {
                isShow: true,
                breadName: '对内考勤'
            },
        },
        {
            path: "outExport",
            name: "outAttendenceExport",
            component: OutAttendenceExport,
            alias: '导出考勤数据',
            hidden: true,
            meta: {
                breadName: '导出考勤数据'
            },
        }
    ],
}]

export default routes