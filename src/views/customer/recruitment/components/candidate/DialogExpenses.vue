<template>
  <el-dialog :visible.sync="expensesVisible" width="540px" :show-close="false" class="dialog-expenses base-dialog">
    <div class="dialog-head">
      <div class="dialog-title">佣金信息</div>
    </div>
    <div class="dialog-body">
      <div v-for="(item, index) in expensesInfo" :key="index">
        {{item.info}} <span :class="{'complete': item.status}"></span>
      </div>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button size="medium" @click="handleClose">确定</el-button>
    </span>
  </el-dialog>
</template>

<script>
export default {
  name: "DialogExpense",  // 佣金详情弹窗
  components: {},
  props: {
    expensesInfo: {
      type: Array,
      default: []
    },
    dialogVisible: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      expensesVisible: true
    };
  },

  computed: {},

  mounted() {
    console.log(this.info)
  },
  methods: {
    handleClose() {
      this.$emit('handleClose')
    }
  },
}
</script>

<style lang="scss" scoped>
.complete {
  display: inline-block;
  width: 20px;
  height: 10px;
  background-color: green;
}
</style>
