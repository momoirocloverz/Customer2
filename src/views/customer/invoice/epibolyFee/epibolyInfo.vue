<template>
  <div>
    <h1
      style="color:#383838;font-size:14px;font-style:MicrosoftYaHei;padding:20px 0 20px 30px;border-bottom:1px solid #EAEDF4;background: #ffffff;"
    >我的开票信息</h1>
    <h1 style="padding:20px 0 20px 30px;background: #ffffff;" class="h1-style">
      <el-button class="primary-btn" size="mini" @click="add">添加开票信息</el-button>
    </h1>
    <el-table :data="tableData" style="width: 100%" emptyText="暂无相关信息" highlight-current-row @current-change="handleSelectionChange">
      <el-table-column width="55" label="单选" v-if="!isView">
        <template slot-scope="scope">
          <el-checkbox v-model="scope.row.checked"></el-checkbox>
        </template>
      </el-table-column>
      <el-table-column prop="customerName" label="公司" width="180"></el-table-column>
      <el-table-column prop="creditCode" label="统一社会信用代码" width="180"></el-table-column>
      <el-table-column prop="registeAddress" label="注册地址" width="180"></el-table-column>
      <el-table-column prop="phone" label="注册电话" width="180"></el-table-column>
      <el-table-column prop="bankName" label="开户银行" width="180"></el-table-column>
      <el-table-column prop="bankCard" label="银行账号" width="180"></el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button type="text" class="btn-icon btn-icon-edit" size="mini" @click="edit(scope.row)">编辑</el-button>
          <el-button type="text" class="btn-icon btn-icon-delete" size="mini" @click="del(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <h1
      style="color:#383838;font-size:14px;padding:20px 20px 20px 30px;border-bottom:1px solid #EAEDF4;background: #ffffff;text-align: right;"
    >
      <el-button size="medium" style="font-size:12px;" @click="prevPage" v-if="!isView">取 消</el-button>
      <el-button size="medium" type="primary" style="font-size:12px;" @click="submitPrev" :disabled="submitDisabled" v-if="!isView">提 交</el-button>
    </h1>
    <!-- 窗窗 -->
    <el-dialog :title="title" :visible.sync="dialogVisible" width="640px" class="dialog">
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
        <el-button type="primary" v-if="title == '添加开票信息'" @click="btnSubmitAdd">确 认</el-button>
        <el-button type="primary" v-if="title == '编辑开票信息'" @click="btnSubmitEdit">确 认</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      isView: false,
        rules: {
            companyFull: [
                { required: true, message: '公司全称不能为空', trigger: 'blur' },
            ],
            unifyCode: [
                { required: true, message: '统一社会信用代码不能为空', trigger: 'blur' },
                { max: 128, message: '长度不超过128字', trigger: 'blur' },
                { pattern: /^[a-zA-Z0-9]*$/, message: '统一社会信用代码为数字或字母', trigger: 'blur' },
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
            ]
        },
      tableData: [],
      newTableData: [],
      dialogVisible: false,
      submitDisabled: true,
      title: '编辑开票信息',
      form: {
          companyFull: '',
          unifyCode: '',
          registerAddress: '',
          registerPhone: '',
          openBank: '',
          bankAccount: ''
      },
      id: '',
      row: {},
      platform: '',
      workerFee: '',
      onceNo: '',
      type:'',
      fromParams:{},
    };
  },
  watch: {
    // dialogVisible: {
    //   handler(val,old){
    //     if(val == false){
    //       this.form = {}
    //     }
    //   }
    // }
  },
  created(){
      this.onceNo = localStorage.getItem('onceNo')
  },
  mounted(){
    this.type = this.$route.query.payment == 'out';
    this.fromParams = this.$route.query.fromParams;
    this.getDataList();
    this.handleIsView();
    
  },
  methods: {
    handleIsView(){
      const {query} = this.$route;
      if(query.view&&query.view ==1){
        this.isView = true;
      }else {
        this.isView = false;
      }
    },
      handleSelectionChange(row){
        let ifcheckd = false
        this.newTableData.forEach(item => {
          if(row){
            if(item.id != row.id){
              item.checked  = false
            }else {
              item.checked  = true;
            }
              ifcheckd = true
          }
        })
        this.row = row
        if(ifcheckd){
          this.submitDisabled = false
        }else{
          this.submitDisabled = true
        }
      },
      getDataList(){
        this.newTableData = []
        this.$api.managerBillInfoList().then(res =>{
          console.log(res)
          this.submitDisabled = true
          if(res.data.respCode == 0){
            if(res.data.data){
              this.tableData = res.data.data || []
              this.tableData.forEach(item => {
                item.checked  = false
              })
              this.newTableData = this.tableData
            }else{
              this.tableData = []
            }
          }
        }).catch()
      },
      btnSubmitAdd(){
        let pattern = /^[a-zA-Z0-9]*$/
        let reg = /^((0\d{2,3}-\d{7,8})|(1[3584]\d{9}))$/
        let deg = /^([1-9]{1})(\d{14}|\d{15}|\d{16}|\d{17}|\d{18}|\d{19})$/
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
            this.getDataList()
          }
        }).catch()
      },
      btnSubmitEdit(){
         let pattern = /^[a-zA-Z0-9]*$/
        let reg = /^((0\d{2,3}-\d{7,8})|(1[3584]\d{9}))$/
        let deg = /^([1-9]{1})(\d{14}|\d{15}|\d{16}|\d{17}|\d{18}|\d{19})$/
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
          id: this.id,
          customerName: this.form.companyFull,
          creditCode: this.form.unifyCode,
          registeAddress: this.form.registerAddress,
          phone: this.form.registerPhone,
          bankName: this.form.openBank,
          bankCard: this.form.bankAccount
        }
        this.$api.managerBillInfoUpdate(params).then(res => {
          if(res.data.respCode == 0){
            this.$message.success('编辑成功')
            this.dialogVisible = false
            this.getDataList()
          }
        }).catch()
      },
      add(){
          this.title = '添加开票信息'
          this.dialogVisible = !this.dialogVisible
          this.form={
            companyFull: '',
            unifyCode: '',
            registerAddress: '',
            registerPhone: '',
            openBank: '',
            bankAccount: ''
          };
      },
      del(row){
        let params = {
          billInfoId: row.id
        }
        this.$confirm('此操作将永久删除该信息, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$api.managerBillInfoDel(params).then(res => {
          if(res.respCode == 0){
            this.$message.success('删除成功')
            this.getDataList()
          }
        }).catch()
        }).catch(() => {
        });

      },
      edit(row){
        this.id = row.id
        this.form.companyFull = row.customerName
        this.form.unifyCode = row.creditCode
        this.form.registerAddress = row.registeAddress
        this.form.registerPhone = row.phone
        this.form.openBank = row.bankName
        this.form.bankAccount = row.bankCard
        this.title = '编辑开票信息'
        this.dialogVisible = !this.dialogVisible
      },
      prevPage(){
        if(this.type){
          this.$router.push({name: 'waitPamentOutsource',params:{isBack:true},query:this.fromParams })
        }else{
          this.$router.push({name: 'platformInvoiceTwo'})
        }
      },
      submitPrev(){
        if(this.type){
            this.$store.commit('OUT_PAY_INFO',this.row)
            this.$router.push({name: 'waitPamentOutsource',params:{isBack:true},query:this.fromParams })
        }else{
          this.$store.commit('SET_BILLINFO_ID',this.row.id)
          this.$router.push({name: 'platformInvoiceTwo', })
        }
        // localStorage.setItem('messageRow',JSON.stringify(this.row))


          // query: {
          //   customerName: this.row.customerName?this.row.customerName:'',
          //   billInfoId: this.row.id
          // }

      }
  }
};
</script>

<style>
.h1-style .primary-btn {
  font-size: 12px !important;
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
</style>
