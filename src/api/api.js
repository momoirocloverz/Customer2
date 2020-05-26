import Axios from './http'
import Qs from 'qs'
import {
    get,
    deletes,
    gets
} from './http'

let baseURL = 'http://test.api.10000rc.com';
// let baseURL = 'http://www.10000rc.com/2.0';
// let baseURL = 'http://192.168.8.26/2.0' //泽阳本地
//let baseURL = 'http://192.168.8.14/2.0' //健权本地

if (process.env.NODE_ENV == 'production') {
    if (process.env.VUE_APP_TITLE == 'pre') {
        baseURL = 'http://pre.api.10000rc.com/pre';
    } else if (process.env.VUE_APP_TITLE == 'test') {
        baseURL = 'http://test.api.10000rc.com';
    } else if (process.env.VUE_APP_TITLE == 'jq') {
        baseURL = 'http://192.168.8.14/2.0';
    }else if (process.env.VUE_APP_TITLE == 'zy') {
        baseURL = 'http://192.168.8.26/2.0';
    } else {
        baseURL = 'http://www.10000rc.com/2.0';
    }
}

const publicURL = baseURL + '/public';
let bizURL = baseURL + '/biz';
const financeURL = baseURL + '/finance';
const userURL = baseURL + '/user';
// 老袁本地调试
// const publicURL = baseURL + '/public';
// let bizURL =  'http://192.168.8.82:8180/biz';
// const financeURL =   'http://192.168.8.82:8182/finance';
// const userURL =   'http://192.168.8.82:8186/user';


//班务经理
//const lsClassURL = baseURL+'/dev/class';
export default {
    // 公共模块
    groupDetail: (param) => {
        return Axios.post(`${baseURL}/admin/login/submit`, param)
    },
    //获取字典列表
    getDicList: (code, value) => {
        return Axios.get(`${publicURL}/dictionary/getSonNodeByCodeAndValue?code=${code}&value=${value}`)
    },
    //获取qiuniuToken
    getToken: () => {
        return Axios.get(`${publicURL}/qiniu/token`)
    },
    postImg: (params1, params2) => { //上传图片
        return Axios.post(`http://upload.qiniu.com/putb64/-1/`, params1, {
            headers: {
                "Content-Type": "application/octet-stream",
                "Authorization": "UpToken " + params2,
            },
            withCredentials: false
        })
    },
    // 待开票/已开票-记录列表
    invoiceAdd: (param) => {
        return Axios.post(`${financeURL}/invoice/list`, param)
    },
    // 查询开票信息详情
    managerBillInfoDetail: (param) => {
        return Axios.get(`${financeURL}/managerBillInfo/detail?billInfoId=${param.billInfoId}`)
    },
    // 查询开票信息列表
    managerBillInfoList: () => {
        return Axios.get(`${financeURL}/invoiceInfo/list`)
    },
    // 新增开票信息
    managerBillInfoAdd: (param) => {
        return Axios.post(`${financeURL}/invoiceInfo/add`, param)
    },
    // 修改开票信息
    managerBillInfoUpdate: (param) => {
        return Axios.post(`${financeURL}/invoiceInfo/update`, param)
    },
    // 删除开票信息
    managerBillInfoDel: (param) => {
        return deletes(`${financeURL}/invoiceInfo/del`, param)
    },
    // 查询收货地址详情
    managerBillAddressDetail: (param) => {
        return Axios.get(`${financeURL}/managerBillAddress/detail?addressId=${param.addressId}`)
    },
    // 查询开票收货地址列表
    managerBillAddressList: () => {
        return Axios.get(`${financeURL}/invoiceAddress/list`)
    },
    // 新增收货地址
    managerBillAddressAdd: (param) => {
        return Axios.post(`${financeURL}/invoiceAddress/add`, param)
    },
    // 修改收货地址
    managerBillAddressUpdate: (param) => {
        return Axios.post(`${financeURL}/invoiceAddress/update`, param)
    },
    // 删除收货地址
    managerBillAddressDel: (param) => {
        return deletes(`${financeURL}/invoiceAddress/del`, param)
    },
    // 查看可开票的劳务费列表
    listCanInvoiceSalaryVO: () => {
        return Axios.get(`${financeURL}/invoice/listCanInvoiceSalaryVO`)
    },
    // 提交开票申请(零工劳务费开票)
    salaryFee: (param) => {
        return Axios.post(`${financeURL}/invoice/submit/salaryFee`, param, {
            headers: {
                'Content-Type': 'application/json',
            }
        })
    },
    // 提交开票申请(平台花费开票)
    platformFee: (param) => {
        return Axios.post(`${financeURL}/invoice/submit/platformFee`, param)
    },
    // 开票名称字典项
    invoiceNameList: () => {
        return Axios.get(`${financeURL}/invoice/invoiceNameList`)
    },
    // 经理人获取绑定的商户的开票服务费
    getBillServerRate: () => {
        return Axios.get(`${financeURL}/invoice/getBillServerRate`)
    },

    //报表
    analysisList: (params) => {
        return Axios.post(`${bizURL}/task/statistics/analysisReport`, params)
    },
    // 报表-任务列表
    analyTaskList: (params) => {
        return get(`${bizURL}/task/statistics/taskList`, params)
    },
    // 报表-待生成利润列表
    /*  profitQuery: (params) => {
      return get(`${bizURL}/report/profitQuery`, params)
    },*/
// 报表-第一步，确认收入接口
    /*  taskQuery: (params) => {
      return get(`${bizURL}/report/taskQuery`, params)
    },*/
// 报表-第一步，更新收入第一步
    finshProfitOne: (params) => {
        return Axios.post(`${bizURL}/report/finshProfitOne`, params)
    },
// 报表-确认支出接口
    payQuery: (params) => {
        return get(`${bizURL}/report/payQuery`, params)
    },
// 报表-第二步，更新支出第二步
    finshProfitTwo: (params) => {
        return Axios.post(`${bizURL}/report/finshProfitTwo`, params)
    },
// 项目利润汇总查看列表(待)
    profitTotalDetailQuery: (params) => {
        return get(`${bizURL}/report/profitTotalDetailQuery`, params)
    },
// 项目利润项目经理汇总表，折线图
    profitTotalQuery: (params) => {
        return get(`${bizURL}/report/profitTotalQuery`, params)
    },
    // 报表-待生成利润列表
    profitQuery: (params) => {
        return get(`${bizURL}/report/profitQuery`, params)
    },
    // 报表-第一步，确认收入接口
    taskQuery: (params) => {
        return get(`${bizURL}/report/taskQuery`, params)
    },
    // 已生成利润列表
    profitQueryYet: (param) => {
        return get(`${bizURL}/report/profitQueryYet`, param)
    },
    // 待生成利润条数
    profitWaitQueryCount: () => {
        return get(`${bizURL}/report/profitWaitQueryCount`)
    },

    // 项目经理利润折线图
    profitQueryDetailList: (param) => {
        return get(`${bizURL}/report/profitQueryDetailList`, param)
    },

    // 项目经理利润
    profitQueryDetail: (param) => {
        return get(`${bizURL}/report/profitQueryDetail`, param)
    },
    // 客户模块
    getCustomerList: (params) => {
        return Axios.post(`${bizURL}/customer/list`, params)
    },
    // 客户模块
    getTaskList: (params) => {
        return Axios.post(`${bizURL}/classTask/customer/list`, params)
    },
    addCustomer: (params) => {
        return Axios.post(`${bizURL}/customer/add`, params)
    },
    editCustomer: (params) => {
        return Axios.post(`${bizURL}/customer/update`, params)
    },
    detailCustomer: (params) => {
        return get(`${bizURL}/customer/detail`, params)
    },
    freezeCustomer: (id) => {
        return Axios.post(`${bizURL}/customer/freeze?id=${id}`)
    },
    unfreezeCustomer: (id) => {
        return Axios.post(`${bizURL}/customer/unfreeze?id=${id}`)
    },
    updateCusPwd: (params) => {
        return Axios.post(`${bizURL}/customer/adminAccountUpdatePwd`, params)
    },
    updateCusPhone: (params) => {
        return Axios.post(`${bizURL}/customer/adminAccountUpdateMobile`, params)
    },
    getTaskBelongList: () => {
        return get(`${bizURL}/task/support/taskBelongToList`)
    },
    // 项目经理未解绑-设置发薪日期接口
    managerSetPayday: (params) => {
        return Axios.post(`${bizURL}/manager/setPayday`, params)
    },
    // 经理人模块
    generateBindingCode: () => {
        return get(`${bizURL}/manager/generateBindingCode`)
    },
    startUnbinding: (params) => {
        return Axios.post(`${bizURL}/manager/startUnbinding`, params)
    },
    cancelUnbinding: (params) => {
        return Axios.post(`${bizURL}/manager/cancelUnbinding`, params)
    },
    agreeUnbinding: (params) => {
        return Axios.post(`${bizURL}/manager/agreeUnbinding`, params)
    },
    getPmList: (params) => {
        return Axios.post(`${bizURL}/manager/platformManagerList`, params)
    },
    getPmListCus: (params) => {
        const {customerId} = JSON.parse(localStorage.getItem('userInfo'));
        const $params = {
            ...params,
            customerId
        }
        return get(`${bizURL}/newtalent/classManagerList`, {...$params})
    },
    getAllTaskId: (params) => {
        return get(`${bizURL}/task/support/projectPayTaskQueryList`, params)
    },
    getCheckIcon: (params) => {
        return get(`${bizURL}/scheduling/confirm/getSchedulingConfirm`, params)
    },
    setDailyPayType: (params) => { //设置经理人模式
        return get(`${bizURL}/customer/setDailyPayType`, params)
    },
    getDailyPayType: (params) => { //设置经理人模式
        return get(`${bizURL}/customer/getDailyPayType`, params)
    },
    // 客户下所有的项目经理(客户后台登录不需要传这个值)
    getAllPmListCus: () => {
        return get(`${bizURL}/jobInfoSupport/allCustomerManagerList`)
    },
    // 经理人所创建的所有班务经理
    classManagerList: (params) => {
        return get(`${bizURL}/newtalent/classManagerList`, params)
    },
    pmCheckFail: (params) => {
        return Axios.post(`${bizURL}/manager/checkFail`, params)
    },
    pmCheckPass: (params) => {
        return Axios.post(`${bizURL}/manager/checkPass`, params)
    },
    detailPm: (params) => {
        return get(`${bizURL}/manager/detail`, params)
    },
    freezePm: (id) => {
        return Axios.post(`${bizURL}/manager/freeze?managerId=${id}`)
    },
    unfreezePm: (id) => {
        return Axios.post(`${bizURL}/manager/unfreeze?managerId=${id}`)
    },
    updatePm: (params) => {
        return Axios.post(`${bizURL}/manager/updateAuthInfo`, params)
    },


    //工商户
    addPrivately: (param) => { //添加自有个体工商户
        return Axios.post(`${financeURL}/individualBusiness/persion/add`, param)
    },
    addPrivatelyPlat: (param) => { //添加平台个体工商户
        return Axios.post(`${financeURL}/individualBusiness/platform/add`, param)
    },
    updatePrivately: (param) => { //编辑个体工商户
        return Axios.post(`${financeURL}/individualBusiness/update`, param)
    },
    PrivatelyViewRecord: (param) => { //自有个体工商户交费记录
        return Axios.post(`${financeURL}/individualBusiness/recharge/search`, param)
    },
    PrivatelyPayCharge: (param) => { //自有个体工商户续费
        return Axios.post(`${financeURL}/individualBusiness/customer/recharge`, param)
    },
    PViewRecord: (param) => { //平台服务费记录
        return Axios.post(`${financeURL}/individualBusiness/gRunningAccount`, param)
    },
    PrivatelyList: (param) => { //自有个体工商户列表
        return Axios.post(`${financeURL}/individualBusiness/customer/lists`, param)
    },
    PlatPrivatelyList: (param) => { //平台个体工商户列表
        return Axios.post(`${financeURL}/individualBusiness/customer/platform/lists`, param)
    },
    Recycle: (param) => { //平台回收
        return Axios.post(`${financeURL}/individualBusiness/recycle`, param)
    },
    Allocation: (param) => { //分配
        return Axios.post(`${financeURL}/individualBusiness/allocation`, param)
    },
    PrivatelyOwnDetail: (param) => { //个体户详情
        return Axios.post(`${financeURL}/individualBusiness/detial`, param)
    },
    login: (param) => { //登录
        return Axios.post(`${userURL}/user/login`, param)
    },
    getSmsCode: (params) => { //获取短信验证码
        return get(`${publicURL}/sms/code`, params)
    },
    UpdateUserInfo: (param) => { //更新个人信息
        return Axios.post(`${userURL}/user/update`, param)
    },
    UpdateUserPassword: (param) => { //更新密码
        return Axios.post(`${userURL}/user/updatePassword`, param)
    },
    UpdateUserPwd: (param) => { //客户更新密码
        return Axios.post(`${userURL}/user/webupdatepassword`, param)
    },
    UpdateUserTel: (param) => { //客户更新手机
        return Axios.post(`${userURL}/user/webupdatedmobile`, param)
    },
    //获取账号信息
    getUserInfo: (param) => {
        return get(`${userURL}/user/loginname`, param)
    },
    checkUsername: (param) => {
        return Axios.post(`${userURL}/user/check/username`, param)
    },

    signTalent: (param) => { //异常零工注册
        return Axios.post(`${userURL}/user/signTalent`, param)
    },

    //系统
    AddPermission: (param) => { //添加权限
        return Axios.post(`${userURL}/permission/add`, param)
    },
    EditPermission: (param) => { //编辑权限
        return Axios.post(`${userURL}/permission/update`, param)
    },
    ViewPermission: (param) => { //查看权限
        return Axios.post(`${userURL}/permission/info`, param)
    },
    TreePermission: (param) => { //权限树
        return Axios.post(`${userURL}/permission/treelist`, param)
    },
    DeletePermission: (param) => { //删除权限
        return deletes(`${userURL}/permission/delete`, param)
    },

    UserList: (params) => { //用户列表
        return Axios.post(`${userURL}/user/list`, params)
    },
    AddUser: (param) => { //用户添加
        return Axios.post(`${userURL}/user/add`, param)
    },
    EditUser: (param) => { //编辑用户
        return Axios.post(`${userURL}/user/update`, param)
    },
    RoleDetail: (param) => { //用户详情
        return get(`${userURL}/user/detail`, param)
    },
    ViewUser: (params) => { //查看用户
        return get(`${userURL}/user/info`, params)
    },

    RoleList: (params) => { //角色列表
        return Axios.post(`${userURL}/role/list`, params)
    },
    AddRole: (param) => { //角色添加
        return Axios.post(`${userURL}/role/add`, param)
    },
    EditRole: (param) => { //编辑角色
        return Axios.post(`${userURL}/role/update`, param)
    },
    ViewRole: (params) => { //查看角色
        return get(`${userURL}/role/detail`, params)
    },
    LoginOut: (param) => { //登录
        return get(`${userURL}/user/logout`, param)
    },

    //获取零工列表
    getWorkerList: (param) => {
        return Axios.post(`${bizURL}/talent/platform/emp/lists`, param)
    },
    //获取零工列表customer
    getWorkerListcustomer: (param) => {
        return Axios.post(`${bizURL}/talent/customer/emp/lists`, param)
    },
    //获取零工列表customer
    getWorkerListThree: (param) => {
        return Axios.post(`${bizURL}/newtalent/empList`, param)
    },
    //获取零工列表customer
    getAllEmpList: (param) => {
        return get(`${bizURL}/newtalent/havenSchedulingEmpList`, param)
    },
    //获取零工列表customer---导出在用零工
    getWorkerExport: (param) => {
        return Axios.post(`${bizURL}/talent/customer/emp/lists/enable/export`, param)
    },
    //获取零工列表customer---导出停用零工
    getDisableExport: (param) => {
        return Axios.post(`${bizURL}/talent/customer/emp/lists/disable/export`, param)
    },
    //零工基本信息
    getWorkerDetail: (param) => {
        return get(`${bizURL}/talent/getById`, param)
    },
    //零工基本信息
    getWorkerDetailThree: (param) => {
        return get(`${bizURL}/newtalent/detail`, param)
    },
    //平台员工冻结
    freezeUser: (param) => {
        return Axios.post(`${bizURL}/talent/platform/freeze`, param)
    },
    //平台员工解冻
    unfreezeUser: (param) => {
        return Axios.post(`${bizURL}/talent/platform/unfreeze`, param)
    },
    //户绑定员工
    bindUser: (param) => {
        return Axios.post(`${bizURL}/talent/customer/empBindingCustomer`, param)
    },
    //客户绑定员工校验
    bindUserCheck: (param) => {
        return get(`${bizURL}/talent/customer/empBindingCustomerCheck`, param)
    },
    //获取当前客户下日结零工列表
    workeysDays: (param) => {
        // let bizURL = 'http://t7qfqr.natappfree.cc/biz'; //彭庆文本地
        return get(`${bizURL}/talent/getDailySettlement`, param)
    },
    //获取当前客户下日结零工列表
    exprotWorkeysDays: (param) => {
        // let bizURL = 'http://t7qfqr.natappfree.cc/biz'; //彭庆文本地
        return Axios.post(`${bizURL}/talent/dailySettleListExport`, param)
    },
    //新增获取黑名单列表
    getBlackList: (param) => {
        // let bizURL = 'http://t7qfqr.natappfree.cc/biz'; //彭庆文本地
        return get(`${bizURL}/blacklist/blacklist`, param)
    },
    //新增黑名单
    addBlackList: (param) => {
        // let bizURL = 'http://t7qfqr.natappfree.cc/biz'; //彭庆文本地
        return Axios.post(`${bizURL}/blacklist/blacklist`, param)
    },
    //判断是否实名认证如果实名认证返回姓名
    isAuthentic: (param) => {
        // let bizURL = 'http://t7qfqr.natappfree.cc/biz'; //彭庆文本地
        return Axios.post(`${bizURL}/blacklist/authentic`, param)
    },
    //根据id删除信息
    deleteBlackList: (param) => {
        // let bizURL = 'http://t7qfqr.natappfree.cc/biz'; //彭庆文本地
        return deletes(`${bizURL}/blacklist/blacklist`, param)
    },
    //获取客户下所有的工种标签
    GetAllTags: (param) => {
        return gets(`${publicURL}/dictionary/getByCodeAndLevel`, param)
    },
    //获取客户下所有的工种标签
    getSonNodeByParentId: (param) => {
        return get(`${publicURL}/dictionary/getSonNodeByParentId`, param)
    },
    /*修改获取客户下的工种接口*/
    GetAllTagsV1: (param) => {
        return gets(`${bizURL}/customer/getCusIndustry`, param)
    },
    wechatHandle: (param) => { //微信处理
        return gets(`${bizURL}/newtalent/operateQr`, param)
    },
    // 根据登录类型获取相应的工种列表
    getAllIndustryList: () => {
        return get(`${bizURL}/customer/getSkillsByLoginType`)
    },
    //搜索工种标签
    GetSearchTags: (param) => {
        return gets(`${bizURL}/talent/customer/getSkillTags`, param)
    },
    GetTags: (param) => {
        return gets(`${bizURL}/customer/getSkillTags`, param)
    },
    //客户员工停用
    blockUp: (param) => {
        return Axios.post(`${bizURL}/talent/customer/blockUp`, param)
    },
    //客户员工启用
    startUp: (param) => {
        return Axios.post(`${bizURL}/talent/customer/startUp`, param)
    },
    //获取经理人零工列表
    getmanagerEmpList: (param) => {
        return Axios.post(`${bizURL}/talent/manager/empList`, param)
    },
    //获取经理人零工标签
    getmanagerSkill: (param) => {
        return get(`${bizURL}/talent/manager/getSkillTags`, param)
    },

    //子客户模块
    getChildCus: (param) => { //子客户列表
        return Axios.post(`${bizURL}/customer/sub/list`, param)
    },
    addChildCus: (param) => { //子客户添加
        return Axios.post(`${bizURL}/customer/sub/add`, param)
    },
    checkFullNameChild: (param) => { //检查客户全称唯一性
        return get(`${bizURL}/customer/sub/checkFullName`, param)
    },
    checkShortNameChild: (param) => { //检查客户简称唯一性
        return get(`${bizURL}/customer/sub/checkShortName`, param)
    },
    checkCreditCodeChild: (param) => { //检查统一社会信用代码唯一性
        return get(`${bizURL}/customer/sub/checkCreditCode`, param)
    },
    ChildCusDetail: (param) => { //子客户详情
        return get(`${bizURL}/customer/sub/getById`, param)
    },
    ChildCusupdate: (param) => { //子客户详情
        return Axios.post(`${bizURL}/customer/sub/update`, param)
    },
    getByCreditCode: (param) => { //子客户详情
        return get(`${bizURL}/customer/sub/getByCreditCode`, param)
    },


    AddTask: (param) => { //添加任务
        return Axios.post(`${bizURL}/task/add`, param)
    },
    mainTaskList: (param) => { //6001主任务列表
        return Axios.post(`${bizURL}/task/taskList`, param)
    },
    receiveTaskList: (param) => { //6002任务接收列表
        return Axios.post(`${bizURL}/task/receiveList`, param)
    },
    getBelongtoList: (param) => { //6011客户后台查询任务列表时，任务所属 项的查询条件集合
        return get(`${bizURL}/task/support/belongToList`, param)
    },
    getAttBelongtoList: (param) => { //6011客户后台查询任务列表时，任务所属 项的查询条件集合
        return get(`${bizURL}/task/support/scheduling/belongToList`, param)
    },
    TaskDetail: (param) => { //任务详情
        return get(`${bizURL}/task/detail`, param)
    },
    UpdateTask: (param) => { //添加任务
        return Axios.post(`${bizURL}/task/update`, param)
    },
    TaskDelete: (param) => { //任务详情
        return deletes(`${bizURL}/task/delete/web`, param)
    },
    TaskAssign: (param) => { //任务详情
        return Axios.put(`${bizURL}/task/assign?taskId=${param.taskId}&managerUserId=${param.managerUserId}`)
    },
    TaskAgree: (param) => { //任务详情
        return get(`${bizURL}/task/agree`, param)
    },
    TaskRefuse: (param) => { //任务详情
        return get(`${bizURL}/task/reject`, param)
    },
    TaskStop: (param) => { //任务详情
        return get(`${bizURL}/task/stop`, param)
    },
    SalaryAdd: (param) => { //任务详情
        return Axios.post(`${bizURL}/industry/salary/add`, param)
    },
    SalaryUpdate: (param) => { //任务详情
        return Axios.post(`${bizURL}/industry/salary/update`, param)
    },
    SalaryList: (param) => { //任务详情
        return gets(`${bizURL}/industry/salary/list`, param)
    },
    taskSalaryList: (param) => { //任务详情
        return get(`${bizURL}/taskSalary/list`, param)
    },
    getPrimaryKey: (param) => { //任务详情
        return get(`${bizURL}/task/support/getPrimaryKey`, param)
    },
    CheckUperPrice: () => { //判断是否设置工种价格上限
        return Axios.get(`${bizURL}/industry/salary/check/customerIndustry`)
    },
    AccountDetail: () => { //账户信息
        return Axios.post(`${financeURL}/account/detail`)
    },
    AccountList: (params) => { //我的账单-明细--》列表接口
        return Axios.post(`${financeURL}/new/account/record/other/account/list`, params)
    },
    AccountOtherExport: (params) => { //我的账单-明细--》导出接口
        return Axios.post(`${financeURL}/new/account/record/other/account/export`, params)
    },
    AccountListExport: (params) => { //我的账单-明细--》导出接口
        return Axios.post(`${financeURL}/new/account/record/otherAccount/list/export`, params)
    },
    AccountListTrueExport: (params) => { //我的账单-明细--》导出接口
        return Axios.post(`${financeURL}/new/account/record/customer/manager/account/summaryList/export`, params)
    },
    AccountSummaryData: (params) => { //我的账单-明细--》汇总数据接口
        return Axios.post(`${financeURL}/new/account/record/other/account/summaryData`, params)
    },
    AccountToObjects: () => { //列表查询项的"交易对象"列表
        return Axios.get(`${financeURL}/new/account/record/customer/account/toObjects`)
    },

    AccountSummaryList: (params) => { //我的账单-汇总--》列表接口
        return Axios.post(`${financeURL}/new/account/record/customer/account/summaryList`, params)
    },
    AccountSummaryExport: (params) => { //我的账单-汇总--》导出接口
        return Axios.post(`${financeURL}/new/account/record/customer/account/summaryList/export`, params)
    },
    AccountOtherSummary: (params) => { //我的账单-汇总--》导出接口
        return Axios.post(`${financeURL}/new/account/record/otherAccount/summaryData`, params)
    },
    OtherAccountList: (params) => { //经理人账户-汇总--》 列表接口
        return Axios.post(`${financeURL}/new/account/record/otherAccount/list`, params)
    },
    AccountOtherSummaryExport: (params) => { //经理人账户-明细--》列表接口
        return Axios.post(`${financeURL}/new/account/record/customer/manager/account/summaryList/export`, params)
    },
    batchNumberSummaryDetail: (param) => { //应付零工-明细--》列表接口
        return Axios.post(`${financeURL}/salary/customer/settlement/summary/detail`, param)
    },
    batchNumberDetailTotal: (param) => { //零工结算明细-汇总
        return Axios.post(`${financeURL}/salary/customer/settlement/summary/detail/total`, param)
    },
    AccountDetailExport: (params) => { //零工结算明细导出excel
        return Axios.post(`${financeURL}/salary/customer/settlement/summary/detail/export`, params)
    },
    SchedulingList: (param) => { //列表查询项的"交易对象"列表
        return get(`${bizURL}/scheduling/unConfirmTalentSchedulingList`, param)
    },
    SchedulingCustomerList: (param) => { //列表查询项的"交易对象"列表
        return Axios.get(`${bizURL}/scheduling/unConfirmCustomerSchedulingList?pageNum=${param.pageNum}&pageSize=${param.pageSize}`)
    },
    batchNumberSummary: (param) => { //零工结算汇总列表
        return Axios.post(`${financeURL}/salary/customer/settlement/summary`, param)
    },
    SettlementTotal: (param) => { //零工结算汇总
        return Axios.post(`${financeURL}/salary/customer/settlement/summary/total`, param)
    },
    IndustryList: (param) => { //零工结算汇总
        return Axios.post(`${financeURL}/salary/customer/settlement/talent/industry/list`, param)
    },
    SettlementExport: (param) => { //零工结算汇总
        return Axios.post(`${financeURL}/salary/customer/settlement/summary/export`, param)
    },
    CusPayManagerList: () => { //列表查询项的"交易对象"列表
        return Axios.get(`${financeURL}/project/cusPayManagerList`)
    },
    NewNeedPayList: (param) => { //应付项目列表
        return Axios.post(`${financeURL}/project/needPayDetailList`, param)
    },
    NewSumData: (param) => { //应付项目列表
        return Axios.post(`${financeURL}/project/needPayDetailListSumData`, param)
    },
    NewDetailListExport: (param) => { //应付项目列表
        return Axios.post(`${financeURL}/project/needPayDetailListExport`, param)
    },
    NeedPaySummaryList: (param) => { //应付项目列表
        return Axios.post(`${financeURL}/project/needPaySummaryList`, param)
    },
    NeedPaySummaryListData: (param) => { //应付项目列表
        return Axios.post(`${financeURL}/project/needPaySummaryListSummaryData`, param)
    },
    NeedPaySummaryExport: (param) => { //应付项目列表
        return Axios.post(`${financeURL}/project/needPaySummaryListExport`, param)
    },
    AllSubList: () => { //列表查询项的"交易对象"列表
        return Axios.get(`${bizURL}/customer/sub/allSubList`)
    },
    SubCusAttendanceList: (param) => { //应付项目列表
        return Axios.post(`${financeURL}/project/receive/subCusAttendanceList`, param)
    },
    SubCusAttendanceListSumData: (param) => { //应付项目列表
        return Axios.post(`${financeURL}/project/receive/subCusAttendanceListSumData`, param)
    },
    SubCusAttendanceListExport: (param) => { //应付项目列表
        return Axios.post(`${financeURL}/project/receive/subCusAttendanceListExport`, param)
    },
    // SchedulingList: (param) => { //列表查询项的"交易对象"列表
    //   return Axios.get(`${bizURL}/scheduling/unConfirmTalentSchedulingList?pageNum=${param.pageNum}&pageSize=${param.pageSize}`)
    // },
    myAmount: (param) => { //我的账户-充值
        return Axios.get(`${financeURL}/yeePay/consume?amount=${param.amount}`)
    },
    getMobileCode: (param) => { //应付项目-明细-手机验证码
        return Axios.get(`${publicURL}/sms/code?mobile=${param.mobile}`)
    },
    getMobile: () => { //应付项目-明细-手机号获取
        return Axios.get(`${userURL}/user/detail`)
    },
    setPasswd: (params) => { //应付项目-设置/重置密码接口
        return Axios.post(`${financeURL}/account/setPasswd`, params)
    },
    cusBatchPay: (params) => { //应付项目-支付(付款)接口
        return Axios.post(`${financeURL}/project/cusBatchPay`, params)
    },
    updateEmptyTalentSign: (params) => { //应付项目-设置/重置密码接口
        return Axios.post(`${bizURL}/talent/customer/updateEmptyTalentSign`, params)
    },
    AccountRunning: (params) => { //流水
        return Axios.post(`${financeURL}/account/record/runningAccount`, params)
    },
    AccountExport: (params) => { //导出
        return Axios.post(`${financeURL}/account/record/runningAccount/export`, params)
    },
    //排班
    scheduleList: (param) => { //排班列表
        return Axios.post(`${bizURL}/scheduling/customer/lists`, param)
    },
    scheduleSetting: (param) => { //任务详情
        return get(`${bizURL}/scheduling/platform/setting`, param)
    },
    scheduleWorker: (param) => { //排班人员
        return Axios.post(`${bizURL}/scheduling/platform/employee`, param)
    },
    scheindustryList: (param) => { //排班人员
        return get(`${bizURL}/scheduling/platform/employee/industry`, param)
    },
    schePmList: () => { //排班人员
        return Axios.post(`${bizURL}/scheduling/customerSchedulingManagers`)
    },
    //空挂
    emptyWorkerList: (param) => { //排班人员
        return Axios.post(`${bizURL}/talent/customer/getEmptyTalentLists`, param)
    },
    emptyImport: (param) => { //排班人员
        return Axios.post(`${bizURL}/talent/customer/import`, param)
    },
    emptyDownload: (param) => { //排班人员
        return get(`${bizURL}/talent/customer/download/emptyEmpTemp`, param)
    },
    pmAssign: (param) => { //排班人员
        return Axios.post(`${bizURL}/talent/customer/allocationEmptyTalent`, param)
    },
    //考勤
    attendanceList: (param) => { //排班人员
        return Axios.post(`${bizURL}/attendance/list`, param)
    },
    attendanceList2: (param) => { //排班人员2
        return Axios.post(`${bizURL}/punch/outerList`, param)
    },
    outListSummary: (param) => { //合计
        return Axios.post(`${bizURL}/punch/outListSummary`, param)
    },
    outerListExport: (param) => { //导出excel
        return Axios.post(`${bizURL}/punch/outerListExport`, param)
    },
    innerList: (param) => { //对内考勤
        return Axios.post(`${bizURL}/punch/innerList`, param)
    },
    innerListSummary: (param) => { //对内考勤-合计
        return Axios.post(`${bizURL}/punch/innerListSummary`, param)
    },
    innerListExport: (param) => { //对内考勤-导出
        return Axios.post(`${bizURL}/punch/innerListExport`, param)
    },
    updateForC: (param) => { //对内考勤-修改考勤-提交
        return Axios.post(`${bizURL}/attendance/updateForC`, param)
    },
    attendanceExport: (param) => { //排班人员
        return Axios.post(`${bizURL}/attendance/export`, param)
    },
    photoSet: (param) => { //排班人员
        return get(`${bizURL}/attendance/photoSet`, param)
    },
    getPhotoSet: (param) => { //排班人员
        return get(`${bizURL}/attendance/getPhotoSet`, param)
    },
    saveWelfareSetting: (param) => { //福利设置
        return Axios.post(`${bizURL}/talent/empWelfare/save`, param)
    },
    GetWelfareDetil: (param) => { //福利设置详情
        return get(`${bizURL}/talent/empWelfare/detail`, param)
    },


    //应付
    AddSocial: (param) => { //添加社保设置
        return Axios.post(`${financeURL}/social/add`, param)
    },
    SocialList: (param) => { //社保设置列表
        return Axios.post(`${financeURL}/social/list`, param)
    },
    SocialDelete: (param) => { //社保设置列表
        return deletes(`${financeURL}/social/delete`, param)
    },
    unsettleList: (param) => { //获取未设置的调整项
        return get(`${financeURL}/adjustment/unsettle/list`, param)
    },
    adjustmentAdd: (param) => { //调整
        return Axios.post(`${financeURL}/adjustment/add`, param)
    },
    adjustmentTem: (param) => { //下载调整模板
        return get(`${bizURL}/report/adjustment/template`, param)
    },
    batchNumberList: (param) => { //应付零工
        return Axios.post(`${financeURL}/salary/customer/batchNumber/list`, param)
    },
    batchNumberDetail: (param) => { //薪资批次详情列表
        return Axios.post(`${financeURL}/salary/customer/batchNumber/Detail`, param)
    },
    salarySheetExport: (param) => { //薪资批次详情列表
        return get(`${financeURL}/salary/salarySheet/export`, param)
    },
    needPayList: (param) => { //应付项目列表
        return Axios.post(`${financeURL}/project/needPayList`, param)
    },
    batchSetPaid: (param) => { //批量设置项目为已付状态
        return Axios.post(`${financeURL}/project/batchSetPaid`, param)
    },
    taskSchedulingList: (param) => { //应付项目对应的排班列表
        return Axios.post(`${financeURL}/project/taskSchedulingList`, param)
    },
    taskSchedulingListCus: (param) => { //应付项目对应的排班列表
        return Axios.post(`${financeURL}/project/taskSchedulingListCustomer`, param)
    },
    taskSchedulingListPro: (param) => { //应付项目对应的排班列表
        return Axios.post(`${financeURL}/project/taskSchedulingListManager`, param)
    },
    salarySheet: (param) => { //应付项目对应的排班列表
        return get(`${financeURL}/salary/customer/salarySheet`, param)
    },
    ForDraw: (param) => { //待开票记录
        return Axios.post(`${financeURL}/invoice/stay/list`, param)
    },
    AlreadyDrawed: (param) => { //已开票记录
        return Axios.post(`${financeURL}/invoice/already/list`, param)
    },
    ForDrawAction: (param) => { //待开票
        return Axios.post(`${financeURL}/invoice/customer/invoice/stay/list`, param)
    },
    AlreadyDrawedAction: (param) => { //已开票
        return Axios.post(`${financeURL}/invoice/customer/invoice/already/list`, param)
    },
    privateDetailList: (param) => { //零工收入明细调整项删除
        return Axios.post(`${financeURL}/automaticAllocation/use/detail`, param)
    },
    ToDraw: (param) => { //开票
        return get(`${financeURL}/invoice/invoice`, param)
    },
    profitAllList: (param) => { //项目经理利润总列表
        return Axios.post(`${financeURL}/project/profit/batchNumberSummary`, param)
    },
    profitAllDetail: (param) => { //项目经理利润总列表
        return Axios.post(`${financeURL}/project/profit/batchNumberDetail`, param)
    },
    tableDetail: (param) => { //项目经理利润明细表详情（收入，支出，调整项等）
        return get(`${financeURL}/project/profit/tableDetail`, param)
    },
    adjustdelete: (param) => { //利润调整项删除
        return deletes(`${financeURL}/project/adjust/profit/delete`, param)
    },
    profitadjustList: (param) => { //利润调整项列表
        return get(`${financeURL}/project/adjust/profit/list`, param)
    },
    profitadjustAdd: (param) => { //tianjai利润调整项列表
        return Axios.post(`${financeURL}/project/adjust/profit/save`, param)
    },
    InvoieRecord: (param) => { //开票记录列表
        return Axios.post(`${financeURL}/account/record/invoice/list`, param)
    },
    InvoieSubmit: (param) => { //开票申请
        return Axios.post(`${financeURL}/invoice/submit`, param)
    },
    profitDownload: (param) => { //tianjai利润调整项列表
        return get(`${financeURL}/project/adjust/profit/download/importTemplate`, param)
    },
    salaryPay: (param) => { //付款
        return Axios.post(`${financeURL}/salary/pay`, param)
    },
    profitPay: (param) => { //利润付款
        return get(`${financeURL}/project/profit/pay`, param)
    },
    salaryDetailList: (param) => { //零工收入明细
        return Axios.post(`${financeURL}/salary/talent/salary/detail`, param)
    },
    adjustDelete: (param) => { //零工收入明细调整项删除
        return deletes(`${financeURL}/adjustment/delete`, param)
    },
    ParamsInfo: (params) => { //参数详情
        return get(`${publicURL}/sysparam/info`, params)
    },
    getAllBelongToList: (params) => { //客户后台查询任务列表时，任务所属 项的查询条件集合
        return get(`${bizURL}/task/support/allBelongToList`, params)
    },
    ParamsInfoString: (params) => { //参数详情
        return get(`${publicURL}/sysparam/info/string`, params)
    },
    received: () => { //客户后台查询任务列表时，任务所属 项的查询条件集合
        return get(`${bizURL}/task/customer/succ/received`)
    },

    // 职位
    // 职位列表
    getJobList(params) {
        return Axios.post(`${bizURL}/jobInfo/list`, params)
    },
    getImportList(params) {
        return Axios.post(`${bizURL}/talent/customer/import`, params)
    },
    // 职位详情
    getJobDetail(params) {
        return get(`${bizURL}/jobInfo/detail`, params)
    },
    // 费用
    // 支出统计
    getExpenseSummary(params) {
        return Axios.post(`${bizURL}/jobFeeDetail/summaryList`, params)
    },
    // 明细统计
    getExpenseDetail(params) {
        return Axios.post(`${bizURL}/jobFeeDetail/detailList`, params)
    },
    // 明细汇总
    getExpenseDetailTotal(params) {
        return Axios.post(`${bizURL}/jobFeeDetail/detailSummary`, params)
    },

    //  权限
    menuAuth(param) {
        return get(`${userURL}/menu${param}`)
    },
    //获取客户确认人列表
    getConfirmList(params) {
        return Axios.post(`${bizURL}/confirm/list`, params)
    },
    //获取所有客户确认人
    getAllConfirm(params) {
        return get(`${bizURL}/confirm/allConfirmPerson`, params)
    },
    //添加确认人
    postIdentifyAdd(params) {
        return Axios.post(`${bizURL}/confirm/add`, params)
    },
    //编辑确认人
    postIdentifyEdit(params) {
        return Axios.post(`${bizURL}/confirm/update`, params)
    },
    //设置停用和启用，1启用，2停用
    setStopAndStart(params) {
        return get(`${bizURL}/confirm/switchStatus`, params)
    },
    //改变零工状态，1启用，2停用
    switchStatus(params) {
        return get(`${bizURL}/newtalent/switchStatus`, params)
    },
    //获取任务列表
    getTaskCount(params) {
        return get(`${bizURL}/confirm/scheduling`, params)
    },
    //获取权限列表
    getPersonCount(params) {
        return get(`${bizURL}/confirm/confirmPerson`, params)
    },
    //判断是否在黑名单中
    isBlackList: (param) => {
        return get(`${bizURL}/blacklist/isInBlacklist`, param)
    },
    //经理人管理的零工修改零工，周月，零工类型
    updateEmpCus: (param) => {
        return Axios.post(`${bizURL}/newtalent/updateEmpCus`, param)
    },
    //员工更新技能标签
    insertTalentSkill: (param) => {
        return Axios.post(`${bizURL}/newtalent/insertTalentSkill`, param)
    },
    //班务经理相关api
    postAddManager(params) {
        return Axios.post(`${bizURL}/class/manager/add`, params)
    },
    getManagerList: (param) => {
        return get(`${bizURL}/classTask/managerFilter`, param)
    },
    putUpdatePassword: (param) => {
        return Axios.put(`${bizURL}/class/manager/updatePassword`, param)
    },
    putUpdate: (param) => {
        return Axios.put(`${bizURL}/class/manager/update`, param)
    },

    managementFee: () => {
        return Axios.post(`${baseURL}/finance/account/record/subFeeRemind`)
    },
    getMyAccountDetail: (param) => {
        return Axios.post(`${baseURL}/finance/account/record/accountDetail`, param)
    },
    selectSumAccountDetail: (param) => {
        return Axios.post(`${baseURL}/finance/account/record/selectSumAccountDetail`, param)
    },
    accountDetailExport: (param) => {
        return Axios.post(`${baseURL}/finance/account/record/accountDetailExport`, param)
    },
    getAccountRecordSum: (param) => {
        return Axios.post(`${baseURL}/finance/account/record/getAccountRecordSum`, param)
    },
    getAccountRecordSumExcel: (param) => {
        return Axios.post(`${baseURL}/finance/account/record/getAccountRecordSumExcel`, param)
    },
    balanceWarn: (param) => {
        return Axios.post(`${baseURL}/finance/account/record/balanceWarn`, param)
    },
    isCustomArrears: () => {
        return Axios.post(`${baseURL}/finance/account/record/isCustomArrears`)
    },

    //cg
    summary: (param) => {//应付零工全部汇总
        return get(`${financeURL}/salary/customer/settlement/summary`, param)
    },
    summaryDetail: (param) => {//应付零工结算明细   b
        return get(`${financeURL}/salary/customer/settlement/summary/detail`, param)
    },
    getPayList: (param) => {//待付款（已付款）批次汇总列表
        return get(`${financeURL}/salary/customer/settlement/payList`, param)
    },
    calculateSalary: (param) => {//生成待付批次
        //financeURL
        return get(`${financeURL}/salary/calculateSalary`, param)
    },
    payDetail: (param) => {// 待付(已付)外包费用，待发费用
        //financeURL
        return get(`${financeURL}/salary/customer/settlement/payDetail`, param)
    },
    accountDetail: (param) => {// 待付(已付)外包费用，待发费用
        //financeURL
        return Axios.post(`${financeURL}/account/detail`, param)
    },
    getTalentRP: (param) => {// 奖惩详情
        //financeURL
        return Axios.post(`${financeURL}/salary/record/getTalentRP`, param)
        // return get(`${financeURL}/reward/punish/listBySalaryId`,param)  废弃
    },
    listByTalentAndBN: (param) => {// 扣款列表
        //financeURL
        return Axios.post(`${financeURL}/salary/record/getTalentAdj`, param)
    },
    specialAdjustmentsDetailList: (param) => {// 特殊扣款详情
        //financeURL
        return Axios.post(`${financeURL}/adjustment/specialAdjustmentsDetailList`, param)
    },
    adjDelete: (param) => {// 删除扣款项
        //financeURL
        return deletes(`${financeURL}/adjustment/delete`, param)
    },
    importSalaryAdjustment: (param) => {// 导入扣款项
        //financeURL
        return Axios.post(`${financeURL}/adjustment/importSalaryAdjustment`, param)
    },
    importTemplate: (param) => {// 下载模版
        //financeURL
        return get(`${financeURL}/adjustment/download/importTemplate`, param)
    },
    exportSalary: (param) => {// 导出模板
        //financeURL
        return get(`${financeURL}/salary/customer/settlement/payDetail/export`, param)
    },
    exportAdjust: (param) => {// 导出扣款项
        //financeURL
        return Axios.post(`${financeURL}/salary/customer/settlement/adjust/export?userName=${param.userName}&payType=${param.payType}&batchNumber=${param.batchNumber}&settlementType=${param.settlementType}&payStatus=${param.payStatus}`)
    },
    getSpecialAdjustmentsDetailListSummary: (param) => {
        return Axios.post(`${financeURL}/adjustment/getSpecialAdjustmentsDetailListSummary`, param)
    },
    //支付接口
    outPay: (param) => {// 外包费用支付
        return Axios.post(`${financeURL}/salary/outPay`, param)
    },
    payInLine: (param) => {// 代发收入线上付款
        //financeURL
        return Axios.post(`${financeURL}/salary/payInLine`, param)
    },
    payUnderLine: (param) => {// 代发收入线下付款
        //financeURL
        return Axios.post(`${financeURL}/salary/payUnderLine`, param)
    },
    managerFeeDetail: (param) => {
        return Axios.post(`${financeURL}/account/record/managerFeeDetail`, param)
    },
    managerFeeDetailExcel: (param) => {
        return Axios.post(`${financeURL}/account/record/managerFeeDetailExcel`, param)
    },
    managerFeeSum: (param) => {
        return Axios.post(`${financeURL}/account/record/managerFeeSum`, param)
    },
    balanceWarnStatus: (param) => {
        return Axios.get(`${financeURL}/account/record/balanceWarnStatus`,param)
    },
    deleteBalanceWarn: (param) => {
        return Axios.post(`${financeURL}/account/record/deleteBalanceWarn`,param)
    },
    taskBelongSpToList: () => {
        return get(`${bizURL}/assignmentInfo/taskBelongToList`);
    },
    assignAddTask: (data) => {
        return Axios.post(`${bizURL}/assignmentInfo/add`, data);
    },
    assignUpdateTask: (data) => {
        return Axios.post(`${bizURL}/assignmentInfo/update`, data);
    },
    publishTaskList: (data) => {
        return Axios.post(`${bizURL}/assignmentInfo/publishTaskList`, data)
    },
    taskMarketList: (data) => {
        return Axios.post(`${bizURL}/assignmentInfo/taskMarketList`, data)
    },
    // grabTask: (data) => {
    //     return Axios.put(`${bizURL}/assignmentInfo/grab`, Qs.stringify(data))
    // },
    grabTask: (data) => {//3.0.9.1修改
        return Axios.post(`${bizURL}/assignmentInfo/grab`, data)
    },
    setAssmType: (data) => {//3.0.9.1修改
        return Axios.post(`${bizURL}/assignmentReceive/setAssmType`, data)
    },
    deleteTask: (para) => {
        return Axios.delete(`${bizURL}/assignmentInfo/delete`, {params: para})
    },
    stopTask: (data) => {
        return Axios.put(`${bizURL}/assignmentInfo/stop`, Qs.stringify(data))
    },
    toBeConfirmTaskList: (data) => {   //待确认任务列表
        return Axios.post(`${bizURL}/assignmentReceive/toBeConfirmTaskList`, data)
    },
    toBeConfirmWorkList: (data) => {   //待确认班务列表
        return Axios.post(`${bizURL}/classTaskReceive/toBeConfirmTaskList`, data)
    },
    confirmTaskList: (data) => {
        return Axios.post(`${bizURL}/assignmentInfo/confirmTaskList`, data)
    },
    confirmTaskReceiveList: (data) => {
        return Axios.post(`${bizURL}/classTaskReceive/confirmTaskList`, data)
    },
    taskReceiveRecordList: (data) => {  //任务领取记录
        return Axios.post(`${bizURL}/assignmentReceive/taskReceiveRecordList`, data)
    },
    giveUpAssignmentReceive: (data) => {  //任务领取记录 放弃任务
        return Axios.put(`${bizURL}/assignmentReceive/giveUp`, Qs.stringify(data))
    },
    deleteAssignmentReceive: (para) => { //任务领取记录 删除任务
        return Axios.delete(`${bizURL}/assignmentReceive/delete`, {params: para})
    },
    assignmentInfoDetail: (param) => {
        return get(`${bizURL}/assignmentInfo/detail`, param);
    },
    assignmentInfoPublisher: (param) => {
        return get(`${bizURL}/assignmentInfo/taskMarketList/publisher`, param);
    },
    rejectAssignmentReceive: (data) => {  //待确认任务列表 拒绝任务
        return Axios.put(`${bizURL}/assignmentReceive/reject`, Qs.stringify(data))
    },
    rejectClassTaskReceive: (data) => {  //待确认班务列表 拒绝任务
        return Axios.put(`${bizURL}/classTaskReceive/reject`, Qs.stringify(data))
    },
    agreeAssignmentReceive: (data) => {  //待确认任务列表 同意任务
        return Axios.put(`${bizURL}/assignmentReceive/agree`, Qs.stringify(data))
    },
    classTaskReceiveReceive: (data) => {  //待确认班务列表 同意任务
        return Axios.post(`${bizURL}/classTaskReceive/agree`, data)
    },
    //奖惩列表
    getRewardAndPunishList: (param) => {
        return Axios.post(`${financeURL}/reward/punish/detailList`, param)
    },
    getRewardAndPunishListExport: (param) => {
        return Axios.post(`${financeURL}/reward/punish/detailList/export`, param)
    },
    //奖惩字典列表
    getByCodeAndLevel: (param) => {
        return get(`${publicURL}/dictionary/getByCodeAndLevel?code=rnpType`, param);
    },
    //班务管理--》我的任务列表
    getMyTaskList: (param) => {
        return Axios.post(`${bizURL}/classTask/myTaskList`, param)
    },
    //新增任务时的所属列表
    getTaskBelongToList: (param) => {
        return get(`${bizURL}/assignmentInfo/taskBelongToList`, param)
    },
    //经理人后台--》班务列表
    getClassTaskCustomerList: (param) => {
        return Axios.post(`${bizURL}/classTask/customer/list`, param);
    },
    //工种要求字典列表
    getByCodeAndLevelIndustry: (param) => {
        return get(`${publicURL}/dictionary/getByCodeAndLevel?code=industry&level=2`, param);
    },
    //添加班务
    postClassTaskAdd: (param) => {
        return Axios.post(`${bizURL}/classTask/add`, param);
    },
    //班务详情
    getClassTaskDetail: (param) => {
        return get(`${bizURL}/classTask/detail`, param);
    },
    //编辑班务
    postClassTaskUpdate: (param) => {
        return Axios.post(`${bizURL}/classTask/update`, param);
    },
    //任务所属的班务列表
    getAssignmentInfoClassTaskList: (param) => {
        return get(`${bizURL}/classTask/assignmentInfoClassTaskList`, param);
    },
    //验证任务状态
    getTaskStatus: (param) => {
        return get(`${bizURL}/assignmentInfo/detail`, param);
    },
    //结束班务
    classTaskFinish: (param) => {
        return Axios.put(`${bizURL}/classTask/finish?classTaskId=${param.classTaskId}`);
    },
    //删除班务班务
    classTaskDelete: (param) => {
        return Axios.delete(`${bizURL}/classTask/delete?classTaskId=${param.classTaskId}`);
    },
    //结束任务
    assignmentInfoStop: (param) => {
        return Axios.put(`${bizURL}/assignmentInfo/stop?id=${param.id}`);
    },
    //经理人后台--》可开票的交易记录
    canInvoiceTransactionRecordList: (param) => {
        return Axios.post(`${financeURL}/invoice/canInvoiceTransactionRecordList`, param);
    },
    //经理人后台--》提交开票申请
    invoiceSubmit: (param) => {
        return Axios.post(`${financeURL}/invoice/submit`, param);
    },
    outsourceRecharge: (param) => {
        return Axios.post(`${financeURL}/account/record/outsourceRecharge`, param);
    },
    changeOutsource: (param) => {
        return Axios.put(`${financeURL}/account/record/changeOutsource`, param);
    },
    getCountOutSource: (param) => {
        return get(`${financeURL}/account/record/getCountOutSource`, param);
    },
    outSourceInfoById: (param) => {
        return get(`${financeURL}/account/record/outSourceInfoById`, param);
    },
    outsourceRechargeList: (param) => {
        return get(`${financeURL}/account/record/outsourceRechargeList`, param);
    },
    detailLite: (param) => {
        return get(`${bizURL}/customer/detailLite`, param);
    },
    listBySalaryIds: (param) => { //奖惩待审核
        // return get(`${financeURL}/adjustment/listBySalaryIds`,param);
        return get(`${financeURL}/reward/punish/getUnCheckTalentRP`, param);
    },
    //经理人后台--》班务经理列表
    managerMyBindingManagerList: (param) => {
        return get(`${bizURL}/customer/manager/myBindingManagerList`, param);
    },
    //经理人后台--》对班务经理进行解绑操作
    customerManagerUnBinding: (param) => {
        return Axios.put(`${bizURL}/customer/manager/unBinding?customerManagerId=${param.customerManagerId}`);
    },
    //获取验证码
    customerManagerGetBindingCode: (param) => {
        return get(`${bizURL}/customer/manager/getBindingCode`, param);
    },
    //经理人后台--》查看班务经理详情
    customerManagerClassManagerDetail: (param) => {
        return get(`${bizURL}/customer/manager/classManager/detail`, param);
    },
    //付款记录
    salarySheetPayRecordDetail: (param) => {
        return Axios.post(`${financeURL}/salary/salarySheet/payRecordDetail`, param);
    },
    //获取服务器时间新
    getCurrentTime: () => {
        //写死8-16   8-13号版本需要改回来
        return get(`${publicURL}/system/currentTime/format`)
    },


    //3.0.4新增接口
    //获取经理人绑定的合作经理人列表
    bindingList: (param) => {
        return Axios.post(`${bizURL}/customer/partner/list/binding`, param);
    },
    //获取经理人解绑的合作经理人列表
    unBindingList: (param) => {
        return Axios.post(`${bizURL}/customer/partner/list/unbinding`, param);
    },
    //获取经理人绑定码
    getBindingCode: (param) => {
        return get(`${bizURL}/customer/partner/getBindingCode`, param);
    },
    //通过绑定码绑定合作经理人
    bindingCustomer: (param) => {
        return Axios.put(`${bizURL}/customer/partner/bindingCustomer?code=${param.code}`);
    },
    //发起解绑操作，status=1才能操作
    openUnbinding: (param) => {
        return Axios.put(`${bizURL}/customer/partner/startUnbinding?customerPartnerId=${param.customerPartnerId}`);
    },
    //取消解绑操作，status=2才能操作
    confirmUnbinding: (param) => {
        return Axios.put(`${bizURL}/customer/partner/cancelUnbinding?customerPartnerId=${param.customerPartnerId}`);
    },
    //同意解绑操作，status=3才能操作
    openAgreeUnbinding: (param) => {
        return Axios.put(`${bizURL}/customer/partner/agreeUnbinding?customerPartnerId=${param.customerPartnerId}`);
    },
    //获取经理人绑定的合作经理人列表
    getPartnerListBinding: (param) => {
        return Axios.post(`${bizURL}/customer/partner/list/binding`, param)
    },
    //经理人后台--》班务经理工作交接
    putManagerWorkHandover: ({managerId, toManagerId}) => {
        return Axios.put(`${bizURL}/customer/manager/workHandover/${managerId}/${toManagerId}`)
    },
    workHandoverRecord: (param) => { //班务经理工作记录
        return Axios.post(`${bizURL}/customer/manager/workHandover/record`,param)
    },
    // //班务经理app--》我服务的经理人列表
    // getMyServerCustomerList:(param)=>{
    //   return  Axios.post(`${bizURL}/customer/manager/myServerCustomerList`,param)
    // },
    bindTalent: (params) => {
        return get(`${bizURL}/newtalent/bindTalent`, params)
    },
    waitReceiveEmp: (params) => {
        return get(`${bizURL}/newtalent/waitReceiveEmp`, params)
    },
    switchEmpStatus: (param) => {
        return Axios.post(`${bizURL}/newtalent/switchEmpStatus`, param)
    },
    copyDetailLite: (param) => {
        return get(`${bizURL}/newtalent/detailLite`, param)
    },
    getClassTaskProfitByManager: (param) => {
        return Axios.post(`${bizURL}/taskProfit/classTaskProfitByManager`, param)
    },
    getProfitDetailByManagerId: (param) => {
        return Axios.post(`${bizURL}/taskProfit/getProfitDetailByManagerId`, param)
    },
    
    getInComeDetailByManager: (param) => {
        return Axios.post(`${bizURL}/taskProfit/getInComeDetailByManager`, param)
    },
    
    getTaskProfitClassTask: () => {
        return get(`${bizURL}/taskProfit/classTask`)
    },
    classTaskProfitDetail: (param) => { //查看利润明细
        return Axios.post(`${bizURL}/taskProfit/classTaskProfitDetail`,param)
    },
    classTaskProfitInComeDetail: (param) => { //查看收入明细
        return Axios.post(`${bizURL}/taskProfit/classTaskProfitInComeDetail`,param)
    },
    classTaskProfit: (param) => { //按时汇总（按天）
        return Axios.post(`${bizURL}/taskProfit/classTaskProfit`,param)
    },
    accountApply: (param) => { //账户申请
        return Axios.post(`${financeURL}/xfd/account/apply`,param)
    },
    getXfdaccount: (param) => { //获取薪福多账户信息
        return get(`${financeURL}/xfd/account/get`,param)
    },
    accountUpdate: (param) => { //账户修改
        return Axios.post(`${financeURL}/xfd/account/update`,param)
    },
    accountCancle: (param) => { //账户取消审核
        return Axios.post(`${financeURL}/xfd/account/cancle`,param)
    },
    xfdPerQuery: (param) => { //薪福多生成订单
        return Axios.post(`${financeURL}/salary/xfdPerQuery`,param)
    },
    xfdWaitingOrder: (param) => { //薪福多查询订单
        return get(`${financeURL}/salary/xfd/waitingOrder`,param)
    },
    htWaitingOrder: (param) => { //薪福多生成订单
        return get(`${financeURL}/salary/ht/waitingOrder`,param)
    },
    xfdPay: (param) => { //薪福多支付
        return Axios.post(`${financeURL}/salary/xfd/xfdPay?orderNo=${param.orderNo}`)
    },
    htPay: (param) => { //薪福多支付
        return Axios.post(`${financeURL}/salary/ht/htPay`,param)
    },
    smsCode: (param) => { //发送短信
        return Axios.post(`${financeURL}/salary/xfd/smsCode?financePhone=${param.financePhone}&orderNo=${param.orderNo}`)
    },
    xfdPayPass: (param) => { //密码校验
        return Axios.post(`${financeURL}/salary/payPass?password=${param.password}`)
    },
    xfdCancal: (param) => { //薪福多取消订单
        return Axios.post(`${financeURL}/salary/xfd/xfdCancal?orderNo=${param.orderNo}`)
    },
    htCancal: (param) => { //薪福多取消订单
        return Axios.post(`${financeURL}/salary/ht/htCancal?orderNo=${param.orderNo}`)
    },
    xfdAccountCancal: (param) => { //薪福多取消订单
        return Axios.post(`${financeURL}/xfd/account/cancle`)
    },
    xfdOrders: (param) => { //取得当前账户的薪福多
        return get(`${financeURL}/xfd/account/orders`,param)
    },
    htOrders: (param) => { //取得当前账户的薪企云服订单
        return get(`${financeURL}/ht/account/orders`,param)
    },
    htOutOrders: (param) => { //取得当前外包账户的薪企云服订单
        return get(`${financeURL}/ht/account/outOrders`,param)
    },
    xfdDays: (param) => { //取得当前账户的幸福多按日汇总
        return get(`${financeURL}/xfd/account/details/days`,param)
    },
    htDays: (param) => { //取得当前账户的薪企云服按日汇总
        return get(`${financeURL}/ht/account/details/days`,param)
    },
    htOutDays: (param) => { //取得当前外包账户的薪企云服按日汇总
        return get(`${financeURL}/ht/account/out/days`,param)
    },
    xfdOrdersDetails: (param) => { //取得当前账户的薪福多明细
        return get(`${financeURL}/xfd/account/details`,param)
    },
    htOrdersDetails: (param) => { //取得当前账户的薪企云服
        return get(`${financeURL}/ht/account/detail`,param)
    },
    htOrdersCharge: (param) => { //取得当前账户的薪企云服
        return get(`${financeURL}/ht/account/charge`,param)
    },
    xfdOrdersDetailsExport: (param) => { //导出明细
        return get(`${financeURL}/xfd/account/details/export`,param)
    },
    htdOrdersDetailsExport: (param) => { //导出明细
        return get(`${financeURL}/ht/account/details/export`,param)
    },
    punchData: (param) => {
        return Axios.post(`${bizURL}/track/punchData`,param)
    },
    receiverList: (param) => {
        return get(`${bizURL}/track/receiver/list`,param)
    },
    trackManagerList: (param) => {
        return get(`${bizURL}/track/manager/list`,param)
    },
    classTaskData: (param) => {
        return Axios.post(`${bizURL}/track/classTaskData`,param)
    },
    punchDataExport: (param) => {
        return Axios.post(`${bizURL}/track/punchData/export`,param)
    },
    assignmentInfoData: (param) => {
        return Axios.post(`${bizURL}/track/assignmentInfoData`,param)
    },
    classTaskFastAdd: (param) => {
        return Axios.post(`${bizURL}/classTask/fastAdd`,param)
    },
    //3.06增加接口
    customerMode: (param) => {
        return get(`${bizURL}/newtalent/customerMode`,param)
    },      
    registerNow: (param) => {
        return Axios.post(`${bizURL}/customer/register`,param)
    }, 
    getUserAgreement: (params) => {
        return get(`${bizURL}/agreement/getByTitle`,params)
    },
    generateOrder: (param) => { //薪福多生成订单
        return Axios.post(`${financeURL}/salary/generateOrder`,param)
    },
    completeRegister: (param) => {
        return Axios.post(`${bizURL}/customer/complete`,param)
    },
    checkMobileMsg: (param) => {
        return get(`${userURL}/user/check/mobile`, param)
    },
    schedulingCheckAction: (param) => {
        return Axios.put(`${bizURL}/schedulingSetting/price/check`, Qs.stringify(param));
    },
    schedulingDetailLite: (param) => {
        return get(`${bizURL}/scheduling/detailLite`, param);
    },
    getOutLists: (param) => {
        return Axios.post(`${bizURL}/customer/list`,param)
    },    
    getOutPromiseLists: (param) => {
        return Axios.post(`${financeURL}/outsourcing/assignmentInfo/income/list`,param)
    },
    getOutPromiseSummary: (param) => {
        return Axios.post(`${financeURL}/outsourcing/assignmentInfo/income/summary`,param)
    },
    getOutPromiseClassLists: (param) => {
        return Axios.post(`${financeURL}/outsourcing/classTask/income/list`,param)
    },
    getOutPromiseClassSummary: (param) => {
        return Axios.post(`${financeURL}/outsourcing/classTask/income/summary`,param)
    },
    processBadDebt: (param) => {
        return Axios.post(`${financeURL}/salary/record/processBadDebt`,param)
    },
    cancelBadDebt: (param) => {
        return Axios.post(`${financeURL}/salary/record/cancelBadDebt`,param)
    },
    //3.0.8 新增接口
    hookList: (param) => { //挂靠列表
        return get(`${bizURL}/hook/list`,param)
    },
    hookApprove: (param) => {//经理人同意挂靠
        return Axios.post(`${bizURL}/hook/approve`,param)
    },
    hookRecord: (param) => {//我挂靠的经理人
        return get(`${bizURL}/hook/record`,param)
    },
    hookCancel: (param) => {//取消挂靠
        return get(`${bizURL}/hook/cancel`,param)
    },
    hookRefuse: (param) => {//拒绝挂靠
        return get(`${bizURL}/hook/refuse`,param)
    },
    hookBind: (param) => {//蓝灵王申请挂靠
        return get(`${bizURL}/hook/bind`,param)
    },
    assignmentReceive: (param) => {//挂靠任务抢单记录
        return Axios.post(`${bizURL}/assignmentReceive/M/grabRecordList/customer`,param)
    },
    hookAgree: (param) => {//挂靠经理人同意操作
        return Axios.post(`${bizURL}/assignmentReceive/M/hookAgree`,param)
    },
    hookReject: (param) => {//挂靠经理人同意操作
        return Axios.put(`${bizURL}/assignmentReceive/M/hookReject?receiveMId=${param.receiveMId}`)
    },
    hookCusGiveUp: (param) => {//挂靠经理人fangqi
        return Axios.put(`${bizURL}/assignmentReceive/M/hookCusGiveUp?receiveMId=${param.receiveMId}`)
    },
    deleteC: (param) => {//挂靠经理人fangqi
        return Axios.delete(`${bizURL}/assignmentReceive/M/deleteC?id=${param.receiveMId}`)
    },
    viewSetting: (param) => {//挂靠经理人fangqi
        return get(`${bizURL}/assignmentReceive/M/viewSetting`,param)
    },

    //我发布的班务列表
    myPublish: (param) => {
        return Axios.post(`${bizURL}/classTaskReceive/myPublish`, param);
    },
    viewPriceSetting: (param) => {
        return get(`${bizURL}/classTaskReceive/viewPriceSetting`, param);
    },
    myTaskListCanGrab: (param) => {
        return get(`${bizURL}/classTaskReceive/myTaskListCanGrab`, param);
    },    
    schedulingSalarylist: (params) => {
        return Axios.post(`${financeURL}/scheduling/salary/list`, params)
    },
    salaryadjustList: (params) => {
        return Axios.post(`${financeURL}/scheduling/salary/adjustList`, params)
    },
    salaryincomeDetail: (params) => {
        return Axios.post(`${financeURL}/scheduling/salary/incomeDetail`, params)
    },    
    salarySchedulingDetail: (params) => {
        return Axios.post(`${financeURL}/scheduling/salary/schedulingDetail`, params)
    },
    salarySchedulingSummary: (params) => {
        return Axios.post(`${financeURL}/scheduling/salary/schedulingSummary`, params)
    },
    salarysetAdjust: (params) => {
        return Axios.post(`${financeURL}/scheduling/salary/setAdjust`, params)
    },
    salarydelAdjust: (param) => {
        return get(`${financeURL}/scheduling/salary/delAdjust`, param);
    },
    // 及时雨支付接口
    timelyRainPerQuery: (param) => { //及时雨订单预览
        return Axios.post(`${financeURL}/salary/common/perQuery`,param)
    },
    timelyRainRenerateOrder: (param) => { //及时雨生成订单
        return Axios.post(`${financeURL}/salary/common/generateOrder`,param)
    },
    timelyRainPay: (param) => { //及时雨支付
        return Axios.post(`${financeURL}/salary/common/linePay`,param)
    },
    timelyRainCallback: (param) => { //及时雨回调
        return Axios.post(`${financeURL}/salary/common/callback`,param)
    },
    timelyRainWaitingOrder: (param) => { //薪福多查询订单
        return get(`${financeURL}/salary/common/waitingOrder`,param)
    },
    timelyRainCancal: (param) => { //及时雨取消订单
        return Axios.post(`${financeURL}/salary/common/cancal?orderNo=${param.orderNo}`)
    },
    assignmentSalaryRecordlistR: (params) => {
        return Axios.post(`${bizURL}/assignmentSalaryRecord/listR`, params)
    },
    assignmentSalaryRecordlistRSummary: (params) => {
        return Axios.post(`${bizURL}/assignmentSalaryRecord/listRSummary`, params)
    },
    assignmentSalaryRecordlistSSummary: (params) => {
        return Axios.post(`${bizURL}/assignmentSalaryRecord/listSSummary`, params)
    },
    assignmentSalaryRecordlistS: (params) => {
        return Axios.post(`${bizURL}/assignmentSalaryRecord/listS`, params)
    },
    assignmentSalaryRecordlistDetail: (params) => {
        return Axios.post(`${bizURL}/assignmentSalaryRecord/listDetail`, params)
    },
    assignmentSalaryRecordsetAdjust: (params) => {
        return Axios.post(`${bizURL}/assignmentSalaryRecord/setAdjust`, params)
    },
    assignmentSalaryRecordconfirmReceive: (params) => {
        return Axios.post(`${bizURL}/assignmentSalaryRecord/confirmReceive`, params)
    },
    assignmentSalaryRecordconfirmPay: (params) => {
        return Axios.post(`${bizURL}/assignmentSalaryRecord/confirmPay`, params)
    },
    assignmentSalaryRecordunConfirmSchedulingList: (params) => {
        return get(`${bizURL}/assignmentSalaryRecord/unConfirmSchedulingList`, params)
    },    
    schedulingSettingUpdate: (params) => {
        return Axios.post(`${bizURL}/schedulingSetting/update`, params)
    },
    classTaskPriceLogList: (params) => {
        return get(`${bizURL}/classTaskPriceLog/list`, params)
    },    
    classTaskEnablePrice: (params) => {
        return get(`${bizURL}/classTaskPriceLog/enablePrice`, params)
    },    
    priceDiffCheck: (params) => {
        return get(`${bizURL}/schedulingSetting/priceDiffCheck`, params)
    },
    timelyRainAccount: (params) => {
        return get(`${financeURL}/salary/common/account`, params)
    },
    timelyRainDetail: (params) => {
        return get(`${financeURL}/salary/common/detail`, params)
    },
    timelyRainOrders: (params) => {
        return get(`${financeURL}/salary/common/orders`, params)
    },
    timelyRainDetailsDays: (params) => {
        return get(`${financeURL}/salary/common/details/days`, params)
    },
    timelyRainDetailsExport: (params) => {
        return get(`${financeURL}/salary/common/details/export`, params)
    },
    classTaskPriceLogSave: (params) => {
        return Axios.post(`${bizURL}/classTaskPriceLog/save`, params)
    },
    //3.0.10新增接口
    unSetAspeCount: (param) => { //获取抢单记录未设置的总数气泡
        return Axios.post(`${bizURL}/assignmentReceive/unSetAspeCount`,param)
    },
    lockToggle: (param) => { //获取抢单记录未设置的总数气泡
        return Axios.post(`${financeURL}/salary/rp/lock/toggle`,param)
    },
    unBinding: (param) => { //获取抢单记录未设置的总数气泡
        return Axios.put(`${bizURL}/customer/manager/unBinding?customerManagerId=${param.customerManagerId}`)
    },

}