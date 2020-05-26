<template>
    <div class="back-white workerListAbleCon" v-loading="loading" element-loading-text="正在导出excel表...">
        <!-- <el-tabs v-model="activeName">
          <el-tab-pane label="在用零工" name="first"></el-tab-pane>
          <el-tab-pane label="停用零工" name="second"></el-tab-pane>
        </el-tabs> -->
        <!-- <el-tab-pane label="空挂名单" name="third"></el-tab-pane> -->

        <div v-if="activeName == 'first'">
            <search-bar combCondition="true" @handleSearch="handleSearch" placeholder="输入零工姓名搜索">
                <el-form ref="form" :model="form" label-width="110px" label-position="left" class="woker-list">
                    <!--选择条件的单选按钮-->
                    <el-form-item label="性别：">
                        <el-radio-group class="radio-search pt8" v-model="form.sex">
                            <el-radio label="">不限</el-radio>
                            <el-radio label="1">男</el-radio>
                            <el-radio label="2">女</el-radio>
                        </el-radio-group>
                    </el-form-item>
                    <el-form-item label="结算类型：">
                        <el-radio-group class="radio-search pt8" v-model="form.settlementType">
                            <el-radio label="">不限</el-radio>
                            <el-radio label='2'>月结</el-radio>
                            <el-radio label='4'>周结</el-radio>
                        </el-radio-group>
                    </el-form-item>
                    <el-form-item label="班务经理：">
                        <el-radio-group class="radio-search pt8" v-model="form.managerName">
                            <el-radio class="mb5" label="">不限</el-radio>
                            <div>
                                <el-radio class="mb5" :label="item.nameAlias" v-for="(item,index) in managerList" :key="index">
                                    {{item.nameAlias}}
                                </el-radio>
                            </div>
                        </el-radio-group>
                    </el-form-item>
                </el-form>
            </search-bar>
            <div class="back-white btn-div flexable" style="justify-content: space-between">
                <div>
                    <el-button class="primary-btn" size="mini" @click="addGeneralWorker">添加零工</el-button>
                    <el-button class="primary-btn" size="mini" :disabled="isDisabled" @click="exportExcel">导出名单</el-button>
                    <el-button class="primary-btn" :disabled="!selectArr.length" size="mini" @click="setDayModel()">推荐给班务经理</el-button>
                </div>
                <div><el-button class="primary-btn" size="mini" @click="addModel = true">设置添加零工模式</el-button></div>
            </div>
            <div class="table-box back-white">
                <el-table :data="tableData" empty-text="暂无相关零工信息" @selection-change="handleSelectionChange">
                    <el-table-column type="selection"></el-table-column>
                    <el-table-column label="姓名" prop="realNameAlias" show-overflow-tooltip align="center"
                                     min-width="80"></el-table-column>
                    <el-table-column label="性別" prop="sex" :formatter="sexFormatter" show-overflow-tooltip
                                     align="center" min-width="50"></el-table-column>
                    <el-table-column label="结算方式" prop="settlementType" :formatter="settlementTypeFormatter"
                                     show-overflow-tooltip align="center" min-width="80"></el-table-column>
                    <el-table-column label="手机号" prop="mobile" show-overflow-tooltip align="center"
                                     min-width="100"></el-table-column>
                    <el-table-column label="身份证号" prop="idCard" show-overflow-tooltip align="center"
                                     min-width="120"></el-table-column>
                    <el-table-column label="班务经理" prop="ownManager" show-overflow-tooltip align="center"
                                     min-width="100"></el-table-column>                    
                    <el-table-column label="最近添加时间" prop="startTime" :formatter="dateFormatter"
                                     show-overflow-tooltip align="center" min-width="100"></el-table-column>
                    <el-table-column label="操作" align="center" min-width="150">
                        <template v-slot="scope">
                            <el-button type="text" class="btn-icon btn-icon-edit" size="mini"
                                       @click="editItem(scope.row)">编辑
                            </el-button>
                            <el-button type="text" class="btn-icon btn-icon-stop" size="mini"
                                       @click="disableWorker(scope.row)">停用
                            </el-button>
                            <el-button type="text" class="btn-icon btn-icon-view" size="mini"
                                       @click="routeToDetail(scope.row)">查看
                            </el-button>
                        </template>
                    </el-table-column>
                </el-table>

                <div class="pagination-container" v-if="pageCount">
                    <el-pagination class="mypagination" @current-change="handleCurrentChange"
                                   :current-page="currentPage" :page-size="pageSize"
                                   layout="total , prev, pager, next, jumper" :total="total">
                    </el-pagination>
                </div>
            </div>
        </div>

        <worker-unable v-if="activeName === 'second'"></worker-unable>
        <emptyWorker v-if="activeName === 'third'"></emptyWorker>

        <el-dialog title="停用零工"  :visible.sync="disableDia" width="540px" class="base-dialog">
            <div class="dialog-body">
                <div class="dialog-panel">
                    <div class="dialog-panel-title">确认停用零工{{workerName}} 吗？</div>
                </div>
            </div>
            <span slot="footer" class="dialog-footer">
        <el-button size="medium" @click="disableDia = false">取 消</el-button>
        <el-button size="medium" type="primary" @click="blockItem">确 认</el-button>
      </span>
        </el-dialog>

        <el-dialog title="" :visible.sync="ableDia" width="540px">
            <div class="dialog-head">
                <span>确认启用零工 <span class="dialog-strong">{{workerName}}</span> 吗？</span>
            </div>
            <span slot="footer" class="dialog-footer">
        <el-button size="medium" type="primary" @click="startUpItem">确 认</el-button>
        <el-button size="medium" @click="ableDia = false">取 消</el-button>
      </span>
        </el-dialog>

        <el-dialog title="" :visible.sync="scanedCodeDia" width="540px">
            <div class="dialog-head">
                <span>您正在手机上扫描零工身份证</span>
            </div>
            <span slot="footer" class="dialog-footer">
        <el-button size="medium" type="primary" @click="agreeVisible = true">已扫描完成</el-button>
        <el-button size="medium" @click="scanedCodeDia = false">放弃扫描</el-button>
      </span>
        </el-dialog>

        <el-dialog title="" :visible.sync="socialDia" width="540px">
            <div class="dialog-head">
                <span>您还没有设置过社保信息</span>
            </div>
            <span slot="footer" class="dialog-footer">
        <el-button size="medium" type="primary" @click="$router.push({ name: 'socialSetting' });">去设置</el-button>
        <el-button class="btnEdit" size="medium" @click="socialDia = false">取消</el-button>
      </span>
        </el-dialog>
        <!-- 添加零工start -->
        <el-dialog title="设置日结人员模式" :visible.sync="setModel" width="25%">
            <el-form ref="fromModel" :model="fromModel" label-width="100px" label-position="left" :rules="modelRules"
                     style="padding:20px;">
                <el-form-item label="是否外包：" prop="isOutSource" >
                    <el-select v-model="fromModel.isOutSource" class="radius-input" style="width:280px"
                               placeholder="排班里添加日结人员时再选择">
                        <el-option v-for="(item,index) in sourceList" :key="index" :label="item.name"
                                   :value="item.type">
                        </el-option>
                    </el-select>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
          <el-button size="medium" @click="setModel = false">取 消</el-button>
          <el-button size="medium" type="primary" @click="setModelOk()">确 认</el-button>
        </span>
        </el-dialog>
        <!-- 添加零工end -->

        <!-- 编辑零工start -->
        <el-dialog title="编辑零工" :visible.sync="editWorkerC" width="740px" :center="false">
            <div class="overflow-box">
                <el-form label-width="184px" label-position="right">
                    <el-form-item label="零工姓名：" class=" inpWidth">
                        <span class="info">{{addWorker2.realNameAlias}}</span>
                    </el-form-item>
                    <el-form-item label="零工身份证号：" class=" mTop2 inpWidth">
                        <span class="info">{{addWorker2.idCard}}</span>
                    </el-form-item>
                </el-form>
                <el-form label-width="184px" label-position="right">
                    <!--prop="settleType" addWorker2.-->
                    <el-form-item label="结算方式："  class=" mTop2 inpWidth woker-list">
                        <el-radio-group v-model="settleType">
                            <el-radio label='2'>月结</el-radio>
                            <el-radio label='4'>周结</el-radio>
                        </el-radio-group>
                    </el-form-item>
                    <el-form-item label="是否外包：" class=" mTop2 inpWidth woker-list">
                        <el-radio-group v-model="outsourceType">
                            <!--<el-radio label='1'>外包</el-radio>-->
                            <el-radio label='2'>代发收入</el-radio>
                        </el-radio-group>
                    </el-form-item>
<!--
                    <el-form-item label="分配班务经理：" class=" mTop2 inpWidth">
                        <el-checkbox-group
                                v-model="classManagerId"
                                @change="handleCheckboxChange">
                            <el-checkbox v-for="(item,index) in classManagerFilter" :label="item.id" :key="index" :value="item.id">
                                {{item.name}}
                            </el-checkbox>
                        </el-checkbox-group>
                    </el-form-item>
-->
                </el-form>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button size="medium" @click="cancel" v-if="!isEdit">取 消</el-button>
                <el-button size="medium" type="primary" @click="updateLabel()">保 存</el-button>
            </span>
        </el-dialog>
        <!-- 编辑零工end -->
        
        <el-dialog title="推荐给班务经理" :visible.sync="showRecommand" class="showRecommand">
            <div class="showRecommandInner">
                <div>选择班务经理</div>
                <el-select v-model="classManagerValue" 
                               placeholder="请选择">
                    <el-option v-for="(item,index) in managerList" :key="index" :label="item.nameAlias" 
                                   :value="item.id" ></el-option>
                </el-select>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button size="medium" class="setWidth" @click="cancelRecommand">取 消</el-button>
                <el-button size="medium" type="primary" @click="confirmRecommand">保 存</el-button>
            </span>
        </el-dialog>
        <!--设置添加零工模式-->
        <el-dialog title="设置添加零工模式" :visible.sync="addModel" width="35%">
            <div class="pl20 pr20">此处可设置班务经理添加零工时，向您推荐零工时是否需要接收确认，
                如设置需要接收确认，班务经理添加零工同时推荐给您的零工将默认进入待接收零工列表。
            </div>
            <el-form ref="fromModel" :model="fromModel" label-width="150px" label-position="left"
                     style="padding:20px;">
                <el-form-item label="是否需要接收确认：" prop="isOutSource" >
                    <el-select v-model="fromModel.isAdd" class="radius-input" style="width:280px"
                               placeholder="排班里添加日结人员时再选择">
                        <el-option v-for="(item,index) in addList" :key="index" :label="item.name"
                                   :value="item.type">
                        </el-option>
                    </el-select>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
          <el-button size="medium" @click="addModel = false">取 消</el-button>
          <el-button size="medium" type="primary" @click="addModelOk()">确 认</el-button>
        </span>
        </el-dialog>
    </div>
</template>
<script>
    import util from "../../../common/util";
    import emptyWorker from "./components/emptyWorker.vue";
    import WorkerUnable from './WorkerListUnable'
    import SearchBar from '@/components/SearchBar'

    export default {
        name: "WorkerListAble",
        components: {
            emptyWorker, SearchBar, WorkerUnable
        },
        data() {
            // 添加零工start
            let checkcountTime = (rule, value, callback) => {
                if (value) {
                    if (value <= 0) {
                        callback(new Error("请输入大于0的数字"));
                    } else {
                        this.form.income = value.toString().replace(/^(([1-9]\d{0,7})(\.\d{1,2})?|0\.[1-9]{1,2})$/);
                        this.form.income = value.toString().replace(/[^\d.]/g, "");  //清除“数字”和“.”以外的字符
                        this.form.income = value.toString().replace(/\.{2,}/g, "."); //只保留第一个. 清除多余的
                        this.form.income = value.toString().replace(".", "$#$").replace(/\./g, "").replace("$#$", ".");
                        // this.form.income = value.toString().replace(/^(\-)*(\d+)\.(\d\d).*$/,'$1$2.$3');//只能输入两个小数
                        this.form.income = String(value).replace(/^(.*\..{2}).*$/, "$1");
                        callback();
                    }
                } else {
                    callback(new Error("社保缴纳基数不能为空"));
                }
            };
            // 添加零工end
            return {
                selectArr:[],
                classManagerValue:'',
                showRecommand:false,
                isDisabled: false,
                isCheckedThree:false,
                loading: false,
                addWorkerC: false,//添加零工
                editWorkerC: false,//编辑零工
                editId: '',
                socialDia: false,
                PmList: [],
                tableData: [],
                total: 0,
                currentPage: 1,
                pageCount: 1,
                pageSize: 10,
                activeName: 'first',
                form: {
                    sex: "",
                    settlementType: "",
                    managerId: "",
                    managerName:'',
                    tag: "",
                    keyWord: "",
                    skill: ""
                },
                disableDia: false,
                ableDia: false,
                scanedCodeDia: false,
                id: "",
                skillList: [],
                workerName: "",
                isshow1: false,
                isshow2: false,
                // 添加零工start
                addWorker: {
                    // idCard: "612729199503175123"
                    idCard: ""
                },
                settleType: "2",
                outsourceType: '2', //外包模式
                addWorker2: {
                    idCard: "",
                    manager: "",
                    name: "",
                    settleType: "2",
                    tag: "",
                    newTag: "",
                    labelType:'',//标签类型
                },
                updateRequest:false,
                bgNotSafe: false,
                managerList: [],
                classManagerId:[],
                classManagerFilter:[],
                checkManagerId:[],
                checkLabelId:[],
                newLabelList:[],
                test1: [],
                sample: [],
                sorryDia: false,
                fullTagDia: false,
                step: 1,
                userInfo: {},
                ids: "", //!
                data: {},
                isEdit: false,
                rules: {
                    manager: [
                        {
                            required: true,
                            message: "班务经理不能为空",
                            trigger: "change"
                        }
                    ]
                },
                rulesSocial: {
                    spouseName: [
                        {
                            required: true,
                            message: "配偶姓名不能为空",
                            trigger: "blur"
                        },
                        {
                            pattern: /^[\u4e00-\u9fa5]*$/,
                            message: "请输入正确的配偶姓名"
                        }
                    ],
                    spouseIdCard: [
                        {
                            required: true,
                            message: "配偶身份证号不能为空",
                            trigger: "blur"
                        },
                    ],
                    income: [
                        {
                            required: true,
                            // message: "社保缴纳基数不能为空",
                            trigger: "change",
                            validator: checkcountTime
                        },
                        // {
                        //     pattern: /^(([1-9]\d*)(\.\d{1,2})?|0\.[1-9]{1,2})$/,
                        //     message: "社保缴纳基数必须全为数字"
                        // }
                    ],
                    child: [
                        {
                            required: false,
                            // message: "子女教育专项扣除不能为空",
                            trigger: "blur"
                        },
                        {
                            pattern: /^(([1-9]\d*)(\.\d{1,2})?|0\.[1-9]{1,2})$/,
                            message: "子女教育专项扣除必须全为数字"
                        }
                    ],
                    keep: [
                        {
                            required: false,
                            // message: "继续教育专项扣除不能为空",
                            trigger: "blur"
                        },
                        {
                            pattern: /^(([1-9]\d*)(\.\d{1,2})?|0\.[1-9]{1,2})$/,
                            message: "继续教育专项扣除必须全为数字"
                        }
                    ],
                    old: [
                        {
                            required: false,
                            // message: "赡养老人扣除不能为空",
                            trigger: "blur"
                        },
                        {
                            pattern: /^(([1-9]\d*)(\.\d{1,2})?|0\.[1-9]{1,2})$/,
                            message: "赡养老人扣除必须全为数字"
                        }
                    ],
                    house: [
                        {
                            required: false,
                            // message: "住房专项扣除不能为空",
                            trigger: "blur"
                        },
                        {
                            pattern: /^(([1-9]\d*)(\.\d{1,2})?|0\.[1-9]{1,2})$/,
                            message: "住房专项扣除必须全为数字"
                        }
                    ],
                },
                rule: {
                    idCard: [
                        {
                            required: true,
                            message: "零工身份证号不能为空",
                            trigger: "blur"
                        },
                        {min: 18, max: 21, message: '长度在 15 到 18 个字符', trigger: 'blur'},
                    ]
                },
                formWorker: { //!
                    isSociaSecurity: '2',
                    startMonth: '1',
                    incomeType: 1,
                    income: '',
                    isAccumulationFund: '2',
                    isPIncome: '1',
                    isMate: '1',
                    spouseName: '',
                    spouseIdCard: '',
                    pType: 1,
                    child: '',
                    keep: '',
                    house: '',
                    houseType: 1,
                    old: '',
                    dailyPayAmount: ''
                },
                childForm: {
                    realName: '',
                    step: '',
                    idcard: '',
                    startTime: '',
                    endTime: '',
                    percent: '',
                    school: '',
                },
                incomeTypeList: [
                    {
                        label: '部分收入',
                        value: 1,
                    },
                    {
                        label: '全部收入',
                        value: 2,
                    },
                ],
                eduList: [
                    {
                        label: '学前教育',
                        value: 1,
                    },
                    {
                        label: '义务教育',
                        value: 2,
                    },
                    {
                        label: '高中教育',
                        value: 3,
                    },
                    {
                        label: '高等教育',
                        value: 4,
                    },
                ],
                percentList: [
                    {
                        label: '50%',
                        value: 50,
                    },
                    {
                        label: '100%',
                        value: 100,
                    },
                ],
                childDia: false,
                keepEduDia: false,
                firstDia: false,
                houseDia: false,
                oldDia: false,
                keepEduForm: {
                    keeptype: 2,
                    step: '',
                    startTime: '',
                    endTime: '',
                    time: '',
                    cerName: '',
                    ceCode: '',
                    licenceIssuse: '',
                    amount: '',
                },
                keepEduList: [
                    {
                        label: '学历（学位）继续教育',
                        value: 1,
                    },
                    {
                        label: '职业资格继续教育',
                        value: 2,
                    },
                ],
                keepList: [
                    {
                        label: '大专',
                        value: 1,
                    },
                    {
                        label: '本科',
                        value: 2,
                    },
                    {
                        label: '硕士',
                        value: 3,
                    },
                    {
                        label: '博士',
                        value: 4,
                    },
                ],
                firstForm: {
                    address: '',
                    self: '1',
                    cerType: 1,
                    num: '',
                    percent: '',
                    way: '',
                    type: '',
                    range: '',
                    code: '',
                    bank: '',
                },
                houseList: [
                    {
                        label: '房屋所有权证',
                        value: 1,
                    },
                    {
                        label: '不动产权证',
                        value: 2,
                    },
                    {
                        label: '房屋买卖合同',
                        value: 3,
                    },
                    {
                        label: '房屋预售合同',
                        value: 4,
                    },
                ],
                pTyleList: [
                    {
                        label: '其他',
                        value: 1,
                    },
                    {
                        label: '退休返聘（需有退休证）',
                        value: 3,
                    },
                    {
                        label: '学生（需有学生证）',
                        value: 2,
                    },
                ],
                huuseList: [
                    {
                        label: '首套住房贷款利息专项扣除',
                        value: 1,
                    },
                    {
                        label: '住房租金专项扣除',
                        value: 2,
                    },
                ],
                hasManager: true,
                welfareId: '',
                isCheckS: true,
                // 添加零工end
                sourceList: [{name: '排班里添加日结人员时再选择',type:'3'}, {name: '固定为外包',type:'1'}, {name: '固定为代发收入',type:'2'}],
                addList: [{name: '不需要接收确认',type:0}, {name: '需要接收确认',type:1}],
                setModel: false, //设置日结模式
                addModel: false, //设置添加零工模式
                fromModel: {
                    isOutSource: '3',
                    isAdd:0,
                },
                modelRules: {
                    isOutSource: [
                        {required: true, message: '选择模式', trigger: 'blur'}
                    ],
                }
            }
        },
        mounted() {
            this.getList();
            // 添加零工
            this.step = 1;
            // this.getDetail();
            this.detailLite();
            this.getSkillWorker();
            this.getManagerFilter()//获取班务经理
        },
        watch: {
            // 添加零工start
            step: function (val, old) {
                if (val == 3) {
                    this.test1 = [];
                    this.sample = [];
                    this.getManagerFilter();
                    this.addWorker2.manager = ''
                    this.hasManager = true
                }
            },
            test1: {
                handler(newValue, oldValue) {
                    if (newValue.length != 0) {
                        for (let i in newValue) {
                            newValue[i].talentId = this.ids;
                        }
                    }
                },
                deep: true
            },
            'addWorker.idCard': function (val, oldval) {
                if (val) {
                    val = val.replace(/\s/g, '').replace(/(^(\d{6})|(\d{4}))(?=[^\s])/g, "$1 ");
                    this.addWorker.idCard = val
                }
            },
            // 添加零工end
            activeName: function (val, oldval) {
                this.form.sex = "";
                this.form.managerId = "";
                this.form.keyWord = "";
                this.form.settlementType = "";
                this.currentPage = 1;
                this.getList();
            },
            "form.sex": function (val, oldval) {
                this.currentPage = 1;
                this.getList();
            },
            "form.settlementType": function (val, oldval) {
                this.currentPage = 1;
                this.getList();
            },
            "form.managerName": function (val, oldval) {
                this.currentPage = 1;
                this.getList();
            },
            "checkLabelId": function (val, oldval) {
                let list = Array.from(val);
                if(list.length>=3){
                    this.isCheckedThree = true;
                }else{
                    this.isCheckedThree = false;
                }
            }
        },
        methods: {
            handleSelectionChange(val){
                this.selectArr = val;
            },
            addModelOk:function(){
                let _this=  this;
                if(_this.request){return}
                _this.request = true;
                this.$api.customerMode({
                    recommendMode:this.fromModel.isAdd,
                }).then(res=>{
                    if(res.respCode === 0){
                        this.$message.success('设置成功!')
                        this.addModel = false
                        this.detailLite()
                    }
                    console.log(res)
                }).catch(err=>{
                    console.log(err)
                }).finally(()=>{
                    setTimeout(()=>{
                        _this.request = false
                    },500)
                })
            },
            detailLite() {
                let _this = this;
                let ID = JSON.parse(localStorage.userInfo).customerId || '';
                let params = {
                    id:ID,
                }
                this.$api.detailLite(params).then(res => {
                    if(res.respCode === 0){
                        this.fromModel.isAdd = res.data.recommendMode;
                    }
                }).catch(err => {
                    console.log(err);
                })
            },
            setModelOk: function () {
                let _this = this;
                if(!_this.fromModel.isOutSource){
                    return _this.$message.warning('请选择日结模式!')
                }
                if(_this.modelRequst){return}
                _this.modelRequst = true;
                this.setModel = false;
                let params = {
                    payType:_this.fromModel.isOutSource,
                }
                _this.$api.setDailyPayType(params).then(res=>{
                    if(res.respCode === 0){
                        _this.$message.success('设置成功!')
                    }
                }).catch(error=>{
                    _this.$message.error(error)
                }).finally(() => {
                    setTimeout(()=>{
                        _this.modelRequst = false;
                    })
                })
            },
            //添加零工
            addGeneralWorker() {
                this.$router.push({
                    path: './AddWorker',
                });
            },
            //设置日结人员模式
            setDayModel() {
                this.showRecommand = true;
            },
            cancelRecommand(){
                this.showRecommand = false;
            },
            confirmRecommand(){                                 
                if( this.classManagerValue ){
                    let arr = this.selectArr.map((ele,index)=>{
                        return ele.talentId;
                    })
                    let strRes = arr.join(',');
                    let params = {
                        talentIds:strRes,
                        managerId:this.classManagerValue
                    };
                    this.$api.bindTalent(params).then(res=>{
                        let { respCode } = res;
                        if( respCode === 0 ){
                            this.$message({
                              message: '推荐成功',
                              type: 'success'
                            });
                            this.showRecommand = false;
                            this.getList();
                        }
                    }).catch(err=>{
                        console.log('err',err);
                    })
                }else{
                    this.$message.error('班务经理不能为空');
                }
            },
            cancel() {
                this.editId = '';
                this.talentId = '';
                this.classManagerId = [];
                this.checkLabelId = [];
                this.addWorker2.labelType = '';
                this.editWorkerC = false;
            },
//            handleCheckboxChange(val){
//                console.log(val)
//            },
            getManagerFilter(){
                let ID = JSON.parse(localStorage.userInfo).customerId || '';
                let params = {
                    customerId:ID,
                }   
                this.$api.classManagerList(params).then(res => {
                    let { respCode,data } = res;
                    if(  respCode === 0  ){
//                        this.classManagerFilter = data;
                        this.managerList = data;
                    }
                })
                .catch(error => {
                    console.log(error);
                });  
            },
            getSkillWorker() {
                let params = {
                    code: 'industry',
                }
                this.$api.GetAllTags(params).then(response => {
                        let result = response.data;
                        this.sample = Array.from(result);
                    }).catch(error => {
                        console.log(error);
                    });
            },
            updateLabel(){
//                if(this.classManagerId.length <= 0){
//                    return  this.$message.warning('班务经理不能为空！')
//                }
                if(this.updateRequest){return}
                this.updateRequest = true;
                this.saveUpdate();
            },
            saveUpdate(){
//                let ids = this.classManagerId.join(',');
                let params = {
                    empCustomerIds:this.editId, //零工与经理人关系id",
                    settlementType:this.settleType,    //结算方式结算方式 2：月 4：周",
                    payType:this.outsourceType,       //付款方式 1外包 2代发收入",
                    talentId:this.talentId,           //零工ID",
//                    empManagerIds:ids   //新选择的班务经理id集合，英文逗号分隔"
                }
                this.$api.updateEmpCus(params).then(res=>{
                    if(res.data.respCode === 0){
                        this.$message.success('编辑成功!')
                        this.getList();
                        this.editId = '';
                        this.talentId = '';
                        this.addWorker2.labelType = '';
//                        this.classManagerId = [];
                        this.checkLabelId = [];
                        this.editWorkerC = false;
                    }else{
                        this.$message.error('编辑失败!')
                    }
                }).catch(err=>{
                    this.$message.error(err)
                }).finally(()=>{
                    setTimeout(()=>{
                        this.updateRequest = false;
                    },500)
                })
                
            },
            getDetail() {
                const params = {
                    talentId: this.editId
                };
                this.$api.getWorkerDetail(params).then(res => {
                        let {data: layer1} = res;
                        let {data, respCode} = layer1;
                        if (respCode === 0) {
                            this.data = data;
                            function CheckExists(input) {
                                let check = Object.prototype.toString.call(input);
                                if ((check === '[object Undefined]') || (check === '[object Null]')) {
                                    return '';
                                } else {
                                    return input;
                                }
                            }

                            this.addWorker2.name = data.realName;
                            this.addWorker2.idCard = data.idCard;
                            this.addWorker2.manager = data.managerId;
                            this.addWorker2.settleType = CheckExists(data.settlementType).toString();
                            this.formWorker.dailyPayAmount = data.dailyPayAmount;
                            if (data.talentSkills) {
                                this.test1 = data.talentSkills;
                                let newValue = JSON.parse(JSON.stringify(data.talentSkills));
                                if (newValue.length != 0) {
                                    for (let i in newValue) {
                                        for (let j in this.sample) {
                                            if (newValue[i].skillName == this.sample[j].skillName) {
                                                this.sample[j].activedBtn = true;
                                                this.sample[j].unActivedBtn = false;
                                                this.sample[j].tagName = true;
                                            }
                                        }
                                    }
                                }
                            }
                            this.formWorker.pType = +this.data.talentType;
                            if (this.data.empWelfare) {
                                this.formWorker.isSociaSecurity = CheckExists(data.empWelfare.isSociaSecurity).toString();
                                this.formWorker.isPIncome = CheckExists(data.empWelfare.isTaxDeduction).toString();
                                this.formWorker.income = data.empWelfare.socialSecurityBase;
                                this.formWorker.incomeType = CheckExists(data.empWelfare.socialSecurityBase) ? 1 : 2;
                                this.formWorker.isAccumulationFund = CheckExists(data.empWelfare.isAccumulationFund).toString();
                                this.formWorker.child = data.empWelfare.childrenEducation;
                                this.formWorker.keep = data.empWelfare.continuingEducation;
                                this.formWorker.old = data.empWelfare.supportElderly;
                                this.formWorker.houseType = data.empWelfare.houseType;
                                this.welfareId = CheckExists(data.empWelfare.id);
                                this.formWorker.house = data.empWelfare.houseType == 1 ? this.data.empWelfare.housingInterest : this.data.empWelfare.housingRent;
                            }

                        } else {
                            this.$message.error('网络异常。');
                        }
                    }).catch(error => {
                        console.log(error);
                    });
            },
            checkManager() {
                this.hasManager = true
            },
            settleCheck() {
                if (this.formWorker.dailyPayAmount) {
                    if (Number(this.formWorker.dailyPayAmount) <= 0) {
                        this.isCheckS = false
                    } else {
                        this.formWorker.dailyPayAmount = this.formWorker.dailyPayAmount.toString().replace(/[^\d.]/g, "");  //清除“数字”和“.”以外的字符
                        this.formWorker.dailyPayAmount = this.formWorker.dailyPayAmount.toString().replace(/\.{2,}/g, "."); //只保留第一个. 清除多余的
                        this.formWorker.dailyPayAmount = this.formWorker.dailyPayAmount.toString().replace(".", "$#$").replace(/\./g, "").replace("$#$", ".");
                        this.formWorker.dailyPayAmount = String(this.formWorker.dailyPayAmount).replace(/^(.*\..{2}).*$/, "$1");
                        this.isCheckS = true
                    }
                } else {
                    this.isCheckS = true
                }
            },
            // 添加零工end
            handleSearch(keyword) {
                this.currentPage = 1;
                this.form.keyWord = keyword;
                this.getList()
            },
            dateFormatter(row, column, cellValue, index) {
                return util.minDate(cellValue);
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
            settlementTypeFormatter(row, column, cellValue, index) {
                let status = "";
                switch (Number.parseInt(cellValue)) {
                    case 1:
                        status = "日结";
                        break;
                    case 2:
                        status = "月结";
                        break;
                    case 3:
                        status = "实时结";
                        break;
                    case 4:
                        status = "周结";
                        break;
                    default:
                        status = "";
                        break;
                }
                return status;
            },
            disableWorker(item) {
                console.log(item);
                this.disableDia = true;
                this.ids = item.empCustomerId;
                this.workerName = item.realNameAlias;
            },
            ableWorker(item) {
                this.ableDia = true;
                this.ids = item.wecId;
                this.workerName = item.realNameAlias;
            },
            handleCurrentChange(val) {
                this.currentPage = val;
                this.getList();
            },
            exportExcel() {
                let status = 1
                if (this.activeName === 'first') {
                    status = 1
                } else if (this.activeName === 'second') {
                    status = 2
                } else if (this.activeName === 'third') {
                    status = 3
                }
                let parmas = {
                    customerStatus: status,
                    pageNum: this.currentPage,
                    pageSize: 10,
                    settlementType: this.form.settlementType,
                    sex: this.form.sex,
                    managerName: this.form.managerName,
                    managerId: this.form.managerId,
                    nameAlias: this.form.keyWord
                }
                this.loading = true
                this.$api.getWorkerExport(parmas).then(res => {
                    if (res.data.respCode == 0) {
                        setTimeout(() => {
                            this.loading = false
                        }, 2000)
                        if (res.data.data) {
                            window.open(res.data.data)
                        }
                    }
                }).catch()
            },
            getList() {
                let status = 1
                if (this.activeName === 'first') {
                    status = 1
                } else if (this.activeName === 'second') {
                    status = 2
                } else if (this.activeName === 'third') {
                    status = 3
                }
                const params = {
                    customerStatus: status,
                    pageNum: this.currentPage,
                    pageSize: 10,
                    settlementType: this.form.settlementType,
                    sex: this.form.sex,
                    managerName: this.form.managerName,
                    managerId: this.form.managerId,
                    nameAlias:this.form.keyWord,
                };
                this.$api.getWorkerListThree(params).then(res => {
                        this.tableData = res.data.data.list ? res.data.data.list : [];
                        this.total = res.data.data.total;
                        if (this.tableData.length == 0) {
                            this.isDisabled = true;
                        } else {
                            this.isDisabled = false;
                        }
                    }).catch(error => {
                        console.log(error);
                    });
            },
            editItem(row) {
                let vals = this.sample.map(item=>{
                   return Number(item.dicVal)
                });
                //找到val位置对应的行业id
                let index = vals.indexOf(row.industry);
                let industry = this.sample[index].id;
                
//                let classManagerId = [];
//                if(row.ownManagerId){ //班务经理
//                    classManagerId = row.ownManagerId.split(',');
//                    classManagerId = classManagerId.map(item =>{
//                        return Number(item);
//                    })
//                    this.classManagerId = classManagerId;
//                }
                
                this.settleType = String(row.settlementType);
                this.editId = row.empCustomerId;
                this.talentId = row.talentId;
                this.addWorker2 = row;
                this.addWorker2.labelType = row.industryName;
                this.editWorkerC = true
            },
            blockItem() {
                const params = {
                    empCustomerId: this.ids,
                    status:'2',
                };
                this.$api.switchStatus(params).then(response => {
                        if (response.respCode === 0) {
                            this.$message.success(`停用成功`);
                            this.getList();
                            this.disableDia = false;
                        }
                    }).catch(error => {
                        console.log(error);
                    });
            },
            startUpItem() {
                const params = {
                    id: this.ids
                };
                this.$api.startUp(params).then(response => {
                        if (response.data.respCode == 0) {
                            this.$message.success(`启用成功`);
                            this.getList();
                            this.ableDia = false;
                        }
                    }).catch(error => {
                        console.log(error);
                    });
            },
            routeToDetail(row) {
                const {href} = this.$router.resolve({
                    name: "workerDetail",
                    params: {
                        id: row.empCustomerId,
                        talentId: row.talentId
                    }
                });
                window.open(href, "_blank");
            },
        }
    };
</script>
<style scoped lang="scss">
    /* 修改start */
    .workerListAbleCon {
        .primary-btn {
            min-width: 96px;
            width: auto;
        }
    }
    .workerListAbleCon {
        .radio-search {
            align-items: start;
        }
    }
    .setWidth {
        width: 112px;
    }
    .box-title span {
        border: 0 !important;
    }

    .box-footer {
        margin-left: 455px;
    }

    .box-body3 {
        padding: 0;
    }

    .box-body2 {
        padding: 0 50px 18px 50px;
    }

    .box-title {
        text-align: center;
        padding-top: 28px;
        width: 100%;
        font-family: PingFang-SC-Medium;
        font-size: 24px;
        font-weight: normal;
        font-stretch: normal;
        line-height: 22px;
        letter-spacing: 1px;
        color: #262626;
    }

    .box-title span {
        padding-bottom: 10px;
        border-bottom: 3px solid #e84518;
        border-radius: 1px;
    }

    .box-footer3 {
        text-align: center;
        padding-bottom: 40px;
    }

    .box-footer2 {
        text-align: center;
        padding: 30px 0;
    }

    .workerInp {
        width: 288px;
        height: 38px;
    }

    .mTop {
        padding-top: 38px;
    }

    .codeBox {
        width: 188px;
        height: 188px;
        background-color: #ffffff;
        border: solid 1px #e5e5e5;
        text-align: center;
        margin: 24px auto 36px;
        line-height: 188px;
    }

    .code {
        width: 170px;
        height: 170px;
        vertical-align: middle;
    }

    .sorry {
        font-size: 24px;
        color: #262626;
        line-height: 40px;
    }

    .dia {
        padding-top: 20px;
    }

    .headBox {
        width: 352px;
        margin: 50px auto 0;
    }

    .info1 {
        font-size: 16px;
        color: #666666;
        text-align: center;
        margin-top: 70px;
    }

    .info {
        font-size: 16px;
        color: #666666;
    }

    .tagName {
        display: flex;
        height: 30px;
        padding: 0 15px;
        background-color: #ffffff;
        border-radius: 3px;
        border: solid 1px #DCDEE0;
        font-size: 14px;
        color:#606266;
        text-align: center;
        margin-right:15px;
        justify-content: center;
        align-items: center;
    }
    .label-tag{
        display: flex;
        flex-direction: row;
        justify-content: flex-start;
    }
    .transh {
        display: inline-block;
        vertical-align: middle;
        margin-left:8px;
        width: 17px;
        height:18px;
        cursor: pointer;
    }

    .mTop2 {
        margin-top: 10px;
    }

    .unActivedBtn {
        height: 30px;
        background-color: #ffffff;
        border-radius: 3px;
        border: solid 1px #dcdcdc;
        padding: 0 6px;
        margin-right: 6px;
        font-size: 16px;
        text-align: center;
        line-height: 30px;
        cursor: pointer;
        margin-bottom: 15px;
    }

    .activedBtn {
        cursor: pointer;
        margin-bottom: 15px;
    }

    .longBtn {
        width: 238px;
    }

    .textInfo {
        position: absolute;
        top: 28px;
        left: 0;
        font-size: 12px;
        color: #f56c6c;
    }

    .workerInp {
        width: 158px;
    }

    .workerInp1 {
        width: 305px;
    }

    .keepWidth {
        width: 405px;
    }

    .keepWidth1 {
        width: 326px;
    }

    .houseInp {
        width: 220px;
    }

    .width_100 .el-input--suffix .el-input__inner {
        height: 38px;
        border-radius: 18px;
        font-size: 16px;
        color: #666666;
    }

    .validText {
        color: #f56c6c;
        font-size: 12px;
    }
</style>
<style lang="scss">
    .workerListAbleCon {
        .el-table .cell {
            text-align: center;
            padding-left: 10px;
        }
        .showRecommand {
            .el-dialog {
                position: absolute;
                left: 0;
                right: 0;
                margin: auto !important;
                top: 0;
                bottom: 0;
                width: 400px;
                height: 220px;
            }
            .el-dialog__header {
                border-bottom: 1px solid #EAEDF4;
                box-sizing: border-box;
            }
        }
        .showRecommandInner {
            width: 100%;
            display: flex;
            justify-content: space-between;
            align-content: center;
            align-items: center;
            height: 50px;
        }
        .el-select {
            width: 260px;
            .el-input {
                width: 100%;
                .el-input__inner {
                    width: 100%;
                }
            }
        }
    }
</style>