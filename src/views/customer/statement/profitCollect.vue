<template>
  <div class="back-white">
    <el-tabs v-model="activeName">
      <el-tab-pane label="报表" name="first"></el-tab-pane>
      <el-tab-pane label="趋势图" name="second"></el-tab-pane>
    </el-tabs>

    <statement v-if="activeName == 'first'"></statement>
    <trendChart v-if="activeName == 'second'"></trendChart>
  </div>
</template>
<script>
import statement from './components/statement.vue'
import trendChart from './components/trendChart.vue'
export default {
  components: {
    statement, trendChart
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
