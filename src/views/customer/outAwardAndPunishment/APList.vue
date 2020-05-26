<template>
    <div class="g-a-p-list" v-loading="loading" :element-loading-text="loadingText">
        <div class="back-white" style="margin-bottom: 12px;">
            <search-bar combCondition="true" :showSelect="true" slectPlaceholder="奖惩对象" :shusOptions="shusOptions"
                        @handleSearch="handleSearch" @handleSelect="handleSelect" placeholder="根据下拉框选项输入关键字搜索">
                <el-form ref="rulesForm" label-width="100px" labelPosition="left">
                    <el-form-item label="收入批次范围:" class="formSearchMargin formSearchMarginTop">
                        <el-radio-group class="radio-search" v-model="incomeTimeRange" @change="handleDateChange">
                            <el-radio label="">不限</el-radio>
                            <el-radio :label="1">本月</el-radio>
                            <el-radio :label="2">最近7天</el-radio>
                            <el-radio :label="3">最近30天</el-radio>
                            <el-radio :label="4">最近90天</el-radio>
                            <el-radio :label="5">自定义</el-radio>
                        </el-radio-group>
                    </el-form-item>
                    <el-form-item v-if="incomeTimeRange===5" class="formSearchMargin formSearchMarginTop">
                        <el-date-picker
                                v-model="dateValueRecord"
                                type="daterange"
                                range-separator="至"
                                start-placeholder="开始日期"
                                end-placeholder="结束日期">
                        </el-date-picker>
                        <el-button @click="handleSearchOwnDateRecord">确 定</el-button>
                    </el-form-item>
                    <el-form-item label="提交日期:" class="formSearchMargin">
                        <el-radio-group class="radio-search" v-model="submissionDate" @change="handleDateChangeSubmit">
                            <el-radio label="">不限</el-radio>
                            <el-radio :label="1">本月</el-radio>
                            <el-radio :label="2">最近7天</el-radio>
                            <el-radio :label="3">最近30天</el-radio>
                            <el-radio :label="4">最近90天</el-radio>
                            <el-radio :label="5">自定义</el-radio>
                        </el-radio-group>
                    </el-form-item>
                    <el-form-item v-if="submissionDate===5" class="formSearchMargin formSearchMarginTop">
                        <el-date-picker
                                v-model="dateValueSubmit"
                                type="daterange"
                                range-separator="至"
                                start-placeholder="开始日期"
                                end-placeholder="结束日期">
                        </el-date-picker>
                        <el-button @click="handleSearchOwnDateSubmit">确 定</el-button>
                    </el-form-item>
                    <el-form-item label="奖惩类型:" class="formSearchMargin">
                        <el-radio-group class="radio-search" v-model="dicVal" @change="handleDicValChange"
                                        style="width: 100%;display:flex;flex-wrap: wrap;">
                            <el-radio v-for="it,i in APList" :key="i" :label='it.dicVal'>{{it.dicName}}</el-radio>
                        </el-radio-group>
                    </el-form-item>
                    <el-form-item label="奖惩状态:" class="formSearchMargin">
                        <el-radio-group class="radio-search" v-model="status" @change="handleChangeStatus">
                            <el-radio label="">不限</el-radio>
                            <el-radio :label="1">待审批</el-radio>
                            <el-radio :label="2">已通过</el-radio>
                            <el-radio :label="3">已驳回</el-radio>
                            <el-radio :label="4">已撤回</el-radio>
                            <el-radio :label="5">已撤销</el-radio>
                        </el-radio-group>
                    </el-form-item>
                </el-form>
            </search-bar>
        </div>
        <div class="table-box back-white">
            <div class="flex-between pl20 pr20 pt10 pb10">
                <el-button class="primary-btn" size="mini" :disabled="rewardAndPunishList.length === 0" @click="exportData()">导出数据</el-button>
            </div>

            <el-table :data="rewardAndPunishList" empty-text="暂无相关信息" v-loading="loading">
                <el-table-column
                        align="center"
                        label="奖惩对象"
                        prop="talentName"
                        show-overflow-tooltip
                        min-width="80">
                </el-table-column>
                <el-table-column
                        align="center"
                        label="奖惩金额"
                        prop="amount"
                        show-overflow-tooltip
                        min-width="80">
                </el-table-column>
                <el-table-column
                        align="center"
                        label="奖惩类型"
                        prop="type"
                        show-overflow-tooltip
                        min-width="80">
                    <template v-slot="scope">
                        {{APMap[scope.row.type]}}
                    </template>
                </el-table-column>
                <el-table-column
                        label="奖惩事项"
                        align="center"
                        prop="note"
                        show-overflow-tooltip
                        min-width="100">
                </el-table-column>
                <el-table-column
                        align="center"
                        label="所属排班"
                        prop="schedulingName"
                        show-overflow-tooltip
                        min-width="180">
                </el-table-column>
                <el-table-column
                        label="奖惩收入批次"
                        align="center"
                        prop="batchNumber"
                        show-overflow-tooltip
                        min-width="100">
                    <template v-slot="scope">
                        {{scope.row.batchNumber+payTypeMap[scope.row.payType]}}
                    </template>
                </el-table-column>
                <el-table-column
                        align="center"
                        label="提交人"
                        prop="submitter"
                        show-overflow-tooltip
                        min-width="100">
                </el-table-column>
                <el-table-column
                        align="center"
                        label="审批人"
                        prop="approval"
                        show-overflow-tooltip
                        min-width="100">
                </el-table-column>
                <el-table-column
                        label="提交日期"
                        align="center"
                        prop="submitDate"
                        show-overflow-tooltip
                        min-width="100">
                </el-table-column>
                <el-table-column
                        label="状态"
                        prop="status"
                        align="center"
                        show-overflow-tooltip
                        min-width="100">
                    <template v-slot="scope">
                        {{statusMap[scope.row.status]}}
                    </template>
                </el-table-column>
            </el-table>
            <div class="pagination-container" v-if="params.total!=0">
                <el-pagination class="pagebox" layout="total , prev, pager, next, jumper" :total="params.total"
                               :current-page.sync="params.pageNum" @current-change="handleCurrentChange"
                               :page-size="params.pageSize">
                </el-pagination>
            </div>
        </div>
    </div>
</template>

<script>
    import SearchBar from '@/components/SearchBar';
    import moment from 'moment';

    const getBusinessType = (function () {
        const DateMap = {
            currentMonth: function () {
                return moment().startOf('month').format('YYYY-MM-DD');
            },
            last7: function (date) {
                return moment().subtract('days', 6).format('YYYY-MM-DD');
            },
            last30: function (date) {
                return moment().subtract('days', 29).format('YYYY-MM-DD');
            },
            last90: function (date) {
                return moment().subtract('days', 89).format('YYYY-MM-DD');
            }
        };

        return {
            dateClac: function (dateType, date) {
                return DateMap[dateType] && DateMap[dateType](date)
            },
            addStrategy: function (dateType, fn) {		// 注册新计算方式
                if (DateMap[dateType]) return
                DiscountMap[dateType] = fn
            }
        };
    })();

    export default {
        name: 'myTask',
        components: {SearchBar},
        data() {
            return {
                payTypeMap: {
                    [1]: '外包费用',
                    [2]: '代发收入'
                },
                dateValueSubmit: null,
                submitTime: {
                    startTime: getBusinessType.dateClac('currentMonth'),
                    endTime: moment().format('YYYY-MM-DD')
                },
                dateValueRecord: null,
                recordTime: {
                    startTime: getBusinessType.dateClac('currentMonth'),
                    endTime: moment().format('YYYY-MM-DD')
                },
                APMap: {},
                APList: [],
                statusMap: {
                    [1]: '待审批',
                    [2]: '已同意',
                    [3]: '已驳回',
                    [4]: '已撤回',
                    [5]: '已撤销'
                },
                shusOptions: [{
                    value: 1,
                    label: '奖惩对象'
                }, {
                    value: 2,
                    label: '审批人'
                }, {
                    value: 3,
                    label: '提交人'
                }
                ],
                selectOption: 1,
                incomeTimeRange: 1,
                submissionDate: 1,
                submitter: '',
                approval: '',
                talentName: '',
                pitchTaskName: '',
                showAddClassForm: false,
                keyword: '',
                ownCustomer: '',
                settlement: '',
                dicVal: '',
                status: '',
                params: {
                    total: 0,
                    pageSize: 20,
                    pageNum: 1,
                },
                loading: false,
                rewardAndPunishList: [],
                loadingText:'加载中...'
            }
        },
        mounted() {
            this.handleGetRewardAndPunishList();
            this.handleGetByCodeAndLevel();
        },
        methods: {
            handleChangeStatus() {
                this.params.pageNum = 1;
                this.handleGetRewardAndPunishList();
            },
            handleDicValChange() {
                this.params.pageNum = 1;
                this.handleGetRewardAndPunishList();
            },
            handleSearchOwnDateSubmit() {
                if (this.dateValueSubmit) {
                    this.submitTime.startTime = moment(this.dateValueSubmit[0]).format('YYYY-MM-DD');
                    this.submitTime.endTime = moment(this.dateValueSubmit[1]).format('YYYY-MM-DD');
                    this.params.pageNum = 1;
                    this.handleGetRewardAndPunishList();
                } else {
                    this.$message({
                        message: '请选择日期',
                        type: 'warning'
                    });
                }
            },
            handleDateChangeSubmit(val) {
                if (val === 1) {
                    this.submitTime.startTime = getBusinessType.dateClac('currentMonth');
                    this.submitTime.endTime = moment().format('YYYY-MM-DD');
                } else if (val === 2) {
                    this.submitTime.startTime = getBusinessType.dateClac('last7');
                    this.submitTime.endTime = moment().format('YYYY-MM-DD');
                } else if (val === 3) {
                    this.submitTime.startTime = getBusinessType.dateClac('last30');
                    this.submitTime.endTime = moment().format('YYYY-MM-DD');
                } else if (val === 4) {
                    this.submitTime.startTime = getBusinessType.dateClac('last90');
                    this.submitTime.endTime = moment().format('YYYY-MM-DD');
                } else if (val === '') {
                    this.submitTime.startTime = '';
                    this.submitTime.endTime = '';
                }
                if (val !== 5) {
                    this.params.pageNum = 1;
                    this.handleGetRewardAndPunishList();
                }
            },
            handleSearchOwnDateRecord() {
                if (this.dateValueRecord) {
                    this.params.pageNum = 1;
                    this.recordTime.startTime = moment(this.dateValueRecord[0]).format('YYYY-MM-DD');
                    this.recordTime.endTime = moment(this.dateValueRecord[1]).format('YYYY-MM-DD');
                    this.handleGetRewardAndPunishList();
                } else {
                    this.$message({
                        message: '请选择日期',
                        type: 'warning'
                    });
                }
            },
            handleDateChange(val) {
                if (val === 1) {
                    this.recordTime.startTime = getBusinessType.dateClac('currentMonth');
                    this.recordTime.endTime = moment().format('YYYY-MM-DD');
                } else if (val === 2) {
                    this.recordTime.startTime = getBusinessType.dateClac('last7');
                    this.recordTime.endTime = moment().format('YYYY-MM-DD');
                } else if (val === 3) {
                    this.recordTime.startTime = getBusinessType.dateClac('last30');
                    this.recordTime.endTime = moment().format('YYYY-MM-DD');
                } else if (val === 4) {
                    this.recordTime.startTime = getBusinessType.dateClac('last90');
                    this.recordTime.endTime = moment().format('YYYY-MM-DD');
                } else if (val === '') {
                    this.recordTime.startTime = '';
                    this.recordTime.endTime = '';
                }
                if (val !== 5) {
                    this.params.pageNum = 1;
                    this.handleGetRewardAndPunishList();
                }
            },
            handleGetByCodeAndLevel() {
                this.$api.getByCodeAndLevel().then(res => {
                    res.data && res.data.map(it => {
                        this.APMap = {
                            ...this.APMap,
                            [it.dicVal]: it.dicName
                        }
                    });
                    if (res.data) {
                        let $APList = res.data.map(it => {
                            return {
                                dicVal: it.dicVal,
                                dicName: it.dicName
                            }
                        });
                        this.APList = [{dicVal: "", dicName: "不限"}, ...$APList];
                    }

                })
            },
            handleSelect(val) {
                this.selectOption = val;
            },
            handleSearch(val) {
                this.submitter = val;
                this.approval = val;
                this.talentName = val;
                this.params.pageNum = 1;
                this.handleGetRewardAndPunishList();
            },
            handleGetRewardAndPunishList() {
                const {pageNum, pageSize} = this.params;
                const {submitter, approval, talentName, recordTime, submitTime, dicVal, status} = this;
                const params = {
                    pageNum,
                    pageSize,
                    submitter,
                    approval,
                    talentName,
                    recordStartDate: recordTime.startTime,
                    recordEndDate: recordTime.endTime,
                    submitStartDate: submitTime.startTime,
                    submitEndDate: submitTime.endTime,
                    submitType: dicVal,
                    showOutsourcing: true,
                    status
                };
                switch (this.selectOption) {
                    case 1:
                        delete params.submitter;
                        delete params.approval;
                        break;
                    case 2:
                        delete params.submitter;
                        delete params.talentName;
                        break;
                    case 3:
                        delete params.approval;
                        delete params.talentName;
                        break;
                    default:
                        delete params.submitter;
                        delete params.approval;
                        break;
                }
                this.loadingText= '加载中...'
                this.loading = true;
                this.$api.getRewardAndPunishList(params).then(res => {
                    this.rewardAndPunishList = res.data.data.list || [];
                    this.params.total = res.data.data.total || 0;
                    this.loading = false;
                })
            },
            exportData(){
                const {pageNum,pageSize} = this.params;
                const { submitter,approval,talentName,recordTime,submitTime,dicVal,status} = this;
                const params = {
                    pageNum,
                    pageSize,
                    submitter,
                    approval,
                    talentName,
                    recordStartDate:recordTime.startTime,
                    recordEndDate:recordTime.endTime,
                    submitStartDate:submitTime.startTime,
                    submitEndDate:submitTime.endTime,
                    submitType:dicVal,
                    showOutsourcing: true,
                    status
                };
                switch (this.selectOption){
                    case 1:
                        delete params.submitter;
                        delete params.approval;
                        break;
                    case 2:
                        delete params.submitter;
                        delete params.talentName;
                        break;
                    case 3:
                        delete params.approval;
                        delete params.talentName;
                        break;
                    default:
                        delete params.submitter;
                        delete params.approval;
                        break;
                }
                this.loadingText= '正在导出excel表...'
                this.loading = true;
                this.$api.getRewardAndPunishListExport(params).then(res=>{
                    console.log(res)
                    if (res.data.data) {
                        window.open(res.data.data)
                    }
                }).catch(err=>{

                }).finally(()=>{
                    setTimeout(()=>{
                        this.loading = false
                    },500)
                })
            },
            handleCurrentChange(val) {
                this.params.pageNum = val;
                this.handleGetRewardAndPunishList();
            }
        }
    }
</script>

<style lang="scss" scope>

</style>
