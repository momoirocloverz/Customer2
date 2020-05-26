<template>
  <div class="back-white">
    <el-tabs v-model="activeName">
      <el-tab-pane label="待开票" name="first"></el-tab-pane>
      <el-tab-pane label="已开票" name="second"></el-tab-pane>
    </el-tabs>

    <managerUndraw v-if="activeName == 'first'"></managerUndraw>
    <ManagerDrawed v-if="activeName == 'second'"></ManagerDrawed>
  </div>
</template>

<script>
import managerUndraw from './managerUndraw'
import ManagerDrawed from './ManagerDrawed'
export default {
  name: 'ManagerDrawList',
  components: {
    ManagerDrawed,
    managerUndraw,
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
