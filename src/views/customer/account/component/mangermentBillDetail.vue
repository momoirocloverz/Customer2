<template>
    <div class="billDetailCon" v-loading="loading" element-loading-text="正在导出excel表...">
        <el-form ref="formDetail" :model="formDetail" label-width="90px" labelPosition="left"
                 style="background-color:#fff;padding-left:20px;">
            <div class="search-zone">
                <el-input class="searchMaster" clearable placeholder="输入交易对象姓名搜索" prefix-icon="el-icon-search"
                          v-model="formDetail.toUserName" @clear="searchNow"></el-input>
                <div class="charge-btn" @click="searchNow">搜索</div>
                <el-button class="comb-btn" size="mini" type="text" @click="handleCombShow">高级筛选<i
                        class="el-icon-right el-icon-d-arrow-right"
                        :class="isShowComb ? 'el-icon-d-arrow-right-down' : 'el-icon-d-arrow-right-right'"></i>
                </el-button>
            </div>
            <transition name="router-fade" mode="out-in">
                <div class="combine-zone" v-if="isShowComb">
                    <el-form-item label="日期范围：" class="formSearchMargin">
                        <el-radio-group class="radio-search" v-model="formDetail.date"
                                        @change="dateChange(formDetail.date)">
                            <el-radio label="">不限</el-radio>
                            <el-radio label="5">本月</el-radio>
                            <el-radio label="1">最近7天</el-radio>
                            <el-radio label="2">最近30天</el-radio>
                            <el-radio label="3">最近90天</el-radio>
                            <el-radio label="4">自定义</el-radio>
                        </el-radio-group>
                    </el-form-item>
                    <div class="cusCon">
                        <el-form-item label="自定义：" class="formSearchMargin cusForm" v-if="formDetail.date == '4'">
                            <el-date-picker class="margin_left40" size="mini" v-model="formDetail.startDate" type="date"
                                            value-format="yyyy-MM-dd" placeholder="选择开始时间">
                            </el-date-picker>
                            --
                            <el-date-picker class="margin_left10" size="mini" v-model="formDetail.endDate" type="date"
                                            value-format="yyyy-MM-dd" placeholder="选择结束时间"
                                            @change="endDateChange('formDetail','endDate')">
                            </el-date-picker>
                            <el-button type="primary" size="small" class="datesearchBtn" @click="btn_true">确定
                            </el-button>
                        </el-form-item>
                    </div>
                    <el-form-item label="业务类型：" class="formSearchMargin">
                        <el-radio-group class="radio-search wrap" v-model="formDetail.note"
                                        @change="noteChange(formDetail.note)">
                            <el-radio label="">不限</el-radio>
                            <el-radio label="充值">充值</el-radio>
                            <!--<el-radio label="充值手续费">充值手续费</el-radio>-->
                            <!--<el-radio label="外包费用">外包费用</el-radio>              -->
                            <!--<el-radio label="代发收入">代发收入</el-radio>-->
                            <!--<el-radio label="管理费">管理费</el-radio>-->
                            <!--<el-radio label="会员费">会员费</el-radio>-->
                            <!--<el-radio label="提现">提现</el-radio>  -->
                            <!--<el-radio label="提现手续费">提现手续费</el-radio>-->
                            <!--<el-radio label="外包手续费">外包手续费</el-radio>-->
                            <el-radio label="付款手续费">付款手续费</el-radio>
                            <el-radio label="系统使用费">系统使用费</el-radio>
                            <el-radio label="考勤管理费">考勤管理费</el-radio>
                            <el-radio label="保险费">保险费</el-radio>
                            <el-radio label="信息服务费">信息服务费</el-radio>
                        </el-radio-group>
                    </el-form-item>
                    <el-form-item label="收支分类：" class="formSearchMargin">
                        <el-radio-group class="radio-search" v-model="formDetail.type"
                                        @change="inOutTypeChange(formDetail.type)">
                            <el-radio label="">不限</el-radio>
                            <el-radio label="1">收入</el-radio>
                            <el-radio label="2">支出</el-radio>
                        </el-radio-group>
                    </el-form-item>
                </div>
            </transition>
        </el-form>
        <div class="exportMaster">
            <div class="exportItemCon">
                <div class="incomeContainer">收入：充值<span class="fontsizecolor">{{totalData.recharge || 0}}</span>元，
                    <!--              外包费用充值<span class="fontsizecolor">{{totalData.recharge || 0}}</span>元，-->
                    合计<span class="fontsizecolor">{{totalData.recharge || 0}}</span>元
                </div>
                <div class="spendingContainer">支出：
                    <span v-for="(val,index) in spendIngItemArray" :key="index">
              {{val.title}}<span class="fontsizecolor">{{totalData[val.itemFee] || 0}}</span>元，
            </span>
                    合计<span class="fontsizecolor">&nbsp;{{totalData.totalOut || 0}}&nbsp;</span>元
                </div>
            </div>
            <div>
                <el-button class="myplain-btn exportBtn" size="small" :disabled="isDisabled" @click="exportExcel">导出
                </el-button>
            </div>
        </div>
        <div class="table-box back-white">
            <el-table class="table-outline" :data="tableData" emptyText="暂无相关信息" style="width: 100%;">
                <el-table-column label="时间" prop="receiveTime" :formatter="timeFormatter"
                                 show-overflow-tooltip></el-table-column>
                <el-table-column label="业务类型" prop="note" show-overflow-tooltip></el-table-column>
                <el-table-column label="交易对象" prop="toUserName" :formatter="existFormatter"
                                 show-overflow-tooltip></el-table-column>
                <el-table-column label="收入" prop="inAmount" :formatter="moneyFormat"
                                 show-overflow-tooltip></el-table-column>
                <el-table-column label="支出" prop="outAmount" :formatter="moneyFormat"
                                 show-overflow-tooltip></el-table-column>
                <el-table-column label="期末余额（元）" prop="balance" :formatter="moneyFormat"
                                 show-overflow-tooltip></el-table-column>
                <el-table-column label="备注" prop="remark" :formatter="existFormatter"
                                 show-overflow-tooltip></el-table-column>
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
    import Interval from '../../../../common/interval.js'

    export default {
        data() {
            return {
                loading: false,
                isDisabled: false,
                total: 0,
                currentPage: 1,
                pageCount: 0,
                pageSize: 10,
                formDetail: {
                    date: '5',
                    note: '',
                    type: '',
                    startDate: '',
                    endDate: ''
                },
                tableData: [],
                totalData: {},
                spendIngItemArray: [
                    // {title: '充值手续费', itemFee: 'rechargeCharges'},
//            {  title:'外包费用充值手续费',itemFee:''  },
//            {  title:'外包费用',itemFee:'outsource'  },
//                     {title: '代发收入', itemFee: 'substituteWages'},
//                     {title: '管理费', itemFee: 'managementExpense'},
//            {  title:'会员费',itemFee:'membershipFee'  },
//                     {title: '提现', itemFee: 'cashWithdrawal'},
//                     {title: '提现手续费', itemFee: 'paymentFee'},
                    {title: '付款手续费', itemFee: 'payFee'},
                    {title: '考勤管理费', itemFee: 'attendanceFee'},
                    {title: '保险费', itemFee: 'insurance'},
                    {title: '系统使用费', itemFee: 'systemFee'},
                    {title: '信息服务费', itemFee: 'serviceFee'},
//            {  title:'外包手续费',itemFee:'outsourcingCharges'  },
                ],
                isShowComb: false,
                directlySearchContent: '',
                dateValidate: false,
            }
        },
        mounted() {
            this.getDataList() // 列表接口
            this.getSummaryData() // 汇总数据
        },
        methods: {
            getDataList() {
                let flag = this.formDetail.date;
                switch (flag) {
                    case '':
                        this.formDetail.endDate = '';
                        this.formDetail.startDate = '';
                        break;
                    case '1':
                        this.formDetail.endDate = Interval.getDay(0);
                        this.formDetail.startDate = Interval.getDay(-7);
                        break;
                    case '2':
                        this.formDetail.endDate = Interval.getDay(0);
                        this.formDetail.startDate = Interval.getDay(-30);
                        break;
                    case '3':
                        this.formDetail.endDate = Interval.getDay(0);
                        this.formDetail.startDate = Interval.getDay(-90);
                        break;
                    case '4':
                        break;
                    case '5':
                        this.formDetail.endDate = Interval.getDay(0)
                        this.formDetail.startDate = `${this.Moment(Date.now()).format('YYYY-MM')}-01`;
                        break;
                }
//        console.log( this.formDetail.date );
//        console.log( this.formDetail.endDate,this.formDetail.startDate );        
                // if (this.formDetail.endDate < this.formDetail.startDate) {
                //   return this.$message.error('结束日期不能早于开始日期!')
                // }
                let params = {
                    pageNum: this.currentPage,
                    pageSize: this.pageSize,
                    note: this.formDetail.note,
                    toUserName: this.formDetail.toUserName,
                    type: this.formDetail.type,
                    endDate: this.formDetail.endDate,
                    startDate: this.formDetail.startDate,
                    accountType: 1,
                }
                this.$api.getMyAccountDetail(params).then(res => {
                    let {data: layer1} = res;
                    let {data, respCode} = layer1;
                    if (respCode === 0) {
                        this.tableData = data.list;
                        this.pageCount = data.pages;
                        this.total = data.total;
                        if (data.list) {
                            this.isDisabled = false;
                        } else {
                            this.isDisabled = true;
                        }
                    }
                }).catch(err => {
                    console.log('err', err);
                })
            },
            handleCombShow() {
                this.isShowComb = !this.isShowComb;
            },
            endDateChange(form, item) {
                let start = this[form].startDate;
                let end = this[form][item];
                if (start && end) {
                    let startStamp = this.Moment(start).unix();
                    let endStamp = this.Moment(end).unix();
                    if (endStamp >= startStamp) {
                        this.dateValidate = true;
                    } else {
                        this.$message.error('结束日期不能早于开始日期!');
                        this.dateValidate = false;
                    }
                } else {
                    if (!start) {
                        this.dateValidate = false;
                        return this.$message.error('开始日期不能为空！');
                    }
                    if (!end) {
                        this.dateValidate = false;
                        return this.$message.error('结束日期不能为空！');
                    }
                    if ((!end) && (!start)) {
                        this.dateValidate = false;
                        return this.$message.error('开始日期和结束日期不能为空！');
                    }
                }
            },
            searchNow() {
                this.currentPage = 1;
                this.getDataList();
                this.getSummaryData();
            },
            getSummaryData() {
                // if (this.formDetail.endDate < this.formDetail.startDate) {
                //   return this.$message.error('结束日期不能早于开始日期!')
                // }
                let params = {
                    pageNum: this.currentPage,
                    pageSize: this.pageSize,
                    note: this.formDetail.note,
                    toUserName: this.formDetail.toUserName,
                    type: this.formDetail.type,
                    endDate: this.formDetail.endDate,
                    startDate: this.formDetail.startDate,
                    accountType: 1,
                }
                this.$api.selectSumAccountDetail(params).then(res => {
                    let {data: layer1} = res;
                    let {data, respCode} = layer1;
                    if (respCode === 0) {
                        if (data) {
                            this.totalData = data;
                        } else {
                            this.totalData = {}
                        }
                    }
                }).catch(err => {
                    console.log('err', err);
                })
            },
            handleCurrentChange(val) {
                this.currentPage = val
                this.getDataList();
            },
            btn_true() {
                console.log(this.dateValidate);
                this.endDateChange('formDetail', 'endDate');
                if (this.dateValidate) {
                    this.unifiedRequest();
                }
            },
            exportExcel() {
                let params = {
                    pageNum: this.currentPage,
                    pageSize: this.total,
                    note: this.formDetail.note,
                    toUserName: this.formDetail.toUserName,
                    type: this.formDetail.type,
                    endDate: this.formDetail.endDate,
                    startDate: this.formDetail.startDate,
                    accountType: 1,
                }
                const loading = this.$loading({
                    lock: true,
                    text: '正在导出excel表...',
                    spinner: 'el-icon-loading',
                    background: 'rgba(255, 255, 255, 0.9)'
                });
                this.$api.accountDetailExport(params).then(res => {
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
            timeFormatter(row, column, cellValue) {
                if (cellValue) {
                    return cellValue.substr(0, 16)
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
            existFormatter(row, column, cellValue) {
                if (cellValue) {
                    return cellValue;
                } else {
                    return '无'
                }
            },
            dateChange(val) {
                if (val) {
                    this.unifiedRequest();
                    if (val === '4') {
                        this.formDetail.endDate = '';
                        this.formDetail.startDate = '';
                    }
                } else {
                    this.unifiedRequest();
                }
            },
            noteChange() {
                this.unifiedRequest();
            },
            inOutTypeChange() {
                this.unifiedRequest();
            },
            unifiedRequest() {
                this.currentPage = 1;
                this.getDataList();
                this.getSummaryData();
            },
        },
    }
</script>
<style scoped lang="scss">
    .billDetailCon {
        background-color: #f2f2f5;

        .charge-btn {
            font-size: 12px;
            background-color: #ffefea !important;
            border: 1px solid #f7beb2;
            border-radius: 4px;
            text-align: center;
            line-height: 34px;
            width: 100px;
            height: 34px;
            box-sizing: border-box;
            color: #e9481c;
            cursor: pointer;
            margin-bottom: 20px;
        }

        .wrap {
            flex-wrap: wrap;
        }

        .search-zone {
            display: flex;
            align-items: center;
            justify-content: flex-start;
            flex-wrap: wrap;
            align-content: center;
            align-items: center;
            padding-top: 20px;
        }

        .searchMaster {
            width: 520px;
            margin-right: 20px;
            margin-bottom: 20px;
        }

        .comb-btn {
            margin-bottom: 20px;
        }

        .exportBtn {
            margin: 11px 0 11px 24px;
            width: 98px;
            color: #e9481c;
            background-color: #ffefea;
            border: 1px solid #f7beb2;
        }

        .combine-zone {
            border-top: 1px solid #EAEDF4;
            padding-bottom: 11px;
        }

        .exportMaster {
            background-color: #fff;
            border: 1px solid #E6E7EB;
            margin-top: 18px;
        }

        .exportItemCon {
            display: flex;
            flex-direction: row;
            flex-wrap: wrap;
            justify-content: flex-start;
            align-content: center;
            align-items: center;
            padding-left: 24px;
            padding-right: 24px;
            padding-top: 18px;
            border-bottom: 1px solid #E6E7EB;
            font-size: 12px;
            word-wrap: break-word;
        }

        .formSearchMargin {
            margin-bottom: 0;
        }

        .incomeContainer {
            margin-right: 80px;
            margin-bottom: 18px;
        }

        .spendingContainer {
            margin-bottom: 18px;
        }

        .datesearchBtn {
            margin-left: 15px;
        }

        .fontsizecolor {
            /*          color: #e84518;*/
        }
    }
</style>
<style lang="scss">
    .billDetailCon {
        .el-radio-group {
            height: 18px;
        }

        .searchMaster {
            .el-input__inner {
                width: 520px;
            }
        }

        .el-table .cell {
            text-align: center;
            padding-left: 10px;
        }

        .el-input__inner:focus {
            border-color: #DCDFE6;
        }

        .el-button.is-disabled {
            color: #C0C4CC !important;
            cursor: not-allowed !important;
            background-color: #FFFFFF !important;
            border-color: #EBEEF5 !important;
        }

        .combine-zone {
            .el-radio__label {
                font-size: 12px;
                padding-left: 0;
                vertical-align: -1px;
            }

            .el-form-item__label {
                line-height: 18px;
                margin-top: 12px;
                font-size: 12px;
            }

            .el-form-item__content {
                line-height: 18px;
                margin-top: 11px;
            }
        }

        .searchMaster {
            .el-input__prefix {
                top: -3px;
            }

            .el-input__inner {
                height: 34px;
            }
        }

        .cusForm {
            .el-form-item__label {
                height: 28px;
                line-height: 28px;
            }

            .el-form-item__content {
                /*                margin-top: 0;*/
            }
        }

        .el-radio-group {
            min-height: inherit;
        }
    }
</style>