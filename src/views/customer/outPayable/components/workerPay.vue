<template>
  <div class="back-white">
    <el-tabs v-model="activeName">
      <el-tab-pane label="待付批次汇总" name="third"></el-tab-pane>
      <el-tab-pane label="已付批次汇总" name="fourth"></el-tab-pane>    
      <el-tab-pane label="明细" name="first"></el-tab-pane>
      <el-tab-pane label="全部汇总" name="second"></el-tab-pane>
    </el-tabs>

    <WaitingPayment v-if="activeName == 'third'"></WaitingPayment>
    <Paied v-if="activeName == 'fourth'"></Paied>
    <worker-detail v-if="activeName == 'first'"></worker-detail>
    <worker-collect v-if="activeName == 'second'"></worker-collect>
  </div>
</template>
<script>
import WorkerDetail from './workerDetail.vue'
import WorkerCollect from './workerCollect.vue'
import WaitingPayment from './waitingPayment.vue'    
import Paied from './paied.vue'     
export default {
  components: {
    WorkerDetail, WorkerCollect,WaitingPayment,Paied
  },
  data() {
    return {
      activeName: 'third'
    }
  }
}
</script>
<style scoped>
</style>