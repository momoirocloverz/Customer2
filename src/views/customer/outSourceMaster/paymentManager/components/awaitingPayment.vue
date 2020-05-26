<template>
    <div class="marketPaymentAwaitingCon" v-loading="loading" :element-loading-text="loadingText">
        <div class="searchBg">
                <el-form ref="searchForm" :model="searchForm" label-width="110px" label-position="left" class="formSelf">
                    <div class="search-zone">
                        <el-input class="searchMaster" clearable placeholder="输入班务名称/班务经理名称" prefix-icon="el-icon-search"   v-model="searchForm.taskName" ></el-input>
                        <div  class="charge-btn" @click="searchNow" >搜索</div>
                        <el-button class="comb-btn" size="mini" type="text" @click="handleCombShow">高级筛选<i class="el-icon-right el-icon-d-arrow-right" :class="isShowComb ? 'el-icon-d-arrow-right-down' : 'el-icon-d-arrow-right-right'"></i></el-button>
                    </div>
                    <transition name="router-fade" mode="out-in">
                    <div class="combine-zone" v-if="isShowComb">
                        <el-form-item label="日期范围：" class="formSearchMargin" style="margin-top:15px">
                          <el-radio-group class="radio-search" v-model="searchForm.date" @change="dateChange(searchForm.date)">
                            <el-radio label="">不限</el-radio>
                            <el-radio label="5">本月</el-radio>
                            <el-radio label="1">最近7天</el-radio>
                            <el-radio label="2">最近30天</el-radio>
                            <el-radio label="3">最近90天</el-radio>
                            <el-radio label="4">自定义</el-radio>
                          </el-radio-group>
                        </el-form-item>
                        <el-form-item label="自定义：" class="formSearchMargin" v-if="searchForm.date == '4'">
                          <el-date-picker class="margin_left40" size="mini" v-model="searchForm.startDate" type="date" value-format="yyyy-MM-dd" placeholder="选择开始时间">
                          </el-date-picker>
                          --
                          <el-date-picker class="margin_left10" size="mini" v-model="searchForm.endDate" type="date" value-format="yyyy-MM-dd" placeholder="选择结束时间" @change="endDateChange('searchForm','endDate')">
                          </el-date-picker>
                          <el-button type="primary"  class="datesearchBtn" @click="btn_true">确定</el-button>
                        </el-form-item>
                    </div>
                </transition>
                </el-form>
        </div>
        <!--<div class="f14 pl30 pb15 pt8 pt20" v-if="isXfdOrder">该收入批次有订单待付款，请先处理该订单。 <span @click="toWait()" class="co-orange">[点击查看]</span>-->
        <!--</div>-->
        <!--<div class="secondLine">-->
            <!--<div class="leftPart">-->
                <!--<el-button class="myplain-btn " size="small" :disabled="isDisabled" @click="offLine">线下付款</el-button>-->
                <!--<el-button class="myplain-btn " size="small" :disabled="isDisabled" @click="xfdPay">薪企云服付款</el-button>-->
                <!--<div class="totalInfo">共 {{total}} 条记录,已选中 {{talentIdList.length}} 条</div>-->
            <!--</div>-->
            <!--<div class="rightPart">注意：快捷班务不产生班务经理利润</div>-->
        <!--</div>-->
        <div class="tableCon">

            <!--:row-class-name="getRowClassName"-->
            <el-table :data="tableData" style="width: 100%" @selection-change="handleSelectionChange" :header-cell-class-name="getRowClass">
                <el-table-column type="selection" width="40" :selectable="selectable"></el-table-column>
                <el-table-column prop="batchNumber" label="批次" show-overflow-tooltip min-width="130"></el-table-column>
                <el-table-column prop="settlementType" label="结算方式"  :formatter="settlementTypeFormatter"></el-table-column>
                <el-table-column prop="classTaskName" label="班务"></el-table-column>
                <el-table-column prop="nameAlias" label="班务经理"></el-table-column>
                <el-table-column label="班务收入(元)" show-overflow-tooltip min-width="100">
                    <template v-slot="scope">
                        <span>{{ scope.row.taskIncome ? scope.row.taskIncome : 0 | moneyFormat}}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="talentsExpenditure" label="班务支出" show-overflow-tooltip min-width="100">
                    <template v-slot="scope">
                        <span>{{ scope.row.talentsExpenditure ? scope.row.talentsExpenditure : 0 | moneyFormat}}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="adjustExpenditure" label="利润调整" show-overflow-tooltip min-width="100">
                    <template v-slot="scope">
                        <span><span>{{ (scope.row.adjustExpenditure)&&( +scope.row.adjustExpenditure > 0 ) ? '+' :'' }}</span>{{ scope.row.adjustExpenditure ? scope.row.adjustExpenditure : 0 | moneyFormat}}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="date" label="实发利润" show-overflow-tooltip min-width="100">
                    <template v-slot="scope">
                        <span>{{ +( scope.row.taskIncome ? scope.row.taskIncome : 0 ) - +( scope.row.talentsExpenditure ? scope.row.talentsExpenditure : 0 )  + +(scope.row.adjustExpenditure ? scope.row.adjustExpenditure : 0) | moneyFormat}}</span>
                    </template>
                </el-table-column>           
                <el-table-column prop="date" label="操作" min-width="160">
                    <template v-slot="scope">
                        <div>
                            <el-button type="text" class="btn-icon btn-icon-view" size="mini" @click="checkDetail(scope.row)">明细</el-button>
                            <el-button type="text" class="btn-icon btn-icon-view" size="mini" @click="adjustProfit(scope.row)">利润调整</el-button>
                        </div>
                    </template>
                </el-table-column>
            </el-table>
            <div class="pagCon" v-show="total">
                <el-pagination class="pagebox" layout="total , prev, pager, next, jumper" :total="total" :current-page.sync="pageNum" @current-change="handleCurrentChange" :page-size="pageSize">
                </el-pagination>
            </div>
        </div>
            <el-dialog title="利润调整" :visible.sync="adjustShow" width="550px" class="base-dialog adjustDialog" :before-close="handleCloseAdjust">
            <div class="dialogInner">
                <div class="upperLine">
                    <div class="sameFlex">
                        <div>班务经理：</div>
                        <div>{{rowObj.nameAlias}}</div>
                    </div>
                    <div class="sameFlex">
                        <div>批次：</div>
                        <div>{{rowObj.batchNumber}}</div>
                    </div>
                </div>
                <div class="scrollCon">
                    <template v-for="(item,index) in profitArray">
                        <div class="itemFlex">
                            <div class="setMarginRight">{{item.adjust}}</div>
                            <div class="setMarginRight typeMarkItem">{{item.adjustExpenditure > 0 ? '增加' :'扣减' }}</div>
                            <div class="setMarginRight">{{Math.abs(item.adjustExpenditure ? item.adjustExpenditure : 0)}}</div>
                            <div class="setMarginRight">元</div>
                            <div class="deleThis" @click="delethis(item)">删除</div>
                        </div>
                    </template>
                    <div class="dynamicCon" v-if="showFlag">
                        <el-form :model="oneForm" ref="oneForm" :rules="oneFormRules" label-width="100px" class="demo-dynamic">
                            <el-form-item label="调整项" prop="name">
                                <el-input v-model="oneForm.name" maxlength="10"></el-input>
                            </el-form-item>
                            <el-form-item label="调整方式" prop="type">
                                <el-select v-model="oneForm.type" placeholder="请选择">
                                  <el-option label="增加" value="1"></el-option>
                                  <el-option label="扣减" value="2"></el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item label="调整金额" prop="amount">
                                <el-input v-model="oneForm.amount"></el-input>
                            </el-form-item>
                        </el-form>
                        <div>
                            <el-button type="primary" @click="saveAdjust('oneForm')">保存</el-button>
                            <el-button type="primary" @click="shutAdjust('oneForm')">关闭</el-button>
                        </div>
                    </div>
                    <div v-else class="newAdjust" @click="newAdjustAction">+新增调整项</div>
                </div>
            </div>
            <span slot="footer" class="dialog-footer">
              <el-button size="middle" @click="adjustCancel">取 消</el-button>
              <el-button size="small"  @click="adjustConfirms">确 认</el-button>
          </span>
        </el-dialog>
        <!-- 重置弹窗 -->
        <el-dialog
                title="设置支付密码"
                :visible.sync="dialogVisibleResct"
                width="640px"
                height="386px"
                class="el-dialog-2"
        >
            <el-form
                    :model="formPayMentResct"
                    ref="formPayMentResct"
                    label-width="120px"
                    labelPosition="right"
                    :rules="rules"
            >
                <el-form-item
                        label="验证手机号："
                        class="formSearchMargin formSearchMarginTop"
                        style="margin-bottom:20px !important"
                >
                    <span>{{userMobile}}</span>
                    <el-button
                            type="primary"
                            size="small"
                            class="newBtnStyle"
                            @click="getCode"
                            :disabled="isMobile"
                    >{{codeTxt}}
                    </el-button>
                </el-form-item>
                <el-form-item
                        label="短信验证码："
                        prop="verificationCode"
                        class="formSearchMargin formSearchMarginTop"
                        style="margin-bottom:20px !important"
                >
                    <el-input
                            style="width:330px"
                            v-model="formPayMentResct.verificationCode"
                            placeholder="请输入验证码"
                    ></el-input>
                </el-form-item>
                <el-form-item
                        label="支付密码："
                        prop="passwd"
                        clearable
                        class="formSearchMargin formSearchMarginTop"
                        style="margin-bottom:20px !important"
                >
                    <el-input
                            style="width:330px"
                            type="password"
                            clearable
                            v-model="formPayMentResct.passwd"
                            placeholder="请输入6位数字密码"
                    ></el-input>
                </el-form-item>
                <el-form-item
                        label="重复支付密码："
                        prop="confimPasswd"
                        class="formSearchMargin formSearchMarginTop"
                        style="margin-bottom:20px !important"
                >
                    <el-input
                            style="width:330px"
                            type="password"
                            clearable
                            v-model="formPayMentResct.confimPasswd"
                            placeholder="请输入6位数字密码"
                    ></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
            <el-button @click="dialogVisibleResct=false">取 消</el-button>
            <el-button type="primary" @click="setPassword">保 存</el-button>
      </span>
        </el-dialog>
    </div>
</template>
<script>
    import Interval from '@/common/interval.js'
    import {mapState, mapGetters, mapActions, mapMutations} from 'vuex'
    export default {
        name: "marketPaymentAwaiting",
        data() {
            var validatePass = (rule, value, callback) => {
                if (value === "") {
                    callback(new Error("请输入密码"));
                } else {
                    if (this.formPayMentResct.confimPasswd !== "") {
                        this.$refs.formPayMentResct.validateField("confimPasswd");
                    }
                    callback();
                }
            };
            var validatePass2 = (rule, value, callback) => {
                if (value === "") {
                    callback(new Error("请再次输入密码"));
                } else if (value !== this.formPayMentResct.passwd) {
                    callback(new Error("两次输入密码不一致!"));
                } else {
                    callback();
                }
            };
            var validateAmount = (rule, value, callback) => {
                if (this.oneForm.amount == '') {
                    callback(new Error('金额不能为空'));
                } else {
                    let numberFormat = Number(this.oneForm.amount);
                    let isNan = Number.isNaN(numberFormat);
                    let isInteger = Number.parseInt(numberFormat, 10) === numberFormat;
                    if (numberFormat === 0) {
                        this.oneForm.amount = '';
                    }
                    if (isNan) {
                        callback(new Error("请填写正确的金额"));
                    } else {
                        if (isInteger) {
                            if (numberFormat <= 0) {
                                callback(new Error("请填写正确的金额"));
                            } else {
                                if( this.oneForm.amount.length>8 ){
                                    callback(new Error("请填写短于8位的金额数"));
                                }else{
                                    callback();
                                }
                            }
                        } else {
                            if (numberFormat <= 0) {
                                callback(new Error("请填写正确的金额"));
                            } else {
                                let floatLength = this.oneForm.amount.split('.')[1].length;
                                if (floatLength >= 2) {
//                                    let process = (Math.round(+numberFormat + 'e' + 2) / Math.pow(10, 2)).toFixed(2);
                                    let process = `${String(numberFormat).split('.')[0]}.${String(numberFormat).split('.')[1].slice(0,2)}`;   
                                    this.oneForm.amount = process;
                                    if( this.oneForm.amount.split('.')[0].length>8 ){
                                        callback(new Error("请填写短于8位的金额数"));
                                    }else{
                                        callback();
                                    }
                                }else {
                                    if( this.oneForm.amount.split('.')[0].length>8 ){
                                        callback(new Error("请填写短于8位的金额数"));
                                    }else{
                                        callback();
                                    }
                                }  
                            }
                        }
                    }
                }
              };
            return {
                profitArray:[],
                tableData:[],
                total:0,
                pageNum:0,                
                pageSize:10,
                searchForm:{
                    taskName:'',
                    date:'5',
                    startDate:'',
                    endDate:'',
                },
                isShowComb:false,
                isDisabled:true,
                adjustShow:false,
                oneForm:{
                    name:'',
                    type:'2',
                    amount:'',
                },
                userMobile: '',
                rules: {
                    passwd: [
                        {validator: validatePass, trigger: "blur"},
                        {required: true, message: "支付密码不能为空", trigger: "blur"},
                        {min: 6, max: 6, message: "支付密码为6位数字", trigger: "blur"},
                        {
                            pattern: /^[0-9]*$/,
                            message: "请填写正确的6位数字密码"
                        }
                    ],
                    confimPasswd: [
                        {validator: validatePass2, trigger: "blur"},
                        {required: true, message: "支付密码不能为空", trigger: "blur"},
                        {min: 6, max: 6, message: "支付密码为6位数字", trigger: "blur"},
                        {
                            pattern: /^[0-9]*$/,
                            message: "请填写正确的6位数字密码"
                        }
                    ],
                    verificationCode: [
                        {required: true, message: "验证码不能为空", trigger: "blur"},
                        {
                            pattern: /^[0-9]*$/,
                            message: "请填写正确的验证码"
                        }
                    ]
                },
                oneFormRules:{
                    name:[
                        { required: true, message: '请输入名称', trigger: 'blur' },
                    ],
                    type:[
                        { required: true, message: '请选择类型', trigger: 'blur' },
                    ],
                    amount:[
                        { required: true, message: '请输入金额', trigger: 'blur' },
                        { trigger: 'blur', validator:validateAmount },,
                    ],
                },
                dateValidate:false,
                multipleSelection:[],
                showFlag:false,
                rowObj:{},
                codeTxt: "发送验证码",
                codeTime: 60,
                isMobile: false,
                formPayMentResct: {
                    verificationCode: "",
                    passwd: "",
                    confimPasswd: ""
                },
                //3.04
                dialogVisibleResct:false,
                loading: false,
                loadingText: '正在计算中...',
                noSelectList: [],
                payTime:'',
                talentIdList:[],
                salaryIdList:[],
                hasPassword:false,
                isXfdOrder:false,
                offlineShow:false,
                xfdTrue: false, //是否开通了薪福多
            }
        },
        mounted() {
            this.userMobile = JSON.parse(localStorage.userInfo).mobile || "";
            // this.queryWaitOrder();
            this.accountDetail()
            this.paytime()
            this.analyseLocalData();
            this.uniqueReq();
        },
        filters: {
            moneyFormat(value) {
                if ((toString.call(value) === '[object Null]') || (toString.call(value) === '[object Undefined]')) {
                    return 0;
                } else {
                    let fix = (Math.round(+value + 'e' + 2) / Math.pow(10, 2)).toFixed(2);
                    return fix;
                }
            },
        },
        methods: {
            ...mapMutations(['XFD_MANAGER_PARAMS']),
            settlementTypeFormatter(row, column, cellValue) {
                let status = "";
                switch (Number.parseInt(cellValue)) {
                    case 1:
                        status = "日结";
                        break;
                    case 2:
                        status = "月结";
                        break;
                    case 4:
                        status = "周结";
                        break;
                    default:
                        status = "无";
                        break;
                }
                return status;
            },
            delethis(item){
                let data = {
                    id:item.id
                };
                this.$api.salarydelAdjust(data).then(res=>{
                    let { respCode } = res;
                    if( respCode == 0 ){
                        this.$message({
                            message: '删除成功',
                            type: 'success'
                        });
                        this.getLists(this.rowObj);
                    }
                }).catch(err=>{
                    console.log('err',err);
                })
            },
            newAdjustAction(){
                this.showFlag = true;
            },
            adjustConfirms(){
                this.adjustShow = false;
                this.profitArray = [];
                this.getDataLists();
            },
            adjustCancel(){
                this.adjustShow = false;
                this.profitArray = [];
                this.getDataLists();
            },
            handleCloseAdjust(){
               this.adjustCancel();
            },
            saveAdjust(form){
                 this.$refs[form].validate((valid) => {
                    if (valid) {
                        let data = {
                            taskType:4,
                            adjust:this.oneForm.name,
                            classTaskId:this.rowObj.classTaskId,
                            customerId:this.customerId,
                            batchNumber: this.rowObj.batchNumber,
                            managerId:this.rowObj.managerId,
                        };
                        if( this.oneForm.type == '1' ){
                            data.adjustExpenditure = this.oneForm.amount;
                        }else{
                            data.adjustExpenditure = - +(this.oneForm.amount);
                        }
                        this.$api.salarysetAdjust(data).then(res=>{
                            let { data:layer1 } = res;
                            let { respCode,data } = layer1;
                            if( respCode == 0 ){
                                this.showFlag = false;
                                this.$message({
                                    message: '添加成功',
                                    type: 'success'
                                });
                                this.getLists(this.rowObj);
                                this[form] = {
                                    name:'',
                                    type:'1',
                                    amount:'',
                                };
                            }
                        }).catch(err=>{
                            console.log('err',err);
                        })
                    } else {
                        console.log('error submit!!');
                        return false;
                    }
                });
            },
            shutAdjust(form){
                this.showFlag = false;
                this.$refs[form].resetFields();
                this[form] = {
                    name:'',
                    type:'1',
                    amount:'',
                };
            },
            taskConfirms(){
                this.$api.getCurrentTime().then(res => {
                    if (res.respCode == 0) {
                        this.payTime = res.data
                    }
                })
                this.offlineShow = false;
                let params = {
                    payTotalMoney: this.payAmount,
                    batchNumber: this.fromParams.batchNumber,
                    payType: 2,
                    talentIdList: this.talentIdList,
                    salaryIdList: this.salaryIdList,
                    settlementType: this.fromParams.settlementType,
                    payTime: this.payTime
                };
                this.$api.payUnderLine(params).then(res => {
                    if (res.data.respCode == 0) {
                        this.$message.success("支付成功！");
                           this.getDataLists();
                           this.accountDetail()
                           this.dialogVisibleResct = false;
                    } else {
                        this.$message.success("支付失败！");
                    }
                }).catch(err=>{
                    this.$message.error(err);
                })
            },
            offLine(){
                this.offlineShow = true;
            },
            getRowClass({row, column, rowIndex, columnIndex}) {
                if (rowIndex === 0 && !this.noSelectList.includes(1)) {//如果全部都是待奖惩和全部都没有银行卡就不能全选
                    return 'add-no-select'
                }else {
                    return ''
                }
            },
            getRowClassName({row, column, rowIndex, columnIndex}) {
                if (Number(row.greyStatus) === 0) {
                    return 'cg-disable-select'
                } else {
                    return ' '
                }
            },
            selectable(row, index) {
                if (Number(row.greyStatus) === 0){
                    return false;
                } else {
                    return true;//不可选中
                }
            },
            handleSelectionChange(val) {
                this.payAmount = 0;
                this.talentIdList = [];
                this.salaryIdList = [];
                console.log(val)
                if (val.length > 0) {
                    if(val.length >= 1000){val.length = 1000}
                    for (let temp of val) {
                        this.payAmount += temp.totalAmount;
                        this.talentIdList.push(temp.talentId)
                        this.salaryIdList.push(temp.id)
                    }
                    this.isDisabled = false;
                } else {
                    this.isDisabled = true;
                }
            },
            accountDetail() {
                let _this = this;
                this.$api.accountDetail({}).then(res => {
                    console.log(res);
                    _this.hasPassword = res.data.data.hasPassword;
                }).catch(err => {
                    console.log(err);
                })
            },
            checkDetail(row){
                this.$router.push({
                    name: "outManagerPaymentDetailCon",
                    query:{
                        batchNumber:row.batchNumber,
                        managerId:row.managerId,
                        status:1,
                        taskId:row.classTaskId,
                        classTaskName:row.classTaskName,
                    },
                });
            },
            analyseLocalData(){
                let userInfo = JSON.parse(localStorage.getItem('userInfo'));
                this.customerId = userInfo.customerId;
            },
            requestParamsHandler(){
                let data = {
                    pageNum:this.pageNum,
                    pageSize:this.pageSize,
                    status:1,
                    name:this.searchForm.taskName,
                    customerId:this.customerId,
                    taskType:4,
                };
                let flag = this.searchForm.date;
                    switch( flag ){
                        case '':
                            this.searchForm.endDate = '';
                            this.searchForm.startDate = '';
                        break; 
                        case '1':
                            this.searchForm.endDate = Interval.getDay(0);
                            this.searchForm.startDate = Interval.getDay(-7);
                        break;
                        case '2':
                            this.searchForm.endDate = Interval.getDay(0);
                            this.searchForm.startDate = Interval.getDay(-30);
                        break;
                        case '3':
                            this.searchForm.endDate = Interval.getDay(0);
                            this.searchForm.startDate = Interval.getDay(-90);
                        break;    
                        case '4':                
                        break;
                        case '5':
                            this.searchForm.endDate = Interval.getDay(0)
                            this.searchForm.startDate = `${this.Moment(Date.now()).format('YYYY-MM')}-01`;
                        break;    
                    }     
                data.startDate = this.searchForm.startDate;
                data.endDate = this.searchForm.endDate;
                return data;
            },
            paytime() {
                let _this = this;
                this.$api.getCurrentTime().then(res => {
                    if (res.respCode == 0) {
                        _this.payTime = res.data  // 时间戳
                    }
                })
            },
            backUp(){
                this.$api.salaryadjustList(reqParams).then(res=>{
                    console.log('res',res);
                }).catch(err=>{
                    console.log('err',err);
                })
            },
            xfdPay() {
                let _this = this;
                if (!this.hasPassword) {//未设置支付密码时
                    this.$confirm('请先设置支付密码！', '', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                    }).then(() => {
                        this.dialogVisibleResct = true
                    }).catch(() => {

                    });
                } else {
                    if (_this.request) {
                        return
                    }
                    _this.request = true;
                    _this.$api.getCurrentTime().then(res => {
                        if (res.respCode == 0) {
                            _this.payTime = res.data  // 时间戳
                            _this.xfdPayDetail();
                        }
                    })
                }
            },
            queryWaitOrder() {
                this.$api.htWaitingOrder({}).then(res => {
                    if (res.respCode == 0) {
                        let {accountStatus, oldOrder, xfdPreQueryDetailVOS, xfdMoney, xfdPreQueryVO, financePhone} = res.data;
                        if (oldOrder == 1) { // 是否有订单（1是  其他否
                            this.isXfdOrder = true;
                        }
                    }
                }).catch(err => {
                    console.log(err)
                }).finally(() => {

                })
            },
            toWait() {
                this.$router.push({
                    path: 'htOrder',
                    query: {isWait: true}
                });
            },
            xfdPayDetail() {
                let _this = this;
                _this.loading = true
                _this.loadingText = '正在计算中...'
                let params = {
                    talentIdList: this.talentIdList,
                    payType: 2,
                    ifTalentPay: 0,//默认0 有普工承担手续费 1 经理人承担
                    payLineWay: 1,//支付方式0薪福多1薪企云服
                    outsourcingCusId: this.$route.query.outsourcingCusId,
                    batchNumber: this.fromParams.batchNumber,
                    settlementType: this.fromParams.settlementType,
                    payTime: this.payTime,
                }
                this.$api.xfdPerQuery(params).then(res => {
                    if (res.data.respCode == 0) {
                        let {accountStatus, oldOrder, allPayFee, htPreGenerateVOS, allShouldPay, payFee, serviceFee, talentPay, htMoney} = res.data.data;
                        _this.loading = false
                        if (oldOrder == 1) { // 是否有订单（1是  其他否
                            _this.$confirm(`您有订单已生成待付款, 请先处理该订单。`, `提示`, {
                                confirmButtonText: '查看付款订单',
                                cancelButtonText: '暂不处理',
                            }).then((action) => {
                                _this.toWait()
                            }).catch(() => {

                            });
                        } else {
                            _this.XFD_MANAGER_PARAMS(params)
                            _this.$router.push({
                                path: 'htBudget',
                                query: {
                                    htMoney,
                                    allShouldPay,
                                    payFee,
                                    serviceFee,
                                    talentPay,
                                    allPayFee,
                                    htPreGenerateVOS: JSON.stringify(htPreGenerateVOS),
                                }
                            });
                        }
                    }
                }).catch(err => {

                }).finally(() => {
                    setTimeout(() => {
                        _this.loading = false
                        _this.request = false;
                    }, 500)
                })
            },
            getDataLists(){
                let reqParams = this.requestParamsHandler();
                this.$api.schedulingSalarylist(reqParams).then(res=>{
                    let { data:layer1 } = res;
                    let { respCode,data } = layer1;
                    if( respCode == 0 ){
                        if(data && data.list){
                            this.tableData = data.list;
                            this.total = data.total;
                        }else{
                            this.tableData = [];
                            this.total = 0;
                        }
                    }else{
                        this.tableData = [];
                        this.total = 0;
                    }
                }).catch(err=>{
                    console.log('err',err);
                })
            },
            dateChange(val){
                if( val == '4' ){
                    this.searchForm.endDate = '';
                    this.searchForm.startDate = '';
                }else{
                    this.uniqueReq();
                }
            },
            uniqueReq(){
                this.pageNum = 1;
                this.getDataLists();
            },
            endDateChange(form,item){
              let start = this[form].startDate;
              let end = this[form][item];
              if( start&&end ){
                  let startStamp = this.Moment( start ).unix();
                  let endStamp = this.Moment( end ).unix();
                  if( endStamp>=startStamp ){
                      this.dateValidate = true;
                  }else{
                      this.dateValidate = false;
                      return this.$message.error('结束日期不能早于开始日期!');
                  }
              }else{
                  if( !start ){
                      this.dateValidate = false;
                      return this.$message.error('开始日期不能为空！');
                  }
                  if( !end ){
                      this.dateValidate = false;
                      return this.$message.error('结束日期不能为空！');
                  }
                  if( (!end)&&(!start)   ){
                      this.dateValidate = false;
                      return this.$message.error('开始日期和结束日期不能为空！');
                  }
              }
          },
            btn_true(){
                this.endDateChange('searchForm','endDate');
                if( this.dateValidate ){
                    this.uniqueReq();
                }
            },
            getLists(row){
                let data = {
                    taskType:4,
                    batchNumber:row.batchNumber,
                    customerId:this.customerId,
                    classTaskId:row.classTaskId,
                };
                this.$api.salaryadjustList(data).then(res=>{
                    let { data:layer1 } = res;
                    let { respCode,data } = layer1;
                    if( respCode == 0 ){
                        if(data){
                            this.profitArray = data;
                        }else{
                            this.profitArray = [];
                        }
                    }else{
                        this.profitArray = [];
                    }
                }).catch(err=>{
                    console.log('err',err);
                })
            },
            adjustProfit(row){
                this.adjustShow = true;
                this.getLists(row);
                this.rowObj = row;
                this.showFlag = false;
                this.oneForm = {
                    name:'',
                    type:'2',
                    amount:'',
                };
                if( this.$refs.oneForm ){
                    this.$refs.oneForm.resetFields();
                }
            },
            handleCombShow(){
                this.isShowComb = !this.isShowComb;
            },
            handleCurrentChange(val){
                this.pageNum = val;
                this.getDataLists();
            },
            searchNow(){
                this.uniqueReq();
            },
            getTime() {
                this.codeTime = this.codeTime - 1;
                this.codeTxt = this.codeTime + "秒后重新发送";
                if (this.codeTime == 0) {
                    this.codeTxt = "重新发送";
                    this.codeTime = 60;
                    this.isMobile = false;
                    return;
                } else {
                    this.isMobile = true;
                }
                setTimeout(this.getTime, 1000);
            },
            getCode() {
                let params = {
                    mobile: this.userMobile
                };
                this.$api
                    .getMobileCode(params)
                    .then(res => {
                        // console.log(res)
                        if (res.data.respCode == 0) {
                            this.getTime();
                            return this.$message.success(
                                "短信发送成功，请注意查收验证码信息！"
                            );
                        } else {
                            return this.$message.success("短信发送失败！");
                        }
                    })
                    .catch();
            },
            //设置支付密码
            setPassword() {
                let pattern = /^[0-9]*$/;
                if (this.formPayMentResct.verificationCode == "") {
                    return this.$message.error("验证码不能为空！");
                } else if (this.formPayMentResct.passwd == "") {
                    return this.$message.error("密码不能为空！");
                } else if (this.formPayMentResct.confimPasswd == "") {
                    return this.$message.error("重复密码不能为空！");
                } else if (
                    !pattern.test(this.formPayMentResct.passwd) ||
                    !pattern.test(this.formPayMentResct.confimPasswd)
                ) {
                    return this.$message.error("支付密码为6位数字！");
                }
                let params = {
                    verificationCode: this.formPayMentResct.verificationCode,
                    passwd: this.formPayMentResct.passwd,
                    confimPasswd: this.formPayMentResct.confimPasswd
                };
                this.$api
                    .setPasswd(params)
                    .then(res => {
                        // console.log(res)
                        if (res.data.respCode == 0) {
                            this.$message.success("密码设置成功！");
                            this.dialogVisibleResct = false;
                            this.accountDetail()
                        }
                    }).catch(err => {
                    //this.$message.error(err);
                });
            },
        },
    }
</script>
<style scoped lang="scss">
    .marketPaymentAwaitingCon {
        .newAdjust {
            margin-top: 20px;
            margin-bottom: 20px;
            cursor: pointer;
            color: #e84518;
            text-align: left;
        }
        .dynamicCon {
            width: 70%;
            margin: 0 auto;
            padding: 10px;
            box-sizing: border-box;
            background-color: #f2f2f0;
        }
        .scrollCon {
            overflow-y: scroll;
            height: 300px;
            padding-top: 10px;
            padding-bottom: 40px;
            .setMarginRight {
                margin-right: 10px;
            }
            .itemFlex {
                display: flex;
                justify-content: flex-start;
                align-content: center;
                align-items: center;
                margin-bottom: 10px;
                .deleThis {
                    margin-left: 30px;
                    cursor: pointer;
                    color: #e9481c; 
                }
                .typeMarkItem {
                    color: #3582fb; 
                }
            }
        }
        .sameFlex {
            display: flex;
            justify-content: flex-start;
            align-content: center;
            align-items: center;
        }
        .secondLine {
            padding-left: 20px;
            background-color: #fff;
            padding-top: 20px;
            padding-bottom: 20px;
            border-top: 1px solid  #e4e7ed;
            border-bottom: 1px solid  #e4e7ed;
            box-sizing: border-box;
            display: flex;
            justify-content:space-between;
            align-content: center;
            align-items: center;
            .leftPart {
                display: flex;
                justify-content:flex-start;
                align-content: center;
                align-items: center;
            }
            .rightPart {
                color: #e9481c;     
                font-size: 12px;
                margin-right: 20px;
            }
            .totalInfo {
                color: #000;     
                font-size: 12px;
                margin-left: 20px;
            }
        } 
        .formSearchMargin {
            margin-bottom: 0;
            margin-top: 0;
        }
        .dialogInner {
            height: 300px;
            .upperLine {
                padding-bottom: 10px;
                border-bottom: 1px solid  #e4e7ed;
            }
        }
        .datesearchBtn {
            margin-left: 15px;
            font-size: 12px;
            background-color: #ffefea !important;
            border: 1px solid #f7beb2;
            border-radius: 4px;
            text-align: center;
            height: 32px;
            box-sizing: border-box;            
            color: #e9481c;            
            cursor: pointer;
            &:active {
                color: #d13e16;
                border-color: #d13e16;
            }
            &:hover {
                color: #d13e16;
                border-color: #d13e16;
            }
            &:focus {
                color: #d13e16;
            }
        }
        .searchMaster {   
            font-size: 12px;
            width: 520px;  
            margin-right: 20px;
        }
        .combine-zone {
            border-top: 1px solid #e4e7ed;
            margin-top: 20px;
        }
        .searchBg {
            background-color: #fff;   
            padding-bottom: 20px;
        }
        .formSelf {
            padding-left: 20px;
            box-sizing: border-box;
        }
        .search-zone {
            display:flex;
            align-items:center;
            justify-content:flex-start;
            flex-wrap: wrap;
            align-content: center;
            align-items: center;
            padding-top: 20px;
        }
        .pagCon {
            padding-top: 20px;
            padding-bottom: 20px;
            background-color: #fff;
            display: flex;
            justify-content: center;
            align-content: center;
            align-items: center;
        }
        .charge-btn {
            font-size: 12px;
            background-color: #ffefea !important;
            border: 1px solid #f7beb2;
            border-radius: 4px;
            text-align: center;
            line-height: 34px;
            width: 100px;
            height: 34px;
            box-sizing: border-box;            
            color: #e9481c;            
            cursor: pointer;
        }
    }
</style>
<style lang="scss">
    .marketPaymentAwaitingCon {
        .add-no-select {
            cursor: not-allowed;
            pointer-events: none;

            .cell .el-checkbox .el-checkbox__inner {
                background-color: #edf2fc;
            }
        }
        .cg-disable-select {
            color: #C8CACC;
        }
        .el-table .cell {
            text-align: center;
            padding-left: 10px;
        }
        .searchMaster  {
            .el-input__inner {
                height: 34px !important;
            }   
            .el-icon-search {
                line-height: 28px !important;
            }
        }
        .el-button--small {
            font-size: 12px;
            background-color: #ffefea;
            border: 1px solid #f7beb2;
            color: #e9481c;
        }
        .el-button.is-disabled {
            color: #C0C4CC;
            cursor: not-allowed;
            background-color: #FFFFFF;
            border-color: #EBEEF5;
        }
        .adjustDialog {
            .el-dialog {
                height: 500px !important;
            }
            .el-dialog__body {
                height: 390px !important;
            }
        }
    }
</style>