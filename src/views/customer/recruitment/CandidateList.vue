<template>
  <div class='candidate-list back-white'>
    <el-tabs v-model="activeName">
      <el-tab-pane label="进行中" name="first"></el-tab-pane>
      <el-tab-pane label="已结束" name="second"></el-tab-pane>
      <el-tab-pane label="申诉中" name="third"></el-tab-pane>
    </el-tabs>

    <on-working v-if="activeName === 'first'"></on-working>
    <have-completed v-if="activeName === 'second'"></have-completed>
    <on-appeal v-if="activeName === 'third'"></on-appeal>
  </div>
</template>

<script>
import { mapActions } from 'vuex'

import OnWorking from './components/candidate/OnWorking'
import HaveCompleted from './components/candidate/HaveCompleted'
import OnAppeal from './components/candidate/OnAppeal'

export default {
  name: 'CandidateList',
  components: {
    OnWorking, HaveCompleted, OnAppeal
  },
  data() {
    return {
      activeName: 'first'
    };
  },
  mounted() {
    this.getPmList()
    this.getIndustryList()
  },
  methods: {
    ...mapActions(['getPmList', 'getIndustryList'])
  }
}
</script>
