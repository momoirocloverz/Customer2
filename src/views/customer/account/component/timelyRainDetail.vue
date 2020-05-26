<template>
    <div class="xfd-detail">
        <el-form ref="formDetail" :model="formDetail" label-width="100px" labelPosition="left" style="background-color:white;padding-left:20px;padding-bottom: 15px">
            <div style="display:flex;align-items:center;padding:20px 20px 20px 0;" class="search-zone">
                <div>
                    <el-input class="rant-input inputWidth keyWFormParent" clearable placeholder="输入订单号搜索" v-model="formDetail.keyWord"></el-input>
                    <el-button type="primary" size="small" class="searchBtn keyWBtn" @click="searchTalentName">搜索</el-button>
                </div>
                <div>
                    <el-button style="margin-left:20px" class="comb-btn" size="mini" type="text" @click="handleCombShow">高级筛选
                        <i class="el-icon-right el-icon-d-arrow-right" :class="isShowComb ? 'el-icon-d-arrow-right-down' : 'el-icon-d-arrow-right-right'"></i>
                    </el-button>
                </div>
            </div>
            <div v-show="isShowComb" class="combine-zone">
                <el-form-item label="日期范围：" class="formSearchMargin">
                    <el-radio-group class="radio-search" v-model="formDetail.date">
                        <el-radio label="">不限</el-radio>
                        <el-radio label="5">本月</el-radio>
                        <el-radio label="4">自定义</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="自定义：" class="formSearchMargin" v-if="formDetail.date == '4'">
                    <el-date-picker class="margin_left40" size="mini" v-model="formDetail.startDate" type="date" value-format="yyyy-MM-dd" placeholder="选择开始时间">
                    </el-date-picker>
                    --
                    <el-date-picker class="margin_left10" size="mini" v-model="formDetail.endDate" type="date" value-format="yyyy-MM-dd" placeholder="选择结束时间">
                    </el-date-picker>
                    <el-button type="primary" size="small" class="datesearchBtn" @click="btn_true">确定</el-button>
                </el-form-item>
            </div>
            <div class="f14 pb10 pt10 co-666">
                合计: 成功发放{{successInfo.successAmount || 0}}人 ;
                {{successInfo.totalRealFee || 0}}元
                <span class="pl20">发放失败{{successInfo.failAmount || 0}}人 ; {{successInfo.totalFailFee || 0}}元</span>
            </div>
        </el-form>
        <div class="table-box back-white">
            <el-table class="table-outline" :data="tableData" emptyText="暂无相关信息" style="width: 100%;">
                <el-table-column label="创建时间" :formatter="workHoursFormatter" prop="createdAt" align="center" min-width=""></el-table-column>
                <el-table-column label="订单号" prop="orderNo" show-overflow-tooltip align="center" min-width=""></el-table-column>
                <el-table-column label="订单发放人数" prop="totalAmount" align="center" min-width=""></el-table-column>
                <el-table-column label="订单发放金额（元）" prop="totalFee" :formatter="_number" align="center" min-width="" ></el-table-column>
                <el-table-column label="成功发放人数" prop="successAmount" align="center" min-width=""></el-table-column>
                <el-table-column label="成功发放金额（元）" prop="totalRealFee" :formatter="_number" align="center" min-width="" ></el-table-column>
                <el-table-column label="失败发放人数" prop="failAmount" align="center" min-width=""></el-table-column>
                <el-table-column label="失败发放金额（元）" prop="failMoney" :formatter="_number" align="center" min-width="" ></el-table-column>
                <el-table-column label="发放状态" prop="status" :formatter="settlementTypeFormatter" align="center" min-width="" ></el-table-column>
                <el-table-column label="支付详情" align="center" min-width="">
                    <template v-slot="scope">
                        <el-button type="text" class="btn-icon btn-icon-view" size="mini"
                                   @click="routerToOrder(scope.row)">查看
                        </el-button>
                    </template>
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
        watch: {
            'formDetail.date': function (val, old) {
                if (val == '') {
                    this.currentPage = 1
                    this.formDetail.endDate = ''
                    this.formDetail.startDate = ''
                    this.getList()
                }  else if (val == '5') {
                    this.currentPage = 1
                    this.formDetail.startDate = moment(new Date()).startOf('month').format('YYYY-MM-DD');
                    this.formDetail.endDate = moment(new Date()).format('YYYY-MM-DD');
                    this.getList()
                } else if (val == '4') {
                    this.formDetail.endDate = ''
                    this.formDetail.startDate = ''
                }
            },
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
                this.getList()
            },
            _number(row, column, cellValue) {
                if (cellValue) {
                    return Number(cellValue).toFixed(2)
                } else {
                    return 0.00
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
                    orderNo: this.formDetail.keyWord,
                    startDate:this.formDetail.startDate,
                    endDate:this.formDetail.endDate
                }
                this.$api.timelyRainOrders(params).then(res=>{
                    if(res.respCode === 0){
                        this.successInfo = res.data;
                        console.log(this.successInfo)
                        if(res.data.pageInfo.list){
                            this.tableData = res.data.pageInfo.list
                            this.pageCount = res.data.pageInfo.pages;
                        }else{
                            this.tableData = []
                            this.pageCount = 0
                        }
                    }
                    console.log(res)
                }).catch(err=>{
                    console.log(err)
                })
            },
            routerToOrder(row){
                const {href} = this.$router.resolve({
                    path: 'timelyRainAccountDetail',
                    query: row
                });
                window.open(href, '_blank')
            },
        }
    }
</script>

<style scoped>

</style>