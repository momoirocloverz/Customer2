<template>
  <div class="g-class-detail">
    <el-tabs v-model="activeName">
        <el-tab-pane label="基本信息" name="baseInfo"></el-tab-pane>
      </el-tabs>
      <baseInfo></baseInfo>
  </div>
</template>
<script>
import baseInfo from './baseInfo.vue'
export default {
  name: 'classDetail',
    components: {
    baseInfo
  },
  data() {
    return {
     activeName:'baseInfo',     
    }
  }
}
</script>