// 考勤
const Home = () => import( '../views/Home.vue')
const AttendenceList = () => import(  '../views/customer/attendence/AttendenceList.vue')
const AttendenceListOut = () => import(  '../views/customer/attendence/AttendenceListOut.vue')
const attendenceExport = () => import( '../views/customer/attendence/Export.vue')
const NoAccess = () => import( '../views/NoAccess.vue')
const empty = () => import(  '../views/customer/task/components/emptyCon.vue')
const routes = [{
    path: "/attendence",
    alias: '考勤管理',
    name: 'attendence',
    component: empty,
    iconCls: 'icon-attendence',
    meta: {
        isShow: true,
        breadName: '考勤管理',
        isCustomer: true,
    },
    children: [{
        path: '',
        name: 'AttendenceList',
        redirect: 'attendenceList',
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
            path: "attendenceList",
            name: "AttendenceList",
            component: AttendenceList,
            alias: '对外考勤',
            meta: {
                isShow: true,
                breadName: '对外考勤'
            },
        },
        {
            path: "attendenceListOut",
            name: "AttendenceListOut",
            component: AttendenceListOut,
            alias: '对内考勤',
            meta: {
                isShow: true,
                breadName: '对内考勤'
            },
        },
        {
            path: "export",
            name: "attendenceExport",
            component: attendenceExport,
            alias: '导出考勤数据',
            hidden: true,
            meta: {
                breadName: '导出考勤数据'
            },
        }
    ],
}]

export default routes