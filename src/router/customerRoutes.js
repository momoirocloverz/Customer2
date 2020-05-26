// 客户模块
const Home = () => import( '../views/Home.vue')
const customerList = () => import( '../views/customer/childcustomer/List.vue')
const addCustomer = () => import( '../views/customer/childcustomer/AddCustomer.vue')
const customerDetail = () => import( '../views/customer/childcustomer/detail.vue')
const NoAccess = () => import( '../views/NoAccess.vue')
const customerIdentifyList = () => import('../views/customer/childcustomer/customerIdentify/customerIdentifyList.vue')
const empty = () => import(  '../views/customer/task/components/emptyCon.vue')
const routes = [{
    path: "/customer",
    alias: '客户管理',
    name: 'customer',
    component: empty,
    // iconCls: 'icon-customer',
    children: [{
        path: '',
        name: 'customerList',
        redirect: 'List',
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
            path: "List",
            name: "customerList",
            component: customerList,
            alias: '客户列表',
            meta: {
                breadName: '客户列表'
            }
        },
        {
            path: 'customerIdentifyList',
            name: 'customerIdentifyList',
            component: customerIdentifyList,
            alias: '客户确认人',
            meta: {
                breadName: '客户确认人'
            }
        },
        {
            path: "add",
            name: "addCustomer",
            hidden: true,
            component: addCustomer,
            meta: {
                isEdit: false,
                breadName: '添加客户'
            }
        },
        {
            path: "edit/:id",
            name: "editCustomer",
            component: addCustomer,
            hidden: true,
            meta: {
                isEdit: true,
                breadName: '编辑客户'
            }
        },
        {
            path: "detail/:id",
            name: "customerDetail",
            hidden: true,
            component: customerDetail,
            meta: {
                breadName: '客户详情'
            }
        },
    ],
    meta: {
        isShow: true,
        breadName: '客户管理',
        isCustomer: true,
    }
}]

export default routes