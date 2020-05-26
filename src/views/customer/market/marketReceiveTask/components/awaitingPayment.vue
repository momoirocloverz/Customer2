<template>
    <div class="marketReceiveAwaitingCon">        
        <div class="firstLine">
            <div class="leftPart">
                <div>合计：{{sumHours}} 小时，{{sumObj ? JSON.parse(sumObj).jian : 0 }} 件，{{sumObj ? JSON.parse(sumObj).dai : 0}} 袋，{{sumObj ? JSON.parse(sumObj).dun : 0 | tonFormat}} 吨，{{sumObj ? JSON.parse(sumObj).che : 0}} 车 </div>
                <div class="amountCon">合计金额：{{sumAmount | moneyFormat}} 元</div>
            </div>
<!--            <div class="notConfirmed" @click="goToSomeWhere">{{notConfirmLength}}个排班未确认>></div>-->
        </div>
        <div class="tableCon">
            <el-table :data="tableData" style="width: 100%">
                <el-table-column prop="batchNumber" label="批次" show-overflow-tooltip width="150"></el-table-column>
                <el-table-column prop="taskName" label="任务" show-overflow-tooltip min-width="90"></el-table-column>
                <el-table-column prop="customerName" label="发单人" show-overflow-tooltip min-width="90"></el-table-column>
                <el-table-column prop="settlementType" label="结算方式"   :formatter="settlementTypeFormatter">
                </el-table-column>
                <el-table-column prop="cusSettlementHours" label="工时"></el-table-column>
                <el-table-column label="产量" show-overflow-tooltip min-width="150">
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
                        <span>{{ +( scope.row.taskIncome ? scope.row.taskIncome : 0 ) + +(scope.row.adjustExpenditure ? scope.row.adjustExpenditure : 0) | moneyFormat}}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="status" label="状态"  :formatter="statusFormatter"></el-table-column>
                <el-table-column label="操作" min-width="200">
                    <template v-slot="scope">
                        <div>
                            <el-button type="text" class="btn-icon btn-icon-view" size="mini" @click="checkDetail(scope.row)">查看</el-button>
                            <el-button type="text" class="btn-icon btn-icon-view" size="mini" @click="markHere(scope.row)" v-if="setShowBtn(scope.row)">确认已收</el-button>
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
            <span>确认{{rowBridge.taskName}}{{rowBridge.batchNumber}}项目费已收款？</span>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="confirmAction">确认收款</el-button>
            </span>
        </el-dialog>
        
    </div>
</template>
<script>
    export default {
        name: "marketReceiveAwaiting",
        data() {
            return {
                searchTime:Date.now(),
                sumObj:'',
                sumAmount:0,
                sumHours:0,
                tableData:[],
                total:0,
                pageNum:1,                
                pageSize:10,
                dialogVisible:false,
                customerId:'',
                notConfirmLength:0,
                rowBridge:{},
            }
        },
        mounted() {
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
                        status = "";
                        break;
                }
                return status;
            },
            setShowBtn(row){
                if( row.status == 2 ){
                    return true;
                }else{
                    return false;
                }
            },
            analyseLocalData(){
                let userInfo = JSON.parse(localStorage.getItem('userInfo'));
                this.customerId = userInfo.customerId;
            },
            checkDetail(row){
                const {href} = this.$router.resolve({
                    name: "marketReceiveNormalDetail",
                    query:{
                        batchNumber:row.batchNumber,
                        assignmentInfoId:row.assignmentInfoId,
                        customerId:row.customerId,
                        cusPieceSizeTotal:row.cusPieceSizeTotal,
                        cusSettlementHours:row.cusSettlementHours,
                        taskName:row.taskName,
                        taskIncome:row.taskIncome,
                        status:1
                    }
                });
                window.open(href, '_blank')
            },
            uniqueReq(){
                this.pageNum = 1;
                this.getDataLists();
                this.getSummary();
//                this.getNotConfirm();
            },    
            getDataLists(){
                let reqParams = {
                    pageNum:this.pageNum,
                    pageSize:this.pageSize,
                    status:1,
                    customerId:this.customerId,
                };
                this.$api.assignmentSalaryRecordlistR(reqParams).then(res=>{
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
//            getNotConfirm(){
//                let reqParams = {
//                    customerId:this.customerId,
//                    pageNum:1,
//                    pageSize:1,
//                };
//                this.$api.assignmentSalaryRecordunConfirmSchedulingList(reqParams).then(res=>{
//                    let { data,respCode } = res;
//                    if( respCode === 0 ){
//                        if( data&&data.list ){
//                            this.notConfirmLength = data.total;
//                        }else{
//                            this.notConfirmLength = 0;
//                        }
//                    }else{
//                        this.notConfirmLength = 0;
//                    }
//                }).catch(err=>{
//                    this.notConfirmLength = 0;
//                    console.log('err',err);
//                })
//            },
            getSummary(){
                let reqParams = {
                    pageNum:this.pageNum,
                    pageSize:this.pageSize,
                    status:1,
                    customerId:this.customerId,
                };
                this.$api.assignmentSalaryRecordlistRSummary(reqParams).then(res=>{
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
            markHere(row){
                this.dialogVisible = true;
                this.rowBridge = row;
            },
//            goToSomeWhere(){
//                const {href} = this.$router.resolve({
//                   name: "marketReceiveNotConfirmed",
//                });
//                window.open(href, '_blank')                
//            },
            handleCurrentChange(val){
                this.pageNum = val;
                this.getDataLists();
                this.getSummary();
            },
            confirmAction(){
                let data = {
                    batchNumber:this.rowBridge.batchNumber,
                    assignmentInfoId:this.rowBridge.assignmentInfoId,
                    customerId:this.customerId,
                    status:3,
                    searchTime:this.Moment(this.searchTime).format("YYYY-MM-DD HH:mm:ss"),
                };
                this.$api.assignmentSalaryRecordconfirmReceive(data).then(res=>{
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
                    }
                }).catch(err=>{
                    console.log('err',err);
                })                
            },
        },
    }
</script>
<style scoped lang="scss">
    .marketReceiveAwaitingCon {        
        .firstLine {
            font-size: 12px;
            color: #333;
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
        .pagCon {
            padding-top: 20px;
            padding-bottom: 20px;
            background-color: #fff;
            display: flex;
            justify-content: center;
            align-content: center;
            align-items: center;
        }
    }
</style>
<style lang="scss">
    .marketReceiveAwaitingCon {
        .innerDialog {
            .el-dialog {
                position: absolute;
                left: 0;
                right: 0;
                bottom: 0;
                top: 0;
                margin: auto !important;
                height: 190px !important;
            }
            .el-dialog__body {
                height: 80px !important;
            }
        }
        .el-table .cell {
/*            text-align: center;*/
            padding-left: 10px;
        }
    }
</style>