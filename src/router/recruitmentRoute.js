// 招聘模块
const Home = () => import( '../views/Home.vue')
const jobList = () => import( '../views/customer/recruitment/JobList.vue')
const jobDetail = () => import( '../views/customer/recruitment/JobDetail.vue')
const candidateList = () => import( '../views/customer/recruitment/CandidateList.vue')
const expensesList = () => import(  '../views/customer/recruitment/ExpensesList.vue')
const limitSet = () => import( '../views/customer/recruitment/LimitSet.vue')
const NoAccess = () => import(  '../views/NoAccess.vue')

const routes = [{
  path: "/recruitment",
  name: 'recruitment',
  alias: '劳务机会',
  component: Home,
  iconCls: 'icon-recruitment',
  meta: {
    isShow: true,
    breadName: '劳务机会',
    isCustomer: true,
  },
  children: [{
      path: '',
      redirect: 'joblist'
    },
    {
      path: "noaccess",
      name: "noaccessrecruitment",
      component: NoAccess,
      alias: '无权限',
      hidden: true,
      meta: {
        isShow: false,
        isRequireAuth: false,
      }
    },
    {
      path: "joblist",
      name: "joblist",
      component: jobList,
      alias: '劳务机会',
      meta: {
        breadName: '劳务机会'
      },
    },
    {
      path: "jobdetail/:id",
      name: "jobdetail",
      component: jobDetail,
      alias: '劳务机会详情',
      hidden: true,
      meta: {
        breadName: '劳务机会详情'
      },
    },
    {
      path: "candidatelist",
      name: "candidatelist",
      component: candidateList,
      alias: '候选人',
      meta: {
        breadName: '候选人'
      },
    },
    {
      path: "expenses",
      name: "expenses",
      component: expensesList,
      alias: '费用',
      meta: {
        breadName: '费用'
      },
    },
    {
      path: "limitset",
      name: "limitset",
      component: limitSet,
      alias: '佣金上限设置',
      meta: {
        breadName: '佣金上限设置'
      },
    },
  ],
}]

export default routes