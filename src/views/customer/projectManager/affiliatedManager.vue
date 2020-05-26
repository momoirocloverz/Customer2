<template>
    <div class="back-white">
        <search-bar @handleSearch="handleSearch" placeholder="输入班务经理姓名搜索">
        </search-bar>

        <div class="back-white btn-div flexable">
            <el-button class="primary-btn" size="mini" @click="handleBind" style="width:135px;">添加挂靠</el-button>
        </div>

        <div class="table-box back-white">
            <el-table :data="managerList" emptyText="暂无相关信息" v-loading="loading">
                <el-table-column prop="managerName" label="姓名" align="center" show-overflow-tooltip
                                 min-width="80"></el-table-column>
                <el-table-column prop="mobile" label="手机号" align="center"
                                 show-overflow-tooltip></el-table-column>
                <el-table-column prop="hookRate" label="挂靠费" :formatter="formatterRate" align="center" show-overflow-tooltip></el-table-column>
                <el-table-column prop="deposit" label="保证金" :formatter="priceFormatter" align="center" show-overflow-tooltip></el-table-column>
                <el-table-column prop="bindingTime" :formatter="dateFormatter" label="挂靠开始" align="center"
                                 show-overflow-tooltip></el-table-column>
                <el-table-column prop="unbindingTime" :formatter="dateFormatter" label="挂靠结束" align="center"
                                 show-overflow-tooltip></el-table-column>
                <el-table-column prop="status" label="状态" :formatter="statusModify" align="center"
                                 show-overflow-tooltip></el-table-column>
                <el-table-column label="操作" align="center" min-width="180">
                    <template v-slot="scope">
                        <el-button v-if="scope.row.status == 2" type="text" class="btn-icon btn-icon-reject" size="mini"
                                   @click="handleUnbind(scope.row)">取消挂靠
                        </el-button>
                        <el-button v-if="scope.row.status == 1" type="text" class="btn-icon btn-icon-agree" size="mini"
                                               @click="agree(scope.row)">同意
                    </el-button>
                        <el-button v-if="scope.row.status == 1" type="text" class="btn-icon btn-icon-reject" size="mini"
                                   @click="refuse(scope.row)">拒绝
                        </el-button>
                        <el-button type="text" class="btn-icon btn-icon-view" size="mini"
                                   @click="handleView(scope.row)">挂靠记录
                        </el-button>

                    </template>
                </el-table-column>
            </el-table>

            <div class="pagination-container" v-if="managerParams.total">
                <el-pagination class="mypagination" @current-change="handlePageNumChange"
                               :current-page="managerParams.pageNum" :page-size="managerParams.pageSize"
                               layout="total , prev, pager, next, jumper" :total="managerParams.total"></el-pagination>
            </div>
        </div>

        <!-- 新增班务经理表单 -->
        <el-dialog :title="`确认同意由${params.managerName}成为你的挂靠班务经理吗？`" :visible.sync="showMangerForm"
                   :before-close="handleClearState"
                   width="540px">
            <el-form :model="managerForm" ref="bond" label-position="middle" label-width="120px"
                     :rules="managerRules">
                <el-form-item label="挂靠费:" prop="price">
                    <el-input v-model="managerForm.price" placeholder="请输入挂靠费率" style="width: 80%"
                              autocomplete="off"></el-input>
                    %
                </el-form-item>
                <el-form-item label="保证金:" prop="bond">
                    <el-input v-model="managerForm.bond" placeholder="请输入保证金" style="width:  80%"
                              autocomplete="off"></el-input>
                    元
                </el-form-item>
                <div class="co-999 pt20 pb20 pl20 pr20">
                    保证金由班务经理抢单任务、申请挂靠时交于平台保管作为该任务的保障之用，放弃任务或任务结束时将于平台返还给该班务经理。
                </div>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="handleClearState">取 消</el-button>
                <el-button type="primary" size="small" @click="handleManagerFormSave">确 认</el-button>
            </div>
        </el-dialog>
        <el-dialog :title="`挂靠记录 - ${params.managerName}`" :visible.sync="showRecord" height="500px"
                   width="1000px">
            <el-table :data="tableList" empty-text="暂无相关任务信息">
                <el-table-column prop="bindingTime" :formatter="dateFormatter" label="挂靠开始" align="center"
                                 show-overflow-tooltip></el-table-column>
                <el-table-column prop="unbindingTime" :formatter="dateFormatter" label="挂靠结束" align="center"
                                 show-overflow-tooltip></el-table-column>
                <el-table-column prop="hookRate" label="挂靠费" :formatter="formatterRate" align="center" show-overflow-tooltip></el-table-column>
                <el-table-column prop="deposit" label="保证金" :formatter="priceFormatter" align="center" show-overflow-tooltip></el-table-column>
                <el-table-column prop="status" label="状态" :formatter="statusModify" align="center"
                                 show-overflow-tooltip></el-table-column>
            </el-table>

            <div class="pagination-container" v-if="total">
                <el-pagination class="pagebox" layout="total, prev, pager, next, jumper"
                               @current-change="handleCurrentChange" :current-page="currentPage" :total="total"
                               :page-size="pageSize">
                </el-pagination>
            </div>
        </el-dialog>
        <el-dialog
                title="验证码"
                :visible.sync="showBindLog"
                width="30%"
                center>
            <div class="pb20" style="width:100%;text-align:center">
                挂靠验证码:{{code}}<br/>
                (验证码30分钟内有效)
            </div>
            <div>绑定步骤:<br/>
                1.将此验证码告知需挂靠的班务经理<br/>
                2.班务经理登录班务经理APP，进入个人中心-我挂靠的经理人页面，点击右上角添加“+”按钮 <br/>
                3.输入此验证码并提交进行绑定 <br/>
                4.设置挂靠费率，并同意该班务经理成为您的挂靠班务经理，当该班务经理领取任务时可选择您成为所属的经理人，您可从中收取挂靠费。<br/>
                5.保证金由平台保管，放弃任务或任务完成时将退回给班务经理；
            </div>
            <span slot="footer" class="dialog-footer">
                <!--<el-button @click="showBindLog = false">取 消</el-button>-->
                <el-button type="primary" size="small" @click="showBindLog = false">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
    import util from '../../../common/util'
    import SearchBar from '@/components/SearchBar'

    const BondTest = /(^[0-9][0-9]{0,1}$)|(^[0-9][0-9]{0,1}[\.]{1}[0-9]{0,1}$)/;
    // const PriceTest = /(^[1-9]([0-9]+)?(\.[0-9]{1,2})?$)|(^(0){1}$)|(^[0-9]\.[0-9]([0-9])?$)/;
    // const BondTest = /^(([0-9]|([1-9][0-9]{0,9}))((\.[0-9]{1})?))$/;
    const PriceTest = /^\d+$/;//非负整数
    export default {
        name: "affiliatedManager",
        components: {SearchBar},
        data() {
            const checkPrice = (rule, value, callback) => {
                if (!BondTest.test(value)) {
                    callback(new Error('请输入0~99.9的数,最多保留1位小数'));
                }
                callback();
            }
            const checkBond = (rule, value, callback) => {
                if (!PriceTest.test(value)) {
                    callback(new Error('请输入大于等于0的正整数 '));
                }
                callback();
            }
            return {
                code: '',
                showBindLog: false,
                showRecord: false,
                loading: false,
                managerList: [],
                managerParams: {
                    pageSize: 20,
                    pageNum: 1,
                    name: '',
                    total: 0
                },
                managerForm: {
                    bond: '',
                    price: '',
                },
                managerRules: {
                    price: [{
                        required: true, message: '挂靠费不能为空', trigger: 'blur'
                    }, {
                        validator: checkPrice, trigger: 'blur'
                    }],
                    bond: [{
                        required: true, message: '保证金不能为空', trigger: 'blur'
                    }, {
                        validator: checkBond, trigger: 'blur'
                    }],
                },
                total: 0,
                currentPage: 1,
                pageSize: 20,
                tableList: [],
                showMangerForm: false,
                params: {},
            }
        },
        watch: {},
        mounted() {
            this.handleGetManagerList();
        },
        methods: {
            handleGetCode() {
                this.$api.customerManagerGetBindingCode().then(res => {
                    if (res.respCode === 0) {
                        this.code = res.data;
                        this.handleShowBindLog(true);
                    }
                })
            },
            handleUnbind(row) {
                this.$confirm(`确定取消${row.managerName}的挂靠资格?`, '提示', {
                    confirmButtonText: '确 认',
                    cancelButtonText: '取 消',
                    type: 'warning'
                }).then(() => {
                    this.$api.hookCancel({id: row.id}).then(res => {
                        if (res.respCode === 0) {
                            this.$message({
                                message: '取消成功',
                                type: 'success'
                            });
                            this.handleGetManagerList();
                        }
                    });
                }).catch((err) => {
                    console.log(err)
                });
            },
            async handleView(row) {
                this.params = Object.assign({}, row);
                await this.getData();
                this.showRecord = true;
            },
            agree(row) {
                this.params = Object.assign({}, row);
                this.showMangerForm = true;
            },
            refuse(row) {
                //拒绝挂靠
                this.$confirm(`确定拒绝${row.managerName}的挂靠申请?`, '提示', {
                    confirmButtonText: '确 认',
                    cancelButtonText: '取 消',
                    type: 'warning'
                }).then(() => {
                    this.$api.hookRefuse({id: row.id}).then(res => {
                        if (res.respCode === 0) {
                            this.$message({
                                message: '拒绝成功',
                                type: 'success'
                            });
                            this.handleGetManagerList();
                        }
                    });
                }).catch((err) => {
                    console.log(err)
                });
            },
            handleShowBindLog(status) {
                this.showBindLog = status;
            },
            handleBind() {
                this.handleGetCode();
            },
            handlePageNumChange(val) {
                this.managerParams.pageNum = val;
                this.handleGetManagerList();
            },
            handleGetManagerList() {
                const {pageSize, pageNum, name} = this.managerParams;
                this.loading = true;
                this.$api.hookList({pageSize, pageNum, name: name,}).then(res => {
                    if (res.respCode === 0) {
                        this.managerList = res.data.list || [];
                        this.managerParams.total = res.data.total || 0;
                    }
                }).catch(err => {

                }).finally(() => {
                    this.loading = false;
                })
            },
            handleClearState() {
                this.$refs['bond'].resetFields();
                this.managerForm = {
                    price: '',
                    bond: '',
                };
                this.showMangerForm = false;
            },
            handleManagerFormSave() {
                //添加挂靠费
                this.$refs['bond'].validate(async (valid) => {
                    if (valid) {
                        let params = {...this.params, deposit: this.managerForm.bond, hookRate: this.managerForm.price};
                        let {respCode,data} =await this.$api.hookApprove(params);
                        console.log(respCode,data)
                        if (data.respCode === 0) {
                            this.$message.success('挂靠成功!');
                            this.handleGetManagerList();
                            this.$refs['bond'].resetFields();
                            this.showMangerForm = false;
                        }
                    } else {
                        this.$message.error('请按照要求正确填写内容!')
                    }
                })
            },
            dateFormatter(row, column, cellValue, index) {
                if(cellValue){
                    return util.minDate(cellValue)
                }else{
                    return '无'
                }
            },
            priceFormatter(row, column, cellValue, index) {
                if(Number(cellValue) >= 0){
                    return cellValue
                }else{
                    return '无'
                }
            },
            formatterRate(row, column, cellValue, index) {
                if(cellValue){
                    return cellValue + '%'
                }else{
                    return '无'
                }
            },
            statusModify(row, column, cellValue, index) {
                let status = ''
                switch (Number.parseInt(cellValue)) {
                    case 1:
                        status = '申请中'
                        break
                    case 2:
                        status = '挂靠中'
                        break
                    case 3:
                        status = '已取消'
                        break
                    case 4:
                        status = '已拒绝'
                        break;
                    default:
                        status = ''
                        break
                }
                return status
            },
            handleSearch(keyword) {
                this.managerParams.name = keyword;
                this.managerParams.pageNum = 1;
                this.handleGetManagerList();
            },
            // 切换分页
            handleCurrentChange(val) {
                this.currentPage = val;
                this.getData();
            },
            getData(keywords) {
                let _this = this;
                _this.tableList = [];
                _this.pageCount = 0;
                _this.total = 0;
                const params = {
                    pageNum: this.currentPage,
                    pageSize: this.pageSize,
                    managerId: this.params.managerId,
                    // status: this.params.status,
                }
                this.$api.hookRecord(params)
                    .then((res) => {
                        const {respCode,data} = res;
                        if(respCode === 0){
                            _this.pageCount = data.pages
                            _this.total = data.total
                            _this.tableList = data.list || []
                            console.log(_this.tableList)
                        }
                    })
                    .catch((error) => {
                        console.log(error);
                    });
            },
        }
    }
</script>
<style scoped>
    .el-dialog__footer {
        padding-bottom: 12px !important;
    }

    .el-button--default, .el-button--primary {
        width: 90px;
        height: 36px;
        line-height: 8px;
    }

    .el-input__inner {
        height: 32px;
    }

    .el-form-item__content {
        line-height: 40px;
    }

    .info-item {
        margin: 20px 0px;
    }

    .box-body-item-title {
        font-size: 18px;
        font-weight: normal;
        font-stretch: normal;
        letter-spacing: 0px;
        color: #262626;
        line-height: 40px;
    }

    .box-body-item {
        margin-top: 40px;
    }

    .table {
        padding: 20px;
    }

    .setting-table {
        width: 100%;
    }

    thead {
        width: 100%;
    }

    .rant-input {
        width: 180px;
    }

    td {
        background-color: #fff
    }
    .table-info .t-div {
        font-size: 14px;
        font-weight: normal;
        font-stretch: normal;
        letter-spacing: 0px;
        color: #5C5C5C;
        margin-top: 16px;
        line-height: 20px;
    }
</style>