<template>
        <div style="width: 100%;text-align: center;color: #606266;">
            <img src="../assets/images/none.png"/>
            <br/>
            <span>暂无相关{{msg}}信息</span>
    </div>
</template>

<script>
  export default {
    name: "",
    components: {},
    data() {
      return {
        msg: "Hello Vue.js"
      }
    },
    props:{
      msg:String
    },
    methods: {}
  }
</script>

<style scoped>

</style>