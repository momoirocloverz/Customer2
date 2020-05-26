<template>
    <div class="account">
        <div class="contant-wrapper back-white">
            <div class="account-statistics">
                <div class="amount-balance">
                    <div class="controlAreaFlex">
                        <div class="amountConFirstLine">账户余额: <strong class="blance-number">{{accountInfo.totalAmount |
                            moneyFormat}}</strong>元
                        </div>
                        <el-button size="medium" type="primary" class="charge-btn" @click="handleRecharge">充值
                        </el-button>
                    </div>
                </div>
                <div class="amount-detail">
                    <div class="amount-aviable">
                        <p class="detail-title">充值可用余额：
                            <el-popover placement="bottom-start" width="220" trigger="hover" :visible-arrow="false"
                                        popper-class="setPopOverWhite" content="普通充值可用余额用于支付账户管理费和代发收入类型的应付零工收入">
                                <!--                    <span slot="reference" class="el-icon-question"></span>-->
                            </el-popover>
                        </p>
                        <p class="detail-number"><span class="">{{accountInfo.balance  | moneyFormat}}</span>元</p>
                        <div class="twoBtnCon">
                            <el-button size="medium" type="primary" class="charge-btn" v-if="haveBalanceInfo"
                                       @click="popEdit">修改
                            </el-button>
                            <el-button size="medium" type="primary" class="charge-btn secondBtn" v-if="haveBalanceInfo"
                                       @click="popAlert">关闭预警
                            </el-button>
                            <el-button size="medium" type="primary" class="charge-btn" v-if="!haveBalanceInfo"
                                       @click="popAlert">{{ haveBalanceInfo ? '关闭预警' :'余额预警'}}
                            </el-button>
                        </div>
                        <div v-if="haveBalanceInfo" class="haveBalanceInfoText">低于{{balanceInfoAmount}}元时发送预警短信</div>
                    </div>
                    <!--
                                <div class="amount-outsource">
                                <p class="detail-title">外包费用可用余额：
                                    <el-popover  placement="bottom-start"  width="220" :visible-arrow="false"   popper-class="setPopOverWhite"
                                        trigger="hover" content="外包费用可用余额用于支付外包费用类型的应付零工收入">
                                        <span slot="reference" class="el-icon-question"></span>
                                    </el-popover>
                                </p>
                                <p class="detail-number" ><span class="">{{accountInfo.outsourceAmount  | moneyFormat}}</span>元</p>
                                    <div @click="popOutSourceProcesser" class="popOutSourceStyle" v-if="outSourceObjData.count">{{outSourceObjData.count}}条外包费用充值待处理>></div>
                              </div>
                    -->
                    <div class="amount-freeze">
                        <p class="detail-title">冻结金额</p>
                        <p class="detail-number"><span class="number-emphasize">{{accountInfo.freezingAmountTotal  | moneyFormat }}</span>元
                        </p>
                        <div class="greyText">提示：冻结余额处理结束将自动解冻</div>
                    </div>
                </div>
            </div>
        </div>
        <el-tabs v-model="activeName" class="activeTab">
            <el-tab-pane label="汇总账单" name="first"></el-tab-pane>
            <el-tab-pane label="明细账单" name="second"></el-tab-pane>
            <el-tab-pane label="管理费明细" name="third"></el-tab-pane>
            <!--            <el-tab-pane label="外包费用充值批次" name="fourth"></el-tab-pane>-->
        </el-tabs>
        <bill-detail v-if="activeName == 'second'"></bill-detail>
        <bill-collect v-if="activeName == 'first'"></bill-collect>
        <ManagementDetail v-if="activeName == 'third'"></ManagementDetail>
        <!--      <OutSourceCharge @outSourceBridge="waitingGetData" v-if="activeName == 'fourth'"></OutSourceCharge>-->


        <el-dialog title="充值" :visible.sync="chargeVisible" :before-close="chargeFormBefore" width="540px"
                   class="chargeForm resetInnerCon base-dialog" style="text-align: left;">
            <el-form :model="chargeForm" label-width="110px" :rules="rules" ref="chargeForm">
                <el-form-item label="充值类型：" class="resetFormItem chargeTypeItem">
                  <span class="setRadioConWidth">
                    <el-radio :label="'1'" v-model="chargeForm.chargeType"
                              @change="chargeTypeChange(chargeForm.chargeType)">普通充值</el-radio>
                      <!--
                                            <el-popover  placement="bottom-start" width="220" trigger="hover" :visible-arrow="false"  popper-class="setPopOverWhite"  content="普通充值可用余额用于支付账户管理费和代发收入类型的应付零工收入">
                                              <span slot="reference" class="el-icon-question"></span>
                                              </el-popover>
                      -->
                    </span>
                    <!--
                                      <span class="setRadioConWidth">
                                    <el-radio :label="'2'" v-model="chargeForm.chargeType" @change="chargeTypeChange(chargeForm.chargeType)">外包费用充值</el-radio>
                                          <el-popover  placement="bottom-start" width="220" trigger="hover" :visible-arrow="false"   popper-class="setPopOverWhite"  content="外包费用可用余额用于支付外包费用类型的应付零工收入">
                                                <span slot="reference" class="el-icon-question"></span>
                                            </el-popover>
                                          </span>
                    -->
                </el-form-item>
                <el-form-item label="充值金额：" prop="amount" class="resetFormItem">
                    <el-input v-model.trim.number="chargeForm.amount" clearable auto-complete="off"
                              style="width:280px;height:32px;"
                              @input="chargeAmountInput('chargeForm','amount')"></el-input>
                </el-form-item>
                <el-form-item label="手续费：" class="resetFormItem">
                    <div>￥<span v-if="chargeForm.chargeType == 1">{{charge}}</span><span
                            v-else>{{recharge_outsource}}</span></div>
                </el-form-item>
                <el-form-item label="实际到账：" class="resetFormItem">
                    <p style="color:#E9481C;" v-if="showZero">￥0</p>
                    <p style="color:#E9481C;" v-else>￥{{Number(chargeForm.amount - charge)}}</p>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer" style="text-align: right;">
                <el-button type="primary" @click="payMoney('chargeForm')">支 付</el-button>
                <el-button @click="cancelPayMoney('chargeForm')">取 消</el-button>
            </div>
        </el-dialog>

        <el-dialog :visible.sync="lastFeeDia" width="540px" class="base-dialog base-dialog1">
            <div class="dialog-head">
                <div class="dialog-title">您正在第三方支付页面充值</div>
                <div style="font-size:12px;color:#999999;">(请不要关闭本窗口页面)</div>
            </div>
            <span slot="footer" class="dialog-footer">
        <el-button size="medium" type="primary" @click="confirmFinish">充值已完成</el-button>
        <el-button size="medium" @click="amendInfo">修改充值信息</el-button>
      </span>
        </el-dialog>
        <el-dialog title="余额预警设置" :visible.sync="alertDialShow" :before-close="alertFormBefore" width="540px"
                   class="base-dialog centerDialogue">
            <el-form label-width="130px" :model="alertForm" :rules="alertRules" ref="alertForm">
                <el-form-item label="预警金额：" class="elFormItem centerDMargin" prop="amount">
                    <el-input clearable auto-complete="off" class="centerInput" v-model.number.trim="alertForm.amount"
                              @input="alertFormItemInput('alertForm','amount')"></el-input>
                    元
                </el-form-item>
                <el-form-item label="预警手机号：" class="elFormItem" prop="phone">
                    <el-input clearable auto-complete="off" style="width:220px" v-model.number.trim="alertForm.phone"
                              @input="alertFormItemInput('alertForm','phone')"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer" style="text-align: right;">
                <el-button class="cancelBtn" @click="cancelNormal('alertForm')">取 消</el-button>
                <el-button class="btnNormal" @click="btnNormal('alertForm')">确 认</el-button>
            </div>
        </el-dialog>
        <el-dialog title="外包费用充值信息" :visible.sync="outSourceShow" width="540px" class="base-dialog outSourceDialogue"
                   :before-close="handleClose1" :close-on-click-modal="false">
            <div class="outSourceLimitHeight">
                <el-form label-width="105px" :model="outSourceForm" ref="outSourceForm">
                    <el-form-item label="转账金额：" class="elFormItem largerMargin">
                        <div>{{this.outSourceForm.amount | moneyFormat}}</div>
                    </el-form-item>
                    <el-form-item label="收款账户：" class="elFormItem largerMargin">
                        <div>{{this.outSourceForm.toUserName}}</div>
                    </el-form-item>
                    <el-form-item label="收款银行：" class="elFormItem largerMargin">
                        <div>{{this.outSourceForm.bankName}}</div>
                    </el-form-item>
                    <el-form-item label="收款账号：" class="elFormItem largerMargin">
                        <div>{{this.outSourceForm.cardNumber}}</div>
                    </el-form-item>
                    <el-form-item label="充值批次：" class="elFormItem largerMargin">
                        <div>{{this.outSourceForm.orderNo}}</div>
                    </el-form-item>
                    <div class="disableText">请按提示将付款金额通过指定网银转账至指定银行账号，我司收到款项后会在1天内将相关零工收入发放至其平台绑定银行卡。</div>
                    <div class="textStyle">请使用{{this.outSourceForm.customName}}的银行卡进行转账，否则无法开票。</div>
                </el-form>

            </div>
            <div slot="footer" class="dialog-footer" style="text-align: right;">
                <el-button class="outSourceCancelBtn cancelBtn" @click="cancelThisOutSource">取消该付款订单</el-button>
                <el-button class="outSourceBtnNormal btnNormal" @click="confirmThisOutSource">确认已转账</el-button>
            </div>
        </el-dialog>


        <el-dialog :visible.sync="littleConfirmShow" width="540px" class="base-dialog littleConfirmDialog">
            <div class="infoText">确认充值批次已转账？</div>
            <div slot="footer" class="dialog-footer" style="text-align: right;">
                <el-button class="outSourceCancelBtn cancelBtn" @click="cancelLittleConfirm">取消</el-button>
                <el-button class="outSourceBtnNormal btnNormal" @click="confirmLittleConfirm">确认</el-button>
            </div>
        </el-dialog>
        <el-dialog :visible.sync="littleCancelShow" width="540px" class="base-dialog littleCancelDialog">
            <div class="infoText">确认取消该充值批次？</div>
            <div slot="footer" class="dialog-footer" style="text-align: right;">
                <el-button class="outSourceCancelBtn cancelBtn" @click="cancelLittleCancel">取消</el-button>
                <el-button class="outSourceBtnNormal btnNormal" @click="confirmLittleCancel">确认</el-button>
            </div>
        </el-dialog>

    </div>
</template>
<script>
    import ExportComponent from './export';
    import BillDetail from './component/BillDetail.vue';
    import BillCollect from './component/BillCollect.vue';
    import ManagementDetail from './component/managementDetail.vue';
    //    import OutSourceCharge from './component/outSourceCharge.vue';
    export default {
        name: "AccountList",
        components: {ExportComponent, BillDetail, BillCollect, ManagementDetail},
        data() {
            let validateIdCard = (rule, value, callback) => {
                if (value === '') {
                    callback(new Error('充值金额不能为空'));
                } else {
                    if (!Number.isInteger(this.chargeForm.amount)) {
                        callback(new Error('请填写正确的充值金额'));
                    } else {
                        let charType = this.chargeForm.chargeType;
                        switch (charType) {
                            case '1':
                                if (this.chargeForm.amount >= +this.charge) {
                                    callback();
                                } else {
                                    callback(new Error('充值金额不能低于手续费'));
                                }
                                break;
                            case '2':
                                if (this.chargeForm.amount >= +this.recharge_outsource) {
                                    callback();
                                } else {
                                    callback(new Error('充值金额不能低于手续费'));
                                }
                                break;
                        }
                    }
                }
            };
            return {
                insertAble: true,
                littleConfirmShow: false,
                littleCancelShow: false,
                outSourceShow: false,
                haveBalanceInfo: false,
                balanceInfoAmount: 0,
                balanceInfoPhone: '',
                activeName: 'first',
                tableData: [],
                accountInfo: {},
                alertDialShow: false,
                currentPage: 1,
                pageSize: 20,
                pageCount: 0,
                total: 0,
                chargeVisible: false,
                time: 3,
                wating: 60,
                getcoding: false,
                buttonText: '获取验证码',
                outSourceForm: {},
                alertForm: {
                    amount: '',
                    phone: '',
                },
                alertRules: {
                    amount: [
                        {required: true, message: '充值金额不能为空', trigger: 'blur'},
                        {pattern: /^[0-9]*$/, message: "请输入大于0的整数", trigger: 'blur'}
                    ],
                    phone: [
                        {required: true, message: '手机号不能为空', trigger: 'blur'},
                        {pattern: /^[1]([3-9])[0-9]{9}$/, message: "请填写正确的手机号", trigger: 'blur'}
                    ],
                },
                rules: {
                    amount: [
                        {validator: validateIdCard, trigger: 'blur'}
                    ],
                },
                agreeVisible: false,
                chargeForm: {
                    amount: '',
                    chargeType: '1',
                },
                lastFeeDia: false,
                charge: '0',
                recharge_outsource: '0',
                outstandingFees: 0,
                idCardValidate: false,
                showZero: true,
                forTempSave: '',
                outSourceObjData: {
                    count: '',
                    orderNo: '',
                },
                outSourceTabId: '',
            };
        },

        filters: {
            formatMobile(val) {
                if (val) {
                    return val.substr(0, 3) + "****" + val.substr(7);
                }
            },
            moneyFormat(value) {
                if ((toString.call(value) === '[object Null]') || (toString.call(value) === '[object Undefined]')) {
                    return 0;
                } else {
                    let fix = (Math.round(+value + 'e' + 2) / Math.pow(10, 2)).toFixed(2);
                    return fix;
                }
            },
        },
        mounted() {
            this.getDetail()
            this.getList()
            this.getFee()
            this.getOutSourceFee();
            this.requestInit();
            this.getbalanceWarnStatus();
//      this.getOutSourceWaitingCount();
        },
        beforeDestroy() {
            this.insertAble = false;
            this.destroyAlertInfo();
        },
        methods: {
            chargeTypeChange(type) {
                this.$refs.chargeForm.validateField('amount');
            },
            waitingGetData(payload) {
                this.outSourceTabId = payload.id;
                this.outSourceShow = true;
                let params = {
                    id: this.outSourceTabId
                };
                this.$api.outSourceInfoById(params).then(res => {
                    let {respCode, data} = res;
                    if (respCode === 0) {
                        this.outSourceForm = data;
                    } else {
                        this.outSourceForm = {};
                    }
                }).catch(err => {
                    console.log('err', err);
                })


            },
            handleClose1() {
                this.getOutSourceWaitingCount();
                this.outSourceShow = false;
            },
            getOutSourceWaitingCount() {
                this.$api.getCountOutSource().then(res => {
                    let {respCode, data} = res;
                    if (respCode === 0) {
                        let getKey = Object.keys(data)[0];
                        let getValue = Object.values(data)[0];
                        if (getKey == 0) {
                            this.outSourceObjData.count = '';
                            this.outSourceObjData.orderNo = '';
                        } else {
                            this.outSourceObjData.count = getKey;
                            this.outSourceObjData.orderNo = getValue;
                        }
                    }
                }).catch(err => {
                    console.log('err', err);
                })
            },
            changeOutSourceChargeStatus(first) {
                let params = {
                    orderNo: this.outSourceForm.orderNo,
                    status: first,
                };
                this.$api.changeOutsource(params).then(res => {
                    let {data: layer1} = res;
                    let {respCode} = layer1;
                    if (respCode === 0) {
                        this.getOutSourceWaitingCount();
                        this.$message({
                            message: '变更成功',
                            type: 'success'
                        });
//                    if( this.activeName == 'fourth' ){
//                        this.activeName = '';
//                        this.$nextTick(()=>{
//                            this.activeName = 'fourth';
//                        });                        
//                    }
                    }
                }).catch(err => {
                    console.log('err', err);
                });
            },
            cancelLittleConfirm() {
                this.littleConfirmShow = false;
            },
            confirmLittleConfirm() {
                this.littleConfirmShow = false;
                this.changeOutSourceChargeStatus('2');
            },
            cancelLittleCancel() {
                this.littleCancelShow = false;
            },
            confirmLittleCancel() {
                this.littleCancelShow = false;
                this.changeOutSourceChargeStatus('4');
            },
            cancelThisOutSource() {
                this.getOutSourceWaitingCount();
                this.outSourceShow = false;
                this.littleCancelShow = true;
            },
            confirmThisOutSource() {
                this.getOutSourceWaitingCount();
                this.outSourceShow = false;
                this.littleConfirmShow = true;
            },
            popOutSourceProcesser() {
                this.outSourceShow = true;
                let params = {
                    id: this.outSourceObjData.orderNo
                };
                this.$api.outSourceInfoById(params).then(res => {
                    let {respCode, data} = res;
                    if (respCode === 0) {
                        this.outSourceForm = data;
                    } else {
                        this.outSourceForm = {};
                    }
                }).catch(err => {
                    console.log('err', err);
                })
            },
            getbalanceWarnStatus() {
                this.$api.balanceWarnStatus().then(res => {
                    let {data: layer1} = res;
                    let {respCode, data} = layer1;
                    if (respCode === 0) {
                        if (data) {
                            if (data.warnAmount) {
                                this.balanceInfoAmount = data.warnAmount;
                                this.balanceInfoPhone = data.mobile;
                                this.haveBalanceInfo = true;
                            } else {
                                this.haveBalanceInfo = false;
                            }
                        } else {
                            this.haveBalanceInfo = false;
                        }
                    }
                }).catch(err => {
                    console.log('err', err);
                });
            },
            chargeAmountInput(form, item) {
                let isNumber = toString.call(this[form][item]) === '[object Number]';
                if (isNumber) {
                    let judge = Number.isInteger(this[form][item]);
                    if (judge) {
                        this.showZero = false;
                    } else {
                        this[form][item] = '';
                        this.showZero = true;
                    }
                } else {
                    this[form][item] = '';
                    this.showZero = true;
                }
            },
            alertFormItemInput(form, item) {
                let isNumber = toString.call(this[form][item]) === '[object Number]';
                if (isNumber) {
                    let judge = Number.isInteger(this[form][item]);
                    if (judge) {
                        if (this[form][item] == 0) {
                            this[form][item] = '';
                        }
                    } else {
                        this[form][item] = '';
                    }
                } else {
                    this[form][item] = '';
                }
            },
            cancelRemoteBalance() {
                this.$api.deleteBalanceWarn().then(res => {
                    let {data: layer1} = res;
                    let {respCode} = layer1;
                    if (respCode === 0) {
                        this.$message({
                            message: '取消预警成功',
                            type: 'success'
                        });
                        this.getbalanceWarnStatus();
                    }
                }).catch(err => {
                    console.log('err', err);
                })
            },
            popAlert() {
                if (this.haveBalanceInfo) {
                    this.cancelRemoteBalance();
                } else {
                    this.alertDialShow = true;
                }
            },
            popEdit() {
                this.alertDialShow = true;
                this.alertForm.amount = this.balanceInfoAmount;
                this.alertForm.phone = this.balanceInfoPhone;
            },
            cancelNormal(form) {
                this.$refs[form].resetFields();
                this.alertDialShow = false;
            },
            btnNormal(form) {
                this.$refs[form].validate((valid) => {
                    if (valid) {
                        let params = {
                            mobile: this[form].phone,
                            warnAmount: this[form].amount,
                        }
                        this.$api.balanceWarn(params).then(res => {
                            let {data: layer1} = res;
                            let {respCode} = layer1;
                            if (respCode === 0) {
                                this.$message({
                                    message: '设置成功',
                                    type: 'success'
                                });
                                this.alertDialShow = false;
                                this.$refs[form].resetFields();
                                this.getbalanceWarnStatus();
                            }
                        }).catch(err => {
                            console.log('err', err);
                        })
                    } else {
                        return false;
                    }
                });
            },
            alertFormBefore() {
                this.alertDialShow = false;
                this.$refs.alertForm.resetFields();
            },
            requestInit() {
                this.$api.managementFee().then(res => {
                    let {data: layer1} = res;
                    let {respCode, data} = layer1;
                    if (respCode === 0) {
                        if (data) {
                            this.outstandingFees = data;
                            if (this.outstandingFees) {
                                this.generateAlertInfo();
                            }
                        }
                    }
                }).catch(err => {
                    console.log(err)
                })
            },
            generateAlertInfo() {
                let fee = (Math.round(+this.outstandingFees + 'e' + 2) / Math.pow(10, 2)).toFixed(2);
                let bread = document.getElementById('breadContainer');
                let newDom = document.createElement("div");
                newDom.setAttribute('id', 'specialInsert');
                newDom.style.height = "40px";
                newDom.style.backgroundColor = "#fff";
                newDom.style.paddingLeft = "30px";
                newDom.style.boxSizing = "border-box";
                newDom.style.lineHeight = "40px";
                newDom.style.fontSize = "14px";
                newDom.style.color = "#F56269";
                newDom.innerHTML = `<i class="el-icon-circle-close" style="margin-right:10px"></i><span >普通充值可用余额已欠费，您发布的班务所属排班相关功能使用已受限，请充值恢复使用</span>`;
                if (document.getElementById('specialInsert')) {
                } else {
                    if (this.insertAble) {
                        bread.parentNode.insertBefore(newDom, bread);
                    }
                }
            },
            destroyAlertInfo() {
                let bread = document.getElementById('breadContainer');
                let child = document.getElementById('specialInsert');
                if (child) {
                    bread.parentNode.removeChild(child);
                }
            },
            payMoney(chargeForm) {
                this.forTempSave = this.chargeForm.amount;
                this.$refs[chargeForm].validate((valid) => {
                    if (valid) {
                        let charType = this.chargeForm.chargeType;
                        let params = {};
                        switch (charType) {
                            case '1':
                                params = {
                                    amount: this.chargeForm.amount
                                };
                                this.$api.myAmount(params).then(res => {
                                    if (res.data.respCode == 0) {
                                        if (res.data.data) {
                                            window.open(res.data.data.redirectUrl)
                                            this.chargeVisible = false;
                                            this.lastFeeDia = true;
                                            this.$refs[chargeForm].resetFields();
                                        }
                                    }
                                }).catch(err => {
                                    console.log('err', err);
                                })
                                break;
                            case '2':
                                params = {
                                    balance: this.chargeForm.amount
                                };
                                this.$api.outsourceRecharge(params).then(res => {
                                    let {data: layer1} = res;
                                    let {data, respCode} = layer1;
                                    if (respCode == 0) {
                                        this.outSourceShow = true;
                                        this.outSourceForm = data;
                                        this.chargeVisible = false;
                                        if (this.activeName == 'fourth') {
                                            this.activeName = '';
                                            this.$nextTick(() => {
                                                this.activeName = 'fourth';
                                            });
                                        }
                                    } else {
                                        this.outSourceForm = {};
                                        if (this.activeName == 'fourth') {
                                            this.activeName = '';
                                            this.$nextTick(() => {
                                                this.activeName = 'fourth';
                                            });
                                        }
                                    }
                                }).catch(err => {
                                    console.log('err', err);
                                })
                                break;
                        }
                    } else {
                        return false;
                    }
                });
            },
            cancelPayMoney(chargeForm) {
                this.chargeVisible = false;
                this.$refs[chargeForm].resetFields();
            },
            chargeFormBefore() {
                this.$refs.chargeForm.resetFields();
                this.chargeVisible = false;
            },
            amendInfo() {
                if (this.forTempSave) {
                    this.chargeForm.amount = this.forTempSave;
                    this.showZero = false;
                } else {
                    this.showZero = true;
                }
                this.chargeVisible = true
                this.lastFeeDia = false;

            },
            handleRecharge() {
                this.chargeVisible = true;
                this.showZero = true;
            },
            getDetail() {
                this.$api.AccountDetail().then((response) => {
                    if (response.data.respCode == 0) {
                        if (response.data.data) {
                            this.accountInfo = response.data.data
                        }
                    }
                }).catch((error) => {
                    console.log(error);
                });
            },
            handleCurrentChange(val) {
                this.currentPage = val;
                this.getList();
            },
            getList() {
                const params = {
                    pageNum: this.currentPage,
                    pageSize: this.pageSize,
                    objectType: 1,
                }
                this.$api.AccountRunning(params).then((response) => {
                    if (response.data.respCode == 0) {
                        const {
                            data: {list, pages, total, pageNum},
                        } = response.data;
                        this.tableData = list
                        this.pageCount = pages
                        this.total = total
                    }
                }).catch((error) => {
                    console.log(error);
                });
            },
            handleSubmit() {
                const params = {
                    loginName: this.form.loginName,
                    validator: this.form.validator,
                    password: this.form.password,
                    mobile: this.mobile,
                    userType: 2,
                };
                this.$api.UpdateUserPassword(params).then(response => {
                    this.agreeVisible = true
                    this.setTiming()
                }).catch(error => {
                    console.log(error);
                });
            },
            check() {
                this.$router.push({name: 'mAccountList'})
            },
            getFee() {
                const params = {
                    paramName: 'recharge',
                };
                this.$api.ParamsInfo(params).then(response => {
                    if (response.respCode == 0) {
                        this.charge = response.data
                    }
                }).catch(error => {
                    console.log(error);
                });
            },
            getOutSourceFee() {
                const params = {
                    paramName: 'recharge_outsource',
                };
                this.$api.ParamsInfo(params).then(res => {
                    if (res.respCode == 0) {
                        this.recharge_outsource = res.data;
                    }
                }).catch(error => {
                    console.log(error);
                });
            },
            confirmFinish() {
                this.lastFeeDia = false;
                this.$api.isCustomArrears().then(res => {
                    let {data: layer1} = res;
                    let {respCode} = layer1;
                    if (respCode === 0) {
                        this.getDetail();
                        this.activeName = null;
                        this.$nextTick(() => {
                            this.activeName = 'first';
                        });
                        this.getbalanceWarnStatus();
                    }
                }).catch(err => {
                    console.log('err', err);
                });
                this.destroyAlertInfo();
                this.requestInit();
            },
        },
    };
</script>
<style lang="scss" scoped>
    .account {
        .largerMargin {
            margin-bottom: 27px;
        }

        .textStyle {
            margin-left: 18px;
        }

        .controlAreaFlex {
            display: flex;
            flex-direction: row;
            flex-wrap: wrap;
            justify-content: flex-start;
            align-content: center;
            align-items: center;
        }

        .balanceInfoText {
            margin-top: 23px;
            height: 34px;
            line-height: 34px;
            margin-left: 22px;
            margin-right: 22px;
        }

        .balanceInfoCon {
            height: 94px;
            box-sizing: border-box;
        }

        .centerDMargin {
            margin-bottom: 14px;
        }

        .cancelBtn:hover {
            background: #FFFFFF;
            border: 1px solid #DCDFE6;
            color: #606266;
        }
    }
</style>
<style lang="scss">
    .account {
        .popOutSourceStyle {
            cursor: pointer;
            color: #E9481C;
        }

        .account-statistics {
            border-top: 1px solid #ededed;
            padding: 19px 0 0 0;
            margin-bottom: 30px;

            .amountConFirstLine {
                font-size: 14px;
                height: 34px;
                line-height: 34px;
                margin-right: 55px;
            }

            .amount-balance {
                font-size: 16px;
                color: #666;
                line-height: 1;
                padding: 0 0 19px 35px;
                border-bottom: 1px solid #ededed;

                .blance-number {
                    color: #e84518;
                    margin-left: 5px;
                    margin-right: 5px;
                    font-weight: normal;
                    font-size: 16px;
                }

                .el-button--primary {
                    width: 90px;
                    height: 34px;
                    font-size: 14px;
                    color: #e9481c;
                    background-color: #f7beb2 !important;
                }

                .charge-btn {
                    font-size: 12px;
                    background-color: #ffefea !important;
                    border: 1px solid #f7beb2;

                    &:active {
                        color: #d13e16;
                        border-color: #d13e16;
                    }
                }
            }

            .amount-detail {
                height: 190px;
                display: flex;
                justify-content: flex-start;
                align-content: center;
                align-items: center;
                font-size: 14px;
                line-height: 1;
                color: #666;

                .detail-title {
                    padding: 0 0 18px 0;
                }

                .haveBalanceInfoText {
                    margin-top: 15px;
                }

                .twoBtnCon {
                    margin: 0 auto;
                    text-align: center;
                    display: flex;
                    justify-content: center;
                    width: 194px;
                    align-content: center;
                    align-items: center;

                    .secondBtn {
                        margin-left: 12px;
                    }
                }

                .detail-number {
                    font-size: 18px;
                    color: #5c5c5c;
                    margin-bottom: 15px;
                }

                .number-emphasize {
                    font-weight: normal;
                    margin-right: 5px;
                }

                .amount-aviable {
                    text-align: center;
                    padding-top: 43px;
                    height: 100%;
                    width: 260px;
                    border-right: 1px solid #ededf0;

                    .number-emphasize {
                        color: #999;
                    }
                }

                .charge-btn {
                    font-size: 12px;
                    width: 90px;
                    background-color: #ffefea !important;
                    border: 1px solid #f7beb2;

                    &:active {
                        color: #d13e16;
                        border-color: #d13e16;
                    }

                    &:hover {
                        color: #e9481c;
                    }

                    &:focus {
                        color: #d13e16;
                    }
                }

                .amount-outsource {
                    text-align: center;
                    padding-top: 43px;
                    height: 100%;
                    width: 250px;
                    border-right: 1px solid #ededf0;

                    .number-emphasize {
                        color: #999;
                    }

                    .detail-number {
                        margin-bottom: 23px;
                    }
                }

                .amount-freeze {
                    text-align: center;
                    padding-top: 43px;
                    height: 100%;
                    width: 250px;
                    border-right: 1px solid #ededf0;

                    .number-emphasize {
                        color: #999;
                    }

                    .detail-number {
                        margin-bottom: 25px;
                    }

                    .greyText {
                        color: #C0C1C2;
                        font-size: 12px;
                    }
                }
            }
        }

        .el-input__inner {
            height: 32px;
        }

        .el-form-item__content {
            line-height: 40px;
        }

        .el-button--primary, .el-button--default {
            line-height: 8px;
        }

        .base-dialog .el-dialog__footer {
            border-top: 1px solid #EDEEF0;
        }

        .el-dialog__footer {
            padding-bottom: 10px !important;
        }

        .base-dialog .el-button {
            width: 90px;
        }

        .base-dialog1 .el-button {
            width: 135px;
        }

        .el-dialog__header {
            padding: 20px 20px 0px 40px;
        }

        .chargeForm {
            .el-form-item__label {
                line-height: 40px;
            }
        }

        .resetInnerCon {
            .resetFormItem {
                margin-bottom: 7px;
            }
        }

        .outSourceDialogue {
            .el-dialog__header {
                border-bottom: none;
            }

            .el-dialog {
                text-align: left;
                height: 502px;
                position: absolute;
                left: 0;
                right: 0;
                top: 0;
                bottom: 0;
                margin: auto !important;
            }

            .outSourceCancelBtn {
                width: 132px;
            }

            .outSourceBtnNormal {
                width: 120px;
            }

            .el-form-item__label {
                line-height: 20px;
            }

            .el-form-item__content {
                line-height: 20px;
            }

            .outSourceLimitHeight {
                height: 340px;

                .el-form-item__label {
                    color: #383838;
                }
            }

            .disableText {
                color: #8C8C8C;
                width: 460px;
                height: 70px;
                background-color: #f5f6f7;
                margin: 0 auto;
                margin-bottom: 15px;
                box-sizing: border-box;
                font-size: 12px;
                padding: 18px 20px 0 20px;
            }
        }

        .littleCancelDialog, .littleConfirmDialog {
            .infoText {
                font-size: 16px;
                color: #5C5C5C;
            }

            .el-dialog {
                text-align: center;
                height: 196px;
                position: absolute;
                left: 0;
                right: 0;
                top: 0;
                bottom: 0;
                margin: auto !important;
            }

            .el-dialog__header {
                height: 40px;
                border-bottom: none;
            }

            .el-dialog__body {
                height: 100px;
            }
        }

        .centerDialogue {
            .el-dialog {
                text-align: left;
                height: 246px;
                position: absolute;
                left: 0;
                right: 0;
                top: 0;
                bottom: 0;
                margin: auto !important;
            }

            .el-dialog__body {
                padding-bottom: 20px;
            }

            .el-dialog__header {
                border-bottom: none;
            }

            .el-button:active {
                color: #d13e16;
                border-color: #d13e16;
            }
        }

        .centerInput {
            width: 171px;
            margin-right: 15px;
        }

        .btnNormal {
            color: #e84518;
            border-color: #f8c7ba;
            background-color: #fdece8;
        }

        .chargeTypeItem {
            .el-radio-group {
                height: 40px;
            }

            .el-radio__label {
                vertical-align: -1px;
            }
        }

        .setRadioConWidth {
            margin-right: 30px;

            .el-radio {
                margin-right: 10px;
            }
        }

        .elFormItem {
            margin-bottom: 0;
        }

        .el-icon-question {
            color: #E9481C;
            cursor: pointer;
        }
    }

    .setPopOverWhite {
        background-color: #333;
        color: #fff;
        border-color: #333;
        font-size: 12px;
        line-height: 20px;
    }
</style>