<template>
    <div class="marketReceiveNotConfirmCon">        
        <!--<div class="firstLine">-->
            <!--<div>这些排班未客户结算确认，对应任务待付批次暂不可付</div>-->
        <!--</div>-->
        <div class="tableCon">
            <el-table :data="tableData" style="width: 100%"  :span-method="objectSpanMethod" border>
                <el-table-column prop="title" label="费用类型"></el-table-column>
                <el-table-column label="排班日期">
                    <template v-slot="scope">
                        <span>{{ scope.row.schedulingDate ? scope.row.schedulingDate : '——' }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="金额">
                    <template v-slot="scope">
                        <span>{{ scope.row.amount ? scope.row.amount : 0 | moneyFormat}}</span>
                    </template>
                </el-table-column>               
            </el-table>
        </div>
    </div>
</template>
<script>
    export default {
        name: "marketReceiveNotConfirm",
        data() {
            return {
                tableData:[],
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
            analyseLocalData(){
                let userInfo = JSON.parse(localStorage.getItem('userInfo'));
                this.customerId = userInfo.customerId;
            },
            objectSpanMethod({ row, column, rowIndex, columnIndex }) {
                if (columnIndex === 0) {
                    if (rowIndex % 1 === 0) {
                        return {
                            rowspan: 1,
                            colspan: 1
                        };
                    } else {
                        return {
                            rowspan: 0,
                            colspan: 0
                        };
                    }
                }
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
                this.$api.salaryincomeDetail(reqParams).then(res=>{
                    let { data:layer1 } = res;
                    let { respCode,data } = layer1;
                    if( respCode == 0 ){
                        let gene = [],jc = [];
                        if( data.talentsExpenditure ){
                            gene = data.talentsExpenditure.map(ele=>{
                                return {
                                    title:'零工支出',
                                    schedulingDate:ele.schedulingDate,
                                    amount:ele.talentsExpenditure,
                                };
                            });
                        }
                        if( data.rpExpenditure ){
                            gene = data.rpExpenditure.map(ele=>{
                                return {
                                    title:'奖惩',
                                    schedulingDate:ele.schedulingDate,
                                    amount:ele.talentsExpenditure,
                                };
                            });
                        }
                        this.tableData = [
                            ...gene,
                            ...jc,
                            {title:'合计',schedulingDate:'',amount:data.sum  },
                        ];
                    }
                }).catch(err=>{
                    console.log('err',err);
                })
            },
        },
    }
</script>
<style scoped lang="scss">
    .marketReceiveNotConfirmCon {
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
    .marketReceiveNotConfirmCon {
        .el-table .cell {
            text-align: center;
            padding-left: 10px;
        }
    }
</style>