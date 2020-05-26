// 零工模块
const Home = () => import( '../views/Home.vue')
const WorkerListAble = () => import( '../views/customer/worker/WorkerListAble.vue')
const WorkerListUnable = () => import( '../views/customer/worker/WorkerListUnable.vue')
const WorkerDetail = () => import( '../views/customer/worker/WorkerDetail.vue')
const WorkerDetailSp = () => import( '../views/customer/worker/WorkerDetailSp.vue')
const AddWorker = () => import( '../views/customer/worker/AddWorker.vue')
const WorkerImport = () => import( '../views/customer/worker/Import.vue')
const ImportDetail = () => import( '../views/customer/worker/ImportDetail.vue')
const EditInfo = () => import( '../views/customer/worker/EditInfo.vue')
const AddForm = () => import( '../views/customer/worker/AddForm.vue')
const emptyWorker = () => import( '../views/customer/worker/components/emptyWorker.vue')
const workerRegister = () => import( '../views/customer/worker/components/workerRegister.vue')
const NoAccess = () => import( '../views/NoAccess.vue')
const WorkersDays = () => import( '../views/customer/worker/workersDays.vue');
const BlackList = () => import( '../views/customer/worker/blackList.vue');
const waitingReceive = () => import( '../views/customer/worker/waitingReceive.vue');
const empty = () => import(  '../views/customer/task/components/emptyCon.vue')

const routes = [{
    path: "/worker",
    name: "worker",
    component: empty,
    alias: '零工管理',
    // iconCls: 'icon-worker',
    meta: {
        isShow: true,
        breadName: '零工管理',
        isCustomer: true,
    },
    children: [{
        path: '',
        name: 'workerListable',
        redirect: 'workerListable',
        hidden: true,
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
            path: "noaccess",
            name: "noaccessworker",
            component: NoAccess,
            alias: '无权限',
            hidden: true,
            meta: {
                isShow: false,
                isRequireAuth: false,
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
            path: "workersDays",
            name: "workersDays",
            component: WorkersDays,
            alias: '日结零工',
            meta: {
                isShow: true,
                breadName: '日结零工'
            }
        },
        {
            path: "emptyWorker",
            name: "emptyWorker",
            component: emptyWorker,
            hidden: false,
            alias: '特殊考勤人员',
            meta: {
                isShow: false,
                breadName: '特殊考勤人员'
            }
        },
        {
            path: "waitingReceive",
            name: "waitingReceive",
            component: waitingReceive,
            alias: '待接收零工',
            meta: {
                isShow: true,
                breadName: '待接收零工'
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
            path: "blackList",
            name: "blackList",
            component: BlackList,
            alias: '黑名单',
            meta: {
                isShow: true,
                breadName: '黑名单'
            }
        },
        {
            path: "workerDetail/:id/:talentId",
            name: "workerDetail",
            component: WorkerDetail,
            alias: '绑定零工基本详情',
            hidden: true,
            meta: {
                isShow: false,
                breadName: '绑定零工基本详情'
            }
        },
        {
            path: "WorkerDetailSp",
            name: "WorkerDetailSp",
            component: WorkerDetailSp,
            alias: '绑定零工基本详情',
            hidden: true,
            meta: {
                isShow: false,
                breadName: '绑定零工基本详情'
            }
        },
        {
            path: "workerDetailDaily/:id/:talentId",
            name: "workerDetailDaily",
            component: WorkerDetail,
            alias: '日结零工基本详情',
            hidden: true,
            meta: {
                isShow: false,
                breadName: '日结零工基本详情'
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
localStorage.setItem('newroutes', JSON.stringify(routes[0]['children']))
if (localStorage.getItem("userInfo") != undefined) {
    let emptyTalentSwitch = JSON.parse(localStorage.getItem("userInfo")).emptyTalentSwitch;
    if (emptyTalentSwitch == 2) {
        let arr3 = routes[0]['children']
        let newArr = []
        arr3.forEach(item => {
            if (item.alias != '特殊考勤人员') {
                newArr.push(item)
            }
        })
        routes[0]['children'] = newArr
    }
    if (emptyTalentSwitch == 1) {
        let arr3 = routes[0]['children']
        let bl = false
        arr3.forEach(item => {
            if (item.alias == '特殊考勤人员') {
                bl = true
            }
        })
        if (!bl) {
            routes[0]['children'].push(routes[0]['children'][3])
        }
    }
}
export default routes