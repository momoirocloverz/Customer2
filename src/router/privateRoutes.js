// 个体户
const Home = () => import( '../views/Home.vue')
const PrivatelyList = () => import( '../views/customer/privately/PrivatelyList.vue')
const NewPrivately = () => import( '../views/customer/privately/NewPrivately.vue')
const ViewRecordC = () => import( '../views/customer/privately/ViewRecordC.vue')
const SelfOwn = () => import( '../views/customer/privately/SelfOwn.vue')
const PlatformAllocation = () => import( '../views/customer/privately/PlatformAllocation.vue')
const NoAccess = () => import( '../views/NoAccess.vue')

const routes = [{
  path: "/privately",
  name: "privately",
  alias: '个体户管理',
  component: Home,
  iconCls: 'icon-private',
  children: [{
      path: '',
      redirect: 'selfown'
    },
    {
      path: "noaccess",
      name: "noaccessprivately",
      component: NoAccess,
      alias: '无权限',
      hidden: true,
      meta: {
        isShow: false,
        isRequireAuth: false,
      }
    },
    {
      path: "selfown",
      name: "selfown",
      component: SelfOwn,
      alias: '自有',
      meta: {
        breadName: '自有'
      }
    },
    {
      path: "PlatformAllocation",
      name: "PlatformAllocation",
      component: PlatformAllocation,
      alias: '平台分配',
      meta: {
        breadName: '平台分配'
      }
    },
    {
      path: "newPrivately",
      name: "newPrivately",
      component: NewPrivately,
      hidden: true,
      meta: {
        breadName: '添加自有个体工商户'
      }
    },
    {
      path: "newPlatPrivately",
      name: "newPlatPrivately",
      component: NewPrivately,
      hidden: true,
      meta: {
        breadName: '添加平台个体工商户'
      }
    },
    {
      path: "viewRecordC/:id/:name/:legalPerson",
      name: "viewRecordC",
      component: ViewRecordC,
      meta: {
        breadName: '自有个体工商户交费记录'
      }
    },
    {
      path: "editPrivately/:id/:isSelf",
      name: "editPrivately",
      component: NewPrivately,
      hidden: true,
      meta: {
        breadName: '编辑自有个体工商户'
      }
    },
  ],
  meta: {
    isShow: true,
    breadName: '个体户管理',
    isCustomer: true,
  }
}]

export default routes