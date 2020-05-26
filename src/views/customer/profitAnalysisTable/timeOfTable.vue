<template>
    <div>
        <h1 style="color:#383838;font-size:14px;font-style:MicrosoftYaHei;padding:20px 0 20px 30px;border-bottom:1px solid #EAEDF4;background: #ffffff;">
            利润分析-按班务</h1>
        <div style="background: #ffffff;" class="pt10 pb10">
            <el-form :model="formStatement" label-width="100px" labelPosition="center">
                <el-form-item label="选择班务：" class="formSearchMargin">
                    <el-radio-group class="radio-search" v-model="settlement">
                        <el-radio label="">全部班务</el-radio>
                        <!--<el-radio :label="2">进行中的班务</el-radio>-->
                        <!--<el-radio :label="3">已结束的班务</el-radio>-->
                        <el-radio :label="4">
                            <span @click="goToChooseTask()">
                                {{newArr1 && newArr1.length > 0 ? `自定义 (已选中${newArr1.length}个班务)` : '自定义'}}
                            </span>
                        </el-radio>
                    </el-radio-group>
                </el-form-item>
                <!--<el-form-item class="formSearchMargin top" v-if="settlement===4">-->
                    <!--<el-button class="el-btn new_btn" @click="goToChooseTask">点击进行选择</el-button>-->
                    <!--<span v-if="preList.length > 0" class="pl10 pr10">{{newArr1[0]+ ' '}} 等{{newArr1.length}}个班务</span>-->
                <!--</el-form-item>-->
                <el-form-item label="选择维度：" class="formSearchMargin">
                    <el-radio-group class="radio-search" v-model="formStatement.type">
                        <el-radio label="1">按天</el-radio>
                        <el-radio label="2">按月</el-radio>
                    </el-radio-group>
                </el-form-item>
                <div class="date-3010">
                <el-form-item label="选择时段：" class="formSearchMargin bottom" v-show="formStatement.type=='1'">
                    <el-radio-group class="radio-search" v-model="formStatement.date"><!--@change="handleChangeFormStatementDate"-->
                        <el-radio label="1">本月</el-radio>
                        <el-radio label="2">上月</el-radio>
                        <el-radio label="3">自定义</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="选择时段：" class="formSearchMargin bottom" v-show="formStatement.type=='2'">
                    <el-radio-group class="radio-search" v-model="formStatement.year"> <!--@change="handleChangeFormStatementYear"-->
                        <el-radio label="1">本年度</el-radio>
                        <el-radio label="2">自定义</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="" class="formSearchMargin"
                              v-show="formStatement.type=='1'&&formStatement.date == '3'">
                    <el-date-picker
                            v-model="formStatement.daterange"
                            type="daterange"
                            range-separator="至"
                            style="margin-left: -90px;margin-top: -5px"
                            start-placeholder="开始日期"
                            @change="handleChangeDateRange"
                            end-placeholder="结束日期">
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="" class="formSearchMargin"
                              v-show="formStatement.type=='2'&&formStatement.year == '2'">
                    <el-date-picker
                            v-model="formStatement.monthrange"
                            style="margin-left: -90px;margin-top: -5px"
                            type="monthrange"
                            range-separator="至"
                            start-placeholder="开始月份"
                            @change="handleChangeMonthRange"
                            end-placeholder="结束月份">
                    </el-date-picker>
                </el-form-item>
                </div>
                <el-form-item label="展示形式：" class="formSearchMargin">
                    <el-radio-group class="radio-search" v-model="formStatement.manager">
                        <el-radio label="">汇总</el-radio>
                        <el-radio label="1">
                            <span @click="handleShowManagerList()">
                                {{showSelectManagerList.length > 0 ? `${managerListMap[showSelectManagerList[0]]} 等
                                ${showSelectManagerList.length}个班务经理` : '自定义班务经理'}}
                            </span>
                        </el-radio>
                    </el-radio-group>
                </el-form-item>
                <!--<el-form-item class="formSearchMargin pt15 pb15" v-if="formStatement.manager==1">-->
                    <!--<el-button class="el-btn new_btn" @click="handleShowManagerList">点击进行选择</el-button>-->
                    <!--<span v-if="showSelectManagerList.length > 0" class="pl10 pr10">{{managerListMap[showSelectManagerList[0]]+ ' '}} 等{{showSelectManagerList.length}}个班务经理</span>-->
                <!--</el-form-item>-->
            </el-form>
            <el-dialog
                    title="请选择班务经理"
                    :visible.sync="dialogVisible"
                    width="1000px"
                    :before-close="handleClose">
                <div class="u-already-list pl30">
                    <div>已选:</div>
                    <div class="u-already-list-3010" style="max-height:120px;overflow-y: auto">
                        <div class="u-already-item" v-for="it,i in selectManagerList" :key="i">{{managerListMap[it]}}
                            <img src="../../../assets/icons/x.png" style="cursor:pointer" @click="handleDeleteSelect(it)">
                        </div>
                    </div>
                </div>
                <div style="height:280px;overflow-y: auto">
                    <el-checkbox-group class="el-check-group-3010" v-model="selectManagerList" @change="handleTest">
                        <el-checkbox class="el-checkbox-3010" v-for="it,i in managerList" :label="it.id" :key="i">{{it.nameAlias}}</el-checkbox>
                    </el-checkbox-group>
                </div>
                <span slot="footer" class="dialog-footer dialog-footer-center">
                <el-button class="mr20" @click="dialogVisible = false;">取 消</el-button>
                <el-button type="primary" @click="handleSureManagerList"
                           :title="selectManagerList.length===0?'班务经理不能为空':''" :disabled="selectManagerList.length===0">确 定</el-button>
            </span>
            </el-dialog>
        </div>
        <!--<div v-if="showSelectManagerList.length>0">-->
            <!--<el-radio-group v-model="showManger" size="medium" @change="handleChangeShowManager">-->
                <!--<el-radio-button v-for="it,i in showSelectManagerList" :key="i" :label="it">{{managerListMap[it]}}-->
                <!--</el-radio-button>-->
            <!--</el-radio-group>-->
        <!--</div>-->
        <div v-if="divDisabled">
            <div class="list-3010-1">
                <h1 style="">
                    选择数据源
                </h1>
                <div class="ml20" style="width: 80px;height: 34px">
                    <el-select v-model="formStatement.dataSource">
                        <el-option
                                v-for="(item,index) in sourceList"
                                :key="index"
                                :label="item.label"
                                :value="item.value">
                        </el-option>
                    </el-select>
                </div>
                <div class="ml20" v-if="showSelectManagerList.length>0" style="width:120px;height: 34px">
                    <el-select v-model="showManger">
                        <!--@change="handleChangeShowManager"-->
                        <el-option
                                v-for="(item,index) in showSelectManagerList"
                                :key="index"
                                :label="managerListMap[item]"
                                :value="item">
                        </el-option>
                    </el-select>
                </div>
            </div>
            <!--<el-radio-group v-model="formStatement.dataSource" size="medium">-->
                <!--<el-radio-button label="1">收入</el-radio-button>-->
                <!--<el-radio-button label="2">支出</el-radio-button>-->
                <!--<el-radio-button label="3">利润</el-radio-button>-->
                <!--&lt;!&ndash;<el-radio-button label="4">吨</el-radio-button>&ndash;&gt;-->
            <!--</el-radio-group>-->
            <div>
                <div v-show="showNull"
                     style="width:100%; height:400px;background:#ffffff;text-align:center;padding-top:160px">暂无数据
                </div>
                <div v-show="!showNull" id="chartmainline" style="width:100%; height:400px;background:#ffffff;"></div>
            </div>

        </div>
        <div class="alertText">注：本页面只有已零工结算的排班数据才会进行统计</div>
        <div style="padding-bottom:50px;">
            <h1 style="color:#383838;font-size:14px;font-style:MicrosoftYaHei;padding:20px 0 20px 30px;background: #ffffff;margin-top:20px;border-bottom:1px solid #EAEDF4;">
                合计: 收入{{formStatement.inCome}}元, 支出{{formStatement.expend}}元, 利润{{formStatement.profit}}元</h1>
            <el-table :data="tableData" empty-text="暂无相关信息">
                <el-table-column label="日期" prop="createAt" show-overflow-tooltip align="center"></el-table-column>
                <el-table-column label="收入(元)" prop="inCome" :formatter="_number" show-overflow-tooltip
                                 align="center"></el-table-column>
                <el-table-column label="支出(元)" prop="expend" :formatter="_number" show-overflow-tooltip
                                 align="center"></el-table-column>
                <el-table-column label="利润(元)" prop="profit" :formatter="_number" show-overflow-tooltip
                                 align="center"></el-table-column>
                <el-table-column label="操作" prop="" show-overflow-tooltip align="center">
                    <template v-slot="scope">
                        <el-button type="text" class="btn-icon btn-icon-view" size="mini"
                                   @click="routerTo(scope.row)">查看
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <!--<div class="pagination-container">-->
        <!--<el-pagination class="pagebox" layout="prev, pager, next" @current-change="handleCurrentChange"-->
        <!--:current-page="currentPage" :page-count="pageCount" :page-size="pageSize">-->
        <!--</el-pagination>-->
        <!--</div>-->
        <el-dialog
                title="选择班务"
                :visible.sync="showClassDia"
                width="1000px"
                center>
            <chooseTask
                    :handleGetSelectClass="handleGetSelectClass"
                    :handleCancelClassDia="handleCancelClassDia"
            />
        </el-dialog>
    </div>
</template>

<script>
    import Interval from '../../../common/interval.js'
    import chooseTask from './chooseTask';
    // import G2 from '@antv/g2'
    import moment from 'moment';

    export default {
        components: {chooseTask},
        data() {
            let _this = this;
            return {
                showNull: false,
                showClassDia: false,
                selectManagerList: [],
                dialogVisible: false,
                manager: '',
                settlement: '',
                pickerOptions1: {
                    disabledDate(time) {
                        if (_this.formStatement.startDate != null || _this.formStatement.endDate != null) {
                            return time.getTime() < (new Date(_this.formStatement.startDate || _this.formStatement.endDate).getTime() - 8.64e7) || time.getTime() > (new Date(_this.formStatement.startDate || _this.formStatement.endDate).getTime() + 3600 * 1000 * 24 * 30)
                        } else {
                            return ''
                        }
                    }
                },
                pickerOptions2: {
                    disabledDate(time) {
                        if (_this.formStatement.startDate != null || _this.formStatement.endDate != null) {
                            return time.getTime() < (new Date(_this.formStatement.startDate || _this.formStatement.endDate).getTime() - 8.64e7) || time.getTime() > (new Date(_this.formStatement.startDate || _this.formStatement.endDate).getTime() + 3600 * 1000 * 24 * 30 * 12)
                        } else {
                            return ''
                        }
                    }
                },
                tableData: [],
                sourceList:[
                    {label: '收入', value: '1'},
                    {label: '支出', value: '2'},
                    {
                        label: '利润',
                        value: '3'
                    }
                ],
                formStatement: {
                    type: '1',
                    date: '1',
                    year: '1',
                    startDate: moment(new Date()).startOf('month').format('YYYY-MM-DD'),
                    endDate: moment(new Date()).format('YYYY-MM-DD'),
                    monthrange: [],
                    daterange: [],
                    manager: '',
                    dataSource: '1',
                    inCome: 0,
                    inComeList: [],
                    expend: 0,
                    expendList: [],
                    profit: 0,
                    profitList: [],
                },
                type: '1',
                isClearTime: true,
                chart: null,
                divDisabled: false,
                options: {
                    tooltip: {
                        trigger: 'axis'
                    },
                    toolbox: {
                        show: true,
                        feature: {
                            dataView: {readOnly: false},
                            magicType: {type: ['line', 'bar']},
                            saveAsImage: {}
                        }
                    },
                    xAxis: {
                        type: 'category',
                        boundaryGap: false,
                        name: '日期',
                        data: []
                    },
                    yAxis: {
                        type: 'value',
                        name: '',
                        axisLabel: {
                            formatter: function (value, index) {
                                return value;
                            }
                        }
                    },
                    series: [
                        {
                            name: '',
                            type: 'line',
                            smooth: true,
                            data: [],
                            label: {
                                normal: {
                                    show: false,
                                    distance: 10,
                                    align: "center",
                                    verticalAlign: "middle",
                                    position: 'top',
                                    rotate: 30,
                                    formatter: function (value, index) {
                                        return value.toFixed(2);
                                    }
                                }
                            },
                        }
                    ]
                },
                currentPage: 1,
                pageCount: 0,
                pageSize: 40,
                prevTime: [],
                timesd: {},
                ids: [],
                preList: [],
                newArr1: [],
                managerList: [],
                managerListMap: {},
                showSelectManagerList: [],
                showManger: null,
                toParams: {},
                nameAlias:'',
            }
        },
        watch: {
            'formStatement.type': function (val, old) {
                console.log(val)
                if (val == '1') {//按天
                    this.formStatement.date = '1'
                    this.formStatement.startDate = moment(new Date()).startOf('month').format('YYYY-MM-DD');
                    this.formStatement.endDate = moment(new Date()).format('YYYY-MM-DD');
                    this.getData()
                    this.drawChart();
                } else if (val == '2') {
                    this.formStatement.year = '1'
                    this.formStatement.startDate = moment(new Date()).startOf('year').format('YYYY-MM-DD');
                    this.formStatement.endDate = moment(new Date()).format('YYYY-MM-DD');
                    this.getData()
                    this.drawChart();
                }
            },
            'formStatement.date': function (val, old) {
                if (val == '1') {
                    this.currentPage = 1
                    this.formStatement.startDate = moment(new Date()).startOf('month').format('YYYY-MM-DD');
                    this.formStatement.endDate = moment(new Date()).format('YYYY-MM-DD');
                    this.getData()
                    this.drawChart();
                    // this.isClearTime = true;
                } else if (val == '2') {
                    this.currentPage = 1
                    this.formStatement.startDate = moment().month(moment().month() - 1).startOf('month').format('YYYY-MM-DD');
                    this.formStatement.endDate = moment().month(moment().month() - 1).endOf('month').format('YYYY-MM-DD');
                    this.getData()
                    this.drawChart();
                    // this.isClearTime = true;
                } else if (val == '3') {// && this.isClearTime
                    this.formStatement.daterange = ''
                    // this.isClearTime = false;
                    this.formStatement.startDate = '';
                    this.formStatement.endDate = ''
                }
            },
            'formStatement.year': function (val, old) {
                if (val == '1') {
                    this.currentPage = 1;
                    this.formStatement.startDate = moment(new Date()).startOf('year').format('YYYY-MM-DD');
                    this.formStatement.endDate = moment(new Date()).format('YYYY-MM-DD');
                    this.getData();
                    this.drawChart();
                    // this.isClearTime = true;
                } else if (val == '2') { //&& this.isClearTime
                    // this.isClearTime = false;
                    this.formStatement.monthrange = '';
                    this.formStatement.startDate = ''
                    this.formStatement.endDate = ''
                }
            },
            'formStatement.manager': function (val, old) {
                if (val == '1') {
                    this.handleShowManagerList();
                } else {
                    this.showSelectManagerList = [];
                    this.showManger = null;
                    this.btn_jiekou();
                }
            },
            'formStatement.dataSource': function (val, old) {
                this.drawChart();
            },
            settlement:function(val,old){
                if(val == 4){
                    console.log(val)
                    this.goToChooseTask();
                }else{
                    this.ids = [];
                    this.newArr1 = [];
                    this.btn_jiekou();
                }
            },
            type: function (val, old) {
                this.getData()
                this.drawChart()
            },
            showManger:function () {
                this.btn_jiekou();
            }
        },
        created() {
            this.handeGetManagerList();
            this.xAxisdata1();
            this.btn_jiekou();
        },
        methods: {
            rowClass ({ row, column, rowIndex, columnIndex }) {
                if (rowIndex % 2 === 1) {
                    return 'cell-odd-num'
                }
            },
            routerTo(row) {
                let item = Object.assign({classTaskDate: row.createAt,nameAlias:this.nameAlias}, this.toParams)
                const {href} = this.$router.resolve({
                    path: 'profitDetail',
                    query: item
                });
                window.open(href, '_blank')
            },
            _number(row, column, cellValue) {
                if (cellValue) {
                    return cellValue.toFixed(2)
                } else {
                    return 0
                }
            },
            handleGetSelectClass() {
                const {state} = this.$store;
                this.preList = state.selectProfit || [];
                this.ids = [];
                this.newArr1 = [];
                for (let item of this.preList) {
                    this.ids.push(item.id);
                    this.newArr1.push(item.name);
                }
                this.btn_jiekou();
                this.showClassDia = false;
            },
            handleCancelClassDia() {
                this.showClassDia = false;
                // this.settlement = '';
                // this.ids = [];
            },
            handleDeleteSelect(id) {
                this.selectManagerList = this.selectManagerList.filter(it => it !== id);
            },
            handleChangeShowManager(val) {
                this.nameAlias = this.managerListMap[val]
                console.log(val)
                console.log(this.nameAlias)
                this.btn_jiekou();
            },
            handleChangeFormStatementManager(val) {
                this.showSelectManagerList = [];
                this.showManger = null;

                this.btn_jiekou();
            },
            handleSureManagerList() {
                this.showSelectManagerList = this.selectManagerList;
                this.dialogVisible = false;
                this.selectManagerList = [];
                this.showManger = this.showSelectManagerList[0];
                this.btn_jiekou();
            },
            handleClose() {
                this.dialogVisible = false;
            },
            handleShowManagerList() {
                this.selectManagerList = this.showSelectManagerList;
                this.dialogVisible = true
            },
            handeGetManagerList() {
                this.$api.getManagerList({pageSize: 0}).then(res => {
                    this.managerList = res.data || [];
                    // this.showSelectManagerList = this.managerList.map(it=>it.id);
                    this.managerList.map(it => {
                        this.managerListMap = {
                            ...this.managerListMap,
                            [it.id]: it.nameAlias
                        }
                    })
                })
            },
            handleChangeFormStatementYear(val) {
                if (val == 1) {
                    this.formStatement.startDate = moment(new Date()).startOf('year').format('YYYY-MM-DD');
                    this.formStatement.endDate = moment(new Date()).format('YYYY-MM-DD');
                    this.btn_jiekou();
                }

            },
            handleChangeFormStatementDate(val) {
                if (val == 1) {
                    this.formStatement.startDate = moment(new Date()).startOf('month').format('YYYY-MM-DD');
                    this.formStatement.endDate = moment(new Date()).format('YYYY-MM-DD');
                    this.btn_jiekou();
                } else if (val == 2) {
                    this.formStatement.startDate = moment().month(moment().month() - 1).startOf('month').format('YYYY-MM-DD');
                    this.formStatement.endDate = moment().month(moment().month() - 1).endOf('month').format('YYYY-MM-DD');
                    this.btn_jiekou();
                } else {
                    this.formStatement.startDate = ''
                    this.formStatement.endDate = ''
                }
            },
            handleChangeDateRange(val) {
                this.formStatement.startDate = moment(val[0]).format('YYYY-MM-DD');
                this.formStatement.endDate = moment(val[1]).format('YYYY-MM-DD');
                this.btn_jiekou();
            },
            handleChangeMonthRange(val) {
                this.formStatement.startDate = moment(val[0]).format('YYYY-MM-DD');
                this.formStatement.endDate = moment(val[1]).endOf('month').format('YYYY-MM-DD');
                this.btn_jiekou();
            },
            handleTest(val) {
            },
            handleChangeFormStatementType(val) {
                console.log(val)
                if (val == 1) {//按天
                    // if (this.formStatement.date == 1) {//本月
                    //     this.formStatement.startDate = moment(new Date()).startOf('month').format('YYYY-MM-DD');
                    //     this.formStatement.endDate = moment(new Date()).format('YYYY-MM-DD');
                    //     this.btn_jiekou();
                    //
                    // } else if (this.formStatement.date == 2) {//上月
                    //     this.formStatement.startDate = moment().month(moment().month() - 1).startOf('month').format('YYYY-MM-DD');
                    //     this.formStatement.endDate = moment().month(moment().month() - 1).endOf('month').format('YYYY-MM-DD');
                    //     this.btn_jiekou();
                    // }else{
                    //     this.formStatement.startDate = '';
                    //     this.formStatement.endDate = '';
                    //     this.formStatement.daterange = ''
                    //     // this.btn_jiekou();
                    // }
                    this.formStatement.date == 1
                    this.formStatement.startDate = moment(new Date()).startOf('month').format('YYYY-MM-DD');
                    this.formStatement.endDate = moment(new Date()).format('YYYY-MM-DD');
                    this.btn_jiekou();
                } else if (val == 2) {
                    // if () {}
                    this.formStatement.year == 1
                    this.formStatement.startDate = moment(new Date()).startOf('year').format('YYYY-MM-DD');
                    this.formStatement.endDate = moment(new Date()).format('YYYY-MM-DD');
                    this.btn_jiekou();
                }

            },
            handleChangeSettlement(val) {
                this.settlement = val;
                this.btn_jiekou();
            },
            btn_jiekou() {
                // if((this.formStatement.type=='1' && this.formStatement.date == '3') || (this.formStatement.type=='2' && this.formStatement.year == '2')){
                //     if(!this.formStatement.startDate){
                //         this.$message.warning('请选择开始时间!');
                //         return;
                //     }
                //     if(!this.formStatement.endDate){
                //         this.$message.warning('请选择结束时间!');
                //         return;
                //     }
                //     if(this.formStatement.startDate > this.formStatement.endDate){
                //         this.$message.warning('结束时间不能大于开始时间!');
                //         return;
                //     }
                // }
                if (this.formStatement.type == '1') {
                    if (moment(this.formStatement.endDate).diff(this.formStatement.startDate, 'days') + 1 > 31) {
                        this.$message.warning('最多选31天');
                        return;
                    }
                } else if (this.formStatement.type == '2') {
                    if (moment(this.formStatement.endDate).diff(this.formStatement.startDate, 'months') + 1 > 12) {
                        this.$message.warning('最多选12个月');
                        return;
                    }
                }
                if (!this.formStatement.endDate) {
                    this.$message.warning('请选择日期');
                    return;
                }
                this.divDisabled = true;
                this.currentPage = 1;
                this.getData();
                // this.drawChart()
            },
            handleShowNull(list) {
                console.log(list)
                if (list.every(it => it === 0 || it === null)) {
                    console.log('1')
                    this.showNull = true;
                } else {
                    console.log('2')
                    this.showNull = false;
                }
            },
            getData() {
                // if(this.formStatement.type == '1'){
                //     if(this.formStatement.date == '1'){
                //         this.formStatement.startDate = new Date().getFullYear()+'-'+((new Date().getMonth()+1).toString().length==1?'0'+(new Date().getMonth()+1):(new Date().getMonth()+1))+'-01'
                //         this.formStatement.endDate = Interval.getDay(0)
                //     }else if(this.formStatement.date == '2'){
                //         this.formStatement.startDate = this.timesd.strDate
                //         this.formStatement.endDate = this.timesd.endDate
                //     }else if(this.formStatement.date == '3'){
                //         // this.formStatement.startDate = this.formStatement.startDate
                //         // this.formStatement.endDate = this.formStatement.endDate
                //     }
                // }else if(this.formStatement.type == '2'){
                //     if(this.formStatement.year == '1'){
                //         this.formStatement.startDate = new Date().getFullYear()+'-01'+ '-01'
                //         this.formStatement.endDate = Interval.getDay(0)
                //     }else if(this.formStatement.year == '2'){
                //         // this.formStatement.startDate = this.formStatement.startDate
                //         // this.formStatement.endDate = this.formStatement.endDate
                //     }
                // }

                let params = {
                    // pageNum: this.currentPage,
                    // pageSize: this.pageSize,
                    type: this.formStatement.type,
                    startDate: this.formStatement.startDate ? this.formStatement.startDate : '',
                    endDate: this.formStatement.endDate ? this.formStatement.endDate : '',
                    taskIds: this.ids.join(','),
                    status: this.settlement,
                    managerId: this.showManger,
                    // dataSource: this.formStatement.dataSource,
                }
                if (this.settlement === 4) {
                    delete params.status
                } else {
                    delete params.taskIds
                }
                this.toParams = params;
                console.log(this.options)
                this.$api.classTaskProfit(params).then(res => {
                    console.log(res)
                    if (res.data.respCode == 0) {
                        if (res.data.data) {
                            if (res.data.data.classTaskProfitList) {
                                let result = Array.from(res.data.data.classTaskProfitList);
                                let {expendTotal, expend, inComeTotal, inCome, profitTotal, profit,x} = res.data.data;
                                this.tableData = res.data.data.classTaskProfitList
                                this.formStatement.inCome = inComeTotal.toFixed(2)
                                this.formStatement.inComeList = inCome
                                this.formStatement.expend = expendTotal.toFixed(2)
                                this.formStatement.expendList = expend
                                this.formStatement.profit = profitTotal.toFixed(2)
                                this.formStatement.profitList = profit
                            } else {
                                this.tableData = []
                                this.formStatement.inCome = 0
                                this.formStatement.inComeList = []
                                this.formStatement.expend = 0
                                this.formStatement.expendList = []
                                this.formStatement.profit = 0
                                this.formStatement.profitList = []
                            }
                            this.options.xAxis.data = res.data.data.x;
                            this.drawChart()
                        }
                    }
                }).catch()
            },
            drawChart() {
                if (this.formStatement.dataSource == '1') {
                    this.options.series[0].data = this.formStatement.inComeList.map(it => {
                            if (it === 0) {
                                return null;
                            } else {
                                return it;
                            }
                        }
                    )
                    this.options.yAxis.name = '收入'
                    this.options.series[0].name = '收入'
                    this.handleShowNull(this.formStatement.inComeList);
                } else if (this.formStatement.dataSource == '2') {
                    this.options.series[0].data = this.formStatement.expendList.map(it => {
                            if (it === 0) {
                                return null;
                            } else {
                                return it;
                            }
                        }
                    )
                    this.options.yAxis.name = '支出'
                    this.options.series[0].name = '支出'
                    console.log(this.formStatement.expendList)
                    this.handleShowNull(this.formStatement.expendList);
                } else if (this.formStatement.dataSource == '3') {
                    this.options.series[0].data = this.formStatement.profitList.map(it => {
                            if (it === 0) {
                                return null;
                            } else {
                                return it;
                            }
                        }
                    )
                    this.options.yAxis.name = '利润'
                    this.options.series[0].name = '利润'
                    console.log(this.formStatement.profitList)
                    this.handleShowNull(this.formStatement.profitList);
                }
                let chartmainline = this.$echarts.init(document.getElementById("chartmainline"));
                chartmainline.setOption(this.options)
            },
            btn_true() {
                this.currentPage = 1
                this.getData()
                this.drawChart()
            },
            goToChooseTask() {
                // const {href} = this.$router.resolve({name: 'chooseTask'})
                // window.open(href,'_self')
                this.showClassDia = true
            },
            handleCurrentChange(val) {
                this.currentPage = val
                this.getData()
            },
            xAxisdata1() {
                var data = [];
                //获取年月日
                var date = new Date();
                var seperator1 = "-";
                var year = date.getFullYear();
                var month = date.getMonth() + 1;
                var strDate;
                if (month >= 1 && month <= 9) {
                    month = "0" + month;
                }
                if (Number(month) == 1) {
                    year = year - 1
                    month = 12
                }
                if (Number(month) - 1 == 1 || Number(month) - 1 == 3 || Number(month) - 1 == 5 || Number(month) - 1 == 7 || Number(month) - 1 == 8 || Number(month) - 1 == 10 || Number(month) - 1 == 12) {
                    strDate = 31;
                } else if (Number(month) - 1 == 2) {
                    var a1 = year % 4 == 0;
                    var a2 = year % 100 != 0;
                    var a3 = year % 400 == 0;
                    strDate = (a1 && a2) || a3 ? 29 : 28;
                } else {
                    strDate = 30
                }
                for (var i = 1; i <= Number(strDate); i++) {
                    var dt = i
                    if (dt >= 0 && dt <= 9) {
                        dt = "0" + i;
                    }
                    if (month >= 1 && month <= 9) {
                        data.push(year + seperator1 + '0' + Number(month - 1) + seperator1 + dt)
                    } else {
                        data.push(year + seperator1 + Number(month - 1) + seperator1 + dt)
                    }
                }
                this.timesd = {
                    strDate: data[0],
                    endDate: data[data.length - 1]
                }
            },
        }
    }
</script>

<style scoped lang="scss">
    .radio-search .el-radio__input {
        display: none;
    }

    .alertText {
        font-size: 14px;
        margin-top: 20px;
    }
    .content {
        background: #ffffff;
    }

    .top {
        padding-top: 20px;
    }

    .bottom {
        /* border-bottom:1px solid #EAEDF4; */
    }

    .el-form-item {
        margin-bottom: 0;
    }

    .formSearchMargin {
        padding-left: 20px;
    }

    .newbtn {
        margin-left: 20px;
        height: 30px !important;
    }

    .el-btn {
        font-size: 12px;
        color: #E9481C;
        background: #FFEFEA;
        border: 1px solid #F7BEB2;
        border-radius: 2px;
        width: 119px !important;
        height: 30px !important;
    }

    .el-radio-group {
        display: block;
        background: #ffffff;
        padding-left: 30px;
    }

    .pagination-container {
        background: #ffffff;
    }

    .new_btn.el-button--default {
        line-height: 0px !important;
    }


    .u-already-list {
        margin-bottom: 10px;
        .u-already-item {
            position: relative;
            /*border: 1px solid #DCDFE6;*/
            padding:0 16px;
            img{
                position: absolute;
                width: 16px;
                height: 16px;
                top: -5px;
                right: -10px;
            }
        }
    }

    .el-radio-group {
        display: flex;
        flex-wrap: wrap;
    }

</style>
