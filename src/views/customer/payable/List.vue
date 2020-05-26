<template>
  <div>
    <div style="margin-top: 20px">
      <el-radio-group v-model="radio4" @change="TabClick">
        <el-radio-button label="1">应付零工</el-radio-button>
        <el-radio-button label="2">应付项目</el-radio-button>
        <el-radio-button label="4">零工社保设置</el-radio-button>
      </el-radio-group>
      <hr class="el-radio-group-hr" />
    </div>

    <workerPay v-if="firstShow"></workerPay>
    <projectPay v-if="secondShow"></projectPay>
    <managerProfit v-if="thirdShow"></managerProfit>
    <workerSocial v-if="fourthShow"></workerSocial>
  </div>
</template>

<script>
import workerPay from './components/workerPay.vue'
import projectPay from './components/projectPay.vue'
import managerProfit from './components/managerProfit.vue'
import workerSocial from './components/workerSocial.vue'
import util from '../../../common/util'
export default {
  name: "",
  components: {
    workerPay: workerPay,
    projectPay: projectPay,
    managerProfit: managerProfit,
    workerSocial: workerSocial
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
      radio4: '',
      firstShow: true,
      secondShow: false,
      thirdShow: false,
      fourthShow: false,
      form: {
        sex: "不限",
        settleType: "不限",
        manager: "不限",
        tag: "不限",
        keyWord: "",
        bindingStatus: '4'
      }
    }
  },
  created() {
  },
  mounted() {
    //      this.getPmList();
  },
  filters: {
    formatminDate(val) {
      if (val) {
        return util.minDate(val)
      } else {
        return ''
      }
    }
  },
  watch: {
    'form.bindingStatus': function (val, oldval) {
      if (val) {
        this.getPmList()
      }
    }
  },
  methods: {

    TabClick() {
      this.firstShow = false;
      this.secondShow = false;
      this.thirdShow = false;
      this.fourthShow = false;
      if (this.radio4 == 1) {
        this.firstShow = true
      } else if (this.radio4 == 2) {
        this.secondShow = true;
      } else if (this.radio4 == 3) {
        this.thirdShow = true;
      } else if (this.radio4 == 4) {
        this.fourthShow = true;
      }
      //        this.getPmList()
    },
  },
  beforeRouteEnter(to, form, next) {
    next(vm => {
      if (form.name == 'socialSetting') {
        vm.radio4 = 4
        vm.fourthShow = true;
        vm.firstShow = false;
        vm.secondShow = false;
        vm.thirdShow = false;
      } else {
        vm.radio4 = 1
        vm.firstShow = true;
        vm.fourthShow = false;
        vm.secondShow = false;
        vm.thirdShow = false;
      }
    })
  }
}
</script>

<style scoped>
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