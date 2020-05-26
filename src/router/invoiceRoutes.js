const Home = () => import( '../views/Home.vue')
const InvoiceList = () => import( '../views/customer/invoice/InvoiceList.vue')
const Drawing = () => import('../views/customer/invoice/Drawing.vue')
const ManagerDrawed = () => import('../views/customer/invoice/manager/ManagerDrawed.vue')
const ManagerDrawList = () => import( '../views/customer/invoice/manager/ManagerDrawList.vue')
const PrivateDrawList = () => import( '../views/customer/invoice/privateOwn/PrivateDrawList.vue')
const MDrawing = () => import( '../views/customer/invoice/manager/MDrawing.vue')
const applyInvoice = () => import( '../views/customer/invoice/applyInvoice.vue')
const applyInvoiceTwo = () => import( '../views/customer/invoice/applyInvoiceTwo.vue')
const invoiceInfo = () => import( '../views/customer/invoice/invoiceInfo.vue')
const platformInfo = () => import('../views/customer/invoice/platformInfo.vue')
const applyInvoiceAddress = () => import( '../views/customer/invoice/applyInvoiceAddress.vue')
const platformAddress = () => import( '../views/customer/invoice/platformAddress.vue')
const platformInvoice = () => import( '../views/customer/invoice/platformInvoice.vue')
const platformInvoiceTwo = () => import( '../views/customer/invoice/platformInvoiceTwo.vue')
const NoAccess = () => import( '../views/NoAccess.vue')

const EpibolyAddress = () => import( '../views/customer/invoice/epibolyFee/epibolyAddress.vue')
const EpibolyFeeOne = () => import( '../views/customer/invoice/epibolyFee/epibolyFeeOne.vue')
const EpibolyFeeTwo = () => import( '../views/customer/invoice/epibolyFee/epibolyFeeTwo.vue')
const EpibolyInfo = () => import( '../views/customer/invoice/epibolyFee/epibolyInfo.vue')
const empty = () => import(  '../views/customer/task/components/emptyCon.vue')

const routes = [{
  //8-13版本需要暂时隐藏
  path: "/invoice",
  hidden: true,
  component: empty,
  name: 'invoice',
  alias: '开票管理',
  iconCls: 'icon-invoice',
  meta: {
    isShow: true,
    breadName: '开票管理',
    isCustomer: true,
  },
  children: [{
      path: '',
      name:'invoiceList',
      redirect: 'invoiceList',
      component: InvoiceList,
      hidden: true,
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
      path: "invoiceList",
      name: "invoiceList",
      component: InvoiceList,
      alias: '申请开票',
      meta: {
        breadName: '申请开票'
      }
    },
    {
      path: "drawing",
      name: "drawing",
      component: Drawing,
      hidden: true,
      meta: {
        breadName: '我要开票'
      }
    },
    {
      path: "applyInvoice",
      name: "applyInvoice",
      hidden: true,
      component: applyInvoice,
      meta: {
        breadName: '申请开票'
      }
    },
    {
      path: "applyInvoiceTwo",
      name: "applyInvoiceTwo",
      hidden: true,
      component: applyInvoiceTwo,
      meta: {
        breadName: '申请开票'
      }
    },
    {
      path: "invoiceInfo",
      name: "invoiceInfo",
      hidden: true,
      component: invoiceInfo,
      meta: {
        breadName: '申请开票'
      }
    },
    {
      path: "platformInfo",
      name: "platformInfo",
      hidden: true,
      component: platformInfo,
      meta: {
        breadName: '申请开票'
      }
    },
    {
      path: "applyInvoiceAddress",
      name: "applyInvoiceAddress",
      hidden: true,
      component: applyInvoiceAddress,
      meta: {
        breadName: '申请开票'
      }
    },
    {
      path: "platformAddress",
      name: "platformAddress",
      hidden: true,
      component: platformAddress,
      meta: {
        breadName: '申请开票'
      }
    },
    {
      path: "platformInvoice",
      name: "platformInvoice",
      hidden: true,
      component: platformInvoice,
      meta: {
        breadName: '申请开票'
      }
    },
    {
      path: "platformInvoiceTwo",
      name: "platformInvoiceTwo",
      hidden: true,
      component: platformInvoiceTwo,
      meta: {
        breadName: '申请开票'
      }
    },
    {
      path: "epibolyFeeOne",
      name: "epibolyFeeOne",
      hidden: true,
      component: EpibolyFeeOne,
      meta: {
        breadName: '申请开票'
      }
    },
    {
      path: "epibolyFeeTwo",
      name: "epibolyFeeTwo",
      hidden: true,
      component: EpibolyFeeTwo,
      meta: {
        breadName: '申请开票'
      }
    },
    {
      path: "epibolyInfo",
      name: "epibolyInfo",
      component: EpibolyInfo,
      hidden: true,
      meta: {
        breadName: '申请开票'
      }
    },
    {
      path: "epibolyAddress",
      name: "epibolyAddress",
      hidden: true,
      component: EpibolyAddress,
      meta: {
        breadName: '申请开票'
      }
    },
  ]
}]

//以下历史版本注释，
// 个体户开票，项目经理开票暂时隐藏
// {
//   path: "privateDrawList",
//   name: "privateDrawList",
//   component: PrivateDrawList,
//   alias: '个体户开票',
//   meta: {
//     breadName: '个体户开票'
//   }
// },
// {
//   path: "ManagerDrawList",
//   name: "ManagerDrawList",
//   component: ManagerDrawList,
//   alias: '项目经理开票',
//   meta: {
//     breadName: '项目经理开票'
//   }
// },
// {
//   path: "mDrawing",
//   name: "mDrawing",
//   hidden: true,
//   component: MDrawing,
//   meta: {
//     breadName: '项目经理开票'
//   }
// },
export default routes