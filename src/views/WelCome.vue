<template>
  <div class="welcome">
  </div>
</template>

<script>
export default {
  name: 'WelCome',
  data(){
    return {

    }
  },
  destroyed() {
  }
}
</script>

<style lang="scss" scoped>
.welcome {
  position: relative;
  height: calc(100% - 75px);
  background-image: url(../assets/images/welcome.png);
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center center;
}
</style>
