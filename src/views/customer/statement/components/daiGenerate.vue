<template>
    <div>
        <el-form :model="form" label-width="100px" labelPosition="center">
            <el-form-item label="班务经理：" class="formSearchMargin topMargin">
                <el-radio-group class="radio-search" v-model="form.managerId" @change="managerIdChange('managerId')">
                    <el-radio label="">不限</el-radio>
                    <el-radio :label="item.id" v-for="item in manageIds" :key="item.id" :value="item.id">
                        {{item.nameAlias}}
                    </el-radio>
                </el-radio-group>
            </el-form-item>
            <el-form-item label="月份：" class="formSearchMargin">
                <el-radio-group class="radio-search" v-model="form.months" @change="monthsChange('months')">
                    <el-radio label="">不限</el-radio>
                    <el-radio label="1">自定义</el-radio>
                </el-radio-group>
            </el-form-item>
            <el-form-item label="自定义：" class="formSearchMargin dai-gn" v-if="form.months == '1'">
                <el-date-picker class="margin_left40" size="mini" v-model="form.startDate" type="month"
                                value-format="yyyy-MM" placeholder="选择开始时间" :picker-options="pickerOptions"
                                @change="startDateChange('startDate')">
                </el-date-picker>
                --
                <el-date-picker class="margin_left10" size="mini" v-model="form.endDate" type="month"
                                value-format="yyyy-MM" placeholder="选择结束时间" :picker-options="pickerOptions"
                                @change="endDateChange('endDate')">
                </el-date-picker>
                <el-button type="primary" size="small" class="datesearchBtn newbtn" @click="btn_jiekou">确定</el-button>
            </el-form-item>
        </el-form>
        <el-table :data="tableData" empty-text="暂无相关信息">
            <el-table-column label="班务经理" prop="managerName" show-overflow-tooltip align="center"
                             min-width="80"></el-table-column>
            <el-table-column label="月份" prop="yearMonthStr" show-overflow-tooltip align="center"
                             min-width="80"></el-table-column>
            <el-table-column label="操作" align="center" min-width="180">
                <template slot-scope="scope">
                    <el-button type="text" class="btn-icon" size="mini" @click="checkShengCheng(scope.row)"><i
                            class="btn_icon"></i>&nbsp;&nbsp;&nbsp;生成
                    </el-button>
                </template>
            </el-table-column>
        </el-table>
        <div class="pagination-container">
            <el-pagination class="pagebox" layout="prev, pager, next" @current-change="handleCurrentChange"
                           :current-page="currentPage" :page-count="pageCount" :page-size="pageSize">
            </el-pagination>
        </div>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                tableData: [],
                form: {
                    managerId: '',
                    months: '',
                    startDate: '',
                    endDate: ''
                },
                currentPage: 1,
                pageCount: 0,
                pageSize: 20,
                total: 0,
                manageIds: [],
                newArr: [],
                str: '',
                pickerOptions: {
                    disabledDate(time) {
                        return time.getTime() < new Date(2019, 2, 28);
                    },
                }
            }
        },
        watch: {
//        'form.managerId': function(val,old){
//            this.currentPage = 1
//            this.getData();
//        },
//        'form.months': function(val,old){  
//            if(val == ''){
//                this.currentPage = 1
//                this.getData()
//            }else if(val == '1'){
//                this.form.startDate = ''
//                this.form.endDate = ''
//            }
//        }
        },
        mounted() {
            this.getManageId()
            this.getData()
            this.getTotal()
        },
        methods: {
            btn_jiekou() {
                if (!this.form.startDate && !this.form.endDate) {
                    return this.$message.error('时段不能为空')
                } else if (!this.form.startDate) {
                    return this.$message.error('开始时间不能为空')
                } else if (!this.form.endDate) {
                    return this.$message.error('结束时间不能为空')
                } else if (this.form.startDate > this.form.endDate) {
                    return this.$message.error('结束时间不能早于开始时间')
                }
                this.currentPage = 1
                this.getData()
            },
            getData() {
                let getManagerId = localStorage.getItem('daiGenerateManagerId');
                if (getManagerId) {
                    this.form.managerId = +getManagerId;
                } else {
                    this.form.managerId = '';
                }
                let getMonth = localStorage.getItem('daiGenerateMonth');
                if (getMonth) {
                    this.form.months = getMonth;
                } else {
                    this.form.months = '';
                }
                if (this.form.months == '') {
                    this.form.startDate = '';
                    this.form.endDate = '';
                    localStorage.removeItem('daiGenerateStartDate');
                    localStorage.removeItem('daiGenerateEndDate');
                } else if (this.form.months == '1') {
                    let StartDate = localStorage.getItem('daiGenerateStartDate');
                    let EndDate = localStorage.getItem('daiGenerateEndDate');
                    if (EndDate) {
                        this.form.startDate = StartDate;
                        this.form.endDate = EndDate;
                    } else {
                        this.form.startDate = '';
                        this.form.endDate = '';
                        localStorage.removeItem('daiGenerateStartDate');
                    }
                }
                const params = {
                    pageNum: this.currentPage,
                    pageSize: this.pageSize,
                    managerId: this.form.managerId == '' ? null : this.form.managerId,
                    monthStart: this.form.startDate ? this.form.startDate.substr(0, 7) : '',
                    monthEnd: this.form.endDate ? this.form.endDate.substr(0, 7) : ''
                }
//            console.log(params)
                this.$api.profitQuery(params).then(res => {
//                console.log(res)
                    if (res.respCode == 0) {
                        if (res.data) {
                            this.tableData = res.data.list
                            this.pageCount = res.data.pages
                        }
                    }
                }).catch()
            },
            getTotal() {
                this.$api.profitWaitQueryCount().then(res => {
//                console.log(res)
                    if (res.respCode == 0) {
                        if (res.data) {
                            this.total = res.data
                            this.$emit('funcTotal', res.data)
                        }
                    }
                }).catch()
            },
            checkShengCheng(row) {
                console.log(row)
                this.newArr = []
                this.str = ''
//            console.log(row.yearMonthStr.split('-'))
                this.newArr = row.yearMonthStr.split('-')
                this.str = this.newArr[0] + '年' + this.newArr[1] + '月'
                console.log(this.str)
                if (row.count > 0) {
                    this.$message.error(`${this.str}${row.managerName}还有应付零工或应付班务经理或应收班务经理尚未付款,无法生成!`)
                } else if (row.count == 0) {
                    if (row.currentDate) {
                        this.$message.error(`需要按月份顺序生成，当前可生成的月份为${row.currentDate}`)
                    } else {
                        const {href} = this.$router.resolve({
                            name: 'daiCheckGenerate',
                            params: {
                                managerId: row.managerId,
                                month: row.yearMonthStr,
                                id: row.id,
                                managerName: row.managerName
                            }
                        })
                        window.open(href, '_blank')
                    }
                }
            },
            handleCurrentChange(val) {
                // console.log(val)
                this.currentPage = val
                this.getData()
            },
            getManageId() {
                let params = {
                    bindingStatus: -1
                }
                this.$api.getPmListCus(params).then(res => {
//                 console.log(res.data)
                    if (res.data) {
                        this.manageIds = res.data
                    }
                }).catch()
            },
            managerIdChange(str) {
                this.currentPage = 1;
                if (this.form[str]) {
                    localStorage.setItem('daiGenerateManagerId', this.form[str]);
                } else {
                    localStorage.removeItem('daiGenerateManagerId');
                }
                this.getData();
            },
            monthsChange(str) {
                this.currentPage = 1;
                if (this.form[str]) {
                    localStorage.setItem('daiGenerateMonth', this.form[str]);
                } else {
                    localStorage.removeItem('daiGenerateMonth');
                    localStorage.removeItem('daiGenerateStartDate');
                    localStorage.removeItem('daiGenerateEndDate');
                    this.getData();
                }
            },
            startDateChange(str) {
                if (this.form[str]) {
                    localStorage.setItem('daiGenerateStartDate', this.form[str]);
                } else {
                    localStorage.removeItem('daiGenerateStartDate');
                }
            },
            endDateChange(str) {
                if (this.form[str]) {
                    localStorage.setItem('daiGenerateEndDate', this.form[str]);
                } else {
                    localStorage.removeItem('daiGenerateEndDate');
                }
            },
        }
    }
</script>

<style scoped lang="scss">
    .radio-search {
        overflow: hidden;
        width: calc(100% - 30px);
        flex-direction: row;
        flex-wrap: wrap;
        height: auto !important;

        label {
            padding: 8px 0 5px;
        }
    }
    .dai-gn{
        padding-bottom: 10px;
    }
    .topMargin {
        margin-top: 15px;
    }

    .newbtn {
        margin-left: 15px;
    }

    .el-form-item {
        margin-bottom: 0 !important;
    }

    .btn_icon {
        display: inline-block;
        width: 17px;
        height: 18px;
        background-image: url('../../../../assets/images/btnshengcheng.png');
        background-size: cover;
    }
</style>
