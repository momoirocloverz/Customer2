// 公共路由
const Home = () => import( '../views/Home.vue')
const Login = () => import( '../views/Login.vue')
const WelCome = () => import('../views/WelCome.vue')
const NoAccess = () => import(  '../views/NoAccess.vue')
const LicencePage = () => import(  '../views/licence.vue')
const FindPwd = () => import( '../views/FindPwd.vue')
const NotFound = () => import( '../views/404.vue')
const ViewCompanyInfo = () => import( '../views/customer/accountID/ViewCompanyInfo.vue')
const EditPsw = () => import( '../views/customer/accountID/EditPsw.vue')
const BindPhone = () => import( '../views/customer/accountID/BindPhone.vue')
const routes = [{
    path: "/",
    // name: "home",
    component: Home,
    alias: '总览',
    hidden: true, // 不在导航栏显示
    meta: {
      // isShow: false,
      breadName: '总览',
    },
    children: [{
        path: "",
        // name: "login",  //路由命名冲突
        redirect: 'login',
        component: WelCome,
        alias: '欢迎使用',
        hidden: true,
        meta: {
          isShow: false,
          isRequireAuth: false,
          breadName: '欢迎页',
        }
      },
      {
        path: "welcome",
        name: "welcome",
        component: WelCome,
        alias: '欢迎使用',
        // hidden: true,
        meta: {
          //isShow: false,
          isRequireAuth: false,
        }
      },
      {
        path: "noaccess",
        name: "noaccess",
        component: NoAccess,
        alias: '无权限',
        hidden: true,
        meta: {
          isShow: false,
          isRequireAuth: false,
        }
      },
      {
        path: "viewCompanyInfo",
        name: "viewCompanyInfo",
        component: ViewCompanyInfo,
        alias: '查看公司信息',
        hidden: true,
        meta: {
          isShow: false,
          breadName: '查看公司信息'
        }
      },
      {
        path: "editPsw",
        name: "editPsw",
        component: EditPsw,
        alias: '修改密码',
        hidden: true,
        meta: {
          isShow: false,
          breadName: '修改密码'
        }
      },
      {
        path: 'paypage',
        name: 'paypage',
        component: () => import('../views/customer/payable/PayPage.vue'),
        hidden: true,
        meta: {
          isShow: false,
          breadName: '付款页面'
        }
      },
      {
        path: "bindPhone",
        name: "bindPhone",
        component: BindPhone,
        alias: '更换绑定手机号',
        hidden: true,
        meta: {
          isShow: false,
          breadName: '更换绑定手机号'
        }
      }
    ]
  },
  {
    path: "/login",
    name: "login",
    component: Login,
    alias: '登录',
    hidden: true,
    meta: {
      isShow: false,
      isRequireAuth: false,
    }
  },
  {
    path: "/licence",
    name: "licence",
    component: LicencePage,
    alias: '经营许可证',
    hidden: true,
    meta: {
      isShow: false,
      isRequireAuth: false,
    }
  },
  {
    path: "/findpwd",
    name: "FindPwd",
    component: FindPwd,
    alias: '找回密码',
    hidden: true,
    meta: {
      isShow: false,
      isRequireAuth: false,

    }
  },
  {
    path: "/404",
    name: "NotFound",
    component: NotFound,
    alias: '页面不存在',
    hidden: true,
    meta: {
      isShow: false,
      isRequireAuth: false,
    }
  }
]

export default routes