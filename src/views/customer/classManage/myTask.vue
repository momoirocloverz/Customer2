<template>
    <div class="g-my-task">
        <div class="back-white" style="margin-bottom: 12px;">
            <search-bar combCondition="true" @handleSearch="handleSearch" placeholder="输入任务名称搜索">
                <el-form ref="form" label-width="100px" labelPosition="left">
                    <!--选择条件的单选按钮-->
                    <el-form-item label="所属客户:" class="formSearchMargin formSearchMarginTop">
                        <el-radio-group class="radio-search" v-model="ownCustomer" @change="handleChangeOwnCustomer"
                                        style="width: 100%;display:flex;flex-wrap: wrap;">
                            <el-radio :label="it.belongTo" v-for="(it,i) in belongToList" :key="i">{{it.belongToName}}
                            </el-radio>
                        </el-radio-group>
                    </el-form-item>
                    <el-form-item label="结算方式:" class="formSearchMargin">
                        <el-radio-group class="radio-search" v-model="settlement" @change="handleChangeSettlement">
                            <el-radio label="">不限</el-radio>
                            <el-radio :label='2'>月结</el-radio>
                            <el-radio :label="4">周结</el-radio>
                            <el-radio :label="1">日结</el-radio>
                        </el-radio-group>
                    </el-form-item>
                    <el-form-item label="任务状态:" class="formSearchMargin">
                        <el-radio-group class="radio-search" v-model="taskStatus" @change="handleChangeTaskStatus">
                            <el-radio label="">不限</el-radio>
                            <el-radio :label="1">未开始</el-radio>
                            <el-radio :label="2">进行中</el-radio>
                            <el-radio :label="3">已结束</el-radio>
                        </el-radio-group>
                    </el-form-item>
                </el-form>
            </search-bar>
        </div>
        <div class="back-white btn-div flexable">
            <el-button class="primary-btn setWidthBtn" size="mini" @click="popToSelf">添加任务</el-button>
        </div>
        <div class="table-box back-white">
            <el-table :data="taskList" empty-text="暂无相关信息" v-loading="loading" align="center">
                <el-table-column
                        align="center"
                        label="任务名称"
                        prop="taskName"
                        show-overflow-tooltip
                        min-width="140">
                </el-table-column>
                <el-table-column
                        align="center"
                        label="所属客户"
                        prop="belongToName"
                        show-overflow-tooltip
                        min-width="100">
                </el-table-column>
                <el-table-column
                        align="center"
                        label="开始日期"
                        prop="startTime"
                        show-overflow-tooltip
                        min-width="100">
                </el-table-column>
                <el-table-column
                        align="center"
                        label="结束日期"
                        prop="endTime"
                        show-overflow-tooltip
                        min-width="100">
                    <template v-slot="scope">
                        {{scope.row.endTime?scope.row.endTime:'永久'}}
                    </template>
                </el-table-column>
                <el-table-column
                        align="center"
                        label="结算方式"
                        prop="settlementType"
                        show-overflow-tooltip
                        min-width="100">
                    <template v-slot="scope">
                        {{settlementMap[scope.row.settlementType]}}
                    </template>
                </el-table-column>
                <el-table-column
                        align="center"
                        label="工作地点"
                        prop="workingPlace"
                        show-overflow-tooltip
                        min-width="100">
                </el-table-column>
                <el-table-column
                        align="center"
                        label="任务状态"
                        prop="processStatus"
                        show-overflow-tooltip
                        min-width="100">
                    <template v-slot="scope">
                        {{taskStatusMap[scope.row.processStatus]}}
                    </template>
                </el-table-column>
                <el-table-column label="操作" align="center" width="400">
                    <template v-slot="scope">
                        <el-button type="text" class="btn-icon btn-icon-view" size="mini"
                                   @click="handleView(scope.row)">任务详情
                        </el-button>
                        <el-button type="text" v-if="scope.row.processStatus===2" class="btn-icon btn-icon-reject"
                                   size="mini" @click="handleStopTask(scope.row)">结束任务
                        </el-button>
                        <el-button type="text" v-if="scope.row.processStatus===1" class="btn-icon btn-icon-add"
                                   size="mini" @click="handleAddClassTask(scope.row)">开始任务
                        </el-button>
                        <el-button type="text" v-if="scope.row.processStatus===2||scope.row.processStatus===3"
                                   class="btn-icon btn-icon-manage" size="mini" @click="handleClass(scope.row)">管理班务
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
            <div class="pagination-container" v-if="params.total!==0">
                <el-pagination class="pagebox" layout="total , prev, pager, next, jumper" :total="params.total"
                               :current-page.sync="params.pageNum" @current-change="handleCurrentChange"
                               :page-size="params.pageSize">
                </el-pagination>
            </div>
        </div>
        <el-dialog title="添加班务成功" :visible.sync="showSuccessAdd" width="30%" center>
        <span v-if="isGrab == '1' ">班务已添加成功，请班务经理登录班务经理APP进入【工作台-班务】页面，对其负责的班务进行【开始班务】操作
          根据实际情况一个任务可分解为1个或若干个班务</span>
            <span v-else>需求已发布至班务市场，班务经理可在app端抢单，请您关注发布中心，及时同意抢单需求。根据实际情况一个任务可分解为1个或若干个班务</span>
            <span slot="footer" class="dialog-footer">
        <el-button class="fixStyle1" @click="handleToClassList">继续为此任务添加班务</el-button>
          <el-button type="primary" @click="showSuccessAdd = false">返回任务</el-button>
        </span>
        </el-dialog>
        <add-class-form
                :key="1"
                :taskName="pitchTaskName"
                :save="handleSave"
                :showAddClassForm="showAddClassForm"
                :cancelAddClassForm="cancelAddClassForm"
                :assignmentInfoId="assignmentInfoId"
                :saveLoading="saveLoading"
                :edit="false"
                ref="addCalssFrom"
        />

        <add-task v-if="addTaskVisible" :taskId="taskId" :comeFrom="setSource" :addOrEditStatus="addOrEditStatus"
                  @closeDialog='handleCloseDialog'/>
        <el-dialog title="添加班务" :visible.sync="alertDialShow" width="360px"
                   class="base-dialog centerDialogue">
            <div class="classSelectCon">
                <div class="upBtnCon">
                    <el-button @click="toNormal" class="btnNormal">常规班务</el-button>
                    <div>创建常规班务后可分配给班务经理，更适用于现场管理</div>
                </div>
                <div class="bottomBtnCon">
                    <el-button @click="toShortCut" class="btnNormal">快捷班务</el-button>
                    <div>创建快捷班务可直接指定零工，并快速完成班务结算快捷班务不进行效能和利润分析</div>
                </div>
            </div>
        </el-dialog>


    </div>
</template>

<script>
    import SearchBar from '@/components/SearchBar';
    import AddTask from './components/AddTaskdialog'
    import AddClassForm from './addClassForm.vue';

    export default {
        name: 'myTask',
        components: {SearchBar, AddClassForm, AddTask},
        data() {
            return {
                alertDialShow: false,
                showSuccessAdd: false,
                saveLoading: false,
                settlementMap: {
                    [2]: '月结',
                    [4]: '周结',
                    [1]: '日结'
                },
                taskStatusMap: {
                    [1]: '未开始',
                    [2]: '进行中',
                    [3]: '已结束'
                },
                assignmentInfoId: null,
                belongToList: [],
                pitchTaskName: '',
                showAddClassForm: false,
                taskName: '',
                ownCustomer: '',
                settlement: '',
                taskStatus: '',
                params: {
                    total: 0,
                    pageSize: 20,
                    pageNum: 1,
                },
                loading: false,
                taskList: [],
                processStatus: null,
                isGrab: '1',
                addTaskVisible:false,
                addOrEditStatus: 1,
                taskId: 0,
                setSource:'1',
            }
        },
        mounted() {
            this.handleGetTaskBelongToList();
            this.handleGetTaskList();
        },
        methods: {
            goToEdit(row) {//编辑
                this.addTaskVisible = true;
                this.taskId = row.assignmentInfoId;
                this.addOrEditStatus = 2
            },
            popToSelf(){
                this.setSource = '1';
                this.addTaskVisible = true;
                this.addOrEditStatus = 1
            },
            handleCloseDialog(reload) {
                this.addTaskVisible = false;
                if (reload) {
                    this.params.pageNum = 1;
                    this.handleGetTaskList();
                }
            },
            toNormal() {
                this.alertDialShow = false;
                this.zhangyuLogic1();
            },
            zhangyuLogic1() {
                this.showAddClassForm = true;
//          this.$store.commit('SET_TASK_NAME',this.pitchTaskName);
            },
            toShortCut() {
                this.$store.commit('setShortCutIndex', 1);
                sessionStorage.removeItem('shortCutFirst');
                sessionStorage.removeItem('shortCutSec');
                sessionStorage.removeItem('secSelect');
                this.$router.push({
                    name: "shortcutClass"
                });
            },
            handleChangeTaskStatus() {
                this.params.pageNum = 1;
                this.handleGetTaskList();
            },
            handleChangeSettlement() {
                this.params.pageNum = 1;
                this.handleGetTaskList();
            },
            handleChangeOwnCustomer() {
                this.params.pageNum = 1;
                this.handleGetTaskList();
            },
            handleToClassList() {
                this.$router.push({
                    name: 'classManageList',
                    query: {
                        assignmentInfoId: this.assignmentInfoId,
                        processStatus: this.processStatus,
                        taskName: this.pitchTaskName,
                    }
                })
            },
            handleGetTaskBelongToList() {
                this.$api.getTaskBelongToList().then(res => {
                    let $belongToList = res.data || [];
                    this.belongToList = [{belongTo: '', belongToName: '不限'}, ...$belongToList.map(it => {
                        return {
                            ...it,
                            belongTo: `${it.belongTo}-${it.belongToType}`
                        }
                    })];
                })
            },
            handleView(row) {
                const {href} = this.$router.resolve({
                    name: "taskTrackDetail",
                    query: {
                        id: row.assignmentInfoId,
                    }
                });
                window.open(href, "_blank");
            },
            handleClass(row) {
                this.$router.push({
                    name: 'classManageList', query: {
                        assignmentInfoId: row.assignmentInfoId,
                        processStatus: row.processStatus,
                        taskName: row.taskName,
                    }
                });
            },
            handleStopTask(row) {
                if (row.processStatus === 3) {
                    this.$message("当前任务已结束");
                } else {
                    this.$confirm(`确认结束${row.taskName} 任务吗?`, '提示', {
                        confirmButtonText: '确 认',
                        cancelButtonText: '取 消',
                        type: 'warning'
                    }).then(() => {
                        this.$api.assignmentInfoStop({id: row.assignmentInfoId}).then(res => {
                            this.handleGetTaskList();
                        });
                    }).catch(() => {
                    });

                }
            },
            cancelAddClassForm() {
                this.showAddClassForm = false;
                this.assignmentInfoId = null;
            },
            handleSave(val) {
                this.isGrab = val.isGrab;
                this.saveLoading = true;
                this.$api.postClassTaskAdd(val).then(res => {
                    if (res.data.respCode === 0) {

                        this.showAddClassForm = false;
                        this.handleGetTaskList();
                        this.showSuccessAdd = true;
                    }
                    this.saveLoading = false;
                }).catch(error => {

                })
            },
            handleSearch(val) {
                this.taskName = val;
                this.params.pageNum = 1;
                this.handleGetTaskList();
            },
            handleGetTaskList() {
                const {ownCustomer, settlement, taskStatus, taskName} = this;
                const {pageNum, pageSize} = this.params;
                this.loading = true;
                this.$api.getMyTaskList({
                    belongTo: ownCustomer ? ownCustomer.split('-')[0] : '',
                    belongToType: ownCustomer ? ownCustomer.split('-')[1] : '',
                    settlementType: settlement,
                    processStatus: taskStatus,
                    pageNum,
                    pageSize,
                    taskName
                }).then(res => {
                    this.taskList = res.data.data.list || [];
                    this.params.total = res.data.data.total;
                    this.loading = false;
                })
            },
            handleCurrentChange(val) {
                this.params.pageNum = val;
                this.handleGetTaskList();
            },
            handleAddClassTask(row) {
                if (row.processStatus === 3) {
                    this.$message("当前任务状态已改变，无法开始任务");

                } else {


                    this.$api.getTaskStatus({id: Number(row.assignmentInfoId)}).then(res => {
                        if (res.data.processStatus === 1) {
                            this.$store.commit('SET_THUS_TASK_DETAIL', res.data);
                            this.$api.getAssignmentInfoClassTaskList({assignmentInfoId: Number(row.assignmentInfoId)}).then(res => {
                                this.$store.commit('SET_CLASS_LIST_LEN', res.data.total);
                                this.$store.commit('SET_TASK_NAME', row.taskName);
                                if (this.$refs.addCalssFrom) {
                                    this.$refs.addCalssFrom.handleClearState();
                                }
                                this.pitchTaskName = row.taskName;
                                this.assignmentInfoId = row.assignmentInfoId;
                                this.processStatus = row.processStatus


                                this.alertDialShow = true;


                            })
                        } else {
                            this.$message("当前任务状态已改变，无法开始任务");
                        }
                    })


                }
            }
        },
    }
</script>
<style lang="scss" scoped>
    .fixStyle1 {
        width: 182px !important;
    }

    .g-my-task {
        .classSelectCon {
            text-align: center;
        }

        .upBtnCon {
            box-sizing: border-box;
            padding-left: 35px;
            padding-right: 35px;
            padding-bottom: 22px;
            border-bottom: 1px solid #EDEEF0;
        }

        .bottomBtnCon {
            box-sizing: border-box;
            padding-left: 35px;
            padding-right: 35px;
            padding-top: 22px;
        }

        .btnNormal {
            color: #e84518;
            border-color: #f8c7ba;
            background-color: #fdece8;
            margin-bottom: 14px;
        }
    }
</style>
<style lang="scss">
    .g-my-task {
        .centerDialogue {
            .el-dialog {
                text-align: left;
                height: 335px;
                position: absolute;
                left: 0;
                right: 0;
                top: 0;
                bottom: 0;
                margin: auto !important;
            }

            .el-dialog__body {
                padding-bottom: 20px;
                padding-left: 0;
                padding-right: 0;
            }

            .el-dialog__header {
                border-bottom: none;
            }

            .el-button:active {
                color: #d13e16;
                border-color: #d13e16;
            }
        }
    }
</style>