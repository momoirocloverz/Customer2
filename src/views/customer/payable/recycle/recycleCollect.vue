<template>
    <div class="recycle" v-loading="loading" element-loading-text="加载中...">
        <el-form ref="formDetail" :model="formDetail" class="masterForm bg-fff pl20 pt20 pb10" label-width="90px"
                 labelPosition="left">
            <div class="combine-zone">
                <el-form-item label="日期范围：" class="mb10">
                    <el-radio-group class="radio-search" v-model="formDetail.date">
                        <el-radio label="">不限</el-radio>
                        <el-radio label="5">本月</el-radio>
                        <el-radio label="1">最近7天</el-radio>
                        <el-radio label="2">最近30天</el-radio>
                        <el-radio label="3">最近90天</el-radio>
                        <el-radio label="4">自定义</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="自定义：" class="mb10" v-if="formDetail.date == '4'">
                    <el-date-picker class="margin_left40" size="mini" v-model="formDetail.startDate" type="date"
                                    value-format="yyyy-MM-dd" placeholder="选择开始时间">
                    </el-date-picker>
                    --
                    <el-date-picker class="margin_left10" size="mini" v-model="formDetail.endDate" type="date"
                                    value-format="yyyy-MM-dd" placeholder="选择结束时间">
                    </el-date-picker>
                    <el-button type="primary" size="small" class="datesearchBtn" @click="btn_true">确定</el-button>
                </el-form-item>
                <el-form-item label="结算方式：" class="mb10">
                    <el-radio-group class="radio-search" v-model="formDetail.settlementType">
                        <el-radio label="">不限</el-radio>
                        <el-radio label="2">月结</el-radio>
                        <el-radio label="4">周结</el-radio>
                        <el-radio label="1">日结</el-radio>
                    </el-radio-group>
                </el-form-item>
            </div>
        </el-form>
        <div class="infoContainer">
            <div class="infoTextCon">
                <div>
                    共{{total}}条记录，外包费用{{outCost}}元，代发收入{{salary}}元，合计{{outCost + salary | forSalary}}元
                </div>
            </div>
        </div>
        <div class="table-box back-white">
            <el-table class="table-outline" :data="tableData" emptyText="暂无相关信息"
                      style="width: 100%;">
                <el-table-column label="批次" prop="batchNumber" ></el-table-column>
                <el-table-column label="人数"  prop="popmount" ></el-table-column>
                <el-table-column label="结算方式" prop="settlementTypeName" show-overflow-tooltip ></el-table-column>
                <el-table-column label="类型" prop="payType"  :formatter="taskNameFormatter"></el-table-column>
                <el-table-column label="实发金额（元）" prop="totalAmount"></el-table-column>
                <el-table-column label="操作" >
                    <template v-slot="scope">
                        <div class="operateCon">
                            <div class="subItem" @click="goTo(scope.row)"><img :src="icon1"/><span>查看</span></div>
                            <!--<div class="subItem" @click="recovery(scope.row)"><img :src="icon1"/><span>还原</span></div>-->
                        </div>
                    </template>
                </el-table-column>
            </el-table>
            <div class="pagination-container">
                <el-pagination class="mypagination" @current-change="handleCurrentChange" :current-page="currentPage"
                               :page-size="pageSize" layout="total , prev, pager, next, jumper" :total="total">
                </el-pagination>
            </div>
        </div>
    </div>
</template>
<script>
    import Interval from '../../../../common/interval.js'

    export default {
        data() {
            return {
                total: 0,
                currentPage: 1,
                pageCount: 0,
                outCost:0,
                notTotal: 0,
                salary:0,
                pageSize: 20,
                tableData: [],
                formDetail: {
                    date: '5',
                    settlementType: '',
                    settlementStatus: '1',//代付
                    startDate: '',
                    endDate: '',
                },
                isDisabled: true,
                loading: false,
                totalMount: {},
                icon1: require('@/assets/icons/icon_1541.png'),
                icon2: require('@/assets/icons/icon_1542.png'),
                icon3: require('@/assets/icons/icon_1543.png'),
            }
        },
        filters:{
            forSalary(val){
                return val.toFixed(2);
            }
        },
        watch: {
            'formDetail.settlementType': function (val) {
                this.currentPage = 1;
                this.getPayList()
            },
            'formDetail.settlementStatus': function (val) {
                this.currentPage = 1;
                this.getPayList()
            },
            'formDetail.date': function (val) {
                switch (val) {
                    case '1':
                        this.formDetail.endDate = Interval.getDay(0);
                        this.formDetail.startDate = Interval.getDay(-7);
                        this.currentPage = 1;
                        this.getPayList()
                        break;
                    case '2':
                        this.formDetail.endDate = Interval.getDay(0);
                        this.formDetail.startDate = Interval.getDay(-30);
                        this.currentPage = 1;
                        this.getPayList()
                        break;
                    case '3':
                        this.formDetail.endDate = Interval.getDay(0);
                        this.formDetail.startDate = Interval.getDay(-90);
                        this.currentPage = 1;
                        this.getPayList()
                        break;
                    case '4':
                        this.formDetail.endDate = '';
                        this.formDetail.startDate = '';
                        break;
                    case '5':
                        this.formDetail.endDate = Interval.getDay(0)
                        this.formDetail.startDate = `${this.Moment(Date.now()).format('YYYY-MM')}-01`;
                        this.currentPage = 1;
                        this.getPayList()
                        break;
                    default:
                        this.formDetail.endDate = '';
                        this.formDetail.startDate = '';
                        this.currentPage = 1;
                        this.getPayList()
                        break;
                }
            }
        },
        mounted() {
            if (this.formDetail.date == "5") {
                this.formDetail.endDate = Interval.getDay(0)
                this.formDetail.startDate = `${this.Moment(Date.now()).format('YYYY-MM')}-01`;
            }
            this.getPayList()
        },
        methods: {
            paytype(val) {
                let payWay = val.payWay;
                if (payWay == '2') {
                    return '线上'
                } else if (payWay == '1') {
                    return '线下'
                } else {
                    return '--'
                }
            },
            taskNameFormatter(row, column, cellValue) {
                if (row.payType == '1') {
                    return '外包费用'
                } else if(row.payType == '2') {
                    return '代发收入'
                }else{
                    return '无'
                }
            },
            toFixeFortter2(row,col,val) {
                if (val) {
                    return Number(val).toFixed(2)
                } else {
                    return 0
                }
            },
            btn_true() {
                if (!this.formDetail.startDate) {
                    return this.$message.error('开始日期不能为空!')
                }
                if (!this.formDetail.endDate) {
                    return this.$message.error('结束日期不能为空!')
                }
                if (this.formDetail.startDate > this.formDetail.endDate) {
                    return this.$message.error('结束日期要大于开始日期!')
                }
                this.currentPage = 1
                this.getPayList();
            },
            recovery() {

            },
            getPayList(){
                let _this = this;
                _this.loading = true;
                let params = {
                    startDate:_this.formDetail.startDate,//	开始时间
                    endDate:_this.formDetail.endDate,//	结束时间
                    settlementType:_this.formDetail.settlementType,//	结算方式 (1日结2月结4周结)
                    payStatus:_this.formDetail.settlementStatus,//	结算状态 (1未结算2已结算默认未结算)
                    pageNum:_this.currentPage,//	页数
                    pageSize:20,//	int	false	页码
                    badDebt:'2',//坏账2 默认1
                };
                this.$api.getPayList(params).then(res=>{
                    if(res.respCode === 0){
                        console.log(res.data)
                        if (res.data.page.list && res.data.page.list.length > 0) {
                            _this.tableData = Array.from(res.data.page.list);
                            _this.total = res.data.page.total;
                            _this.pageCount = res.data.page.pages
                            _this.outCost = res.data.waibao || 0;
                            _this.salary = res.data.daifa || 0;
                        } else {
                            _this.tableData = [];
                            _this.total = 0;
                            _this.pageCount = 0;
                            _this.outCost = 0;
                            _this.salary = 0;
                        }
                    }
                    console.log(res)
                }).catch(err=>{
                    console.log(err);
                }).finally(()=>{
                    _this.loading = false;
                })
            },
            handleCurrentChange(val) {
                this.currentPage = val;
                this.getPayList()
            },
            goTo(row) {
                const {href} = this.$router.resolve({
                    path: 'recycleDetail',
                    query: row
                });
                window.open(href, '_blank')
            },
        },
    }
</script>
<style scoped lang="scss">
    .recycle {
        .selectStatus {
            color: #4C4C4C;
            font-size: 12px;
            margin-left: 25px;
        }
        .operateCon {
            display: flex;
            flex-direction: row;
            flex-wrap: nowrap;
            justify-content: space-around;
            align-content: center;
            align-items: center;
        }
        .subItem {
            cursor: pointer;
        }
        .cusHeader {
            vertical-align: 1px;
        }
    }
</style>
<style lang="scss">
    .recycle {
        .infoContainer {
            display: flex;
            justify-content: space-between;
            align-items: center;
            background-color: #fff;
            border: 1px solid #E6E7EB;
            margin-top: 18px;

            .infoTextCon {
                padding: 0 24px 0 24px;
                display: flex;
                justify-content: space-between;
                height: 50px;
                line-height: 50px;
                font-size: 12px;
            }
        }

        .goToBtn {
            color: #5c5c5c;
            cursor: pointer;

            .goToBtnText {
                color: #e84518
            }

            .goToBtnIcon {
                color: #e84518;
                font-weight: bold;
            }
        }
    }

    .subItem {
        img, span {
            display: inline-block;
            vertical-align: middle;
        }

        img {
            width: 13px;
            height: 15px;
            margin-right: 3px;
        }
    }

    .el-table .cell {
        text-align: center;
        word-break: inherit;
    }
</style>
