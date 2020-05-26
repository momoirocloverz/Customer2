<template>
    <div class="paiedContainer" v-loading="loading" element-loading-text="正在请求中...">
        <el-form ref="formDetail" :model="formDetail" class="masterForm" label-width="90px" labelPosition="left">
            <div class="combine-zone">
                <el-form-item label="日期范围：" class="formSearchMargin fixMark ">
                    <el-radio-group class="radio-search" v-model="formDetail.date">
                        <el-radio label="">不限</el-radio>
                        <el-radio label="5">本月</el-radio>
                        <el-radio label="1">最近7天</el-radio>
                        <el-radio label="2">最近30天</el-radio>
                        <el-radio label="3">最近90天</el-radio>
                        <el-radio label="4">自定义</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="自定义：" class="formSearchMargin marTimer" v-if="formDetail.date == '4'">
                    <el-date-picker class="margin_left40" size="mini" v-model="formDetail.startDate" type="date"
                                    value-format="yyyy-MM-dd" placeholder="选择开始时间">
                    </el-date-picker>
                    --
                    <el-date-picker class="margin_left10" size="mini" v-model="formDetail.endDate" type="date"
                                    value-format="yyyy-MM-dd" placeholder="选择结束时间">
                    </el-date-picker>
                    <el-button type="primary" size="small" class="datesearchBtn" @click="btn_true">确定</el-button>
                </el-form-item>
                <el-form-item label="结算方式：" class="formSearchMargin fixMark marginTopSp">
                    <el-radio-group class="radio-search" v-model="formDetail.settlementType">
                        <el-radio label="">不限</el-radio>
                        <el-radio label="2">月结</el-radio>
                        <el-radio label="4">周结</el-radio>
                        <el-radio label="1">日结</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="外包商：" class="formSearchMargin fixMark marginTopSp">
                    <el-radio-group  class="radio-search" v-model="formDetail.outsourcingCusId">
                        <el-radio v-for="(item,index) in outSourceLists" :label="item.id" :value="item.id" :key="item.id">{{item.name}}</el-radio>
                    </el-radio-group>
                </el-form-item>
            </div>
        </el-form>
        <div class="infoContainer">
            <div class="infoTextCon">
                <div>
                    共{{total}}条记录，外包费用{{salary}}元，合计{{outCost + salary | forSalary}}元
                </div>
            </div>
        </div>
        <div class="table-box back-white">
            <el-table class="table-outline" :data="tableData" emptyText="暂无相关明细" style="width: 100%;">
                <el-table-column label="批次" prop="batchNumber" ></el-table-column>
                <el-table-column label="人数" prop="popmount" ></el-table-column>
                <el-table-column label="结算方式" prop="settlementTypeName" show-overflow-tooltip ></el-table-column>
                <el-table-column label="外包商" prop="outsourcingCusName"></el-table-column>
                <el-table-column label="实发金额（元）" prop="totalAmount"></el-table-column>
                <el-table-column label="操作" show-overflow-tooltip align="center" >
                    <template v-slot="scope">
                        <el-button type="text" class="btn-icon btn-icon-view" size="mini"
                                   @click="goToWaiting(scope.row)">查看
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
            <div class="pagination-container" v-if="pageCount">
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
                time: 10,
                isDisabled: false,
                total: 0,
                notTotal: 0,
                pageSize:20,
                currentPage: 1,
                pageCount: 0,
                outCost:0,
                salary:0,
                formDetail: {
                    date: '5',
                    settlementType: '',
                    settlementStatus: '2',//已付
                    startDate: '',
                    endDate: '',
                    payOutType:"",
                    outsourcingCusId:'',
                },
                tableData: [],
                moreTotal: {},
                taskList: [],
                operateIcon: require('@/assets/icons/btnicons/view.png'),
                loading:false,
                outSourceLists:[],
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
            'formDetail.outsourcingCusId': function (val) {
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
                        // this.formDetail.endDate = Interval.getDay(0)
                        this.formDetail.endDate = this.Moment(Date.now()).endOf('month').format('YYYY-MM-DD')
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
            //默认展示本月
            // this.formDetail.endDate = Interval.getDay(0)
            this.formDetail.endDate = this.Moment(Date.now()).endOf('month').format('YYYY-MM-DD')
            this.formDetail.startDate = `${this.Moment(Date.now()).format('YYYY-MM')}-01`;
            this.getPayList()
            this.geOutLists()
        },
        methods: {
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
                    showOutsourcing:true,
                    outsourcingCusId:this.formDetail.outsourcingCusId,
                };
                this.$api.getPayList(params).then(res=>{
                    if(res.respCode === 0){
                        console.log(res.data)
                        if (res.data.page.list && res.data.page.list.length > 0) {
                            _this.tableData = Array.from(res.data.page.list);
                            _this.total = res.data.page.total;
                            _this.pageCount = res.data.page.pages;
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
                this.getPayList();
            },
            taskNameFormatter(row, column, cellValue) {
                if (cellValue == '1') {
                    return '薪企云服'
                } else if(cellValue == '2') {
                    return '薪福多'
                }
            },
            handleCurrentChange(val) {
                this.currentPage = val;
                this.getPayList();
            },
            goToWaiting(item){
                this.$router.push({
                    path:'outPaiedReplace',
                    query:item
                })
            },
        },
    }
</script>
<style scoped lang="scss">
    .paiedContainer {
        background-color: #f2f2f5;
        .masterForm {
            background-color: #fff;
            padding-left: 20px;
        }

        .marginTopSp {
            margin-top: 10px;
        }

        .marTimer {
            margin-top: 10px;
            margin-bottom: 10px;
        }

        .infoContainer {
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

        .radioGroupCon {
            padding: 13px 0;
            display: flex;
        }
    }

    .formSearchMargin {
        margin-bottom: 0;
    }

    .goToWaiting {
        cursor: pointer;
    }

    .datesearchBtn {
        margin-left: 15px;
    }

    .searchBtn {
        width: 100px;
        height: 34px;
        margin-left: 15px;
    }

    .operateIcon {
        height: 18px;
        width: 18px;
        vertical-align: -5px;
        margin-right: 10px;
    }
</style>
<style lang="scss">
    .paiedContainer {
        .el-table .cell {
            text-align: center;
        }

        .combine-zone {
            padding-top: 20px;
            padding-bottom: 14px;

            .el-form-item__label {
                font-size: 12px;
            }

            .fixMark {
                .el-radio__label {
                    font-size: 12px;
                }

                .el-form-item__label {
                    line-height: 32px;
                }

                .el-form-item__content {
                    line-height: 18px;
                }

                .el-radio-group {
                    height: 18px;
                }
            }
        }
    }
</style>