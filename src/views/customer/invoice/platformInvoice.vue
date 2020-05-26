<template>
  <div>
    <h1
      style="color:#383838;font-size:14px;font-style:MicrosoftYaHei;padding:20px 0 20px 30px;border-bottom:1px solid #EAEDF4;background: #ffffff;"
    >第一步，选择要开票的订单</h1>
    <el-table :data="tableData" style="width: 100%" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55"></el-table-column>
      <el-table-column prop="amount" label="金额（元）" width="180"></el-table-column>
      <el-table-column prop="transactionType" label="类型" width="180" :formatter="matterTransactionType"></el-table-column>
      <el-table-column prop="createdAt" label="发生时间" :formatter="matterReceiveTime"></el-table-column>
    </el-table>
    <h1
      style="color:#383838;font-size:14px;padding:20px 20px 20px 30px;border-bottom:1px solid #EAEDF4;background: #ffffff;text-align: right;"
    >
      <el-button size="medium" style="font-size:12px;" @click="handleToInvoiceList">取消</el-button>
      <el-button size="medium" type="primary" style="font-size:12px;" @click="nextTwo" :disabled="val.length==0?true:false">下一步</el-button>
    </h1>
  </div>
</template>

<script>
export default {
  data() {
    return {
      transactionTypeMap:{
        [0]:'无',
        [1]:'普通账户充值手续费',
        [2]:'管理费',
        [3]:'外包费用',
        [4]:'外包费用手续费',
        [5]:'外包费用充值手续费'
      },
      tableData: [],
      accountRecordIdStrArr: [],
      amount: 0,
      val: [],
      type:'',
    };
  },
  computed:{
  },
  mounted(){
    this.getList()
  },
  methods: {
    handleSelectionChange(val){
      this.accountRecordIdStrArr = []
      this.amount = 0
      this.val = val
      val.forEach(item => {
        this.accountRecordIdStrArr.push(item.id)
        this.amount+=item.amount
      });
      this.transactionTypeObj=this.getTypeList(val);
    },
    getTypeList(val){
      let obj = {};
      val.map((it,i)=>{
        if(obj[it.invoiceName]){
          obj[it.invoiceName].push(it);
        }else {
          obj[it.invoiceName]=[];
          obj[it.invoiceName].push(it);
        }
      })
      return obj;
    },
    getList(){
      // let params = {
      //   bizUserName: '万才科技',
      //   canInvoice: 'true',
      //   queryType: 2,
      //   pageNum: 1,
      //   pageSize: 0
      // }
      let params= {
        invoiceCategory:1,
        transactionType:''
      }
      this.$api.canInvoiceTransactionRecordList(params).then(res => {
        // console.log(res)
        if(res.data.respCode == 0){
          if(res.data.data){
            this.tableData = res.data.data
          }
        }
      }).catch()
    },
    nextTwo() {
      if(this.type){//外包费用过来的话
        this.$store.commit('SET_COUNT',this.amount);
      }else{
        this.$store.commit('SET_COUNT',this.amount);
        this.$store.commit('SET_RECORD_ID',this.accountRecordIdStrArr.map(it=>Number(it)));
        this.$store.commit('SET_TYPE_OBJ',this.transactionTypeObj)
        this.$router.push({ name: "platformInvoiceTwo" ,});
      }

      // query: {
      //   accountRecordIdStr: this.accountRecordIdStrArr,
      //   amount: this.amount,
      // }

    },
    matterReceiveTime(row, column, cellValue){
      if(cellValue){
        return cellValue.substr(0,10)
      }else{
        return '无'
      }
    },
    matterTransactionType(row, column, cellValue){
      return this.transactionTypeMap[cellValue];
    },
    handleToInvoiceList(){
      this.$router.push({name:'invoiceList'});
    }
  }
};
</script>

<style>
</style>
