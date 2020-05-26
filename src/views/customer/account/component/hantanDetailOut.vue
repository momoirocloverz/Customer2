<template>
    <div class="xfd-detail">
        <div class="table-box back-white pt20">
            <el-table class="table-outline" :data="tableData" emptyText="暂无相关信息" style="width: 100%;">
                <el-table-column label="支付时间" :formatter="workHoursFormatter" prop="updateAt" align="center" min-width=""></el-table-column>
                <el-table-column label="业务类型" prop="tyep" show-overflow-tooltip align="center" min-width=""></el-table-column>
                <el-table-column label="交易对象" prop="userName" show-overflow-tooltip align="center" min-width=""></el-table-column>
                <el-table-column label="类型" prop="moneyType" show-overflow-tooltip align="center" min-width=""></el-table-column>
                <el-table-column label="支出" prop="money" show-overflow-tooltip align="center" min-width=""></el-table-column>
                <el-table-column label="订单号" prop="orderNo" show-overflow-tooltip align="center" min-width=""></el-table-column>
            </el-table>
            <div class="pagination-container">
                <el-pagination class="pagebox" layout="prev, pager, next" @current-change="handleCurrentChange" :current-page="currentPage" :page-count="pageCount">
                </el-pagination>
            </div>
        </div>
    </div>
</template>

<script>
    import moment from 'moment';
    export default {
        name: "xfdDetail",
        data(){
            return {
                total: 0,
                currentPage: 1,
                pageCount: 0,
                pageSize: 20,
                formDetail: {
                    date:'',
                    startDate: '',
                    endDate: '',
                    keyWord:'',
                    status:"",
                },
                isShowComb: false,
                tableData: [],
                successInfo:{},
                xfdAccountTotal:0,
            }
        },
        mounted() {
            this.getList()
        },
        methods:{
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
            handleCombShow() {
                this.isShowComb = !this.isShowComb
            },
            _number(row, column, cellValue) {
                if (cellValue) {
                    return cellValue.toFixed(2)
                } else {
                    return 0
                }
            },
            handleCurrentChange(val) {
                this.currentPage = val
                this.getList()
            },
            searchTalentName() {
                this.currentPage = 1
                this.getList()
            },
            workHoursFormatter(row, column, cellValue) {
                if (cellValue) {
                    return cellValue.substring(0,16)
                } else {
                    return 0
                }
            },
            getList(){
                let params = {
                    pageNum:this.currentPage,
                    pageSize:this.pageSize,
                }
                this.$api.htOutOrders(params).then(res=>{
                    if(res.respCode === 0){
                        this.xfdAccountTotal = res.data.htMoney || 0;
                        if(res.data.pageInfo.list){
                            this.tableData = res.data.pageInfo.list
                            this.pageCount = res.data.pageInfo.pages;
                        }else{
                            this.tableData = []
                            this.pageCount = 0
                        }
                        this.$emit('showTotal',{xfdAccountTotal:res.data.htMoney})
                    }
                    console.log(res)
                }).catch(err=>{
                    console.log(err)
                })
            },
        }
    }
</script>

<style scoped>

</style>