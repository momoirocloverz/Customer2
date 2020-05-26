<template>
  <div style="background-color:#f2f2f5;" v-loading="loading" element-loading-text="正在导出excel表...">
    <h3 class="sche-title">{{taskName}}</h3>
    <el-form ref="formDetail" :model="formDetail" label-width="100px" labelPosition="left" style="background-color:white;padding-left:20px;">
      <el-form-item label="付款状态：" class="formSearchMargin">
        <el-radio-group class="radio-search" v-model="formDetail.payStatus">
          <el-radio label="">不限</el-radio>
          <el-radio label="1">待付</el-radio>
          <el-radio label="2">已付</el-radio>
        </el-radio-group>
      </el-form-item>
    </el-form>

    <div style="background-color:white;border:1px solid #E6E7EB;margin-top:18px;">
      <div style="padding-left:24px;border-bottom: 1px solid #E6E7EB;height:50px;line-height:50px;font-size:12px;">
        合计<span class="fontsizecolor">&nbsp;{{moneyTask.totalWorkHours || 0}}&nbsp;</span>小时，
        <span class="fontsizecolor">&nbsp;{{moneyTask.totalJian || 0}}&nbsp;</span>件，
        <span class="fontsizecolor">&nbsp;{{moneyTask.totalDai || 0}}&nbsp;</span>袋，
        <span class="fontsizecolor">&nbsp;{{moneyTask.totalChe || 0}}&nbsp;</span>车，
        <span class="fontsizecolor">&nbsp;{{moneyTask.totalDun || 0}}&nbsp;</span>吨，
        待付金额<span class="fontsizecolor">&nbsp;{{moneyTask.totalUnPayAmount || 0}}&nbsp;</span>元，
        已付金额<span class="fontsizecolor">&nbsp;{{moneyTask.totalPayAmount || 0}}&nbsp;</span>元，
        合计金额<span class="fontsizecolor">&nbsp;{{moneyTask.totalAmount || 0}}&nbsp;</span>元
      </div>
      <div>
        <el-button class="myplain-btn" size="small" style="margin:6px 0 6px 24px;width:98px;" :disabled="isDisabled" @click="exportExcel">导出</el-button>
        <el-button class="myplain-btn" size="small" style="margin:6px 0 6px 36px;width:98px;" :disabled="payVal.length == 0" @click="batchPay">批量付款</el-button>
      </div>
    </div>
    <div class="table-box back-white" style="margin-top:15px;">
      <!-- @selection-change="handleSelectionChange" -->
      <el-table class="table-outline" :data="tableData" emptyText="暂无相关明细" style="width: 100%;" @selection-change="handleSelectionChange">
        <el-table-column type="selection" :selectable="selectableChecked" width="50"></el-table-column>
        <el-table-column label="排班日期" prop="batchNumberDate" align="center" min-width="60"></el-table-column>
        <el-table-column label="项目经理" prop="managerName" align="center" min-width="60"></el-table-column>
        <el-table-column label="工时" prop="workHours" align="center" min-width="60"></el-table-column>
        <el-table-column label="产量" prop="pieceSize" align="center" min-width="60">
          <template v-slot="scope">
            <span>
              {{scope.row.pieceSize ? JSON.parse(scope.row.pieceSize).che + '车，' : 0}}
              {{scope.row.pieceSize ? JSON.parse(scope.row.pieceSize).dai + '袋，' : 0}}
              {{scope.row.pieceSize ? JSON.parse(scope.row.pieceSize).dun + '吨，' : 0}}
              {{scope.row.pieceSize ? JSON.parse(scope.row.pieceSize).jian + '件' : 0}}
            </span>
          </template>
        </el-table-column>
        <el-table-column label="单价" prop="taskSalaryStr" align="center" min-width="60"></el-table-column>
        <el-table-column label="金额(元)" prop="salary" align="center" min-width="60"></el-table-column>
        <el-table-column label="付款状态" prop="payStatus" align="center" min-width="60" :formatter="payStatusFormatter"></el-table-column>
        <el-table-column label="付款日期" prop="payDate" :formatter="payDate" align="center" min-width="60"></el-table-column>
        <el-table-column label="操作" align="center" min-width="60">
          <template v-slot="scope">
            <el-button size="small" type="text" @click="checkPDF(scope.row)">查看</el-button>
            <el-button size="small" type="text" v-if="scope.row.payStatus == 1" @click="payMent(scope.row)">付款</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination-container">
        <el-pagination class="pagebox" layout="prev, pager, next" @current-change="handleCurrentChange" :current-page="currentPage" :page-count="pageCount">
        </el-pagination>
      </div>
    </div>
    <!-- --------------------------------------------------------------------弹窗部分----------------------------------------------------------------------- -->
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
          >{{codeTxt}}</el-button>
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
import Interval from '../../../../common/interval.js'
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
      dialogVisible: false,
      dialogVisibleResct: false,
      dialogVisiblePay: false,
      dialogVisibleBalance: false,
      userMobile: "",
      paySalary: 0,
      accountBalance: 0,
      codeTxt: "发送验证码",
      codeTime: 60,
      formPayMent: {
        passwd: ""
      },
      formPayMentResct: {
        verificationCode: "",
        passwd: "",
        confimPasswd: ""
      },
      payVal: [],
      loading: false,
      isDisabled: false,
      currentPage: 1,
      pageCount: 0,
      pageSize: 20,
      formDetail: {
        payStatus: ''
      },
      tableData: [],
      taskName: '',
      taskId: '',
      startDate: '',
      endDate: '',
      moneyTask: {},
      rules: {
        passwd: [
          { validator: validatePass, trigger: "blur" },
          { required: true, message: "支付密码不能为空", trigger: "blur" },
          { min: 6, max: 6, message: "支付密码为6位数字", trigger: "blur" },
          {
            pattern: /^[0-9]*$/,
            message: "请填写正确的6位数字密码"
          }
        ],
        confimPasswd: [
            { validator: validatePass2, trigger: "blur" },
          { required: true, message: "支付密码不能为空", trigger: "blur" },
          { min: 6, max: 6, message: "支付密码为6位数字", trigger: "blur" },
            {
            pattern: /^[0-9]*$/,
            message: "请填写正确的6位数字密码"
          }
          ],
        verificationCode: [
          { required: true, message: "验证码不能为空", trigger: "blur" },
          {
            pattern: /^[0-9]*$/,
            message: "请填写正确的验证码"
          }
        ]
      },
    }
  },
  watch: {
    'formDetail.payStatus': function (val, old) {
      this.currentPage = 1
      this.getList()
      this.getNewSumData()
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
    checkPDF(row) {
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
        })
        .catch();
    },
    goToSetting() {
      this.dialogVisiblePay = false;
      this.dialogVisibleResct = true;
      this.titles = "设置密码";
    },
    goToTopUp(){
      const {href} = this.$router.resolve({
        name: 'accountList'
      })
      window.open(href,'_blank')
    },
    resetPassword() {
      this.dialogVisible = false;
      this.dialogVisibleResct = true;
      this.titles = "重置支付密码";
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
    payMoney() {
      if(this.formPayMent.passwd == ''){
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
      // console.log(params)cusBatchPay
      this.$api
        .cusBatchPay(params)
        .then(res => {
          // console.log(res)
          if (res.data.respCode == 0) {
            this.$message.success("支付成功！");
            this.getList()
            this.dialogVisible = false;
          }else if(res.data.errorCode == 110004){
            this.getList()
            this.dialogVisible = false;
            console.log(res.data.errorMsg)
          }
        })
        .catch();
    },
    balancePayMoney() {
      if(this.formPayMent.passwd == ''){
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
          }else if(res.data.errorCode == 110005){
            this.getList()
            this.dialogVisible = false;
            console.log(res.data.errorMsg)
          }
        })
        .catch();
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
        .catch();
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
        .catch();
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
            if(this.titles == '重置支付密码'){
               this.$message.success("支付密码重置成功！");
            }else if(this.titles == '设置密码'){
               this.$message.success("密码设置成功！");
            }
            this.dialogVisibleResct = false;
            this.dialogVisible = true;
          }
        })
        .catch();
    },
    getList() {
      const params = {
        pageNum: this.currentPage,
        pageSize: this.pageSize,
        payStatus: this.formDetail.payStatus,
        startDate: this.startDate,
        endDate: this.endDate,
        // taskManagerId: this.formDetail.taskManagerId,
        taskId: this.taskId
      }
      this.$api.NewNeedPayList(params).then((res) => {
        console.log(res)
        if (res.data.respCode == 0) {
          const {
            data: {
              list,
              pages,
              pageNum
            },
          } = res.data;
          console.log(list)
          this.tableData = list
          this.pageCount = pages
        }

      }).catch((error) => {
        console.log(error);
      });
    },
    handleCurrentChange(val) {
      // console.log(val)
      this.currentPage = val
      this.getList()
    },
    getNewSumData() {
      const params = {
        pageNum: this.currentPage,
        pageSize: this.pageSize,
        payStatus: this.formDetail.payStatus,
        startDate: this.startDate,
        endDate: this.endDate,
        // taskManagerId: this.formDetail.taskManagerId,
        taskId: this.taskId
      }
      // this.taskList = []
      console.log(params)
      this.$api.NewSumData(params).then(res => {
        console.log(res)
        if (res.data.respCode == 0) {
          if (res.data.data) {
            this.isDisabled = false
            this.moneyTask = res.data.data
            // if (this.moneyTask.totalWorkHours) {
            //   this.isDisabled = false
            // } else {
            //   this.isDisabled = true
            // }
          } else {
            this.moneyTask = {}
            this.isDisabled = true
          }
        }
      }).catch()
    },
    exportExcel() {
      let params = {
        pageNum: this.currentPage,
        pageSize: this.pageSize,
        payStatus: this.formDetail.payStatus,
        startDate: this.startDate,
        endDate: this.endDate,
        // taskManagerId: this.formDetail.taskManagerId,
        taskId: this.taskId
      }
      this.$api.NewDetailListExport(params)
        .then(res => {
          // console.log(res)
          if (res.data.respCode == 0) {
            this.loading = true
            setTimeout(() => {
              this.loading = false
            }, 2000)
            if (res.data.data) {
              window.open(res.data.data)
            }
          }else if(res.data.respCode == -1){
            this.loading = false
          }
        }).catch()
    },
    selectableChecked(row, index) {
      if (row.payStatus == 2) {
        return false
      } else if (row.payStatus == 1) {
        return true
      }
    },
    payStatusFormatter(row, column, cellValue) {
      if (cellValue == 1) {
        return '待付'
      } else if (cellValue == 2) {
        return '已付'
      } else {
        return '无'
      }
    },
    payDate(row, column, cellValue){
      if(cellValue){
        return cellValue
      }else{
        return '无'
      }
    }
  },
  mounted() {
    this.taskName = this.$route.query.taskName
    this.taskId = this.$route.query.taskId
    this.startDate = this.$route.query.startDate,
      this.endDate = this.$route.query.endDate
    this.getList()
    this.getNewSumData()
    console.log(this.taskId)
    console.log(this.taskName)
    console.log(this.startDate)
    console.log(this.endDate)
  }
}
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
.sche-title {
  text-align: center;
  font-size: 20px;
  font-stretch: normal;
  line-height: 2;
  letter-spacing: 1px;
  color: #262626;
  padding-top: 20px;
  font-weight: bold;
}
.inputWidth {
  width: 430px;
  margin-right: 15px;
}
.fontsizecolor {
  color: #e84518;
}
.formSearchMargin {
  margin-bottom: 0;
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


