<template>
    <div class="affiliated-task">
        <el-form ref="searchForm" :model="searchForm" label-width="100px" labelPosition="left" class="searchThisForm">
            <div class="search-zone">
                <el-input class="searchMaster" clearable placeholder="输入任务名称搜索" prefix-icon="el-icon-search"
                          v-model="searchForm.taskName"></el-input>
                <div class="charge-btn" @click="searchNow">搜索</div>
                <el-button class="comb-btn" size="mini" type="text" @click="handleCombShow">高级筛选<i
                        class="el-icon-right el-icon-d-arrow-right"
                        :class="isShowComb ? 'el-icon-d-arrow-right-down' : 'el-icon-d-arrow-right-right'"></i>
                </el-button>
            </div>
            <transition name="router-fade" mode="out-in">
                <div class="combine-zone pt10" v-if="isShowComb">
                    <el-form-item label="任务所属：" class="formSearchMargin wrapThis mb10">
                        <el-radio-group class="radio-search flexWrap" v-model="searchForm.belongtoItem">
                            <el-radio label="">不限</el-radio>
                            <el-radio :label="item.belongTo" v-for="(item,index) in belongtoList" :key="index">
                                {{item.belongToName}}
                            </el-radio>
                        </el-radio-group>
                    </el-form-item>
                    <el-form-item label="结算方式：" class="resetFormItem formSearchMargin mb10">
                        <el-radio-group class="radio-search" v-model="searchForm.settlementType">
                            <el-radio label="">不限</el-radio>
                            <el-radio label='2'>月结</el-radio>
                            <el-radio label="4">周结</el-radio>
                            <el-radio label="1">日结</el-radio>
                        </el-radio-group>
                    </el-form-item>
                    <el-form-item label="结算状态：" class="resetFormItem formSearchMargin mb10">
                        <!--1：待挂靠确认-班务经理领取的任务就是该状态\r-->
                        <!--2：待对方确认-挂靠经理人同意后需要发任务的经理人进行确认\r-->
                        <!--3：领取成功-发任务的经理人同意\r-->
                        <!--4：领取失败-发任务的经理人拒绝\r-->
                        <!--5：挂靠失败-挂靠经理不同意该挂靠任务\r-->
                        <!--6：已放弃-1状态下班务经理进行放弃操作或2状态下挂靠经理人进行放弃操作",-->
                        <el-radio-group class="radio-search" v-model="searchForm.status">
                            <el-radio label="">不限</el-radio>
                            <el-radio label='2'>待对方确认</el-radio>
                            <el-radio label='1'>待挂靠确认</el-radio>
                            <el-radio label='3'>领取成功</el-radio>
                            <el-radio label='4'>领取失败</el-radio>
                            <el-radio label='5'>挂靠失败</el-radio>
                            <el-radio label='6'>已放弃</el-radio>
                        </el-radio-group>
                    </el-form-item>
                </div>
            </transition>
        </el-form>
        <div class="table-box back-white">
            <el-table :data="tableData" empty-text="暂无相关信息">
                <el-table-column label="任务名称" prop="taskName" show-overflow-tooltip align="center"></el-table-column>
                <el-table-column align="center" label="发布人" prop="publisherName"
                                 show-overflow-tooltip></el-table-column>
                <el-table-column align="center" label="领取人" prop="receiverName"
                                 show-overflow-tooltip></el-table-column>
                <el-table-column align="center" label="开始日期" prop="startTime" min-width="100" :formatter="timeFormatter"
                                 show-overflow-tooltip></el-table-column>
                <el-table-column align="center" label="结束日期" prop="endTime" min-width="100" :formatter="timeFormatter"
                                 show-overflow-tooltip></el-table-column>
                <el-table-column align="center" label="结算方式" prop="settlementType" :formatter="settlementTypeFormatter"
                                 show-overflow-tooltip></el-table-column>
                <el-table-column align="center" label="类型" prop="presetTaskType" :formatter="forStatus"
                                 show-overflow-tooltip></el-table-column>
                <el-table-column align="center" label="所需人数" prop="cusAuthorizedNumber"
                                 show-overflow-tooltip></el-table-column>
                <el-table-column align="center" label="任务单价" prop="price" :formatter="priceFormatter"
                                 show-overflow-tooltip></el-table-column>
                <el-table-column align="center" label="挂靠费" prop="hookRate" :formatter="formatterRate"
                                 show-overflow-tooltip></el-table-column>
                <el-table-column align="center" label="保证金" prop="deposit" show-overflow-tooltip></el-table-column>
                <el-table-column align="center" label="状态" prop="status" :formatter="statusTypeFormatter"
                                 show-overflow-tooltip></el-table-column>
                <el-table-column align="center" label="操作" min-width="180">
                    <template v-slot="scope">
                        <div class="operateCon">
                            <el-button v-show="scope.row.status == 1" type="text" class="btn-icon btn-icon-agree" size="mini"
                                       @click="agree(scope.row)">同意
                            </el-button>
                            <el-button v-show="scope.row.status == 1" type="text" class="btn-icon btn-icon-reject" size="mini"
                                       @click="refuse(scope.row)">拒绝
                            </el-button>
                            <el-button v-show="scope.row.status == 2" type="text" class="btn-icon btn-icon-reject" size="mini"
                                       @click="giveUp(scope.row)">放弃
                            </el-button>
                            <el-button v-show="[4,5,6].includes(scope.row.status)" type="text" class="btn-icon btn-icon-reject" size="mini"
                                       @click="deleteUp(scope.row)">删除
                            </el-button>
                            <el-button type="text" class="btn-icon btn-icon-view" size="mini"
                                       @click="routeToDetail(scope.row)">查看
                            </el-button>
                        </div>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <div class="pagination-container" v-if="total">
            <el-pagination class="pagebox" layout="total , prev, pager, next, jumper" :total="total"
                           @current-change="handleCurrentChange" :current-page="currentPage" :page-size="pageSize">
            </el-pagination>
        </div>
        <!-- 编辑零工start -->
        <el-dialog :title="`确认同意班务经理${params.receiverName}领取【${params.publisherName}】的【${params.taskName}】任务吗？`"
                   :visible.sync="dialogVisible" width="740px" :center="true">
            <div class="overflow-box">
                <div class="flex-around f14 pb20 pl30 pr30"><span><strong>挂靠费:</strong>{{params.hookRate}}%</span><span><strong>保证金:</strong>{{params.deposit}}</span>
                </div>
                <el-form label-width="150px" label-position="right" :rules="rules" :model="dialogForm">
                    <el-form-item label="任务类型：" class=" mTop2 inpWidth woker-list">
                        <el-radio-group v-model="dialogForm.taskType">
                            <el-radio label='1'>代发-通过经理人代发发放</el-radio>
                            <el-radio v-if="getHavePayOwn != 1" label='2'>外包-通过平台外包商发放</el-radio>
                        </el-radio-group>
                    </el-form-item>
                    <el-form-item v-show="dialogForm.taskType == 2 && getHavePayOwn != 1" label="选择外包商：" prop="outSource">
                        <el-select v-model="dialogForm.outsourcingCusId" class="radius-input" style="width:280px"
                                   @change="handleCheckboxChange"
                                   placeholder="请选择">
                            <el-option v-for="(item,index) in outSourceLists" :key="index" :label="item.name"
                                       :value="item.id">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="我方签约客户全称:" prop="confirmingPerson">
                        <el-input v-model="dialogForm.signCustomerName" maxlength="21" auto-complete="off"
                                  style="width:280px"></el-input>
                        <div class="f14 co-999">用于生成客户确认表的表头</div>
                    </el-form-item>
                    <el-form-item label="日常产量确认人：" class=" mTop2 inpWidth">
                        <el-checkbox-group v-show="confirmList.length > 0"
                                v-model="dialogForm.confirmingId" >
                            <el-checkbox v-for="(item,index) in confirmList" :label="item.id" :key="index"
                                         :value="item.id">
                                {{item.nameAlias}}
                            </el-checkbox>
                        </el-checkbox-group>
                        <div class="" v-show="confirmList.length == 0">
                            请先在客户管理模块设置确认人
                        </div>
                    </el-form-item>
                </el-form>
            </div>
            <span slot="footer" class="dialog-footer">
            <el-button size="small" @click="cancel" v-if="">取 消</el-button>
            <el-button size="small" type="primary" @click="saveUpdate()">确 认</el-button>
        </span>
        </el-dialog>
    </div>
</template>

<script>
    import moment from 'moment';
    import { mapState, mapGetters, mapActions, mapMutations } from 'vuex'

    export default {
        components: {},
        data() {
            return {
                isShowComb: false,
                dialogVisible: false,
                searchForm: {
                    publisher: '',
                    settlementType: '',
                    taskName: '',
                    status: '',
                    belongtoItem: '',
                },
                dialogForm: {
                    taskType: '1',
                    signCustomerName: '',
                    outsourcingName:'',
                    outsourcingCusId: '',
                    confirmingId: [],
                },
                belongtoList: [],
                addList: [],
                outSourceLists: [],
                confirmList: [],
                tableData: [],
                total: 0,
                currentPage: 1,
                pageSize: 20,
                pickIcon: require('@/assets/icons/pick.png'),
                viewIcon: require('@/assets/icons/view.png'),
                rules: {
                    signCustomerName: [
                        {required: true, message: '客户全称不能为空!', trigger: 'blur'},
                    ],
                    outsourcingCusId: [
                        {required: true, message: '外包商不能为空!', trigger: 'blur'}
                    ],
                    confirmingId: [
                        {required: true, message: '请选择日常产量确认人!', trigger: 'blur'}
                    ],
                },
                params: {}
            }
        },
        computed:{
            ...mapGetters(['getHavePayOwn'])
        },
        watch: {
            "searchForm.belongtoItem": function (val, oldval) {
                this.unitRequest();
            },
            "searchForm.settlementType": function (val, oldval) {
                this.unitRequest();
            },
            "searchForm.status": function (val, oldval) {
                this.unitRequest();
            },
            'dialogForm.outsourcingCusId': function (val,oldVal) {
                if(val){
                    for(let item of this.outSourceLists){
                        if(val == item.id){
                            this.dialogForm.outsourcingName = item.name
                        }
                    }
                }
            }
        },
        mounted() {
            this.fetchList();
            this.getbelongtoList();
            this.geOutLists();
            this.getConfirm();
        },
        methods: {
            getConfirm() {
                this.$api.getConfirmList({
                    pageNum: 1,
                    pageSize: 0,
                    roleType: 1,
                }).then(res => {
                    this.confirmList = res.data.data.list;
                })
            },
            cancel() {
                this.dialogForm.taskType = '1';
                this.dialogForm.confirmingId = [];
                this.dialogForm.confirmingId = [];
                this.dialogForm.outsourcingCusId = '';
                this.dialogVisible = false;
            },
            handleCheckboxChange(val){
                console.log(val)
            },
            geOutLists() {
                let params = {
                    customerType: 2,
                    pageSize: 0,
                };
                this.$api.getOutLists(params).then(res => {
                    let {data: layer1} = res;
                    let {data, respCode} = layer1;
                    if (respCode === 0) {
                        if (data && data.list) {
                            this.outSourceLists = [...data.list];
                        } else {
                            this.outSourceLists = [];
                        }
                    } else {
                        this.outSourceLists = [];
                    }
                }).catch(err => {
                    console.log('err', err);
                })
            },
            saveUpdate() {
                let _this = this;
                if(this.dialogForm.taskType == 2){
                    if(!_this.dialogForm.outsourcingCusId){
                        return this.$message.error('外包商不能为空!')
                    }
                }
                if(!this.dialogForm.signCustomerName){
                    return this.$message.error('我方签约客户全称不能为空!')
                }
                if(this.dialogForm.confirmingId.length == 0){
                    return this.$message.error('日常产量确认人不能为空!')
                }
                if(_this.request){return}
                _this.request = true;
                let idStr = this.dialogForm.confirmingId.join(',');
                let params = {
                    receiveMId: this.params.receiveMId,
                    presetTaskType:this.dialogForm.taskType,
                    outsourcingCusId:this.dialogForm.outsourcingCusId,
                    outsourcingCusName:this.dialogForm.outsourcingName,
                    signCustomerName: this.dialogForm.signCustomerName,
                    cusConfirmIds:idStr,
                }
                this.$api.hookAgree(params).then(res => {
                    if (res.data.respCode === 0) {
                        this.$message.success('编辑成功!');
                        this.dialogForm.taskType = '1';
                        this.dialogForm.confirmingId = [];
                        this.dialogForm.outsourcingCusId = '';
                        this.dialogForm.outsourcingName = '';
                        this.dialogVisible = false;
                        this.fetchList();
                    }
                }).catch(err => {
                    this.$message.error(err)
                }).finally(() => {
                    setTimeout(() => {
                        _this.request = false;
                    }, 500)
                })

            },
            fetchList() {
                let params = {
                    pageNum: this.currentPage,
                    pageSize: this.pageSize,
                    status: this.searchForm.status,
                    publisherCustomerId: this.searchForm.belongtoItem,
                    settlementType: this.searchForm.settlementType,
                    taskName: this.searchForm.taskName,
                };
                this.$api.assignmentReceive(params).then(res => {
                    let {data: layer1} = res;
                    let {data, respCode} = layer1;
                    if (respCode === 0) {
                        this.total = data.total;
                        if (data.list) {
                            this.tableData = data.list;
                        } else {
                            this.tableData = [];
                        }
                    }
                }).catch(err => {
                    console.log(err)
                })
            },
            getbelongtoList() {
                this.$api.taskBelongSpToList().then(res => {
                    this.belongtoList = res.data;
                }).catch(error => {
                    console.log(error);
                });
            },
            unitRequest() {
                this.currentPage = 1;
                this.fetchList();
            },
            searchNow() {
                this.unitRequest();
            },
            priceFixed(row, column, cellValue, index) {
                if (cellValue) {
                    return Number(cellValue).toFixed(2)
                } else {
                    return '';
                }
            },
            formatterRate(row, column, cellValue, index) {
                if (cellValue) {
                    return cellValue + '%'
                } else {
                    return '0%'
                }
            },
            priceFormatter(row, column, cellValue, index) {
                let res = '';
                if (cellValue) {
                    res = this.GlobalPriceFilter.priceFilter(cellValue);
                } else {
                    res = '无';
                }
                return res;
            },
            forStatus(row, column, cellValue, index) {
                if (cellValue == 2) {
                    return '外包任务'
                }else if(cellValue == 1) {
                    return '班务执行'
                } else {
                    return '-'
                }
            },
            timeFormatter(row, column, cellValue, index) {
                let res = '永久';
                if (cellValue) {
                    res = moment(cellValue).format('YYYY-MM-DD HH:mm');
                } else {
                    res = '永久';
                }
                return res;
            },
            settlementTypeFormatter(row, column, cellValue, index) {
                let status = ''
                switch (Number.parseInt(cellValue)) {
                    case 1:
                        status = '日结'
                        break
                    case 2:
                        status = '月结'
                        break
                    case 4:
                        status = '周结'
                        break
                    default:
                        status = '无'
                        break
                }
                return status
            },
            statusTypeFormatter(row, column, cellValue, index) {
                let status = ''
                switch (Number.parseInt(cellValue)) {
                    case 1:
                        status = '待挂靠确认'
                        break
                    case 2:
                        status = '待对方确认'
                        break
                    case 3:
                        status = '领取成功'
                        break
                    case 4:
                        status = '领取失败'
                        break
                    case 5:
                        status = '挂靠失败'
                        break
                    case 6:
                        status = '已放弃'
                        break
                    default:
                        status = '无'
                        break
                }
                return status
            },
            handleCombShow() {
                this.isShowComb = !this.isShowComb;
            },
            handleCurrentChange(val) {
                this.currentPage = val;
                this.fetchList();
            },
            routeToDetail(row) {
                let item = Object.assign({},row)
                const {href} = this.$router.resolve({
                    name: "affiliateTaskDetail",
                    query: item
                });
                window.open(href, "_blank");
            },
            agree(row) {
                let cusName = JSON.parse(localStorage.userInfo).customerName;
                this.params = Object.assign({}, row)
                this.dialogForm.signCustomerName = cusName;
                this.dialogVisible = true;
            },
            refuse(row){
                //拒绝挂靠
                this.$confirm(`确定拒绝班务经理${row.receiverName}领取【${row.publisherName}】的【${row.taskName}】任务吗?`, '提示', {
                    confirmButtonText: '确 认',
                    cancelButtonText: '取 消',
                    type: 'error'
                }).then(() => {
                    this.$api.hookReject({receiveMId: row.receiveMId}).then(res => {
                        console.log(res);
                        if (res.data.respCode === 0) {
                            this.$message({
                                message: '拒绝成功',
                                type: 'success'
                            });
                            this.fetchList()
                        }
                    });
                }).catch((err) => {
                    console.log(err)
                });
            },
            giveUp(row){
                //拒绝挂靠
                this.$confirm(`确定放弃班务经理${row.receiverName}领取【${row.publisherName}】的【${row.taskName}】任务吗?`, '提示', {
                    confirmButtonText: '确 认',
                    cancelButtonText: '取 消',
                    type: 'error'
                }).then(() => {
                    this.$api.hookCusGiveUp({receiveMId: row.receiveMId}).then(res => {
                        console.log(res);
                        if (res.data.respCode === 0) {
                            this.$message({
                                message: '放弃成功',
                                type: 'success'
                            });
                            this.fetchList()
                        }
                    });
                }).catch((err) => {
                    console.log(err)
                });
            },
            deleteUp(row){
                //拒绝挂靠
                this.$confirm(`确定删除班务经理${row.receiverName}领取【${row.publisherName}】的【${row.taskName}】任务吗?`, '提示', {
                    confirmButtonText: '确 认',
                    cancelButtonText: '取 消',
                    type: 'error'
                }).then(() => {
                    this.$api.deleteC({receiveMId: row.receiveMId}).then(res => {
                        console.log(res);
                        if (res.data.respCode === 0) {
                            this.$message({
                                message: '删除成功',
                                type: 'success'
                            });
                            this.fetchList()
                        }
                    });
                }).catch((err) => {
                    console.log(err)
                });
            }
        },
    }
</script>
<style lang="scss" scoped>
    .affiliated-task {
        background-color: #fff;

        .middleText {
            text-align: center;
            color: #C0C1C2;
            line-height: 22px;
        }

        .formSearchMargin {
            margin-bottom: 0;
        }

        .combine-zone {
            border-top: 1px solid #EAEDF4;
            padding-bottom: 11px;
        }

        .comb-btn {
            margin-bottom: 20px;
        }

        .searchThisForm {
            padding-left: 20px;
        }

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
            font-size: 12px;
            width: 520px;
            margin-right: 20px;
            margin-bottom: 20px;
        }

        .middleTextHead {
            color: #4D4D4D;
            font-size: 16px;
            margin-bottom: 5px;
        }

        .operateCon {
            display: flex;
            flex-direction: row;
            justify-content: space-around;
            align-content: center;
            align-items: center;

            img {
                width: 12px;
                vertical-align: -3px;
                margin-right: 6px;
            }

            .viewCon {
                cursor: pointer;
            }

            .pickCon {
                cursor: pointer;
            }
        }
    }
</style>
<style lang="scss">
    .taketaskCon {
        .el-table {
            .cell {
                text-align: center;
                padding-left: 10px;
            }
        }

        .el-radio-group {
            height: 16px;
        }

        .el-form-item__label {
            line-height: 16px;
        }

        .el-form-item {
        }

        .searchMaster {
            .el-input__inner {
                height: 34px;
            }

            .el-icon-search {
                line-height: 28px;
            }
        }

        .resetFormItem {
            margin-top: 10px;
            margin-bottom: 0;
        }

        .resetDialog {
            .el-dialog {
                position: absolute;
                left: 0;
                right: 0;
                top: 0;
                bottom: 0;
                margin: auto !important;
                height: 220px;
            }

            .el-dialog__header {
                border-bottom: none;
            }

            .resetBtn {
                width: 90px;
            }

            .resetBtnSp {
                width: 90px;
                color: #E9481C;
                background-color: #FFEFEA;
                border-color: #F7BEB2;
            }

            .el-button:active {
                color: #d13e16;
                border-color: #d13e16;
            }
        }

        .combine-zone {
            .el-radio__label {
                font-size: 12px;
                padding-left: 0;
                vertical-align: -1px;
            }

            .el-form-item__label {
                line-height: 18px;
                font-size: 12px;
            }

            .el-form-item__content {
                line-height: 18px;
            }

            .el-radio-group {
                min-height: inherit;
            }
        }

        .wrapFlex {
            .setMinHeight {
                min-height: 16px;
            }

            .el-radio-group {
                flex-wrap: wrap;
                height: auto;
            }

            .el-radio {
                margin-bottom: 6px;
                line-height: 16px;
            }
        }
    }
</style>