<template>
    <div class="waitPamentReplaceContainer" v-loading="loading" element-loading-text="正在导出excel表...">
        <h3 class="sche-title">{{fromParams.outsourcingCusName || '' }} - {{fromParams.batchNumber}}</h3>
        <search-bar class="bg-fff mb10" @handleSearch="searchNow" placeholder="请输入零工姓名"/>
        <div class="table-box back-white">
            <div class="exportContainer">
                <div class="exportLeftCon">
                    <el-button size="small" class="myplain-btn setWidth" :disabled="tableData.length == 0"
                               @click="exportAction">
                        导出
                    </el-button>
                </div>

            </div>
            <el-table class="table-outline" :data="tableData" emptyText="暂无相关信息" :summary-method="getSummaries"
                      show-summary
                      style="width: 100%;">
                <el-table-column label="序号" prop="">
                    <template v-slot="scope">
                        <span>{{scope.$index+1}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="姓名" prop="realNameAlias"></el-table-column>
                <el-table-column label="签到天数" prop="attendance"></el-table-column>
                <el-table-column label="工时" prop="workHours"></el-table-column>
                <el-table-column label="产量" prop="">
                    <template v-slot="scope">
                        <span>{{scope.row.jian | toFixeFortter}}件 </span>
                        <span>{{scope.row.dai | toFixeFortter}}袋 </span>
                        <span>{{scope.row.che | toFixeFortter}}车 </span>
                        <span>{{scope.row.dun | toFixeFortter2}}吨 </span>
                    </template>
                </el-table-column>
                <el-table-column label="收入合计（元）" prop="salary"></el-table-column>
                <el-table-column label="奖惩合计(元)" prop="">
                    <template v-slot="scope">
                        <span>{{scope.row.punish+scope.row.reward}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="应发收入(元)" prop="shouldSalary"></el-table-column>
                <el-table-column label="扣款合计(元)" prop="otherAmount"></el-table-column>
                <el-table-column label="实发收入(元)" prop="totalAmount"></el-table-column>
                <el-table-column label="奖惩锁定" prop="">
                    <template v-slot="scope">
                        <div class="lock-box">
                            <el-switch
                                    @change="swtichlock(scope.row)"
                                    v-model="scope.row.isRPLock"
                                    active-color="#ff4949"
                                    active-text="开"
                                    inactive-text="关"
                                    inactive-color="#C8C8C8">
                            </el-switch>
                            <span class="lock-mask"></span>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column label="操作" min-width="240">
                    <template v-slot="scope">
                        <div class="operateCon">
                            <div class="subItem" @click="goToHandlerDetails(scope.row)"><img :src="icon1"/><span>收入明细</span></div>
                            <div class="subItem" @click="goToReward(scope.row)"><img :src="icon2"/><span>奖惩明细</span></div>
                            <div class="subItem" @click="goToDeductions(scope.row)"><img :src="icon3"/><span>扣款明细</span></div>
                            <div class="subItem" @click="goToPayHistory(scope.row)"><img :src="icon3"/><span>付款记录</span></div>
                        </div>
                    </template>
                </el-table-column>
            </el-table>
            <div class="pagination-container">
                <el-pagination class="pagebox" layout="total,prev, pager, next" @current-change="handleCurrentChange"
                               :current-page="currentPage" :page-count="pageCount" :total="total">
                </el-pagination>
            </div>
        </div>
    </div>
</template>
<script>
    import SearchBar from '@/components/SearchBar'
    export default {
        components: { SearchBar },
        data() {
            return {
                total: 0,
                currentPage: 1,
                pageCount: 0,
                pageSize: 20,
                fromParams: {},
                tableData: [],
                keyWord:'',
                isDisabled: true,
                loading: false,
                totalMount: {},
                icon1:require('@/assets/icons/icon_1541.png'),
                icon2:require('@/assets/icons/icon_1542.png'),
                icon3:require('@/assets/icons/icon_1543.png'),
            }
        },
        filters:{
            toFixeFortter(val){
                if(val){
                    return Number(val).toFixed(0)
                }else{
                    return 0
                }
            },
            toFixeFortter2(val){
                if(val){
                    return Number(val).toFixed(2)
                }else{
                    return 0
                }
            }
        },
        mounted() {
            this.fromParams = this.$route.query;
            console.log(this.fromParams);
            this.detail()
        },
        methods: {
            paytype(val) {
                let payWay = val.payWay;
                if (payWay == '2') {
                    return '线上'
                } else if (payWay == '1') {
                    return '线下'
                } else if (payWay == '4') {
                    return '薪福多'
                }else if (payWay == '5') {
                    return '薪企云服'
                } else if (payWay == '6') {
                    return JSON.parse(localStorage.userInfo).customerShortName || '--'
                }else {
                    return '--'
                }
            },
            paytime(val) {
                if(val.payTime){
                    return val.payTime.substring(0,16);
                }else{
                    return ' '
                }
            },
            swtichlock(row){
                console.log(row.isRPLock)
                let params = {
                    status: '',  //1.锁定 2.不锁定,
                    customerId:row.customerId,// 经理人id,
                    outsourcingCusId:this.$route.query.outsourcingCusId, //外包商id，不必传,
                    batchNumber:row.batchNumber,// "批次",
                    talentIdList:[row.talentId], //普工id集合数组
                }
                let text,textTwo;
                if(row.isRPLock){//表示锁定了
                    row.isRPLock = false;
                    params['status'] = '1'
                    text = '开启';
                    textTwo = '该零工该批次收入无法添加奖惩'
                }else{
                    row.isRPLock = true;
                    params['status'] = '2'
                    text = '关闭';
                    textTwo = '该零工该批次收入可以添加奖惩'
                }
                this.$confirm(`${text}锁定奖惩后，${textTwo}`, `确定对该批次中该零工${text}奖惩锁定？`, {
                    confirmButtonText: '确认',
                    cancelButtonText: '取消',
                    center:true,
                }).then(async (action) => {
                    let { data } = await this.$api.lockToggle(params);
                    if(data.respCode === 0){
                        if(row.isRPLock){//表示锁定了
                            row.isRPLock = false;
                            this.$message.success('解锁成功!')
                        }else{
                            row.isRPLock = true;
                            this.$message.success('锁定成功!')
                        }
                    }
                }).catch(() => {

                })
            },
            searchNow(val){
                this.currentPage = 1;
                this.keyWord = val
                this.detail()
            },
            detail() {
                let _this = this;
                let params = {
                    userName:_this.keyWord,
                    pageNum: _this.currentPage,
                    pageSize: _this.pageSize,
                    batchNumber: _this.fromParams.batchNumber,//开始时间
                    settlementType: _this.fromParams.settlementType,//结算方式 (1日结2月结4周结)
                    payStatus: '2',//结算状态 (1未结算2已结算默认未结算)
                    payType: _this.fromParams.payType,	//费用类型
                    showOutsourcing:true,
                    outsourcingCusId: this.$route.query.outsourcingCusId,
                };
                _this.$api.payDetail(params).then(res => {
                    if (res.respCode === 0) {
                        if (res.data.page.list && res.data.page.list.length > 0) {
                            _this.tableData = Array.from(res.data.page.list);
                            _this.total = res.data.page.total;
                            _this.pageCount = res.data.page.pages;
                            _this.totalMount = res.data.total;
                            _this.isDisabled = false;
                        } else {
                            _this.tableData = [];
                            _this.total = 0;
                            _this.pageCount = 0;
                            _this.totalMount = {};
                            _this.isDisabled = true;
                        }
                        console.log(res);
                    }
                }).catch(err => {
                    console.log(err)
                })
            },
            handleCurrentChange(val) {
                this.currentPage = val
                this.detail()
            },
            getSummaries(param) {
                const {columns, data} = param;
                const sums = [];
                sums[0] = '合计'
                sums[1] = ''
                sums[2] = this.totalMount.attendance || 0
                sums[3] = this.totalMount.workHours || 0
                sums[4] = `
                      ${this.totalMount.jian ? this.totalMount.jian.toFixed(0) + '件' : '0件'},
                      ${this.totalMount.dai ? this.totalMount.dai.toFixed(0) + '袋' : '0袋'},
                      ${this.totalMount.che ? this.totalMount.che.toFixed(0) + '车' : '0车'},
                      ${this.totalMount.dun ? this.totalMount.dun.toFixed(2) + '吨' : '0吨'}
                      `
                sums[5] = this.totalMount.salary || 0
                sums[6] = this.totalMount.punish ? this.totalMount.punish : 0 + (this.totalMount.reward || 0);
                sums[7] = this.totalMount.shouldSalary || 0;
                sums[8] = this.totalMount.otherAmount || 0;
                sums[9] = this.totalMount.totalAmount || 0;
                sums[10] = ""
                sums[11] = ""
                sums[12] = ""
                return sums;
            },
            exportAction() {
                let _this = this;
                let params = {
                    userName:_this.keyWord,
                    pageNum: _this.currentPage,
                    pageSize: _this.pageSize,
                    batchNumber: _this.fromParams.batchNumber,//开始时间
                    settlementType: _this.fromParams.settlementType,//结算方式 (1日结2月结4周结)
                    payStatus: '2',//结算状态 (1未结算2已结算默认未结算)
                    payType: _this.fromParams.payType,	//费用类型
                    showOutsourcing:true,
                    outsourcingCusId: this.$route.query.outsourcingCusId,
                };
                _this.loading = true
                this.$api.exportSalary(params).then(res => {
                    if (res.respCode == 0) {
                        setTimeout(() => {
                            _this.loading = false
                        }, 2000)
                        if (res.data) {
                            window.open(res.data)
                        }
                    }
                }).catch()
            },
            goToPayHistory(row){
                let query = Object.assign(row, {outsourcingCusName:this.fromParams.outsourcingCusName,outsourcingCusId: this.$route.query.outsourcingCusId,})
                console.log(row,'row')
                const {href} = this.$router.resolve({
                    path: 'outPayHistory',
                    query: query
                });
                window.open(href, '_blank')
                },
            goToHandlerDetails(row) {
                let query = Object.assign(row,{payStatus:'2',outsourcingCusName:this.fromParams.outsourcingCusName,outsourcingCusId: this.$route.query.outsourcingCusId,})
                const {href} = this.$router.resolve({
                    path: 'outHandlerDetails',
                    query: query
                });
                window.open(href, '_blank')
            },
            goToReward(row) {
                let query = Object.assign(row,{payStatus:'2',outsourcingCusName:this.fromParams.outsourcingCusName,outsourcingCusId: this.$route.query.outsourcingCusId,})
                const {href} = this.$router.resolve({
                    path: 'outRewardDetails',
                    query: query
                });
                window.open(href, '_blank')
            },
            goToDeductions(row) {
                let query = Object.assign(row,{payStatus:'2',outsourcingCusName:this.fromParams.outsourcingCusName,outsourcingCusId: this.$route.query.outsourcingCusId,})
                const {href} = this.$router.resolve({
                    path: 'outDeductionsDetails',
                    query: query
                });
                window.open(href, '_blank')
            },
        },
    }
</script>
<style scoped lang="scss">
    .waitPamentReplaceContainer {
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

        .questionMark {
            color: #E94A1E;
            font-size: 18px;
            cursor: pointer;
        }

        .exportContainer {
            height: 55px;
            display: flex;
            flex-direction: row;
            flex-wrap: wrap;
            justify-content: space-between;
            align-content: center;
            align-items: center;
            padding-left: 30px;
            padding-right: 22px;
            box-sizing: border-box;

            .exportLeftCon {
                .setWidth {
                    width: 90px;
                }
            }
        }
    }

    .sche-title {
        text-align: center;
        font-size: 20px;
        font-stretch: normal;
        line-height: 2;
        letter-spacing: 1px;
        color: #262626;
        padding-top: 20px;
        font-weight: bold;
        margin-bottom: 20px;
    }
</style>
<style lang="scss">
    .waitPamentReplaceContainer {
        .cg-disable-select {
            color: #C8CACC;
            .lock-box{
                position: relative;
                .lock-mask{
                    position: absolute;
                    left: 0;
                    right: 0;
                    top: 0;
                    bottom: 0;
                    opacity: 0;
                }
                .el-switch__label *{
                    display:none;
                }
            }
            .el-switch__core{
                background-color:#fff !important;
                border-color:#eee !important;
            }
            .el-switch__core:after{
                top: 0;
                left: 0;
                border:1px solid #eee;
            }
        }
        .el-button--small {
            font-size: 12px;
            background-color: #ffefea;
            border: 1px solid #f7beb2;
            color: #e9481c;
        }
        .subItem{
            img,span{
                display: inline-block;
                margin:0 2px 0 -1px;
                vertical-align: middle;
            }
            img{
                width: 13px;
                height:15px;
                margin-right:3px;
            }
        }
        .el-button.is-disabled {
            color: #C0C4CC;
            cursor: not-allowed;
            background-color: #FFFFFF;
            border-color: #EBEEF5;
        }

        .el-table .cell {
            text-align: center;
            word-break: inherit;
        }

        .centerDialog {
            .el-dialog__header {
                border-bottom: none;
            }

            .el-dialog {
                position: absolute;
                left: 0;
                right: 0;
                bottom: 0;
                top: 0;
                margin: auto !important;
                width: 600px;
                height: 210px;
            }

        }

    }
</style>
