// 客户模块
const Home = () => import( '../views/Home.vue')
const NoAccess = () => import(  '../views/NoAccess.vue')
const APList = () => import( '../views/customer/awardAndPunishment/APList.vue')
const empty = () => import(  '../views/customer/task/components/emptyCon.vue')

const routes = [{
    path: "/awardAndPunishment",
    alias: '奖惩',
    name: 'awardAndPunishment',
    component: empty,
    iconCls: 'icon-ANP',
    children: [{
        path: '',
        name: 'APList',
        redirect: 'APList',
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
            path: 'APList',
            name: 'APList',
            component: APList,
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