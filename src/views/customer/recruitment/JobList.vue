<template>
  <div class='job-list back-white'>
    <el-tabs v-model="activeName">
      <el-tab-pane label="发布中" name="first"></el-tab-pane>
      <el-tab-pane label="待发布" name="second"></el-tab-pane>
      <el-tab-pane label="已关闭" name="third"></el-tab-pane>
    </el-tabs>

    <on-going v-if="activeName === 'first'"></on-going>
    <to-public v-if="activeName === 'second'"></to-public>
    <have-closed v-if="activeName === 'third'"></have-closed>
  </div>
</template>

<script>
import { mapActions } from 'vuex'

import OnGoing from './components/job/OnGoing'
import HaveClosed from './components/job/HaveClosed'
import ToPublic from './components/job/ToPublic'

export default {
  name: 'JobList',
  components: {
    OnGoing, HaveClosed, ToPublic
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
