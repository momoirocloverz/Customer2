<template>
  <div class="back-white">
    <el-tabs v-model="activeName">
      <el-tab-pane label="待开票" name="first"></el-tab-pane>
      <el-tab-pane label="已开票" name="second"></el-tab-pane>
    </el-tabs>

    <div class="back-white btn-div flexable u-button-group">
      <!-- <el-button class="primary-btn" size="mini" v-if="activeName == 'first'" @click="addNew">我要开票</el-button> -->
      <div>
        <el-button class="primary-btn" size="mini" v-if="activeName == 'first'" @click="addNew">我要开票</el-button>
      </div>
      <div>
        <el-button class="primary-btn" size="mini"  @click="handleToInfo">开票信息管理</el-button>
        <el-button class="primary-btn" size="mini"  @click="handleToAddress">收票地址管理</el-button>
      </div>
    </div>

    <!-- 窗窗 -->
    <el-dialog title="开票" :visible.sync="dialogVisible" width="360px">
        <div class="dialog">
          <!--<el-button @click="workerFeeInvoice">零工劳务费开票</el-button>-->
          <el-button @click="platformInvoice" class="btn2">平台使用费开票</el-button>
          <el-button @click="hanldeToEpibolyFee" class="btn2">外包费用开票</el-button>
        </div>
    </el-dialog>

    <Undraw v-if="activeName == 'first'"></Undraw>
    <Drawed v-if="activeName == 'second'"></Drawed>
  </div>
</template>

<script>
import Drawed from "./Drawed";
import Undraw from "./Undraw";
export default {
  name: "InvoiceList",
  components: {
    Drawed,
    Undraw
  },
  data() {
    return {
      activeName: "first",
      dialogVisible: false,
      workerFee: 1,
      platform: 2,
    };
  },
  mounted() {
    this.$store.commit('CLEAR_STATE');
  },
  methods: {
    hanldeToEpibolyFee(){
      this.$router.push({ name: "epibolyFeeOne" });
    },
    handleToInfo(){
      this.$router.push({name:"platformInfo",query:{view:1}});
      
    },
    handleToAddress(){
      this.$router.push({name:"platformAddress",query:{view:1}})
    },
    workerFeeInvoice(){
      this.$router.push({ name: "applyInvoice" });
    },
    platformInvoice(){
      this.$router.push({ name: "platformInvoice" });
    },
    addNew() {
      //this.$router.push({ name: "drawing" });
      this.dialogVisible = !this.dialogVisible
      //this.$router.push({ name: "platformInvoice" });
    }
  }
};
</script>
<style scoped>
.dialog{
  height: 85px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
}
.dialog .el-button{
width: 169px !important;
height: 36px !important;
/* background: #FAFAFA; */
border: 1px solid #E6E6E6;
/* color: #5C5C5C */
}
.dialog .btn2{
  margin-left: 0px !important;
}
.u-button-group {
justify-content:space-between;
}
</style>
