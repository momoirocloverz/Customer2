// 系统管理模块
const Home = () => import('../views/Home.vue')
const SystemList = () => import('../views/customer/system/SystemList.vue')
const UserList = () => import('../views/customer/system/user/UserList')
const RoleList = () => import(  '../views/customer/system/role/RoleList')
const AddUser = () => import(  '../views/customer/system/user/AddUser.vue')
const AddRole = () => import(  '../views/customer/system/role/AddRole.vue')
const NoAccess = () => import( '../views/NoAccess.vue')

const routes = [{
  path: "/system",
  name: 'system',
  component: Home,
  alias: '系统管理',
  hidden: true,
  //innerNavHidden:true,
  showTop:true,
  iconCls: 'icon-system',
  meta: {
    isShow: true,
    breadName: '系统管理',
    isCustomer: true,
  },
  children: [{
      path: '',
      name: "UserList",
      redirect: 'UserList',
      hidden: true
    },
    {
      path: "noaccess",
      name: "noaccesssystem",
      component: NoAccess,
      alias: '无权限',
      hidden: true,
      meta: {
        isShow: false,
        isRequireAuth: false,
      }
    },
    {
      path: "UserList",
      name: "UserList",
      component: UserList,
      hidden: false,
      alias: '系统用户',
      meta: {
        breadName: '系统用户'
      },
    },
    {
      path: "RoleList",
      name: "RoleList",
      component: RoleList,
      hidden: false,
      alias: '角色',
      meta: {

        breadName: '角色'
      },
    },
    {
      path: "systemList",
      name: "systemList",
      component: SystemList,
      hidden: true,
      meta: {
        breadName: '系统'
      },
    },
    {
      path: "addUser",
      name: "addUser",
      component: AddUser,
      hidden: true,
      meta: {
        breadName: '新增系统用户',
        isEdit: true,
      }
    }, {
      path: "addRole",
      name: "addRole",
      component: AddRole,
      hidden: true,
      meta: {
        breadName: '新增角色',
        isEdit: false,
      }
    }, {
      path: "editRole/:id",
      name: "editRole",
      component: AddRole,
      hidden: true,
      meta: {
        breadName: '编辑角色',
        isEdit: true,
      }
    },
    {
      path: "editUser/:id",
      name: "editUser",
      component: AddUser,
      hidden: true,
      meta: {
        breadName: '编辑系统用户',
        isEdit: true,
      }
    }
  ],
}]

export default routes