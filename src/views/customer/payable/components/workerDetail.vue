<template>
    <div style="background-color:#f2f2f5;" class="supermanCon" v-loading="loading" :element-loading-text="loadingText">
        <div v-show="isShowComb" class="filter-condition bg-fff pb20">
            <el-form ref="formDetail" :model="formDetail" label-width="100px" labelPosition="left"
                     style="background-color:white;padding-left:20px;padding-bottom: 15px">
                <div class="pt15 pb15 linebdb mb10 f14 fs-bold">选择筛选条件</div>
                <div class="pt5">
                    <el-form-item label="选择班务：" class="formSearchMargin formSearchMarginTop">
                        <div class="f12 co-999 pl10 pb5 ">
                            可多选,不选查所有
                        </div>
                    </el-form-item>
                    <el-form-item label="" class="formSearchMargin formSearchMarginTop select-new-307">
                        <div class="select-el-wrap pl10 pb20">
                            <span class="f12">进行中</span>
                            <el-select class="ml20" v-model="taskId" filterable multiple remote reserve-keyword placeholder="请输入关键字并选择">
                                <el-option
                                        v-for="item in taskingList"
                                        :key="item.classTaskId"
                                        :label="item.classTaskName"
                                        :value="item.classTaskId">
                                </el-option>
                            </el-select>
                        </div>
                        <div class="select-el-wrap pl50 pb20">
                            <span class="f12">已结束</span>
                            <el-select class="ml20" v-model="taskId2" filterable multiple remote reserve-keyword placeholder="请输入关键字并选择">
                                <el-option
                                        v-for="item in taskedList"
                                        :key="item.classTaskId"
                                        :label="item.classTaskName"
                                        :value="item.classTaskId">
                                </el-option>
                            </el-select>
                        </div>
                    </el-form-item>
                    <el-form-item label="选择零工：" class="formSearchMargin">
                        <el-row class="pl10">
                            <el-col :span="12">
                                <el-autocomplete
                                        class="inline-input"
                                        v-model="formDetail.talentName"
                                        :fetch-suggestions="querySearch"
                                        placeholder="输入零工姓名"
                                        :trigger-on-focus="false"
                                        @select="handleSelect"
                                ></el-autocomplete>
                            </el-col>
                        </el-row>
                    </el-form-item>
                    <el-form-item label="日期范围：" class="formSearchMargin" style="margin-top:15px;font-size:12px;">
                        <el-radio-group class="radio-search" v-model="formDetail.date">
                            <el-radio label="">不限</el-radio>
                            <el-radio label="5">本月</el-radio>
                            <el-radio label="1">最近7天</el-radio>
                            <el-radio label="2">最近30天</el-radio>
                            <el-radio label="3">最近90天</el-radio>
                            <el-radio label="4">自定义</el-radio>
                        </el-radio-group>
                    </el-form-item>
                    <el-form-item label="自定义：" class="formSearchMargin" v-if="formDetail.date == '4'">
                        <el-date-picker class="" size="mini" v-model="formDetail.startDate" type="date"
                                        value-format="yyyy-MM-dd" placeholder="选择开始时间">
                        </el-date-picker>
                        --
                        <el-date-picker class="margin_left10" size="mini" v-model="formDetail.endDate" type="date"
                                        value-format="yyyy-MM-dd" placeholder="选择结束时间">
                        </el-date-picker>
                        <!--<el-button type="primary" size="small" class="datesearchBtn" @click="btn_true">确定</el-button>-->
                    </el-form-item>
                    <el-form-item label="结算方式：" class="formSearchMargin">
                        <el-radio-group style="display: flex;" class="radio-search" v-model="formDetail.settlementType">
                            <el-radio label="">不限</el-radio>
                            <el-radio label="2">月结</el-radio>
                            <el-radio label="4">周结</el-radio>
                            <el-radio label="1">日结</el-radio>
                        </el-radio-group>
                    </el-form-item>
                    <el-form-item label="状态：" class="formSearchMargin">
                        <el-radio-group style="display: flex;" class="radio-search" v-model="formDetail.payStatus">
                            <el-radio label="">不限</el-radio>
                            <!--<el-radio label="1">待生成</el-radio>-->
                            <el-radio label="1">待付款</el-radio>
                            <el-radio label="2">已付款</el-radio>
                        </el-radio-group>
                    </el-form-item>
                    <el-form-item label="工种：" class="formSearchMargin">
                        <el-select class="mt5" v-model="formDetail.industryList" multiple placeholder="请选择">
                            <el-option
                                    v-for="item in workerGather"
                                    :key="item.skillValue"
                                    :label="item.skillName"
                                    :value="item.skillValue">
                            </el-option>
                        </el-select>
                        <div class="co-999 f12">可多选,不选查所有</div>
                    </el-form-item>
                </div>
            </el-form>
            <div class="tc">
                <el-button @click="queryList()" type="primary">查询</el-button>
            </div>
        </div>
        <div v-show="!isShowComb" style="background-color:white;border:1px solid #E6E7EB;margin-top:18px;">
            <div style="padding:0 24px 0 24px;display:flex;justify-content: space-between;border-bottom: 1px solid #E6E7EB;height:50px;line-height:50px;font-size:12px;">
                <div>
                    共<span class="fontsizecolor">&nbsp;{{total || 0}}&nbsp;</span>条记录，
                    合计<span class="fontsizecolor">&nbsp;{{moreTotal.totalWorkHours || 0}}&nbsp;</span>小时，
                    <span class="fontsizecolor">&nbsp;{{moreTotal.totalJian || 0}}&nbsp;</span>件，
                    <span class="fontsizecolor">&nbsp;{{moreTotal.totalDai || 0}}&nbsp;</span>袋，
                    <span class="fontsizecolor">&nbsp;{{moreTotal.totalChe || 0}}&nbsp;</span>车，
                    <span class="fontsizecolor">&nbsp;{{moreTotal.totalDun || 0}}&nbsp;</span>吨，
                    合计金额<span class="fontsizecolor">&nbsp;{{moreTotal.totalAmount | moneyFormat}}&nbsp;</span>元
                </div>
                <div style="color:#5c5c5c;cursor:pointer;" @click="goToNotProceedCheckWorker" v-if="notTotal != 0">
                    <span style="color:#e84518">{{notTotal}}个排班未结算</span>
                    <i style="color:#e84518;font-weight: bold;" class="el-icon-arrow-right"></i>
                </div>
            </div>
            <div class="pr20 pt5 pb5" style="display:flex;justify-content: space-between;">
                <el-button class="myplain-btn" size="small" style="margin:6px 0 6px 24px;width:98px;"
                           :disabled="isDisabled"
                           @click="exportExcel">导出
                </el-button>
                <el-button class="primary-btn" size="mini" style="margin:6px 0 6px 24px;min-width:98px;"
                           @click="queryRefresh()">重新查询
                </el-button>
            </div>
        </div>
        <div v-show="!isShowComb" class="table-box back-white">
            <el-table class="table-outline" :data="tableData" emptyText="暂无相关明细" style="width: 100%;">
                <el-table-column label="日期" prop="recordDate" align="center" min-width="90"></el-table-column>
                <el-table-column label="姓名" prop="realNameAlias" align="center" min-width="80"></el-table-column>
                <el-table-column label="性别" prop="sexName" show-overflow-tooltip align="center"
                                 min-width="80"></el-table-column>
                <el-table-column label="班务" prop="taskName" align="center" min-width="80"
                                 :formatter="taskNameFormatter"></el-table-column>
                <el-table-column label="工种" prop="industryName" align="center" min-width="80"
                                 :formatter="industryNameFiliters"></el-table-column>
                <el-table-column label="结算方式" prop="settlementTypeName" align="center" min-width="80"></el-table-column>
                <el-table-column label="签到时间" prop="workStartTime" align="center" min-width="80"
                                 :formatter="industryNameFiliters"></el-table-column>
                <el-table-column label="签退时间" prop="workEndTime" align="center" min-width="80"
                                 :formatter="industryNameFiliters"></el-table-column>
                <el-table-column label="工时" prop="workHours" align="center" min-width="80"
                                 :formatter="workHoursFiliters"></el-table-column>
                <el-table-column label="产量" show-overflow-tooltip align="center" min-width="80">
                    <template v-slot="scope">
            <span>
              <!-- {{scope.row.jian ? scope.row.jian+'件、' : '' }} -->
                <!-- {{scope.row.dai ? scope.row.dai+'袋、' : ''}} -->
                <!-- {{scope.row.che ? scope.row.che+'车、' : ''}} -->
                <!-- {{scope.row.dun ? scope.row.dun+'吨' : ''}} -->
              {{(scope.row.jian||scope.row.dai||scope.row.che||scope.row.dun)?scope.row.jian+'件、'+scope.row.dai+'袋、'+scope.row.che+'车、'+scope.row.dun+'吨' : '无'}}
            </span>
                    </template>
                </el-table-column>
                <el-table-column label="单价" prop="salary" show-overflow-tooltip align="center" min-width="80"
                                 :formatter="forPrice"></el-table-column>
                <el-table-column label="金额" prop="amount" align="center" min-width="80"></el-table-column>
                <el-table-column label="类型" prop="typeName" align="center" min-width="80"></el-table-column>
                <el-table-column label="批次" prop="batchNumber" align="center" min-width="80"></el-table-column>
                <el-table-column label="状态" prop="payStatus" :formatter="statusFunc" align="center"
                                 min-width="80"></el-table-column>
            </el-table>
            <div class="pagination-container">
                <el-pagination class="pagebox" layout="prev, pager, next" @current-change="handleCurrentChange"
                               :current-page="currentPage" :page-count="pageCount">
                </el-pagination>
            </div>
        </div>
    </div>
</template>
<script>
    import Interval from '../../../../common/interval.js'
    import searchBar from '../../../../components/SearchBar.vue'

    export default {
        components: {
            searchBar
        },
        data() {
            return {
                time: 10,
                isShowComb: true,
                loading: false,
                isDisabled: false,
                total: 0,
                notTotal: 0,
                currentPage: 1,
                pageCount: 0,
                pageSize: 10,
                inputVal: '',
                selectVal: '',
                formDetail: {
                    date: '',
                    status: '班务名称',
                    settlementType: '',
                    payStatus: '',
                    industryList: [],
                    classTaskIdList: [],
                    startDate: '',
                    endDate: '',
                    taskId: '',
                    talentName: ''
                },
                tableData: [{note: 1, receiveTime: 2, receiveTime: 3, type: 4, amount: 5}],
                nameStatus: [{name: '班务名称', id: 1}, {name: '零工姓名', id: 2}],
                workerGather: [],
                moreTotal: {},
                taskId: [],
                taskId2: [],
                taskIds: [],
                taskingList: [],//进行中
                taskedList: [],//已结束
                talentList: [],//零工列表
                loadingText:"正在导出excel表...",
            }
        },
        watch: {
            'formDetail.date': function (val, old) {
                if (val == '') {
                    this.formDetail.endDate = ''
                    this.formDetail.startDate = ''
                } else if (val == '1') {
                    this.formDetail.endDate = Interval.getDay(0)
                    this.formDetail.startDate = Interval.getDay(-7)
                } else if (val == '2') {
                    this.formDetail.endDate = Interval.getDay(0)
                    this.formDetail.startDate = Interval.getDay(-30)
                } else if (val == '3') {
                    this.formDetail.endDate = Interval.getDay(0)
                    this.formDetail.startDate = Interval.getDay(-90)
                } else if (val == '5') {
                    this.formDetail.endDate = Interval.getDay(0)
                    this.formDetail.startDate = new Date().getFullYear() + '-' + ((new Date().getMonth() + 1).toString().length == 1 ? '0' + (new Date().getMonth() + 1) : (new Date().getMonth() + 1)) + '-01'
                } else if (val == '4') {
                    this.formDetail.endDate = ''
                    this.formDetail.startDate = ''
                }
            },
            // 'formDetail.settlementType': function (val, old) {
            //     this.currentPage = 1
            //     this.getData()
            //     this.getDetailList()
            // },
            // 'formDetail.payStatus': function (val, old) {
            //     this.currentPage = 1
            //     this.getData()
            //     this.getDetailList()
            // },
            // 'formDetail.industry': function (val, old) {
            //     this.currentPage = 1
            //     this.getData()
            //     this.getDetailList()
            // },
            // 'formDetail.status': function (val, old) {
            //     this.formDetail.talentName = ''
            //     this.formDetail.taskId = ''
            //     this.currentPage = 1
            //     this.getData()
            //     this.getDetailList()
            // }
        },
        filters: {
            moneyFormat(value) {
                if ((toString.call(value) === '[object Null]') || (toString.call(value) === '[object Undefined]')) {
                    return 0;
                } else {
                    let fix = (Math.round(+value + 'e' + 2) / Math.pow(10, 2)).toFixed(2);
                    return fix;
                }
            },
        },
        mounted() {
            this.getWorker()
            this.getTalentList();
            this.getTaskList();
        },
        methods: {
            async queryList() {
                if (this.formDetail.date == 4) {
                    if (!this.formDetail.startDate) {
                        return this.$message.error('开始时间不能为空!')
                    }
                    if (!this.formDetail.endDate) {
                        return this.$message.error('结束时间不能为空!')
                    }
                    if (this.formDetail.startDate > this.formDetail.endDate) {
                        return this.$message.error('结束日期要大于开始日期!')
                    }
                }
                this.currentPage = 1;
                this.formDetail.classTaskIdList = this.taskId.concat(this.taskId2);
                await this.getData();
                await this.getDetailList();
                await this.getScheduingList();
                this.isShowComb = false;
            },
            queryRefresh() {
                this.isShowComb = true;
            },
            querySearch(queryString, cb) {
                var restaurants = this.talentList;
                console.log(restaurants);
                var results = queryString ? restaurants.filter((i) => i.value.includes(queryString)) : restaurants;
                // 调用 callback 返回建议列表的数据
                cb(results);
            },
            handleSelect(item) {
                this.formDetail.talentName = item.value;
                console.log(item);
            },
            async getTaskList() {
                let params = {pageNum: 1, pageSize: 0, classTaskStatus: 2};
                let res = await this.$api.getClassTaskCustomerList(params);
                params['classTaskStatus'] = 3;
                let res2 = await this.$api.getClassTaskCustomerList(params);
                if (res.data.respCode === 0) {
                    if (res.data.data.list) {
                        this.taskingList = res.data.data.list
                    }
                }
                if (res2.data.respCode === 0) {
                    if (res2.data.data.list) {
                        this.taskedList = res2.data.data.list
                    }
                }
                console.log(this.taskingList)
                console.log(this.taskedList)
            },
            getTalentList() {
                const params = {
                    customerStatus: 1,
                    pageNum: this.currentPage,
                    pageSize: 0,
                    nameAlias: '',
                };
                this.$api.getAllEmpList(params).then(res => {
                    let result = res.data ? res.data : [];
                    if (result.length > 0) {
                        this.talentList = result.map((i) => {
                            return Object.assign({}, {value: i});
                        })
                    }
                }).catch(error => {
                    console.log(error);
                });
            },
            getData() {
                this.loading = true;
                this.loadingText = '正在请求数据中...';
                let params = {
                    pageNum: this.currentPage,
                    pageSize: this.pageSize,
                    settlementType: this.formDetail.settlementType,
                    industryList: this.formDetail.industryList,
                    classTaskIdList: this.formDetail.classTaskIdList,
                    startDate: this.formDetail.startDate,
                    endDate: this.formDetail.endDate,
                    talentName: this.formDetail.talentName,
                    taskId: this.formDetail.taskId,
                    payStatus: this.formDetail.payStatus
                }
                this.$api.batchNumberSummaryDetail(params)
                    .then(res => {
                        console.log(res)
                        if (res.data.respCode == 0) {
                            if (res.data.data) {
                                const {
                                    data: {
                                        list,
                                        pages,
                                        total,
                                        pageNum
                                    }
                                } = res.data
                                this.tableData = list
                                this.pageCount = pages
                                this.total = total
                            } else {
                                this.tableData = []
                                this.pageCount = 0
                                this.total = 0
                            }
                            if (this.total) {
                                this.isDisabled = false
                            } else {
                                this.isDisabled = true
                            }
                        }
                    })
                    .catch().finally(()=>{
                    this.loading = false;
                })
            },
            statusFunc(row) {
                if (row.payStatus == 1) {
                    return '待付款'
                } else if (row.payStatus == 2) {
                    return '已付款'
                } else {
                    return '无'
                }
            },
            getDetailList() {
                let params = {
                    pageNum: this.currentPage,
                    pageSize: this.pageSize,
                    settlementType: this.formDetail.settlementType,
                    industryList: this.formDetail.industryList,
                    classTaskIdList: this.formDetail.classTaskIdList,
                    startDate: this.formDetail.startDate,
                    endDate: this.formDetail.endDate,
                    talentName: this.formDetail.talentName,
                    // taskName: this.formDetail.taskName,
                    taskId: this.formDetail.taskId,
                    payStatus: this.formDetail.payStatus
                }
                // this.taskList = []
                this.$api.batchNumberDetailTotal(params)
                    .then(res => {
                        console.log(res)
                        if (res.data.respCode == 0) {
                            if (res.data.data) {
                                this.isDisabled = false
                                this.moreTotal = res.data.data
                            } else {
                                this.moreTotal = {}
                                this.isDisabled = true
                            }
                        }
                    })
                    .catch()
            },
            getScheduingList() {
                let params = {
                    pageNum: this.currentPage,
                    pageSize: 0,
                }
                this.$api.SchedulingList(params).then(res => {
                    console.log(res)
                    if (res.respCode == 0) {
                        if (res.data) {
                            this.notTotal = res.data.total
                        }
                    }
                }).catch()
            },
            taskNameFormatter(row, column, cellValue) {
                if (cellValue) {
                    return cellValue
                } else {
                    return '无'
                }
            },
            exportExcel() {
                let _this = this;
                this.loading = true
                this.loadingText =  '正在导出excel表...'
                let params = {
                    pageNum: this.currentPage,
                    pageSize: this.pageSize,
                    settlementType: this.formDetail.settlementType,
                    industryList: this.formDetail.industryList,
                    classTaskIdList: this.formDetail.classTaskIdList,
                    startDate: this.formDetail.startDate,
                    endDate: this.formDetail.endDate,
                    talentName: this.formDetail.talentName,
                    taskId: this.formDetail.taskId,
                    payStatus: this.formDetail.payStatus
                }
                this.$api.AccountDetailExport(params)
                    .then(res => {
                        if (res.data.respCode == 0) {
                            if (res.data.data) {
                                window.open(res.data.data)
                            }
                        }
                    }).catch().finally(()=>{
                    setTimeout(() => {
                        _this.loading = false
                    },500)
                })
            },
            getWorker() {
                this.$api.GetTags().then(res => {
                    console.log(res)
                    if (res.respCode == 0) {
                        if (res.data) {
                            this.workerGather = res.data
                        }
                    }
                }).catch()
            },
            industryNameFiliters(row, column, cellValue) {
                if (cellValue) {
                    return cellValue
                } else {
                    return '无'
                }
            },
            workHoursFiliters(row, column, cellValue) {
                if (cellValue) {
                    return cellValue
                } else {
                    return '无'
                }
            },
            searchBtn() {
                this.currentPage = 1
                this.getData()
                this.getDetailList()
            },
            handleCurrentChange(val) {
                this.currentPage = val
                this.getData()
                this.getDetailList()
            },
            goToNotProceedCheckWorker() {
                const {href} = this.$router.resolve({
                    name: 'notProceedCheckWorker',
                })
                window.open(href, '_blank')
            },
            forPrice(val) {
                if (val.salary) {
                    let salary = JSON.parse(val.salary)
                    // let type = val.settlementType == 4 ? 1 : val.settlementType
                    let type = val.settlementType;
                    for (let i in salary) {
                        if (salary[i].settlementType == type) {
                            for (let j in salary[i].price) {
                                if (((salary[i].price)[j]).sex == val.sex || ((salary[i].price)[j]).sex == 3) {
                                    console.log((salary[i].price)[j])
                                    let item = (salary[i].price)[j]
                                    let content = ''
                                    if (salary[i].valuationType == 1) {
                                        content = `${item.countTime}元/小时`
                                    } else if (salary[i].valuationType == 8) {
                                        content = `${item.countFixed}元/天`
                                    } else if (salary[i].valuationType == 2) {
                                        if (salary[i].unit == 1) {
                                            content = `${item.countSettle}元/件`
                                        } else if (salary[i].unit == 2) {
                                            content = `${item.countDai}元/袋`
                                        } else if (salary[i].unit == 3) {
                                            content = `${item.countChe}元/车`
                                        } else {
                                            content = `${item.countDun}元/吨`
                                        }
                                    } else if (salary[i].valuationType == 3) {
                                        let varUnit
                                        if (salary[i].unit == 1) {
                                            varUnit = '件'
                                        } else if (salary[i].unit == 2) {
                                            varUnit = '袋'
                                        } else if (salary[i].unit == 3) {
                                            varUnit = '车'
                                        } else {
                                            varUnit = '吨'
                                        }
                                        content += `${(item.ladderObj)[0].count}${varUnit}以下（含），${(item.ladderObj)[0].unit}元/${varUnit}`
                                        for (let z in item.ladderObj) {
                                            if (z > 0 && z != (item.ladderObj.length - 1)) {
                                                content += `；${(Number((item.ladderObj)[z - 1].count)) + 1}至${(item.ladderObj)[z].count}${varUnit}（含），${(item.ladderObj)[z].unit}元/${varUnit}`

                                            }
                                        }
                                        content += `；${(item.ladderObj)[item.ladderObj.length - 2].count}${varUnit}以上，${(item.ladderObj)[item.ladderObj.length - 1].overUnit}元/${varUnit}`
                                    } else if (salary[i].valuationType == 4) {
                                        if (item.countSettle) {
                                            content += `${item.countSettle}元/件,`
                                        }
                                        if (item.countDai) {
                                            content += `${item.countDai}元/袋,`
                                        }
                                        if (item.countChe) {
                                            content += `${item.countChe}元/车,`
                                        }
                                        if (item.countDun) {
                                            content += `${item.countDun}元/吨`
                                        }
                                    } else if (salary[i].valuationType == 5) {

                                        if (salary[i].unit == 1) {
                                            content += `${item.countSettle}元/件，`
                                        } else if (salary[i].unit == 2) {
                                            content += `${item.countDai}元/袋，`
                                        } else if (salary[i].unit == 3) {
                                            content += `${item.countChe}元/车，`
                                        } else {
                                            content += `${item.countDun}元/吨，`
                                        }
                                        content += `${item.countTime}元/小时`
                                    } else if (salary[i].valuationType == 6) {
                                        content += `${item.countTime}元/小时,`
                                        let varUnit
                                        if (salary[i].unit == 1) {
                                            varUnit = '件'
                                        } else if (salary[i].unit == 2) {
                                            varUnit = '袋'
                                        } else if (salary[i].unit == 3) {
                                            varUnit = '车'
                                        } else {
                                            varUnit = '吨'
                                        }
                                        content += `${(item.ladderObj)[0].count}${varUnit}以下（含），${(item.ladderObj)[0].unit}元/${varUnit}`
                                        for (let z in item.ladderObj) {
                                            if (z > 0 && z != (item.ladderObj.length - 1)) {
                                                content += `；${(Number((item.ladderObj)[z - 1].count)) + 1}至${(item.ladderObj)[z].count}${varUnit}（含），${(item.ladderObj)[z].unit}元/${varUnit}`

                                            }
                                        }
                                        content += `；${(item.ladderObj)[item.ladderObj.length - 2].count}${varUnit}以上，${(item.ladderObj)[item.ladderObj.length - 1].overUnit}元/${varUnit}`
                                    } else {

                                        if (item.countSettle) {
                                            content += `${item.countSettle}元/件,`
                                        }
                                        if (item.countDai) {
                                            content += `${item.countDai}元/袋,`
                                        }
                                        if (item.countChe) {
                                            content += `${item.countChe}元/车,`
                                        }
                                        if (item.countDun) {
                                            content += `${item.countDun}元/吨,`
                                        }
                                        content += `${item.countTime}元/小时`
                                    }
                                    return content
                                }
                            }

                        }
                    }
                } else {
                    return '无'
                }
            },
        },
    }
</script>
<style scoped>
    .worker-detail-radio-wrap {
        padding: 5px 0;
    }

    .formSearchMargin {
        margin-bottom: 5px;
    }

    .fontsizecolor {
        color: #e84518;
    }

    .elRadio {
        padding-bottom: 10px;
        margin-left: 0px;
    }
</style>
<style lang="scss">
    .supermanCon {
        .el-form-item__label {
            color: #333;
            font-weight: bold;
        }
        .select-new-307 {
            .el-form-item__content {
                display: flex;
                justify-content: flex-start;
                align-items: flex-start;

                .select-el-wrap {
                    .el-select {
                        vertical-align: top;

                        .el-input {
                            width: 100%;

                            .el-input__inner {
                                width: 100%;
                            }
                        }
                    }
                }
            }
        }
    }
</style>