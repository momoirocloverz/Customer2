<template>
  <div>
    <h1
      style="color:#383838;font-size:14px;font-style:MicrosoftYaHei;padding:20px 0 20px 30px;border-bottom:1px solid #EAEDF4;background: #ffffff;"
    >我的收票地址</h1>
    <h1 style="padding:20px 0 20px 30px;background: #ffffff;" class="h1-style">
      <el-button class="primary-btn" size="mini" @click="add">添加开票地址</el-button>
    </h1>
    <el-table :data="tableData" style="width: 100%" emptyText="暂无相关信息" highlight-current-row @current-change="handleSelectionChange">
      <el-table-column width="55" label="单选" v-if="!isView">
        <template slot-scope="scope">
          <el-checkbox v-model="scope.row.checked"></el-checkbox>
        </template>
      </el-table-column>
      <el-table-column prop="receiver" label="收货人" width="120"></el-table-column>
      <el-table-column prop="mobile" label="手机号" width="180"></el-table-column>
      <el-table-column prop="address" label="收货地址"></el-table-column>
      <el-table-column label="操作" width="300">
        <template slot-scope="scope">
          <el-button type="text" class="btn-icon btn-icon-view" size="mini" @click="edit(scope.row)">编辑</el-button>
          <el-button type="text" class="btn-icon btn-icon-delete" size="mini" @click="del(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <h1
      style="color:#383838;font-size:14px;padding:20px 20px 20px 30px;border-bottom:1px solid #EAEDF4;background: #ffffff;text-align: right;"
    >
      <el-button size="medium" style="font-size:12px;" @click="cancel" v-if="!isView">取 消</el-button>
      <el-button size="medium" type="primary" style="font-size:12px;" @click="submitPrev" :disabled="submitDisabled" v-if="!isView">提 交</el-button>
    </h1>
    <!-- 窗窗 -->
    <el-dialog :title="title" :visible.sync="dialogVisible" v-if="dialogVisible" width="640px" class="dialog">
      <el-form :model="form" label-width="150px" labelPosition="center" :rules="rules">
        <el-form-item label="收货人：" prop="consignee" class="formSearchMargin">
          <el-input v-model="form.consignee" placeholder="请输入收货人"></el-input>
        </el-form-item>
        <el-form-item label="手机号码：" prop="phoneCode" class="formSearchMargin">
          <el-input v-model="form.phoneCode" placeholder="请输入手机号码"></el-input>
        </el-form-item>
        <el-form-item label="收货地址：" prop="address" class="formSearchMargin">
          <el-input type="textarea" v-model="form.address" placeholder="请输入收货地址" :maxlength="120"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" v-if="title=='添加收票地址'" @click="submitAdd">确 认</el-button>
        <el-button type="primary" v-if="title=='编辑收票地址'" @click="submitEdit">确 认</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      isView:false,
        rules: {
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
      tableData: [],
      newTableData: [],
      dialogVisible: false,
      submitDisabled: true,
      title: '编辑收票地址',
      form: {
          consignee: '',
          phoneCode: '',
          address: ''
      },
      id: '',
      row: {},
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
              item.checked = false
            }else {
              item.checked = true
            }
            ifcheckd =true
          }
        })
        this.row = row
        if(ifcheckd){
          this.submitDisabled = false
        }else{
          this.submitDisabled = true
        }
      },
      cancel(){
        if(this.type){
          this.$router.push({name: 'waitPamentOutsource',params:{isBack:true},query:this.fromParams })
        }else{
          this.$router.push({name: 'platformInvoiceTwo'})
        }

      },
      submitPrev(){
        if(this.type){
          this.$store.commit('OUT_PAY_ADDRESS',this.row)
          this.$router.push({name: 'waitPamentOutsource',params:{isBack:true},query:this.fromParams })
        }else {
          // localStorage.setItem('addressRow',JSON.stringify(this.row))
          this.$store.commit('SET_ADDRESS_ID', this.row.id)
          this.$router.push({
            name: 'platformInvoiceTwo',
            // query: {
            //   receiver: this.row.receiver?this.row.receiver:'',
            //   mobile: this.row.mobile?this.row.mobile:'',
            //   addressId: this.row.id
            // }
          })
        }
      },
      getDataList(){
        this.$api.managerBillAddressList().then(res => {
          console.log(res)
          if(res.data.respCode == 0){
            if(res.data.data){
              this.tableData = res.data.data || []
              this.tableData && this.tableData.forEach(item => {
                item.checked = false
              })
              this.newTableData = this.tableData
            }else{
              this.tableData = []
            }
          }
        }).catch()
      },
      submitAdd(){
        let pattern = /^1[3456789]\d{9}$/
        if(!this.form.consignee){
          return this.$message.error('收货人不能为空')
        }else if(!this.form.phoneCode){
          return this.$message.error('手机号码不能为空')
        }else if(!pattern.test(this.form.phoneCode)){
          return this.$message.error('请输入正确电话格式')
        }else if(!this.form.address){
          return this.$message.error('收货地址不能为空')
        }
        let params = {
          receiver: this.form.consignee,
          mobile: this.form.phoneCode,
          address: this.form.address
        }
        this.$api.managerBillAddressAdd(params).then(res => {
          // console.log(res)
          if(res.data.respCode == 0){
            this.$message.success('添加成功')
            this.dialogVisible = false
            this.getDataList()
          }
        }).catch()
      },
      submitEdit(){
        let pattern = /^1[3456789]\d{9}$/
        if(!this.form.consignee){
          return this.$message.error('收货人不能为空')
        }else if(!this.form.phoneCode){
          return this.$message.error('手机号码不能为空')
        }else if(!pattern.test(this.form.phoneCode)){
          return this.$message.error('请输入正确电话格式')
        }else if(!this.form.address){
          return this.$message.error('收货地址不能为空')
        }
        let params = {
          id: this.id,
          receiver: this.form.consignee,
          mobile: this.form.phoneCode,
          address: this.form.address
        }
        this.$api.managerBillAddressUpdate(params).then(res => {
          // console.log(res)
          if(res.data.respCode == 0){
            this.$message.success('编辑成功')
            this.dialogVisible = false
            this.getDataList()
          }
        }).catch()
      },
      add(){
          this.title = '添加收票地址'
          this.dialogVisible = !this.dialogVisible;
          this.form={
           consignee: '',
          phoneCode: '',
          address: ''
          };
      },
      del(row){
        let params = {
          addressId: row.id
        }
        this.$confirm('此操作将永久删除该信息, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$api.managerBillAddressDel(params).then(res => {
          // console.log(res)
          if(res.respCode == 0){
            this.$message.success('删除成功')
            this.getDataList()
          }
        }).catch()
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
      },
      edit(row){
          this.id = row.id
          this.form.consignee = row.receiver
          this.form.phoneCode = row.mobile
          this.form.address = row.address
          this.title = '编辑收票地址'
          this.dialogVisible = !this.dialogVisible
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
