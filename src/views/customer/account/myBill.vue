<template>
  <div class="back-white">
    <el-tabs v-model="activeName">
      <el-tab-pane label="明细账单" name="first"></el-tab-pane>
      <el-tab-pane label="汇总账单" name="second"></el-tab-pane>
    </el-tabs>

    <bill-detail v-if="activeName == 'first'"></bill-detail>
    <bill-collect v-if="activeName == 'second'"></bill-collect>
  </div>
</template>
<script>
import BillDetail from './component/BillDetail.vue'
import BillCollect from './component/BillCollect.vue'
export default {
  components: {
    BillDetail, BillCollect
  },
  data() {
    return {
      activeName: 'first'
    }
  }
}
</script>
<style scoped>
</style>


