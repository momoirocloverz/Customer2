// 应付模块
const Home = () => import( '../views/Home.vue')
const OutPayableList = () => import( '../views/customer/outPayable/List.vue')
const OutWorkerPay = () => import( '../views/customer/outPayable/components/workerPay.vue')
const OutXfdOrder = () => import( '../views/customer/outPayable/xfdOrder.vue')
const OutXfdBudget = () => import( '../views/customer/outPayable/xfdBudget.vue')
const OutHandlerDetails = () => import( '../views/customer/outPayable/components/handlerDetails.vue')
const OutDeductionsDetails = () => import( '../views/customer/outPayable/components/deductionsDetails.vue')
const OutRewardDetails = () => import( '../views/customer/outPayable/components/rewardDetails.vue')
const OutRewardsBatches = () => import( '../views/customer/outPayable/components/rewardsBatches.vue')
const OutHandlerPayDetails = () => import(  '../views/customer/outPayable/components/handlerPayDetails.vue')
const OutNotProceedCheckWorker = () => import( '../views/customer/outPayable/components/notProceedCheckWorker.vue')
const OutNotProceedCheckCustomer = () => import( /* webpackChunkName: 'payable' */ '../views/customer/outPayable/components/notProceedCheckCustomer.vue')
//应收客户
const NoAccess = () => import( '../views/NoAccess.vue')
const OutWaitPamentReplace = () => import( '../views/customer/outPayable/components/waitPamentReplace.vue')
const OutPaiedReplace = () => import( '../views/customer/outPayable/components/paiedReplace.vue')
const OutInsuranceDetails = () => import( '../views/customer/outPayable/components/insuranceDetails.vue')
const OutAccessFee = () => import( '../views/customer/outPayable/components/accessFee.vue')
const OutPayHistory = () => import( '../views/customer/outPayable/components/payHistory.vue')

const OutRecycleCollect = () => import('../views/customer/outPayable/recycle/recycleCollect.vue')
const OutRecycleDetail = () => import('../views/customer/outPayable/recycle/recycleDetail.vue')
const empty = () => import(  '../views/customer/task/components/emptyCon.vue')

const outManagerPaymenTaskCon = () => import( '../views/customer/outSourceMaster/paymentManager/managerPaymenTaskCon.vue');
const outManagerPaymentDetailCon = () => import( '../views/customer/outSourceMaster/paymentManager/components/detailCon.vue');
const HtOrder = () => import( '../views/customer/outSourceMaster/paymentManager/htOrder.vue')
const HtBudget = () => import( '../views/customer/outSourceMaster/paymentManager/htBudget.vue')


const routes = [{
    path: "/outPayable",
    alias: '应付管理',
    name: 'outPayable',
    component: empty,
    iconCls: 'icon-payable',
    children: [{
        path: '',
        name: 'outWorkerPay',
        redirect: 'outWorkerPay',
        hidden: true,
    },
        {
            path: "noaccess",
            name: "noaccesspayable",
            component: NoAccess,
            alias: '无权限',
            hidden: true,
            meta: {
                isShow: false,
                isRequireAuth: false,
            }
        },
        {
            path: "outPayableList",
            name: "outPayableList",
            component: OutPayableList,
            hidden: true,
            meta: {
                breadName: '应付列表'
            },
        },
        {
            path: "outWorkerPay",
            name: "outWorkerPay",
            component: OutWorkerPay,
            alias: '应付零工',
            meta: {
                breadName: '应付零工'
            },
        },
        {
            path: "outManagerPaymenTaskCon",
            name: "outManagerPaymenTaskCon",
            component: outManagerPaymenTaskCon,
            alias: '应付班务经理利润',
            meta: {
                breadName: '应付班务经理利润'
            },
        },
        {
            path: "htOrder",
            name: "htOrder",
            hidden: true,
            component: HtOrder,
            alias: '薪企云服订单',
            meta: {
                breadName: '薪企云服订单'
            },
        },
        {
            path: "htBudget",
            name: "htBudget",
            hidden: true,
            component: HtBudget,
            alias: '薪企云服付款预算',
            meta: {
                breadName: '薪企云服付款预算'
            },
        },
        {
            path: "outManagerPaymentDetailCon",
            name: "outManagerPaymentDetailCon",
            component: outManagerPaymentDetailCon,
            alias: '应付班务经理明细',
            hidden: true,
            meta: {
                breadName: '应付班务经理明细'
            },
        },
        {
            path: "outXfdOrder",
            name: "outXfdOrder",
            hidden: true,
            component: OutXfdOrder,
            alias: '薪企云服订单',
            meta: {
                breadName: '薪企云服订单'
            },
        },
        {
            path: "outXfdBudget",
            name: "outXfdBudget",
            hidden: true,
            component: OutXfdBudget,
            alias: '薪企云服付款预算',
            meta: {
                breadName: '薪企云服付款预算'
            },
        },
        {
            path: "outHandlerDetails",
            name: "outHandlerDetails",
            component: OutHandlerDetails,
            alias: '零工明细',
            hidden: true,
            meta: {
                isShow: false,
                breadName: '零工明细'
            }
        },
        {
            path: "outDeductionsDetails",
            name: "outDeductionsDetails",
            component: OutDeductionsDetails,
            alias: '扣款明细',
            hidden: true,
            meta: {
                isShow: false,
                breadName: '扣款明细'
            }
        },
        {
            path: "outRewardDetails",
            name: "outRewardDetails",
            component: OutRewardDetails,
            alias: '奖惩明细',
            hidden: true,
            meta: {
                isShow: false,
                breadName: '奖惩明细'
            }
        },
        {
            path: "outHandlerPayDetails",
            name: "outHandlerPayDetails",
            component: OutHandlerPayDetails,
            alias: '项目明细',
            hidden: true,
            meta: {
                isShow: false,
                breadName: '项目明细'
            }
        },
        {
            path: "outNotProceedCheckWorker",
            name: "outNotProceedCheckWorker",
            component: OutNotProceedCheckWorker,
            alias: '未结算排班列表',
            hidden: true,
            meta: {
                isShow: false,
                breadName: '未结算排班列表'
            }
        },
        {
            path: "outNotProceedCheckCustomer",
            name: "outNotProceedCheckCustomer",
            component: OutNotProceedCheckCustomer,
            alias: '未结算排班列表',
            hidden: true,
            meta: {
                isShow: false,
                breadName: '未结算排班列表'
            }
        },
        {
            path: "outRewardsBatches",
            name: "outRewardsBatches",
            component: OutRewardsBatches,
            alias: '待审核奖惩',
            hidden: true,
            meta: {
                isShow: false,
                breadName: '待审核奖惩'
            }
        },
        {
            path: "outWaitPamentReplace",
            name: "outWaitPamentReplace",
            component: OutWaitPamentReplace,
            alias: '待付汇总代发收入',
            hidden: true,
            meta: {
                isShow: false,
                breadName: '待付汇总代发收入'
            }
        },
        {
            path: "outPaiedReplace",
            name: "outPaiedReplace",
            component: OutPaiedReplace,
            alias: '已付汇总代发收入',
            hidden: true,
            meta: {
                isShow: false,
                breadName: '已付汇总代发收入'
            }
        },
        {
            path: "outRecycleCollect",
            name: "outRecycleCollect",
            component: OutRecycleCollect,
            hidden: true,
            alias: '坏账回收站汇总',
            meta: {
                breadName: '坏账回收站汇总'
            },
        },
        {
            path: "outRecycleDetail",
            name: "outRecycleDetail",
            component: OutRecycleDetail,
            hidden: true,
            alias: '坏账回收站详情',
            meta: {
                breadName: '坏账回收站详情'
            },
        },
        {
            path: "outInsuranceDetails",
            name: "outInsuranceDetails",
            component: OutInsuranceDetails,
            alias: '保险费详情',
            hidden: true,
            meta: {
                isShow: false,
                breadName: '保险费详情'
            }
        },
        {
            path: "outPayHistory",
            name: "outPayHistory",
            component: OutPayHistory,
            alias: '付款记录',
            hidden: true,
            meta: {
                isShow: false,
                breadName: '付款记录'
            }
        },
        {
            path: "outAccessFee",
            name: "outAccessFee",
            component: OutAccessFee,
            alias: '系统使用费详情',
            hidden: true,
            meta: {
                isShow: false,
                breadName: '系统使用费详情'
            }
        },
    ],
    meta: {
        isShow: true,
        breadName: '应付管理',
        isCustomer: true,
    }
}]

export default routes