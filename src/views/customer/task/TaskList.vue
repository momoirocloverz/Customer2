<template>
  <div>
    <div>
      <el-radio-group v-model="radio4" @change="TabClick">
        <el-radio-button label="1">发任务</el-radio-button>
        <el-radio-button label="2">待确认</el-radio-button>
        <el-radio-button label="3">领取成功</el-radio-button>
        <el-radio-button label="4">工种价格设置</el-radio-button>
      </el-radio-group>
      <hr class="el-radio-group-hr" />
    </div>

    <DispatchTask v-if="first"></DispatchTask>
    <ToConfirm v-if="second"></ToConfirm>
    <ReceptSuccess v-if="third"></ReceptSuccess>
    <PriceSetting v-if="fourth"></PriceSetting>
  </div>
</template>
<script>
import DispatchTask from './components/DispatchTask.vue'
import ToConfirm from './components/ToConfirm.vue'
import ReceptSuccess from './components/ReceptSuccess.vue'
import PriceSetting from './components/PriceSetting.vue'
export default {
  name: 'TaskList',
  components: {
    DispatchTask: DispatchTask,
    ToConfirm: ToConfirm,
    ReceptSuccess: ReceptSuccess,
    PriceSetting: PriceSetting,
  },
  data() {
    return {
      first: true,
      second: false,
      third: false,
      fourth: false,
      radio4: 1,

    }
  },
  methods: {
    TabClick() {
      this.first = false;
      this.second = false;
      this.third = false;
      this.fourth = false;
      switch (this.radio4) {
        case '1':
          this.first = true;
          break;
        case '2':
          this.second = true;
          break;
        case '3':
          this.third = true;
          break;
        case '4':
          this.fourth = true;
          break;
      }
    },

  },
  created() {
    this.radio4 = 1
    this.first = true
    this.second = false
    this.third = false
    this.fourth = false
  },
  mounted() {
    let set = localStorage.getItem('setUpPrice')
    if (set == 1) {
      this.radio4 = 4
      this.fourth = true
      this.second = false
      this.third = false
      this.first = false
    } else {
      this.radio4 = 1
      this.first = true
      this.second = false
      this.third = false
      this.fourth = false
    }
    let type = this.$route.query.type === 'success' ? 3 : 1
    this.radio4 = type
    if (this.radio4 == 1) {
      this.first = true
      this.second = false
      this.third = false
      this.fourth = false
    } else if (this.radio4 == 3) {
      this.first = false
      this.second = false
      this.third = true
      this.fourth = false
    }
    // this.TabClick()
  },
  beforeDestroy() {
    localStorage.removeItem('setUpPrice')
  },
}
</script>
