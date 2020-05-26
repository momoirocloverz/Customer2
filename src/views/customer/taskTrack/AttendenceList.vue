<template>
    <div class="attendceListTaskContainer back-white" v-loading="loading">
        <div class="filter-condition">
            <el-form :model="form" label-width="100px" labelPosition="left">
                <div class="search-zone">
                    <el-form-item class="formSearchMargin">
                        <el-input placeholder="根据下拉框选项输入关键字搜索" v-model="form.keyWord" size="mini"
                                  class="input-with-select select-input">
                            <el-select v-model="form.selectType" slot="append" placeholder="请选择">
                                <el-option label="任务名称" value="1"></el-option>
                                <el-option label="班务名称" value="2"></el-option>
                                <el-option label="零工姓名" value="3"></el-option>
                            </el-select>
                        </el-input>
                        <el-button type="primary" class="searchBtn" @click="handleSearch">搜索</el-button>
                        <el-button class="comb-btn removeHere" size="mini" type="text" @click="handleCombShow">高级筛选<i
                                class="el-icon-right el-icon-d-arrow-right"
                                :class="isShowComb ? 'el-icon-d-arrow-right-down' : 'el-icon-d-arrow-right-right'"></i>
                        </el-button>
                    </el-form-item>
                </div>
                <div v-show="isShowComb" class="combine-zone">
                    <el-form-item label="接单人：" class="formSearchMargin formSearchMarginTop">
                        <el-radio-group class="radio-search" v-model="form.belongtoItem"
                                        @change="belongtoItemChange(form.belongtoItem)">
                            <el-radio :label="item.receiverCusId" v-for="(item,index) in belongToList" :key="index">
                                {{item.name}}
                            </el-radio>
                        </el-radio-group>
                    </el-form-item>
                    <el-form-item label="结算方式：" class="formSearchMargin">
                        <el-radio-group class="radio-search" v-model="form.settlementType"
                                        @change="settlementTypeChange(form.settlementType)">
                            <el-radio label="">不限</el-radio>
                            <el-radio label="2">月结</el-radio>
                            <el-radio label="4">周结</el-radio>
                            <el-radio label="1">日结</el-radio>
                        </el-radio-group>
                    </el-form-item>
                    <el-form-item label="日期范围：" class="formSearchMargin">
                        <el-radio-group class="radio-search" v-model="dateStatus"
                                        @change="dateStatusChange(dateStatus)">
                            <el-radio label="1">不限</el-radio>
                            <el-radio label="4">自定义</el-radio>
                        </el-radio-group>
                    </el-form-item>
                    <div>
                        <el-form-item label="自定义：" class="formSearchMargin cusForm" v-if="dateStatus == '4'">
                            <el-date-picker size="mini" v-model="startDate" type="date" value-format="yyyy-MM-dd"
                                            placeholder="选择开始时间"></el-date-picker>
                            --
                            <el-date-picker class="margin_left10" size="mini" v-model="endDate" type="date"
                                            value-format="yyyy-MM-dd" placeholder="选择结束时间"
                                            @change="endDateChange"></el-date-picker>
                            <el-button type="primary" class="datesearchBtn" @click="btn_get">确定</el-button>
                        </el-form-item>
                    </div>
                </div>
            </el-form>
        </div>
        <div class="divs">
            <div class="allContainer">
                <span>合计：{{ total | existFilter}}条记录&nbsp;&nbsp;|&nbsp;&nbsp;</span>
                <span>{{ extraData.totalCusWorkHours | existFilter}}小时&nbsp;&nbsp;|&nbsp;&nbsp;</span>
                <span>{{ extraData.totalJian | existFilter}}件&nbsp;&nbsp;|&nbsp;&nbsp;</span>
                <span>{{ extraData.totalDai | existFilter}}袋&nbsp;&nbsp;|&nbsp;&nbsp;</span>
                <span>{{ extraData.totalChe | existFilter}}车&nbsp;&nbsp;|&nbsp;&nbsp;</span>
                <span>{{ extraData.totalDun | float2Format}}吨</span>
            </div>
            <div class="back-white btn-div flexable" style="justify-content: space-between;">
                <el-button class="primary-btn" size="mini" @click="handleexport" style="width:135px;"
                           :disabled="tableData.length == 0 ? true : false">导出考勤数据
                </el-button>
            </div>
        </div>
        <div class="table-box back-white">
            <el-table :data="tableData" empty-text="暂无相关考勤信息">
                <el-table-column label="姓名" prop="talentNameAlias" show-overflow-tooltip align="center" min-width="80">
                </el-table-column>
                <el-table-column label="工种" prop="industryName" align="center" min-width="80"></el-table-column>
                <el-table-column label="结算方式" prop="settlementType" :formatter="settlementFormatter" align="center"
                                 min-width="80">
                </el-table-column>
                <el-table-column label="任务名称" align="center" min-width="80">
                    <template v-slot="scope">
                        <div><span @click="toTaskDetail(scope.row)" class="specialText">{{scope.row.taskName}}</span>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column label="班务名称" align="center" min-width="80">
                    <template v-slot="scope">
                        <div><span @click="toClassTaskDetail(scope.row)"
                                   class="specialText">{{scope.row.classTaskName}}</span></div>
                    </template>
                </el-table-column>
                <el-table-column label="排班日期" :formatter="timeFormat" show-overflow-tooltip prop="schedulingDate"
                                 align="center" min-width="120"></el-table-column>
                <el-table-column label="班务经理" prop="managerName" align="center" min-width="80"></el-table-column>
                <el-table-column label="接单人" align="center" min-width="80" prop="receiverName"></el-table-column>
                <el-table-column label="上班时间" prop="customerStartTime" :formatter="startTimeFormatter" align="center"
                                 min-width="80"></el-table-column>
                <el-table-column label="下班时间" prop="customerEndTime" :formatter="endTimeFormatter" align="center"
                                 min-width="80"></el-table-column>
                <el-table-column label="工时" prop="customerWorkHours" :formatter="workHoursFormat" align="center"
                                 min-width="80"></el-table-column>
                <el-table-column label="产量" align="center" min-width="180" show-overflow-tooltip>
                    <template v-slot="scope">
                        {{scope.row.pieceSize | formatPieces}}
                    </template>
                </el-table-column>
            </el-table>
            <div class="pagination-container">
                <el-pagination class="pagebox" :total="total" layout="total , prev, pager, next, jumper"
                               @current-change="handleCurrentChange" :current-page="currentPage" :page-size="pageSize">
                </el-pagination>
            </div>
        </div>
        <!--
            <el-dialog :visible.sync="exportVisible" class="exportDialog">
              <export v-if="exportVisible" :incomeParams="getParams" @shut="shutExport"/>
            </el-dialog>
        -->
    </div>
</template>
<script>
    import Export from './Export.vue'
    import Util from '../../../common/util'

    export default {
        name: 'AttendenceList',
        components: {Export},
        data() {
            return {
                loading: false,
                isShowComb: false,
                dateStatus: '1',
                belongToList: [],
                exportVisible: false,
                startDate: '',
                endDate: '',
                form: {
                    settlementType: '',
                    keyWord: '',
                    date: '',
                    selectType: '1',
                    belongtoItem: '',
                },
                tableData: [],
                currentPage: 1,
                pageSize: 10,
                total: 0,
                customerManager: [],
                totalData: {},
                dateValidate: false,
                extraData: {},
                getParams: {},
            }
        },
        filters: {
            formatPieces(val) {
                if (val) {
                    return Util.formatPieceSize(val)
                } else {
                    return '无'
                }
            },
            existFilter(val) {
                if (val) {
                    return val
                } else {
                    return 0;
                }
            },
            float2Format(cellValue) {
                if ((toString.call(cellValue) === '[object Null]') || (toString.call(cellValue) === '[object Undefined]')) {
                    return 0;
                } else {
                    let fix = (Math.round(+cellValue + 'e' + 2) / Math.pow(10, 2)).toFixed(2);
                    return fix;
                }
            },
            formatState(val) {
                if (val == 1) {
                    return '(待审核)'
                } else {
                    return ''
                }
            },
        },
        mounted() {
            this.handleGetTaskBelongToList();
            this.getList();
        },
        methods: {
            toTaskDetail(row) {
                const {href} = this.$router.resolve({
                    name: "taskTrackDetail",
                    query: {
                        id: row.assignmentInfoId,
                    }
                });
                window.open(href, "_blank");
            },
            toClassTaskDetail(row) {
                const {href} = this.$router.resolve({
                    name: "taskTrackClassDetail",
                    query: {
                        classTaskId: row.classTaskId,
                    }
                });
                window.open(href, "_blank");
            },
            timeFormat(row, column, cellValue, index) {
                let res = '永久';
                if (cellValue) {
                    res = this.Moment(cellValue).format("YYYY-MM-DD HH:mm");
                } else {
                    res = '永久'
                }
                return res;
            },
            workHoursFormat(row, column, cellValue, index) {
                if ((toString.call(cellValue) === '[object Null]') || (toString.call(cellValue) === '[object Undefined]')) {
                    return 0;
                } else {
                    let fix = (Math.round(+cellValue + 'e' + 1) / Math.pow(10, 1)).toFixed(1);
                    return fix;
                }
            },
            handleGetTaskBelongToList() {
                this.$api.receiverList().then(res => {
                    let {respCode, data} = res;
                    if (respCode === 0) {
                        let tempArr = data || [];
                        this.belongToList = [{receiverCusId: '', name: '不限'}, ...tempArr];
                    }
                }).catch(err => {
                    console.log('err', err);
                });
            },
            belongtoItemChange(val) {
                console.log(val);
                this.resetRequest();
            },
            resetRequest() {
                this.currentPage = 1;
                this.getList();
            },
            endDateChange() {
                let start = this.startDate;
                let end = this.endDate;
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
            btn_get() {
                this.endDateChange();
                if (this.dateValidate) {
                    this.resetRequest();
                }
            },
            handleCombShow() {
                this.isShowComb = !this.isShowComb
            },
            formatCusTimeString(val) {
                if (val) {
                    return val.substring(0, 5)
                } else {
                    return '无'
                }
            },
            startTimeFormatter(row, column, cellValue, index) {
                return (row.customerStartDate == row.schedulingDate ? '当日' : '次日') + (this.formatCusTimeString(row.customerStartTime))
            },
            endTimeFormatter(row, column, cellValue, index) {
                return (row.customerEndDate == row.schedulingDate ? '当日' : '次日') + (this.formatCusTimeString(row.customerEndTime))
            },
            settlementFormatter(row, column, cellValue, index) {
                switch (cellValue) {
                    case 1:
                        return '日结';
                        break;
                    case 2:
                        return '月结';
                        break;
                    case 4:
                        return '周结';
                        break;
                }
            },
            handleSearch() {
                this.resetRequest();
            },
            shutExport() {
                this.exportVisible = false;
            },
            handleexport() {
                let params = this.analyseParams();

                const loading = this.$loading({
                    lock: true,
                    text: '正在导出excel表...',
                    spinner: 'el-icon-loading',
                    background: 'rgba(255, 255, 255, 0.9)'
                });

                this.$api.punchDataExport(params).then(res => {
                    let {data: layer1} = res;
                    let {respCode, data} = layer1;
                    if (respCode === 0) {
                        window.open(data);
                        loading.close();
                    } else {
                        loading.close();
                    }
                }).catch(err => {
                    setTimeout(() => {
                        loading.close();
                    }, 5000);
                    console.log('err', err);
                })
            },
            analyseParams() {
                let params = {
                    pageNum: this.currentPage,
                    pageSize: this.pageSize,
                    receiverCusId: this.form.belongtoItem,
                    settlementType: this.form.settlementType,
                    startDate: this.startDate,
                    endDate: this.endDate,
                };
                let selectType = this.form.selectType;
                switch (selectType) {
                    case '1':
                        params.taskName = this.form.keyWord;
                        break;
                    case '2':
                        params.classTaskName = this.form.keyWord;
                        break;
                    case '3':
                        params.talentNameAlias = this.form.keyWord;
                        break;
                }
                return params;
            },
            getList() {
                let params = this.analyseParams();
                this.$api.punchData(params).then(res => {
                    let {data: layer1} = res;
                    let {respCode, data} = layer1;
                    if (respCode === 0) {
                        this.tableData = data.list || [];
                        this.total = data.total;
                        this.extraData = data.extraData;
                    }
                }).catch(err => {
                    console.log('err', err);
                })
            },
            handleCurrentChange(val) {
                this.currentPage = val
                this.getList()
            },
            dateStatusChange(val) {
                switch (val) {
                    case '1':
                        this.startDate = '';
                        this.endDate = '';
                        this.resetRequest();
                        break;
                    case '4':
                        break;
                }
            },
            settlementTypeChange(val) {
                this.resetRequest();
            },
        },
    }
</script>
<style lang="scss" scoped>
    .attendceListTaskContainer {
        .removeHere {
            margin-left: 0;
            vertical-align: 2px;
        }

        .specialText {
            color: #E9481C;
            cursor: pointer;
        }
    }
</style>
<style lang="scss">
    .attendceListTaskContainer {
        .el-table {
            .cell {
                text-align: center;
                padding-left: 10px;
            }
        }

        .searchBtn {
            vertical-align: 2px;
        }

        .divs {
            border-top: 1px solid #E6E7EB;
            border-bottom: 1px solid #E6E7EB;

            .btn-div {
                height: 57px;
                border-top: 0 !important;
            }

            .allContainer {
                padding: 15px 0 15px 24px;
                border-bottom: 1px solid #E6E7EB;
                font-size: 12px;
                color: #4D4D4D;
            }
        }

        .exportDialog {
            .el-dialog {
                position: absolute;
                left: 0;
                right: 0;
                margin: auto !important;
                top: 0;
                bottom: 0;
                width: 520px;
                height: 250px;
            }
        }
    }
</style>