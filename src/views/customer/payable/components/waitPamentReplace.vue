<template>
    <div class="waitPamentReplaceContainer" v-loading="loading" :element-loading-text="loadingText">
        <h3 class="sche-title">代发收入{{fromParams.batchNumber}}</h3>
        <search-bar class="bg-fff mb10" @handleSearch="searchNow" placeholder="请输入零工姓名"/>
        <div class="lock-right mb10">
            <span class="f12 co-666 pr10">奖惩锁定</span>
            <el-button size="small" class="myplain-btn" :disabled="tableData.length == 0" @click="lockBatch(1)">
                全部锁定
            </el-button>
            <el-button size="small" class="myplain-btn" :disabled="tableData.length == 0" @click="lockBatch(2)">
                全部解锁
            </el-button>
        </div>
        <div class="f14 pl30 pb15 pt8" v-if="isXfdOrder">该收入批次有薪福多订单待付款，请先处理该订单。 <span @click="toWait()" class="co-orange">[点击查看]</span></div>
        <div class="f14 pl30 pb15 pt8" v-if="isTimelyRainOrder">该收入批次有订单待付款或待发放，请先处理该订单。 <span @click="toWaitRain()" class="co-orange">[点击查看]</span></div>
        <div class="table-box back-white">
            <div class="exportContainer">
                <div class="exportLeftCon">
                    <el-button class="myplain-btn " v-if="ifHavePayOwn != 1" size="small" :disabled="isDisabled" @click="onLine">线上付款</el-button>
                    <el-button class="myplain-btn " size="small" :disabled="isDisabled" @click="offLine">线下付款
                    </el-button>
                    <el-button class="myplain-btn " v-if="ifHavePayOwn != 1" size="small" :disabled="isDisabled" @click="xfdPay">薪福多付款
                    </el-button>
                    <el-button class="myplain-btn " v-if="ifHavePayOwn == 1" size="small" :disabled="isDisabled" @click="timelyRainPay">及时雨线上付款
                    </el-button>
                    <div class="selectStatus">共{{total}}条记录,已选中{{selectTotal}}条</div>
                </div>
                <div class="exportRightCon">
                    <span v-if="rewardTotal > 0" class="pr10 selectStatus co-orange"
                          @click="go()">{{rewardTotal}}个奖惩待审核</span>
                    <el-button size="small" class="myplain-btn" :disabled="tableData.length == 0" @click="exportAction">
                        导出记录
                    </el-button>
                    <el-button size="small" class="myplain-btn" :disabled="tableData.length == 0"
                               @click="exportActionTwo">
                        导出扣款项
                    </el-button>
                    <el-button size="small" @click="importAction">导入扣款项</el-button>
                </div>
            </div>
            <el-table class="table-outline" :data="tableData" @selection-change="handleSelectionChange"
                      ref="multipleTable"
                      :header-cell-class-name="getRowClass"
                      :row-class-name="getRowClassName"
                      :summary-method="getSummaries" show-summary
                      emptyText="暂无相关信息" style="width: 100%;">
                <el-table-column type="selection" :selectable="selectable"></el-table-column>
                <el-table-column label="序号" prop="">
                    <template v-slot="scope">
                        <span>{{scope.$index+1}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="姓名" align="left">
                    <template v-slot="scope">
                        <!--和支付宝-->
                        <div style="display: flex;flex-direction: row;padding-left: 20px">
                        <el-tooltip class="item" effect="dark" content="未绑定银行卡" placement="top-start" v-if="!scope.row.ifHasCard">
                            <img width="18" height="18" style="display: inline-block;margin-right:6px;vertical-align: middle;cursor: pointer" src="@/assets/icons/ts.png" alt="">
                        </el-tooltip>
                        <el-tooltip class="item" effect="dark" content="有待审核奖惩" placement="top-start" v-if="scope.row.ifCanPay">
                            <img width="18" height="18" style="display: inline-block;margin-right:6px;vertical-align: middle;cursor: pointer" src="@/assets/icons/ts.png" alt="">
                        </el-tooltip>
                        <el-tooltip class="item" effect="dark" content="实发收入小于等于0" placement="top-start" v-if="scope.row.totalAmount <= 0">
                            <img width="18" height="18" style="display: inline-block;margin-right:6px;vertical-align: middle;cursor: pointer" src="@/assets/icons/ts.png" alt="">
                        </el-tooltip>
                        <span style="display: inline-block;width:18px;height:18px;margin-right:6px;vertical-align: middle;" v-if="scope.row.ifHasCard && !scope.row.ifCanPay && scope.row.totalAmount > 0"></span>
                        <span style="display: inline-block;vertical-align: middle;line-height: 20px" >{{scope.row.realNameAlias}}</span>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column label="签到天数" prop="attendance"></el-table-column>
                <el-table-column label="工时" prop="workHours"></el-table-column>
                <el-table-column label="产量" prop="">
                    <template v-slot="scope">
                        <span>{{scope.row.jian | toFixeFortter}}件 </span>
                        <span>{{scope.row.dai | toFixeFortter}}袋 </span>
                        <span>{{scope.row.che | toFixeFortter}}车 </span>
                        <span>{{scope.row.dun | toFixeFortter2}}吨 </span>
                    </template>
                </el-table-column>
                <el-table-column label="收入合计（元）" prop="salary"></el-table-column>
                <el-table-column label="奖惩合计(元)" prop="">
                    <template v-slot="scope">
                        <span>{{scope.row.punish+scope.row.reward}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="应发收入(元)" prop="shouldSalary"></el-table-column>
                <el-table-column label="扣款合计(元)" prop="otherAmount"></el-table-column>
                <el-table-column label="实发收入(元)" prop="totalAmount"></el-table-column>
                <!--<el-table-column label="付款状态" prop="ifPayName">-->
                <!--<template slot="header" slot-scope="scope">-->
                <!--<span class="cusHeader">是否付款失败</span><i class="questionMark el-icon-question"-->
                <!--@click="popInfo"></i>-->
                <!--</template>-->
                <!--</el-table-column>-->
                <el-table-column label="奖惩锁定" prop="">
                    <template v-slot="scope">
                        <div class="lock-box">
                            <el-switch
                                    @change="swtichlock(scope.row)"
                                    v-model="scope.row.isRPLock"
                                    active-color="#ff4949"
                                    active-text="开"
                                    inactive-text="关"
                                    inactive-color="#C8C8C8">
                            </el-switch>
                            <span class="lock-mask"></span>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column label="操作" min-width="180">
                    <template v-slot="scope">
                        <div class="operateCon">
                            <div class="subItem" @click="goToHandlerDetails(scope.row)"><img
                                    :src="icon1"/><span>收入明细</span></div>
                            <div class="subItem" @click="goToReward(scope.row)"><img :src="icon2"/><span>奖惩明细</span>
                            </div>
                            <div class="subItem" @click="goToDeductions(scope.row)"><img :src="icon3"/><span>扣款明细</span>
                            </div>
                            <div class="subItem" @click="badDebt(scope.row)"><img :src="icon3"/><span>坏账</span>
                            </div>
                        </div>
                    </template>
                </el-table-column>
            </el-table>
            <!--<div class="pagination-container">-->
            <!--<el-pagination class="pagebox" layout="prev, pager, next" @current-change="handleCurrentChange"-->
            <!--:current-page="currentPage" :page-count="pageCount">-->
            <!--</el-pagination>-->
            <!--</div>-->
        </div>
        <el-dialog
                title="提示"
                :visible.sync="dialogVisible" class="centerDialog ">
            <span>零工未在万才网绑定银行卡，或绑定了银行卡但银行卡已注销、冻结、更换了预留手机号等情况会导致付款失败，付款失败后该记录状态仍为待付，并在是否付款失败列标记“付款失败”</span>
            <span slot="footer" class="dialog-footer">
            <el-button size="small" @click="dialogVisible = false">确 定</el-button>
          </span>
        </el-dialog>
        <el-dialog :visible.sync="offlineShow" width="450px" class="base-dialog wait-replace-dialog"
                   :before-close="emptyData">
            <div class="dialog-head" style="">
                <p class="base-dialog-title">确认已进行线下付款？</p>
            </div>
            <span slot="footer" class="dialog-footer">
              <el-button size="middle" @click="offlineShow = false">取 消</el-button>
              <el-button size="small" class="" @click="taskConfirms">确 认</el-button>
          </span>
        </el-dialog>
        <el-dialog :title="`导入扣款项(代发收入 ${fromParams.batchNumber})`" :visible.sync="secondDialogVisible"
                   class="centerDialog"
                   :before-close="emptyData">
            <div class="importCustomItemCon">
                <div>{{importSummaryMsg}}</div>
                <span>导入失败原因</span>
                <el-table :data="importDetailErrorMsgList" border height="400">
                    <el-table-column prop="number" label="序号（excel表格序号)"></el-table-column>
                    <el-table-column prop="errorMsg" label="失败原因"></el-table-column>
                </el-table>
            </div>
            <span slot="footer" class="dialog-footer">
          <el-button class="centerCancel" @click="second()">返 回</el-button>
      </span>
        </el-dialog>
        <!--等待抽象为可复用组件-->
        <el-dialog :title="`导入扣款项(代发收入${fromParams.batchNumber})`" :visible.sync="importVisible" class="centerDialog"
                   :before-close="emptyData">
            <div class="controlContainer">
                <el-form :model="importForm" label-width="130px" label-position="right">
                    <el-form-item label="选择导入的文件：" class="importFormResetMargin">
                        <div class="importBtnCon import-btn-wrap">
                            <!--<div class="cus-input">{{fileName}}</div>-->
                            <el-upload
                                    ref="upload"
                                    class="upload-demo"
                                    :action="importUrl"
                                    :on-preview="handlePreview"
                                    :on-remove="handleRemove"
                                    :before-upload="beforeAvatarUpload"
                                    :limit="1"
                                    accept=".xls,.xlsx"
                                    :on-exceed="handleExceed"
                                    :on-success="handleAvatarScucess"
                                    :file-list="fileList"
                                    :auto-upload="false"
                                    :data={batchNumber:batchNumber,payType:2}
                                    :headers="uploadHeaders"
                                    :multiple="false">
                                <el-button slot="trigger" size="small" type="primary">浏览</el-button>
                            </el-upload>
                        </div>
                    </el-form-item>
                    <div class="paddingSpecial">
                        <div class="downLoadCon">
                            <span
                            ><a href="#" style="text-decoration:none" class="co-orange"
                                @click="downloadMobel">点击下载文件模板</a></span>&nbsp;&nbsp;<span>只支持excel文件</span></div>
                        <div>{{fileName}}</div>
                        <!--<el-progress :percentage="50" class="progress"></el-progress>-->
                        <div class="controlText">
                            <div>注意：</div>
                            <div>1，同一零工新导入的会覆盖前面导入的所有扣款项</div>
                            <div>2，如导入零工不存在该待付批次中，该零工的扣款记录将导入失败</div>
                        </div>
                    </div>
                </el-form>
            </div>
            <span slot="footer" class="dialog-footer">
          <el-button class="centerCancel" @click="importVisible = false">取 消</el-button>
          <el-button class="centerConfirm" size="small" @click="submitUpload"
                     :disabled="importing">{{importingLabel}}</el-button>
      </span>
        </el-dialog>
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
            <el-button @click="dialogVisibleResct=false">取 消</el-button>
            <el-button type="primary" @click="setPassword">保 存</el-button>
      </span>
        </el-dialog>
        <!--付款支付-->
        <!-- 重置弹窗 -->
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
                        label="是否从零工收入中扣除："
                        class="formSearchMargin formSearchMarginTop"
                        style="margin-bottom:20px !important"
                >
                    <el-radio-group v-model="ifTalentPay">
                        <el-radio :label="0">是</el-radio>
                        <el-radio :label="1">否</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item
                        label="付款手续费："
                        class="formSearchMargin formSearchMarginTop"
                        style="margin-bottom:20px !important"
                >
                    <span>{{selectTotal}} * {{charge}} = ￥{{(selectTotal*charge).toFixed(2)}}</span>
                    <span class="pl20">(从网商银行余额扣除)</span>
                </el-form-item>
                <el-form-item
                        label="管理费余额："
                        class="formSearchMargin formSearchMarginTop"
                        style="margin-bottom:20px !important"
                >
                    <span>{{Number(accountMangerAmount).toFixed(2)}}</span>
                </el-form-item>
                <el-divider></el-divider>
                <el-form-item
                        label="实发收入："
                        class="formSearchMargin formSearchMarginTop"
                        style="margin-bottom:20px !important"
                >
                    <span v-if="ifTalentPay === 0">￥{{(Number(payAmount) - selectTotal*charge).toFixed(2)}}</span>
                    <span v-else>￥{{Number(payAmount).toFixed(2)}}</span>
                    <span class="pl20">(从易宝余额扣除)</span>
                </el-form-item>
                <el-form-item
                        label="易宝可用余额："
                        class="formSearchMargin formSearchMarginTop"
                        style="margin-bottom:20px !important"
                >
                    <span>￥{{Number(accountAmount).toFixed(2)}}</span>
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

        <!--<form id="confirmFormsh" name="confirmFormsh" :action="/obm/monitoring/monitoring" method="post" style="display:none">-->
        <!--<input type="text" id="postlid" name="lid" value=""   class="asselectinput"/>-->
        <!--<input type="text" id="posttab" name="tab" value=""   class="asselectinput"/>-->
        <!--<input type="text" id="postlname" name="lname" value=""   class="asselectinput"/>-->
        <!--</form>-->
    </div>
</template>
<script>
    import SearchBar from '@/components/SearchBar'
    import { mapState, mapGetters, mapActions, mapMutations } from 'vuex'
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
                ifTalentPay: 0,
                icon1: require('@/assets/icons/icon_1541.png'),
                icon2: require('@/assets/icons/icon_1542.png'),
                icon3: require('@/assets/icons/icon_1543.png'),
                total: 0,
                rewardTotal: 0,
                selectTotal: 0,
                currentPage: 1,
                pageCount: 0,
                pageSize: 20,
                batchNumber: '',
                tableData: [],
                isDisabled: true,
                importingLabel: '导 入',
                importing: false,
                uploadHeaders: {},
                dialogVisible: false,
                importVisible: false,
                secondDialogVisible: false,
                dialogVisibleImport: false,
                dialogVisibleResct: false,
                offlineShow: false,
                importUrl: "",
                fromParams: {},
                talentIdList:[],
                salaryIdList:[],
                fileName: '',
                loading: false,
                loadingText:'正在导出excel表...',
                importForm: {},
                importDetailErrorMsgList: [],
                importSummaryMsg: "",
                hasPassword: false,
                codeTxt: "发送验证码",
                codeTime: 60,
                isMobile: false,
                formPayMentResct: {
                    verificationCode: "",
                    passwd: "",
                    confimPasswd: ""
                },
                searchForm: {
                    taskName: '',
                },
                payAmount: 0,
                accountAmount: 0,
                accountMangerAmount: 0,
                totalMount: {},
                payVisible: false,
                formPay: {
                    passwd: '',
                },
                fileList: [],
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
                userMobile: '',
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
                noSelectList: [],
                noSelectList2: [],
                //3.04
                xfdTrue: false, //是否开通了薪福多
                xfdPayOrder: false, //是否开通了薪福多\
                isXfdOrder:false, //是否有未支付订单
                isTimelyRainOrder:false, //是否有未支付订单
                userInfo: {},
                ifHavePayOwn:JSON.parse(localStorage.getItem('userInfo')).ifHavePayOwn ? JSON.parse(localStorage.getItem('userInfo')).ifHavePayOwn : 0,//1.及时雨  2.2
            }
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
            this.userInfo = JSON.parse(localStorage.userInfo) || {};
            console.log(this.fromParams);
            if(this.ifHavePayOwn == 1){
                this.queryTimelyRainWaitOrder();
            }else{
                this.queryWaitOrder();
            }
            this.accountDetail()
            this.paytime();
            this.detail()
            this.importUrl = this.$importBaseURL + 'adjustment/importSalaryAdjustment'
        },
        methods: {
            ...mapMutations(['XFD_PARAMS','RAIN_PARAMS']),
            reset() {

            },
            lockBatch(status){
                let ids = [];
                for(let item of this.tableData){
                    if(!item.ifCanPay && item.totalAmount > 0){
                        ids.push(item.talentId)
                    }
                }
                let text;
                if(status == 1){
                    text = '锁定';
                }else{
                    text = '解锁';
                }
                let params = {
                    status:status,  //1.锁定 2.不锁定,
                    customerId:this.tableData[0].customerId,// 经理人id,
                    outsourcingCusId:'', //外包商id，不必传,
                    batchNumber:this.tableData[0].batchNumber,// "批次",
                    talentIdList:ids, //普工id集合数组
                }
                this.$confirm(`批次中不能选中的零工无法操作奖惩${text}`, `确定对该批次所有零工奖惩全部${text}？`, {
                    confirmButtonText: '确认',
                    cancelButtonText: '取消',
                    center:true,
                }).then(async (action) => {
                    let { data } = await this.$api.lockToggle(params);
                    if(data.respCode === 0){
                        if(status == 2){//表示锁定了
                            this.$message.success('全部解锁成功!')
                        }else{
                            this.$message.success('全部锁定成功!')
                        }
                        this.detail()
                    }
                }).catch(() => {

                });
            },
            swtichlock(row){
                console.log(row.isRPLock)
                let params = {
                    status: '',  //1.锁定 2.不锁定,
                    customerId:row.customerId,// 经理人id,
                    outsourcingCusId:'', //外包商id，不必传,
                    batchNumber:row.batchNumber,// "批次",
                    talentIdList:[row.talentId], //普工id集合数组
                }
                let text,textTwo;
                if(row.isRPLock){//表示锁定了
                    row.isRPLock = false;
                    params['status'] = '1'
                    text = '开启';
                    textTwo = '该零工该批次收入无法添加奖惩'
                }else{
                    row.isRPLock = true;
                    params['status'] = '2'
                    text = '关闭';
                    textTwo = '该零工该批次收入可以添加奖惩'
                }
                this.$confirm(`${text}锁定奖惩后，${textTwo}`, `确定对该批次中该零工${text}奖惩锁定？`, {confirmButtonText: '确认',
                    cancelButtonText: '取消',
                    center:true,
                }).then(async (action) => {
                    let { data } = await this.$api.lockToggle(params);
                    if(data.respCode === 0){
                        if(row.isRPLock){//表示锁定了
                            row.isRPLock = false;
                            this.$message.success('解锁成功!')
                        }else{
                            row.isRPLock = true;
                            this.$message.success('锁定成功!')
                        }
                    }
                }).catch(() => {

                })
            },
            searchNow(val) {
                this.searchForm.taskName = val;
                this.currentPage = 1;
                this.detail()
            },
            go() {
                const {href} = this.$router.resolve({
                    path: 'rewardsBatches',
                    query: {
                        title: '代发收入',
                        batchNumber: this.fromParams.batchNumber,
                        payType: this.fromParams.payType,
                    }
                })
                window.open(href, '_blank')
            },
            handleSelectionChange(val) {
                this.payAmount = 0;
                this.talentIdList = [];
                this.salaryIdList = [];
                console.log(val)
                if (val.length > 0) {
                    if(val.length >= 1000){val.length = 1000}
                    this.selectTotal = val.length;
                    for (let temp of val) {
                        this.payAmount += temp.totalAmount;
                        this.talentIdList.push(temp.talentId)
                        this.salaryIdList.push(temp.id)
                    }
                    this.isDisabled = false;
                } else {
                    this.selectTotal = 0;
                    this.isDisabled = true;
                }
            },
            accountDetail() {
                let _this = this;
                this.$api.accountDetail({}).then(res => {
                    console.log(res);
                    _this.hasPassword = res.data.data.hasPassword;
                    _this.accountAmount = res.data.data.balance + res.data.data.freezingAmount
                    _this.charge= res.data.data.payFee || 0
                    _this.accountMangerAmount = res.data.data.wsBalance || 0
                }).catch(err => {
                    console.log(err);
                })
            },
            badDebt(row){
                let _this = this;
                let params = {
                    deadline:this.payTime,
                    talentId:row.talentId,
                    batchNumber:row.batchNumber,
                    payType:row.payType,
                    showOutsourcing:false,
                };
                _this.$confirm(`确认要将 ${row.realNameAlias} 处理成坏账吗？`, `提示`, {
                    confirmButtonText: '确认',
                    cancelButtonText: '暂不处理',
                }).then(async (action) => {
                    let { data } = await this.$api.processBadDebt(params);
                    if(data.respCode === 0){
                        this.$message.success('坏账处理成功!')
                        _this.detail();
                    }
                }).catch(() => {

                });
            },
            detail() {
                let _this = this;
                _this.loading = true;
                _this.loadingText = '正在计算中...'
                let params = {
                    userName: _this.searchForm.taskName,
                    batchNumber: _this.fromParams.batchNumber,//开始时间
                    settlementType: _this.fromParams.settlementType,//结算方式 (1日结2月结4周结)
                    payStatus: '1',//结算状态 (1未结算2已结算默认未结算)
                    payType: _this.fromParams.payType,	//费用类型
                };
                _this.$api.payDetail(params).then(res => {
                    if (res.respCode === 0) {
                        _this.tableData = []
                        if (res.data.page.list && res.data.page.list.length > 0) {
                            let result = Array.from(res.data.page.list);
                            // for(let item of result){
                            //     if(!item.salary && !item.punish && !item.reward && !item.totalAmount && !item.otherAmount && !item.shouldSalary){
                            //         //如果都显示0说明薪福多生成订单了，暂不显示
                            //     }else{
                            //         _this.tableData.push(item)
                            //     }
                            // }
                            _this.tableData = result;
                            _this.total = res.data.page.total;
                            _this.noSelectList = _this.tableData.map((i) => i.ifCanPay); //判断是否全部都是不可付
                            // _this.noSelectList2 = _this.tableData.map((i) => i.ifHasCard); //判断是否全部都是没有银行卡不可付  暂时不上
                            _this.pageCount = res.data.page.pages;
                            _this.totalMount = res.data.total;
                            _this.rewardTotal = res.data.reward || 0;
                        } else {
                            _this.tableData = [];
                            _this.total = 0;
                            _this.pageCount = 0;
                            _this.totalMount = {};
                            _this.rewardTotal = 0;
                            _this.noSelectList = [];
                            // _this.noSelectList2 = [];  暂时不上
                        }
                        console.log(res);
                    }
                }).catch(err => {
                    console.log(err)
                }).finally(()=>{
                    _this.loading = false;
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
            handleCurrentChange(val) {
                this.currentPage = val
                this.detail();
            },
            resetShow() {
                this.dialogVisibleResct = true
                this.payVisible = false;
            },
            paytime() {
                let _this = this;
                this.$api.getCurrentTime().then(res => {
                    console.log(res)
                    if (res.respCode == 0) {
                        _this.payTime = res.data  // 时间戳
                        console.log(_this.payTime);
                    }
                })
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
                    this.$api.getCurrentTime().then(res => {
                        console.log(res)
                        if (res.respCode == 0) {
                            _this.payTime = res.data  // 时间戳
                            console.log(_this.payTime);
                        }
                    })
                    // this.payTime = moment().format('YYYY-MM-DD HH:mm:ss');
                }
            },
            getRowClass({row, column, rowIndex, columnIndex}) {
                // || !this.noSelectList2.includes(true) 银行卡暂时不判断
                if (rowIndex === 0 && !this.noSelectList.includes(false)) {//如果全部都是待奖惩和全部都没有银行卡就不能全选
                    return 'add-no-select'
                }else {
                    return ''
                }
            },
            getRowClassName({row, column, rowIndex, columnIndex}) {
                //|| !row.ifHasCard 银行卡暂时不判断
                if (row.ifCanPay || row.totalAmount <= 0) {
                    return 'cg-disable-select'
                } else {
                    return ' '
                }
            },
            selectable(row, index) {
                //|| !row.ifHasCard 银行卡暂时不判断
                if (row.ifCanPay || row.totalAmount <= 0) {
                    return false;
                } else {
                    return true;//不可选中
                }
            },
            taskConfirms() {
                this.offlineShow = false;
                let params = {
                    payTotalMoney: this.payAmount,
                    batchNumber: this.fromParams.batchNumber,
                    payType: 2,
                    talentIdList: this.talentIdList,
                    salaryIdList: this.salaryIdList,
                    settlementType: this.fromParams.settlementType,
                    payTime: this.payTime,
                    outsourcingCusId:-1,
                };
                console.log("--")
                console.log(params)
                /*支付*/
                this.$api.payUnderLine(params)
                    .then(res => {
                        console.log(res)
                        if (res.data.respCode == 0) {
                            this.$message.success("支付成功！");
                            this.detail();
                            this.accountDetail()
                            this.dialogVisibleResct = false;
                        } else {
                            this.$message.success("支付失败！");
                        }
                    })
                    .catch(
                        err => {
                            this.$message.error(err);
                        }
                    )

            },
            second() {
                this.secondDialogVisible = false;
                this.importVisible = false;
            },
            offLine() {
                let _this = this;
                this.offlineShow = true;
            },
            xfdPay() {
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
                    if(_this.request){ return }
                    _this.request = true;
                    _this.$api.getCurrentTime().then(res => {
                        console.log(res)
                        if (res.respCode == 0) {
                            _this.payTime = res.data  // 时间戳
                            _this.xfdPayDetail();
                        }
                    })
                }
            },
            timelyRainPay(){
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
                    if(_this.request){ return }
                    _this.request = true;
                    _this.$api.getCurrentTime().then(res => {
                        console.log(res)
                        if (res.respCode == 0) {
                            _this.payTime = res.data  // 时间戳
                            _this.rainPayDetail();
                        }
                    })
                }
            },
            queryWaitOrder(){
                this.$api.xfdWaitingOrder({}).then(res=>{
                    if (res.respCode == 0) {
                        let {accountStatus, oldOrder, xfdPreQueryDetailVOS, xfdMoney, xfdPreQueryVO,financePhone} = res.data;
                        if (oldOrder == 1) { // 是否有订单（1是  其他否
                            this.isXfdOrder = true;
                        }
                    }
                }).catch(err=>{
                    console.log(err)
                }).finally(()=>{

                })
            },
            queryTimelyRainWaitOrder(){
                this.$api.timelyRainWaitingOrder().then(res=>{
                    if (res.respCode == 0) {
                        let {oldOrder} = res.data;
                        if (oldOrder == 1) { // 是否有订单（1是  其他否
                            this.isTimelyRainOrder = true;
                        }
                    }
                }).catch(err=>{
                    console.log(err)
                }).finally(()=>{

                })
            },
            toWait(){
                this.$router.push({
                    path: 'xfdOrder',
                    query: {isWait:true}
                });
            },
            toWaitRain(){
                this.$router.push({
                    path: 'timelyRainOrder',
                    query: {isWait:true}
                });
            },
            xfdPayDetail() {
                let _this = this;
                _this.loading = true
                _this.loadingText = '正在计算中...'
                let params = {
                    talentIdList: this.talentIdList,
                    payType: 2,
                    ifTalentPay:0,
                    outsourcingCusId:-1,
                    payLineWay:0,//支付方式0薪福多1薪企云服
                    xfdPayType:5,/*招行传 5，中信传 6*/
                    batchNumber: this.fromParams.batchNumber,
                    settlementType: this.fromParams.settlementType,
                    payTime: this.payTime
                }
                this.$api.xfdPerQuery(params).then(res => {
                    if (res.data.respCode == 0) {
                        let {accountStatus,oldOrder, allPayFee, xfdPreGenerateVOS, allShouldPay, payFee,serviceFee,talentPay,xfdMoney} = res.data.data;
                        _this.loading = false
                        if (accountStatus == 2 || accountStatus == 4) { //开户审核通过 0未开户1待审核2审核通过3审核未通过4开户成功5开户失败
                            if (oldOrder == 1) { // 是否有订单（1是  其他否
                                _this.$confirm(`您有薪福多订单已生成待付款, 请先处理该订单。`, `提示`, {
                                    confirmButtonText: '查看付款订单',
                                    cancelButtonText: '暂不处理',
                                }).then((action) => {
                                    _this.toWait()
                                }).catch(() => {

                                });
                            } else {
                                _this.XFD_PARAMS(params)
                                _this.$router.push({
                                    path: 'xfdBudget',
                                    query: {
                                        xfdMoney,
                                        allShouldPay,
                                        payFee,
                                        serviceFee,
                                        talentPay,
                                        allPayFee,
                                        xfdPreGenerateVOS: JSON.stringify(xfdPreGenerateVOS),
                                    }
                                });
                            }
                        } else {
                            _this.$confirm(`您还未开通薪福多账户, 无法使用薪福多付款。`, `提示`, {
                                confirmButtonText: '我要开户',
                                cancelButtonText: '暂不需要',
                            }).then((action) => {
                                this.$router.push({
                                    name: 'xfdList',
                                    query:{}
                                });
                            }).catch(() => {

                            });
                        }
                    }
                }).catch(err => {

                }).finally(()=>{
                    setTimeout(()=>{
                        _this.loading = false
                        _this.request = false;
                    },500)
                })
            },
            rainPayDetail() {
                let _this = this;
                _this.loading = true
                _this.loadingText = '正在计算中...'
                let params = {
                    talentIdList: this.talentIdList,
                    payType: 2,
                    ifTalentPay:0,
                    payLineWay:0,//支付方式0薪福多1薪企云服
                    batchNumber: this.fromParams.batchNumber,
                    settlementType: this.fromParams.settlementType,
                    payTime: this.payTime
                }
                this.$api.timelyRainPerQuery(params).then(res => {
                    if (res.data.respCode == 0) {
                        let {oldOrder, allPayFee, preGenerateVOS, allShouldPay, payFee,serviceFee,talentPay,balance} = res.data.data;
                        _this.loading = false
                            if (oldOrder == 1) { // 是否有订单（1是  其他否
                                _this.$confirm(`您有及时雨订单已生成待付款, 请先处理该订单。`, `提示`, {
                                    confirmButtonText: '查看付款订单',
                                    cancelButtonText: '暂不处理',
                                }).then((action) => {
                                    _this.toWaitRain()
                                }).catch(() => {

                                });
                            } else {
                                _this.RAIN_PARAMS(params)
                                _this.$router.push({
                                    path: 'timelyRainBudget',
                                    query: {
                                        balance,
                                        allShouldPay,
                                        payFee,
                                        serviceFee,
                                        talentPay,
                                        allPayFee,
                                        preGenerateVOS: JSON.stringify(preGenerateVOS),
                                    }
                                });
                            }
                    }
                }).catch(err => {

                }).finally(()=>{
                    setTimeout(()=>{
                        _this.loading = false
                        _this.request = false;
                    },500)
                })
            },
            exportAction() {
                let _this = this;
                let params = {
                    userName: _this.searchForm.taskName,
                    batchNumber: _this.fromParams.batchNumber,//开始时间
                    settlementType: _this.fromParams.settlementType,//结算方式 (1日结2月结4周结)
                    payStatus: '1',//结算状态 (1未结算2已结算默认未结算)
                    payType: _this.fromParams.payType,	//费用类型
                };
                _this.loading = true
                _this.loadingText = '正在导出excel表...'
                console.log("-")
                console.log(params)
                this.$api.exportSalary(params).then(res => {
                    if (res.respCode == 0) {
                        setTimeout(() => {
                            _this.loading = false
                        }, 2000)
                        if (res.data) {
                            window.open(res.data)
                        }
                    }
                }).catch()
            },
            exportActionTwo() { //导出扣款项
                let _this = this;
                console.log(_this.fromParams)
                let param = {
                    userName: _this.searchForm.taskName,
                    batchNumber: _this.fromParams.batchNumber,//开始pici
                    settlementType: _this.fromParams.settlementType,//结算方式 (1日结2月结4周结)
                    payStatus: '1',//结算状态 (1未结算2已结算默认未结算)
                    payType: _this.fromParams.payType,	//费用类型
                    customerId: _this.fromParams.customerId,
                    showOutsourcing:false,
                };
                _this.loading = true
                _this.loadingText = '正在导出excel表...'
                let url = this.$importBaseURL + `salary/customer/settlement/adjust/export?userName=${param.userName}&payType=${param.payType}&batchNumber=${param.batchNumber}&settlementType=${param.settlementType}&payStatus=${param.payStatus}&customerId=${param.customerId}&showOutsourcing=${param.showOutsourcing}`;
                window.open(url)
                setTimeout(() => {
                    _this.loading = false
                }, 1500)
                // console.log("-")
                // this.$api.exportAdjust(param).then(res => {
                //     console.log(res)
                //     if (res.respCode == 0) {
                //         if (res.data) {
                //             window.location.href = (res.data)
                //         }
                //     }
                // }).catch().finally(()=>{
                //     setTimeout(() => {
                //         _this.loading = false
                //     }, 2000)
                // })
            },
            importAction() {
                this.importVisible = true;
                this.batchNumber = this.fromParams.batchNumber;
                let token = JSON.parse(localStorage.getItem('token'))
                this.uploadHeaders = {
                    Authorization: `Bearer ${token.val}`
                }
            },
            popInfo() {
                this.dialogVisible = true;
            },
            emptyData() {
                this.dialogVisible = false;
                this.importVisible = false;
                this.dialogVisibleImport = false;
                this.offlineShow = false;
                this.secondDialogVisible = false;
            },
            importFileActionSkip() {
                this.importVisible = false;
                this.secondDialogVisible = true;
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
                        // console.log(res)
                        if (res.data.respCode == 0) {
                            if (this.titles == '重置支付密码') {
                                this.$message.success("支付密码重置成功！");
                            } else if (this.titles == '设置密码') {
                                this.$message.success("密码设置成功！");
                            }
                            this.dialogVisibleResct = false;
                            this.detail();
                            this.accountDetail()
                        }
                    }).catch(err => {
                    //this.$message.error(err);
                });
            },
            payInline() {
                let pattern = /^[0-9]*$/;
                if (!this.formPay.passwd) {
                    return this.$message.error("支付密码不能为空！");
                }
                if (!pattern.test(this.formPay.passwd) || this.formPay.passwd.length != 6) {
                    return this.$message.error("支付密码为6位数字！");
                }
                // if (Number(this.payAmount) < 1) {
                //     return this.$message.error("发放金额少于平台手续费1元, 发放失败！");
                // }
                if(this.ifTalentPay === 0){
                    if((this.selectTotal * this.charge) > this.accountMangerAmount){
                        return this.$message.error('你的管理费余额不足,请充值!')
                    }
                }
                if (this.accountAmount < this.payAmount) {
                    return this.$message.error("易宝余额不足，请充值！");
                }
                let params = {
                    passwd: this.formPay.passwd,
                    payTotalMoney: this.payAmount,
                    batchNumber: this.fromParams.batchNumber,
                    payType: 2,
                    talentIdList: this.talentIdList,
                    settlementType: this.fromParams.settlementType,
                    salaryIdList: this.salaryIdList,
                    ifTalentPay: this.ifTalentPay,
                    payTime: this.payTime
                };
                /*支付*/
                this.$api.payInLine(params)
                    .then(res => {
                        console.log(res)
                        if (res.data.respCode == 0) {
                            this.$message.success("支付成功！");
                            this.detail();
                            this.accountDetail();
                            this.payVisible = false;
                            this.dialogVisibleResct = false;
                        } else {
                            if (res.data.errorCode !== 140003) {
                                this.$message.error(res.data.errorMsg);
                            }
                        }
                    })
                    .catch(
                        err => {
                            //this.$message.error(err);
                        }
                    )
            },
            downloadMobel() {
                let params = {type: 'web'} //独家参数。告诉后台我要中文名字的
                this.$api.importTemplate(params)
                    .then(res => {
                        window.open(res.data)
                    }).catch(
                    error => {
                        this.$message.error(error);
                    }
                )
            },
            submitUpload() {
                let list = document.getElementsByClassName("el-upload-list__item");
                console.log(list)
                if (list.length == 0) {
                    this.$message.warning('导入的模板不能为空！')
                    return;
                }
                this.$refs.upload.submit();
            },
            handleRemove(file, fileList) {
                console.log(file, fileList);
            },
            handlePreview(file) {
                console.log(file);
            },
            handleExceed(files, fileList) {
                this.$message.warning(`请删除当前文件再重新上传！`);
            },
            beforeAvatarUpload(file) {
                var fileName = new Array()
                fileName = file.name.split('.');
                const extension = fileName[fileName.length - 1] === 'xls'
                const extension2 = fileName[fileName.length - 1] === 'xlsx'
                if (!extension && !extension2) {
                    return this.$message.error('请上传excel文件');
                } else {
                    this.importingLabel = '导入中'
                    this.importing = true
                }
                return (extension || extension2)
            },
            handleAvatarScucess(response, file) {
                this.importingLabel = '导入'
                this.importing = false
                if (response.respCode == 0) {
                    this.secondDialogVisible = true;
                    this.importDetailErrorMsgList = response.data.importDetailErrorMsgList;
                    this.importSummaryMsg = response.data.importSummaryMsg;
                    this.detail();
                } else {
                    this.$message.error(response.errorMsg)
                }
            },
            goToHandlerDetails(row) {
                let query = Object.assign(row, {payStatus: '1'})
                const {href} = this.$router.resolve({
                    path: '/payable/handlerDetails',
                    query: query
                });
                window.open(href, '_blank')
            },
            goToReward(row) {
                let query = Object.assign(row, {payStatus: '1'})
                const {href} = this.$router.resolve({
                    path: '/payable/rewardDetails',
                    query: query
                });
                window.open(href, '_blank')
            },
            goToDeductions(row) {
                let query = Object.assign(row, {payStatus: '1'})
                const {href} = this.$router.resolve({
                    path: '/payable/deductionsDetails',
                    query: query
                });
                window.open(href, '_blank')
            },
        },
    }
</script>
<style lang="scss">
    .co-orange {
        cursor: pointer;
    }

    .waitPamentReplaceContainer {
        .add-no-select {
            cursor: not-allowed;
            pointer-events: none;

            .cell .el-checkbox .el-checkbox__inner {
                background-color: #edf2fc;
            }
        }
        .lock-right{
            position: relative;
            z-index: 1;
            float: right;
            padding: 18px 24px;
            margin-top: -80px;
            display: flex;
            justify-content: flex-end;
            align-items: center;
        }
        .el-table th div{
            display: flex;
            align-items: center;
            justify-content: center;
            flex-direction: column;
        }
        .cg-disable-select {
            color: #C8CACC;
            .lock-box{
                 position: relative;
                 .lock-mask{
                     position: absolute;
                     left: 0;
                     right: 0;
                     top: 0;
                     bottom: 0;
                     opacity: 0;
                 }
                 .el-switch__label *{
                     display:none;
                 }
             }
            .el-switch__core{
                background-color:#fff !important;
                border-color:#eee !important;
            }
            .el-switch__core:after{
                top: 0;
                left: 0;
                border:1px solid #eee;
            }
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
                margin:0 2px 0 -1px;
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
            height: 55px;
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
        .el-table .is-left .cell{
            text-align: left;
        }
        .el-table .has-gutter .is-left .cell{
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
