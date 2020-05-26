<template>
    <div class="back-white">
        <search-bar @handleSearch="handleSearch" placeholder="输入班务经理姓名搜索">
            <!--选择条件的单选按钮-->
            <!--<el-form ref="form" :model="form" label-width="90px" class="formSearchMarginTop filter-form" label-position="left">
              <el-form-item label="绑定状态：" class="formSearchMargin">
                <el-radio-group class="radio-search" v-model="form.bindingStatus">
                  <el-radio label="-1">不限</el-radio>
                  <el-radio label="1">服务中</el-radio>
                  <el-radio label="2">待对方同意解绑</el-radio>
                  <el-radio label="3">待我同意解绑</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-form>-->
        </search-bar>

        <div class="back-white btn-div flexable">
            <!--<el-button class="primary-btn" size="mini" @click="handleEdit(false)" style="width:135px;">新增班务经理</el-button>-->
            <el-button class="primary-btn" size="mini" @click="handleBind" style="width:135px;">绑定班务经理</el-button>
            <el-button class="primary-btn" size="mini" @click="handleShowWorkHandoverList" style="width:135px;">
                查看工作交接记录
            </el-button>
        </div>

        <div class="table-box back-white">
            <el-table :data="managerList" emptyText="暂无相关信息" v-loading="loading" height="500">
                <el-table-column prop="managerNameAlias" label="姓名" align="center" show-overflow-tooltip
                                 min-width="80"></el-table-column>
                <el-table-column prop="managerMobile" label="登录手机号" align="center" show-overflow-tooltip
                                 min-width="80"></el-table-column>
                <!-- <el-table-column prop="empCount" label="我分配的员工数" align="center" show-overflow-tooltip min-width="80"></el-table-column> -->
                <el-table-column prop="bindingTime" :formatter="dateFormatter" label="最近绑定时间" align="center"
                                 show-overflow-tooltip min-width="100"></el-table-column>
                <el-table-column label="操作" align="right" show-overflow-tooltip min-width="200">
                    <template slot-scope="{row}">
                        <!--<el-button type="text" class="btn-icon btn-icon-edit" size="mini" @click="handleEdit(row,'edit')">编辑</el-button>
                        <el-button type="text" class="btn-icon btn-icon-edit-password" size="mini" @click="handleEdit(row,'password')">修改密码</el-button>-->
                        <el-button type="text" class="btn-icon btn-icon-unbind" size="mini" @click="handleUnbind(row)">解绑</el-button>
                        <el-button type="text" class="btn-icon btn-icon-view" size="mini" @click="handleView(row)">查看
                        </el-button>
                        <el-button type="text" class="btn-icon btn-icon-view" size="mini"
                                   @click="handleWorkHandover(row)">工作交接
                        </el-button>
                        <!--<el-button type="text" class="btn-icon btn-icon-reject" size="mini" v-if="scope.row.bindingStatus==2" @click="cancelunBind(scope.row)">取消解绑</el-button>-->
                        <!--<el-button type="text" class="btn-icon btn-icon-agree" size="mini" @click="agreeunBind(scope.row)">解绑</el-button>-->
                    </template>
                </el-table-column>
            </el-table>

            <div class="pagination-container" v-if="managerParams.total">
                <el-pagination class="mypagination" @current-change="handlePageNumChange"
                               :current-page="managerParams.pageNum" :page-size="managerParams.pageSize"
                               layout="total , prev, pager, next, jumper" :total="managerParams.total"></el-pagination>
            </div>
        </div>

        <!-- <el-dialog :visible.sync="boundDialogVisible" width="620px">
           <div class="text-center">
             <span class="dialog-sub-title">绑定验证码：<strong class="dialog-strong">{{this.code}}</strong></span>
             <p class="sub-title-tip">（验证码30分钟内有效）</p>
           </div>
           <div class="dialog-body">
             <span>绑定步骤：</span>
             <p>1.将此验证码告知需绑定的项目经理；</p>
             <p>2.项目经理登录经理人APP，进入个人中心-我服务的公司页面，点击右上角绑定按钮；</p>
             <p>3.输入此验证码并提交进行绑定；</p>
           </div>
         </el-dialog-->

        <!-- <el-dialog :visible.sync="unboundDialogVisible" width="540px" class="base-dialog">
           <div class="dialog-head">
             <p class="base-dialog-title">确认要与项目经理<strong class="dialog-strong">{{anctionItem.name}}</strong>解绑？</p>
             <p class="base-dialog-tip">(确认后需要项目经理在经理人APP上点击同意才算解绑完成)</p>
           </div>
           <span slot="footer" class="dialog-footer">
             <el-button size="medium" type="primary" @click="handleUnbound()">确 定</el-button>
             <el-button size="medium" @click="unboundDialogVisible = false">取 消</el-button>
           </span>
         </el-dialog>

         <el-dialog :visible.sync="CancelVisible" width="540px">
           <div class="dialog-head">
             <span>确认取消与项目经理<strong class="dialog-strong">{{anctionItem.name}}的解绑？</strong></span>
           </div>
           <span slot="footer" class="dialog-footer">
             <el-button size="medium" type="primary" @click="handleCancel">确 定</el-button>
             <el-button size="medium" @click="CancelVisible = false">取 消</el-button>
           </span>
         </el-dialog>

         <el-dialog title="" :visible.sync="agreeVisible" width="500px">
           <div class="dialog-head">
             <span>确认同意项目经理<strong class="dialog-strong">{{anctionItem.name}}的解绑要求？</strong></span>
             <h4>确认后您与该项目经理将解绑</h4>
           </div>
           <span slot="footer" class="dialog-footer">
             <el-button size="medium" type="primary" @click="handleAgree">确 定</el-button>
             <el-button size="medium" @click="agreeVisible = false">取 消</el-button>
           </span>
         </el-dialog>-->

        <!-- 设置发薪日期 -->
        <!-- <el-dialog title="设置发薪日期" :visible.sync="dialogSetMoneyDate" v-if="dialogSetMoneyDate" width="540px">
       <el-form :model="formSetMoneyDate" label-position="middle">
         <el-form-item label="项目经理：" :labelWidth="'165px'">
           <span>{{nameAlias}}</span>
         </el-form-item>
         <el-form-item label="月结发薪日期：" :labelWidth="'165px'">
           <el-select v-model="formSetMoneyDate.monthPayDay" clearable placeholder="请选择" @change="get">
             <el-option :label="`${item.date}号`" :value="item.date" :key="item.date" v-for="item in yuejieData"></el-option>
           </el-select>
         </el-form-item>
         <el-form-item label="周结发薪日期：" :labelWidth="'165px'">
           <el-select v-model="formSetMoneyDate.weeklyPayDay" clearable placeholder="请选择">
             <el-option :label="item.label" :value="item.id" :key="item.id" v-for="item in zhoujieData"></el-option>
           </el-select>
         </el-form-item>
       </el-form>
       <div slot="footer" class="dialog-footer">
         <el-button type="primary" @click="btn_save">确 认</el-button>
         <el-button @click="dialogSetMoneyDate = false">取 消</el-button>
       </div>
     </el-dialog>-->
        <!-- 新增班务经理表单 -->
        <el-dialog :title="`${saveType===''?'新增班务经理':saveType==='edit'?'编辑班务经理':'修改密码'}`" :visible.sync="showMangerForm"
                   width="540px">
            <el-form :model="managerForm" label-position="middle" label-width="120px" ref="managerForm"
                     :rules="managerRules">
                <el-form-item label="姓名:" prop="name" v-if="showNameItem">
                    <el-input v-model="managerForm.name" style="width: 80%" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="姓名:" prop="name" v-if="!showNameItem">
                    <div style="height:40px;line-height:40px;">{{managerForm.name}}</div>
                </el-form-item>
                <el-form-item label="登录手机号:" prop="phone" v-if="showPhoneItem">
                    <el-input v-model="managerForm.phone" style="width:  80%" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="身份证:" prop="idCard" v-if="showIdCardItem">
                    <el-input v-model="managerForm.idCard" style="width:  80%" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="密码:" prop="password" v-if="showPasswordItem">
                    <el-input v-model="managerForm.password" style="width:  80%" autocomplete="off"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="handleManagerFormSave" :loading="subLoading">保 存</el-button>
                <el-button @click="showMangerForm = false">取 消</el-button>
            </div>
        </el-dialog>
        <el-dialog
                title="绑定验证码"
                :visible.sync="showBindLog"
                width="30%"
                center>
            <div style="width:100%;text-align:center">
                验证码:{{code}}<br/>
                (验证码30分钟内有效)
            </div>
            <div>绑定步骤:<br/>
                1.将此验证码告知需绑定的班务经理；<br/>
                2.班务经理登录班务经理APP，进入个人中心-我服务的经理人页面，点击右上角绑定按钮；<br/>
                3.输入此验证码并提交进行绑定；
            </div>
            <span slot="footer" class="dialog-footer">
    <!--<el-button @click="showBindLog = false">取 消</el-button>-->
    <el-button type="primary" @click="showBindLog = false">确 定</el-button>
  </span>
        </el-dialog>
        <el-dialog
                :title="thusName"
                :visible.sync="showContent"
                width="80%"
                center>
            <div>基本信息</div>
            <hr class="el-radio-group-hr"/>
            <div class="box-body-item">
                <div class="table-info info-item">
                    <div class="table-info-col1"><span>姓名</span></div>
                    <div class="table-info-col2"><span>{{thusRow.nameAlias}}</span></div>
                    <div class="table-info-col1"><span>手机号</span></div>
                    <div class="table-info-col2"><span>{{thusRow.mobile}}</span></div>
                    <div class="table-info-col1"><span>身份证号</span></div>
                    <div class="table-info-col2"><span>{{thusRow.idCard}}</span></div>
                    <div class="table-info-col1"><span>所在位置</span></div>
                    <div class="table-info-col2"><span>{{thusRow.address}}</span></div>
                </div>
            </div>
            <span slot="footer" class="dialog-footer">
    <!--<el-button @click="showBindLog = false">取 消</el-button>-->
    <el-button type="primary" @click="showContent = false">确 定</el-button>
  </span>
        </el-dialog>
        <el-dialog
                title="工作交接操作"
                :visible.sync="showWorkHandover"
                width="30%"
        >
            <el-form :model="workHandoverForm">
                <el-form-item label="交接班务经理：" :label-width="`120`">
                    {{managerListMap[workHandoverForm.oldClassManager]}}
                </el-form-item>
                <el-form-item label="承接班务经理：" :label-width="`120`">
                    <el-select v-model="workHandoverForm.newClassManager" placeholder="请选择班务经理">
                        <el-option v-for="it,i in myBindingManagerList" :key="i" :label="it.managerNameAlias"
                                   :value="it.managerId"></el-option>
                    </el-select>
                </el-form-item>
            </el-form>
            <p>工作交接操作后<br/>
                举例：将“班务经理A”的工作交接给“班务经理B”<br/>
                1、历史已结束的班务和排班数据不转移，仍为A所有<br/>
                2、转移的内容如下：<br/>
                （1）将本经理人指派给A且有未结束排班的班务复制给B<br/>
                （2）将A创建的未结束的排班及其排班考勤相关数据转移给B<br/>
                （3）将A服务于本经理人的零工复制给B<br/>
                （4）如有特殊考勤，则将分配给A的特殊考勤人员转给B<br/>
                （5）将A的与本经理人相关的所有待审核奖惩转移给B</p>
            <span slot="footer" class="dialog-footer">
    <el-button @click="showWorkHandover = false">取 消</el-button>
    <el-button type="primary" @click="handlePostWorkHandover">确 认</el-button>
  </span>
        </el-dialog>
        <el-dialog
                title="工作交接记录"
                :visible.sync="showWorkHandoverList"
                width="60%"
        >
            <el-dialog
                    width="30%"
                    title="交接明细"
                    :visible.sync="workHandover.innerVisible"
                    append-to-body>
                <ul class="lh22">
                    <li class="tc" v-for="(item,index) in workHandover.detaiList" :key="index">{{item}}</li>
                </ul>
                <div class="close-305 tc pt20">
                    <el-button type="primary" @click="closeNew()">关 闭</el-button>
                </div>
            </el-dialog>
            <el-table :data="workHandoverList" emptyText="暂无相关信息" v-loading="loading" height="500">
                <el-table-column prop="createdAt" label="时间" :formatter="dateFormatter" align="center"
                                 show-overflow-tooltip min-width=""></el-table-column>
                <el-table-column prop="managerNameAlias" label="交接班务经理" align="center" show-overflow-tooltip
                                 min-width=""></el-table-column>
                <el-table-column prop="toManagerNameAlias" label="承接班务经理" align="center" show-overflow-tooltip
                                 min-width=""></el-table-column>
                <el-table-column prop="toManagerNameAlias" label="交接明细" align="center" show-overflow-tooltip
                                 min-width="">
                    <template v-slot="scope">
                        <el-button type="text" class="btn-icon btn-icon-view" size="mini" @click="handleViewNew(scope.row)">查看
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>

            <div class="pagination-container" v-if="workHandover.total">
                <el-pagination class="mypagination" @current-change="handlePageNumChangeWork"
                               :current-page="workHandover.pageNum" :page-size="workHandover.pageSize"
                               layout="total , prev, pager, next, jumper" :total="workHandover.total"></el-pagination>
            </div>
            <div class="close-305 tr pt20">
                <el-button type="primary" @click="showWorkHandoverList = false">关 闭</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    import util from '../../../../common/util'
    import SearchBar from '@/components/SearchBar'

    const phoneTest = /^1[3456789]\d{9}$/;
    const passwordTest = /^[a-zA-Z0-9]{6,18}$/;
    const idCardTest = /^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$|^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}([0-9]|X)$/;
    export default {
        name: "Unbound",//未解绑
        components: {SearchBar},
        data() {
            const checkPhone = (rule, value, callback) => {
                if (!phoneTest.test(value)) {
                    callback(new Error('请输入正确的手机号'));
                }
                callback();
            }
            const checkPassword = (rule, value, callback) => {
                if (!passwordTest.test(value)) {
                    callback(new Error('请输入6-18位字母或数字'));
                }
                callback();
            }
            const checkIdCard = (rule, value, callback) => {
                if (!idCardTest.test(value)) {
                    callback(new Error('请输入正确的身份证号'));
                }
                callback();
            }
            return {
                managerListMap: {},
                handoverManagerId: null,
                myBindingManagerList: [],
                showWorkHandoverList: false,
                workHandoverParams: {
                    pageSize: 20,
                    pageNum: 1,
                    name: '',
                    total: 0
                },
                workHandoverList: [],
                workHandover: {
                    pageSize: 5,
                    pageNum: 1,
                    total: 0,
                    detaiList:[],
                    innerVisible:false,
                },
                workHandoverForm: {
                    oldClassManager: null,
                    newClassManager: null,
                },
                showWorkHandover: false,
                showContent: false,
                thusName: '',
                thusRow: {},
                code: '',
                bindTitle: '',
                showBindLog: false,
                loading: false,
                saveType: "",
                managerList: [],
                showNameItem: true,
                showPasswordItem: true,
                showPhoneItem: true,
                showIdCardItem: true,
                subLoading: false,
                managerParams: {
                    pageSize: 20,
                    pageNum: 1,
                    name: '',
                    total: 0
                },
                managerForm: {
                    name: '',
                    phone: '',
                    password: '',
                    id: null,
                    idCard: ''
                },
                managerRules: {
                    name: [{
                        required: true, message: '姓名不能为空', trigger: 'blur'
                    }],
                    phone: [{
                        required: true, message: '登录手机号不能为空', trigger: 'blur'
                    }, {
                        validator: checkPhone, trigger: 'blur'
                    }],
                    idCard: [{
                        required: true, message: '身份证号不能为空', trigger: 'blur'
                    }, {
                        validator: checkIdCard, trigger: 'blur'
                    }],
                    password: [{
                        required: true, message: '密码不能为空', trigger: 'blur'
                    },
                        {
                            validator: checkPassword, trigger: 'blur'
                        }
                    ]
                },
                showMangerForm: false,
                // searchShow: false,
                // pageCount: 1,
                // total: 0,
                // currentPage: 1,
                // pageSize: 10,
                // tabledata: [],
                // code: '',
                // anctionItem: {},
                // radio4: 1,
                // boundDialogVisible: false,
                // unboundDialogVisible: false,
                // CancelVisible: false,
                // agreeVisible: false,
                // dialogSetMoneyDate: false,
                // formSetMoneyDate: {
                //   monthPayDay: '',
                //   weeklyPayDay: ''
                // },
                // yuejieData: [
                //   {date: 1},{date: 2},{date: 3},{date: 4},{date: 5},{date: 6},{date: 7},{date: 8},{date: 9},
                //   {date: 10},{date: 11},{date: 12},{date: 13},{date: 14},{date: 15},{date: 16},{date: 17},{date: 18},
                //   {date: 19},{date: 20},{date: 21},{date: 22},{date: 23},{date: 24},{date: 25},{date: 26},{date: 27},{date:28}
                // ],
                // zhoujieData: [
                //   {
                //     label: '周一',
                //     id: 1
                //   },
                //   {
                //     label: '周二',
                //     id: 2
                //   },
                //   {
                //     label: '周三',
                //     id: 3
                //   },
                //   {
                //     label: '周四',
                //     id: 4
                //   },
                //   {
                //     label: '周五',
                //     id: 5
                //   },
                //   {
                //     label: '周六',
                //     id: 6
                //   },
                //   {
                //     label: '周日',
                //     id: 7
                //   }
                // ],
                // form: {
                //   sex: "不限",
                //   settleType: "不限",
                //   manager: "不限",
                //   tag: "不限",
                //   keyWord: "",
                //   bindingStatus: '-1'
                // },
                // relationId: '',
                // nameAlias: ''
            }
        },
        watch: {
            // form: {
            //   handler: function (val, oldval) {
            //     this.currentPage = 1
            //     this.getPmList()
            //   },
            //   immediate: true,
            //   deep: true
            // }
            showWorkHandover(n, o) {
                if (!n) {
                    this.workHandoverForm = {
                        oldClassManager: null,
                        newClassManager: null
                    }
                }
            },
            showMangerForm(status) {
                if (this.$refs['managerForm']) {
                    this.$refs['managerForm'].clearValidate();
                }
                if (!status) {
                    setTimeout(() => {
                        this.handleClearState();
                    }, 200)
                }
            }
        },
        mounted() {
            this.handleGetManagerList();
        },
        methods: {
            handleGetManagerMyBindingManagerList() {
                this.$api.managerMyBindingManagerList({
                    pageSize: 0,
                    status: 1,
                    excludeManagerId: this.workHandoverForm.oldClassManager
                }).then(res => {
                    this.myBindingManagerList = res.data.list || [];
                })
            },
            handlePostWorkHandover() {
                if (this.workHandoverForm.newClassManager) {
                    const loading = this.$loading({
                        lock: true,
                        text: '正在交接中',
                        spinner: 'el-icon-loading',
                        background: 'rgba(255, 255, 255, 0.9)'
                    });
                    const {oldClassManager, newClassManager} = this.workHandoverForm;
                    let params = {
                        managerId: oldClassManager,
                        toManagerId: newClassManager
                    };
                    this.$api.putManagerWorkHandover(params).then(res => {
                        if (res.data.respCode === 0) {
                            loading.close();
                            this.$message.success('交接成功');
                            this.showWorkHandover = false;
                            this.handleGetManagerList();
                        } else {
                            loading.close();
                        }
                    }).catch(err => {
                        console.log('err', err)
                    })
                } else {
                    this.$message.error('承接班务经理不能为空');
                }
            },
            handleShowWorkHandoverList() {
                this.showWorkHandoverList = true;
                let params = {
                    pageNum: this.workHandover.pageNum,
                    pageSize: 5,
                }
                this.$api.workHandoverRecord(params).then(res => {
                    if (res.data.respCode == 0) {
                        if (res.data.data.list) {
                            this.workHandoverList = Array.from(res.data.data.list)
                            this.workHandover.total = res.data.data.total;
                        }
                    }
                    console.log(res);
                })
            },
            handleWorkHandover(row) {
                this.showWorkHandover = true;
                this.workHandoverForm.oldClassManager = row.managerId;
                this.handleGetManagerMyBindingManagerList();
            },
            handleGetCode() {
                this.$api.customerManagerGetBindingCode().then(res => {
                    if (res.respCode === 0) {
                        this.code = res.data;
                        this.handleShowBindLog(true);
                    }
                })
            },
            handleUnbind(row) {
                this.$confirm(`确认与班务经理${row.managerNameAlias}解绑?`, '提示', {
                    confirmButtonText: '确 认',
                    cancelButtonText: '取 消',
                    type: 'warning'
                }).then(() => {
                    this.$api.unBinding({customerManagerId: row.customerManagerId}).then(res => {
                        if (res.data.respCode === 0) {
                            this.$message({
                                message: '解绑成功',
                                type: 'success'
                            });
                            this.handleGetManagerList();
                        }
                    });
                }).catch(() => {
                    // this.$message({
                    //   type: 'info',
                    //   message: '已取消删除'
                    // });
                });
            },
            handleView(row) {
                this.$api.customerManagerClassManagerDetail({managerId: row.managerId}).then(res => {
                    if (res.respCode === 0) {
                        this.thusRow = res.data;
                        this.thusName = res.data.name;
                        this.showContent = true;
                    }
                })
            },
            handleViewNew(row){
                let str = row.classTaskDetail;
                this.workHandover.detaiList = str.split(',');
                this.workHandover.innerVisible = true;
            },
            closeNew(){
                this.workHandover.detaiList = []
                this.workHandover.innerVisible = false;
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
            handlePageNumChangeWork(val) {
                this.workHandover.pageNum = val;
                this.handleShowWorkHandoverList();
            },
            handleGetManagerList() {
                const {pageSize, pageNum, name} = this.managerParams;
                this.loading = true;
                this.$api.managerMyBindingManagerList({pageSize, pageNum, nameAlias: name, status: 1}).then(res => {
                    this.loading = false;
                    this.managerList = res.data.list || [];
                    res.data.list.map(it => {
                        this.managerListMap = {
                            ...this.managerListMap,
                            [it.managerId]: it.managerNameAlias
                        }

                    })
                    this.managerParams.total = res.data.total || 0;
                })
            },
            handleClearState() {
                this.managerForm = {
                    name: '',
                    phone: '',
                    password: '',
                    id: null
                };
                this.showNameItem = true;
                this.showPasswordItem = true;
                this.showPhoneItem = true;
                this.showIdCardItem = true;
                this.saveType = '';
            },
            handleEdit(row, text) {
                if (row) {
                    if (text === 'password') {//修改密码
                        this.saveType = 'password';
                        this.showNameItem = false;
                        this.showPhoneItem = false;
                        this.showIdCardItem = false;
                        this.managerForm = {
                            name: row.name,
                            id: row.id,
                        }
                    } else {//编辑
                        this.saveType = 'edit'
                        ;this.managerForm = {
                            name: row.name,
                            phone: row.mobile,
                            idCard: row.idCard,
                            id: row.id,
                        }
                        this.showPasswordItem = false;
                    }
                } else {
                    this.saveType = '';
                }
                this.showMangerForm = true;
            },
            handlePostAddAndEditManager() {
                this.subLoading = true;
                const {name, phone, password, id, idCard} = this.managerForm;
                if (this.saveType === '') {
                    this.$api.postAddManager({name, mobile: phone, password, idCard}).then(res => {
                        if (res.data.respCode === 0) {
                            this.$message({
                                message: '添加成功',
                                type: 'success'
                            });
                            this.showMangerForm = false;
                            this.subLoading = false;
                            this.handleGetManagerList();
                        } else {
                            this.subLoading = false;
                        }
                    }).catch(() => {
                        this.subLoading = false;
                    });
                } else if (this.saveType === 'edit') {
                    this.$api.putUpdate({name, mobile: phone, id, idCard}).then(res => {
                        if (res.data.respCode === 0) {
                            this.$message({
                                message: '编辑成功',
                                type: 'success'
                            });
                            this.showMangerForm = false;
                            this.subLoading = false;
                            this.handleGetManagerList();
                        } else {
                            this.subLoading = false;
                        }
                    }).catch(() => {
                        this.subLoading = false;
                    });

                } else if (this.saveType = 'password') {
                    this.$api.putUpdatePassword({id, password}).then(res => {
                        if (res.data.respCode === 0) {
                            this.$message({
                                message: '修改密码成功',
                                type: 'success'
                            });
                            this.showMangerForm = false;
                            this.subLoading = false;
                            this.handleGetManagerList();
                        } else {
                            this.subLoading = false;
                        }
                    }).catch(() => {
                        this.subLoading = false;
                    });
                }

            },
            handleManagerFormSave() {
                this.$refs['managerForm'].validate(valid => {
                    if (valid) {
                        this.handlePostAddAndEditManager();
                    }
                });
            },
            // setMoneyDate(row){
            //   this.relationId = row.relationId
            //   this.nameAlias = row.nameAlias
            //   this.formSetMoneyDate.monthPayDay = row.monthPayDay
            //   this.formSetMoneyDate.weeklyPayDay = row.weeklyPayDay
            //   this.dialogSetMoneyDate = !this.dialogSetMoneyDate
            // },
            // btn_save(){
            //   if(!this.formSetMoneyDate.weeklyPayDay || !this.formSetMoneyDate.monthPayDay){
            //     return this.$message.error('月结发薪日期或周结发薪日期不能为空!')
            //   }
            //   // this.dialogSetMoneyDate = false
            //   let params = {
            //     id: this.relationId,
            //     weeklyPayDay: this.formSetMoneyDate.weeklyPayDay,
            //     monthPayDay: this.formSetMoneyDate.monthPayDay
            //   }
            //   this.$api.managerSetPayday(params).then(res => {
            //     // console.log(res)
            //     if(res.data.respCode == 0){
            //       this.getPmList()
            //       this.dialogSetMoneyDate = false
            //     }
            //   }).catch()
            // },
            // payDayMonth(row, column, cellValue){
            //   if(cellValue){
            //     return `${cellValue}号`
            //   }else{
            //     return '未设置'
            //   }
            // },
            // payDayWeekly(row, column, cellValue){
            //   if(cellValue == 1){
            //     return '周一'
            //   }else if (cellValue == 2){
            //     return '周二'
            //   }else if (cellValue == 3){
            //     return '周三'
            //   }else if (cellValue == 4){
            //     return '周四'
            //   }else if (cellValue == 5){
            //     return '周五'
            //   }else if (cellValue == 6){
            //     return '周六'
            //   }else if (cellValue == 7){
            //     return '周日'
            //   }else if (!cellValue){
            //     return '未设置'
            //   }
            // },
            // get(val){
            //   console.log(val)
            // },
            dateFormatter(row, column, cellValue, index) {
                return util.minDate(cellValue)
            },
            // statusFormatter(row, column, cellValue, index) {
            //   let status = ''
            //   switch (Number.parseInt(cellValue)) {
            //     case 1:
            //       status = '服务中'
            //       break
            //     case 2:
            //       status = '待对方同意解绑'
            //       break
            //     case 3:
            //       status = '待我同意解绑'
            //       break
            //     case 4:
            //       status = '已解绑'
            //       break
            //     default:
            //       status = ''
            //       break
            //   }
            //   return status
            // },
            handleSearch(keyword) {
                this.managerParams.name = keyword;
                this.managerParams.pageNum = 1;
                this.handleGetManagerList();
            },
            // 切换分页
            // handleCurrentChange(val) {
            //   this.currentPage = val;
            //   this.getPmList();
            // },
            // getPmList(keywords) {
            //   const params = {
            //     pageNum: this.currentPage,
            //     pageSize: this.pageSize,
            //     bindingStatus: this.form.bindingStatus,
            //     nameAlias: this.form.keyWord,
            //   }
            //   this.$api.getPmListCus(params)
            //     .then((res) => {
            //       const {
            //         data: {
            //           list,
            //           pages,
            //           total,
            //           pageNum,
            //         },
            //       } = res.data;
            //       this.pageCount = pages
            //       this.total = total
            //       this.tabledata = list || []
            //     })
            //     .catch((error) => {
            //       console.log(error);
            //     });
            // },
            // boundManager() {
            //   this.$api.generateBindingCode()
            //     .then((response) => {
            //       this.code = response.data
            //       this.boundDialogVisible = true
            //     })
            //     .catch((error) => {
            //     });
            // },
            // handleAgree() {
            //   const params = {
            //     relationId: this.anctionItem.relationId,
            //     optType: 1,
            //   }
            //   this.$api.agreeUnbinding(params).then((response) => {
            //     if (response.data.respCode == 0) {
            //       this.agreeVisible = false
            //       this.$message.success('操作成功')
            //       this.getPmList()
            //     }
            //   }).catch((error) => {
            //   });
            // },
            // handleUnbound() {
            //   const params = {
            //     relationId: this.anctionItem.relationId,
            //     optType: 1,
            //   }
            //   this.$api.startUnbinding(params).then((response) => {
            //     if (response.data.respCode == 0) {
            //       this.unboundDialogVisible = false
            //       this.$message.success('操作成功')
            //       this.getPmList()
            //     }

            //   }).catch((error) => {
            //   });
            // },
            // handleCancel() {
            //   const params = {
            //     relationId: this.anctionItem.relationId,
            //     optType: 1,
            //   }
            //   this.$api.cancelUnbinding(params).then((response) => {
            //     if (response.data.respCode == 0) {
            //       this.CancelVisible = false
            //       this.$message.success('操作成功')
            //       this.getPmList()
            //     }
            //   }).catch((error) => {
            //   });
            // },
            // unBind(item) {
            //   this.anctionItem = item;
            //   this.unboundDialogVisible = true
            // },
            // cancelunBind(item) {
            //   this.anctionItem = item;
            //   this.CancelVisible = true
            // },
            // agreeunBind(item) {
            //   this.anctionItem = item;
            //   this.agreeVisible = true
            // },
            // routeTowoker(item) {
            //   this.$router.push({ name: 'myworker', params: { id: item.id } })
            // },
            // routeToDetail(item) {
            //   const { href } = this.$router.resolve({
            //     name: "projectManagerdetail",
            //     params: {
            //       id: item.id,
            //       userId: item.userId,
            //     }
            //   });
            //   window.open(href, "_blank");
            // },
            // handleClose() { }
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

    .setting-table {
        td {
            background-color: #fff
        }
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