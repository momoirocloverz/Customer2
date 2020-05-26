<template>
  <div class='pay-page'>
    <h2 class="page-title" style="text-align:center;">付款</h2>
    <el-form label-width="200px">
      <el-form-item label="明细：">
        项目结算费
      </el-form-item>
      <el-form-item label="金额：">
        1000.00元
      </el-form-item>
      <el-form-item label="余额：">
        10000.00元
      </el-form-item>
      <el-form-item label="支付密码：">
        <el-input type="password" autocomplete="off" v-model="password"></el-input>
      </el-form-item>
      <div class="btn-panel">
        <el-button type="primary" @click="submitForm">确认付款</el-button>
        <el-button @click="resetForm">取消</el-button>
      </div>
    </el-form>
  </div>
</template>

<script>
export default {
  name: 'PayPage',
  components: {},
  data() {
    return {
      password: ''
    };
  },

  computed: {},

  mounted() {

  },
  methods: {
    submitForm() {
      this.$message({
        message: '付款成功',
        type: 'success'
      })
    },
    resetForm() {
      this.$router.push({ path: '/payable' })
    },
  },
}
</script>
<style lang='scss' scoped>
.pay-page {
  width: 600px;
  margin: auto;
  .btn-panel {
    padding: 0 120px;
    display: flex;
    justify-content: space-around;
  }
}
</style>