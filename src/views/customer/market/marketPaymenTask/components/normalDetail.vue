<template>
    <div class="marketReceiveNormalDetailCon">     
        <div class="nameCon">{{name}}</div> 
        <div class="firstLine">
            <div>合计：{{ $route.query.cusSettlementHours }} 小时， {{ shortVer ? JSON.parse(shortVer).jian : 0}} 件，{{ shortVer ? JSON.parse(shortVer).dai : 0}} 袋，{{ shortVer ? JSON.parse(shortVer).dun : 0}} 吨，{{ shortVer ? JSON.parse(shortVer).che : 0}} 车</div>
            <div class="amountCon">合计金额：{{sumAmount | moneyFormat}} 元</div>
        </div>
        <div class="tableCon">
            <el-table :data="tableData" style="width: 100%">
                <el-table-column prop="classTaskName" label="班务名称"></el-table-column>
                <el-table-column prop="schedulingDate" label="排班日期"></el-table-column>
                <el-table-column prop="cusSettlementHours" label="排班工时"></el-table-column>
                <el-table-column prop="cusPieceSizeTotal" label="排班产量">
                    <template v-slot="scope">
                        <span>{{ bridge(scope.row.cusPieceSizeTotal) }}</span>
                      </template>
                </el-table-column>
                <el-table-column prop="price" label="任务单价" :formatter="priceFormatter" >
                </el-table-column>
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
                name:'',
                shortVer:'',
                sumAmount:0,
            }
        },
        mounted() {
            this.getLists();
            this.analyseQuery();
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
                    return `${res.jian&&res.jian.length ? res.jian : 0}件，${res.dai&&res.dai.length ? res.dai : 0}袋，${res.che&&res.che.length ? res.che : 0}车，${res.dun&&res.dun.length ? res.dun : 0}吨`                
                }else{
                    return '无';
                }                
            },
            analyseQuery(){
                this.name =  `${this.$route.query.taskName}任务明细${this.$route.query.batchNumber}`;
                this.shortVer = this.$route.query.cusPieceSizeTotal;
                this.sumAmount = this.$route.query.taskIncome;
            },
            getLists(){
                let data = {
                    batchNumber: this.$route.query.batchNumber,
                    assignmentInfoId: this.$route.query.assignmentInfoId,
                    customerId: this.$route.query.customerId,
                    status:this.$route.query.status,
                    pageNum:this.pageNum,
                    pageSize:this.pageSize,
                };
                this.$api.assignmentSalaryRecordlistDetail(data).then(res=>{
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
        .nameCon {
            margin-bottom: 20px;
            margin-top: 20px;
            text-align: center;
            font-size: 20px;
            line-height: 2;
            letter-spacing: 1px;
            color: #262626;
            font-weight: bold;
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
/*            text-align: center;*/
            padding-left: 10px;
        }
    }
</style>