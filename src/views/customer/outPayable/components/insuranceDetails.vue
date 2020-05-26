<template>
    <div class="insuranceDetailsContainer">
        <h3 class="sche-title">保险费明细 - {{fromParams.outsourcingCusName || '' }} - {{fromParams.talentName}} - {{fromParams.batchNumber}}</h3>
        <div class="table-box back-white">
            <div class="exportContainer">
                <div class="exportLeftCon">
                    合计：{{Number(totalAmount).toFixed(2)}}元
                </div>
            </div>
            <el-table class="table-outline" :data="tableData" emptyText="暂无相关信息" style="width: 100%;">
                <el-table-column label="排班" prop="schedulingName"></el-table-column>
                <el-table-column label="签到时间" prop="workStartDate">
                    <template v-slot="scope">
                        {{scope.row.workStartDate}} {{scope.row.workStartTime.substring(0,5)}}
                    </template>
                </el-table-column>
                <el-table-column label="签到工种" prop="industryName"></el-table-column>
                <el-table-column label="金额(元)" prop="amount"></el-table-column>
            </el-table>
            <div class="pagination-container">
                <el-pagination class="pagebox" layout="total,prev, pager, next" @current-change="handleCurrentChange" :page-size="pageSize"
                               :current-page="currentPage" :page-count="pageCount" :total="total">
                </el-pagination>
            </div>
        </div>
    </div>
</template>
<script>
    export default {
        data() {
            return {
                currentPage: 1,
                pageSize:20,
                pageCount:0,
                tableData: [],
                total: 0,
                fromParams:{},
                totalAmount:0,
            }
        },
        mounted() {
            this.fromParams = this.$route.query;
            console.log(this.fromParams)
            this.data();
        },
        filters:{
            moneyFormat(value){            
                if ((toString.call(value) === '[object Null]') || (toString.call(value) === '[object Undefined]')) {
                    return 0;
                } else {
                    let fix = (Math.round(+value + 'e' + 2) / Math.pow(10, 2)).toFixed(2);
                    return fix;
                }
            },
        },
        methods: {
            data() {
                let _this = this;
                let params = {
                    pageNum: _this.currentPage,
                    pageSize: _this.pageSize,
                    talentId:_this.fromParams.talentId,
                    batchNumber:_this.fromParams.batchNumber,
                    category:_this.fromParams.category,
                    payType:_this.fromParams.payType,
                    customerId:_this.fromParams.customerId,
                    payStatus:_this.fromParams.payStatus, //1. 代付  2.已付
                    showOutsourcing:true,
                    outsourcingCusId: this.$route.query.outsourcingCusId,
                }
                this.$api.getSpecialAdjustmentsDetailListSummary(params).then(res=>{
                    this.totalAmount =res.data.data||0;
                });
                this.$api.specialAdjustmentsDetailList(params).then(res => {
                    if (res.data.respCode === 0) {
                        if (res.data.data.list && res.data.data.list.length > 0) {
                            _this.tableData = Array.from(res.data.data.list);
                            _this.total = res.data.data.total;
                            _this.pageCount = res.data.data.pages;
                            // for (let item of _this.tableData) {
                            //     _this.totalAmount += Math.abs(item.amount)
                            // }
                        }else{
                            _this.tableData = []
                            _this.total = 0
                            _this.pageCount = 0
                            // _this.totalAmount = 0
                        }
                    }
                    console.log(res)
                }).catch(err => {
                    console.log(err)
                })
            },
            handleCurrentChange(val) {
                this.currentPage = val
                this.data()
            },
        },
    }
</script>
<style scoped lang="scss">
    .insuranceDetailsContainer {
        .exportContainer {
            height: 50px;
            line-height: 50px;
            padding-left: 30px;
            box-sizing: border-box;

            .exportLeftCon {
                font-size: 12px;
                color: #4D4D4D;
            }
        }
    }

    .sche-title {
        text-align: center;
        font-size: 20px;
        font-stretch: normal;
        line-height: 2;
        letter-spacing: 1px;
        color: #262626;
        padding-top: 20px;
        font-weight: bold;
        margin-bottom: 20px;
    }
</style>
<style lang="scss">
    .insuranceDetailsContainer {
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

        .el-table .cell {
            text-align: center;
        }
    }
</style>
