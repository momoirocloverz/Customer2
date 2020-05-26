<template>
    <div class="shortCutCon">  
        <div class="backColorSet">
            <div class="processerCon">
                <el-steps :active="currentActive" align-center>
                    <el-step title="添加快捷班务"></el-step>
                    <el-step title="选择零工"></el-step>
                    <el-step title="数据确认"></el-step>                
                </el-steps>
            </div>
        </div>
        <div class="tabCon">
            <div v-if="currentActive == 1"><shortcutPart1></shortcutPart1></div>
            <div v-if="currentActive == 2"><shortcutPart2></shortcutPart2></div>
            <div v-if="currentActive == 3"><shortcutPart3></shortcutPart3></div>
        </div>
    </div>
</template>
<script>
    import { mapGetters } from 'vuex'
    import shortcutPart1 from './shortcutPart1.vue';
    import shortcutPart2 from './shortcutPart2.vue';
    import shortcutPart3 from './shortcutPart3.vue';
export default {
    name: 'shortCut',
    computed: {
    ...mapGetters({
        currentActive:'getShortCutIndex'
    })
  },
    components:{
        shortcutPart1,
        shortcutPart2,
        shortcutPart3,
    },
  data() {
      return {
//          currentActive:1,
      }
  },
  mounted() {
  },
  methods: {  
  },
}
</script>
<style lang="scss" scoped>
    .shortCutCon {
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