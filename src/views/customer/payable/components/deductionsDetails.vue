<template>
    <div class="deductionsDetailsCon">
        <h3 class="sche-title">扣款明细 {{fromParams.realNameAlias}} - {{fromParams.batchNumber}}</h3>
        <div class="headTitleCon">
            <div class="subTitle">
                <span>合计{{totalAmount | moneyFormat}}元</span>
            </div>
        </div>
        <div class="table-box">
            <el-table class="table-outline" :data="tableData" emptyText="暂无相关明细" style="width: 100%;">
                <el-table-column label="扣款事项" prop="typeName" :formatter="existFormatter"></el-table-column>
                <el-table-column label="金额(元)" prop="amount" :formatter="moneyFormat"></el-table-column>
                <el-table-column label="操作">
                    <template v-slot="scope">
                        <div class="operate" v-if="(scope.row.category == 2 || scope.row.category == 3)"
                             @click="goToDetail(scope.row)"><img :src="viewIcon"><span>查看明细</span></div>
                        <!--&& fromParams.status == '1'-->
                        <div class="operate"
                             v-if="scope.row.category ==1"
                             @click="deleteDetail(scope.row)"><img :src="detailIcon"><span>删除</span></div>
                    </template>
                </el-table-column>
            </el-table>
            <div class="pagination-container">
                <el-pagination class="pagebox" layout="total,prev, pager, next" @current-change="handleCurrentChange"
                               :page-size="pageSize" :current-page="currentPage" :total="tableData.length"
                               :page-count="pageCount">
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
                pageCount: 0,
                pageSize: 20,
                total: 0,
                tableData: [],
                totalAmount: 0,
                detailIcon: require('@/assets/icons/btnicons/delete.png'),
                viewIcon: require('@/assets/icons/btnicons/view.png'),
                fromParams: {},
            }
        },
        mounted() {
            this.fromParams = this.$route.query;
            console.log(this.fromParams)
            this.getData();
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
            getData() {
                let _this = this;
                console.log(this.$route.query, 'query')
                let params = {
                    pageNum: _this.currentPage,
                    pageSize: 20,
                    talentId: _this.fromParams.talentId,
                    batchNumber: _this.fromParams.batchNumber,
                    payType: _this.fromParams.payType,
                    payStatus: _this.fromParams.payStatus,
                    badDebt:this.$route.query.badDebt || '1',
                }
                this.$api.listByTalentAndBN(params).then(res => {
                    if (res.data.respCode === 0) {
                        _this.tableData = res.data.data.list || [];
                        _this.totalAmount = 0;
                        for (let item of _this.tableData) {
                            _this.totalAmount += item.amount
                        }

                    }
                    console.log(res)
                }).catch(err => {
                    console.log(err)
                })
            },
            existFormatter(row, column, cellValue) {
                if (cellValue) {
                    return cellValue
                } else {
                    return '无'
                }
            },
            moneyFormat(row, column, cellValue) {
                if ((toString.call(cellValue) === '[object Null]') || (toString.call(cellValue) === '[object Undefined]')) {
                    return '无'
                } else {
                    let fix = (Math.round(+cellValue + 'e' + 2) / Math.pow(10, 2)).toFixed(2);
                    return fix;
                }
            },
            handleCurrentChange(val) {
                this.currentPage = val
                this.getData()
            },
            deleteDetail(row) {
                let _this = this;
                if (row.status == '3') {
                    return _this.$message.warning("当前批次已发放，无法删除!")
                }
                let params = {
                    adjustmentId: row.id
                }
                this.$confirm('是否删除?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$api.adjDelete(params).then(res => {
                        if (res.respCode === 0) {
                            _this.getData()
                            this.$message({
                                type: 'success',
                                message: '删除成功!'
                            });
                        }
                    }).catch(err => {
                    })

                }).catch(() => {
                    // this.$message({
                    //     type: 'info',
                    //     message: '已取消删除'
                    // });          
                });

            },
            goToDetail(row) {
                let item = row;
                if (row.typeName == "保险费") {
                    const {href} = this.$router.resolve({
                        path: '/payable/insuranceDetails',
                        query: {...item}
                    });
                    window.open(href, '_blank');
                } else if (row.typeName == "系统使用费") {
                    const {href} = this.$router.resolve({
                        path: '/payable/accessFee',
                        query: {...item}
                    });
                    window.open(href, '_blank');
                }
            },
        },
    }
</script>
<style lang="scss">
    .deductionsDetailsCon {
        .el-table .cell {
            text-align: center;
        }
    }
</style>
<style scoped lang="scss">
    .headTitleCon {
        background-color: #fff;
        border: 1px solid #E6E7EB;
        margin-top: 18px;
        padding-left: 36px;
    }

    .operate {
        cursor: pointer;

        img {
            height: 18px;
            width: 18px;
            vertical-align: -5px;
            margin-right: 10px;
        }
    }

    .table-box {
        background-color: #fff;
    }

    .subTitle {
        height: 50px;
        line-height: 50px;
        font-size: 12px;
    }

    .sche-title {
        text-align: center;
        font-size: 20px;
    }
</style>