<template>
    <div class="marketReceiveTaskAlreadyCon">
        <div class="firstLine">
            <div>合计：{{sumHours}} 小时，{{sumObj ? JSON.parse(sumObj).jian : 0 }} 件，{{sumObj ? JSON.parse(sumObj).dai : 0}} 袋，{{sumObj ? JSON.parse(sumObj).dun : 0 | tonFormat}} 吨，{{sumObj ? JSON.parse(sumObj).che : 0}} 车</div>
            <div class="amountCon">合计金额：{{sumAmount | moneyFormat}} 元</div>
        </div>
        <div class="tableCon">
            <el-table :data="tableData" style="width: 100%">
                <el-table-column prop="batchNumber" label="批次" show-overflow-tooltip width="150"></el-table-column>
                <el-table-column prop="taskName" label="任务" min-width="90" show-overflow-tooltip></el-table-column>
                <el-table-column prop="customerName" label="发单人" show-overflow-tooltip min-width="90"></el-table-column>
                <el-table-column prop="cusSettlementHours" label="工时"></el-table-column>
                <el-table-column label="产量" min-width="150">
                    <template v-slot="scope">
                        <span>
                            {{scope.row.cusPieceSizeTotal ? JSON.parse(scope.row.cusPieceSizeTotal).jian+ '件,' : 0 +'件,'}}
                            {{scope.row.cusPieceSizeTotal ? JSON.parse(scope.row.cusPieceSizeTotal).dai  + '袋,' : 0 + '袋,'}}
                            {{scope.row.cusPieceSizeTotal ? JSON.parse(scope.row.cusPieceSizeTotal).che+ '车,'  : 0 + '车,'}}
                            {{scope.row.cusPieceSizeTotal ? JSON.parse(scope.row.cusPieceSizeTotal).dun  + '吨' : 0 + '吨'}}
                        </span>
                      </template>
                </el-table-column>
                <el-table-column prop="taskIncome" label="总金额(元)" show-overflow-tooltip min-width="100">
                    <template v-slot="scope">
                        <span>{{ scope.row.taskIncome ? scope.row.taskIncome : 0  | moneyFormat}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="调整" show-overflow-tooltip min-width="100">
                    <template v-slot="scope">
                        <span><span>{{ (scope.row.adjustExpenditure)&&( +scope.row.adjustExpenditure > 0 ) ? '+' :'' }}</span>{{ scope.row.adjustExpenditure ? scope.row.adjustExpenditure : 0  | moneyFormat}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="实付金额" show-overflow-tooltip min-width="100">
                    <template v-slot="scope">
                        <span>{{ +( scope.row.taskIncome ? scope.row.taskIncome : 0 ) + +(scope.row.adjustExpenditure ? scope.row.adjustExpenditure : 0)  | moneyFormat}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="操作" >
                    <template v-slot="scope">
                        <div>
                            <el-button type="text" class="btn-icon btn-icon-view" size="mini" @click="checkDetail(scope.row)">查看</el-button> 
                        </div>
                    </template>
                </el-table-column>
            </el-table>
            <div class="pagCon" v-if="total">
                <el-pagination class="pagebox" layout="total , prev, pager, next, jumper" :total="total" :current-page.sync="pageNum" @current-change="handleCurrentChange" :page-size="pageSize">
                </el-pagination>
            </div>
        </div>
    </div>
</template>
<script>
    export default {
        name: "marketReceiveTaskAlready",
        data() {
            return {
                tableData:[],
                total:0,
                pageNum:1,                
                pageSize:10,
                customerId:'',
                sumObj:'',
                sumAmount:0,
                sumHours:0,
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
                        status:3
                    },
                });
                window.open(href, '_blank')
            },     
            uniqueReq(){
                this.pageNum = 1;
                this.getDataLists();
                this.getSummary();
            },    
            getDataLists(){
                let reqParams = {
                    pageNum:this.pageNum,
                    pageSize:this.pageSize,
                    status:3,
                    customerId:this.customerId,
                };
                this.$api.assignmentSalaryRecordlistR(reqParams).then(res=>{
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
            getSummary(){
                let reqParams = {
                    pageNum:this.pageNum,
                    pageSize:this.pageSize,
                    status:3,
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
            handleCurrentChange(val){
                this.pageNum = val;
                this.getDataLists();
                this.getSummary();
            },
        },
    }
</script>
<style scoped lang="scss">
    .marketReceiveTaskAlreadyCon {
        .firstLine {
            font-size: 12px;
            color: #333;
            background-color: #fff;
            display: flex;
            justify-content: flex-start;
            align-content: center;
            align-items: center;
            padding: 20px;
            box-sizing: border-box;
            .amountCon {
                    margin-left: 20px;
                }
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
    .marketReceiveTaskAlreadyCon {
        .el-table .cell {
/*            text-align: center;*/
            padding-left: 10px;
        }
    }
</style>