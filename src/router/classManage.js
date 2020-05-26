// 客户模块
const Home = () => import( '../views/Home.vue')
const NoAccess = () => import(  '../views/NoAccess.vue')
const NotFound = () => import( '../views/404.vue')
const classDetail = () => import( '../views/customer/classManage/classDetail.vue')
const classList = () => import( '../views/customer/classManage/classList.vue')
const classManageList = () => import( '../views/customer/classManage/classManageList.vue')
const myTask = () => import('../views/customer/classManage/myTask.vue')
const shortcutClass = () => import('../views/customer/classManage/shortcutClass.vue')
const empty = () => import(  '../views/customer/task/components/emptyCon.vue')
const routes = [{
    path: "/classManage",
    alias: '班务管理',
    name: 'classManage',
    component: empty,
    // iconCls: 'icon-classManager',
    children: [{
        path: '',
        name:'myTask',
        redirect: 'myTask',
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
            path: "myTask",
            name: "myTask",
            component: myTask,
            alias: '我的任务',
            meta: {
                breadName: '我的任务'
            }
        },
        {
            path: "shortcutClass",
            name: "shortcutClass",
            component: shortcutClass,
            hidden: true,
            alias: '快捷班务',
            meta: {
                breadName: '快捷班务'
            }
        },
               
        {
            path: 'classList',
            name: 'classList',
            component: classList,
            alias: '班务列表',
            meta: {
                breadName: '班务列表'
            }
        },
        {
            path: "classDetail",
            name: "classDetail",
            hidden: true,
            component: classDetail,
            meta: {
                // isEdit: false,
                breadName: '班务详情'
            }
        },
        {
            path: "classManageList",
            name: "classManageList",
            hidden: true,
            component: classManageList,
            meta: {
                breadName: '管理班务'
            }
        },
    ],
    meta: {
        isShow: true,
        breadName: '班务管理',
        isCustomer: true,
    }
}]

export default routes