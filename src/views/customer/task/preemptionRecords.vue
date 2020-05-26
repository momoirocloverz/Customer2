<template>
    <div class="preemptionRecordsCon">
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
                <div class="combine-zone" v-if="isShowComb">
                    <!--
                                    <el-form-item label="发布人：" class="resetFormItem wrapFlex">
                                      <el-radio-group class="radio-search setMinHeight" v-model="searchForm.publisher" @change="publisherChange('searchForm','publisher')">
                                        <el-radio label="">不限</el-radio>
                                        <el-radio :label="item.id" v-for="(item,index) in belongtoList" :key="index">{{item.shortName}}</el-radio>
                                      </el-radio-group>
                                    </el-form-item>
                    -->
                    <el-form-item label="结算方式：" class="resetFormItem formSearchMargin">
                        <el-radio-group class="radio-search" v-model="searchForm.settlementType"
                                        @change="settlementTypeChange('searchForm','settlementType')">
                            <el-radio label="">不限</el-radio>
                            <el-radio label='2'>月结</el-radio>
                            <el-radio label="4">周结</el-radio>
                            <el-radio label="1">日结</el-radio>
                        </el-radio-group>
                    </el-form-item>
                </div>
            </transition>
        </el-form>
        <div class="table-box back-white">
            <el-table :data="tableData" empty-text="暂无相关信息">
                <el-table-column label="任务名称" prop="taskName" show-overflow-tooltip min-width="130"></el-table-column>
                <!--<el-table-column label="发布人" prop="publisherName" show-overflow-tooltip min-width="130"></el-table-column>-->
                <el-table-column label="任务类型
" prop="taskType" :formatter="taskTypeFor" show-overflow-tooltip min-width="130"></el-table-column>
                <el-table-column label="开始日期" prop="startTime" :formatter="timeFormatter" show-overflow-tooltip
                                 min-width="130"></el-table-column>
                <el-table-column label="结束日期" prop="endTime" :formatter="timeFormatter" show-overflow-tooltip
                                 min-width="130"></el-table-column>
                <el-table-column label="结算方式" prop="settlementType" :formatter="settlementTypeFormatter"
                                 show-overflow-tooltip min-width="130"></el-table-column>
                <el-table-column label="工作地点" prop="workingPlace" show-overflow-tooltip
                                 min-width="130"></el-table-column>
                <el-table-column label="所需人数" prop="authorizedNumber" show-overflow-tooltip></el-table-column>
                <el-table-column label="任务单价" prop="price" :formatter="priceFormatter" show-overflow-tooltip
                                 min-width="130"></el-table-column>
                <el-table-column label="状态" prop="status" :formatter="statusFormatter"
                                 show-overflow-tooltip></el-table-column>
                <el-table-column label="操作" show-overflow-tooltip min-width="160">
                    <template v-slot="scope">
                        <div class="operateCon">
                            <div class="viewCon" @click="routeToDetail(scope.row)">
                                <img :src="viewIcon">
                                <span>查看</span>
                            </div>
                            <div class="viewCon" v-if="!scope.row.taskType && scope.row.status == 3" @click="noSetting(scope.row)">
                                <img :src="viewIcon">
                                <span>未设置</span>
                            </div>
                            <div class="pickCon" @click="cancelThis(scope.row)" v-if="scope.row.status==1">
                                <img :src="pickIcon">
                                <span>放弃</span>
                            </div>
                            <div class="deleteCon" @click="deleteThis(scope.row)"
                                 v-if="(scope.row.status==2) || (scope.row.status==4)">
                                <img :src="deleteIcon">
                                <span>删除</span>
                            </div>
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
        <el-dialog title="" :visible.sync="deleteVisible" width="540px" class="resetDialog">
            <div class="middleTextHead">确认删除{{infoBridge.taskName}}任务吗？</div>
            <span slot="footer" class="dialog-footer">
                <el-button class="resetBtn" @click="deleteVisible = false">取 消</el-button>
                <el-button class="resetBtnSp" @click="shutDelete">确 认</el-button>
            </span>
        </el-dialog>
        <el-dialog title="" :visible.sync="quitVisible" width="540px" class="resetDialog">
            <div class="middleTextHead">确认放弃{{infoBridge.taskName}}任务吗？</div>
            <span slot="footer" class="dialog-footer">
                <el-button class="resetBtn" @click="quitVisible = false">取 消</el-button>
                <el-button class="resetBtnSp" @click="shutQuit">确 认</el-button>
            </span>
        </el-dialog>
        <!-- 编辑零工start -->
        <el-dialog :title="`请选择抢单成功后，该任务下零工收入发放方式`"
                   :visible.sync="dialogVisibleTask" width="720px" :center="true">
            <div class="overflow-box">
                <el-form label-width="150px" label-position="right" :rules="rules" :model="searchForm">
                    <el-form-item label="发放方式：" class=" mTop2 inpWidth woker-list">
                        <el-radio-group v-model="searchForm.presetTaskType">
                            <el-radio label='1'>代发-通过经理人代发发放</el-radio>
                            <el-radio label='2'>外包-通过平台外包商发放</el-radio>
                        </el-radio-group>
                    </el-form-item>
                    <el-form-item v-if="searchForm.presetTaskType == 2" label="选择外包商：" required prop="outsourcingCusId">
                        <el-select v-model="searchForm.outsourcingCusId" class="radius-input" style="width:280px"
                                   placeholder="请选择">
                            <el-option v-for="(item,index) in outSourceLists" :key="index" :label="item.name"
                                       :value="item.id">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item>
                        <div class="co-999">
                            <p>外包任务：通过平台外包商渠道发放零工收入</p>
                            <p>代发任务：通过自有线上付款渠道发放零工收入</p>
                        </div>
                    </el-form-item>
                </el-form>
            </div>
            <span slot="footer" class="dialog-footer">
            <el-button size="small" @click="dialogVisibleTask = false;searchForm.presetTaskType = '1'">取消</el-button>
            <el-button size="small" type="primary" @click="setAssmType()">确认</el-button>
        </span>
        </el-dialog>
    </div>
</template>
<script>
    import moment from 'moment';
    import { mapState, mapGetters, mapActions, mapMutations } from 'vuex'
    export default {
        data() {
            let validateName = (rule, value, callback) => {
                console.log(value,rule)
                if (!this.searchForm.outsourcingCusId) {
                    callback(new Error("外包商不能为空!"));
                } else {
                    callback();
                }
            }
            return {
                searchForm:{
                    publisher:'',
                    settlementType:'',
                    taskName:'',
                    presetTaskType:'1',
                    outsourcingCusId:"",
                    outsourcingCusName:"",
                },
                dialogVisibleTask:false,
                rules: {
                    outsourcingCusId: [
                        {required: true, message: '外包商不能为空!', trigger: 'blur'},
                        {validator:validateName,trigger: ['change','blur'],}
                    ],
                },
                params:{},
                outSourceLists:[],
                belongtoList: [],
                tableData: [],
                total: 0,
                currentPage: 1,
                pageSize: 20,
                pickIcon: require('@/assets/images/transh_bin.png'),
                viewIcon: require('@/assets/icons/view.png'),
                deleteIcon: require('@/assets/icons/cross.png'),
                deleteVisible: false,
                quitVisible: false,
                infoBridge: {
                    taskName: '',
                    id: '',
                },
                isShowComb: false,
            }
        },
        computed:{
        },
        watch:{
            'searchForm.outsourcingCusId': function (val,oldVal) {
                if(val){
                    for(let item of this.outSourceLists){
                        if(val == item.id){
                            this.searchForm.outsourcingName = item.name
                            console.log(this.searchForm.outsourcingName)
                        }
                    }
                }
            }
        },
        mounted() {
            this.fetchList();
            this.geOutLists();
//        this.getPublisher();
        },
        methods: {
            ...mapActions(['getTaskMarket']),
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
            setAssmType() {
                if(this.searchForm.presetTaskType == 2){
                    if(!this.searchForm.outsourcingCusId){
                        return this.$message.error('外包商不能为空!')
                    }
                }
                let params = {
                    presetTaskType:this.searchForm.presetTaskType,
                    outsourcingCusId:this.searchForm.outsourcingCusId,
                    outsourcingCusName:this.searchForm.outsourcingName,
                    receiveId:this.params.receiveId,
                };
                this.$api.setAssmType(params).then(res => {
                    if(res.data.respCode === 0){
                        this.dialogVisibleTask = false;
                        this.searchForm.presetTaskType = 1;
                        this.$message.success('设置成功');
                        this.unitRequest();
                    }
                    console.log(res)
                }).catch(err=>{
                    console.log(err)
                }).finally(()=>{

                })
            },
            fetchList() {
                let filterSp = this.searchForm.taskName;
                let data = {
                    pageNum: this.currentPage,
                    pageSize: this.pageSize,
                    taskName: filterSp,
//                publisherCustomerId:this.searchForm.publisher,
                    settlementType: this.searchForm.settlementType,
                };
                this.$api.taskReceiveRecordList(data).then(res => {
                    let {data: layer1} = res;
                    let {data, respCode} = layer1;
                    if (respCode === 0) {
                        this.total = data.total;
                        if (data.list) {
                            this.tableData = data.list;
                        } else {
                            this.tableData = [];
                        }
                        this.getTaskMarket({type:3})
                    }
                }).catch(err => {
                    console.log('err', err);
                })
            },
//        getPublisher(){
//            this.$api.assignmentInfoPublisher().then(res=>{
//                let { data,respCode } = res;
//                if( respCode === 0 ){
//                    if(data){
//                        this.belongtoList = data;
//                    }else{
//                        this.belongtoList = [];
//                    }
//                }
//            }).catch(err=>{
//                console.log('err',err);
//            })
//        },
            unitRequest() {
                this.currentPage = 1;
                this.fetchList();
            },
            searchNow() {
                this.unitRequest();
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
            timeFormatter(row, column, cellValue, index) {
                let res = '永久';
                if (cellValue) {
                    res = moment(cellValue).format('YYYY-MM-DD HH:mm');
                } else {
                    res = '永久';
                }
                return res;
            },
            taskTypeFor(row, column, cellValue, index) {
                if (!cellValue) {
                    return '未设置'
                } else if (cellValue == 4) {
                    return '外包任务'
                } else {
                    return '代发任务'
                }
            },
            statusFormatter(row, column, cellValue, index) {
                let status = ''
                switch (Number.parseInt(cellValue)) {
                    case 1:
                        status = '待确认'
                        break;
                    case 2:
                        status = '领取失败'
                        break;
                    case 3:
                        status = '领取成功'
                        break;
                    case 4:
                        status = '已放弃'
                        break;
                }
                return status
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
            handleCombShow() {
                this.isShowComb = !this.isShowComb;
            },
            handleCurrentChange(val) {
                this.currentPage = val;
                this.fetchList();
            },
            noSetting(params){
                this.params = params;
                this.dialogVisibleTask = true;
            },
            routeToDetail(row) {
                const {href} = this.$router.resolve({
                    name: "TaskDetail",
                    query: {
                        id: row.assignmentInfoId,
                    }
                });
                window.open(href, "_blank");
            },
            cancelThis(row) {
                this.infoBridge = row;
                this.quitVisible = true;
            },
            deleteThis(row) {
                this.infoBridge = row;
                this.deleteVisible = true;
            },
            shutDelete() {
                let data = {
                    id: this.infoBridge.receiveId,
                };
                this.$api.deleteAssignmentReceive(data).then(res => {
                    let {data: layer1} = res;
                    let {data, respCode} = layer1;
                    if (respCode === 0) {
                        this.$message({
                            message: '删除记录成功',
                            type: 'success'
                        });
                        this.unitRequest();
                        this.deleteVisible = false;
                    }
                }).catch(err => {
                    console.log('err', err);
                })

            },
            shutQuit() {
                let data = {
                    id: this.infoBridge.receiveId,
                };
                this.$api.giveUpAssignmentReceive(data).then(res => {
                    let {data: layer1} = res;
                    let {data, respCode} = layer1;
                    if (respCode === 0) {
                        this.$message({
                            message: '取消抢单成功',
                            type: 'success'
                        });
                        this.unitRequest();
                        this.quitVisible = false;
                    }
                }).catch(err => {
                    console.log('err', err);
                })
            },
            publisherChange(form, item) {
                this.unitRequest();
            },
            settlementTypeChange(form, item) {
                this.unitRequest();
            },
        }
    }
</script>
<style lang="scss" scoped>
    .preemptionRecordsCon {
        background-color: #fff;

        .searchThisForm {
            padding-left: 20px;
        }

        .middleTextHead {
            color: #4D4D4D;
            font-size: 16px;
            margin-bottom: 5px;
            text-align: center;
            padding-top: 12px;
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

            .deleteCon {
                cursor: pointer;

                img {
                    vertical-align: -1px;
                }
            }
        }
    }
</style>
<style lang="scss">
    .preemptionRecordsCon {
        .el-table {
            .cell {
                text-align: center;
                padding-left: 10px;
            }
        }

        .resetFormItem {
            margin-top: 10px;
            margin-bottom: 0;
        }

        .el-radio-group {
            height: 16px;
        }

        .el-form-item__label {
            line-height:32px;
        }

        .searchMaster {
            .el-input__inner {
                height: 34px;
            }

            .el-icon-search {
                line-height: 28px;
            }
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
                height: 40px;
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

            .el-dialog__body {
                height: 120px;
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