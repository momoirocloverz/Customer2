import Vue from "vue";
import Router from "vue-router";
const Home = () => import( /* webpackChunkName: 'home' */ './views/Home.vue')
const Login = () => import( /* webpackChunkName: 'home' */ './views/Login.vue')
const FindPwd = () => import( /* webpackChunkName: 'home' */ './views/FindPwd.vue')
// const test = () => import( /* webpackChunkName: 'home' */ './views/test.vue')
// const Viewworker = () => import( /* webpackChunkName: 'home' */ './views/Viewworker.vue')
// const WorkerList = () => import( /* webpackChunkName: 'home' */ './views/WorkerList.vue')
//零工
const WorkerListAble = () => import( /* webpackChunkName: 'worker' */ './views/customer/worker/WorkerListAble.vue')
// const WorkerListUnable = () => import( /* webpackChunkName: 'worker' */ './views/customer/worker/WorkerListUnable.vue')
const WorkerDetail = () => import( /* webpackChunkName: 'worker' */ './views/customer/worker/WorkerDetail.vue')
const AddWorker = () => import( /* webpackChunkName: 'worker' */ './views/customer/worker/AddWorker.vue')
const WorkerImport = () => import( /* webpackChunkName: 'worker' */ './views/customer/worker/Import.vue')
const ImportDetail = () => import( /* webpackChunkName: 'worker' */ './views/customer/worker/ImportDetail.vue')
const EditInfo = () => import( /* webpackChunkName: 'worker' */ './views/customer/worker/EditInfo.vue')
const AddForm = () => import( /* webpackChunkName: 'worker' */ './views/customer/worker/AddForm.vue')

//项目经理
// const projectManagerList = () => import( /* webpackChunkName: 'projectManager' */ './views/customer/projectManager/List.vue')
const projectManagerWorker = () => import( /* webpackChunkName: 'projectManager' */ './views/customer/projectManager/MyWorker')
const projectManagerdetail = () => import( /* webpackChunkName: 'projectManager' */ './views/customer/projectManager/detail')
// const projectManagerdetailnew = () => import( /* webpackChunkName: 'projectManager' */ './views/customer/projectManager/detailnew')

//我的账户
const AccountList = () => import( /* webpackChunkName: 'account' */ './views/customer/account/AccountList.vue')
const Recharge = () => import( /* webpackChunkName: 'account' */ './views/customer/account/Recharge.vue')
const exportAccount = () => import( /* webpackChunkName: 'account' */ './views/customer/account/export.vue')

//任务
const TaskList = () => import( /* webpackChunkName: 'task' */ './views/customer/task/TaskList.vue')
// const AddTask = () => import( /* webpackChunkName: 'task' */ './views/customer/task/AddTask.vue')
const AddTask = () => import( /* webpackChunkName: 'task' */ './views/customer/task/AddTaskdialog.vue')
const TaskDetail = () => import( /* webpackChunkName: 'task' */ './views/customer/task/TaskDetail.vue')

//账号管理
const ViewCompanyInfo = () => import( /* webpackChunkName: 'account' */ './views/customer/accountID/ViewCompanyInfo.vue')
const EditPsw = () => import( /* webpackChunkName: 'account' */ './views/customer/accountID/EditPsw.vue')
const BindPhone = () => import( /* webpackChunkName: 'account' */ './views/customer/accountID/BindPhone.vue')

//系统
const SystemList = () => import( /* webpackChunkName: 'account' */ './views/customer/system/SystemList.vue')
const AddUser = () => import( /* webpackChunkName: 'account' */ './views/customer/system/user/AddUser.vue')
const AddRole = () => import( /* webpackChunkName: 'account' */ './views/customer/system/role/AddRole.vue')

//客户模块
const customerList = () => import( /* webpackChunkName: 'privately' */ './views/customer/childcustomer/List.vue')
const addCustomer = () => import( /* webpackChunkName: 'privately' */ './views/customer/childcustomer/AddCustomer.vue')
const customerDetail = () => import( /* webpackChunkName: 'privately' */ './views/customer/childcustomer/detail.vue')
// const editPwd = () => import(/* webpackChunkName: 'account' */ './views/customer/childcustomer/EditPsw.vue')
// const editPhone = () => import(/* webpackChunkName: 'account' */ './views/customer/childcustomer/EditPhone.vue')

//排班模块
const scheduleList = () => import( /* webpackChunkName: 'privately' */ './views/customer/schedule/scheduleList.vue')
const schedulingDetail = () => import( /* webpackChunkName: 'privately' */ './views/customer/schedule/schedulingDetail.vue')
const schedulingExport = () => import( /* webpackChunkName: 'privately' */ './views/customer/schedule/Export.vue')

//考勤
const AttendenceList = () => import( /* webpackChunkName: 'attendence' */ './views/customer/attendence/AttendenceList.vue')
const AttendenceListOut = () => import( /* webpackChunkName: 'attendence' */ './views/customer/attendence/AttendenceListOut.vue')
const attendenceExport = () => import( /* webpackChunkName: 'attendence' */ './views/customer/attendence/Export.vue')

//个体户
const PrivatelyList = () => import( /* webpackChunkName: 'privately' */ './views/customer/privately/PrivatelyList.vue')
const NewPrivately = () => import( /* webpackChunkName: 'privately' */ './views/customer/privately/NewPrivately.vue')
const ViewRecordC = () => import( /* webpackChunkName: 'privately' */ './views/customer/privately/ViewRecordC.vue')


//应付
const payableList = () => import( /* webpackChunkName: 'payable' */ './views/customer/payable/List.vue')
const payableDetail = () => import( /* webpackChunkName: 'payable' */ './views/customer/payable/workerPays/detail.vue')
const salaryBill = () => import( /* webpackChunkName: 'payable' */ './views/customer/payable/workerPays/salaryBill.vue')
const salaryAdjust = () => import( /* webpackChunkName: 'payable' */ './views/customer/payable/workerPays/salaryAdjust.vue')
const salaryImport = () => import( /* webpackChunkName: 'payable' */ './views/customer/payable/workerPays/salaryImport.vue')
const wokerprivateDetail = () => import( /* webpackChunkName: 'payable' */ './views/customer/payable/workerPays/wokerprivateDetail.vue')
const projectPayDetail = () => import( /* webpackChunkName: 'payable' */ './views/customer/payable/projectPays/detail.vue')
const profitTable = () => import( /* webpackChunkName: 'payable' */ './views/customer/payable/managerProfit/profitTable.vue')
const profitDetail = () => import( /* webpackChunkName: 'payable' */ './views/customer/payable/managerProfit/profitDetail.vue')
const profitAdjust = () => import( /* webpackChunkName: 'payable' */ './views/customer/payable/managerProfit/profitAdjust.vue')
const profitImport = () => import( /* webpackChunkName: 'payable' */ './views/customer/payable/managerProfit/profitImport.vue')
const privateDetail = () => import( /* webpackChunkName: 'payable' */ './views/customer/payable/managerProfit/privateDetail.vue')
const socialSetting = () => import( /* webpackChunkName: 'payable' */ './views/customer/payable/workerSocials/setting.vue')
const salaryDetail = () => import( /* webpackChunkName: 'payable' */ './views/customer/payable/workerPays/salaryDetail.vue')
//应收客户
const receivableList = () => import( /* webpackChunkName: 'payable' */ './views/customer/receivableCustomer/receivableList.vue')

//报表系列界面
const statementList = () => import( /* webpackChunkName: 'payable' */ './views/customer/statement/list.vue')

//发票
const InvoiceList = () => import( /* webpackChunkName: 'invoice' */ './views/customer/invoice/InvoiceList.vue')
const Drawing = () => import( /* webpackChunkName: 'invoice' */ './views/customer/invoice/Drawing.vue')
const ManagerDrawed = () => import( /* webpackChunkName: 'invoice' */ './views/customer/invoice/manager/ManagerDrawed.vue')
const ManagerDrawList = () => import( /* webpackChunkName: 'invoice' */ './views/customer/invoice/manager/ManagerDrawList.vue')
const PrivateDrawList = () => import( /* webpackChunkName: 'invoice' */ './views/customer/invoice/privateOwn/PrivateDrawList.vue')
const MDrawing = () => import( /* webpackChunkName: 'invoice' */ './views/customer/invoice/manager/MDrawing.vue')

//项目经理
const MAccountList = () => import( /* webpackChunkName: 'manager' */ './views/manager/account/AccountList.vue')
const MRecharge = () => import( /* webpackChunkName: 'manager' */ './views/manager/account/Recharge.vue')

Vue.use(Router);


export default new Router({
  routes: [
    //公共模块
    {
      path: "/home",
      name: "home",
      component: Home,
      alias: '首页',
      meta: {
        isShow: false,
        breadName: '首页',
      }
    },
    {
      path: "/login",
      name: "login",
      component: Login,
      alias: '登录',
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
      meta: {
        isShow: false,
        isRequireAuth: false,

      }
    },
    //客户模块
    {
      path: "/projectManager",
      component: Home,
      alias: '班务经理',
      children: [
        //   {
        //   path: '',
        //   redirect: 'List',
        //   component: projectManagerList
        // },
        // {
        //   path: "List",
        //   name: "projectManagerList",
        //   component: projectManagerList,
        //   meta: {
        //     breadName: '项目经理列表'
        //   }
        // },
        {
          path: "myworker/:id",
          name: "myworker",
          component: projectManagerWorker,
          meta: {
            breadName: '查看分配的零工'
          }
        },
        {
          path: "detail/:id/:userId",
          name: "projectManagerdetail",
          component: projectManagerdetail,
          meta: {
            breadName: '查看详情'
          }
        },
        // {
        //   path: "detailnew/:id/:userId",
        //   name: "projectManagerdetailnew",
        //   component: projectManagerdetailnew,
        //   meta: {
        //     breadName: '查看详情'
        //   }
        // }
      ],
      meta: {
        isShow: true,
        breadName: '项目经理',
        isCustomer: true,
      }
    },
    {
      path: "/worker",
      name: "worker",
      component: Home,
      alias: '我的零工',
      meta: {
        isShow: true,
        breadName: '我的零工',
        isCustomer: true,
      },
      children: [{
        path: '',
        redirect: 'workerList',
        component: WorkerListAble
      },
      {
        path: "workerList",
        name: "workerList",
        component: WorkerListAble,
        alias: '零工列表',
        meta: {
          isShow: true,
          breadName: '零工列表'
        }
      },
      {
        path: "workerDetail/:id/:talentId",
        name: "workerDetail",
        component: WorkerDetail,
        alias: '零工详情',
        meta: {
          isShow: true,
          breadName: '零工详情'
        }
      },
      {
        path: "addWorker",
        name: "addWorker",
        component: AddWorker,
        alias: '添加零工',
        meta: {
          isShow: true,
          breadName: '添加零工'
        }
      },
      {
        path: "editWorker/:id",
        name: "editWorker",
        component: AddWorker,
        alias: '编辑零工',
        meta: {
          isShow: true,
          breadName: '编辑零工'
        }
      },
      {
        path: "WorkerImport",
        name: "WorkerImport",
        component: WorkerImport,
        alias: '特殊考勤人员',
        meta: {
          isShow: true,
          breadName: '特殊考勤人员'
        }
      },
      {
        path: "ImportDetail",
        name: "ImportDetail",
        component: ImportDetail,
        alias: '特殊考勤人员',
        meta: {
          isShow: true,
          breadName: '特殊考勤人员'
        }
      },
      {
        path: "editInfo/:id",
        name: "editInfo",
        component: EditInfo,
        alias: '编辑社保信息',
        meta: {
          isShow: true,
          breadName: '编辑社保信息'
        }
      },
      {
        path: "addForm/:id/:type",
        name: "addForm",
        component: AddForm,
        alias: '添加信息',
        meta: {
          isShow: true,
          breadName: '添加信息'
        }
      },
      {
        path: "editForm/:id/:type",
        name: "editForm",
        component: AddForm,
        alias: '编辑信息',
        meta: {
          isShow: true,
          breadName: '编辑信息'
        }
      },
      ]
    },
    {
      path: "/account",
      name: "account",
      component: Home,
      alias: '账户管理',
      meta: {
        isShow: true,
        breadName: '账户管理',
        isCustomer: true,
      },
      children: [{
        path: '',
        redirect: 'accountList',
        component: AccountList
      },
      {
        path: 'Recharge',
        name: 'Recharge',
        component: Recharge,
        alias: '充值',
        meta: {
          isShow: true,
          breadName: '充值'
        }
      },
      {
        path: 'export',
        name: 'export',
        component: exportAccount,
        alias: '导出明细',
        meta: {
          isShow: true,
          breadName: '导出明细'
        }
      },
      {
        path: "accountList",
        name: "accountList",
        component: AccountList,
        alias: '我的账户',
        meta: {
          isShow: true,
          breadName: '我的账户'
        }
      },
      ]
    },
    {
      path: "/accountID",
      name: "accountID",
      component: Home,
      alias: '账号管理',
      meta: {
        isShow: false,
        breadName: '账号管理',
        isCustomer: true,
      },
      children: [{
        path: '',
        redirect: 'viewCompanyInfo',
        component: ViewCompanyInfo
      },
      {
        path: "viewCompanyInfo",
        name: "viewCompanyInfo",
        component: ViewCompanyInfo,
        alias: '查看公司信息',
        meta: {
          isShow: true,
          breadName: '查看公司信息'
        }
      },
      {
        path: "editPsw",
        name: "editPsw",
        component: EditPsw,
        alias: '修改密码',
        meta: {
          isShow: true,
          breadName: '修改密码'
        }
      },
      {
        path: "bindPhone",
        name: "bindPhone",
        component: BindPhone,
        alias: '更换绑定手机号',
        meta: {
          isShow: true,
          breadName: '更换绑定手机号'
        }
      },
      ]
    },
    {
      path: "/system",
      component: Home,
      alias: '系统管理',
      children: [{
        path: '',
        redirect: 'systemList',
        component: SystemList
      },
      {
        path: "systemList",
        name: "systemList",
        component: SystemList,
        meta: {
          breadName: '系统'
        },
      }, {
        path: "addUser",
        name: "addUser",
        component: AddUser,
        meta: {
          breadName: '新增系统用户',
          isEdit: true,
        }
      }, {
        path: "addRole",
        name: "addRole",
        component: AddRole,
        meta: {
          breadName: '新增角色',
          isEdit: false,
        }
      }, {
        path: "editRole/:id",
        name: "editRole",
        component: AddRole,
        meta: {
          breadName: '编辑角色',
          isEdit: true,
        }
      },
      {
        path: "editUser/:id",
        name: "editUser",
        component: AddUser,
        meta: {
          breadName: '编辑系统用户',
          isEdit: true,
        }
      }
      ],
      meta: {
        isShow: true,
        breadName: '系统',
        isCustomer: true,
      }
    },
    // {
    //   path: "/receivableCustomer",
    //   component: Home,
    //   alias: '应收客户',
    //   children: [{
    //     path: '',
    //     redirect: 'receivableList',
    //     component: receivableList
    //   },
    //   {
    //     path: "receivableList",
    //     name: "receivableList",
    //     component: receivableList,
    //     meta: {
    //       breadName: '应收客户列表'
    //     }
    //   }
    //   ],
    //   meta: {
    //     isShow: true,
    //     breadName: '客户管理',
    //     isCustomer: true,
    //   }
    // },
    //子客户
    {
      path: "/customer",
      component: Home,
      alias: '客户管理',
      children: [{
        path: '',
        redirect: 'List',
        component: customerList
      },
      {
        path: "List",
        name: "customerList",
        component: customerList,
        meta: {
          breadName: '客户列表'
        }
      },
      {
        path: "add",
        name: "addCustomer",
        component: addCustomer,
        meta: {
          isEdit: false,
          breadName: '添加客户'
        }
      },
      {
        path: "edit/:id",
        name: "editCustomer",
        component: addCustomer,
        meta: {
          isEdit: true,
          breadName: '编辑客户'
        }
      },
      {
        path: "detail/:id",
        name: "customerDetail",
        component: customerDetail,
        meta: {
          breadName: '客户详情'
        }
      },
        // {
        //   path: "editPwd/:id", name: "editPwd", component: editPwd, meta: {
        //   breadName: '修改密码'
        // }
        // },
        // {
        //   path: "editPhone/:id", name: "editPhone", component: editPhone, meta: {
        //   breadName: '修改密码'
        // }
        // },
      ],
      meta: {
        isShow: true,
        breadName: '客户管理',
        isCustomer: true,
      }
    },
    {
      path: "/task",
      name: "task",
      component: Home,
      alias: '任务管理',
      meta: {
        isShow: true,
        breadName: '任务管理',
        isCustomer: true,
      },
      children: [{
        path: '',
        redirect: 'taskList',
        component: TaskList
      },
      {
        path: "taskList",
        name: "taskList",
        component: TaskList,
        alias: '任务列表',
        meta: {
          isShow: true,
          breadName: '任务列表'
        }
      },
      {
        path: "addTask",
        name: "addTask",
        component: AddTask,
        alias: '添加任务',
        meta: {
          isShow: true,
          breadName: '添加任务'
        }
      },
      {
        path: "editTask/:id",
        name: "editTask",
        component: AddTask,
        alias: '编辑任务',
        meta: {
          isShow: true,
          breadName: '编辑任务'
        }
      },
      {
        path: "TaskDetail",
        name: "TaskDetail",
        component: TaskDetail,
        meta: {
          breadName: '任务详情',
        }
      },
      ]
    },
    // {
    //   path: "/schedule",
    //   name: "schedule",
    //   component: Home,
    //   alias: '排班管理',
    //   meta: {
    //     isShow: true,
    //     breadName: '排班管理',
    //     isCustomer: true,
    //   },
    //   children: [{
    //     path: '',
    //     redirect: 'scheduleList',
    //     component: scheduleList
    //   },
    //   {
    //     path: "scheduleList",
    //     name: "scheduleList",
    //     component: scheduleList,
    //     alias: '排班列表',
    //     meta: {
    //       isShow: true,
    //       breadName: '排班列表'
    //     }
    //   },
    //   {
    //     path: "schedulingDetail/:id/:hasPhoto/:name",
    //     name: "schedulingDetail",
    //     component: schedulingDetail,
    //     meta: {
    //       breadName: '排班详情表'
    //     }
    //   },
    //   {
    //     path: "export",
    //     name: "schedulingExport",
    //     component: schedulingExport,
    //     meta: {
    //       breadName: '批量导出客户确认表'
    //     },
    //   },
    //   ]
    // },
    {
      path: "/attendence",
      component: Home,
      alias: '考勤管理',
      children: [{
        path: '',
        redirect: 'attendenceList',
        component: AttendenceList
      },
      {
        path: "attendenceList",
        name: "AttendenceList",
        component: AttendenceList,
        meta: {
          breadName: '对外考勤'
        },
      },
      {
        path: "attendenceListOut",
        name: "AttendenceListOut",
        component: AttendenceListOut,
        meta: {
          breadName: '对内考勤'
        },
      },
      {
        path: "export",
        name: "attendenceExport",
        component: attendenceExport,
        meta: {
          breadName: '导出考勤数据'
        },
      }
      ],
      meta: {
        isShow: true,
        breadName: '考勤管理',
        isCustomer: true,
      }
    },
    {
      path: "/privately",
      component: Home,
      alias: '个体户管理',
      children: [{
        path: '',
        redirect: 'privatelyList',
        component: PrivatelyList
      },
      {
        path: "privatelyList",
        name: "privatelyList",
        component: PrivatelyList,
        meta: {
          breadName: '个体工商户列表'
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
    },
    {
      path: "/invoice",
      component: Home,
      hidden: true,
      alias: '开票管理',
      children: [{
        path: '',
        redirect: 'invoiceList',
        component: InvoiceList
      },
      {
        path: "invoiceList",
        name: "invoiceList",
        component: InvoiceList,
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
        path: "privateDrawList",
        name: "privateDrawList",
        component: PrivateDrawList,
        meta: {
          breadName: '个体户开票'
        }
      },
      {
        path: "ManagerDrawList",
        name: "ManagerDrawList",
        component: ManagerDrawList,
        meta: {
          breadName: '项目经理开票'
        }
      },
      {
        path: "mDrawing",
        name: "mDrawing",
        hidden: true,
        component: MDrawing,
        meta: {
          breadName: '项目经理开票'
        }
      },
      ],
      meta: {
        isShow: true,
        breadName: '开票管理',
        isCustomer: true,
      }
    },
    {
      path: "/payable",
      component: Home,
      alias: '应付管理',
      children: [{
        path: '',
        redirect: 'payableList',
        component: payableList
      },
      {
        path: 'paypage',
        name: 'paypage',
        component: () => import('./views/customer/payable/PayPage.vue'),
        meta: {
          breadName: '付款页面'
        }
      },
      {
        path: "payableList",
        name: "payableList",
        component: payableList,
        meta: {
          breadName: '应付列表'
        },
      },
      {
        path: "payableDetail/:batchNumber/:settlementType",
        name: "payableDetail",
        component: payableDetail,
        meta: {
          breadName: '应付零工详情'
        },
      },
      {
        path: "salaryBill/:id/:talentType/:isSocialSecurity/:name/:settlementType",
        name: "salaryBill",
        component: salaryBill,
        meta: {
          breadName: '零工收入条'
        },
      },
      {
        path: "salaryDetail/:id/:settlementType/:batchNumber/:name",
        name: "salaryDetail",
        component: salaryDetail,
        meta: {
          breadName: '收入明细'
        },
      },
      {
        path: "salaryAdjust/:id/:name/:talentId",
        name: "salaryAdjust",
        component: salaryAdjust,
        meta: {
          breadName: '收入调整'
        },
      },
      {
        path: "salaryImport/:batchNumber/:settlementType",
        name: "salaryImport",
        component: salaryImport,
        meta: {
          breadName: '导入调整项'
        },
      },
      {
        path: "wokerprivateDetail",
        name: "wokerprivateDetail",
        component: wokerprivateDetail,
        meta: {
          breadName: '个体户明细'
        },
      },
      {
        path: "projectPayDetail/:id/:name/:payerType",
        name: "projectPayDetail",
        component: projectPayDetail,
        meta: {
          breadName: '排班查看-项目结算'
        },
      },
      {
        path: "profitTable/:id/:batchNumber/:managerId/:name",
        name: "profitTable",
        component: profitTable,
        meta: {
          breadName: '利润表'
        },
      },
      {
        path: "profitDetail/:batchNumber",
        name: "profitDetail",
        component: profitDetail,
        meta: {
          breadName: '应付利润明细'
        },
      },
      {
        path: "profitAdjust/:id/:name",
        name: "profitAdjust",
        component: profitAdjust,
        meta: {
          breadName: '利润调整'
        },
      },
      {
        path: "profitImport/:batchNumber",
        name: "profitImport",
        component: profitImport,
        meta: {
          breadName: '导入利润表调整项'
        },
      },
      {
        path: "privateDetail",
        name: "privateDetail",
        component: privateDetail,
        meta: {
          breadName: '个体户明细'
        },
      },
      {
        path: "socialSetting",
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
    },
    {
      path: "/mAccount",
      component: Home,
      alias: '我的账户',
      children: [{
        path: '',
        redirect: 'mAccountList',
        component: MAccountList
      },
      {
        path: "mAccountList",
        name: "mAccountList",
        component: MAccountList,
        meta: {
          breadName: '账户明细'
        },
      },
      {
        path: "mRecharge",
        name: "mRecharge",
        component: MRecharge,
        meta: {
          breadName: '充值'
        },
      },
      ],
      meta: {
        isShow: true,
        breadName: '我的账户',
        isCustomer: false,
      }
    },
  ]
});