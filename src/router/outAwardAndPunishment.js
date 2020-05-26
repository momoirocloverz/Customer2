// 客户模块
const Home = () => import( '../views/Home.vue')
const NoAccess = () => import(  '../views/NoAccess.vue')
const OutAPList = () => import( '../views/customer/outAwardAndPunishment/APList.vue')
const empty = () => import(  '../views/customer/task/components/emptyCon.vue')

const routes = [{
    path: "/outAwardAndPunishment",
    alias: '奖惩',
    name: 'outAwardAndPunishment',
    component: empty,
    iconCls: 'icon-ANP',
    children: [{
        path: '',
        name: 'outAPList',
        redirect: 'outAPList',
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
            path: 'outAPList',
            name: 'outAPList',
            component: OutAPList,
            alias: '奖惩列表',
            meta: {
                breadName: '奖惩列表'
            }
        }
    ],
    meta: {
        isShow: true,
        breadName: '奖惩',
        isCustomer: true,
    }
}]

export default routes