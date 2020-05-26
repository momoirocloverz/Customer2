<template>
  <div class="back-white">
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="已生成" name="first"></el-tab-pane>
      <el-tab-pane :label="`待生成（${total}条）`" name="second" id="id_ert"></el-tab-pane>
    </el-tabs>

    <yi-generate v-if="activeName == 'first'"></yi-generate>
    <dai-generate v-if="activeName == 'second'" @funcTotal="funcTotal"></dai-generate>
  </div>
</template>
<script>
import yiGenerate from './components/yiGenerate.vue'
import daiGenerate from './components/daiGenerate.vue'

export default {
  components: {
    yiGenerate, daiGenerate
  },
  
  data() {
    return {
      activeName: 'first',
      total: 0,
    }
  },
  mounted() {
    if(localStorage.getItem("activeName") !=undefined){
         this.activeName=localStorage.getItem("activeName"); 
     }
     this.getData()      
  },
  methods: {
    funcTotal(val){
      this.total = val
    },
    handleClick(tab, event){
      localStorage.setItem("activeName", this.activeName); 
    },
    getData(){
            this.$api.profitWaitQueryCount().then(res => {
//                console.log(res)
                if(res.respCode == 0){
                    if(res.data){
                        this.total = res.data
                    }
                }
            }).catch()
      }     

  }
}
</script>
<style scoped>
</style>
