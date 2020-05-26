<template>
  <div class="back-white">
    <el-tabs v-model="activeName">
      <el-tab-pane label="明细" name="first"></el-tab-pane>
      <el-tab-pane label="汇总" name="second"></el-tab-pane>
    </el-tabs>

    <handler-detail v-if="activeName == 'first'"></handler-detail>
    <handler-collect v-if="activeName == 'second'"></handler-collect>
  </div>
</template>
<script>
import HandlerDetail from "./component/HandlerDetail.vue";
import HandlerCollect from "./component/HandlerCollect.vue";
export default {
  components: {
    HandlerDetail, HandlerCollect
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


