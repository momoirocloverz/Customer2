<template>
    <div class="workBlackListCon back-white" v-loading="loading" element-loading-text="正在导出excel表...">
        <div class="filter-condition">
            <el-form ref="form" :model="form" label-width="100px" labelPosition="left">
                <div class="search-zone">
                    <el-form-item class="formSearchMargin ">
                        <el-input placeholder="根据下拉框选项输入关键字搜索" v-model="form.keyWords" size="mini"
                                  class="input-with-select select-input">
                            <el-select v-model="form.selectType" slot="append" placeholder="请选择">
                                <el-option label="零工姓名" value="1"></el-option>
                                <!--<el-option label="手机号码" value="2"></el-option>-->
                                <el-option label="身份证号" value="3"></el-option>
                            </el-select>
                        </el-input>
                        <el-button type="primary" class="searchBtn" @click="handleSearch">搜索</el-button>
                    </el-form-item>
                </div>
            </el-form>
        </div>
        <div class="back-white btn-div flexable">
            <el-button class="primary-btn addBlackBtn" size="mini" @click="addBlackName">添加黑名单</el-button>
        </div>
        <div class="table-box back-white">
            <el-table :data="tableData" empty-text="暂无相关信息">
                <el-table-column label="姓名" prop="realNameAlias" show-overflow-tooltip align="center"
                                 min-width="80"></el-table-column>
                <el-table-column label="身份证号" prop="idCard" show-overflow-tooltip align="center"
                                 min-width="120"></el-table-column>
                <el-table-column label="最近添加时间" prop="createdAt" :formatter="dateFormatter" show-overflow-tooltip
                                 align="center" min-width="100"></el-table-column>
                <el-table-column label="原因" prop="reason" show-overflow-tooltip
                                 align="center" min-width="100">
                    <template v-slot="scope">
                        <span>{{ scope.row.reason }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="操作" align="center" min-width="150">
                    <template v-slot="scope">
                        <el-button type="text" class="btn-icon btn-icon-delete" size="mini"
                                   @click="handleDeleteVisible(scope.row)">删除
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

        <!--添加黑名单第一步-->
        <el-dialog title="添加黑名单-第一步" :visible.sync="isFirst" :before-close="emptyData">
            <el-form :model="formFirst" :rules="rules" ref="formFirst"  @submit.native.prevent>
                <el-form-item label="零工身份证号:" prop="idCard" :label-width="formLabelWidth">
                    <el-input v-model="formFirst.idCard" maxlength="21" auto-complete="off"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="emptyData()">取 消</el-button>
                <el-button type="primary" @click="addFrist()">确 定</el-button>
            </div>
        </el-dialog>
        <!-- 添加黑名单第二步 -->
        <el-dialog :title="formTwo.titleTwo" :visible.sync="isTwo" :before-close="emptyDataTwo">
            <el-form :model="formTwo" :rules="rulesTwo" ref="formTwo">
                <el-form-item v-if="formTwo.isAuth" label="零工姓名:" :label-width="formLabelWidth">
                    <div class="lh40">{{formTwo.name}}</div>
                </el-form-item>
                <el-form-item label="零工身份证号:" :label-width="formLabelWidth">
                    <el-input v-show="!formTwo.idCard" v-model="formTwo.idCard" auto-complete="off"></el-input>
                    <div v-show="formTwo.idCard" class="lh40">{{formTwo.idCard}}</div>
                </el-form-item>
                <el-form-item v-show="!formTwo.isAuth" prop="name" label="零工姓名:" :label-width="formLabelWidth">
                    <el-input v-model="formTwo.name" maxlength="10" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="添加原因:" prop="desc" :label-width="formLabelWidth">
                    <el-input type="textarea" maxlength="200"
                              placeholder="请输入添加该零工为黑名单的理由" v-model="formTwo.desc"
                              auto-complete="off"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="addTwo(-1)">上一步</el-button>
                <el-button type="primary" @click="addTwo(1)">确 定</el-button>
            </div>
        </el-dialog>
        <!-- 确认删除-->
        <el-dialog :visible.sync="DeleteVisible" width="450px" class="base-dialog">
            <div class="dialog-head" style="margin-top: 40px">
                <p class="base-dialog-title">确定将 " {{deleteName}} " 从黑名单中删除吗？</p>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button size="medium" @click="DeleteVisible = false">取 消</el-button>
                <el-button size="medium" type="primary" @click="handleDelete">确 定</el-button>
              </span>
        </el-dialog>
    </div>
</template>

<script>
    export default {
        name: "blackList",
        data() {
            let validCard = function (rule, value, callback) {
                let reg = /^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$|^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}([0-9]|X)$/;
                if(value){
                    if(!reg.test(value.replace(/\s+/g, "").replace(/x/g, "X"))){
                        callback(new Error('请输入正确的身份证号!'));
                    }
                }
            };
            return {
                DeleteVisible: false,
                deleteId: '',
                deleteName: '',
                loading: false,
                tableData: [],
                total: 0,
                currentPage: 1,
                pageCount: 1,
                pageSize: 20,
                isShowComb: false,//筛选
                form: {
                    selectType: '1',
                    sex: "",
                    keyWords: "",
                },
                formLabelWidth: "120px",
                formFirst: {
                    idCard: '',
                },
                requestAdd:false,
                formTwo: {
                    idCard: '',
                    name: '',
                    titleTwo: '添加黑名单-第二步',
                    desc: '',
                    isAuth: false,
                },
                isFirst: false,//第一步
                isTwo: false,//第二步
                rules: {
                    idCard: [
                        {required: true, message: '零工身份证号不能为空!', trigger: 'blur'},
                        {
                            required: true,
                            trigger: "blur",
                            validator: validCard
                        },
                    ],
                },
                rulesTwo: {
                    name: [
                        {required: true, message: '请输入真实姓名!', trigger: 'blur'},
                    ],
                    desc: [
                        {required: true, message: '请输入添加该零工为黑名单的理由,不超过200字!', trigger: 'blur'},
                    ]
                },
            };
        },
        watch: {
            "form.sex": function (val, oldval) {
                this.currentPage = 1;
                this.getList();
            },
            'formFirst.idCard': function(val){
                val = val.replace(/\s/g, '').replace(/(^(\d{6})|(\d{4}))(?=[^\s])/g, "$1 ");
                this.formFirst.idCard = val;
                return val;
            },
        },
        mounted() {
            this.getList();
        },
        methods: {
            emptyData: function () {
                this.formFirst.idCard = '';
                this.isFirst = false;
                this.$refs['formFirst'].resetFields();
            },
            emptyDataTwo: function () {
                this.formTwo.idCard = '';
                this.formTwo.name = '';
                this.formTwo.desc = '';
                this.formFirst.idCard = '';
                this.isFirst = false;
                this.isTwo = false;
                this.$refs['formTwo'].resetFields();
            },
            //添加黑名单 第一步
            addFrist: function () {
                let _this = this;
                let reg = /^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$|^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}([0-9]|X)$/;
                let card = this.formFirst.idCard.replace(/\s+/g, "").replace(/x/g, "X");
                if (!_this.formFirst.idCard.trim()) {
                    return _this.$message.warning('请输入身份证号!')
                }
                if (!reg.test(card)) {
                    return _this.$message.warning('请输入正确的身份证号!')
                }
                if (_this.requestFirst) {
                    return
                }
                _this.requestFirst = true;
                let params = {idCard: card}
                _this.$api.isAuthentic(params).then(res => {
                    if (res.data.respCode === 0) {
                        if (res.data.data) { //认证成功返回名字，没有说明还没有实名认证
                            _this.formTwo.name = res.data.data; //认证后的名字
                            _this.formTwo.isAuth = true;     //实名认证过
                            _this.formTwo.titleTwo = '添加黑名单-第二步';
                        } else {
                            _this.formTwo.name = '';
                            _this.formTwo.isAuth = false;
                            _this.formTwo.titleTwo = '添加黑名单-未注册';
                        }
                        _this.formTwo.idCard = card; //认证后的身份证号
                        _this.isFirst = false;  //第一步隐藏
                        _this.isTwo = true;     //第二步展示
                    }
                }).catch(err => {
                    this.$message.error(err);
                }).finally(() => {
                    //最后请求完毕标识初始化
                    _this.requestFirst = false;
                })
            },
            //添加黑名单 第二步
            addTwo: function (type) {
                let _this = this;
                if (type > 0) { //确认
                    let name = _this.formTwo.name.replace(/\s*/g,"");
                    if (!name) {
                        return _this.$message.warning('请输入真实姓名!')
                    }
                    if (!_this.formTwo.idCard.trim()) {
                        return _this.$message.warning('请输入身份证号!')
                    }
                    if (_this.formTwo.idCard.length !== 18) {
                        return _this.$message.warning('请输入正确的身份证号!')
                    }
                    let desc = _this.formTwo.desc.trim();
                    if (!desc || desc.length > 200) {
                        return _this.$message.warning('请输入添加该零工为黑名单的理由,不超过200字!')
                    }
                    if (_this.requestAdd) {
                        return
                    }
                    _this.requestAdd = true;
                    let params = {
                        idCard: _this.formTwo.idCard, //身份证
                        reason: _this.formTwo.desc,  //原因
                        realNameAlias:name, //姓名
                    }
                    _this.$api.addBlackList(params).then(res => {
                        if (res.data.respCode === 0) {
                            _this.isTwo = false;
                            _this.currentPage = 1;
                            _this.getList();
                            //成功后之前的卡号清空
                            setTimeout(()=>{
                                _this.formFirst.idCard = '';
                                _this.formTwo.desc = '';
                                _this.formTwo.name = '';
                            },500)
                        }
                    }).catch(err => {
                        _this.$message.error(err)
                    }).finally(() => {
                        //最后请求完毕标识初始化，
                        console.log('3')
                        setTimeout(()=>{
                         _this.requestAdd = false;
                        },500)
                    });
                } else { //返回上一步
                    this.isFirst = true;
                    this.isTwo = false;
                }
            },
            //删除准备
            handleDeleteVisible(item) {
                this.deleteId = item.id || this.$message.warning('id怎么不见了呢');
                this.deleteName = item.realNameAlias || '';
                this.DeleteVisible = true;
            },
            //确认删除
            handleDelete() {
                let _this = this;
                if (_this.requestDelete) {
                    return
                }
                _this.requestDelete = true;
                let params = {id: _this.deleteId}
                _this.$api.deleteBlackList(params).then(res => {
                    if (res.respCode === 0) {
                        _this.currentPage = 1;
                        _this.getList();
                        _this.DeleteVisible = false;
                    } else {
                        _this.$message.error(res.errorMsg);
                    }
                }).catch(err => {
                    _this.$message.error(err)
                }).finally(() => {
                    _this.requestDelete = false;
                });
            },
            handleCombShow() {
                this.isShowComb = !this.isShowComb
            },
            dateFormatter(row, column, cellValue, index) {
                return cellValue.substring(0,16)
            },
            sexFormatter(row, column, cellValue, index) {
                let status = "男";
                switch (Number.parseInt(cellValue)) {
                    case 1:
                        status = "男";
                        break;
                    case 2:
                        status = "女";
                        break;
                    default:
                        status = "男";
                        break;
                }
                return status;
            },

            handleSearch() {
                this.currentPage = 1;
                this.getList()
            },
            handleCurrentChange(val) {
                this.currentPage = val;
                this.getList();
            },
            //添加黑名单
            addBlackName() {
                this.isFirst = true;
                console.log('add');
            },
            getList() {
                const params = {
                    pageNum: this.currentPage,
                    pageSize: 20,
                    sex: this.form.sex,
                    idCard: '',//身份证号
                    mobile: '',//手机号
                    realNameAlias: '',//姓名防重名
                };
                //this.form.keyWord
                if (this.form.selectType && this.form.keyWords) {
                    switch (this.form.selectType) {
                        case '1':
                            params['realNameAlias'] = this.form.keyWords;
                            break;
                        case '3':
                            params['idCard'] = this.form.keyWords;
                            break;
                        default:
                            params['realNameAlias'] = this.form.keyWords;
                    }
                }
                this.$api.getBlackList(params).then(res => {
                    if (res.data.list && res.data.list.length > 0) {
                        this.tableData = Array.from(res.data.list);
                        this.total = res.data.total;
                    } else {
                        this.tableData = [];
                        this.total = 0;
                    }
                }).catch(error => {
                    console.log(error);
                });
            },
        }
    };
</script>
<style lang="scss" scoped>
    .workBlackListCon {
        .searchBtn {
            vertical-align: 2px;
        }
        .addBlackBtn {
            width: 120px;
            text-align: center;
        }
    }
</style>