<template>
  <div>
    <h1
      style="color:#383838;font-size:14px;font-style:MicrosoftYaHei;padding:20px 0 20px 30px;border-bottom:1px solid #EAEDF4;background: #ffffff;"
    >第二步，填写发票信息</h1>
    <div style="background:#fff;padding: 15px 0;" class="div">
        <el-form :model="formInfo" label-width="100px" labelPosition="center" ref="formInfo" :rules="formInfoRules">
        <div class="u-all-des">总金额{{amount?amount.toFixed(2):0}}元，共{{transactionTypeObjList.length}}张发票：</div>
        <div v-for="it,i in transactionTypeObjList" :key="i">
          <div class="u-form-container"><span>开票金额:&nbsp;&nbsp;{{it.amount?it.amount.toFixed(2):0}}元</span><span style="margin-left:100px">发票内容:&nbsp;&nbsp;{{it.invoiceName}}（税点：{{it.invoiceTax}}%）</span></div>
        </div>
      <el-form-item label="发票类型：" class="formSearchMargin">
        <el-radio-group v-model="formInfo.type" @change="handleSetType">
          <el-radio :label="1">增值税普通发票</el-radio>
          <el-radio :label="2">增值税专用发票</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="开票信息：" class="formSearchMargin top" prop="messageData">
        <ChangeAndAdd :showChange="showMessageChange" v-model="formInfo.messageData" :add="addInfo" :change="replacePageInfo">
          </ChangeAndAdd>
      </el-form-item>
      <el-form-item label="收票地址：" class="formSearchMargin top" prop="addressData">
         <ChangeAndAdd :showChange="showAddressChange" v-model="formInfo.addressData" :add="addAddress" :change="replacePageAddress">
          </ChangeAndAdd>
      </el-form-item>
    </el-form>
    </div>
    <h1
      style="color:#383838;font-size:14px;padding:20px 20px 20px 30px;border-bottom:1px solid #EAEDF4;border-top:1px solid #EAEDF4;background: #ffffff;text-align: right;"
    >
      <el-button size="medium" style="font-size:12px;" @click="cancelPrev">取 消</el-button>
      <el-button size="medium" type="primary" style="font-size:12px;" @click="btn_submit2">提 交</el-button>
    </h1>
    <!-- 窗窗(开票信息) -->
    <el-dialog title="添加开票信息" :visible.sync="dialogVisible" v-if="dialogVisible" width="640px" class="dialog">
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
    <el-dialog title="添加收票地址" :visible.sync="dialogVisibleAddress" v-if="dialogVisibleAddress" width="640px" class="dialog">
      <el-form :model="formAddress" label-width="150px" labelPosition="center" :rules="rules">
        <el-form-item label="收货人：" prop="consignee" class="formSearchMargin">
          <el-input v-model="formAddress.consignee" placeholder="请输入收货人"></el-input>
        </el-form-item>
        <el-form-item label="手机号码：" prop="phoneCode" class="formSearchMargin">
          <el-input v-model="formAddress.phoneCode" placeholder="请输入手机号码"></el-input>
        </el-form-item>
        <el-form-item label="收货地址：" prop="address" class="formSearchMargin">
          <el-input type="textarea" v-model="formAddress.address" placeholder="请输入收货地址" :maxlength="120"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisibleAddress = false">取 消</el-button>
        <el-button type="primary" @click="submitAddress">确 认</el-button>
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
    return {
      transactionTypeObjList:[],
        rules: {
            companyFull: [
                { required: true, message: '公司全称不能为空', trigger: 'blur' },
            ],
            unifyCode: [
                { required: true, message: '统一社会信用代码不能为空', trigger: 'blur' },
            ],
            registerAddress: [
                { required: true, message: '注册地址不能为空', trigger: 'blur' },
            ],
            registerPhone: [
                { required: true, message: '注册电话不能为空', trigger: 'blur' },
                { pattern: /^((0\d{2,3}-\d{7,8})|(1[3584]\d{9}))$/, message: '请输入正确电话格式', trigger: 'blur' },
            ],
            openBank: [
                { required: true, message: '开户银行不能为空', trigger: 'blur' },
            ],
            bankAccount: [
                { required: true, message: '银行账号不能为空', trigger: 'blur' },
                { pattern: /^([0-9]{1})(\d{14}|\d{15}|\d{16}|\d{17}|\d{18}|\d{19}|)$/, message: '请正确输入银行账号', trigger: 'blur' },
            ],
            consignee: [
                { required: true, message: '收货人不能为空', trigger: 'blur' },
            ],
            phoneCode: [
                { required: true, message: '手机号码不能为空', trigger: 'blur' },
                { pattern: /^1[3456789]\d{9}$/, message: '请输入正确电话格式', trigger: 'blur' },
            ],
            address: [
                { required: true, message: '收货地址不能为空', trigger: 'blur' },
            ]
        },
        rulesAddress: {
            
        },
      dialogVisible: false,
      dialogVisibleAddress: false,
      form: {
          companyFull: '',
          unifyCode: '',
          registerAddress: '',
          registerPhone: '',
          openBank: '',
          bankAccount: ''
      },
      formAddress: {
          consignee: '',
          phoneCode: '',
          address: ''
      },
      formInfo: {
        type: null,
        messageData:'',
        addressData:''
      },
      id: '',
      ids: '',
      customerName: '',
      customerNameCurrent: '',
      infoTableData: [],
      addressTableData: [],
      accountRecordIdStrArr: [],
      receiverNew: '',
      mobileNew: '',
      receiver: '',
      mobile: '',
      amount: 0,
      billInfoId: '',
      addressId: '',
      showMessageChange: false,
      messageData:'',
      showAddressChange: false,
      addressData:'',
      formInfoRules:{
          messageData:[{
              required: true,message: '开票信息不能为空', trigger: 'blur'

          }],
          addressData:[{
              required: true,message: '收票地址不能为空', trigger: 'blur'
          }]
      },
    };
  },
  created(){
    this.getDataList()
    this.getDataList2()
    const {count,recordId,invoiceType,point,transactionTypeObj} = this.$store.state;
    this.amount = count;
    this.accountRecordIdStrArr = recordId;
     this.transactionTypeObjList = Object.keys(transactionTypeObj).map(it=>{
      const $it = transactionTypeObj[it];
      let $amount = 0;
      $it.map(z=>{
        $amount+=z.amount;
      })
        return {
          amount:$amount,
          invoiceName:$it[0].invoiceName,
          invoiceTax:$it[0].invoiceTax
        }
      }).sort((a,b)=>a.invoiceTax-b.invoiceTax);
    this.formInfo.type = invoiceType;
    this.formInfo.point = point;
  },
  methods: {
      btn_submit2(){
        // let params = {
        //   accountRecordIdList: this.accountRecordIdStrArr,
        //   invoiceType: this.formInfo.type,
        //   billInfoId: this.billInfoId,
        //   addressId: this.addressId
        // }
        let params = {
          invoiceTransactionRecordIdList:this.accountRecordIdStrArr,
          invoiceType:this.formInfo.type,
          invoiceCategory:1,
          invoiceInfoId:this.billInfoId,
          addressId:this.addressId

        }
        this.$refs['formInfo'].validate((valid)=>{
          if(valid){
            this.$api.invoiceSubmit(params).then(res => {
          if(res.data.respCode == 0){
            this.$message.success('开票成功')
            this.$router.push({name: 'invoiceList'})
          }
          }).catch()
          }
        });
        
      },
      cancelPrev(){
        this.$router.push({name: 'platformInvoice'})
      },
    submitMessage(){
      let pattern = /^[a-zA-Z0-9]*$/
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
          console.log(res,'info')
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
      getDataList(){
        const {billInfoId} = this.$store.state;
        this.$api.managerBillInfoList().then(res =>{
          if(res.data.respCode == 0){
            if(res.data.data){
              this.infoTableData = res.data.data || []
              if(this.infoTableData.length){
                this.showMessageChange = true;
                if(this.infoTableData.some(it=>it.id===billInfoId)){
                  this.billInfoId = billInfoId
                  const $messageData = this.infoTableData.filter(it=>it.id===billInfoId)[0];
                  this.formInfo.messageData  = $messageData['customerName']
                }else {
                  // this.billInfoId = this.infoTableData[0].id;
                  // this.showMessageChange = true;
                  // this.formInfo.messageData = this.infoTableData[0]['customerName'];
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
      getDataList2(){
        const {addressId} = this.$store.state;
        this.$api.managerBillAddressList().then(res => {
          if(res.data.respCode == 0){
            if(res.data.data){
              this.addressTableData = res.data.data || []
              if(this.addressTableData.length){
                  this.showAddressChange = true;
                if(this.addressTableData.some(it=>it.id===addressId)){
                  this.addressId = addressId
                  const $addressData = this.addressTableData.filter(it=>it.id===addressId)[0];
                  this.formInfo.addressData  = $addressData['receiver']+','+$addressData['mobile'];
                }else {
                  // this.addressId = this.addressTableData[0].id;
                  // this.showAddressChange = true;
                  // const $addressData = this.addressTableData[0];
                  // this.formInfo.addressData = $addressData['receiver']+','+$addressData['mobile'];
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
      addInfo(){
          this.dialogVisible = !this.dialogVisible
      },
      addAddress(){
          this.dialogVisibleAddress = !this.dialogVisibleAddress
      },
      replacePageInfo(){
          const {href} = this.$router.resolve({
              name: 'platformInfo',
          })
          window.open(href,'_self')
      },
      replacePageAddress(){
          const {href} = this.$router.resolve({
              name: 'platformAddress',
          })
          window.open(href,'_self')
      },
      handleSetType(type){
      this.$store.commit('SET_INVOICE_TYPE',type);
    }
  }
};
</script>

<style scoped>
.div .el-button{
    width: 102px !important;
    height: 30px !important;
    line-height: 0px;
}
.el-dialog__footer{
padding-bottom: 10px !important;
}
.dialog .formSearchMargin .el-input__inner{
    width: 280px;
    height: 32px;
}
.dialog .el-dialog__body{
padding: 30px 100px  !important;
}
.u-form-container {
  width: 520px;
  height:34px;
  margin-bottom: 20px;
  padding-left:10px;
  line-height: 34px;
  background-color:#F5F6F7;
  margin-left: 20px;
  font-size: 12px;
  color: #383838;
}
.u-all-des {
  color:#383838;
  font-size: 12px;
  line-height: 16px;
  height: 16px;
  margin-left: 24px;
  margin-bottom: 20px;
}
</style>
