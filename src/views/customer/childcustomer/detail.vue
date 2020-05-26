<template>
  <div class="back-white">
    <el-tabs v-model="activeName">
      <el-tab-pane label="基本信息" name="first">
        <baseInfo v-if="activeName === 'first'"></baseInfo>
      </el-tab-pane>
      <!-- <el-tab-pane label="任务" name="second">
        <task v-if="activeName === 'second'"></task>
      </el-tab-pane> -->
    </el-tabs>
  </div>
</template>

<script>
import baseInfo from './components/baseInfo.vue'
// import task from './components/task.vue'

export default {
  name: "detail",
  components: {
    baseInfo: baseInfo,
    // task: task,
  },
  data() {
    return {
      activeName: 'first',
    }
  }
}
</script>
