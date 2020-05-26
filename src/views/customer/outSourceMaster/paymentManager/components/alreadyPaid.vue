<template>
    <div class="marketPaymentAlreadyCon">
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
        <div class="tableCon">
            <el-table :data="tableData" style="width: 100%">
                <el-table-column prop="settlementType" label="结算方式" :formatter="settlementTypeFormatter"></el-table-column>
                <el-table-column prop="batchNumber" label="批次" show-overflow-tooltip min-width="130"></el-table-column>
                <el-table-column prop="classTaskName" label="班务" show-overflow-tooltip min-width="100"></el-table-column>
                <el-table-column prop="nameAlias" label="班务经理"></el-table-column>
                <el-table-column label="班务收入(元)" show-overflow-tooltip min-width="100">
                    <template v-slot="scope">
                        <span>{{ scope.row.taskIncome ? scope.row.taskIncome : 0 | moneyFormat}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="利润调整" show-overflow-tooltip min-width="100">
                    <template v-slot="scope">
                        <span><span>{{ (scope.row.adjustExpenditure)&&( +scope.row.adjustExpenditure > 0 ) ? '+' :'' }}</span>{{ scope.row.adjustExpenditure ? scope.row.adjustExpenditure : 0 | moneyFormat}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="实发利润" show-overflow-tooltip min-width="100">
                    <template v-slot="scope">
                        <span>{{ +( scope.row.taskIncome ? scope.row.taskIncome : 0 ) - +( scope.row.talentsExpenditure ? scope.row.talentsExpenditure : 0 )  + +(scope.row.adjustExpenditure ? scope.row.adjustExpenditure : 0) | moneyFormat }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="操作" min-width="200">
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
        <el-dialog title="利润调整" :visible.sync="adjustShow" width="550px" class="base-dialog adjustDialog">
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
                        </div>
                    </template>
                </div>
            </div>
            <span slot="footer" class="dialog-footer">
              <el-button size="middle" @click="adjustShow = false">关闭</el-button>
          </span>
        </el-dialog>
        
    </div>
</template>
<script>
    import Interval from '@/common/interval.js'
    export default {
        name: "marketPaymentAlready",
        data() {
            return {
                tableData:[],
                total:0,
                pageNum:1,                
                pageSize:10,
                searchForm:{
                    taskName:'',
                    date:'5',
                    startDate:'',
                    endDate:'',
                },
                isShowComb:false,
                adjustShow:false,
                profitArray:[],
                dateValidate:false,
                rowObj:{},
            }
        },
        mounted() {
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
            },
            checkDetail(row){
                this.$router.push({
                    name: "outManagerPaymentDetailCon",
                    query:{
                        batchNumber:row.batchNumber,
                        managerId:row.managerId,
                        status:2,
                        taskId:row.classTaskId,
                        classTaskName:row.classTaskName,
                    },
                });
            },
            requestParamsHandler(){
                let data = {
                    pageNum:this.pageNum,
                    pageSize:this.pageSize,
                    status:2,
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
        },
    }
</script>
<style scoped lang="scss">
    .marketPaymentAlreadyCon {  
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
    .marketPaymentAlreadyCon {
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