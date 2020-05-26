<template>
  <div class="u-mask" @click.prevent="handleWrapperClick" v-show="visible">
    <div class="u-image">
      <!--<img src="../assets/images/bus.png">-->
      <img :src="image" :style="{width: clintwidth,height:clintHeight}">
      <i class="el-icon el-icon-close img-close"></i>
    </div>
  </div>
</template>
<script>
export default {
  name: 'bigImage',
  data() {
    return {
      clintwidth: '',
      clintHeight: ''
    }
  },
  methods: {
    handleWrapperClick(evt) {
      this.$emit('handleWrapperClick', evt);

    },
  },
  mounted() {
    var w = document.documentElement.clientWidth || document.body.clientWidth;
    var h = document.documentElement.clientHeight || document.body.clientHeight;
    this.clintwidth = w / 3 + 'px'
    this.clintHeight = h / 2 + 'px'
  },
  props: {
    image: {
      default: '',
      type: String,
    },
    visible: {
      default: false
      ,
    },
  },
};
</script>
<style lang="scss" scoped>
.u-mask {
  // opacity: 0.6!important;
  // filter: alpha(opacity=60);
  // background: #000000;
  background-color: rgba(0, 0, 0, 0.5);
  position: fixed;
  left: 0px;
  top: 0px;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  z-index: 20;
  margin: 0 !important;
  .u-image {
    border-radius: 8px;
    position: relative;
    > img {
      z-index: 99;
    }

    .img-close {
      position: absolute;
      top: 10px;
      right: 10px;
      font-size: 30px;
      color: #666666;
    }
    padding: 70px;
    background-color: #ffffff;
  }
}
</style>
