<template>
    <div style="background-color:#f2f2f5;" class="supermanCon" v-loading="loading" element-loading-text="正在导出excel表...">
        <el-form ref="formDetail" :model="formDetail" label-width="100px" labelPosition="left"
                 style="background-color:white;padding-left:20px;padding-bottom: 15px">
            <div style="display:flex;align-items:center;padding:20px 20px 20px 0;" class="search-zone">
                <div style="display:flex;align-items:center;">
                    <div v-show="formDetail.status == '班务名称'">
                        <!--<el-select v-model="formDetail.taskId" filterable clearable placeholder="输入班务名称搜索" class="inputWidth">-->
                        <!--<el-option v-for="(item,index) in taskList" :key="index" :label="`${item.taskName} / ${item.status} / ${item.startTime}-${item.endTime}`" :value="item.id">-->
                        <!--</el-option>-->
                        <!--</el-select>-->
                        <el-input class="rant-input inputWidth keyWFormParent" clearable placeholder="输入班务名称搜索"
                                  v-model="formDetail.taskName"></el-input>
                    </div>
                    <div v-show="formDetail.status == '零工姓名'">
                        <!-- <el-select v-model="formDetail.talentName" filterable clearable remote placeholder="输入零工姓名搜索" class="inputWidth">
                          <el-option v-for="item in talentNameAliasList" :key="item" :label="item" :value="item">
                          </el-option>
                        </el-select> -->
                        <el-input class="rant-input inputWidth keyWFormParent" clearable placeholder="输入零工姓名搜索"
                                  v-model="formDetail.talentName"></el-input>
                    </div>
                    <div>
                        <el-select v-model="formDetail.status" placeholder="请选择" style="width:160px">
                            <el-option v-for="item in nameStatus" :key="item.id" :label="item.name" :value="item.name">
                            </el-option>
                        </el-select>
                    </div>
                    <el-button type="primary" size="small" class="searchBtn" @click="searchBtn">搜索</el-button>
                </div>
                <el-button style="margin-left:20px" class="comb-btn" size="mini" type="text" @click="handleCombShow">
                    高级筛选<i class="el-icon-right el-icon-d-arrow-right"
                           :class="isShowComb ? 'el-icon-d-arrow-right-down' : 'el-icon-d-arrow-right-right'"></i>
                </el-button>
            </div>
            <div v-show="isShowComb" class="combine-zone" style="border-top: 1px solid #EAEDF4">
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
                    <el-date-picker class="margin_left40" size="mini" v-model="formDetail.startDate" type="date"
                                    value-format="yyyy-MM-dd" placeholder="选择开始时间">
                    </el-date-picker>
                    --
                    <el-date-picker class="margin_left10" size="mini" v-model="formDetail.endDate" type="date"
                                    value-format="yyyy-MM-dd" placeholder="选择结束时间">
                    </el-date-picker>
                    <el-button type="primary" size="small" class="datesearchBtn" @click="btn_true">确定</el-button>
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
                <el-form-item label="外包商：" class="formSearchMargin fixMark marginTopSp">
                    <el-radio-group  class="radio-search" v-model="formDetail.outsourcingCusId">
                        <el-radio v-for="(item,index) in outSourceLists" :label="item.id" :value="item.id" :key="item.id">{{item.name}}</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="工种：" class="formSearchMargin">
                    <el-radio-group style="display: flex;align-items: start" class="radio-search"
                                    v-model="formDetail.industry">
                        <el-radio style="padding-top: 10px" label="">不限</el-radio>
                        <div class="worker-detail-radio-wrap">
                            <el-radio :label="item.skillValue" :value="item.skillValue" class="elRadio"
                                      v-for="item in workerGather" :key="item.skillValue">{{item.skillName}}
                            </el-radio>
                        </div>
                    </el-radio-group>
                </el-form-item>
            </div>
            <!-- <el-form-item label="班务名称：" class="formSearchMargin" v-if="formDetail.status == '班务名称'">
              <el-select v-model="formDetail.taskId" filterable placeholder="输入班务名称搜索" class="inputWidth">
                <el-option v-for="item in taskList" :key="item.id" :label="`${item.taskName} / ${item.status} / ${item.startTime}-${item.endTime}`" :value="item.id">
                </el-option>
              </el-select>
              <el-button type="primary" size="small" class="searchBtn" @click="searchBtn">搜索</el-button>
            </el-form-item> -->
            <!-- <el-form-item label="零工姓名：" class="formSearchMargin" v-if="formDetail.status == '零工姓名'">
              <el-select v-model="formDetail.talentName" filterable remote placeholder="输入零工姓名搜索" class="inputWidth">
                <el-option v-for="item in talentNameAliasList" :key="item" :label="item" :value="item">
                </el-option>
              </el-select>
              <el-button type="primary" size="small" class="searchBtn" @click="searchBtn">搜索</el-button>
            </el-form-item> -->
        </el-form>
        <div style="background-color:white;border:1px solid #E6E7EB;margin-top:18px;">
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
            <el-button class="myplain-btn" size="small" style="margin:6px 0 6px 24px;width:98px;" :disabled="isDisabled"
                       @click="exportExcel">导出
            </el-button>
        </div>
        <div class="table-box back-white">
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
                <el-table-column label="外包商" prop="outsourcingCusName" align="center" min-width="80"></el-table-column>
                <el-table-column label="批次" prop="batchNumber" align="center" min-width="80"></el-table-column>
                <el-table-column label="状态" prop="payStatus" :formatter="statusFunc" align="center" min-width="80"></el-table-column>
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
                isShowComb: false,
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
                    date: '5',
                    status: '班务名称',
                    settlementType: '',
                    payStatus: '',
                    industry: '',
                    startDate: '',
                    endDate: '',
                    taskId: '',
                    talentName: '',
                    payOutType:"",
                    outsourcingCusId:'',
                },
                tableData: [{note: 1, receiveTime: 2, receiveTime: 3, type: 4, amount: 5}],
                nameStatus: [{name: '班务名称', id: 1}, {name: '零工姓名', id: 2}],
                workerGather: [],
                moreTotal: {},
                taskList: [],
                outSourceLists:[],
                talentNameAliasList: [],
                // taskName: '',
                // recordDate: ''
            }
        },
        watch: {
            'formDetail.date': function (val, old) {
                if (val == '') {
                    this.currentPage = 1
                    this.getData()
                    this.getDetailList()
                } else if (val == '1') {
                    this.currentPage = 1
                    this.getData()
                    this.getDetailList()
                } else if (val == '2') {
                    this.currentPage = 1
                    this.getData()
                    this.getDetailList()
                } else if (val == '3') {
                    this.currentPage = 1
                    this.getData()
                    this.getDetailList()
                } else if (val == '5') {
                    this.currentPage = 1
                    this.getData()
                    this.getDetailList()
                } else if (val == '4') {
                    this.formDetail.endDate = ''
                    this.formDetail.startDate = ''
                }
            },
            'formDetail.settlementType': function (val, old) {
                this.currentPage = 1
                this.getData()
                this.getDetailList()
            },
            'formDetail.payStatus': function (val, old) {
                this.currentPage = 1
                this.getData()
                this.getDetailList()
            },
            'formDetail.industry': function (val, old) {
                this.currentPage = 1
                this.getData()
                this.getDetailList()
            },
            'formDetail.outsourcingCusId': function (val, old) {
                this.currentPage = 1
                this.getData()
                this.getDetailList()
            },
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
            this.getData()
            this.getWorker()
            this.getDetailList();
            this.getScheduingList();
            this.getReceived();
            this.geOutLists()
        },
        methods: {
            statusFunc(row){
                if(row.payStatus == 1){
                    return '待付款'
                }else if(row.payStatus == 2){
                    return '已付款'
                }else{
                    return '无'
                }
            },
            handleCombShow() {
                this.isShowComb = !this.isShowComb
            },
            getData() {
                if (this.formDetail.date == '') {
                    this.formDetail.endDate = ''
                    this.formDetail.startDate = ''
                } else if (this.formDetail.date == '1') {
                    this.formDetail.endDate = Interval.getDay(0)
                    this.formDetail.startDate = Interval.getDay(-7)
                } else if (this.formDetail.date == '2') {
                    this.formDetail.endDate = Interval.getDay(0)
                    this.formDetail.startDate = Interval.getDay(-30)
                } else if (this.formDetail.date == '3') {
                    this.formDetail.endDate = Interval.getDay(0)
                    this.formDetail.startDate = Interval.getDay(-90)
                } else if (this.formDetail.date == '5') {
                    this.formDetail.endDate = Interval.getDay(0)
                    this.formDetail.startDate = `${this.Moment(Date.now()).format('YYYY-MM')}-01`;
                } else if (this.formDetail.date == '4') {
                    this.formDetail.endDate = this.formDetail.endDate
                    this.formDetail.startDate = this.formDetail.startDate
                }
                // if (this.formDetail.endDate) {
                //   if (this.formDetail.endDate < this.formDetail.startDate) {
                //     return this.$message.error('结束日期不能早于开始日期!')
                //   }
                // }

                let params = {
                    pageNum: this.currentPage,
                    pageSize: this.pageSize,
                    settlementType: this.formDetail.settlementType,
                    industry: this.formDetail.industry,
                    startDate: this.formDetail.startDate,
                    endDate: this.formDetail.endDate,
                    talentName: this.formDetail.talentName,
                    taskName: this.formDetail.taskName,
                    taskId: this.formDetail.taskId,
                    payStatus: this.formDetail.payStatus,
                    outsourcingCusId:this.formDetail.outsourcingCusId,
                    showOutsourcing:true,
                }
                if(this.formDetail.status =='零工姓名'){
                    delete params.taskName;
                }else {
                    delete params.talentName;
                }
                console.log(params)
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
                    .catch()
            },
            getReceived() {
                this.$api.received().then(res => {
                    console.log(res)
                    if (res.respCode == 0) {
                        if (res.data && res.data.length > 0) {
                            this.taskList = res.data
                            this.taskList.forEach(item => {
                                if (item.status == 2) {
                                    item.status = '进行中'
                                } else if (item.status == 3) {
                                    item.status = '已结束'
                                }
                                if (item.startTime) {
                                    item.startTime = item.startTime.substr(0, 10)
                                } else {
                                    item.startTime = ''
                                }
                                if (item.endTime) {
                                    item.endTime = item.endTime.substr(0, 10)
                                } else {
                                    item.endTime = ''
                                }
                            })
                        }
                    }
                }).catch()
            },
            getDetailList() {
                let params = {
                    pageNum: this.currentPage,
                    pageSize: this.pageSize,
                    settlementType: this.formDetail.settlementType,
                    industry: this.formDetail.industry,
                    startDate: this.formDetail.startDate,
                    endDate: this.formDetail.endDate,
                    talentName: this.formDetail.talentName,
                    taskName: this.formDetail.taskName,
                    taskId: this.formDetail.taskId,
                    payStatus: this.formDetail.payStatus,
                    outsourcingCusId:this.formDetail.outsourcingCusId,
                    showOutsourcing:true,
                }
                if(this.formDetail.status =='零工姓名'){
                    delete params.taskName;
                }else {
                    delete params.talentName;
                }
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
            geOutLists(){
                let params = {
                    customerType:2,
                    pageSize:0,
                };
                this.$api.getOutLists(params).then(res=>{
                    let { data:layer1 } = res;
                    let { data,respCode } = layer1;
                    if( respCode === 0 ){
                        if(data && data.list){
                            this.outSourceLists = [{id:'',name:'不限'},...data.list];
                        }else{
                            this.outSourceLists = [{id:'',name:'不限'}];
                        }
                    }else{
                        this.outSourceLists = [{id:'',name:'不限'}];
                    }
                }).catch(err=>{
                    console.log('err',err);
                })
            },
            getScheduingList() {
                let params = {
                    pageNum: this.currentPage,
                    pageSize:0,
                    showOutsourcing:true,
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
            btn_true() {
                if (this.formDetail.startDate && !this.formDetail.endDate) {

                } else if (this.formDetail.startDate == '' && this.formDetail.endDate == '') {
                    return this.$message.error('开始日期和结束日期不能为空!')
                } else if (!this.formDetail.startDate && this.formDetail.endDate) {
                    return this.$message.error('开始日期不能为空!')
                }
                this.currentPage = 1
                this.getData()
                this.getDetailList()
            },
            taskNameFormatter(row, column, cellValue) {
                if (cellValue) {
                    return cellValue
                } else {
                    return '无'
                }
            },
            exportExcel() {
                let params = {
                    pageNum: this.currentPage,
                    pageSize: this.pageSize,
                    settlementType: this.formDetail.settlementType,
                    industry: this.formDetail.industry,
                    startDate: this.formDetail.startDate,
                    endDate: this.formDetail.endDate,
                    talentName: this.formDetail.talentName,
                    taskName: this.formDetail.taskName,
                    taskId: this.formDetail.taskId,
                    payStatus: this.formDetail.payStatus,
                    outsourcingCusId:this.formDetail.outsourcingCusId,
                    showOutsourcing:true,
                }
                this.$api.AccountDetailExport(params)
                    .then(res => {
                        // console.log(res)
                        if (res.data.respCode == 0) {
                            this.loading = true
                            setTimeout(() => {
                                this.loading = false
                            }, 2000)
                            if (res.data.data) {
                                window.open(res.data.data)
                            }
                        } else if (res.data.respCode == -1) {
                            this.loading = false
                        }
                    }).catch()
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
                    name: 'outNotProceedCheckWorker',
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
                                if (((salary[i].price)[j]).sex == val.sex) {
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
    .worker-detail-radio-wrap{
        padding: 5px 0;
    }
    .formSearchMargin {
        margin-bottom: 5px;
    }
    .datesearchBtn {
        margin-left: 15px;
    }
    .fontsizecolor {
        color: #e84518;
    }

    .elRadio {
        padding-bottom: 10px;
        margin-left: 0px;
    }

    .searchBtn {
        width: 100px;
        height: 34px;
        margin-left: 15px;
    }

    .inputWidth {
        width: 520px;
        /* margin-left: 15px; */
    }
</style>
<style lang="scss">
    .supermanCon {
        .limitNow {
            .el-input__inner {
                width: 100%;
            }

            .el-input {
                width: 100%;
            }
        }

        .keyWFormParent {
            width: 520px;
            margin-right: 12px;
        }
    }
</style>