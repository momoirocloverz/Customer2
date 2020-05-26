<template>
    <div class="back-white unclaimed">
        <div class="filter-condition">
            <el-form ref="form" :model="form" label-width="100px" labelPosition="left" class="formSearchMarginTop">
                <div class="search-zone">
                    <el-form-item>
                        <el-input placeholder="输入关键字搜索" v-model="input5" size="mini"
                                  class="input-with-select select-input" prefix-icon="el-icon-search">
                            <el-select v-model="select" slot="append" placeholder="请选择" class="search-select">
                                <el-option label="班务名称" value="1"></el-option>
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
                        <span class="" >{{scope.row.receiverName}}</span>
                        <!--<span v-if="scope.row.isHook">挂靠: {{scope.row.managerNameAlias}}</span>-->
                    </template>
                </el-table-column>
                <el-table-column label="班务名称" prop="classTaskName" show-overflow-tooltip align="center" min-width="130"></el-table-column>
                <el-table-column label="所属任务" prop="assignmentInfoName" show-overflow-tooltip align="center" min-width="130"></el-table-column>
                <el-table-column label="开始时间" prop="startTime" show-overflow-tooltip :formatter="dateFormatter" align="center" min-width="130"></el-table-column>
                <el-table-column label="结束时间" prop="endTime" show-overflow-tooltip :formatter="dateFormatter" align="center" min-width="130"></el-table-column>
                <el-table-column label="结算方式" prop="settlementType" :formatter="settlementTypeFormatter"   show-overflow-tooltip align="center" ></el-table-column>
                <el-table-column label="结算类型" prop="taskType" :formatter="settlementTypeFor"   show-overflow-tooltip align="center" ></el-table-column>
                <el-table-column label="计价方式" prop="price" :formatter="handlePricingManager"   show-overflow-tooltip align="center" ></el-table-column>
                <el-table-column label="签约状态" prop="taskType" :formatter="settlementTypeFor"   show-overflow-tooltip align="center" ></el-table-column>
                <el-table-column label="操作"  min-width="190">
                <template slot-scope="scope">
                <el-button type="text" class="btn-icon btn-icon-view" size="mini" @click="routeToDetail(scope.row)">查看</el-button>
                <el-button type="text" class="btn-icon btn-icon-agree" size="mini" @click="handleAgreeVisible(scope.row)">同意</el-button>
                <el-button type="text" class="btn-icon btn-icon-reject" size="mini" @click="handleRefuse(scope.row)">拒绝</el-button>
                <!--<el-button type="text" class="btn-icon btn-icon-reject" size="mini" @click="handleReturn(scope.row)">撤回</el-button>-->
                </template>
                </el-table-column>
            </el-table>
            <div class="pagination-container" v-if="total!=0">
                <el-pagination class="pagebox" :total="total" layout="total , prev, pager, next, jumper"
                               @current-change="handleCurrentChange" :current-page="currentPage" :page-size="pageSize">
                </el-pagination>
            </div>
        </div>

        <el-dialog :title="`确认同意由班务经理${selectItem.receiverName}领取${selectItem.classTaskName}班务吗？`" :visible.sync="AgreeVisible" width="540px" class="base-dialog spMeSet">
                <el-form ref="form" :model="form" label-width="140px">
                <el-form-item label="保证金：" class="mb10 tl">
                    <div class="">{{selectItem.deposit}}元</div>
                </el-form-item>
                <el-form-item label="零工结算方式：">
                    <el-radio-group class="unc-radio-wrap" v-model="form.mode">
                        <el-radio class="pt10" label="2">全部设为周结</el-radio>
                        <el-radio class="pt10" label="4">全部设为月结</el-radio>
                        <el-radio class="pt10" label="3">加入待接收零工列表</el-radio>
                    </el-radio-group>
                    <div v-show="form.mode == '3'" class="tl co-999 pt10 lh18">
                        抢单时班务经理添加的零工中经理人未设置过结算方式的零工会显示在待接收零工列表
                    </div>
                </el-form-item>
                </el-form>
                <span slot="footer" class="dialog-footer">

                    <el-button size="medium" @click="cancelUnc">取 消</el-button>
                    <el-button size="medium" type="primary" @click="handleAgree">确 定</el-button>
                </span>
        </el-dialog>
        <el-dialog :title="`尊敬的用户，同意班务经理接单需进行电子签约，请添加电子签约的经办人。`" :visible.sync="AgreeVisibleTwo" width="540px" class="base-dialog spMeSet">
            <div class="tl co-999 pt10 lh18">
                电子签约时可指定已添加的经办人，经办人可通过合同链接，使用手机在人脸验证身份后对所指定的合同进行确认。
            </div>
            <span slot="footer" class="dialog-footer">
                    <el-button size="medium" @click="cancelUnc">暂不添加</el-button>
                    <el-button size="medium" type="primary" @click="handleAgree">马上添加</el-button>
                </span>
        </el-dialog>
        <el-dialog :title="`提示`" :visible.sync="AgreeVisibleThr" width="540px" class="base-dialog spMeSet">
            <div>
                复制以下链接或xxxxx到浏览器那边
                签约链接：xxxxxxxxxxxxxxxxxxxxxxxxxx   <span class="ql-color-blue">复制</span>
            </div>
            <span slot="footer" class="dialog-footer">
                    <el-button size="medium" @click="cancelUnc">关闭</el-button>
                    <el-button size="medium" type="primary" @click="handleAgree">新页面打卡签约链接</el-button>
                </span>
        </el-dialog>
        <!-- 编辑零工start -->
        <el-dialog :title="`同意班务经理接单需进行电子签约，`"
                   :visible.sync="dialogVisibleAgreeSign" width="720px" :center="true">
            <div class="overflow-box">
                <el-form label-width="150px" label-position="right" :rules="rules" :model="form">
                    <el-form-item label="选择电子签约经办人：" required prop="singName">
                        <!--<el-select v-model="form.singName" class="radius-input" style="width:280px"-->
                                   <!--placeholder="请选择">-->
                            <!--<el-option v-for="(item,index) in []" :key="index" :label="item.name"-->
                                       <!--:value="item.id">-->
                            <!--</el-option>-->
                        <!--</el-select>-->
                    </el-form-item>
                    <el-form-item>
                        <span class="ql-color-blue">+添加经办人</span>
                    </el-form-item>
                    <el-form-item>
                        <div class="co-999">
                            <p>选中的经办人可通过合同链接，使用手机在人脸验证身份后对所指定的合同进行确认。</p>
                        </div>
                    </el-form-item>
                </el-form>
            </div>
            <span slot="footer" class="dialog-footer">
            <el-button size="small" @click="dialogVisibleAgreeSign = false">取消</el-button>
            <el-button size="small" type="primary" @click="saveTrue()">确认</el-button>
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
            let validateName = (rule, value, callback) => {
                console.log(value,rule)
                if (!this.form.signName) {
                    callback(new Error("经办人不能为空!"));
                } else {
                    callback();
                }
            }
            return {
                pmId: '',
                selectItem: {},
                input5: '',
                select: '1',
                radio4: 1,
                AgreeVisible: false,
                AgreeVisibleTwo: false,
                AgreeVisibleThr: false,
                dialogVisibleAgreeSign: false,
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
                    mode:"",
                    bindingStatus: '-1',
                    singName:'',
                },
                rules: {
                    signName: [
                        {required: true, message: '经纪人不能为空!', trigger: 'blur'},
                        {validator:validateName,trigger: ['change','blur'],}
                    ],
                },
            }
        },
        computed:{
            //获取任务市场的待确认数字
            ...mapGetters(['getTaskMarketInfo'])
        },
        mounted() {
            // this.getTaskMarket();
            this.getList();
        },
        methods: {
            ...mapActions(['getTaskMarket']),
            handlePricingManager(val) {
                console.log(val)
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
            saveTrue(){

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
            settlementTypeFor(row, column, cellValue, index) {
                let status = '';
                // 1.指派给自己 2.经理人抢单 3.指派给自己的经理人合作伙伴 4.外包任务）
                switch (Number.parseInt(cellValue)) {
                    case 1:
                        status = '代发任务'
                        break
                    case 2:
                        status = '代发任务'
                        break
                    case 3:
                        status = '代发任务'
                        break
                    case 4:
                        status = '外包任务'
                        break
                    default:
                        status = '-'
                        break
                }
                return status
            },
            cancelUnc(){
                this.AgreeVisible = false
                this.AgreeVisibleTwo = false
                this.AgreeVisibleThr = false
                this.form.mode = '';
            },
            handleAgree() {
                let _this = this;
                if(!this.form.mode){
                    return this.$message.error('请选择零工结算方式!')
                }
                if(this.request){
                    return
                }
                this.request = true;
                const params = {
                    receiveId: this.selectItem.receiveId,
                    mode: this.form.mode,
                }
                this.$api.classTaskReceiveReceive(params).then(res => {
                    let {data: layer1} = res;
                    let {data, respCode} = layer1;
                    if (respCode === 0) {
                        this.$message({
                            message: '操作成功',
                            type: 'success'
                        });
                        this.AgreeVisible = false;
                        this.form.mode = '';
                        this.getList()
                    }
                }).catch(err => {
                    console.log('err', err);
                }).finally(()=>{
                    setTimeout(()=>{
                        _this.request = false;
                    },500)
                })
            },
            handleRefuse(row) {
                this.$confirm(`确认拒绝由${row.receiverName}领取${row.classTaskName} 班务吗?`, '提示', {
                    confirmButtonText: '确 认',
                    cancelButtonText: '取 消',
                    type: 'warning'
                }).then(() => {
                    this.$api.rejectClassTaskReceive({id:row.receiveId}).then(res=>{
                        if(res.data.respCode===0){
                            this.$message({
                                type: 'success',
                                message: '操作成功!'
                            });
                            this.currentPage = 1;
                            this.getList();
                        }
                    })
                }).catch(() => {
                })
            },
            handleReturn(row) {
                this.$confirm(`确认撤回${row.receiverName}班务${row.classTaskName}班务经理电子签约,并同时拒绝该班务经理的抢单?`, '提示', {
                    confirmButtonText: '确 认',
                    cancelButtonText: '取 消',
                    type: 'warning'
                }).then(() => {
                    this.$api.rejectClassTaskReceive({id:row.receiveId}).then(res=>{
                        if(res.data.respCode===0){
                            this.$message({
                                type: 'success',
                                message: '操作成功!'
                            });
                            this.currentPage = 1;
                            this.getList();
                        }
                    })
                }).catch(() => {
                })
            },
            handleAgreeVisible(item) {
                this.selectItem = item;
                this.AgreeVisible = true;
            },
            getList(type) {
                let data = {
                    pageNum: this.currentPage,
                    pageSize: this.pageSize,
                    classTaskName: this.select == 1 ? this.input5 : '',
                    receiverManagerName: this.select == 2 ? this.input5 : '',
                };
                this.$api.toBeConfirmWorkList(data).then(res => {
                    let {data: layer1} = res;
                    let {data, respCode} = layer1;
                    if (respCode === 0) {
                        this.total = data.total;
                        if (data.list) {
                            this.tableData = data.list;
                        } else {
                            this.tableData = [];
                        }
                        if(type && type != 1){
                            this.getTaskMarket({workNumber:this.total,type:1})
                        }
                    }
                }).catch(err => {
                    console.log('err', err);
                })
            },
            routeToDetail(row) {
                const {href} = this.$router.resolve({
                    name: "classWorkDetail",
                    query: row
                });
                window.open(href, "_blank");
            },
            handleCurrentChange(val) {
                this.currentPage = val;
                this.getList();
            },
            formatbindingStatus(row) {
                let val = row.bindingStatus
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
    .unclaimed {
        .searchBtn {
            vertical-align: 2px;
        }
        .unc-radio-wrap{
            display: flex;
            flex-direction:column;
            justify-content: flex-start;
            align-items: flex-start;
        }
        .el-table {
            .cell {
                text-align: center;
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

        .el-table .cell-hook .cell {
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
        }
    }
</style>