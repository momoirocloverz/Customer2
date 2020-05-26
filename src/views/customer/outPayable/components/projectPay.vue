<template>
  <div class="back-white">
    <el-tabs v-model="activeName">
      <el-tab-pane label="明细" name="first"></el-tab-pane>
      <el-tab-pane label="汇总" name="second"></el-tab-pane>
    </el-tabs>

    <project-detail v-if="activeName == 'first'"></project-detail>
    <project-collect v-if="activeName == 'second'"></project-collect>
  </div>
</template>
<script>
import ProjectDetail from './projectDetail.vue'
import ProjectCollect from './projectCollect.vue'
export default {
  components: {
    ProjectDetail, ProjectCollect
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


