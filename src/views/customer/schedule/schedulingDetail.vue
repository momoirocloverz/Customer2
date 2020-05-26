<template>
  <div class="back-white">
    <h3 class="sche-title"> {{$route.query.name}}</h3>

    <el-tabs v-model="activeName">
      <el-tab-pane label="排班人员" name="first">
        <normal-woker v-if="activeName === 'first'"></normal-woker>
      </el-tab-pane>
      <el-tab-pane label="排班人员(特殊考勤)" name="second" v-if="emptyTalentSwitch == 1">
        <empty-woker v-if="activeName === 'second'"></empty-woker>
      </el-tab-pane>
      <el-tab-pane label="排班零工报酬" name="third">
        <setting @refreshTrigger="nowRefresh" v-if="activeName === 'third'"></setting>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import setting from './components/setting.vue'
import emptyWoker from './components/emptyWoker.vue'
import normalWoker from './components/normalWoker.vue'

export default {
  name: "schedulineDetail",
  components: {
    setting: setting,
    emptyWoker: emptyWoker,
    normalWoker: normalWoker,
  },
  data() {
    return {
      activeName: 'first',
      emptyTalentSwitch: 0
    }
  },
  created(){
    this.emptyTalentSwitch = JSON.parse(localStorage.getItem('userInfo')).emptyTalentSwitch
  },
  mounted(){
    if(this.$route.query.activeName){
      this.activeName = this.$route.query.activeName
    }
  },
    methods:{
        nowRefresh(){
            this.activeName = '';
            setTimeout(()=>{
                this.activeName = 'third';
            },500);
        },
    }
}
</script>

<style scoped>
.sche-title {
  text-align: center;
  font-size: 20px;
  font-weight: lighter;
  font-stretch: normal;
  line-height: 2;
  letter-spacing: 1px;
  color: #262626;
  padding-top: 20px;
}
</style>