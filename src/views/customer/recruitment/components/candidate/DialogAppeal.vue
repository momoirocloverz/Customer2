<template>
  <el-dialog :visible.sync="appealVisible" width="540px" class="dialog-appeal base-dialog" :show-close="false" @close="handleClose">
    <div class="dialog-head">
      <div class="dialog-title">申诉信息</div>
    </div>
    <div class="dialog-body">
      <p>情况说明：</p>
      <div class="img-box">
        <img src="https://ac-r.static.booking.cn/images/hotel/max1280x900/172/172289233.jpg" alt="">
        <img src="https://ac-r.static.booking.cn/images/hotel/max1280x900/172/172289233.jpg" alt="">
      </div>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button size="medium" @click="handleClose">确定</el-button>
    </span>
  </el-dialog>
</template>

<script>
export default {
  name: "DialogAppeal",  // 申诉详情弹窗
  components: {},
  props: {
    appealVisible: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {

    };
  },

  computed: {},

  mounted() {

  },
  methods: {
    handleClose() {
      this.$emit('handleClose')
    }
  },
}
</script>

<style lang="scss" scoped>
.img-box {
  width: 400px;
  margin: auto;
  img {
    width: 100%;
    height: auto;
    margin-bottom: 20px;
  }
}
</style>
