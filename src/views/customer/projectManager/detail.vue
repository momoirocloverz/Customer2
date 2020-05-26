<template>
  <div class="back-white">
    <el-tabs v-model="activeName">
      <el-tab-pane label="基本信息" name="first"></el-tab-pane>
      <!--<el-tab-pane label="已接班务" name="second"></el-tab-pane>-->
      <!-- <el-tab-pane label="分配的零工" name="third"></el-tab-pane> -->
    </el-tabs>
    <baseInfo v-if="activeName === 'first'"></baseInfo>
    <task v-if="activeName === 'second'"></task>
    <worker v-if="activeName === 'third'"></worker>
  </div>
</template>

<script>
import baseInfo from './components/baseInfo.vue'
import task from './components/task.vue'
import worker from './components/worker.vue'

export default {
  name: "PmDetail",
  components: { baseInfo, task, worker },
  data() {
    return {
      activeName: 'first'
    }
  }
}
</script>