// 应付模块
const Home = () => import( '../views/Home.vue')
const empty = () => import(  '../views/customer/task/components/emptyCon.vue');
const payableList = () => import( '../views/customer/payable/List.vue')
const payableDetail = () => import( '../views/customer/payable/workerPays/detail.vue')
const salaryBill = () => import( '../views/customer/payable/workerPays/salaryBill.vue')
const salaryAdjust = () => import( '../views/customer/payable/workerPays/salaryAdjust.vue')
const salaryImport = () => import( '../views/customer/payable/workerPays/salaryImport.vue')
const wokerprivateDetail = () => import( '../views/customer/payable/workerPays/wokerprivateDetail.vue')
const projectPayDetail = () => import('../views/customer/payable/projectPays/detail.vue')
const profitTable = () => import( '../views/customer/payable/managerProfit/profitTable.vue')
const profitDetail = () => import( '../views/customer/payable/managerProfit/profitDetail.vue')
const profitAdjust = () => import( '../views/customer/payable/managerProfit/profitAdjust.vue')
const profitImport = () => import( '../views/customer/payable/managerProfit/profitImport.vue')
const privateDetail = () => import( '../views/customer/payable/managerProfit/privateDetail.vue')
const socialSetting = () => import( '../views/customer/payable/workerSocials/setting.vue')
const salaryDetail = () => import( '../views/customer/payable/workerPays/salaryDetail.vue')

const workerPay = () => import( '../views/customer/payable/components/workerPay.vue')
//薪福多
const XfdOrder = () => import( '../views/customer/payable/xfdOrder.vue')
const XfdBudget = () => import( '../views/customer/payable/xfdBudget.vue')
//薪福多班务经理
const XfdManagerOrder = () => import( '../views/customer/payable/paymentManager/xfdManagerOrder.vue')
const XfdManagerBudget = () => import( '../views/customer/payable/paymentManager/xfdManagerBudget.vue')
//及时雨
const TimelyRainOrder = () => import( '../views/customer/payable/timelyRainOrder.vue')
const TimelyRainBudget = () => import( '../views/customer/payable/timelyRainBudget.vue')

const projectPay = () => import( '../views/customer/payable/components/projectPay.vue')
// const managerProfit = () => import( '../views/customer/payable/components/managerProfit.vue')
const workerSocial = () => import( '../views/customer/payable/components/workerSocial.vue')

const handlerDetails = () => import( '../views/customer/payable/components/handlerDetails.vue')
const deductionsDetails = () => import( '../views/customer/payable/components/deductionsDetails.vue')
const rewardDetails = () => import( '../views/customer/payable/components/rewardDetails.vue')
const handlerPayDetails = () => import(  '../views/customer/payable/components/handlerPayDetails.vue')
const notProceedCheckWorker = () => import( '../views/customer/payable/components/notProceedCheckWorker.vue')
const RewardsBatches = () => import( '../views/customer/payable/components/rewardsBatches.vue')
const notProceedCheckCustomer = () => import( /* webpackChunkName: 'payable' */ '../views/customer/payable/components/notProceedCheckCustomer.vue')
//应收客户
const receivableList = () => import( '../views/customer/receivableCustomer/receivableList.vue')
const NoAccess = () => import( '../views/NoAccess.vue')

const waitPamentReplace = () => import( '../views/customer/payable/components/waitPamentReplace.vue')
const paiedReplace = () => import( '../views/customer/payable/components/paiedReplace.vue')

const insuranceDetails = () => import( '../views/customer/payable/components/insuranceDetails.vue')
const accessFee = () => import( '../views/customer/payable/components/accessFee.vue')
const payHistory = () => import( '../views/customer/payable/components/payHistory.vue')

const RecycleCollect = () => import('../views/customer/payable/recycle/recycleCollect.vue')
const RecycleDetail = () => import('../views/customer/payable/recycle/recycleDetail.vue')


const managerPaymenTaskCon = () => import( '../views/customer/payable/paymentManager/managerPaymenTaskCon.vue');
const managerPaymentDetailCon = () => import( '../views/customer/payable/paymentManager/components/detailCon.vue');


const routes = [{
    path: "/payable",
    alias: '应付管理',
    name: 'payable',
    component: empty,
    iconCls: 'icon-payable',
    children: [{
        path: '',
        name: 'workerPay',
        redirect: 'workerPay',
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
            path: "payableList",
            name: "payableList",
            component: payableList,
            hidden: true,
            meta: {
                breadName: '应付列表'
            },
        },
        {
            path: "workerPay",
            name: "workerPay",
            component: workerPay,
            alias: '应付零工',
            meta: {
                breadName: '应付零工'
            },
        },
        {
            path: "managerPaymenTaskCon",
            name: "managerPaymenTaskCon",
            component: managerPaymenTaskCon,
            alias: '应付班务经理利润',
            meta: {
                breadName: '应付班务经理利润'
            },
        },
        {
            path: "managerPaymentDetailCon",
            name: "managerPaymentDetailCon",
            component: managerPaymentDetailCon,
            alias: '应付班务经理明细',
            hidden: true,
            meta: {
                breadName: '应付班务经理明细'
            },
        },


        {
            path: "recycleCollect",
            name: "recycleCollect",
            component: RecycleCollect,
            hidden: true,
            alias: '坏账回收站汇总',
            meta: {
                breadName: '坏账回收站汇总'
            },
        },
        {
            path: "recycleDetail",
            name: "recycleDetail",
            component: RecycleDetail,
            hidden: true,
            alias: '坏账回收站详情',
            meta: {
                breadName: '坏账回收站详情'
            },
        },
        {
            path: "xfdOrder",
            name: "xfdOrder",
            hidden: true,
            component: XfdOrder,
            alias: '薪福多订单',
            meta: {
                breadName: '薪福多订单'
            },
        },
        {
            path: "xfdBudget",
            name: "xfdBudget",
            hidden: true,
            component: XfdBudget,
            alias: '薪福多付款预算',
            meta: {
                breadName: '薪福多付款预算'
            },
        }, {
            path: "xfdManagerOrder",
            name: "xfdManagerOrder",
            hidden: true,
            component: XfdManagerOrder,
            alias: '薪福多订单',
            meta: {
                breadName: '薪福多订单'
            },
        },
        {
            path: "xfdManagerBudget",
            name: "xfdManagerBudget",
            hidden: true,
            component: XfdManagerBudget,
            alias: '薪福多付款预算',
            meta: {
                breadName: '薪福多付款预算'
            },
        }, {
            path: "timelyRainOrder",
            name: "timelyRainOrder",
            hidden: true,
            component: TimelyRainOrder,
            alias: '及时雨订单',
            meta: {
                breadName: '及时雨订单'
            },
        },
        {
            path: "timelyRainBudget",
            name: "timelyRainBudget",
            hidden: true,
            component: TimelyRainBudget,
            alias: '及时雨付款预算',
            meta: {
                breadName: '及时雨付款预算'
            },
        },
        {
            path: "handlerDetails",
            name: "handlerDetails",
            component: handlerDetails,
            alias: '零工明细',
            hidden: true,
            meta: {
                isShow: false,
                breadName: '零工明细'
            }
        },
        {
            path: "deductionsDetails",
            name: "deductionsDetails",
            component: deductionsDetails,
            alias: '扣款明细',
            hidden: true,
            meta: {
                isShow: false,
                breadName: '扣款明细'
            }
        },
        {
            path: "rewardDetails",
            name: "rewardDetails",
            component: rewardDetails,
            alias: '奖惩明细',
            hidden: true,
            meta: {
                isShow: false,
                breadName: '奖惩明细'
            }
        },
        {
            // /:taskId/:taskName/:startDate/:endDate
            path: "handlerPayDetails",
            name: "handlerPayDetails",
            component: handlerPayDetails,
            alias: '项目明细',
            hidden: true,
            meta: {
                isShow: false,
                breadName: '项目明细'
            }
        },
        // /:taskName/:recordDate
        {
            path: "notProceedCheckWorker",
            name: "notProceedCheckWorker",
            component: notProceedCheckWorker,
            alias: '未结算排班列表',
            hidden: true,
            meta: {
                isShow: false,
                breadName: '未结算排班列表'
            }
        },
        {
            path: "rewardsBatches",
            name: "rewardsBatches",
            component: RewardsBatches,
            alias: '待审核奖惩',
            hidden: true,
            meta: {
                isShow: false,
                breadName: '待审核奖惩'
            }
        },
        {
            path: "notProceedCheckCustomer",
            name: "notProceedCheckCustomer",
            component: notProceedCheckCustomer,
            alias: '未结算排班列表',
            hidden: true,
            meta: {
                isShow: false,
                breadName: '未结算排班列表'
            }
        },
        {
            path: "waitPamentReplace",
            name: "waitPamentReplace",
            component: waitPamentReplace,
            alias: '待付汇总代发收入',
            hidden: true,
            meta: {
                isShow: false,
                breadName: '待付汇总代发收入'
            }
        },
        {
            path: "paiedReplace",
            name: "paiedReplace",
            component: paiedReplace,
            alias: '已付汇总代发收入',
            hidden: true,
            meta: {
                isShow: false,
                breadName: '已付汇总代发收入'
            }
        },
        {
            path: "insuranceDetails",
            name: "insuranceDetails",
            component: insuranceDetails,
            alias: '保险费详情',
            hidden: true,
            meta: {
                isShow: false,
                breadName: '保险费详情'
            }
        },
        {
            path: "payHistory",
            name: "payHistory",
            component: payHistory,
            alias: '付款记录',
            hidden: true,
            meta: {
                isShow: false,
                breadName: '付款记录'
            }
        },
        {
            path: "accessFee",
            name: "accessFee",
            component: accessFee,
            alias: '系统使用费详情',
            hidden: true,
            meta: {
                isShow: false,
                breadName: '系统使用费详情'
            }
        },
        // {  2019/7/31号 隐藏的
        //   path: "projectPay",
        //   name: "projectPay",
        //   component: projectPay,
        //   alias: '应付项目',
        //   meta: {
        //     breadName: '应付项目'
        //   },
        // },
        {
            path: "workerSocial",
            name: "workerSocial",
            component: workerSocial,
            hidden: true,
            alias: '零工社保设置',
            meta: {
                breadName: '零工社保设置'
            },
        },
        {
            path: "payableDetail/:batchNumber/:settlementType",
            name: "payableDetail",
            hidden: true,
            component: payableDetail,
            meta: {
                breadName: '应付零工详情'
            },
        },
        {
            path: "salaryBill/:id/:talentType/:isSocialSecurity/:name/:settlementType",
            name: "salaryBill",
            hidden: true,
            component: salaryBill,
            meta: {
                breadName: '零工收入条'
            },
        },
        {
            path: "salaryDetail/:id/:settlementType/:batchNumber/:name",
            name: "salaryDetail",
            hidden: true,
            component: salaryDetail,
            meta: {
                breadName: '收入明细'
            },
        },
        {
            path: "salaryAdjust/:id/:name/:talentId",
            name: "salaryAdjust",
            hidden: true,
            component: salaryAdjust,
            meta: {
                breadName: '收入调整'
            },
        },
        {
            path: "salaryImport/:batchNumber/:settlementType",
            name: "salaryImport",
            hidden: true,
            component: salaryImport,
            meta: {
                breadName: '导入调整项'
            },
        },
        {
            path: "wokerprivateDetail",
            name: "wokerprivateDetail",
            hidden: true,
            component: wokerprivateDetail,
            meta: {
                breadName: '个体户明细'
            },
        },
        {
            path: "projectPayDetail/:id/:name/:payerType",
            name: "projectPayDetail",
            hidden: true,
            component: projectPayDetail,
            meta: {
                breadName: '排班查看-项目结算'
            },
        },
        {
            path: "profitTable/:id/:batchNumber/:managerId/:name",
            name: "profitTable",
            hidden: true,
            component: profitTable,
            meta: {
                breadName: '利润表'
            },
        },
        {
            path: "profitDetail/:batchNumber",
            name: "profitDetail",
            hidden: true,
            component: profitDetail,
            meta: {
                breadName: '应付利润明细'
            },
        },
        {
            path: "profitAdjust/:id/:name",
            name: "profitAdjust",
            hidden: true,
            component: profitAdjust,
            meta: {
                breadName: '利润调整'
            },
        },
        {
            path: "profitImport/:batchNumber",
            name: "profitImport",
            hidden: true,
            component: profitImport,
            meta: {
                breadName: '导入利润表调整项'
            },
        },
        {
            path: "privateDetail",
            name: "privateDetail",
            hidden: true,
            component: privateDetail,
            meta: {
                breadName: '个体户明细'
            },
        },
        {
            path: "socialSetting",
            hidden: true,
            name: "socialSetting",
            component: socialSetting,
            meta: {
                breadName: '添加新设置'
            },
        },
    ],
    meta: {
        isShow: true,
        breadName: '应付管理',
        isCustomer: true,
    }
}]

export default routes