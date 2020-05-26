// 任务模块
import receiveComplete from "../views/customer/task/classWork/receiveComplete";

const Home = () => import(  '../views/Home.vue')
//const TaskList = () => import( '../views/customer/task/TaskList.vue')
const DispatchTask = () => import( '../views/customer/task/components/DispatchTask.vue')
const ToConfirm = () => import(  '../views/customer/task/components/ToConfirm.vue')
const ReceptSuccess = () => import(  '../views/customer/task/components/ReceptSuccess.vue')
//const PriceSetting = () => import(  '../views/customer/task/components/PriceSetting.vue')
const AddTask = () => import( '../views/customer/task/AddTaskdialog.vue')
const TaskDetail = () => import(  '../views/customer/task/TaskDetail.vue')
const AffiliateTaskDetail = () => import(  '../views/customer/task/affiliateTaskDetail.vue')
const NoAccess = () => import( '../views/NoAccess.vue')
const preemptionRecords = () => import(  '../views/customer/task/preemptionRecords.vue')
const AffiliatedTask = () => import(  '../views/customer/task/components/affiliatedTask.vue')
const takeTask = () => import(  '../views/customer/task/takeTask.vue')
const empty = () => import(  '../views/customer/task/components/emptyCon.vue')

//班务市场
const emptyClassWork = () => import(  '../views/customer/task/components/emptyCon.vue')
const PublishClassWork = () => import( '../views/customer/task/classWork/publishList.vue');
const Unclaimed = () => import( '../views/customer/task/classWork/unclaimed.vue');
const ReceiveComplete = () => import( '../views/customer/task/classWork/receiveComplete.vue');
const SigningAccount = () => import( '../views/customer/task/classWork/signingAccount.vue');
const ClassWorkDetail = () => import( '../views/customer/task/classWork/classWorkDetail.vue');

// 常用经理人
const emptyBind = () => import(  '../views/customer/task/components/emptyBind.vue')
const BindCustomerList = () => import(  '../views/customer/task/bindCustomerList.vue')
const UnBindCustomerList = () => import(  '../views/customer/task/unBindCustomerList.vue')

const marketPaymenTaskCon = () => import(  '../views/customer/market/marketPaymenTask/marketPaymenTaskCon.vue');
const marketPaymenNormalDetail = () => import(  '../views/customer/market/marketPaymenTask/components/normalDetail.vue');
const marketPaymenNotConfirmed = () => import(  '../views/customer/market/marketPaymenTask/components/notConfirmed.vue');

const marketReceiveTaskCon = () => import(  '../views/customer/market/marketReceiveTask/marketReceiveTaskCon.vue');
const marketReceiveNormalDetail = () => import(  '../views/customer/market/marketReceiveTask/components/normalDetail.vue');
const marketReceiveNotConfirmed = () => import(  '../views/customer/market/marketReceiveTask/components/notConfirmed.vue');

const routes = [{
    path: "/task",
    name: "task",
    component: Home,
    alias: '接发单市场',
    iconCls: 'icon-task',
    // hidden: true,
    //innerNavHidden:true,
    showTop: true,
    meta: {
        isShow: true,
        breadName: '接发单市场',
        isCustomer: true,
    },
    children: [
        {
            path: '/taskManage',
            alias: '任务市场',
            name: 'taskManage',
            component: empty,
            meta: {
                isShow: true,
                breadName: '任务市场'
            },
            children: [
                {
                    path: '',
                    name:'DispatchTask',
                    hidden: true,
                    redirect: 'DispatchTask',
                },
                {
                    path: "DispatchTask",
                    name: "DispatchTask",
                    component: DispatchTask,
                    alias: '发任务',
                    meta: {
                        isShow: true,
                        breadName: '发任务'
                    }
                },
                {
                    path: "noaccess",
                    name: "noaccesstask",
                    component: NoAccess,
                    alias: '无权限',
                    hidden: true,
                    meta: {
                        isShow: false,
                        isRequireAuth: false,
                    }
                },
                {
                    path: "ToConfirm",
                    name: "ToConfirm",
                    component: ToConfirm,
                    alias: '待确认',
                    isWork:1,//任务
                    meta: {
                        isShow: true,
                        breadName: '待确认'
                    }
                },
                {
                    path: "takeTask",
                    name: "takeTask",
                    component: takeTask,
                    alias: '任务抢单',
                    meta: {
                        isShow: true,
                        breadName: '任务抢单'
                    }
                },
                {
                    path: "preemptionRecords",
                    name: "preemptionRecords",
                    component: preemptionRecords,
                    alias: '抢单记录',
                    isWork:3,
                    meta: {
                        isShow: true,
                        breadName: '抢单记录'
                    }
                },
                {
                    path: "affiliatedTask",
                    name: "affiliatedTask",
                    component: AffiliatedTask,
                    alias: '挂靠任务抢单记录',
                    meta: {
                        isShow: true,
                        breadName: '挂靠任务抢单记录'
                    }
                },
                {
                    path: "ReceptSuccess",
                    name: "ReceptSuccess",
                    component: ReceptSuccess,
                    alias: '领取完毕',
                    meta: {
                        isShow: true,
                        breadName: '领取完毕'
                    }
                },
                {
                    path: "addTask",
                    name: "addTask",
                    component: AddTask,
                    alias: '添加任务',
                    hidden: true,
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
                    hidden: true,
                    meta: {
                        isShow: true,
                        breadName: '编辑任务'
                    }
                },
                {
                    path: "TaskDetail",
                    name: "TaskDetail",
                    component: TaskDetail,
                    alias: '任务详情',
                    hidden: true,
                    meta: {
                        breadName: '任务详情',
                    }
                },
                {
                    path: "affiliateTaskDetail",
                    name: "affiliateTaskDetail",
                    component: AffiliateTaskDetail,
                    alias: '任务详情',
                    hidden: true,
                    meta: {
                        breadName: '任务详情',
                    }
                },
            ],
        },
        {
            path: '/missionPlaza',
            alias: '班务市场',
            name: 'missionPlaza',
            component: emptyClassWork,
            meta: {
                isShow: true,
                breadName: '班务市场'
            },
            children: [
                {
                    path: '',
                    name:'takeTask',
                    redirect: 'takeTask',
                    hidden:true,
                },
                {
                    path: "noaccess",
                    name: "noaccesstask",
                    component: NoAccess,
                    alias: '无权限',
                    hidden: true,
                    meta: {
                        isShow: false,
                        isRequireAuth: false,
                    }
                },
                {
                    path: "publishClassWork",
                    name: "publishClassWork",
                    component:PublishClassWork,
                    alias: '我发布的班务',
                    meta: {
                        isShow: true,
                        breadName: '我发布的班务'
                    }
                },{
                    path: "unclaimed",
                    name: "unclaimed",
                    component:Unclaimed,
                    alias: '待确认',
                    isWork:2,//班务
                    meta: {
                        isShow: true,
                        breadName: '待确认',
                    }
                },
                {
                    path: "receiveComplete",
                    name: "receiveComplete",
                    component:ReceiveComplete,
                    alias: '领取完毕',
                    meta: {
                        isShow: true,
                        breadName: '领取完毕'
                    }
                },{
                    path: "signingAccount",
                    name: "signingAccount",
                    component:SigningAccount,
                    hidden:true,
                    alias: '电子签约账户经办人',
                    meta: {
                        isShow: true,
                        breadName: '电子签约账户经办人'
                    }
                },{
                    path: "classWorkDetail",
                    name: "classWorkDetail",
                    component:ClassWorkDetail,
                    hidden:true,
                    alias: '班务详情',
                    meta: {
                        isShow: true,
                        breadName: '班务详情'
                    }
                },
            ],
        },
        {
            path: '/commonly',
            alias: '经理人列表',
            name: 'commonly',
            component: emptyBind,
            meta: {
                isShow: true,
                breadName: '经理人列表'
            },
            children: [
                {
                    path: '',
                    name:'bindCustomerList',
                    redirect: 'bindCustomerList',
                    hidden:true,
                },
                {
                    path: "noaccess",
                    name: "noaccesstask",
                    component: NoAccess,
                    alias: '无权限',
                    hidden: true,
                    meta: {
                        isShow: false,
                        isRequireAuth: false,
                    }
                },
                {
                    path: "bindCustomerList",
                    name: "bindCustomerList",
                    component: BindCustomerList,
                    alias: '已绑定',
                    meta: {
                        isShow: true,
                        breadName: '已绑定'
                    }
                },
                {
                    path: "unBindCustomerList",
                    name: "unBindCustomerList",
                    component: UnBindCustomerList,
                    alias: '已解绑',
                    meta: {
                        isShow: true,
                        breadName: '已解绑'
                    }
                },
            ],
        },        
        {
            path: '/marketPaymenTas',
            alias: '应付任务',
            name: 'marketPaymenTas',
            component: empty,
            meta: {
                isShow: true,
                breadName: '应付任务'
            },
            children: [
                {
                    path: '',
                    name:'marketPaymenTaskConRe',
                    redirect: 'marketPaymenTaskCon',
                    hidden:true,
                },
                {
                    path: "marketPaymenTaskCon",
                    name: "marketPaymenTaskCon",
                    component: marketPaymenTaskCon,
                    alias: '应付任务',
                    meta: {
                        isShow: true,
                        breadName: '应付任务'
                    }
                },
                {
                    path: "marketPaymenNormalDetail",
                    name: "marketPaymenNormalDetail",
                    component: marketPaymenNormalDetail,
                    alias: '应付明细',
                    hidden:true,
                    meta: {
                        isShow: true,
                        breadName: '应付明细'
                    }
                },
                {
                    path: "marketPaymenNotConfirmed",
                    name: "marketPaymenNotConfirmed",
                    component: marketPaymenNotConfirmed,
                    alias: '未确认清单',
                    hidden:true,
                    meta: {
                        isShow: true,
                        breadName: '未确认清单'
                    }
                },
                {
                    path: "noaccess",
                    name: "noaccesstask",
                    component: NoAccess,
                    alias: '无权限',
                    hidden: true,
                    meta: {
                        isShow: false,
                        isRequireAuth: false,
                    }
                },
            ]
        },
        {
            path: '/marketReceiveTas',
            alias: '应收任务',
            name: 'marketReceiveTas',
            component: empty,
            meta: {
                isShow: true,
                breadName: '应收任务'
            },
            children: [
                {
                    path: '',
                    name:'marketPaymenTaskConRe',
                    redirect: 'marketPaymenTaskCon',
                    hidden:true,
                },
                {
                    path: "marketReceiveTaskCon",
                    name: "marketReceiveTaskCon",
                    component: marketReceiveTaskCon,
                    alias: '应收任务',
                    meta: {
                        isShow: true,
                        breadName: '应收任务'
                    }
                },
                {
                    path: "marketReceiveNormalDetail",
                    name: "marketReceiveNormalDetail",
                    component: marketReceiveNormalDetail,
                    alias: '应收明细',
                    hidden:true,
                    meta: {
                        isShow: true,
                        breadName: '应收明细'
                    }
                },                
                {
                    path: "marketReceiveNotConfirmed",
                    name: "marketReceiveNotConfirmed",
                    component: marketReceiveNotConfirmed,
                    alias: '未确认清单',
                    hidden:true,
                    meta: {
                        isShow: true,
                        breadName: '未确认清单'
                    }
                },
                {
                    path: "noaccess",
                    name: "noaccesstask",
                    component: NoAccess,
                    alias: '无权限',
                    hidden: true,
                    meta: {
                        isShow: false,
                        isRequireAuth: false,
                    }
                },
            ]
        },
        
    ]
}]
export default routes