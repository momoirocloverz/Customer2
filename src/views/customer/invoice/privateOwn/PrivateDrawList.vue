<template>
  <div class="back-white">
    <el-tabs v-model="activeName">
      <el-tab-pane label="待开票" name="first"></el-tab-pane>
      <el-tab-pane label="已开票" name="second"></el-tab-pane>
    </el-tabs>
    <PrivateUndraw v-if="activeName == 'first'"></PrivateUndraw>
    <PrivateDrawed v-if="activeName == 'second'"></PrivateDrawed>
  </div>
</template>

<script>
import PrivateUndraw from './PrivateUndraw'
import PrivateDrawed from './PrivateDrawed'
export default {
  name: 'PrivateDrawList',
  components: {
    PrivateDrawed,
    PrivateUndraw,
  },
  data() {
    return {
      activeName: 'first'
    }
  },
  methods: {
    addNew() {
      this.$router.push({ name: 'drawing' })
    }
  }
}
</script>
