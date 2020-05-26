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

const routes = [{
  path: "/statement",
  alias: '统计报表',
  name: 'statement',
  component: Home,
  iconCls: 'icon-data',
  children: [
    {
      path: '',
      name:"statementList",
      redirect: 'statementList',
      hidden: true,
    },
    {
      path: "noaccess",
      name: "noaccessstatementList",
      component: NoAccess,
      alias: '无权限',
      hidden: true,
      meta: {
        isShow: false,
        isRequireAuth: false,
      }
    },
    // {
    //   path: '',
    //   redirect: 'profitDetail1'
    // },
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
      path: "chooseTask",
      name: "chooseTask",
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
      component: yiCheckDetail,
      // alias: '生产分析报表',
      meta: {
        breadName: '班务经理利润明细'
      }
    },
    {
      path: "yiCheckChart/:id",
      name: "yiCheckChart",
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
      component: daiCheckGenerate,
      // alias: '生产分析报表',
      meta: {
        breadName: '班务经理利润明细'
      }
    },
    {
      path: "daidaiCheckGenerateTwo/:managerId/:month/:id/:managerName",
      name: "daidaiCheckGenerateTwo",
      component: daidaiCheckGenerateTwo,
      // alias: '生产分析报表',
      meta: {
        breadName: '班务经理利润明细'
      }
    },
    {
      path: "collectList/:month",
      name: "collectList",
      component: collectList,
      // alias: '生产分析报表',
      meta: {
        breadName: '班务经理利润汇总'
      }
    },
  ],
  meta: {
    isShow: true,
    breadName: '统计报表',
    isCustomer: true,
  }
}]

export default routes