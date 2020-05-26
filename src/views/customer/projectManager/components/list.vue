<template>
  <div>
    <div style="margin-top: 20px">
      <el-tabs v-model="radio4">
        <el-tab-pane label="未解绑" name="firstShow"></el-tab-pane>
        <el-tab-pane label="已解绑" name="secondShow"></el-tab-pane>
      </el-tabs>
      <!--<hr class="el-radio-group-hr" />-->
    </div>
    <Unbound v-if="radio4==='firstShow'"></Unbound>
    <Bounded v-if="radio4==='secondShow'"></Bounded>
  </div>
</template>

<script>
import Unbound from './Unbound.vue'
import Bounded from './Bounded.vue'
//import util from '../../../common/util'
export default {
  name: "",
  components: {
    Unbound,
    Bounded,
  },
  data() {
    return {
      code: '',
      pageCount: '',
      currentPage: 1,
      pageSize: 20,
      tabledata: [{
        accountMobile: "",
        bindingTime: "",
        name: "",
        unbindingStartTime: "",
        unbindingTime: "",
      }],
      radio4: 'firstShow',
      firstShow: true,
      secondShow: false,
      // form: {
      //   sex: "不限",
      //   settleType: "不限",
      //   manager: "不限",
      //   tag: "不限",
      //   keyWord: "",
      //   bindingStatus: '4'
      // }
    }
  },
  created() {
  },
  mounted() {
    //      this.getPmList();
  },
  filters: {
    // formatminDate(val) {
    //   if (val) {
    //     return util.minDate(val)
    //   } else {
    //     return ''
    //   }
    // }
  },
  watch: {
    // 'form.bindingStatus': function (val, oldval) {
    //   if (val) {
    //     this.getPmList();
    //   }
    // }
  },
  methods: {
    // TabClick(val) {
    //   this.firstShow = false;
    //   this.secondShow = false;
    //   if (this.radio4 == 1) {
    //     this.firstShow = true
    //   } else if (this.radio4 == 2) {
    //     this.secondShow = true;
    //   }
    // },
  },
  // beforeRouteEnter(to, form, next) {
  //   next(vm => {
  //     if (form.name == 'socialSetting') {
  //       vm.radio4 = 4
  //       vm.fourthShow = true;
  //       vm.firstShow = false;
  //       vm.secondShow = false;
  //       vm.thirdShow = false;
  //     } else {
  //       vm.radio4 = 1
  //       vm.firstShow = true;
  //       vm.fourthShow = false;
  //       vm.secondShow = false;
  //       vm.thirdShow = false;
  //     }
  //   })
  // }
}
</script>

<style>
.vp-tab {
  margin: 20px 0;
}
.cut-line {
  width: 100%;
  height: 2px;
  background-color: #eeeeee;
  /*border: solid 1px #eeeeee;*/
}
</style>