<template>
    <div class="accountCheckMasterCon">  
        <div class="backColorSet">
            <div class="processerCon">
                <el-steps :active="currentActive" align-center>
                    <el-step title="填写基本信息"></el-step>
                    <el-step title="等待审核"></el-step>
                    <el-step title="正常使用"></el-step>                
                </el-steps>
            </div>
        </div>
        <div class="tabCon">
<!--            <check2></check2>-->
            <div v-if="currentActive == 1"><check1></check1></div>
            <div v-if="currentActive == 2"><check2></check2></div>
            <div v-if="currentActive == 3"><check3></check3></div>
        </div>
    </div>
</template>
<script>
    import { mapGetters } from 'vuex'
    import check1 from './check1.vue';
    import check2 from './check2.vue';
    import check3 from './check3.vue';
export default {
    name: 'accountCheckMaster',
    computed: {
    ...mapGetters({
        currentActive:'getAuditStage'
    })
  },
    components:{
        check1,
        check2,
        check3,
    },
  data() {
      return {
//          currentActive:1,
      }
  },
  mounted() {
      console.log( 'currentActive',this.currentActive );
  },
  methods: {  
  },
}
</script>
<style lang="scss" scoped>
    .accountCheckMaster {
        .backColorSet {
            background-color: #fff;
            box-sizing: border-box;
            border: 1px solid #E6E7EB;
            margin-bottom: 16px;            
        }
        .processerCon {
            width: 50%;
            margin: 0 auto;
            padding-top: 30px;
            padding-bottom: 30px;
        }
        .tabCon {
            box-sizing: border-box;
            border: 1px solid #E6E7EB;
        }
    }
</style>