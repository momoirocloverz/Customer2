<template>
    <div class="marketPaymentAwaitingCon">
        <div class="searchBg">
                <el-form ref="searchForm" :model="searchForm" label-width="110px" label-position="left" class="formSelf">
                    <div class="search-zone">
                        <el-input class="searchMaster" clearable placeholder="输入任务名称搜索" prefix-icon="el-icon-search"   v-model="searchForm.taskName" ></el-input>
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
        <div class="firstLine">
            <div class="leftPart">
                <div>合计：{{sumHours}} 小时，{{sumObj ? JSON.parse(sumObj).jian : 0 }} 件，{{sumObj ? JSON.parse(sumObj).dai : 0}} 袋，{{sumObj ? JSON.parse(sumObj).dun : 0 | tonFormat }} 吨，{{sumObj ? JSON.parse(sumObj).che : 0}} 车</div>
                <div class="amountCon">合计金额：{{sumAmount | moneyFormat}} 元</div>
            </div>
            <div class="notConfirmed" @click="goToSomeWhere">{{notConfirmLength}}个排班未确认>></div>
        </div>
        <div class="tableCon">
            <el-table :data="tableData" style="width: 100%">
                <el-table-column prop="batchNumber" label="批次" show-overflow-tooltip width="150"></el-table-column>
                <el-table-column prop="taskName" label="任务名称" show-overflow-tooltip min-width="90"></el-table-column>
                <el-table-column prop="customerName" label="接单人" show-overflow-tooltip min-width="90"></el-table-column>
                <el-table-column prop="startTime" label="开始日期" :formatter="timeFormatter"  show-overflow-tooltip min-width="130"></el-table-column>
                <el-table-column prop="endTime" label="结束日期" :formatter="timeFormatter" show-overflow-tooltip min-width="130">
                </el-table-column>
                <el-table-column prop="settlementType" label="结算方式"  :formatter="settlementTypeFormatter"></el-table-column>
                <el-table-column prop="cusSettlementHours" label="总工时"></el-table-column>
                <el-table-column label="总产量" show-overflow-tooltip min-width="150">
                    <template v-slot="scope">
                        <span>
                            {{scope.row.cusPieceSizeTotal ? JSON.parse(scope.row.cusPieceSizeTotal).jian+ '件,' : 0 +'件,'}}
                            {{scope.row.cusPieceSizeTotal ? JSON.parse(scope.row.cusPieceSizeTotal).dai  + '袋,' : 0 + '袋,'}}
                            {{scope.row.cusPieceSizeTotal ? JSON.parse(scope.row.cusPieceSizeTotal).che+ '车,'  : 0 + '车,'}}
                            {{scope.row.cusPieceSizeTotal ? JSON.parse(scope.row.cusPieceSizeTotal).dun  + '吨' : 0   + '吨'}}
                        </span>
                      </template>
                </el-table-column>
                <el-table-column label="总金额(元)" show-overflow-tooltip min-width="100">
                    <template v-slot="scope">
                        <span>{{ scope.row.taskIncome ? scope.row.taskIncome : 0 | moneyFormat}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="调整" show-overflow-tooltip min-width="100">
                    <template v-slot="scope">
                        <span><span>{{ (scope.row.adjustExpenditure)&&( +scope.row.adjustExpenditure > 0 ) ? '+' :'' }}</span>{{ scope.row.adjustExpenditure ? scope.row.adjustExpenditure : 0 | moneyFormat}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="实付金额" show-overflow-tooltip min-width="100">
                    <template v-slot="scope">
                        <span>{{ +( scope.row.taskIncome ? scope.row.taskIncome : 0 ) + +(scope.row.adjustExpenditure ? scope.row.adjustExpenditure : 0)  | moneyFormat}}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="status" label="状态" :formatter="statusFormatter"></el-table-column>
                <el-table-column label="操作" min-width="300">
                    <template v-slot="scope">
                        <div>
                            <el-button type="text" class="btn-icon btn-icon-view" size="mini" @click="checkDetail(scope.row)">查看</el-button>
                            <el-button type="text" class="btn-icon btn-icon-view" size="mini" @click="markHere(scope.row)" v-if="scope.row.status == 1">确认已付</el-button>
                            <el-button type="text" class="btn-icon btn-icon-view" size="mini" @click="adjustProfit(scope.row)" v-if="scope.row.status == 1">调整</el-button>
                        </div>
                    </template>
                </el-table-column>
            </el-table>
            <div class="pagCon" v-if="total">
                <el-pagination class="pagebox" layout="total , prev, pager, next, jumper" :total="total" :current-page.sync="pageNum" @current-change="handleCurrentChange" :page-size="pageSize">
                </el-pagination>
            </div>
        </div>
        <el-dialog title="提示" class="innerDialog" :visible.sync="dialogVisible"  width="540px">
            <span>确认{{rowBridge.taskName}}{{rowBridge.batchNumber}}应付任务已付款吗？</span>
               <div>经理人收到款项并确认后才能结算成功</div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">未付款</el-button>
                <el-button type="primary" @click="confirmAction">已付款</el-button>
            </span>
        </el-dialog>
        <el-dialog title="调整" class="adjustDialog" :visible.sync="adjustVisible"  width="540px"> 
            <div class="adjustDialogInner">
                <el-form ref="singleForm" :model="singleForm" :rules="singleRules">
                    <el-form-item  prop="amount">
                        <span class="adjustTitle">应付调整</span>
                        <el-select v-model="adjustValue" placeholder="请选择">
                            <el-option v-for="(item) in options" :key="item.value" :label="item.label" :value="item.value">
                            </el-option>
                        </el-select>
                        <el-input class="adjustInput" v-model.trim="singleForm.adjustAmount" placeholder="请输入"></el-input>
                        <span>元</span>
                    </el-form-item>
                </el-form>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="cancelAdjust('singleForm')">取消</el-button>
                <el-button type="primary" @click="confirmAdjust('singleForm')">保存</el-button>
            </span>
        </el-dialog>
    </div>
</template>
<script>
    import Interval from '@/common/interval.js'
    export default {
        name: "marketPaymentAwaiting",
        data() {
            var validateAmount = (rule, value, callback) => {
                if (this.singleForm.adjustAmount == '') {
                    callback(new Error('金额不能为空'));
                } else {
                    let numberFormat = Number(this.singleForm.adjustAmount);
                    let isNan = Number.isNaN(numberFormat);
                    let isInteger = Number.parseInt(numberFormat, 10) === numberFormat;
                    if (numberFormat === 0) {
                        this.singleForm.adjustAmount = '';
                    }
                    if (isNan) {
                        callback(new Error("请填写正确的金额"));
                    } else {
                        if (isInteger) {
                            if (numberFormat <= 0) {
                                callback(new Error("请填写正确的金额"));
                            } else {
                                if( this.singleForm.adjustAmount.length>8 ){
                                    callback(new Error("请填写短于8位的金额数"));
                                }else{
                                    callback();
                                }
                            }
                        } else {
                            if (numberFormat <= 0) {
                                callback(new Error("请填写正确的金额"));
                            } else {
                                let floatLength = this.singleForm.adjustAmount.split('.')[1].length;
                                if (floatLength >= 2) {
                                    let process = (Math.round(+numberFormat + 'e' + 2) / Math.pow(10, 2)).toFixed(2);
                                    this.singleForm.adjustAmount = process;
                                    if( this.singleForm.adjustAmount.split('.')[0].length>8 ){
                                        callback(new Error("请填写短于8位的金额数"));
                                    }else{
                                        callback();
                                    }
                                }else {
                                    if( this.singleForm.adjustAmount.split('.')[0].length>8 ){
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
                searchTime:Date.now(),
                sumAmount:0,
                sumHours:0,
                options:[
                    {value:'1',label:'扣减'},
                    {value:'2',label:'增加'},
                ],
                adjustValue:'1',
                singleForm:{
                    adjustAmount:'',                    
                },
                adjustVisible:false,
                dialogVisible:false,
                tableData:[],
                total:0,
                pageNum:1,                
                pageSize:10,
                searchForm:{
                    date:'5',
                    startDate:'',
                    endDate:'',
                    taskName:'',
                },
                isShowComb:false,
                dateValidate:false,
                customerId:'',
                notConfirmLength:0,
                rowBridge:{},
                sumObj:'',
                singleRules:{
                    amount:[
                        { trigger: 'blur', validator:validateAmount },
                    ],
                },
            }
        },
        mounted() {
            this.analyseLocalData();
            this.getDataLists();
            this.getSummary();
            this.getNotConfirm();
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
            tonFormat(value) {
                if ((toString.call(value) === '[object Null]') || (toString.call(value) === '[object Undefined]')) {
                    return 0;
                } else {
                    if( value == 0 ){
                        return 0;
                    }else{
                        let fix = (Math.round(+value + 'e' + 4) / Math.pow(10, 4)).toFixed(4);
                        return fix;
                    }
                }
            },
        },
        methods: {
            statusFormatter(row, column, cellValue){
                if(cellValue){
                    if( cellValue == 1 ){
                        return '待付';
                    }else if( cellValue == 2 ){
                        return '待确认';
                    }
                }else{
                    return '无';
                }
            },
            timeFormatter(row, column, cellValue) {
                let res = '永久';
                if(cellValue){
                    res = this.Moment( cellValue ).format('YYYY-MM-DD HH:mm') ;
                }else{
                    res = '永久';
                }
                return res;
            },
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
            analyseLocalData(){
                let userInfo = JSON.parse(localStorage.getItem('userInfo'));
                this.customerId = userInfo.customerId;
            },
            cancelAdjust(form){
                this.adjustVisible = false; 
                this.singleForm.adjustAmount = '';
                this.adjustValue == '1';
                this.$refs[form].resetFields();
            },
            confirmAdjust(form){
                this.$refs[form].validate((valid) => {
                    if (valid) {         
                        let data = {
                            batchNumber:this.rowBridge.batchNumber,
                            assignmentInfoId:this.rowBridge.assignmentInfoId,
                            customerId:this.customerId,
                        };
                        if( this.adjustValue == '1' ){
                            data.adjustExpenditure = - +( this.singleForm.adjustAmount);
                        }
                        if( this.adjustValue == '2' ){
                            data.adjustExpenditure = this.singleForm.adjustAmount;
                        }
                        this.$api.assignmentSalaryRecordsetAdjust(data).then(res=>{
                            let { data:layer1 } = res;
                            let { data,respCode } = layer1;
                            if( respCode === 0 ){
                                this.$message({
                                  message: '设置成功',
                                  type: 'success'
                                }); 
                                this.singleForm.adjustAmount = '';
                                this.adjustValue == '1';
                                this.adjustVisible = false; 
                                this.getDataLists();
                                this.getSummary();
                                this.getNotConfirm();
                            }else{
                                
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
            confirmAction(){     
                let data = {
                    batchNumber:this.rowBridge.batchNumber,
                    assignmentInfoId:this.rowBridge.assignmentInfoId,
                    customerId:this.customerId,
                    status:2,
                    searchTime:this.Moment(this.searchTime).format("YYYY-MM-DD HH:mm:ss"),
                };
                this.$api.assignmentSalaryRecordconfirmPay(data).then(res=>{
                    let { data:layer1 } = res;
                    let { data,respCode } = layer1;
                    if( respCode === 0 ){
                        this.dialogVisible = false; 
                        this.$message({
                          message: '确认成功',
                          type: 'success'
                        });       
                        this.getDataLists();
                        this.getSummary();
                        this.getNotConfirm();
                    }
                }).catch(err=>{
                    console.log('err',err);
                })  
            },
            requestParamsHandler(){
                let data = {
                    pageNum:this.pageNum,
                    pageSize:this.pageSize,
                    status:1,
                    name:this.searchForm.taskName,
                    customerId:this.customerId,
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
            getSummary(){
                let reqParams = this.requestParamsHandler();
                this.$api.assignmentSalaryRecordlistSSummary(reqParams).then(res=>{
                    let { data:layer1 } = res;
                    let { respCode,data } = layer1;
                    if( respCode == 0 ){
                        if( data&&data.cusPieceSizeTotal ){
                            this.sumObj = data.cusPieceSizeTotal;
                        }
                        if( data&&data.taskIncome ){
                            this.sumAmount = data.taskIncome;
                        }
                        if( data&&data.cusSettlementHours ){
                            this.sumHours = data.cusSettlementHours;
                        }
                    }
                }).catch(err=>{
                    console.log('err',err);
                })
            },
            getNotConfirm(){
                let reqParams = {
                    customerId:this.customerId,
                    pageNum:1,
                    pageSize:1,
                };
                this.$api.assignmentSalaryRecordunConfirmSchedulingList(reqParams).then(res=>{
                    let { data,respCode } = res;
                    if( respCode === 0 ){
                        if( data&&data.list ){
                            this.notConfirmLength = data.total;
                        }else{
                            this.notConfirmLength = 0;
                        }
                    }else{
                        this.notConfirmLength = 0;
                    }
                }).catch(err=>{
                    this.notConfirmLength = 0;
                    console.log('err',err);
                })
            },
            getDataLists(){
                let reqParams = this.requestParamsHandler();
                this.$api.assignmentSalaryRecordlistS(reqParams).then(res=>{
                    let { data:layer1 } = res;
                    let { respCode,data } = layer1;
                    if( respCode == 0 ){
                        if(data && data.list){
                            this.tableData = data.list;
                            this.total = data.total;
                            this.searchTime = Date.now();
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
                this.getSummary();
                this.getNotConfirm();
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
            checkDetail(row){
                const {href} = this.$router.resolve({
                    name: "marketPaymenNormalDetail",
                    query:{
                        batchNumber:row.batchNumber,
                        assignmentInfoId:row.assignmentInfoId,
                        customerId:this.customerId,
                        cusPieceSizeTotal:row.cusPieceSizeTotal,
                        cusSettlementHours:row.cusSettlementHours,
                        taskName:row.taskName,
                        taskIncome:row.taskIncome,
                        status:1
                    },
                });
                window.open(href, '_blank')
            },
            markHere(row){
                this.rowBridge = row;
                this.dialogVisible = true;
            },
            adjustProfit(row){
                this.rowBridge = row;
                this.adjustVisible = true;
                let checkNegative = +(row.adjustExpenditure) < 0;
                if( row.adjustExpenditure ){
                    if(checkNegative){
                        this.adjustValue = '1';
                        this.singleForm.adjustAmount = Math.abs(row.adjustExpenditure);
                    }else{
                        this.adjustValue = '2';
                        this.singleForm.adjustAmount = Math.abs(row.adjustExpenditure);
                    }
                }
            },
            goToSomeWhere(){
                const {href} = this.$router.resolve({
                   name: "marketPaymenNotConfirmed",
                });
                window.open(href, '_blank') 
            },
            btn_true(){
                this.endDateChange('searchForm','endDate');
                if( this.dateValidate ){
                    this.uniqueReq();
                }
            },
            handleCombShow(){
                this.isShowComb = !this.isShowComb;
            },
            handleCurrentChange(val){
                this.pageNum = val;
                this.getDataLists();
                this.getSummary();
                this.getNotConfirm();
            },
            searchNow(){
                this.uniqueReq();
            },
        },
    }
</script>
<style scoped lang="scss">
    .marketPaymentAwaitingCon {
        .adjustDialogInner {
            display: flex;
            justify-content: flex-start;
            align-content: center;
            align-items: center;
            .adjustTitle {
                width: 60px;
                margin-right: 10px;
            }
            .adjustInput {
                width: 190px;
                margin-right: 10px;
                margin-left: 10px;
            }
        }
        .firstLine {
            font-size: 12px;
            color: #333;
            border-top: 1px solid #e4e7ed;
            background-color: #fff;
            display: flex;
            justify-content: space-between;
            align-content: center;
            align-items: center;
            padding: 20px;
            box-sizing: border-box;
            .leftPart {
                display: flex;
                justify-content:flex-start;
                align-content: center;
                align-items: center;
                .amountCon {
                    margin-left: 20px;
                }
            }
        }
        .notConfirmed {
            color: #e9481c;
            cursor: pointer;
        }
        .formSearchMargin {
            margin-bottom: 0;
            margin-top: 0;
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
        .el-table .cell {
/*            text-align: center;*/
            padding-left: 10px;
        }
        .searchMaster  {
            .el-input__inner {
                height: 34px;
            }   
            .el-icon-search {
                line-height: 28px;
            }
        }
        .innerDialog {
            .el-dialog {
                position: absolute;
                left: 0;
                right: 0;
                bottom: 0;
                top: 0;
                margin: auto !important;
                height: 210px !important;
            }
        }
        .adjustDialog {
            .el-dialog {
                position: absolute;
                left: 0;
                right: 0;
                bottom: 0;
                top: 0;
                margin: auto !important;
                height: 240px !important;
            }
            .el-dialog__body {
                height: 130px !important;
            }
        }
    }
</style>