// 客户模块
const Home = () => import( '../views/Home.vue')
const NoAccess = () => import(  '../views/NoAccess.vue')
const NotFound = () => import( '../views/404.vue')
const myTask = () => import('../views/customer/classManage/myTask.vue')
const empty = () => import(  '../views/customer/task/components/emptyCon.vue')
const routes = [{
    path: "/classTaskManage",
    alias: '任务管理',
    name: 'classTaskManage',
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
    ],
    meta: {
        isShow: true,
        breadName: '任务管理',
        isCustomer: true,
    }
}]

export default routes