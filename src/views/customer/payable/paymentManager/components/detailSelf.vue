<template>
    <div class="marketReceiveNormalDetailCon">        
        <div class="firstLine">
            <div>合计：{{sumHours}} 小时，{{sumObj ? JSON.parse(sumObj).jian : 0 }} 件，{{sumObj ? JSON.parse(sumObj).dai : 0}} 袋，{{sumObj ? JSON.parse(sumObj).dun : 0}} 吨，{{sumObj ? JSON.parse(sumObj).che : 0}} 车</div>
            <div class="amountCon">合计金额：{{sumAmount | moneyFormat}} 元</div>
        </div>
        <div class="tableCon">
            <el-table :data="tableData" style="width: 100%">
                <el-table-column prop="schedulingDate" label="排班日期"></el-table-column>
                <el-table-column prop="cusSettlementHours" label="总工时"></el-table-column>
                <el-table-column label="总产量" show-overflow-tooltip>
                    <template v-slot="scope">
                        <span>{{ bridge(scope.row.cusPieceSizeTotal) }}</span>
                      </template>
                </el-table-column>
                <el-table-column prop="price" label="班务单价" show-overflow-tooltip :formatter="priceFormatter"></el-table-column>
                <el-table-column prop="taskIncome" label="金额">
                    <template v-slot="scope">
                        <span>{{ scope.row.taskIncome ? scope.row.taskIncome : 0 | moneyFormat}}</span>
                    </template>
                </el-table-column>
            </el-table>
            <div class="pagCon" v-show="total">
                <el-pagination class="pagebox" layout="total , prev, pager, next, jumper" :total="total" :current-page.sync="pageNum" @current-change="handleCurrentChange" :page-size="pageSize">
                </el-pagination>
            </div>
        </div>
    </div>
</template>
<script>
    export default {
        name: "marketReceiveNormalDetail",
        data() {
            return {
                tableData:[],
                total:0,
                pageNum:1,                
                pageSize:10,
                sumAmount:0,
                sumHours:0,
                sumObj:'',
                customerId:'',
            }
        },
        mounted() {
            this.analyseLocalData();
            this.getLists();
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
            priceFormatter(row, column, cellValue){
                let res = '';
                if (cellValue) {
                    res = this.GlobalPriceFilter.priceFilter(cellValue);
                } else {
                    res = '无';
                }
                return res;
            },
            bridge(val){
                if(val){
                    let res = JSON.parse(val);
                    return `${res.che&&res.che.length ? res.che : 0}车，${res.dai&&res.dai.length ? res.dai : 0}袋，${res.dun&&res.dun.length ? res.dun : 0}吨，${res.jian&&res.jian.length ? res.jian : 0}件`
                }else{
                    return '无';
                } 
            },
            analyseLocalData(){
                let userInfo = JSON.parse(localStorage.getItem('userInfo'));
                this.customerId = userInfo.customerId;
            },
            getLists(){
                let reqParams = {
                    customerId:this.customerId,
                    taskType:1,                
                    batchNumber: this.$route.query.batchNumber,
                    managerId: this.$route.query.managerId,
                    status:this.$route.query.status,
                    taskId:this.$route.query.taskId,
                };
                this.$api.salarySchedulingSummary(reqParams).then(res=>{
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
                this.$api.salarySchedulingDetail(reqParams).then(res=>{
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
            handleCurrentChange(val){
                this.pageNum = val;
                this.getLists();
            },
        },
    }
</script>
<style scoped lang="scss">
    .marketReceiveNormalDetailCon {
        .firstLine {
            font-size: 12px;
            color: #000;
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
    .marketReceiveNormalDetailCon {
        .el-table .cell {
            text-align: center;
            padding-left: 10px;
        }
    }
</style>