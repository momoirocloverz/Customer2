// 零工模块
const Home = () => import( '../views/Home.vue')
const WorkerListAble = () => import( '../views/customer/worker/WorkerListAble.vue')
const WorkerListUnable = () => import('../views/customer/worker/WorkerListUnable.vue')
const WorkerDetail = () => import( '../views/customer/worker/WorkerDetail.vue')
const AddWorker = () => import( '../views/customer/worker/AddWorker.vue')
const WorkerImport = () => import( '../views/customer/worker/Import.vue')
const ImportDetail = () => import( '../views/customer/worker/ImportDetail.vue')
const EditInfo = () => import( '../views/customer/worker/EditInfo.vue')
const AddForm = () => import( '../views/customer/worker/AddForm.vue')
const emptyWorker = () => import( '../views/customer/worker/components/emptyWorker.vue')
const workerRegister = () => import( '../views/customer/worker/components/workerRegister.vue')

const routes = [{
  path: "/worker",
  name: "worker",
  component: Home,
  alias: '零工管理',
  iconCls: 'icon-worker',
  meta: {
    isShow: true,
    breadName: '零工管理',
    isCustomer: true,
  },
  children: [{
    path: '',
    redirect: 'workerListable'
  },
  {
    path: "workerListable",
    name: "workerListable",
    component: WorkerListAble,
    alias: '在用零工',
    meta: {
      isShow: true,
      breadName: '在用零工'
    }
  },
  {
    path: "workerListunable",
    name: "workerListunable",
    component: WorkerListUnable,
    alias: '停用零工',
    meta: {
      isShow: true,
      breadName: '停用零工'
    }
  },
  {
    path: "workerRegister",
    name: "workerRegister",
    component: workerRegister,
    alias: '异常零工注册',
    meta: {
      isShow: true,
      breadName: '异常零工注册'
    }
  },
  {
    path: "workerDetail/:id/:talentId",
    name: "workerDetail",
    component: WorkerDetail,
    alias: '零工详情',
    hidden: true,
    meta: {
      isShow: false,
      breadName: '零工详情'
    }
  },
  {
    path: "addWorker",
    name: "addWorker",
    component: AddWorker,
    alias: '添加零工',
    hidden: true,
    meta: {
      isShow: false,
      breadName: '添加零工'
    }
  },
  {
    path: "editWorker/:id",
    name: "editWorker",
    component: AddWorker,
    alias: '编辑零工',
    hidden: true,
    meta: {
      isShow: false,
      breadName: '编辑零工'
    }
  },
  {
    path: "WorkerImport",
    name: "WorkerImport",
    component: WorkerImport,
    alias: '特殊考勤人员',
    hidden: true,
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
    hidden: true,
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
    hidden: true,
    meta: {
      isShow: false,
      breadName: '编辑社保信息'
    }
  },
  {
    path: "addForm/:id/:type",
    name: "addForm",
    component: AddForm,
    alias: '添加信息',
    hidden: true,
    meta: {
      isShow: false,
      breadName: '添加信息'
    }
  },
  {
    path: "editForm/:id/:type",
    name: "editForm",
    component: AddForm,
    alias: '编辑信息',
    hidden: true,
    meta: {
      isShow: false,
      breadName: '编辑信息'
    }
  },
  ]
}]
export default routes