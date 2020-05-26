// 客户模块
const Home = () => import( '../views/Home.vue')
//报表系列界面
const statementList = () => import( '../views/customer/statement/list.vue')
const chooseTask = () => import( '../views/customer/statement/chooseTask.vue')
const profitDetail1 = () => import( '../views/customer/statement/profitDetail1.vue')
const profitCollect = () => import( '../views/customer/statement/profitCollect.vue')
const yiCheckDetail = () => import(  '../views/customer/statement/components/yiCheckDetail.vue')
const yiCheckChart = () => import( '../views/customer/statement/components/yiCheckChart.vue')
const daiCheckGenerate = () => import( '../views/customer/statement/components/daiCheckGenerate.vue')
const daidaiCheckGenerateTwo = () => import( '../views/customer/statement/components/daidaiCheckGenerateTwo.vue')
const collectList = () => import( '../views/customer/statement/components/collectList.vue')
const NoAccess = () => import( '../views/NoAccess.vue')

const timeOfTable = () => import( '../views/customer/profitAnalysisTable/timeOfTable.vue')
const incomeDetail = () => import( '../views/customer/profitAnalysisTable/incomeDetail.vue')
const profitDetail = () => import( '../views/customer/profitAnalysisTable/profitDetail.vue')

const incomeCopyDetail = () => import( '../views/customer/profitAnalysisTable/incomeCopyDetail.vue')
const profitCopyDetail = () => import( '../views/customer/profitAnalysisTable/profitCopyDetail.vue')

const collectByPeople = () => import( '../views/customer/profitAnalysisTable/collectByPeople.vue')
const empty = () => import(  '../views/customer/task/components/emptyCon.vue')

const routes = [{
  path: "/profitAnalysisTable",
  alias: '统计报表',
  name: 'profitAnalysisTable',
  // hidden: true,
  //innerNavHidden:true,
  //showTop:true,
  component: empty,
  //iconCls: 'icon-classManager',
  children: [
    {
      path: "statementList",
      name: "statementList",
      component: statementList,
      alias: '生产分析报表',
      meta: {
        breadName: '生产分析报表'
      }
    },
    {
      path: "noaccess",
      name: "noaccessinvoice",
      component: NoAccess,
      alias: '无权限',
      hidden: true,
      meta: {
        isShow: false,
        isRequireAuth: false,
      }
    },
    {
      path: "chooseTask",
      name: "chooseTask",
      hidden: true,
      component: chooseTask,
      // alias: '生产分析报表',
      meta: {
        breadName: '生产分析报表'
      }
    },
//    {
//      path: "profitDetail1",
//      name: "profitDetail1",
//      component: profitDetail1,
//      alias: '班务经理利润明细',
//      meta: {
//        breadName: '班务经理利润明细'
//      }
//    },
    {
      path: "yiCheckDetail",
      name: "yiCheckDetail",
      hidden: true,
      component: yiCheckDetail,
      // alias: '生产分析报表',
      meta: {
        breadName: '班务经理利润明细'
      }
    },
    {
      path: "yiCheckChart/:id",
      name: "yiCheckChart",
      hidden: true,
      component: yiCheckChart,
      // alias: '生产分析报表',
      meta: {
        breadName: '班务经理利润明细趋势图'
      }
    },
//    {
//      path: "profitCollect",
//      name: "profitCollect",
//      component: profitCollect,
//      alias: '班务经理利润汇总',
//      meta: {
//        breadName: '班务经理利润汇总'
//      }
//    },
    {
      path: "daiCheckGenerate/:managerId/:month/:id/:managerName",
      name: "daiCheckGenerate",
      hidden: true,
      component: daiCheckGenerate,
      // alias: '生产分析报表',
      meta: {
        breadName: '班务经理利润明细'
      }
    },
    {
      path: "daidaiCheckGenerateTwo/:managerId/:month/:id/:managerName",
      name: "daidaiCheckGenerateTwo",
      hidden: true,
      component: daidaiCheckGenerateTwo,
      // alias: '生产分析报表',
      meta: {
        breadName: '班务经理利润明细'
      }
    },
    {
      path: "collectList/:month",
      name: "collectList",
      hidden: true,
      component: collectList,
      // alias: '生产分析报表',
      meta: {
        breadName: '班务经理利润汇总'
      }
    },
   {
     path: "timeOfTable",
     name: "classServiceTimeOfTable",
     component: timeOfTable,
     alias: '利润分析-按班务',
     meta: {
       breadName: '利润分析-按班务'
     }
   },
    {
      path: "incomeDetail",
      name: "classServiceIncomeDetail",
      hidden: true,
      component: incomeDetail,
      alias: '收入明细',
      meta: {
        breadName: '收入明细'
      }
    },
    {
      path: "profitDetail",
      name: "classServiceProfitDetail",
      component: profitDetail,
      hidden: true,
      alias: '利润明细',
      meta: {
        breadName: '利润明细'
      }
    },
      {
      path: "incomeCopyDetail",
      name: "classServiceIncomeCopyDetail",
      hidden: true,
      component: incomeCopyDetail,
      alias: '收入明细',
      meta: {
        breadName: '收入明细'
      }
    },
    {
      path: "profitCopyDetail",
      name: "classServiceProfitCopyDetail",
      component: profitCopyDetail,
      hidden: true,
      alias: '利润明细',
      meta: {
        breadName: '利润明细'
      }
    },
   {
     path: "collectByPeople",
     name: "classServiceCollectByPeople",
     component: collectByPeople,
     alias: '利润分析-按班务经理',
     meta: {
       breadName: '利润分析-按班务经理'
     }
   }
  ],
  meta: {
    isShow: true,
    breadName: '统计报表',
    isCustomer: true,
  }
}]

export default routes