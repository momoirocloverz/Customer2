// 客户模块
const Home = () => import( '../views/Home.vue')
const NoAccess = () => import(  '../views/NoAccess.vue')
const classDetail = () => import( '../views/customer/taskTrack/classDetail.vue')
const TaskTrackDetail = () => import( '../views/customer/taskTrack/taskTrackDetail.vue')
const classList = () => import( '../views/customer/taskTrack/classList.vue')
const classManageList = () => import( '../views/customer/taskTrack/classManageList.vue')
const myTask = () => import('../views/customer/taskTrack/myTask.vue')
const attendenceList = () => import('../views/customer/taskTrack/AttendenceList.vue')

const routes = [{
  path: "/taskTrack",
  alias: '任务追踪',
  name: 'taskTrack',
  hidden: true,
  //innerNavHidden:true,
  showTop:true,
  component: Home,
  // iconCls: 'icon-classManager',
  children: [
    {
      path: "noaccess",
      name: "noaccesscustomer",
      component: NoAccess,
      alias: '无权限',
      hidden: true,
      meta: {
        isShow: false,
        isRequireAuth: false,
      }
    },    
    {
      path: "myTask",
      name: "taskTrackMyTask",
      component: myTask,
      alias: '任务数据',
      meta: {
        breadName: '任务数据'
      }
    },
    {
      path:'classList',
      name:'taskTrackClassList',
      component: classList,
      alias: '班务数据',
      meta: {
        breadName: '班务数据'
      }
    },
      {
      path: "attendenceNum",
      name: "attendenceNum",
      component: attendenceList,
      alias: '考勤数据',
      meta: {
        breadName: '考勤数据'
      }
    },
    {
      path: "classDetail",
      name: "taskTrackClassDetail",
      component: classDetail,
      hidden:true,
      alias: '班务数据',
      meta: {
        // isEdit: false,
        breadName: '班务详情'
      }
    },
    {
      path: "taskTrackDetail",
      name: "taskTrackDetail",
      component: TaskTrackDetail,
      hidden:true,
      alias: '任务详情',
      meta: {
        // isEdit: false,
        breadName: '任务详情'
      }
    },
    {
      path: "classManageList",
      name: "taskTrackClassManageList",
      component: classManageList,
      alias: '查看班务',
      hidden:true,
      meta: {
        breadName: '查看班务'
      }
    },
  ],
  meta: {
    isShow: true,
    breadName: '任务追踪',
    isCustomer: true,
  }
}]

export default routes