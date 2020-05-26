<template>
    <div class="billCollectContainer">
        <div class="exportContainer">
            <div>
                <el-button class="myplain-btn exportBtn" size="small" :disabled="tableData.length ? false : true"
                           @click="exportExcel">导出
                </el-button>
            </div>
        </div>
        <div class="table-box back-white">
            <el-table class="table-outline" :data="tableData" emptyText="暂无相关信息" style="width: 100%;">
                <el-table-column label="月份" prop="accountDate"></el-table-column>
                <el-table-column label="上期余额" prop="previousWsBalance" :formatter="moneyFormat"></el-table-column>
                <el-table-column label="收入">
                    <el-table-column prop="recharge" label="充值" :formatter="moneyFormat"></el-table-column>
                    <el-table-column prop="inAmount" label="合计" :formatter="moneyFormat"></el-table-column>
                </el-table-column>
                <el-table-column label="支出">
                    <!--<el-table-column prop="rechargeCharges" label="充值手续费" :formatter="moneyFormat"></el-table-column>-->
                    <!--<el-table-column prop="wages" label="代发收入" :formatter="moneyFormat"></el-table-column>-->
                    <!--<el-table-column prop="managementExpense" label="管理费" :formatter="moneyFormat"></el-table-column>-->
                    <el-table-column prop="payFee" label="付款手续费" :formatter="moneyFormat"></el-table-column>
                    <el-table-column prop="attendanceFee" label="考勤管理费" :formatter="moneyFormat"></el-table-column>
                    <el-table-column prop="insurance" label="保险费" :formatter="moneyFormat"></el-table-column>
                    <el-table-column prop="systemFee" label="系统使用费" :formatter="moneyFormat"></el-table-column>
                    <el-table-column prop="serviceFee" label="信息服务费" :formatter="moneyFormat"></el-table-column>
                    <!--<el-table-column prop="cashFee" label="提现" :formatter="moneyFormat"></el-table-column>-->
                    <!--<el-table-column prop="cashServiceFee" label="提现手续费" :formatter="moneyFormat"></el-table-column>-->
                    <el-table-column prop="outAmount" label="合计" :formatter="moneyFormat"></el-table-column>
                </el-table-column>
                <el-table-column label="期末余额" prop="wsBalance" :formatter="moneyFormat"></el-table-column>
            </el-table>
            <div class="pagination-container">
                <el-pagination class="pagebox" layout="total,prev, pager, next" @current-change="handleCurrentChange"
                               :current-page="currentPage" :page-count="pageCount" :total="total"
                               v-if="total"></el-pagination>
            </div>
        </div>
    </div>
</template>
<script>
    export default {
        data() {
            return {
                total: 0,
                currentPage: 1,
                pageCount: 0,
                pageSize: 10,
                formDetail: {
                    date: '5',
                    startDate: '',
                    endDate: ''
                },
                tableData: [],
            }
        },
        mounted() {
            this.getData()
        },
        methods: {
            getData() {
                let params = {
                    pageNum: this.currentPage,
                    pageSize: this.pageSize,
                    accountType: 1,
                }
                this.$api.getAccountRecordSum(params).then(res => {
                    let {data: layer1} = res;
                    let {data, respCode} = layer1;
                    if (respCode === 0) {
                        if (data.list) {
                            this.tableData = data.list;
                            let obj = {};
                            let arr = ['recharge','inAmount','payFee', 'attendanceFee', 'insurance', 'systemFee','serviceFee','outAmount'];
                            arr.forEach(ele => {
                                obj[ele] = this.tableData.map(sub => {
                                    if (!(typeof (sub[ele]) == 'number')) {
                                        sub[ele] = 0;
                                    }
                                    return sub[ele];
                                }).reduce((acc, cur) => {
                                    return acc + cur;
                                })
                            });
                            obj.accountDate = '总计';
                            this.tableData.push(obj);
                        }
                        this.total = data.total;
                    }
                }).catch(err => {
                    console.log('err', err)
                })
            },
            exportExcel() {
                let params = {
                    pageNum: this.currentPage,
                    pageSize: this.total,
                    accountType: 1,
                }
                const loading = this.$loading({
                    lock: true,
                    text: '正在导出excel表...',
                    spinner: 'el-icon-loading',
                    background: 'rgba(255, 255, 255, 0.9)'
                });
                this.$api.getAccountRecordSumExcel(params).then(res => {
                    if (res.data.respCode == 0) {
                        loading.close();
                        window.open(res.data.data)
                    } else {
                        loading.close();
                    }
                }).catch(err => {
                    setTimeout(() => {
                        loading.close();
                    }, 5000);
                    console.log('err', err);
                });
            },
            handleCurrentChange(val) {
                this.currentPage = val
                this.getData()
            },
            moneyFormat(row, column, cellValue) {
                if ((toString.call(cellValue) === '[object Null]') || (toString.call(cellValue) === '[object Undefined]')) {
                    return ''
                } else {
                    let fix = (Math.round(+cellValue + 'e' + 2) / Math.pow(10, 2)).toFixed(2);
                    return fix;
                }
            },

        },
    }
</script>
<style scoped lang="scss">
    .billCollectContainer {
        background-color: #fff;
        height: 100px;
        width: 100%;
    }

    .exportBtn {
        width: 98px;
        color: #e9481c;
        background-color: #ffefea;
        border: 1px solid #f7beb2;
    }

    .exportContainer {
        background-color: #fff;
        border-top: 1px solid #E6E7EB;
        padding-left: 24px;
        padding-top: 11px;
        padding-bottom: 11px;
    }

    .el-row {
        border-top: 1px solid #606266;
        border-left: 1px solid #606266;
        border-bottom: 1px solid #606266;
    }

    .el-col {
        border-right: 1px solid #606266;
        /* border-bottom: 1px solid red; */
    }
</style>
<style lang="scss">
    .billCollectContainer {
        .el-button.is-disabled {
            color: #C0C4CC !important;
            cursor: not-allowed !important;
            background-color: #FFFFFF !important;
            border-color: #EBEEF5 !important;
        }

        .el-form {
            padding-left: 20px;
        }

        .el-form-item__label {
            line-height: 18px;
            margin-top: 13px;
        }

        .el-form-item__content {
            line-height: 18px;
            margin-top: 11px;
        }

        .el-form-item__label {
            font-size: 12px;
        }

        .el-radio__label {
            font-size: 12px;
        }

        .el-table .cell {
            text-align: center;
            padding-left: 10px;
        }

        .el-table th.is-leaf {
            border: 1px solid #EBEEF5;
        }

        .el-table thead.is-group th {
            background-color: #F5F5F7;
        }
    }
</style>