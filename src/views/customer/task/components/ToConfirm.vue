<template>
    <div class="back-white toConfirmCon">
        <div class="filter-condition">
            <el-form ref="form" :model="form" label-width="100px" labelPosition="left" class="formSearchMarginTop">
                <div class="search-zone">
                    <el-form-item>
                        <el-input placeholder="输入关键字搜索" v-model="input5" size="mini"
                                  class="input-with-select select-input" prefix-icon="el-icon-search">
                            <el-select v-model="select" slot="append" placeholder="请选择" class="search-select">
                                <el-option label="任务名称" value="1"></el-option>
                                <el-option label="接单人" value="2"></el-option>
                            </el-select>
                        </el-input>
                        <el-button type="primary" size="mini" class="searchBtn search-select-btn" @click="handleSearch">
                            搜索
                        </el-button>
                    </el-form-item>
                </div>
            </el-form>
        </div>

        <div class="table-box back-white">
            <el-table :data="tableData" empty-text="暂无相关信息" :row-class-name="getRowClassName">
                <el-table-column label="接单人" align="center" min-width="130">
                    <template slot-scope="scope">
                        <span v-if="scope.row.isHook" class="">{{scope.row.managerNameAlias}}</span>
                        <span v-if="scope.row.isHook">挂靠: {{scope.row.receiverName}}</span>
                        <span v-else>{{scope.row.receiverName}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="任务名称" prop="taskName" show-overflow-tooltip align="center"></el-table-column>
                <el-table-column label="任务所属" prop="belongToName" show-overflow-tooltip align="center"></el-table-column>
                <el-table-column label="开始时间" prop="startTime" show-overflow-tooltip :formatter="dateFormatter" align="center"></el-table-column>
                <el-table-column label="结束时间" prop="endTime" show-overflow-tooltip :formatter="dateFormatter" align="center"></el-table-column>
                <el-table-column label="结算方式" prop="settlementType" :formatter="settlementTypeFormatter"   show-overflow-tooltip align="center" ></el-table-column>
                <el-table-column label="计价方式" prop="settlementType" :formatter="handlePricingManager"   show-overflow-tooltip align="center" ></el-table-column>
                <el-table-column label="操作"  min-width="190">
                <template slot-scope="scope">
                <el-button type="text" class="btn-icon btn-icon-view" size="mini" @click="routeToDetail(scope.row)">查看</el-button>
                <el-button type="text" class="btn-icon btn-icon-agree" size="mini" @click="handleAgreeVisible(scope.row)">同意</el-button>
                <el-button type="text" class="btn-icon btn-icon-reject" size="mini" @click="handleRefuseVisible(scope.row)">拒绝</el-button>
                </template>
                </el-table-column>
            </el-table>
            <div class="pagination-container" v-if="total!=0">
                <el-pagination class="pagebox" :total="total" layout="total , prev, pager, next, jumper"
                               @current-change="handleCurrentChange" :current-page="currentPage" :page-size="pageSize">
                </el-pagination>
            </div>
        </div>

        <el-dialog :visible.sync="AgreeVisible" width="540px" class="base-dialog spMeSet">
            <div class="dialog-head">
                <p class="base-dialog-title">确认同意由<strong
                        class="dialog-strong">{{selectItem.receiverName}}</strong>领取<strong class="dialog-strong">{{selectItem.taskName}}</strong>吗？
                </p>
            </div>
            <span slot="footer" class="dialog-footer">
        <el-button size="medium" type="primary" @click="handleAgree">确 定</el-button>
        <el-button size="medium" @click="AgreeVisible = false">取 消</el-button>
      </span>
        </el-dialog>

        <el-dialog :visible.sync="RefuseVisible" width="540px" class="base-dialog spMeSet">
            <div class="dialog-head">
                <p class="base-dialog-title">确认拒绝由<strong
                        class="dialog-strong">{{selectItem.receiverName}}</strong>领取<strong class="dialog-strong">{{selectItem.taskName}}</strong>吗？
                </p>
            </div>
            <span slot="footer" class="dialog-footer">
        <el-button size="medium" type="primary" @click="handleRefuse">确 定</el-button>
        <el-button size="medium" @click="RefuseVisible = false">取 消</el-button>
      </span>
        </el-dialog>
    </div>
</template>

<script>
    import util from '../../../../common/util';
    import { mapState, mapGetters, mapActions, mapMutations } from 'vuex'
    export default {
        name: "Unbound",
        data() {
            return {
                pmId: '',
                selectItem: {},
                input5: '',
                select: '1',
                radio4: 1,
                AgreeVisible: false,
                RefuseVisible: false,
                tableData: [],
                currentPage: 1,
                pageSize: 20,
                total: 0,
                form: {
                    firstShow: true,
                    secondShow: false,
                    sex: "不限",
                    settleType: "不限",
                    manager: "不限",
                    tag: "不限",
                    keyWord: "",
                    bindingStatus: '-1',
                }
            }
        },

        created(){
            this.getList();
        },
        mounted() {

        },
        methods: {
            ...mapActions(['getTaskMarket']),
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
            handleSearch() {
                this.currentPage = 1
                this.getList(1)
            },
            getRowClassName({row, column, rowIndex, columnIndex}) {
                if (row.isHook) {
                    return 'cell-hook'
                } else {
                    return ''
                }
            },
            dateFormatter(row, column, cellValue, index) {
                let res = '永久';
                if (cellValue) {
                    res = util.minDate(cellValue);
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
            handleAgree() {
                const params = {
                    id: this.selectItem.receiveId,
                }
                this.$api.agreeAssignmentReceive(params).then(res => {
                    let {data: layer1} = res;
                    let {data, respCode} = layer1;
                    if (respCode === 0) {
                        this.$message({
                            message: '操作成功',
                            type: 'success'
                        });
                        this.AgreeVisible = false;
                        this.getList()
                    }
                }).catch(err => {
                    console.log('err', err);
                })
            },
            handleRefuse() {
                const params = {
                    id: this.selectItem.receiveId,
                }
                this.$api.rejectAssignmentReceive(params).then((res) => {
                    let {data: layer1} = res;
                    let {data, respCode} = layer1;
                    if (respCode === 0) {
                        this.$message({
                            message: '操作成功',
                            type: 'success'
                        });
                        this.RefuseVisible = false;
                        this.getList()
                    }
                }).catch((error) => {
                    console.log(error);
                });
            },
            handleAgreeVisible(item) {
                this.selectItem = item;
                console.log(item)
                let text = '';
                if(item.isHook){
                    text = `确定同意班务经理${item.managerNameAlias}(挂靠经理人${item.receiverName})领取【${item.taskName}】任务吗?`
                }else{
                    text = `确定同意经理人${item.receiverName}领取【${item.taskName}】任务吗?`
                }
                // this.AgreeVisible = true;
                this.$confirm(text, '提示', {
                    confirmButtonText: '确 认',
                    cancelButtonText: '取 消',
                    type: 'error'
                }).then(() => {
                    const params = {
                        id:item.receiveId,
                    }
                    this.$api.agreeAssignmentReceive(params).then(res => {
                        let {data: layer1} = res;
                        let {data, respCode} = layer1;
                        if (respCode === 0) {
                            this.$message({
                                message: '操作成功',
                                type: 'success'
                            });
                            // this.AgreeVisible = false;
                            this.getList()
                        }
                    }).catch(err => {
                        console.log('err', err);
                    })
                }).catch((err) => {
                    console.log(err)
                });
            },
            handleRefuseVisible(item) {
                this.selectItem = item;
                let text = '';
                if(item.isHook){
                    text = `确定拒绝班务经理${item.managerNameAlias}(挂靠经理人${item.receiverName})领取【${item.taskName}】任务吗?`
                }else{
                    text = `确定拒绝经理人${item.receiverName}领取【${item.taskName}】任务吗?`
                }
                this.$confirm(text, '提示', {
                    confirmButtonText: '确 认',
                    cancelButtonText: '取 消',
                    type: 'error'
                }).then(() => {
                    const params = {
                        id: item.receiveId,
                    }
                    this.$api.rejectAssignmentReceive(params).then((res) => {
                        let {data: layer1} = res;
                        let {data, respCode} = layer1;
                        if (respCode === 0) {
                            this.$message({
                                message: '操作成功',
                                type: 'success'
                            });
                            // this.RefuseVisible = false;
                            this.getList()
                        }
                    }).catch((error) => {
                        console.log(error);
                    });
                }).catch((err) => {
                    console.log(err)
                });

                // this.RefuseVisible = true;
            },
            getList() {
                let data = {
                    pageNum: this.currentPage,
                    pageSize: this.pageSize,
                    taskName: this.select == 1 ? this.input5 : '',
                    receiverCustomerName: this.select == 2 ? this.input5 : '',
                };
                this.$api.toBeConfirmTaskList(data).then(res => {
                    let {data: layer1} = res;
                    let {data, respCode} = layer1;
                    if (respCode === 0) {
                        this.total = data.total;
                        if (data.list) {
                            this.tableData = data.list;
                        } else {
                            this.tableData = [];
                        }
                        if(type != 1){
                            this.getTaskMarket({taskNumber:this.total,type:2})
                        }
                    }
                }).catch(err => {
                    console.log('err', err);
                })
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
            handleCurrentChange(val) {
                this.currentPage = val;
                this.getList();
            },
            formatbindingStatus(row) {
                let val = row.bindingStatus;
                if (val == 1) {
                    return '服务中'
                } else if (val == 2) {
                    return '待项目经理同意解绑'
                } else if (val == 3) {
                    return '待客户同意解绑'
                } else if (val == 4) {
                    return '已解绑'
                } else {
                    return ''
                }
            },
        }
    }
</script>
<style lang="scss">
    .toConfirmCon {
        .searchBtn {
            vertical-align: 2px;
        }

        .el-table {
            .cell {
                text-align: center;
                flex-direction: row;
            }
        }

        .spMeSet {
            .el-dialog__footer {
                padding-bottom: 10px !important;
            }

            .el-dialog__header {
                border-bottom: none;
            }
        }

        .el-table .cell {
            padding-left: 10px;
        }

        .el-table .cell-hook td:first-child .cell {
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
        }
    }
</style>