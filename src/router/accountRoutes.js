// 账户管理
import store from '../store/index';
import * as getters from "../store/getters";
const Home = () => import( '../views/Home.vue')
const AccountList = () => import( '../views/customer/account/AccountList.vue')
const ManagementAccount = () => import( '../views/customer/account/ManagementAccount.vue')
// const AccountXfd = () => import( '../views/customer/account/accountXfd.vue')
// const AccountXfdFail = () => import( '../views/customer/account/accountXfdFail.vue')
// const AuditPass = () => import( '../views/customer/account/auditPass.vue')
const XfdList = () => import( '../views/customer/account/xfdList.vue')
const XfdPayDetail = () => import( '../views/customer/account/xfdPayDetail.vue')
const XfdAccountDetail = () => import( '../views/customer/account/xfdAccountDetail.vue')
const Recharge = () => import( '../views/customer/account/Recharge.vue')
const exportAccount = () => import( '../views/customer/account/export.vue')
//薪企云服账户
const HantanAccount = () => import( '../views/customer/account/hantanAccount.vue')
const HantanAccountOut = () => import( '../views/customer/account/hantanAccountOut.vue')
const HantanAccountDetail = () => import( '../views/customer/account/hantanAccountDetail.vue')

//及时雨
const TimelyRain = () => import( '../views/customer/account/timelyRain.vue')
const TimelyRainAccountDetail = () => import( '../views/customer/account/timelyRainAccountDetail.vue')
//const MyBill = () => import( '../views/customer/account/myBill.vue')
//const HandlerAccount = () => import( '../views/customer/account/handlerAccount.vue')
const NoAccess = () => import( '../views/NoAccess.vue')
const empty = () => import(  '../views/customer/task/components/emptyCon.vue');
const accountCheckMaster = () => import( '../views/customer/accountCheck/accountCheckMaster.vue');
// const cusType = localStorage.userInfo ? JSON.parse(localStorage.getItem('userInfo')).customerType : 1;//1.正常  2.外包
// const timeRainAlias = localStorage.userInfo ? JSON.parse(localStorage.getItem('userInfo')).customerShortName : '及时雨';//1.正常  2.外包
// const ifHavePayOwn = localStorage.userInfo ? (JSON.parse(localStorage.getItem('userInfo')).ifHavePayOwn ? JSON.parse(localStorage.getItem('userInfo')).ifHavePayOwn : 0) : 0;//1.及时雨  2.2

//console.log(store.getters.getHavePayOwn)
const routes = [{
    path: "/account",
    name: "account",
    component: Home,
    alias: '账户管理',
    hidden: true,
    //innerNavHidden:true,
    showTop: true,
    iconCls: 'icon-account',
    meta: {
        isShow: true,
        breadName: '账户管理',
        isCustomer: true,
    },
    children: [{
        path: '',
        name: 'accountList',
        redirect: 'accountList',
        hidden: true,
    },
        {
            path: "noaccess",
            name: "noaccessaccount",
            component: NoAccess,
            alias: '无权限',
            hidden: true,
            meta: {
                isShow: false,
                isRequireAuth: false,
            }
        },
        {
            path: "managementAccount",
            name: "managementAccount",
            component: ManagementAccount,
            alias: '管理费账户',
            meta: {
                isShow: true,
                breadName: '管理费账户'
            }
        },
         {
            path: "accountCheckMaster",
            name: "accountCheckMaster",
            component: accountCheckMaster,
             hidden: true,
            alias: '账号审核',
            meta: {
                isShow: true,
                breadName: '账号审核'
            }
        },      
        {
            path: "xfdList",
            name: "xfdList",
            component: XfdList,
            alias: '薪福多账户',
            ifHavePayOwn:1,//及时雨需要隐藏
            hidden:false,
            // hidden: ifHavePayOwn != 1 ? false : true,
            meta: {
                isShow: true,
                isCustomer: true,
                breadName: '薪福多账户'
            }
        },
        {
            path: "accountList",
            name: "accountList",
            component: AccountList,
            ifHavePayOwn:1,//及时雨需要隐藏
            hidden:false,
            // hidden:ifHavePayOwn != 1 ? false : true,
            alias: '易宝账户',
            meta: {
                isShow: true,
                breadName: '易宝账户'
            }
        },
        {
            path: "hantanAccount",
            name: "hantanAccount",
            component: HantanAccount,
            ifHavePayOwn:1,//及时雨需要隐藏
            cusType:1,//正常
            hidden:false,
            alias: '薪企云服账户',
            meta: {
                isShow: true,
                breadName: '薪企云服账户'
            }
        },{
            path: "timelyRain",
            name: "timelyRain",
            component: TimelyRain,
            ifHavePayOwn:2,//及时雨需要隐藏
            hidden:true,
            alias:'',
            meta: {
                isShow: true,
                breadName:''
            }
        },
        {
            path: "timelyRainAccountDetail",
            name: "timelyRainAccountDetail",
            component: TimelyRainAccountDetail,
            alias: '订单详情',
            hidden: true,
            meta: {
                isShow: true,
                breadName: '订单详情'
            }
        },
        {
            path: "hantanAccountDetail",
            name: "hantanAccountDetail",
            component: HantanAccountDetail,
            alias: '订单详情',
            hidden: true,
            meta: {
                isShow: true,
                breadName: '订单详情'
            }
        },
        {
            path: "hantanAccountOut",
            name: "hantanAccountOut",
            component: HantanAccountOut,
            ifHavePayOwn:1,//及时雨需要隐藏
            cusType:2,//外包
            hidden:true,
            alias: '薪企云服账户（外包商）',
            meta: {
                isShow: true,
                breadName: '薪企云服账户（外包商）'
            }
        },
        {
            path: "xfdPayDetail",
            name: "xfdPayDetail",
            component: XfdPayDetail,
            alias: '订单详情',
            hidden: true,
            meta: {
                isShow: true,
                breadName: '订单详情'
            }
        }, {
            path: "xfdAccountDetail",
            name: "xfdAccountDetail",
            component: XfdAccountDetail,
            alias: '账户详情',
            hidden: true,
            meta: {
                isShow: true,
                breadName: '账户详情'
            }
        },
//    {
//      path: "myBill",
//      name: "myBill",
//      component: MyBill,
//      alias: '我的账单',
//      meta: {
//        isShow: true,
//        breadName: '我的账单'
//      }
//    },
        // {
        //   path: "handlerAccount",
        //   name: "handlerAccount",
        //   component: HandlerAccount,
        //   alias: '经理人账户',
        //   meta: {
        //     isShow: true,
        //     breadName: '经理人账户'
        //   }
        // },
        {
            path: 'Recharge',
            name: 'Recharge',
            component: Recharge,
            alias: '充值',
            hidden: true,
            meta: {
                isShow: true,
                breadName: '充值'
            }
        },
        {
            path: 'export',
            name: 'export',
            component: exportAccount,
            alias: '导出明细',
            hidden: true,
            meta: {
                isShow: true,
                breadName: '导出明细'
            }
        },
        // {
        //   path: "accountList",
        //   name: "accountList",
        //   component: AccountList,
        //   alias: '我的账户',
        //   hidden: true,
        //   meta: {
        //     isShow: true,
        //     breadName: '我的账户'
        //   }
        // },
    ]
}]

export default routes