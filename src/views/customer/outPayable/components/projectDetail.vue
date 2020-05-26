<template>
    <div style="background-color:#f2f2f5;" v-loading="loading" element-loading-text="正在导出excel表...">
        <el-form
                ref="formDetail"
                :model="formDetail"
                label-width="100px"
                labelPosition="left"
                style="background-color:white;padding-left:20px;"
        >
            <div
                    style="display:flex;align-items:center;padding:20px 20px 20px 0;"
                    class="search-zone"
            >
                <div style="display:flex;align-items:center;">
                    <el-select
                            v-model="formDetail.taskId"
                            filterable
                            clearable
                            placeholder="输入任务名称搜索"
                            class="inputWidth"
                    >
                        <el-option
                                v-for="item in taskList"
                                :key="item.id"
                                :label="`${item.taskName} / ${item.status} / ${item.startTime}-${item.endTime}`"
                                :value="item.id"
                        ></el-option>
                    </el-select>
                    <el-button
                            type="primary"
                            size="small"
                            class="searchBtn keyWBtn"
                            @click="searchTaskName"
                    >搜索
                    </el-button>
                </div>
                <el-button
                        style="margin-left:20px"
                        class="comb-btn"
                        size="mini"
                        type="text"
                        @click="handleCombShow"
                >
                    高级筛选
                    <i
                            class="el-icon-right el-icon-d-arrow-right"
                            :class="isShowComb ? 'el-icon-d-arrow-right-down' : 'el-icon-d-arrow-right-right'"
                    ></i>
                </el-button>
            </div>
            <div v-show="isShowComb" class="combine-zone" style="border-top: 1px solid #EAEDF4">
                <el-form-item label="日期范围：" class="formSearchMargin" style="margin-top:15px">
                    <el-radio-group class="radio-search" v-model="formDetail.date">
                        <el-radio label>不限</el-radio>
                        <el-radio label="5">本月</el-radio>
                        <el-radio label="1">最近7天</el-radio>
                        <el-radio label="2">最近30天</el-radio>
                        <el-radio label="3">最近90天</el-radio>
                        <el-radio label="4">自定义</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="自定义：" class="formSearchMargin" v-if="formDetail.date == '4'">
                    <el-date-picker
                            class="margin_left40"
                            size="mini"
                            v-model="formDetail.startDate"
                            type="date"
                            value-format="yyyy-MM-dd"
                            placeholder="选择开始时间"
                    ></el-date-picker>
                    --
                    <el-date-picker
                            class="margin_left10"
                            size="mini"
                            v-model="formDetail.endDate"
                            type="date"
                            value-format="yyyy-MM-dd"
                            placeholder="选择结束时间"
                    ></el-date-picker>
                    <el-button type="primary" size="small" class="datesearchBtn" @click="btn_true">确定</el-button>
                </el-form-item>
                <el-form-item label="付款状态：" class="formSearchMargin">
                    <el-radio-group class="radio-search" v-model="formDetail.payStatus">
                        <el-radio label>不限</el-radio>
                        <el-radio label="1">待付</el-radio>
                        <el-radio label="2">已付</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="项目经理：" class="formSearchMargin">
                    <el-radio-group
                            style="padding:13px 0 0 0;display: flex;"
                            class="radio-search"
                            v-model="formDetail.taskManagerId"
                    >
                        <el-radio label>不限</el-radio>
                        <div style="margin-left:15px;" :class="{showHeight: isShowHeight}">
                            <el-radio
                                    :label="item.id"
                                    :value="item.id"
                                    :key="item.id"
                                    class="elRadio"
                                    v-for="item in mangersId"
                            >{{item.nameAlias}}
                            </el-radio>
                        </div>
                    </el-radio-group>
                    <el-button
                            v-show="this.nameAliasLength.length>16"
                            style="padding:0;margin-left:60px;"
                            class="myplain-btn"
                            size="mini"
                            type="text"
                            @click="unfload"
                    >
                        {{htmlTxt}}
                        <i
                                class="el-icon-arrow-down"
                                :class="[isShowHeight ? 'el-icon-arrow-down':'el-icon-arrow-up']"
                        ></i>
                    </el-button>
                </el-form-item>
            </div>
        </el-form>
        <div style="background-color:white;border:1px solid #E6E7EB;margin-top:18px;">
            <div
                    style="padding:0 24px 0 24px;display:flex;justify-content: space-between;border-bottom: 1px solid #E6E7EB;height:50px;line-height:50px;font-size:12px;"
            >
                <div>
                    合计
                    <span class="fontsizecolor">&nbsp;{{moneyTask.totalWorkHours || 0}}&nbsp;</span>小时，
                    <span class="fontsizecolor">&nbsp;{{moneyTask.totalJian || 0}}&nbsp;</span>件，
                    <span class="fontsizecolor">&nbsp;{{moneyTask.totalDai || 0}}&nbsp;</span>袋，
                    <span class="fontsizecolor">&nbsp;{{moneyTask.totalChe || 0}}&nbsp;</span>车，
                    <span class="fontsizecolor">&nbsp;{{moneyTask.totalDun || 0}}&nbsp;</span>吨
                </div>
                <div>
                    待付金额
                    <span class="fontsizecolor">&nbsp;{{moneyTask.totalUnPayAmount || 0}}&nbsp;</span>元，
                    已付金额
                    <span class="fontsizecolor">&nbsp;{{moneyTask.totalPayAmount || 0}}&nbsp;</span>元，
                    合计金额
                    <span class="fontsizecolor">&nbsp;{{moneyTask.totalAmount || 0}}&nbsp;</span>元
                </div>
                <div
                        style="color:#5c5c5c;cursor:pointer;"
                        @click="goToNotProceedCheckWorker"
                        v-if="notTotal != 0"
                >
                    <span style="color:#e84518">{{notTotal}}个排班未进行客户结算</span>
                    <i style="color:#e84518;font-weight: bold;" class="el-icon-arrow-right"></i>
                </div>
            </div>
            <div>
                <el-button
                        class="myplain-btn"
                        size="small"
                        style="margin:6px 0 6px 24px;width:98px;"
                        :disabled="payVal.length == 0"
                        @click="batchPay"
                >批量付款
                </el-button>
                <el-button
                        class="myplain-btn"
                        size="small"
                        style="margin: 6px 0 6px 30px;width:98px;"
                        :disabled="isDisabled"
                        @click="exportExcel"
                >导出
                </el-button>
            </div>
        </div>
        <div class="table-box back-white">
            <el-table
                    class="table-outline"
                    :data="tableData"
                    emptyText="暂无相关明细"
                    style="width: 100%;"
                    @selection-change="handleSelectionChange"
            >
                <el-table-column type="selection" :selectable="selectableTF" width="50"></el-table-column>
                <el-table-column label="排班日期" prop="batchNumberDate" align="center" min-width="60"></el-table-column>
                <el-table-column
                        label="任务"
                        prop="taskName"
                        show-overflow-tooltip
                        align="center"
                        min-width="60"
                ></el-table-column>
                <el-table-column label="项目经理" prop="managerName" align="center" min-width="60"></el-table-column>
                <el-table-column label="工时" prop="workHours" align="center" min-width="60"></el-table-column>
                <el-table-column
                        label="产量"
                        prop="pieceSize"
                        show-overflow-tooltip
                        align="center"
                        min-width="60"
                >
                    <template v-slot="scope">
            <span>
              {{scope.row.pieceSize ? JSON.parse(scope.row.pieceSize).jian + '件' : 0}}
              {{scope.row.pieceSize ? JSON.parse(scope.row.pieceSize).dai + '袋，' : 0}}
              {{scope.row.pieceSize ? JSON.parse(scope.row.pieceSize).che + '车，' : 0}}
              {{scope.row.pieceSize ? JSON.parse(scope.row.pieceSize).dun + '吨，' : 0}}
            </span>
                    </template>
                </el-table-column>
                <el-table-column
                        label="单价"
                        prop="taskSalaryStr"
                        show-overflow-tooltip
                        align="center"
                        min-width="60"
                ></el-table-column>
                <el-table-column label="金额(元)" prop="salary" align="center" min-width="60"></el-table-column>
                <el-table-column
                        label="付款状态"
                        prop="payStatus"
                        align="center"
                        min-width="60"
                        :formatter="payStatusFormatter"
                ></el-table-column>
                <el-table-column
                        label="付款日期"
                        prop="payDate"
                        align="center"
                        min-width="60"
                        :formatter="recordDateFormatter"
                ></el-table-column>
                <el-table-column label="操作" align="center" min-width="60">
                    <template v-slot="scope">
                        <el-button size="mini" type="text" @click="checkPDF(scope.row)" class="btn-icon btn-icon-view">
                            查看
                        </el-button>
                        <el-button
                                size="mini"
                                type="text"
                                class="btn-icon btn-icon-pay"
                                v-if="scope.row.payStatus == 1"
                                @click="payMent(scope.row)"
                        >付款
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
            <div class="pagination-container">
                <el-pagination
                        class="pagebox"
                        layout="prev, pager, next"
                        @current-change="handleCurrentChange"
                        :current-page="currentPage"
                        :page-count="pageCount"
                ></el-pagination>
            </div>
        </div>
        <!-- 付款弹窗 -->
        <el-dialog
                :title="title"
                :visible.sync="dialogVisible"
                v-if="dialogVisible"
                width="540px"
                class="el-dialog-1"
        >
            <el-form
                    :model="formPayMent"
                    ref="formPayMentResct"
                    label-width="100px"
                    labelPosition="right"
                    :rules="rules"
            >
                <el-form-item label="支付金额：" class="formSearchMargin formSearchMarginTop">
                    <span>￥ {{paySalary}}</span>
                </el-form-item>
                <el-form-item label="账户余额：" class="formSearchMargin formSearchMarginTop">
                    <span>￥ {{accountBalance}}</span>
                </el-form-item>
                <el-form-item label="支付密码：" prop="passwd" class="formSearchMargin formSearchMarginTop">
                    <el-input
                            style="width:280px;height:32px;"
                            clearable
                            type="password"
                            v-model="formPayMent.passwd"
                    ></el-input>
                </el-form-item>
                <span
                        style="margin: 15px 0 0 100px;color:#E94A1E;cursor:pointer;display:inline-block;"
                        @click="resetPassword"
                >重置支付密码</span>
            </el-form>
            <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="payMoney" v-if="payVal.length == 0">支 付</el-button>
        <el-button type="primary" @click="balancePayMoney" v-if="payVal.length != 0">支 付</el-button>
        <el-button @click="dialogVisible = false">取 消</el-button>
      </span>
        </el-dialog>
        <!-- 重置弹窗 -->
        <el-dialog
                :title="titles"
                :visible.sync="dialogVisibleResct"
                v-if="dialogVisibleResct"
                width="640px"
                height="386px"
                class="el-dialog-2"
        >
            <el-form
                    :model="formPayMentResct"
                    ref="formPayMentResct"
                    label-width="120px"
                    labelPosition="right"
                    :rules="rules"
            >
                <el-form-item
                        label="验证手机号："
                        class="formSearchMargin formSearchMarginTop"
                        style="margin-bottom:20px !important"
                >
                    <span>{{userMobile}}</span>
                    <el-button
                            type="primary"
                            size="small"
                            class="newBtnStyle"
                            @click="getCode"
                            :disabled="isMobile"
                    >{{codeTxt}}
                    </el-button>
                </el-form-item>
                <el-form-item
                        label="短信验证码："
                        prop="verificationCode"
                        class="formSearchMargin formSearchMarginTop"
                        style="margin-bottom:20px !important"
                >
                    <el-input
                            style="width:330px"
                            v-model="formPayMentResct.verificationCode"
                            placeholder="请输入验证码"
                    ></el-input>
                </el-form-item>
                <el-form-item
                        label="支付密码："
                        prop="passwd"
                        clearable
                        class="formSearchMargin formSearchMarginTop"
                        style="margin-bottom:20px !important"
                >
                    <el-input
                            style="width:330px"
                            type="password"
                            clearable
                            v-model="formPayMentResct.passwd"
                            placeholder="请输入6位数字密码"
                    ></el-input>
                </el-form-item>
                <el-form-item
                        label="重复支付密码："
                        prop="confimPasswd"
                        class="formSearchMargin formSearchMarginTop"
                        style="margin-bottom:20px !important"
                >
                    <el-input
                            style="width:330px"
                            type="password"
                            clearable
                            v-model="formPayMentResct.confimPasswd"
                            placeholder="请输入6位数字密码"
                    ></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
        <el-button type="primary" v-if="titles == '重置支付密码'" @click="setPassword">确 认</el-button>
        <el-button type="primary" v-if="titles == '设置密码'" @click="setPassword">确 认</el-button>
        <el-button @click="cancel">取 消</el-button>
                <!-- <el-button v-if="titles == '设置密码'" @click="cancels">取 消</el-button> -->
      </span>
        </el-dialog>
        <!-- 首次付款，判断是否有支付密码弹窗 -->
        <el-dialog title="提示" :visible.sync="dialogVisiblePay" width="540px" class="el-dialog-3">
            <span>首次付款，您需要先设置支付密码!</span>
            <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="goToSetting">前往设置</el-button>
      </span>
        </el-dialog>
        <!-- 您的账户余额不足，请充值.弹窗 -->
        <el-dialog title="提示" :visible.sync="dialogVisibleBalance" width="540px" class="el-dialog-3">
            <span>您的账户余额不足，请充值!</span>
            <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="goToTopUp">前往充值</el-button>
        <el-button @click="dialogVisibleBalance = false">取 消</el-button>
      </span>
        </el-dialog>
    </div>
</template>
<script>
    import Interval from "../../../../common/interval.js";

    export default {
        data() {
            var validatePass = (rule, value, callback) => {
                if (value === "") {
                    callback(new Error("请输入密码"));
                } else {
                    if (this.formPayMentResct.confimPasswd !== "") {
                        this.$refs.formPayMentResct.validateField("confimPasswd");
                    }
                    callback();
                }
            };
            var validatePass2 = (rule, value, callback) => {
                if (value === "") {
                    callback(new Error("请再次输入密码"));
                } else if (value !== this.formPayMentResct.passwd) {
                    callback(new Error("两次输入密码不一致!"));
                } else {
                    callback();
                }
            };
            return {
                isMobile: false,
                title: "支付",
                titles: "重置支付密码",
                codeTxt: "发送验证码",
                codeTime: 60,
                dialogVisible: false,
                dialogVisibleResct: false,
                dialogVisiblePay: false,
                dialogVisibleBalance: false,
                isChecked: true,
                isShowComb: false,
                htmlTxt: "全部展示",
                isShowHeight: true,
                loading: false,
                isDisabled: false,
                total: 0,
                currentPage: 1,
                pageCount: 0,
                pageSize: 20,
                inputVal: "",
                selectVal: "",
                formPayMent: {
                    passwd: ""
                },
                formPayMentResct: {
                    verificationCode: "",
                    passwd: "",
                    confimPasswd: ""
                },
                formDetail: {
                    date: "5",
                    payStatus: "",
                    taskManagerId: "",
                    startDate: "",
                    endDate: "",
                    taskId: ""
                },
                rules: {
                    passwd: [
                        {validator: validatePass, trigger: "blur"},
                        {required: true, message: "支付密码不能为空", trigger: "blur"},
                        {min: 6, max: 6, message: "支付密码为6位数字", trigger: "blur"},
                        {
                            pattern: /^[0-9]*$/,
                            message: "请填写正确的6位数字密码"
                        }
                    ],
                    confimPasswd: [
                        {validator: validatePass2, trigger: "blur"},
                        {required: true, message: "支付密码不能为空", trigger: "blur"},
                        {min: 6, max: 6, message: "支付密码为6位数字", trigger: "blur"},
                        {
                            pattern: /^[0-9]*$/,
                            message: "请填写正确的6位数字密码"
                        }
                    ],
                    verificationCode: [
                        {required: true, message: "验证码不能为空", trigger: "blur"},
                        {
                            pattern: /^[0-9]*$/,
                            message: "请填写正确的验证码"
                        }
                    ]
                },
                tableData: [],
                mangersId: [],
                moneyTask: {},
                taskList: [],
                notTotal: 0,
                nameAliasLength: "",
                payVal: [],
                paySalary: 0,
                accountBalance: 0,
                userMobile: "",
                ids: [],
                balanceIds: [],
            };
        },
        watch: {
            "formDetail.date": function (val, old) {
                if (val == "") {
                    this.currentPage = 1;
                    this.getList();
                    this.getNewSumData();
                } else if (val == "1") {
                    this.currentPage = 1;
                    this.getList();
                    this.getNewSumData();
                } else if (val == "2") {
                    this.currentPage = 1;
                    this.getList();
                    this.getNewSumData();
                } else if (val == "3") {
                    this.currentPage = 1;
                    this.getList();
                    this.getNewSumData();
                } else if (val == "5") {
                    this.currentPage = 1;
                    this.getList();
                    this.getNewSumData();
                } else if (val == "4") {
                    this.formDetail.endDate = "";
                    this.formDetail.startDate = "";
                }
            },
            "formDetail.payStatus": function (val, old) {
                this.currentPage = 1;
                this.getList();
                this.getNewSumData();
            },
            "formDetail.taskManagerId": function (val, old) {
                this.currentPage = 1;
                this.getList();
                this.getNewSumData();
            },
            dialogVisible: {
                handler(val, old) {
                    if (val == true) {
                        this.formPayMent.passwd = "";
                    } else {
                        this.formPayMent.passwd = "";
                    }
                },
                immediate: true
            },
        },
        methods: {
            goToSetting() {
                this.dialogVisiblePay = false;
                this.dialogVisibleResct = true;
                this.titles = "设置密码";
            },
            goToTopUp() {
                const {href} = this.$router.resolve({
                    name: 'accountList'
                })
                window.open(href, '_blank')
            },
            getCode() {
                let params = {
                    mobile: this.userMobile
                };
                this.$api
                    .getMobileCode(params)
                    .then(res => {
                        // console.log(res)
                        if (res.data.respCode == 0) {
                            this.getTime();
                            return this.$message.success(
                                "短信发送成功，请注意查收验证码信息！"
                            );
                        } else {
                            return this.$message.success("短信发送失败！");
                        }
                    })
                    .catch();
            },
            getTime() {
                this.codeTime = this.codeTime - 1;
                this.codeTxt = this.codeTime + "秒后重新发送";
                if (this.codeTime == 0) {
                    this.codeTxt = "重新发送";
                    this.codeTime = 60;
                    this.isMobile = false;
                    return;
                } else {
                    this.isMobile = true;
                }
                setTimeout(this.getTime, 1000);
            },
            setPassword() {
                let pattern = /^[0-9]*$/;
                if (this.formPayMentResct.verificationCode == "") {
                    return this.$message.error("验证码不能为空！");
                } else if (this.formPayMentResct.passwd == "") {
                    return this.$message.error("密码不能为空！");
                } else if (this.formPayMentResct.confimPasswd == "") {
                    return this.$message.error("重复密码不能为空！");
                } else if (
                    !pattern.test(this.formPayMentResct.passwd) ||
                    !pattern.test(this.formPayMentResct.confimPasswd)
                ) {
                    return this.$message.error("支付密码为6位数字！");
                }
                let params = {
                    verificationCode: this.formPayMentResct.verificationCode,
                    passwd: this.formPayMentResct.passwd,
                    confimPasswd: this.formPayMentResct.confimPasswd
                };
                this.$api
                    .setPasswd(params)
                    .then(res => {
                        // console.log(res)
                        if (res.data.respCode == 0) {
                            if (this.titles == '重置支付密码') {
                                this.$message.success("支付密码重置成功！");
                            } else if (this.titles == '设置密码') {
                                this.$message.success("密码设置成功！");
                            }
                            this.dialogVisibleResct = false;
                            this.dialogVisible = true;
                        }
                    }).catch( err=> {
                    this.$message.error(err);
                });
            },
            resetPassword() {
                this.dialogVisible = false;
                this.dialogVisibleResct = true;
                this.titles = "重置支付密码";
            },
            handleSelectionChange(val) {
                console.log(val);
                this.payVal = val;
                this.balanceIds = [];
                this.paySalary = 0;
                for (let x in val) {
                    this.balanceIds.push(val[x].id.toString());
                    this.paySalary = this.paySalary + val[x].salary; //批量支付金额
                }
                // console.log(this.balanceIds)
                // console.log(this.paySalary)
            },
            payMent(row) {
                this.title = "支付";
                this.getBalance();
                this.getMobile();
                this.paySalary = row.salary; //支付金额
                this.ids = []
                this.ids.push(row.id.toString());
                // this.dialogVisible = !this.dialogVisible;
            },
            handleCombShow() {
                this.isShowComb = !this.isShowComb;
            },
            getBalance() {
                this.$api
                    .AccountDetail()
                    .then(res => {
                        // console.log(res)
                        if (res.data.respCode == 0) {
                            if (res.data.data) {
                                this.accountBalance = res.data.data.balance; //账户余额
                                // this.userMobile = res.data.data.userMobile
                                if (res.data.data.hasPassword == true) {
                                    this.dialogVisible = true;
                                } else if (res.data.data.hasPassword == false) {
                                    this.dialogVisiblePay = true;
                                }
                            }
                        }
                    })
                    .catch(err => {
                        this.$message.error(err);
                    });
            },
            getMobile() {
                this.$api
                    .getMobile()
                    .then(res => {
                        // console.log(res)
                        if (res.data.respCode == 0) {
                            if (res.data.data) {
                                this.userMobile = res.data.data.mobile; //手机号
                            }
                        }
                    })
                    .catch(err => {
                        this.$message.error(err);
                    });
            },
            payMoney() {
                if (this.formPayMent.passwd == '') {
                    return this.$message.error('支付密码不能为空！')
                }
                if (this.accountBalance < this.paySalary) {
                    this.dialogVisibleBalance = true
                    this.dialogVisible = false
                    return
                }
                let params = {
                    passwd: this.formPayMent.passwd,
                    ids: this.ids
                };
                this.$api
                    .cusBatchPay(params)
                    .then(res => {
                        // console.log(res)
                        if (res.data.respCode == 0) {
                            this.$message.success("支付成功！");
                            this.getList()
                            this.dialogVisible = false;
                        } else if (res.data.errorCode == 110004) {
                            this.getList()
                            this.dialogVisible = false;
                            console.log(res.data.errorMsg)
                        }else{
                            this.$message.error(res.data.errorMsg);
                        }
                    })
                    .catch(err => {
                        this.$message.error(err);
                    });
            },
            balancePayMoney() {
                if (this.formPayMent.passwd == '') {
                    return this.$message.error('支付密码不能为空！')
                }
                if (this.accountBalance < this.paySalary) {
                    this.dialogVisibleBalance = true
                    this.dialogVisible = false
                    return
                }
                let params = {
                    passwd: this.formPayMent.passwd,
                    ids: this.balanceIds
                };
                this.$api
                    .cusBatchPay(params)
                    .then(res => {
                        if (res.data.respCode == 0) {
                            this.$message.success("支付成功！");
                            this.getList()
                            this.dialogVisible = false;
                        } else if (res.data.errorCode == 110005) {
                            this.getList()
                            this.dialogVisible = false;
                            console.log(res.data.errorMsg)
                        }else{
                            this.$message.error(res.data.errorMsg);
                        }
                    })
                    .catch(err => {
                        this.$message.error(err);
                    });
            },
            batchPay() {
                this.title = "批量支付";
                this.getBalance();
                this.getMobile();
            },
            cancel() {
                if (this.titles == "设置密码") {
                    this.dialogVisibleResct = false;
                } else {
                    this.dialogVisibleResct = false;
                    this.dialogVisible = true;
                }
            },
            unfload() {
                this.isShowHeight = !this.isShowHeight;
                if (this.isShowHeight) {
                    this.htmlTxt = "全部展示";
                } else {
                    this.htmlTxt = "收起";
                }
            },
            getList() {
                if (this.formDetail.date == "") {
                    this.formDetail.endDate = "";
                    this.formDetail.startDate = "";
                } else if (this.formDetail.date == "1") {
                    this.formDetail.endDate = Interval.getDay(0);
                    this.formDetail.startDate = Interval.getDay(-7);
                } else if (this.formDetail.date == "2") {
                    this.formDetail.endDate = Interval.getDay(0);
                    this.formDetail.startDate = Interval.getDay(-30);
                } else if (this.formDetail.date == "3") {
                    this.formDetail.endDate = Interval.getDay(0);
                    this.formDetail.startDate = Interval.getDay(-90);
                } else if (this.formDetail.date == "5") {
                    this.formDetail.endDate = Interval.getDay(0);
                    this.formDetail.startDate = new Date().getFullYear() + '-' + ((new Date().getMonth() + 1).toString().length == 1 ? '0' + (new Date().getMonth() + 1) : (new Date().getMonth() + 1)) + '-01';
                } else if (this.formDetail.date == "4") {
                    this.formDetail.endDate = this.formDetail.endDate;
                    this.formDetail.startDate = this.formDetail.startDate;
                }
                const params = {
                    pageNum: this.currentPage,
                    pageSize: this.pageSize,
                    payStatus: this.formDetail.payStatus,
                    startDate: this.formDetail.startDate,
                    endDate: this.formDetail.endDate,
                    taskManagerId: this.formDetail.taskManagerId,
                    taskId: this.formDetail.taskId,
                    showOutsourcing:true,
                    outsourcingCusId: this.$route.query.outsourcingCusId || '',
                };
                this.$api
                    .NewNeedPayList(params)
                    .then(res => {
                        console.log(res);
                        if (res.data.respCode == 0) {
                            const {
                                data: {list, pages, pageNum}
                            } = res.data;
                            console.log(list);
                            this.tableData = list;
                            this.pageCount = pages;
                        }
                    })
                    .catch(err => {
                        this.$message.error(err);
                    });
            },
            getCusPayManagerList() {
                this.$api
                    .CusPayManagerList()
                    .then(res => {
                        // console.log(res)
                        if (res.data.respCode == 0) {
                            if (res.data.data) {
                                this.mangersId = res.data.data;
                                this.mangersId.forEach(item => {
                                    this.nameAliasLength = item.nameAlias;
                                });
                            }
                        }
                    }).catch(err => {
                    this.$message.error(err);
                });
            },
            getNewSumData() {
                const params = {
                    pageNum: this.currentPage,
                    pageSize: this.pageSize,
                    payStatus: this.formDetail.payStatus,
                    startDate: this.formDetail.startDate,
                    endDate: this.formDetail.endDate,
                    taskManagerId: this.formDetail.taskManagerId,
                    taskId: this.formDetail.taskId,
                    showOutsourcing:true,
                    outsourcingCusId: this.$route.query.outsourcingCusId || '',
                };
                // this.taskList = [];
                this.$api
                    .NewSumData(params)
                    .then(res => {
                        console.log(res);
                        if (res.data.respCode == 0) {
                            if (res.data.data) {
                                this.isDisabled = false;
                                this.moneyTask = res.data.data;
                                // if(!sessionStorage.getItem("taskNames")){
                                //   sessionStorage.setItem("taskNames",JSON.stringify(res.data.data.taskList));
                                // }
                                // this.taskList = JSON.parse(sessionStorage.getItem("taskNames"));
                                // console.log(this.taskList)
                                // this.taskList.forEach(item => {
                                //   if (item.status == 2) {
                                //     item.status = "进行中";
                                //   } else if (item.status == 3) {
                                //     item.status = "已结束";
                                //   }
                                //   if (item.startTime) {
                                //     item.startTime = item.startTime.substr(0, 10);
                                //   } else {
                                //     item.startTime = "";
                                //   }
                                //   if (item.endTime) {
                                //     item.endTime = item.endTime.substr(0, 10);
                                //   } else {
                                //     item.endTime = "";
                                //   }
                                // });
                            } else {
                                this.moneyTask = {};
                                this.isDisabled = true;
                            }
                        }
                    }).catch( err=> {
                    this.$message.error(err);
                });
            },
            getReceived(){
                this.$api.received().then(res => {
                    console.log(res)
                    if(res.respCode == 0){
                        if(res.data && res.data.length > 0){
                            this.taskList = res.data
                            this.taskList.forEach(item => {
                                if (item.status == 2) {
                                    item.status = '进行中'
                                } else if (item.status == 3) {
                                    item.status = '已结束'
                                }
                                if (item.startTime) {
                                    item.startTime = item.startTime.substr(0, 10)
                                } else {
                                    item.startTime = ''
                                }
                                if (item.endTime) {
                                    item.endTime = item.endTime.substr(0, 10)
                                } else {
                                    item.endTime = ''
                                }
                            })
                        }
                    }
                }).catch()
            },
            goToNotProceedCheckWorker() {
                const {href} = this.$router.resolve({
                    name: "outNotProceedCheckCustomer"
                });
                window.open(href, "_blank");
            },
            exportExcel() {
                let params = {
                    pageNum: this.currentPage,
                    pageSize: this.pageSize,
                    payStatus: this.formDetail.payStatus,
                    startDate: this.formDetail.startDate,
                    endDate: this.formDetail.endDate,
                    taskManagerId: this.formDetail.taskManagerId,
                    taskId: this.formDetail.taskId,
                    showOutsourcing:true
                };
                this.$api
                    .NewDetailListExport(params)
                    .then(res => {
                        // console.log(res)
                        if (res.data.respCode == 0) {
                            this.loading = true;
                            setTimeout(() => {
                                this.loading = false;
                            }, 2000);
                            if (res.data.data) {
                                window.open(res.data.data);
                            }
                        } else if (res.data.respCode == -1) {
                            this.loading = false;
                        }
                    }) .catch( err=> {
                    this.$message.error(err);
                });
            },
            getScheduingList() {
                let params = {
                    pageNum: this.currentPage,
                    pageSize: -1
                };
                this.$api
                    .SchedulingCustomerList(params)
                    .then(res => {
                        console.log(res);
                        if (res.data.respCode == 0) {
                            if (res.data.data) {
                                this.notTotal = res.data.data.total;
                            }
                        }
                    }) .catch( err=> {
                    this.$message.error(err);
                });
            },
            btn_true() {
                if (this.formDetail.startDate && !this.formDetail.endDate) {

                } else if (this.formDetail.startDate == '' && this.formDetail.endDate == '') {
                    return this.$message.error('开始日期和结束日期不能为空!')
                } else if (!this.formDetail.startDate && this.formDetail.endDate) {
                    return this.$message.error('开始日期不能为空!')
                }
                this.currentPage = 1;
                this.getList();
                this.getNewSumData();
            },
            searchTaskName() {
                this.currentPage = 1;
                this.getList();
                this.getNewSumData()
            },
            handleCurrentChange(val) {
                this.currentPage = val;
                this.getList();
            },
            checkPDF(row) {
                console.log(row);
                let params = {
                    schedulingId: row.schedulingId
                };
                this.$api
                    .getCheckIcon(params)
                    .then(res => {
                        console.log(res);
                        if (res.respCode == 0) {
                            window.open(res.data.confirmPdfForm);
                        }
                    }) .catch( err=> {
                    this.$message.error(err);
                });
            },
            payStatusFormatter(row, column, cellValue) {
                if (cellValue == 1) {
                    return "待付";
                } else if (cellValue == 2) {
                    return "已付";
                } else {
                    return "无";
                }
            },
            recordDateFormatter(row, column, cellValue) {
                if (row.payStatus == 1) {
                    return "无";
                } else if (row.payStatus == 2) {
                    return cellValue;
                }
            },
            selectableTF(row, index) {
                if (row.payStatus == 1) {
                    return true;
                } else if (row.payStatus == 2) {
                    return false;
                }
            }
        },
        mounted() {
            this.getList();
            this.getCusPayManagerList();
            this.getNewSumData();
            this.getScheduingList();
            this.getReceived()
        }
    };
</script>
<style scope>
    .el-dialog__headerbtn {
        position: absolute;
        top: 35px;
        right: 20px;
    }

    .el-button--primary,
    .el-button--default {
        width: 90px;
        height: 36px;
        line-height: 8px;
    }

    .el-dialog__header {
        padding: 30px 20px 20px 32px !important;
    }

    .el-dialog-1 .el-input .el-input__inner {
        height: 32px !important;
    }

    .el-dialog-1 .el-form-item__content {
        line-height: 40px !important;
    }

    .el-dialog-1 .el-dialog__footer {
        padding-bottom: 10px !important;
    }

    .el-dialog-1 .el-dialog__body {
        padding: 0 20px 20px 20px !important;
    }

    .el-dialog-2 .el-dialog__body {
        padding: 15px 95px 0 !important;
    }

    .el-dialog-2 .el-dialog__footer {
        padding-bottom: 10px !important;
    }

    .el-dialog-2 .el-input .el-input__inner {
        height: 32px !important;
    }

    .el-dialog-2 .el-form-item__content {
        line-height: 40px !important;
    }

    .el-dialog__footer {
        padding-bottom: 10px !important;
    }

    .el-dialog-3 .el-dialog__body {
        padding: 10px 20px 30px;
        text-align: center;
        font-size: 18px;
        color: #5c5c5c;
    }
</style>

<style scoped>
    .formSearchMargin {
        margin-bottom: 0 !important;
    }

    .datesearchBtn {
        margin-left: 15px;
    }

    .fontsizecolor {
        color: #e84518;
    }

    .elRadio {
        padding-bottom: 15px;
        margin-left: 0px;
    }

    .searchBtn {
        width: 100px;
        height: 34px;
        margin-left: 0px;
    }

    .inputWidth {
        width: 520px;
        margin-right: 15px;
    }

    .showHeight {
        height: 50px;
        overflow: hidden;
    }

    .newBtnStyle {
        width: 135px;
        margin-left: 30px;
        /* border: 1px solid #F7BEB2; */
        /* background: #F7BEB2; */
        font-size: 14px;
        /* color: #E84518; */
    }
</style>


