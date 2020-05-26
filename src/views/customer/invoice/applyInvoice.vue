<template>
  <div>
    <h1
      style="color:#383838;font-size:14px;font-style:MicrosoftYaHei;padding:20px 0 20px 30px;border-bottom:1px solid #EAEDF4;background: #ffffff;"
    >第一步，选择要开票的订单</h1>
    <el-table :data="tableData" style="width: 100%" height="550" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55"></el-table-column>
      <el-table-column prop="totalTrueSalary" label="金额（元）" width="180"></el-table-column>
      <el-table-column prop="batchNumberDate" label="批次" width="180"></el-table-column>
      <el-table-column prop="managerId" label="项目经理"></el-table-column>
    </el-table>
    <h1
      style="color:#383838;font-size:14px;padding:20px 20px 20px 30px;border-bottom:1px solid #EAEDF4;background: #ffffff;text-align: right;"
    >
      <el-button size="medium" style="font-size:12px;" @click="handleToInvoiceList">取 消</el-button>
      <el-button size="medium" type="primary" style="font-size:12px;" @click="nextTwo" :disabled="val.length==0?true:false">下一步</el-button>
    </h1>
  </div>
</template>

<script>
export default {
  data() {
    return {
      tableData: [],
      accountRecordIdStrArr: [],
      amount: 0,
      val: []
    };
  },
  mounted(){
    this.getList()
  },
  methods: {
    getList(){
      this.$api.listCanInvoiceSalaryVO().then(res => {
        // console.log(res)
        if(res.data.respCode == 0){
          if(res.data.data){
            this.tableData = res.data.data || []
          }
        }
      }).catch()
    },
    handleSelectionChange(val){
      this.accountRecordIdStrArr = [];
      this.val = val
      this.amount = 0
      val.forEach(item => {
       this.accountRecordIdStrArr= this.accountRecordIdStrArr.concat(item.accountRecordIdStr.split(','));
        this.amount+=item.totalTrueSalary
      });
    },
    nextTwo() {
      this.$store.commit('SET_COUNT',this.amount);
      this.$store.commit('SET_RECORD_ID',this.accountRecordIdStrArr.map(it=>Number(it)));
      this.$router.push({ name: "applyInvoiceTwo" ,
      // query: {
      //   accountRecordIdStr: this.accountRecordIdStrArr,
      //   amount: this.amount,
      // }
      });
    },
    handleToInvoiceList(){
      this.$router.push({name:'invoiceList'});
    }
  }
};
</script>

<style>
</style>
