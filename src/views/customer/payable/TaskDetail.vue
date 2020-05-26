<template>
    <div>
        <div style="margin-top: 20px">

            <el-radio-group v-model="radio4" @change="TabClick">
                <el-radio-button label="1">基本信息</el-radio-button>
                <el-radio-button label="2">任务设置</el-radio-button>

            </el-radio-group>
            <hr class="el-radio-group-hr"/>
            <baseInfo v-if="first"></baseInfo>
            <setting v-if="second"></setting>
        </div>
    </div>
</template>

<script>
  import baseInfo from './components/baseInfo.vue'
      import setting from './components/setting.vue'
  //    import proManager from './components/proManager.vue'
  export default {
    name: "",
    components: {
      baseInfo:baseInfo,
      setting:setting
    },
    data() {
      return {
        first:true,
        second:false,
        third:false,
        fourth:false,
        radio4:'1',
        msg: "Hello Vue.js",
        customerId:'',
        form:{
          managerProjectVO:{}
        },
      }
    },
    watch() {

    },
    mounted(){

    },
    methods: {

      TabClick(){
        this.first=false;
        this.second=false;
        this.third=false;
        this.fourth=false;
        switch (this.radio4){
          case '1':
            this.first=true;
            break;
          case '2':
            this.second=true;
            break;
          case '3':
            this.third=true;
            break;
          case '4':
            this.fourth=true;
            break;
        }
      }
    }
  }
</script>

<style scoped>

</style>