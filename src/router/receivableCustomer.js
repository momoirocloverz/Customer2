// 客户模块
const Home = () => import( '../views/Home.vue')
//应收客户
const receivableList = () => import( '../views/customer/receivableCustomer/receivableList.vue')
const NoAccess = () => import(  '../views/NoAccess.vue')

const routes = [{
  path: "/receivableCustomer",
  alias: '应收客户',
  hidden:true,
  name: 'receivableCustomer',
  component: Home,
  iconCls: 'icon-receive',
  children: [{
      path: '',
      name:'receivableList',
      redirect: 'receivableList',
      hidden:true,
    },
    {
      path: "noaccess",
      name: "noaccessreceivable",
      component: NoAccess,
      alias: '无权限',
      hidden: true,
      meta: {
        isShow: false,
        isRequireAuth: false,
      }
    },
    {
      path: "receivableList",
      name: "receivableList",
      component: receivableList,
      alias: '应收客户列表',
      meta: {
        breadName: '应收客户列表'
      }
    },
  ],
  meta: {
    isShow: true,
    breadName: '应收客户',
    isCustomer: true,
  }
}]

export default routes