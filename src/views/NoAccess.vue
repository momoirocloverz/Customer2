<template>
  <div class="no-access">
    <p class="tip"><span class="icon"></span>您没有使用权限，如需使用请联系管理员</p>
  </div>
</template>

<script>
export default {
  name: 'noaccess'
}
</script>

<style lang="scss" scoped>
.no-access {
  .tip {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    padding: 50px;
    background-color: #fff;
  }

  .icon {
    display: inline-block;
    width: 20px;
    height: 20px;
    margin-right: 10px;
    background-image: url(../assets/images/alert.png);
    background-size: cover;
    background-repeat: no-repeat;
    background-position: center center;
    vertical-align: middle;
  }
}
</style>
