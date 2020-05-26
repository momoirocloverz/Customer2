<template>
  <div class="licence">
    <div class="licence-img">
      <img src="../assets/images/licence1.png" alt="">
      <img src="../assets/images/licence2.png" alt="">
    </div>
  </div>
</template>

<script>
export default {
  name: 'licence'
}
</script>

<style lang="scss" scoped>
.licence {
  background-color: #000;
  .licence-img {
    width: 657px;
    margin: auto;
    line-height: 0;
    img {
      width: 100%;
      height: auto;
    }
  }
}
</style>
