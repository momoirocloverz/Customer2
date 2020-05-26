// 项目经理
const Home = () => import( '../views/Home.vue')
const projectManagerBondedWorker = () => import( '../views/customer/projectManager/components/Bounded.vue')
const projectManagerUnbondWorker = () => import( '../views/customer/projectManager/components/Unbound.vue')
const projectManagerWorker = () => import( '../views/customer/projectManager/MyWorker')
const projectManagerdetail = () => import( '../views/customer/projectManager/detail')
const MAccountList = () => import(  '../views/manager/account/AccountList.vue')
const MRecharge = () => import(  '../views/manager/account/Recharge.vue')
const NoAccess = () => import( '../views/NoAccess.vue')
const List =  () => import( '../views/customer/projectManager/components/list.vue')
const AffiliatedManager =  () => import( '../views/customer/projectManager/affiliatedManager.vue')
const empty = () => import(  '../views/customer/task/components/emptyCon.vue')

const routes = [{
  path: "/projectManager",
  alias: '班务经理',
  name: 'projectManager',
  component: empty,
  iconCls: 'icon-projectmanager',
  children: [{
      path: '',
      name: 'myUnboundWorker',
      redirect: 'myUnboundWorker',
    hidden: true,
    },
    {
      path: "noaccess",
      name: "noaccesspm",
      component: NoAccess,
      alias: '无权限',
      hidden: true,
      meta: {
        isShow: false,
        isRequireAuth: false,
      }
    },
    {
      path: "myUnboundWorker",
      name: "myUnboundWorker",
      component: List,
      alias: '班务经理列表',
      meta: {
        breadName: '班务经理列表'
      }
    },{
      path: "affiliatedManager",
      name: "affiliatedManager",
      component: AffiliatedManager,
      alias: '挂靠班务经理列表',
      meta: {
        breadName: '挂靠班务经理列表'
      }
    },
    // {
    //   path: "myBoundedWorker",
    //   name: "myBoundedWorker",
    //   component: projectManagerBondedWorker,
    //   alias: '已解绑',
    //   meta: {
    //     breadName: '已解绑'
    //   }
    // },
    {
      path: "myworker/:id",
      name: "myworker",
      component: projectManagerWorker,
      alias: '查看分配的零工',
      hidden: true,
      meta: {
        breadName: '查看分配的零工'
      }
    },
    {
      path: "detail/:id/:userId",
      name: "projectManagerdetail",
      component: projectManagerdetail,
      alias: '查看详情',
      hidden: true,
      meta: {
        breadName: '查看详情'
      }
    }
  ],
  meta: {
    isShow: true,
    breadName: '班务经理',
    isCustomer: true,
  }
}]

export default routes