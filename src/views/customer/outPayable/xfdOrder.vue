<template>
    <div class="xfd-order" v-loading="request" element-loading-text="请求数据中,请稍等...">
        <div class="table-box back-white">
            <div class="exportContainer pt20 pb10">
                <div class="exportLeftCon">
                    <span class="pr30">
                        薪企云服账户余额
                        <span class="co-orange-new">{{fromParams.htMoney | toFixeFortter2}}</span>元</span>
                    <span class="pl30">管理费可用余额：<span class="co-orange-new">{{accountAmount | toFixeFortter2}}</span>元（用于支付信息服务费）</span>
                </div>
            </div>
            <div class="pl30 f14 pt10 co-orange-new">
                没有绑定银行卡的用户是不会生成订单的
            </div>
            <div class="pl30 pr25 pt10 pb10 f14">
                <div class="lh25 co-333">
                    <span class="pr30">订单号：{{orderInfo.orderNo}}</span>
                </div>
                <div class="lh25 co-333">
                    <span class="pr30" v-if="orderInfo.totalFee">发放总金额：{{orderInfo.totalFee | toFixeFortter2}}元</span>
                    <span class="pr30"
                          v-if="orderInfo.successAmount">可发放人数：{{orderInfo.successAmount | toFixeFortter}}人</span>
                    <span class="" v-if="orderInfo.failAmount">不可发放人数：{{orderInfo.failAmount | toFixeFortter}}人</span>
                </div>
                <div class="lh25 co-333">
                    <span class="pr30"
                          v-if="orderInfo.totalRealFee">实际支付金额：{{orderInfo.totalRealFee | toFixeFortter2}}元</span>
                    <span class="pr30"
                          v-if="orderInfo.serviceFee">信息服务费：{{orderInfo.serviceFee | toFixeFortter2}}元</span>
                    <span class="" v-if="orderInfo.payFee">付款手续费：{{orderInfo.payFee | toFixeFortter2}}元</span>
                </div>
            </div>
            <div class="exportContainer pb20">
                <div class="exportLeftCon">
                    <el-button class="f12" type="primary" plain
                               @click="onLine">确认支付
                    </el-button>
                    <!--<el-button class="f12" type="primary" plain @click="onLine">确认支付</el-button>-->
                    <el-button class="f12" @click="cancel">取消订单</el-button>
                    <!--<el-button class="f12" @click="refresh">刷新订单</el-button>-->
                </div>
            </div>
            <el-table class="table-outline" :data="tableData"
                      emptyText="暂无相关信息" style="width: 100%;">
                <el-table-column label="姓名" prop="talentName"></el-table-column>
                <el-table-column label="付款手续费(元)" :formatter="_number" prop="payFee"></el-table-column>
                <el-table-column label="信息服务费(元)" :formatter="_number" prop="serviceFee"></el-table-column>
                <el-table-column label="薪企云服应发收入(元)" :formatter="_number" prop="totalMoney"></el-table-column>
                <el-table-column label="个人所得税(元)" :formatter="_number" prop="tax"></el-table-column>
                <el-table-column label="实际到账(元)" :formatter="_number" prop="money"></el-table-column>
                <!--<el-table-column label="薪福多本月已付收入(元)" :formatter="_number" prop="alreayPay"></el-table-column>-->
                <!--<el-table-column label="薪福多本月已付个税(元)" :formatter="_number" prop="alreayTax"></el-table-column>-->
                <el-table-column label="状态" prop="status" :formatter="settlementTypeFormatter"></el-table-column>
                <el-table-column label="失败原因" prop="message"></el-table-column>
            </el-table>
        </div>
        <!-- 重置弹窗 -->
        <el-dialog
                title="设置支付密码"
                :visible.sync="dialogVisibleResct"
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
                            @click="getCodeOld"
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
            <el-button @click="dialogVisibleResct=false">取 消</el-button>
            <el-button type="primary" @click="setPassword">保 存</el-button>
      </span>
        </el-dialog>
        <!--重置弹窗-->
        <!-- 第一步 -->
        <el-dialog
                title="付款"
                :visible.sync="payVisible"
                width="580px"
                height="386px"
                class="el-dialog-2" :before-close="reset()"
        >
            <el-form
                    :model="formPay"
                    ref="formPay"
                    label-width="180px"
                    labelPosition="right"
                    :rules="rulesPay"
            >
                <el-form-item
                        label="支付付款手续费："
                        class="formSearchMargin formSearchMarginTop font-weight"
                        style="margin-bottom:5px !important"
                >
                </el-form-item>
                <el-divider></el-divider>
                <el-form-item
                        label="付款手续费："
                        class="formSearchMargin formSearchMarginTop"
                        style="margin-bottom:20px !important"
                >
                    <span>{{orderInfo.payFee | toFixeFortter2}} 元</span>
                </el-form-item>
                <el-form-item
                        label="管理费余额："
                        class="formSearchMargin formSearchMarginTop"
                        style="margin-bottom:20px !important"
                >
                    <span>{{accountAmount | toFixeFortter2}} 元</span>
                </el-form-item>
                <el-form-item
                        label="支付零工收入："
                        class="formSearchMargin formSearchMarginTop font-weight"
                        style="margin-bottom:5px !important"
                >
                </el-form-item>
                <el-divider></el-divider>
                <el-form-item align=""
                              label="信息服务费："
                              class="formSearchMargin formSearchMarginTop"
                              style="margin-bottom:20px !important"
                >
                    <span>{{orderInfo.serviceFee | toFixeFortter2}} 元</span>
                </el-form-item>
                <el-form-item
                        label="发放金额："
                        class="formSearchMargin formSearchMarginTop"
                        style="margin-bottom:20px !important"
                >
                    <span>{{orderInfo.totalRealFee | toFixeFortter2}} 元</span>
                </el-form-item>
                <el-form-item
                        label="薪企云服可用余额："
                        class="formSearchMargin formSearchMarginTop"
                        style="margin-bottom:20px !important"
                >
                    <span>￥{{fromParams.htMoney | toFixeFortter2}} 元</span>
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
                            v-model="formPay.passwd"
                            placeholder="请输入6位数字密码"
                    ></el-input>
                </el-form-item>
                <el-form-item
                        label=""
                        class="formSearchMargin formSearchMarginTop"
                        style="margin-bottom: 0 !important;"
                >
                    <span class="co-orange" @click="resetShow()">重置支付密码</span>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="payVisible=false">取 消</el-button>
                <el-button type="primary" @click="payInline">付 款</el-button>
              </span>
        </el-dialog>
    </div>
</template>
<script>
    import SearchBar from '@/components/SearchBar'
    import {mapState, mapGetters, mapMutations} from 'vuex';
    import moment from 'moment';

    export default {
        components: {SearchBar},
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
                charge: 0,
                payTime: '',
                tableData: [],
                dialogVisibleResct: false,
                dialogVisibleTwo: false,
                fromParams: {},
                orderInfo: {},
                currentTime: 0,
                hasPassword: false,
                codeTxt: "发送验证码",
                xfdcodeTxt: '发送验证码',
                codeTime: 60,
                xfdcodeTime: 60,
                isMobile: false,
                xfdisMobile: false,
                formPayMentResct: {
                    verificationCode: "",
                    passwd: "",
                    confimPasswd: ""
                },
                formPay: {
                    passwd: '',
                },
                payAmount: 0,
                accountAmount: 0,
                totalMount: {},
                payVisible: false,
                userMobile: 0,
                rulesPay: {
                    passwd: [
                        {validator: validatePass, trigger: "blur"},
                        {required: true, message: "支付密码不能为空", trigger: "blur"},
                        {min: 6, max: 6, message: "支付密码为6位数字", trigger: "blur"},
                        {
                            pattern: /^[0-9]*$/,
                            message: "请填写正确的6位数字密码"
                        }
                    ],
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
                isTimeOut: false,
                request: false,
            }
        },
        computed: {
            ...mapGetters(['htParams'])
        },
        filters: {
            toFixeFortter(val) {
                if (val) {
                    return Number(val).toFixed(0)
                } else {
                    return 0
                }
            },
            toFixeFortter2(val) {
                if (val) {
                    return Number(val).toFixed(2)
                } else {
                    return 0
                }
            }
        },
        mounted() {
            this.fromParams = this.$route.query;
            this.userMobile = JSON.parse(localStorage.userInfo).mobile || "";
            if (!this.$route.query.isWait) {
                this.tableData = JSON.parse(this.fromParams.htOrderDetailDOS) || [];
                this.orderInfo = JSON.parse(this.fromParams.htOrderDO) || {};
            }
            this.accountDetail();
            this.refresh()
        },
        methods: {
            reset() {

            },
            _number(row, column, cellValue) {
                if (cellValue) {
                    return cellValue.toFixed(2)
                } else {
                    return 0
                }
            },
            cancel() { //取消订单
                let params = {
                    orderNo: this.orderInfo.orderNo
                }
                this.$api.htCancal(params).then(res => {
                    if (res.data.respCode == 0) {
                        this.$alert('该订单状态已取消!', '提示', {
                            confirmButtonText: '确定',
                            callback: action => {
                                this.$router.push({name: 'outWorkerPay'});
                            }
                        });
                    }
                    console.log(res);
                }).catch(err => {

                })
            },
            refresh() {
                let _this = this;
                if (_this.request) {
                    return
                }
                _this.request = true;
                if (this.$route.query.isWait) { //如果代付查看订单的进来的话
                    _this.$api.htWaitingOrder({}).then(res => {
                        console.log(res)
                        if (res.respCode == 0) {
                            let {htOrderDetailDOS, htMoney, htOrderDO} = res.data;
                            _this.fromParams = {htMoney, htOrderDetailDOS, htOrderDO};
                            _this.tableData = htOrderDetailDOS;
                            _this.orderInfo = htOrderDO;
                        }
                    }).catch(err => {
                        console.log(err);
                    }).finally(() => {
                        setTimeout(() => {
                            _this.request = false
                        }, 500)
                    })
                } else {
                    _this.$api.generateOrder(_this.htParams).then(res => {
                        if (res.data.respCode == 0) {
                            let {htOrderDetailDOS, htMoney, htOrderDO,financePhone} = res.data.data;
                            _this.fromParams = {htMoney, financePhone, htOrderDetailDOS, htOrderDO};
                            _this.tableData = htOrderDetailDOS;
                            _this.orderInfo = htOrderDO;
                        }
                    }).catch(err => {
                        console.log(err);
                    }).finally(() => {
                        setTimeout(() => {
                            _this.request = false
                        }, 500)
                    })
                }
            },
            accountDetail() {
                let _this = this;
                this.$api.accountDetail({}).then(res => {
                    _this.hasPassword = res.data.data.hasPassword;
                    _this.accountAmount = res.data.data.wsBalance || 0;
                }).catch(err => {
                    console.log(err);
                })
            },
            getSummaries(param) {
                console.log(param)
                const {columns, data} = param;
                const sums = [];
                sums[0] = '合计'
                sums[1] = ''
                sums[2] = ''
                sums[3] = this.totalMount.attendance || 0
                sums[4] = this.totalMount.workHours || 0
                sums[5] = `
                      ${this.totalMount.jian ? this.totalMount.jian.toFixed(0) + '件' : '0件'},
                      ${this.totalMount.dai ? this.totalMount.dai.toFixed(0) + '袋' : '0袋'},
                      ${this.totalMount.che ? this.totalMount.che.toFixed(0) + '车' : '0车'},
                      ${this.totalMount.dun ? this.totalMount.dun.toFixed(2) + '吨' : '0吨'}
                      `
                sums[6] = this.totalMount.salary || 0
                sums[7] = this.totalMount.punish ? this.totalMount.punish : 0 + (this.totalMount.reward || 0);
                sums[8] = this.totalMount.shouldSalary || 0;
                sums[9] = this.totalMount.otherAmount || 0;
                sums[10] = this.totalMount.totalAmount || 0;
                sums[11] = ""
                sums[12] = ""
                sums[13] = ""
                return sums;
            },
            settlementTypeFormatter(row, column, cellValue, index) {
                let status = '' //1:待确认 2:待支付 3:支付成功 4:发放完成 5:已取消 6:处理出错
                switch (Number.parseInt(cellValue)) {
                    case 1:
                        status = '待确认'
                        break
                    case 2:
                        status = '待支付'
                        break
                    case 3:
                        status = '支付成功'
                        break
                    case 4:
                        status = '发放完成'
                        break
                    case 5:
                        status = '已取消'
                        break;
                    case 6:
                        status = '处理出错'
                        break
                    default:
                        status = '--'
                        break
                }
                return status
            },
            resetShow() {
                this.dialogVisibleResct = true
                this.payVisible = false;
            },
            onLine() {
                let _this = this;
                if (!this.hasPassword) {//未设置支付密码时
                    this.$confirm('请先设置支付密码！', '', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                    }).then(() => {
                        this.dialogVisibleResct = true
                    }).catch(() => {

                    });
                } else {
                    this.payVisible = true;
                    this.getCurrentTime();
                }
            },
            getCurrentTime() {
                let _this = this;
                this.$api.getCurrentTime().then(res => {
                    console.log(res)
                    if (res.respCode == 0) {
                        _this.payTime = res.data  // 时间戳
                        _this.currentTime = res.data  // 时间戳
                    }
                })
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
            getCodeOld() {
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
            //设置支付密码
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
                        if (res.data.respCode == 0) {
                            if (this.titles == '重置支付密码') {
                                this.$message.success("支付密码重置成功！");
                            } else if (this.titles == '设置密码') {
                                this.$message.success("密码设置成功！");
                            }
                            this.dialogVisibleResct = false;
                            this.accountDetail()
                        }
                    }).catch(err => {
                });
            },
            payInline() {
                let _this = this;
                let timeOut = null;
                let pattern = /^[0-9]*$/;
                if (!this.formPay.passwd) {
                    return this.$message.error("支付密码不能为空！");
                }
                if (!pattern.test(this.formPay.passwd) || this.formPay.passwd.length != 6) {
                    return this.$message.error("支付密码为6位数字！");
                }
                if (this.accountAmount < (Number(this.orderInfo.payFee) + Number(this.orderInfo.serviceFee))) {
                    return this.$message.error("管理费余额不足，请充值！");
                }
                if (this.fromParams.htMoney < Number(this.orderInfo.totalRealFee)) {
                    return this.$message.error("薪企云服余额不足，请充值！");
                }
                if(this.request){
                    return
                }
                this.request = true;
                let params = {
                    passwd: this.formPay.passwd,
                    orderNo: this.orderInfo.orderNo,
                };
                /*支付*/
                timeOut = setTimeout(()=>{
                    return _this.$alert('本订单已支付成功，发放进度请查看订单详情!', '提示', {
                        confirmButtonText: '查看订单详情',
                        callback: action => {
                            _this.$router.push({name: 'hantanAccountDetail',query:{orderNo:_this.orderInfo.orderNo}});
                            _this.request = false;
                        }
                    });
                },5000);
                this.$api.htPay(params)
                    .then(res => {
                        console.log(res)
                        if (res.data.respCode == 0) {
                            this.$message.success("支付成功！");
                            this.payVisible = false;
                            _this.$router.push({name: 'hantanAccountDetail',query:{orderNo:_this.orderInfo.orderNo}});
                        }else{
                            console.log('clear')
                            clearTimeout(timeOut)
                            timeOut = null;
                        }
                    })
                    .catch(
                        err => {
                            this.$message.error(err);
                        }
                    ).finally(()=>{
                        setTimeout(()=>{
                            _this.request = false;
                        },500)
                })

            },
        },
    }
</script>
<style lang="scss">
    .co-orange {
        cursor: pointer;
    }

    .xfd-order {
        .add-no-select {
            cursor: not-allowed;
            pointer-events: none;

            .cell .el-checkbox .el-checkbox__inner {
                background-color: #edf2fc;
            }
        }

        .font-weight {
            .el-form-item__label {
                font-weight: 600;
            }
        }

        .cg-disable-select {
            color: #C8CACC;
        }

        .import-btn-wrap {
            display: flex;

            .cus-input {
                width: 280px;
                border: 1px solid #EAEDF4;
                margin-right: 18px;
            }
        }

        .subItem {
            img, span {
                display: inline-block;
                vertical-align: middle;
                color: #5C5C5C;
            }

            img {
                width: 13px;
                height: 15px;
                margin-right: 3px;
            }
        }

        .selectStatus {
            color: #4C4C4C;
            font-size: 12px;
            margin-left: 25px;
        }

        .sche-title {
            text-align: center;
            font-size: 20px;
            font-stretch: normal;
            line-height: 2;
            letter-spacing: 1px;
            color: #262626;
            padding-top: 5px;
            font-weight: bold;
            margin-bottom: 10px;
        }

        .operateCon {
            display: flex;
            flex-direction: row;
            flex-wrap: nowrap;
            justify-content: space-around;
            align-content: center;
            align-items: center;
        }

        .subItem {
            cursor: pointer;
        }

        .cusHeader {
            vertical-align: 1px;
        }

        .questionMark {
            color: #E94A1E;
            font-size: 18px;
            cursor: pointer;
        }

        .exportContainer {
            display: flex;
            flex-direction: row;
            flex-wrap: wrap;
            justify-content: space-between;
            align-content: center;
            align-items: center;
            padding-left: 30px;
            padding-right: 22px;
            box-sizing: border-box;

            .exportLeftCon {
                display: flex;
                flex-direction: row;
                flex-wrap: wrap;
                justify-content: flex-start;
                align-content: center;
                align-items: center;
            }

            .exportRightCon {

            }
        }

        .el-button--small {
            font-size: 12px;
            background-color: #ffefea;
            border: 1px solid #f7beb2;
            color: #e9481c;
        }

        .wait-replace-dialog .el-dialog__header {
            border-bottom: none;
        }

        .el-dialog__footer {
            padding-bottom: 10px !important;
        }

        .el-button.is-disabled {
            color: #C0C4CC;
            cursor: not-allowed;
            background-color: #FFFFFF;
            border-color: #EBEEF5;
        }

        .el-table .cell {
            text-align: center;
        }

        .sche-title {
            text-align: center;
            font-size: 20px;
            font-stretch: normal;
            line-height: 2;
            letter-spacing: 1px;
            color: #262626;
            padding-top: 20px;
            font-weight: bold;
            margin-bottom: 20px;
        }

        .importBtnCon {
            position: relative;

            input {
                width: 80px;
                height: 30px;
                position: absolute;
                left: 0;
                top: 0;
                opacity: 0;
                cursor: pointer;
            }

            .el-button {
                height: 30px;
                line-height: 11px;
            }
        }

        .centerDialog {
            .el-dialog {
                width: 640px;
            }

            .el-dialog__header {
                border-bottom: none;
            }

            .importCustomItemCon {
                margin: auto;
            }

            .controlContainer {
                .el-form-item {
                    margin-bottom: 10px;
                }

                .controlText {
                    padding-top: 24px;
                    color: #9D9DA2;
                }
            }

            .paddingSpecial {
                padding-left: 130px;
            }

            .centerCancel {
                width: 90px !important;
            }

            .centerConfirm {
                width: 110px !important;
            }
        }

        .finalPaymentDialog {
            .el-dialog__header {
                border-bottom: none;
            }

            .el-input__inner {
                height: 30px;
                width: 280px;
            }

            .dialog-footer {
                .el-button {
                    width: 90px;
                }
            }

            .el-dialog__body {
                padding-top: 20px !important;
                padding-bottom: 20px !important;
            }
        }

        .addressDialog {
            .el-dialog {
                width: 740px !important;
                height: 354px !important;
            }

            .el-input__inner {
                height: 30px;
            }

            .el-dialog__body {
                padding: 30px 120px !important;
            }

            .dialog-footer {
                .el-button {
                    width: 90px;
                }
            }
        }

        .newDialog {
            .el-dialog {
                width: 740px !important;
                height: 520px !important;
            }

            .el-dialog__body {
                padding-top: 40px !important;
                padding-left: 120px !important;
                padding-right: 120px !important;
                padding-bottom: 45px !important;
            }

            .el-input__inner {
                height: 30px;
            }

            .dialog-footer {
                .el-button {
                    width: 90px;
                }
            }
        }

        .copyCenterDialog {
            .el-input__inner {
                height: 30px;
                line-height: 30px;
            }

            .dialog-footer {
                .el-button {
                    width: 90px;
                }
            }

            .billControlContainer {
                height: 340px;
            }

            .el-dialog__body {
                padding-top: 40px;
            }

            .controlContainer {
                width: 540px;
                margin: 0 auto;
                box-sizing: border-box;

                .el-button {
                    height: 30px;
                    width: 90px;
                }
            }

            .el-dialog {
                width: 740px !important;
                height: 520px !important;
            }


            .el-button.is-disabled {
                color: #C0C4CC;
                cursor: not-allowed;
                background-color: #FFFFFF;
                border-color: #EBEEF5;
            }

            .el-table .cell {
                text-align: center;
            }

            .centerDialog {
                .el-dialog__header {
                    border-bottom: none;
                }

                .el-dialog {
                    position: absolute;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    top: 0;
                    margin: auto !important;
                    width: 600px;
                    height: 210px;
                }

            }

        }

        .el-dialog-2 .el-dialog__footer {
            padding-bottom: 10px !important;
        }

        .el-dialog-2 .el-input .el-input__inner {
            height: 32px !important;
        }

    }
</style>
