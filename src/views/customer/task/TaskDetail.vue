<template>
  <div class="back-white">
    <baseInfo></baseInfo>
  </div>
</template>
<script>
import baseInfo from './components/baseInfo.vue'
export default {
  name: "TaskDetail",
  components: {
    baseInfo: baseInfo,
  },
  data() {
    return {
    }
  }
}
</script>