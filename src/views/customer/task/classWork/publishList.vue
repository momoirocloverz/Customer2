<template>
    <div class="back-white publish-list">
        <el-form ref="form" :model="form" class="searchThisForm" label-width="100px" labelPosition="left">
            <div class="search-zone">
                <el-input class="searchMaster" clearable placeholder="输入班务名称搜索" prefix-icon="el-icon-search"
                          v-model="form.taskName"></el-input>
                <div class="charge-btn" @click="searchNow">搜索</div>
                <el-button class="comb-btn" size="mini" type="text" @click="handleCombShow">高级筛选<i
                        class="el-icon-right el-icon-d-arrow-right"
                        :class="isShowComb ? 'el-icon-d-arrow-right-down' : 'el-icon-d-arrow-right-right'"></i>
                </el-button>
            </div>
            <transition name="router-fade" mode="out-in">
                <div class="combine-zone" v-if="isShowComb">
                    <el-form-item label="状态：" class=" resetFormItem pb10">
                        <el-radio-group class="radio-search sameHeight" v-model="form.taskStatus">
                            <el-radio label="">不限</el-radio>
                            <el-radio label="1">待领取</el-radio>
                            <el-radio label="2">领取完毕</el-radio>
                            <el-radio label="3">已关闭</el-radio>
                        </el-radio-group>
                    </el-form-item>
                    <el-form-item label="结算方式：" class="formSearchMargin spSet pb10">
                        <el-radio-group class="radio-search sameHeight" v-model="form.settlementType">
                            <el-radio label="">不限</el-radio>
                            <el-radio label='2'>月结</el-radio>
                            <el-radio label="4">周结</el-radio>
                            <el-radio label="1">日结</el-radio>
                        </el-radio-group>
                    </el-form-item>
                </div>
            </transition>
        </el-form>

        <div class="back-white btn-div flexable">
            <el-button class="primary-btn" size="mini" @click="addNew">发布班务至班务市场</el-button>
        </div>

        <div class="table-box back-white">
            <el-table :data="tableData" empty-text="暂无相关信息">
                <el-table-column label="班务名称" prop="classTaskName" show-overflow-tooltip align="center"
                                 min-width="130"></el-table-column>
                <el-table-column label="所属任务" prop="belongToTaskName" show-overflow-tooltip align="center"
                                 min-width="130"></el-table-column>
                <el-table-column label="开始时间" prop="startTime" show-overflow-tooltip :formatter="dateFormatter"
                                 align="center" min-width="130"></el-table-column>
                <el-table-column label="结束时间" prop="endTime" show-overflow-tooltip :formatter="dateFormatter"
                                 align="center" min-width="130"></el-table-column>
                <el-table-column label="结算方式" prop="settlementType" :formatter="settlementFormatter"
                                 show-overflow-tooltip align="center" min-width="80"></el-table-column>
                <el-table-column label="计价方式" prop="price" :formatter="handlePricingManager" show-overflow-tooltip
                                 align="center" min-width="80"></el-table-column>
                <el-table-column label="结算类型" prop="taskType" :formatter="settlementTypeFor" show-overflow-tooltip
                                 align="center" min-width="80"></el-table-column>
                <el-table-column label="领取状态" prop="receiveStatus" show-overflow-tooltip :formatter="statusFormatter"
                                 align="center" min-width="80"></el-table-column>
                <el-table-column label="操作" show-overflow-tooltip align="center" min-width="190">
                    <template v-slot="scope">
                        <el-button type="text" class="btn-icon btn-icon-view" size="mini"
                                   @click="routeToDetail(scope.row)">查看
                        </el-button>
                        <!--<el-button type="text" class="btn-icon btn-icon-edit" size="mini" @click="goToEdit(scope.row)"-->
                                   <!--v-if="scope.row.receiveStatus == 1">编辑-->
                        <!--</el-button>-->
                        <el-button type="text" class="btn-icon btn-icon-delete" size="mini"
                                   @click="handleDelete(scope.row)"
                                   v-if="scope.row.receiveStatus == 1">删除
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>

            <div class="pagination-container" v-if="total!=0">
                <el-pagination class="pagebox" layout="total , prev, pager, next, jumper" :total="total"
                               @current-change="handleCurrentChange" :current-page="currentPage" :page-size="pageSize">
                </el-pagination>
            </div>
        </div>

        <el-dialog :visible.sync="DeleteVisible" width="450px" class="base-dialog spMeSet">
            <div class="dialog-head" style="">
                <p class="base-dialog-title">确认删除<strong class="dialog-strong">{{this.selectItem.taskName}}</strong>吗？
                </p>
            </div>
            <span slot="footer" class="dialog-footer">
        <el-button size="medium" type="primary" @click="handleDelete">确 定</el-button>
        <el-button size="medium" @click="DeleteVisible = false">取 消</el-button>
      </span>
        </el-dialog>
        <add-class-form
                :key="1"
                :save="handleSave"
                :showAddClassForm="showAddClassForm"
                :cancelAddClassForm="cancelAddClassForm"
                :saveLoading="saveLoading"
                :edit="false"
                ref="addCalssFrom"
        />

    </div>
</template>

<script>
    import addClassForm from './components/AddWorkdialog'
    import moment from 'moment'

    export default {
        name: "publishList",
        components: {addClassForm},
        data() {
            return {
                selectItem: {},
                showAddClassForm: false,  // 显示添加任务的对话框
                DeleteVisible: false,
                currentPage: 1,
                pageSize: 20,
                total: 0,
                isShowComb: false,
                select: '1',
                saveLoading:false,
                assignmentInfoId:'',
                tableData: [],
                form: {
                    taskStatus: '',
                    taskName: '',
                    settlementType: '',
                },
                addOrEditStatus: 1,
                taskId: 0,
                setSource: '1',
            }
        },
        mounted() {
            this.getList();
        },
        watch: {
            'form.taskStatus': function (val, oldval) {
                this.unitRequest();
            },
            'form.settlementType': function (val, oldval) {
                this.unitRequest();
            },
        },
        methods: {
            handleSave(val){
                this.saveLoading = true;
                this.$api.postClassTaskAdd(val).then(res=>{
                    if(res.data.respCode===0){
                        this.showAddClassForm =false;
                        this.unitRequest();
                    }
                    this.saveLoading = false;
                }).catch(error=>{

                })
            },
            cancelAddClassForm(){
                this.showAddClassForm=false;
                this.assignmentInfoId = null;
            },
            handlePricingManager(val) {
                let type = '';
                let typeMap = {
                    [1]: '计时',
                    [2]: '固定计量',
                    [3]: '阶梯计量',
                    [4]: '组合计量',
                    [5]: '计时+固定计量',
                    [6]: '计时+阶梯计量',
                    [7]: '计时+组合计量',
                    [8]: '固定计价（日固定)'
                };
                return typeMap[JSON.parse(val.price).valuationType];
            },
            searchNow() {
                this.unitRequest();
            },
            unitRequest() {
                this.currentPage = 1;
                this.getList();
            },
            handleCombShow() {
                this.isShowComb = !this.isShowComb;
            },
            handleCloseDialog(reload) {
                this.showAddClassForm = false
                if (reload) {
                    this.unitRequest();
                }
            },
            dateFormatter(row, column, cellValue, index) {
                let res = '永久';
                if (cellValue) {
                    res = moment(cellValue).format('YYYY-MM-DD HH:mm')
                } else {
                    res = '永久';
                }
                return res;
            },
            settlementFormatter(row, column, cellValue, index) {
                let status = '';
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
            settlementTypeFor(row, column, cellValue, index) {
                let status = '';
                // 1.指派给自己 2.经理人抢单 3.指派给自己的经理人合作伙伴 4.外包任务）
                switch (Number.parseInt(cellValue)) {
                    case 1:
                        status = '代发'
                        break
                    case 2:
                        status = '代发'
                        break
                    case 3:
                        status = '代发'
                        break
                    case 4:
                        status = '外包'
                        break
                    default:
                        status = '-'
                        break
                }
                return status
            },
            statusFormatter(row, column, cellValue, index) {
                let status = ''
                switch (Number.parseInt(cellValue)) {
                    case 1:
                        status = '待领取'
                        break
                    case 2:
                        status = '领取完毕'
                        break
                    case 3:
                        status = '已关闭'
                        break
                    default:
                        status = ''
                        break
                }
                return status
            },
            handleDeleteVisible(item) {
                this.selectItem = item;
                this.DeleteVisible = true;
            },
            handleDelete(row){
                this.$confirm(`确认删除${row.classTaskName} 班务吗?`, '提示', {
                    confirmButtonText: '确 认',
                    cancelButtonText: '取 消',
                    type: 'warning'
                }).then(() => {
                    this.$api.classTaskDelete({classTaskId:row.classTaskId}).then(res=>{
                        if(res.data.respCode===0){
                            this.$message({
                                type: 'success',
                                message: '删除成功!'
                            });
                            this.unitRequest();
                        }
                    })
                }).catch(() => {
                });
            },
            getList() {
                let params = {
                    pageNum: this.currentPage,
                    pageSize: this.pageSize,
                    receiveStatus: this.form.taskStatus,
                    settlementType: this.form.settlementType,
                    classTaskName: this.form.taskName,
                };
                this.$api.myPublish(params).then(res => {
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
                    console.log('err', err);
                })
            },
            routeToDetail(row) {
                let item = Object.assign({},row)
                const {href} = this.$router.resolve({
                    name: "classWorkDetail",
                    query: item
                });
                window.open(href, "_blank");
            },
            handleCurrentChange(val) {
                this.currentPage = val;
                this.getList();
            },
            addNew() {
                // this.setSource = '2';
                this.showAddClassForm = true
                this.addOrEditStatus = 1
            },
            goToEdit(row) {
                this.addTaskVisible = true
                this.addOrEditStatus = 2
            }
        }
    }
</script>
<style lang="scss" scoped>
    .publish-list {
        .centerAlign {
            text-align: center;
        }

        .marBot {
            margin-top: 20px;
            margin-bottom: 40px;
        }

        .btnNormal {
            color: #e84518;
            border-color: #f8c7ba;
            background-color: #fdece8;
            width: 170px;
        }

        .combine-zone {
            border-top: 1px solid #EAEDF4;
            padding-bottom: 11px;
        }

        .comb-btn {
            margin-bottom: 20px;
        }

        .resetFormItem {
            margin-top: 10px;
            margin-bottom: 0;
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

        .formSearchMargin {
            margin-bottom: 0;
        }

        .searchThisForm {
            padding-left: 20px;
        }

        .search-zone {
            display: flex;
            align-items: center;
            justify-content: flex-start;
            flex-wrap: wrap;
            align-content: center;
            padding-top: 20px;
        }

        .searchMaster {
            font-size: 12px;
            width: 520px;
            margin-right: 20px;
            margin-bottom: 20px;
        }

        .flexWrap {
            display: flex;
            flex-direction: row;
            flex-wrap: wrap;
            justify-content: flex-start;
            align-content: center;
            align-items: center;
            min-height: 18px;
            height: auto;

            .el-radio {
                padding-bottom: 8px;
            }
        }

        .sameHeight {
            height: 18px;
        }
    }
</style>
<style lang="scss">
    .publish-list {
        .spMeSet {
            .el-dialog__footer {
                padding-bottom: 10px !important;
            }

            .el-dialog__header {
                border-bottom: none;
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

        .wrapThis {
            .el-form-item__label {
                margin-top: 0;
            }

            .el-form-item__content {
                margin-top: 1px;
            }

            margin-top: 6px;
        }

        .spSet {
            .el-form-item__label {
                margin-top: 0;
            }

            .el-form-item__content {
                margin-top: 0;
            }
        }

        .el-table .cell {
            padding-left: 10px;
        }

        .searchMaster {
            .el-input__inner {
                height: 34px;
            }

            .el-icon-search {
                line-height: 28px;
            }
        }

        .centerDialogue {
            .el-dialog {
                text-align: left;
                height: 300px;
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