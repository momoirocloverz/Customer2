<template>
    <div class="managementDetailCon" v-loading="loading" element-loading-text="正在导出excel表...">
        <el-form ref="formDetail" :model="formDetail" label-width="90px" labelPosition="left"
                 style="background-color:#fff;padding-left:20px;">
            <transition name="router-fade" mode="out-in">
                <div class="combine-zone">
                    <el-form-item label="日期范围：" class="formSearchMargin">
                        <el-radio-group class="radio-search sameHeight" v-model="formDetail.date"
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
                        <el-radio-group class="radio-search sameHeight" v-model="formDetail.note"
                                        @change="noteChange(formDetail.note)">
                            <el-radio label="">不限</el-radio>
                            <el-radio label="1">考勤管理费</el-radio>
                            <el-radio label="2">保险费</el-radio>
                            <el-radio label="3">系统使用费</el-radio>
                        </el-radio-group>
                    </el-form-item>
                    <el-form-item label="班务经理：" class="spMarTop formSearchMargin">
                        <el-radio-group class="radio-search flexWrap" v-model="formDetail.type"
                                        @change="inOutTypeChange(formDetail.type)">
                            <el-radio label="">不限</el-radio>
                            <el-radio :label="item.id" v-for="(item,index) in managerList" :key="index">
                                {{item.name}}
                            </el-radio>
                        </el-radio-group>
                    </el-form-item>
                </div>
            </transition>
        </el-form>
        <div class="exportMaster">
            <div class="exportItemCon">
                <div class="spendingContainer">支出：
                    <span v-for="(val,index) in spendIngItemArray" :key="index">
              {{val.title}}<span class="fontsizecolor">{{totalData[val.itemFee] || 0}}</span>元，
            </span>
                    合计<span class="fontsizecolor">&nbsp;{{totalData.sumTotal || 0}}&nbsp;</span>元
                </div>
            </div>
            <div>
                <el-button class="myplain-btn exportBtn" size="small" :disabled="isDisabled" @click="exportExcel">导出
                </el-button>
            </div>
        </div>
        <div class="table-box back-white">
            <el-table class="table-outline" :data="tableData" emptyText="暂无相关明细" style="width: 100%;">
                <el-table-column label="时间" prop="createdAt" :formatter="timeFormatter"></el-table-column>
                <el-table-column label="业务类型" prop="category"></el-table-column>
                <el-table-column label="班务经理" prop="manager" :formatter="existFormatter"></el-table-column>
                <el-table-column label="支出（元）" prop="payOut" :formatter="moneyFormat"></el-table-column>
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
                managerList: [],
                loading: false,
                isDisabled: true,
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
                    {title: '保险费', itemFee: 'insuranceFee'},
                    {title: '考勤管理费', itemFee: 'attendancesFee'},
                    {title: '系统使用费', itemFee: 'systemUseFee'},
                ],
                directlySearchContent: '',
                dateValidate: false,
            }
        },
        mounted() {
            this.getDataList();
            this.getManagerList();
            this.getSummary();
        },
        methods: {
            getSummary() {
                let params = {
                    pageNum: this.currentPage,
                    pageSize: this.pageSize,
                    note: (Number(this.formDetail.note) === 0) ? '' : Number(this.formDetail.note),
                    managerId: this.formDetail.type,
                    endDate: this.formDetail.endDate,
                    startDate: this.formDetail.startDate,
                    accountType: 0,
                }
                this.$api.managerFeeSum(params).then(res => {
                    let {data: layer1} = res;
                    let {data, respCode} = layer1;
                    if (respCode === 0) {
                        if (data) {
                            this.totalData = data;
                        } else {
                            this.totalData = {};
                        }
                    }
                }).catch(err => {
                    console.log('err', err);
                })
            },
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
                let params = {
                    accountType: 0,
                    pageNum: this.currentPage,
                    pageSize: this.pageSize,
                    note: (Number(this.formDetail.note) === 0) ? '' : Number(this.formDetail.note),
                    managerId: this.formDetail.type,
                    endDate: this.formDetail.endDate,
                    startDate: this.formDetail.startDate,
                };
                this.$api.managerFeeDetail(params).then(res => {
                    let {data: layer1} = res;
                    let {respCode, data} = layer1;
                    if (respCode === 0) {
                        if (data.list) {
                            if (data.list.length) {
                                this.isDisabled = false;
                                this.tableData = data.list;
                                this.total = data.total;
                            } else {
                                this.tableData = [];
                                this.isDisabled = true;
                                this.total = data.total;
                            }
                        } else {
                            this.isDisabled = true;
                            this.tableData = [];
                            this.total = data.total;
                        }
                    }
                }).catch(err => {
                    console.log('err', err);
                })
//       this.$api.getMyAccountDetail(params).then(res => {    
//          let { data:layer1 } = res;
//          let { data,respCode } = layer1;
//          if( respCode === 0 ){
//              this.tableData = data.list;
//              this.pageCount = data.pages;
//              this.total = data.total;
//          }
//        }).catch(err=>{
//              console.log('err',err);
//        })
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
            handleCurrentChange(val) {
                this.currentPage = val
                this.getDataList();
                this.getSummary();
            },
            btn_true() {
                console.log(this.dateValidate);
                this.endDateChange('formDetail', 'endDate');
                if (this.dateValidate) {
                    this.unifiedRequest();
                }
//      if(this.formDetail.startDate && !this.formDetail.endDate){
//      }else if(this.formDetail.startDate == '' && this.formDetail.endDate == ''){
//        return this.$message.error('开始日期和结束日期不能为空!')
//      }else if(!this.formDetail.startDate && this.formDetail.endDate){
//        return this.$message.error('开始日期不能为空!')
//      }
            },
            exportExcel() {
                let params = {
                    accountType: 0,
                    pageNum: this.currentPage,
                    pageSize: this.total,
                    note: (Number(this.formDetail.note) === 0) ? '' : Number(this.formDetail.note),
                    managerId: this.formDetail.type,
                    endDate: this.formDetail.endDate,
                    startDate: this.formDetail.startDate,
                }
                const loading = this.$loading({
                    lock: true,
                    text: '正在导出excel表...',
                    spinner: 'el-icon-loading',
                    background: 'rgba(255, 255, 255, 0.9)'
                });
                this.$api.managerFeeDetailExcel(params).then(res => {
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
                this.getSummary();
            },
            getManagerList() {
                // let ID = JSON.parse(localStorage.userInfo).customerId || '';
                //   let params = {
                //       customerId:ID
                //   }
                this.$api.getManagerList({pageSize: 0}).then(res => {
                    let {respCode, data} = res;
                    if (respCode === 0) {
                        this.managerList = data;
                    }
                }).catch(error => {
                    console.log(error);
                });
            },
        },
    }
</script>
<style scoped lang="scss">
    .managementDetailCon {
        background-color: #f2f2f5;

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
    .managementDetailCon {
        .flexWrap {
            display: flex;
            flex-direction: row;
            flex-wrap: wrap;
            justify-content: flex-start;
            align-content: center;
            align-items: center;
            min-height: 18px;
            height: auto;

            .el-radio {
                padding-bottom: 8px;
            }
        }

        .sameHeight {
            height: 18px;
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

        .cusForm {
            .el-form-item__label {
                height: 28px;
                line-height: 28px;
            }
        }

        .spMarTop {
            .el-form-item__label {
                margin-top: 0;
            }

            .el-form-item__content {
                margin-top: 1px;
            }

            margin-top: 12px;
        }

        .el-radio-group {
            min-height: inherit;
        }
    }
</style>