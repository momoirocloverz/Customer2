<template>
  <div class="bread" id="breadContainer">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item v-for="(item,index) in breadList" :key="index">
        {{item.meta.breadName == '总览' ? '' : item.meta.breadName}}</el-breadcrumb-item>
    </el-breadcrumb>
  </div>
</template>

<script>
//import someComponent from './someComponent'
export default {
  name: "",
  component: {
    //someComponent
  },
  data() {
    return {
      breadList: [],
    }
  },
  created() {
    this.getBreadList()
  },
  watch: {
    $route(to, from) {
      this.getBreadList();
    }
  },
  methods: {
    getBreadList() {
      let matched = this.$route.matched;
      //        const first = matched[0]
      //        if(first && first.meta.breadName!='首页'){
      //          matched = [{
      //            path: "/home",
      //            name: "home",
      //            alias: '首页',
      //            meta: {
      //              isShow: false,
      //              breadName:'首页',
      //            }}].concat(matched)
      //        }
      this.breadList = matched;
    }
  }
}
</script>

<style scoped>
.bread {
  font-size: 12px;
  line-height: 1;
  padding: 12px 30px;
  margin: 10px 0px;
}
</style>