<template>
    <div class="" style="width:80%;margin: auto">
        <div class="pt20 pb20 tc f18">
            <span>利润明细   {{$route.query.classTaskDate}} {{$route.query.nameAlias? $route.query.nameAlias : ''}}</span>
        </div>
        <div class="pt20 pl10 pb10 pro-t">
            <span>收入</span>
            <span></span>
            <el-button type="text" class="btn-icon btn-icon-view" size="mini"
                       @click="routerTo()">查看收入明细
            </el-button>
        </div>
        <el-table
                :data="tableData.incomeList"
                :summary-method="getSummaries"
                border
                show-summary
                style="width: 100%;">
            <el-table-column prop="classTaskName" label="班务" align="center"></el-table-column>
            <el-table-column prop="inCome" :formatter="_number" label="金额(元)" align="center"></el-table-column>
        </el-table>
        <div class="pt20 pl10 pb10">支出</div>
        <el-table
                :data="tableData.expendList"
                border
                :summary-method="getSummaries"
                show-summary
                style="width: 100%;">
            <el-table-column prop="title" label="事项" align="center"></el-table-column>
            <el-table-column prop="expend" :formatter="_number" label="金额(元)" align="center"></el-table-column>
        </el-table>
        <div class="pt20 pl10 pb10">利润</div>
        <el-table
                :data="tableData.profitList"
                border
                style="width: 100%;margin-bottom: 100px">
            <el-table-column prop="title" label="事项" align="center"></el-table-column>
            <el-table-column prop="profit" :formatter="_number" label="金额(元)" align="center"></el-table-column>
        </el-table>
    </div>
</template>

<script>

    export default {

        data() {
            return {
                tableData: {
                    incomeList: [],
                    expendList: [
                        {title: '排班收入', expend: 0},
                        {title: '奖惩合计', expend: 0},
                    ],
                    profitList: [{title: '利润', profit: 0}],
                },
                paramsInfo: {},
            }
        },
        watch: {},
        mounted() {
            this.paramsInfo = this.$route.query;
            this.getData()
        },
        methods: {
            routerTo(row) {
                const {href} = this.$router.resolve({
                    path: 'incomeDetail',
                    query: this.$route.query
                });
                window.open(href, '_blank')
                console.log(row)
            },
            _number(row, column, cellValue) {
                if (cellValue) {
                    return cellValue.toFixed(2)
                } else {
                    return 0
                }
            },
            getData() {
                this.$api.classTaskProfitDetail(this.paramsInfo).then(res => {
                    if (res.data.respCode === 0) {
                        this.tableData.incomeList = res.data.data.inComelist;
                        this.tableData.profitList[0].profit = res.data.data.profit || 0;
                        this.tableData.expendList[0].expend = res.data.data.classTaskExpend.schuduleInCome || 0;
                        this.tableData.expendList[1].expend = res.data.data.classTaskExpend.rewardsPenalties || 0;
                    }
                    console.log(res)
                }).catch(err => {
                    console.log(err);
                })
            },
            getSummaries(param) {
                console.log(param)
                const {columns, data} = param;
                const sums = [];
                columns.forEach((column, index) => {
                    if (index === 0) {
                        sums[index] = '总价';
                        return;
                    }
                    const values = data.map(item => Number(item[column.property]));
                    if (!values.every(value => isNaN(value))) {
                        sums[index] = values.reduce((prev, curr) => {
                            const value = Number(curr);
                            prev = Number(prev);
                            if (!isNaN(value)) {
                                let total = prev + curr;
                                return total.toFixed(2);
                            } else {
                                return prev.toFixed(2);
                            }
                        }, 0);
                    }
                });

                return sums;
            }
        }
    }
</script>

<style scoped lang="scss">
    .pro-t {
        display: flex;
        justify-content: space-between;
        align-items: center;
    }
</style>
