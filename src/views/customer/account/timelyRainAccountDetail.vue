<template>
    <div style="background-color:#f2f2f5;" class="xfd-pay-detail">
        <el-form label-width="100px" labelPosition="left"
                 style="background-color:white;padding-left:20px;padding-bottom: 15px">
            <div class="pt20">
                <span class="f16">{{info.orderNo}}</span>
            </div>
            <el-form-item label="支付状态：" class="formSearchMargin" style="margin-top:15px">
                <el-radio-group class="radio-search" v-model="status">
                    <el-radio label="">不限</el-radio>
                    <el-radio label="3">支付成功</el-radio>
                    <el-radio label="4">发放完成</el-radio>
                    <el-radio label="6">处理出错</el-radio>
                </el-radio-group>
            </el-form-item>
            <div class="f14 pb10 co-666 xfd-flex pr20">
                <div>
                    合计: <span class="pl20">成功发放{{successInfo.successAmount || 0}}人 ; 应发{{successInfo.totalFee || 0}}元; </span>
                    <span class=""> 个税{{successInfo.totalTax || 0}}元; 实发{{successInfo.totalRealFee || 0}}元</span>
                </div>
                <el-button size="small" class="myplain-btn"
                           @click="exportExce()">
                    导出
                </el-button>
            </div>
        </el-form>
        <div class="table-box back-white">
            <el-table class="table-outline" :data="tableData"
                      emptyText="暂无相关信息" style="width: 100%;">
                <el-table-column align="center" label="姓名" prop="talentName"></el-table-column>
                <el-table-column align="center" :formatter="_number" label="付款手续费(元)" prop="payFee"></el-table-column>
                <!--<el-table-column align="center" :formatter="_number" label="信息服务费(元)"-->
                                 <!--prop="serviceFee"></el-table-column>-->
                <el-table-column align="center" :formatter="_number" label="薪企云服应发收入(元)"
                                 prop="totalMoney"></el-table-column>
                <el-table-column align="center" :formatter="_number" label="个人所得税(元)" prop="tax"></el-table-column>
                <el-table-column align="center" :formatter="_number" label="薪企云服实际到账(元)" prop="money"></el-table-column>
                <!--<el-table-column align="center" :formatter="_number" label="薪企云服本月已付收入(元)" prop="alreayPay"></el-table-column>-->
                <!--<el-table-column align="center" :formatter="_number" label="薪企云服本月已付个税(元)" prop="alreayTax"></el-table-column>-->
                <el-table-column align="center" label="是否冻结" prop="freeStatus"
                                 :formatter="freeFormatter"></el-table-column>
                <el-table-column align="center" label="发放状态" prop="status"
                                 :formatter="settlementTypeFormatter"></el-table-column>
                <el-table-column align="center" label="失败原因" prop="message"></el-table-column>
            </el-table>
            <div class="pagination-container">
                <el-pagination class="pagebox" layout="prev, pager, next" @current-change="handleCurrentChange"
                               :current-page="currentPage" :page-count="pageCount">
                </el-pagination>
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
                pageSize: 20,
                status: '',
                tableData: [],
                info: {},
                successInfo: {},
            }
        },
        filters: {
            dateFor(val) {
                console.log(val)
                if (val) {
                    return val.substring(0, 10)
                } else {
                    return ''
                }
            }
        },
        watch: {
            'status': function (val, oldVal) {
                this.currentPage = 1;
                this.getList()
            }
        },
        mounted() {
            this.info = this.$route.query;
            this.getList()
        },
        methods: {
            handleCurrentChange(val) {
                this.currentPage = val
                this.getList()
            },
            freeFormatter(row, column, cellValue, index) {
                let status = '' //1:待确认 2:待支付 3:支付成功 4:发放完成 5:已取消 6:处理出错
                switch (Number.parseInt(cellValue)) {
                    case 0:
                        status = '否'
                        break
                    case 1:
                        status = '是'
                        break
                    default:
                        status = '--'
                        break
                }
                return status
            },
            settlementTypeFormatter(row, column, cellValue, index) {
                let status = '' //1:待确认 2:待支付 3:支付成功 4:发放完成 5:已取消 6:处理出错
                switch (Number.parseInt(cellValue)) {
                    case 1:
                        status = '待确认'
                        break
                    case 2:
                        status = '待支付'
                        break
                    case 3:
                        status = '支付成功'
                        break
                    case 4:
                        status = '发放完成'
                        break
                    case 5:
                        status = '已取消'
                        break;
                    case 6:
                        status = '处理出错'
                        break
                    default:
                        status = '--'
                        break
                }
                return status
            },
            _number(row, column, cellValue) {
                if (cellValue) {
                    return cellValue.toFixed(2)
                } else {
                    return 0
                }
            },
            exportExce() {
                let _this = this;
                _this.loading = true;
                let params = {
                    pageNum: this.currentPage,
                    pageSize: this.pageSize,
                    status: this.status,
                    orderNo: this.info.orderNo,
                }
                this.$api.timelyRainDetailsExport(params).then(res => {
                    if (res.respCode === 0) {
                        window.open(res.data)
                    }
                }).catch(err => {
                    console.log(err)
                }).finally(() => {
                    setTimeout(() => {
                        _this.loading = false
                    }, 1500)
                })
            },
            getList() {
                let params = {
                    pageNum: this.currentPage,
                    pageSize: this.pageSize,
                    status: this.status,
                    orderNo: this.info.orderNo,
                }
                this.$api.timelyRainDetail(params).then(res => {
                    if (res.respCode === 0) {
                        if(res.data.commonOrderDO){
                            this.successInfo = res.data.commonOrderDO;
                        }
                        console.log(this.successInfo);
                        if (res.data.pageInfo.list) {
                            this.tableData = res.data.pageInfo.list;
                            this.pageCount = res.data.pageInfo.pages
                        } else {
                            this.tableData = []
                            this.pageCount = 0
                        }
                    }
                    console.log(res)
                }).catch(err => {
                    console.log(err)
                })
            },
        },
    }
</script>
<style lang="scss">
    .xfd-pay-detail {
        .xfd-flex {
            display: flex;
            justify-content: space-between;

            .myplain-btn {
                background-color: #ffefea;
                border: 1px solid #f7beb2;
                color: #e9481c;
                min-width: 120px;
            }
        }

        .el-table .cell {
            padding-left: 5px;

            .el-button {
                padding: 10px 15px;
            }

            .el-button + .el-button {
                margin-left: 5px;
            }
        }
    }
</style>


