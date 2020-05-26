<template>
  <div>
    <h1
      style="color:#383838;font-size:14px;font-style:MicrosoftYaHei;padding:20px 0 20px 30px;border-bottom:1px solid #EAEDF4;background: #ffffff;"
    >第二步，填写发票信息</h1>
    <div style="background:#fff;padding: 15px 0;" class="div">
      <el-form :model="formInfo" label-width="100px" labelPosition="center" ref="formInfo" :rules="formInfoRules">
        <el-form-item label="开票金额：" class="formSearchMargin">
          <span style="line-height:40px;">{{amount?amount.toFixed(2):0}}</span>
        </el-form-item>
        <el-form-item label="发票类型：" class="formSearchMargin">
          <el-radio-group v-model="formInfo.type" @change="handleSetType">
            <el-radio :label="1">增值税普通发票</el-radio>
            <el-radio :label="2">增值税专用发票</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="发票税点：" class="formSearchMargin" prop="point">
          <el-select v-model="formInfo.point" @change="invoiceFeed">
            <el-option :label="`${item.invoiceName}（税点：${item.invoiceTax}%）`" :value="item.invoiceTax" v-for="(item,index) in invoiceNameList" :key="index"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="开票服务费：" class="formSearchMargin">
          <span style="line-height:40px;">{{`${amountFee}元`}}</span>
        </el-form-item>
        <el-form-item label="开票信息：" class="formSearchMargin top" prop="messageData" >
          <!--<span style="color:#383838;font-size:12px;line-height:40px;">{{messageData}}&nbsp;&nbsp;&nbsp;</span>
          <el-button class="el-btn new_btn" @click="addInfo" v-if="!showMessageChange">添加</el-button>
          <el-button class="el-btn new_btn" @click="replacePageInfo" v-if="showMessageChange">替换</el-button>-->
          <ChangeAndAdd :showChange="showMessageChange" v-model="formInfo.messageData" :add="addInfo" :change="replacePageInfo">
          </ChangeAndAdd>
        </el-form-item>
        <el-form-item label="收票地址：" class="formSearchMargin top" prop="addressData">
          <!--<span style="color:#383838;font-size:12px;line-height:40px;">{{formInfo.addressData}}&nbsp;&nbsp;&nbsp;</span>
          <el-button class="el-btn new_btn" @click="addAddress" v-if="!showAddressChange">添加</el-button>
          <el-button class="el-btn new_btn" @click="replacePageAddress" v-if="showAddressChange">替换</el-button>-->
          <ChangeAndAdd :showChange="showAddressChange" v-model="formInfo.addressData" :add="addAddress" :change="replacePageAddress">
          </ChangeAndAdd>
        </el-form-item>
      </el-form>
    </div>
    <h1
      style="color:#383838;font-size:14px;padding:20px 20px 20px 30px;border-bottom:1px solid #EAEDF4;border-top:1px solid #EAEDF4;background: #ffffff;text-align: right;"
    >
      <el-button size="medium" style="font-size:12px;" @click="cancelPrev">取消</el-button>
      <el-button size="medium" type="primary" style="font-size:12px;" @click="btn_submit">提 交</el-button>
    </h1>
    <!-- 窗窗(开票信息) -->
    <el-dialog
      title="添加开票信息"
      :visible.sync="dialogVisible"
      v-if="dialogVisible"
      width="640px"
      class="dialog"
    >
      <el-form :model="form" label-width="150px" labelPosition="center" :rules="rules">
        <el-form-item label="公司全称：" prop="companyFull" class="formSearchMargin">
          <el-input v-model="form.companyFull" placeholder="请输入公司全称"></el-input>
        </el-form-item>
        <el-form-item label="统一社会信用代码：" prop="unifyCode" class="formSearchMargin">
          <el-input v-model="form.unifyCode" placeholder="请输入统一社会信用代码"></el-input>
        </el-form-item>
        <el-form-item label="注册地址：" prop="registerAddress" class="formSearchMargin">
          <el-input v-model="form.registerAddress" placeholder="请输入注册地址"></el-input>
        </el-form-item>
        <el-form-item label="注册电话：" prop="registerPhone" class="formSearchMargin">
          <el-input v-model="form.registerPhone" placeholder="请输入注册电话"></el-input>
        </el-form-item>
        <el-form-item label="开户银行：" prop="openBank" class="formSearchMargin">
          <el-input v-model="form.openBank" placeholder="请输入开户银行"></el-input>
        </el-form-item>
        <el-form-item label="银行账号：" prop="bankAccount" class="formSearchMargin">
          <el-input v-model="form.bankAccount" placeholder="请输入银行账号"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitMessage">确 认</el-button>
      </span>
    </el-dialog>
    <!-- 窗窗(收票地址) -->
    <el-dialog
      title="添加收票地址"
      :visible.sync="dialogVisibleAddress"
      v-if="dialogVisibleAddress"
      width="640px"
      class="dialog"
    >
      <el-form :model="formAddress" label-width="150px" labelPosition="center" :rules="rules">
        <el-form-item label="收货人：" prop="consignee" class="formSearchMargin">
          <el-input v-model="formAddress.consignee" placeholder="请输入收货人"></el-input>
        </el-form-item>
        <el-form-item label="手机号码：" prop="phoneCode" class="formSearchMargin">
          <el-input v-model="formAddress.phoneCode" placeholder="请输入手机号码"></el-input>
        </el-form-item>
        <el-form-item label="收货地址：" prop="address" class="formSearchMargin">
          <el-input
            type="textarea"
            v-model="formAddress.address"
            placeholder="请输入收货地址"
            :maxlength="120"
          ></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitAddress">确 认</el-button>
      </span>
    </el-dialog>
    <!-- 窗窗(支付) -->
    <el-dialog
      title="支付开票服务费"
      :visible.sync="dialogVisiblePay"
      v-if="dialogVisiblePay"
      width="640px"
      class="dialog"
    >
      <el-form :model="formPay" label-width="150px" labelPosition="center" :rules="rules">
        <el-form-item label="可用余额：" class="formSearchMargin">
          <span>￥{{accountBalance?accountBalance.toFixed(2):0}}元</span>
        </el-form-item>
        <el-form-item label="支付金额：" class="formSearchMargin">
          <span>￥{{amountFee}}元</span>
        </el-form-item>
        <el-form-item label="支付密码：" prop="password" class="formSearchMargin">
          <el-input type="password" v-model="formPay.password" placeholder="请输入支付密码"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="payMoney">支 付</el-button>
        <el-button @click="dialogVisiblePay = false">取 消</el-button>
      </span>
    </el-dialog>
    <!-- 窗窗(支付密码错误) -->
    <el-dialog
      title
      :visible.sync="dialogVisiblePayFalse"
      v-if="dialogVisiblePayFalse"
      width="540px"
      class="dialog"
    >
      <span>支付密码错误，请重试</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="forgetPassword">忘记密码</el-button>
        <el-button type="primary" @click="retry">重 试</el-button>
      </span>
    </el-dialog>
    <!-- 重置弹窗 -->
    <el-dialog
      title="重置密码"
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
        <el-button type="primary" @click="truePassword">确 认</el-button>
        <el-button>取 消</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import ChangeAndAdd from './changeAndAdd';
export default {
  components:{
    ChangeAndAdd
  },
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
      rules: {
        companyFull: [
          { required: true, message: "公司全称不能为空", trigger: "blur" }
        ],
        unifyCode: [
          {
            required: true,
            message: "统一社会信用代码不能为空",
            trigger: "blur"
          },
          { max: 128, message: '长度不超过128字', trigger: 'blur' },
          { pattern: /^[a-zA-Z0-9]*$/, message: '统一社会信用代码为数字或字母' },
        ],
        registerAddress: [
          { required: true, message: "注册地址不能为空", trigger: "blur" }
        ],
        registerPhone: [
          { required: true, message: "注册电话不能为空", trigger: "blur" },
          {
            pattern:/^((0\d{2,3}-\d{7,8})|(1[3584]\d{9}))$/,
            message: "请输入正确电话格式",
            trigger: "blur"
          }
        ],
        openBank: [
          { required: true, message: "开户银行不能为空", trigger: "blur" }
        ],
        bankAccount: [
          { required: true, message: "银行账号不能为空", trigger: "blur" },
          {
            pattern: /^([0-9]{1})(\d{14}|\d{15}|\d{16}|\d{17}|\d{18}|\d{19}|)$/,
            message: "请正确输入银行账号",
            trigger: "blur"
          }
        ],
        consignee: [
          { required: true, message: "收货人不能为空", trigger: "blur" }
        ],
        phoneCode: [
          { required: true, message: "手机号码不能为空", trigger: "blur" },
          {
            pattern: /^1[3456789]\d{9}$/,
            message: "请输入正确电话格式",
            trigger: "blur"
          }
        ],
        address: [
          { required: true, message: "收货地址不能为空", trigger: "blur" }
        ],
        password: [
          { required: true, message: "支付密码不能为空", trigger: "blur" },
          {
            pattern: /^[1-9][0-9]*$/,
            message: "支付密码只能是数字",
            trigger: "blur"
          }
        ],
        passwd: [
          { validator: validatePass, trigger: "blur" },
          { required: true, message: "支付密码不能为空", trigger: "blur" },
          { min: 6, max: 6, message: "支付密码为6位数字", trigger: "blur" },
          {
            pattern: /^[0-9]*$/,
            message: "请填写正确的6位数字密码",
            trigger: "blur"
          }
        ],
        confimPasswd: [
            { validator: validatePass2, trigger: "blur" },
          { required: true, message: "支付密码不能为空", trigger: "blur" },
          { min: 6, max: 6, message: "支付密码为6位数字", trigger: "blur" },
            {
            pattern: /^[0-9]*$/,
            message: "请填写正确的6位数字密码",
            trigger: "blur"
          }
          ],
        verificationCode: [
          { required: true, message: "验证码不能为空", trigger: "blur" },
          {
            pattern: /^[0-9]*$/,
            message: "请填写正确的验证码",
            trigger: "blur"
          }
        ]
      },
      rulesAddress: {},
      dialogVisible: false,
      dialogVisibleAddress: false,
      dialogVisiblePay: false,
      dialogVisiblePayFalse: false,
      dialogVisibleResct: false,
      isMobile: false,
      codeTxt: "发送验证码",
      codeTime: 60,
      userMobile: "",
      formPayMentResct: {
          verificationCode: '',
          passwd: '',
          confimPasswd: ''
      },
      form: {
        companyFull: "",
        unifyCode: "",
        registerAddress: "",
        registerPhone: "",
        openBank: "",
        bankAccount: ""
      },
      formAddress: {
        consignee: "",
        phoneCode: "",
        address: ""
      },
      formInfo: {
        type: null,
        point: null,
        messageData:'',
        addressData:''
      },
      formInfoRules:{
        point:[{
              required: true,message: '发票税点不能为空', trigger: 'change'
          }],
          messageData:[{
              required: true,message: '开票信息不能为空', trigger: 'blur'

          }],
          addressData:[{
              required: true,message: '收票地址不能为空', trigger: 'blur'

          }]
      },
      formPay: {
        password: ""
      },
      addressRow: {},
      messageRow: {},
      id: '',
      customerName: '',
      customerNameCurrent: '',
      receiverNew: '',
      mobileNew: '',
      receiver: '',
      mobile: '',
      infoTableData: [],
      addressTableData: [],
      ids: '',
      accountRecordIdStrArr: [],
      amount: 0,
      billInfoId: '',
      addressId: '',
      accountBalance: 0, //可用余额
      userMobile: '',
      invoiceNameList: [],
      amountFee: 0,
      showMessageChange: false,
      messageData:'',
      showAddressChange: false,
      addressData:''
    };
  },
  computed: {
    // invoiceFee: function(){
    //   if(this.formInfo.point == '3'){
    //     return this.amount?(this.amount*0.03).toFixed(2):0
    //   }else if(this.formInfo.point == '6'){
    //     return this.amount?(this.amount*0.06).toFixed(2):0
    //   }
    // }
  },
  created(){
      // this.handleSetSaveMessage();
      this.getDataList()
      this.getDataList2()
    this.getinvoiceNameList()
    this.getDouble()
    const {count,recordId,invoiceType,point} = this.$store.state;
    this.amount = count;
    this.accountRecordIdStrArr = recordId;
    this.formInfo.type = invoiceType;
    this.formInfo.point = point;
    // this.addressId = addressId;
    // this.billInfoId = billInfoId;
    // if(this.$route.query.amount != undefined){
    //   localStorage.setItem('amount',this.$route.query.amount)
    // }
    // if(this.$route.query.accountRecordIdStr){
    //   localStorage.setItem('accountRecordIdStr',JSON.stringify(this.$route.query.accountRecordIdStr || []))
    // }
    // if(this.$route.query.accountRecordIdStr == undefined){
    //   this.accountRecordIdStrArr = JSON.parse(localStorage.getItem('accountRecordIdStr'))
    // }
    // this.amount = Number(localStorage.getItem('amount'))
    // this.accountRecordIdStrArr = JSON.parse(localStorage.getItem('accountRecordIdStr'))
    // if(this.$route.query.customerName!=undefined){
    //   sessionStorage.setItem('customerName', this.$route.query.customerName)
    // }
    // if(this.$route.query.customerName!=undefined){
    //   this.customerName = sessionStorage.getItem('customerName')
    // }else if(this.$route.query.customerName==undefined){
    //   this.customerName = localStorage.getItem('customerNameCurrent')
    // }
    // if(this.$route.query.receiver!=undefined){
    //   sessionStorage.setItem('receiver', this.$route.query.receiver)
    // }
    // if(this.$route.query.mobile!=undefined){
    //   sessionStorage.setItem('mobile', this.$route.query.mobile)
    // }
    // if(this.$route.query.receiver!=undefined){
    //   this.receiver = sessionStorage.getItem('receiver')
    // }else if(this.$route.query.receiver == undefined) {
    //   this.receiver = localStorage.getItem('receiverNew')
    // }
    // if(this.$route.query.mobile!=undefined){
    //   this.mobile = sessionStorage.getItem('mobile')
    // }else if(this.$route.query.mobile== undefined){
    //   this.mobile = localStorage.getItem('mobileNew')
    // }
    // if(this.$route.query.billInfoId!=undefined){
    //   localStorage.setItem('billInfoId', this.$route.query.billInfoId)
    // }
    // if(this.$route.query.addressId!=undefined){
    //   localStorage.setItem('addressId', this.$route.query.addressId)
    // }
    // this.billInfoId = localStorage.getItem('billInfoId')
    // this.addressId = localStorage.getItem('addressId')
  },
  methods: {
    invoiceFeed(val){
      this.form.point = val;
      this.$store.commit('SET_POINT',val);
      this.amountFee = 0
      this.amountFee = ((val+this.double)/100)*this.amount
    },
    getDouble(){
      const {point} = this.$store.state;
      this.$api.getBillServerRate().then(res => {
        if(res.data.respCode == 0){
          if(res.data.data){
            this.double = res.data.data
            this.amountFee = ((point+this.double)/100)*this.amount

          }
        }
      }).catch()
    },
    getinvoiceNameList(){
      this.$api.invoiceNameList().then(res => {
        if(res.data.respCode == 0){
          if(res.data.data){
            this.invoiceNameList = res.data.data
          }
        }
      }).catch()
    },
      cancelPrev(){
        this.$router.push({name: 'applyInvoice'})
      },
      getBalance() {
        this.$api
          .AccountDetail()
          .then(res => {
            if (res.data.respCode == 0) {
              if (res.data.data) {
                this.accountBalance = res.data.data.balance; //可用余额
                // if (res.data.data.hasPassword == true) {
                //   this.dialogVisible = true;
                // } else if (res.data.data.hasPassword == false) {
                //   this.dialogVisiblePay = true;
                // }
              }
            }
          })
          .catch();
      },
      truePassword(){
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
              this.$message.success("支付密码重置成功！");
              this.dialogVisibleResct = false;
              this.dialogVisiblePay = true;
          }
        })
        .catch();
      },
      getDataList(){//获取信息列表
        const {billInfoId} = this.$store.state;
        this.$api.managerBillInfoList().then(res =>{
          if(res.data.respCode == 0){
            if(res.data.data){
              this.infoTableData = res.data.data || [];
              if(this.infoTableData.length){
                if(this.infoTableData.some(it=>it.id===billInfoId)){
                   this.billInfoId = billInfoId
                  this.showMessageChange = true;
                  const $messageData = this.infoTableData.filter(it=>it.id===billInfoId)[0];
                  this.formInfo.messageData  = $messageData['customerName']
                }else {
                   this.billInfoId = this.infoTableData[0].id;
                  this.showMessageChange = true;
                  this.formInfo.messageData = this.infoTableData[0]['customerName'];
                }
              }else {
                this.billInfoId = null;
                 this.$store.commit('SET_BILLINFO_ID',null)
                this.showMessageChange = false;
              }
            }
          }
        }).catch()
      },
      getDataList2(){//获取地址列表
        const {addressId} = this.$store.state;

        this.$api.managerBillAddressList().then(res => {
          if(res.data.respCode == 0){
            if(res.data.data){
              this.addressTableData = res.data.data || []
              if(this.addressTableData.length){
                if(this.addressTableData.some(it=>it.id===addressId)){
                  this.showAddressChange = true;
                  this.addressId = addressId
                  const $addressData = this.addressTableData.filter(it=>it.id===addressId)[0];
                  this.formInfo.addressData  = $addressData['receiver']+','+$addressData['mobile'];
                }else {
                  this.showAddressChange = true;
                  this.addressId = this.addressTableData[0].id;
                  const $addressData = this.addressTableData[0];
                  this.formInfo.addressData = $addressData['receiver']+','+$addressData['mobile'];
                }
              }else {
                this.addressId =null;
                this.$store.commit('SET_ADDRESS_ID',null);
                this.showAddressChange = true;
              }
            }
          }
        }).catch()
      },
    submitMessage(){
      let pattern = /^[a-z0-9]*$/
        let reg = /^1[3456789]\d{9}$/
        let deg = /^([0-9]{1})(\d{14}|\d{15}|\d{16}|\d{17}|\d{18}|\d{19}|)$/
        if(!this.form.companyFull){
          return this.$message.error('公司全称不能为空')
        }
        if(!this.form.unifyCode){
          return this.$message.error('统一社会信用代码不能为空')
        }else if(!pattern.test(this.form.unifyCode)){
          return this.$message.error('统一社会信用代码为数字或字母')
        }
        if(!this.form.registerAddress){
          return this.$message.error('注册地址不能为空')
        }
        if(!this.form.registerPhone){
          return this.$message.error('注册电话不能为空')
        }else if(!reg.test(this.form.registerPhone)){
          return this.$message.error('请输入正确电话格式')
        }
        if(!this.form.openBank){
          return this.$message.error('开户银行不能为空')
        }
        if(!this.form.bankAccount){
          return this.$message.error('银行账号不能为空')
        }else if(!deg.test(this.form.bankAccount)){
          return this.$message.error('请正确输入银行账号')
        }
        let params = {
          customerName: this.form.companyFull,
          creditCode: this.form.unifyCode,
          registeAddress: this.form.registerAddress,
          phone: this.form.registerPhone,
          bankName: this.form.openBank,
          bankCard: this.form.bankAccount
        }
        this.$api.managerBillInfoAdd(params).then(res => {
          if(res.data.respCode == 0){
            this.$message.success('添加成功')
            this.dialogVisible = false
            this.id = res.data.data
            this.getInfo()
             this.$store.commit('SET_BILLINFO_ID',res.data.data)
          }
        }).catch()
    },
    getInfo(){
      let params = {
        billInfoId: this.id
      }
      this.$api.managerBillInfoDetail(params).then(res => {
        if(res.data.respCode == 0){
          if(res.data.data){
            // this.customerName = res.data.data.customerName
            localStorage.setItem('customerNameCurrent',res.data.data.customerName)
            this.customerNameCurrent = localStorage.getItem('customerNameCurrent')
            this.customerName = this.customerNameCurrent
            this.getDataList()
          }
        }
      }).catch()
    },
    submitAddress(){
      let pattern = /^1[3456789]\d{9}$/
        if(!this.formAddress.consignee){
          return this.$message.error('收货人不能为空')
        }else if(!this.formAddress.phoneCode){
          return this.$message.error('手机号码不能为空')
        }else if(!pattern.test(this.formAddress.phoneCode)){
          return this.$message.error('请输入正确电话格式')
        }else if(!this.formAddress.address){
          return this.$message.error('收货地址不能为空')
        }
        let params = {
          receiver: this.formAddress.consignee,
          mobile: this.formAddress.phoneCode,
          address: this.formAddress.address
        }
        this.$api.managerBillAddressAdd(params).then(res => {
          if(res.data.respCode == 0){
            this.$message.success('添加成功')
            this.dialogVisibleAddress = false
            this.ids = res.data.data
            this.getAddress()
              this.$store.commit('SET_ADDRESS_ID',res.data.data);
          }
        }).catch()
    },
    getAddress(){
      let params = {
        addressId: this.ids
      }
      this.$api.managerBillAddressDetail(params).then(res => {
        if(res.data.respCode == 0){
          if(res.data.data){
            // this.receiver = res.data.data.receiver
            // this.mobile = res.data.data.mobile
            localStorage.setItem('receiverNew',res.data.data.receiver)
            localStorage.setItem('mobileNew',res.data.data.mobile)
            this.receiverNew = localStorage.getItem('receiverNew')
            this.mobileNew = localStorage.getItem('mobileNew')
            this.receiver = this.receiverNew
            this.mobile = this.mobileNew
            this.getDataList2()
          }
        }
      }).catch()
    },
    addInfo() {
      this.dialogVisible = !this.dialogVisible;
    },
    addAddress() {
      this.dialogVisibleAddress = !this.dialogVisibleAddress;
    },
    replacePageInfo() {
      const { href } = this.$router.resolve({
        name: "invoiceInfo",
      });
      window.open(href, "_self");
    },
    replacePageAddress() {
      const { href } = this.$router.resolve({
        name: "applyInvoiceAddress",
      });
      window.open(href, "_self");
    },
    btn_submit() {
      this.$refs['formInfo'].validate((valid)=>{
          if(valid){
            this.dialogVisiblePay = !this.dialogVisiblePay;
            this.getBalance()
          }
        });
    },
    payMoney(){
        // this.dialogVisiblePay = false
        // this.dialogVisiblePayFalse = !this.dialogVisiblePayFalse
        if(!this.formPay.password){
          return this.$message.error('支付密码不能为空')
        }
        let pattern = /^[1-9][0-9]*$/
        if(!pattern.test(this.formPay.password)){
          return this.$message.error('请输入正确支付密码格式')
        }
        
        let params = {
          accountRecordIdList: this.accountRecordIdStrArr,
          invoiceType: this.formInfo.type,
          invoiceName:this.invoiceNameList.filter(it=>it.invoiceTax===this.formInfo.point)[0].invoiceName,
          billInfoId: this.billInfoId,
          addressId: this.addressId,
          invoiceTax: this.formInfo.point,
          passwd: this.formPay.password
        }
        this.$api.salaryFee(JSON.stringify(params)).then(res => {
          if(res.data.respCode == 0){
            this.$message.success('开票成功')
            this.dialogVisiblePay = false
            this.$router.push({name: 'invoiceList'})
          }else if(res.data.respCode == -1 && res.data.errorCode == 170002){
            this.dialogVisiblePay = false
            this.dialogVisiblePayFalse = true
            this.formPay.password = ''
          }
        }).catch()
    },
    add(val){
    },
    retry(){
        this.dialogVisiblePayFalse = false
        this.dialogVisiblePay = !this.dialogVisiblePay;
    },
    forgetPassword(){
        this.dialogVisiblePayFalse = false
        this.dialogVisibleResct = !this.dialogVisibleResct
        this.getMobile()
    },
    getCode() {
      let params = {
        mobile: this.userMobile
      };
      this.$api
        .getMobileCode(params)
        .then(res => {
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
    getMobile() {
      this.$api
        .getMobile()
        .then(res => {
          if (res.data.respCode == 0) {
            if (res.data.data) {
              this.userMobile = res.data.data.mobile; // 获取手机号
            }
          }
        })
        .catch();
    },
    handleSetType(type){
      this.$store.commit('SET_INVOICE_TYPE',type);
    }
    // handleSetSaveMessage(messageId,addressId){
    //   const {billInfoId} = this.$route.query;
    //   const $userInfo = sessionStorage.getItem('userInfo');
    //   if(billInfoId){
    //     localStorage.setItem(`messageId-${$userInfo}`,billInfoId);
    //   }
    //   const $messageId = localStorage.getItem(`messageId-${$userInfo}`);
    //   if($messageId){
    //     this.showMessageChange = true;
    //   }else {
    //     this.showMessageChange = false;
    //   }
    // }
  }
};
</script>

<style scoped>
.div .el-button {
  width: 102px !important;
  height: 30px !important;
  line-height: 0px;
}
.el-dialog__footer {
  padding-bottom: 10px !important;
}
.dialog .formSearchMargin .el-input__inner {
  width: 280px;
  height: 32px;
}
.dialog .el-dialog__body {
  padding: 30px 100px !important;
}
</style>
