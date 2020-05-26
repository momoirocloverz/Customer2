<template>
    <div class="xfd-collect">
        <!--<el-form ref="formDetail"-->
                 <!--class="pl20 pt15 pb10"-->
                 <!--:model="formDetail" label-width="100px" labelPosition="left" style="background-color:white;">-->
            <!--<el-form-item label="日期范围：" class="formSearchMargin">-->
                <!--<el-radio-group class="radio-search" v-model="formDetail.date">-->
                    <!--<el-radio label="">不限</el-radio>-->
                    <!--<el-radio label="5">本月</el-radio>-->
                    <!--<el-radio label="4">自定义</el-radio>-->
                <!--</el-radio-group>-->
            <!--</el-form-item>-->
            <!--<el-form-item label="自定义：" class="formSearchMargin" v-if="formDetail.date == '4'">-->
                <!--<el-date-picker class="margin_left40" size="mini" v-model="formDetail.startDate" type="date" value-format="yyyy-MM-dd" placeholder="选择开始时间">-->
                <!--</el-date-picker>-->
                <!--&#45;&#45;-->
                <!--<el-date-picker class="margin_left10" size="mini" v-model="formDetail.endDate" type="date" value-format="yyyy-MM-dd" placeholder="选择结束时间">-->
                <!--</el-date-picker>-->
                <!--<el-button type="primary" size="small" class="datesearchBtn" @click="btn_true">确定</el-button>-->
            <!--</el-form-item>-->
        <!--</el-form>-->
        <div class="table-box back-white">
            <el-table class="table-outline" :data="tableData" emptyText="暂无相关信息" style="width: 100%;">
                <el-table-column label="日期" prop="payTime"></el-table-column>
                <!--<el-table-column label="收入">-->
                    <!--<el-table-column prop="totalFee" label="充值" :formatter="moneyFormat"></el-table-column>-->
                    <!--<el-table-column prop="totalFee" label="合计" :formatter="moneyFormat"></el-table-column>-->
                <!--</el-table-column>-->
                <el-table-column label="支出">
                    <el-table-column prop="totalServiceFee" label="信息服务费" :formatter="moneyFormat"></el-table-column>
                    <el-table-column prop="totalRealFee" label="实发收入" :formatter="moneyFormat"></el-table-column>
                    <el-table-column prop="totalTax" label="个人所得税" :formatter="moneyFormat"></el-table-column>
                    <el-table-column prop="" label="合计(应发收入)">
                        <template v-slot="scope">
                            <span>{{(scope.row.totalMoney + scope.row.totalServiceFee).toFixed(2)}}</span>
                        </template>
                    </el-table-column>
                </el-table-column>
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
        data() {
            return {
                total: 0,
                currentPage: 1,
                pageCount: 0,
                pageSize: 20,
                formDetail: {
                    date:'',
                    startDate: '',
                    endDate: '',
                    status:"",
                },
                tableData: [],
                successInfo:{},
                xfdAccountTotal:0,
            }
        },
        watch: {
            'formDetail.date': function (val, old) {
                if (val == '') {
                    this.currentPage = 1
                    this.formDetail.endDate = ''
                    this.formDetail.startDate = ''
                    this.getData()
                }  else if (val == '5') {
                    this.currentPage = 1
                    this.formDetail.startDate = moment(new Date()).startOf('month').format('YYYY-MM-DD');
                    this.formDetail.endDate = moment(new Date()).format('YYYY-MM-DD');
                    this.getData()
                } else if (val == '4') {
                    this.formDetail.endDate = ''
                    this.formDetail.startDate = ''
                }
            },
        },
        mounted() {
            this.getData()
        },
        methods: {
            getData() {
                let params = {
                    pageNum: this.currentPage,
                    pageSize: this.pageSize,
                    // startDate: this.formDetail.startDate,
                    // endDate: this.formDetail.endDate,
                }
                this.$api.htOutDays(params).then(res => {
                    console.log(res)
                    let {data, respCode} = res;
                    if (respCode === 0) {
                        if (data.pageInfo.list) {
                            this.tableData = data.pageInfo.list;
                            this.pageCount = data.xfdOrderSumDOS.pages;
                        }
                    }
                }).catch(err => {
                    console.log('err', err)
                })
            },
            btn_true() {
                if(!this.formDetail.startDate){
                    return this.$message.error('开始日期不能为空!')
                }
                if(!this.formDetail.endDate){
                    return this.$message.error('结束日期不能为空!')
                }
                if(this.formDetail.startDate > this.formDetail.endDate){
                    return this.$message.error('结束日期要大于开始日期!')
                }
                this.currentPage = 1
                this.getData()
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
<style lang="scss">
    .xfd-collect {
        background-color: #fff;
        height: 100px;
        width: 100%;
        .el-button.is-disabled {
            color: #C0C4CC !important;
            cursor: not-allowed !important;
            background-color: #FFFFFF !important;
            border-color: #EBEEF5 !important;
        }
        .el-form {
            padding-left: 20px;
        }
        .el-table .cell {
            text-align: center;
        }
        .el-table th.is-leaf {
            border: 1px solid #EBEEF5;
        }

        .el-table thead.is-group th {
            background-color: #F5F5F7;
        }
    }
</style>