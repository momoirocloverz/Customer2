<template>
  <div class="back-white">
    <h3 class="sche-title"> {{$route.query.name}}</h3>

    <el-tabs v-model="activeName">
      <el-tab-pane label="任务信息" name="1">
        <baseInfo v-if="activeName == '1'"></baseInfo>
      </el-tab-pane>
      <el-tab-pane label="排班零工报酬" name="2">
        <setting v-if="activeName == '2'"></setting>
      </el-tab-pane>
    </el-tabs>

  </div>
</template>
<script>
import baseInfo from './components/affiBaseInfo.vue'
import setting from './components/setting.vue'
export default {
  name: "affiTaskDetail",
  components: {
    baseInfo: baseInfo,
    setting: setting,
  },
  data() {
    return {
      activeName:'1'
    }
  }
}
</script>