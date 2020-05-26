<template>
  <div class="job-detail back-white">
    <el-tabs v-model="activeName">
      <el-tab-pane label="劳务机会信息" name="first"></el-tab-pane>
      <el-tab-pane label="佣金设置信息" name="second"></el-tab-pane>
    </el-tabs>
    <base-info :infoDetail="jobInfo" v-if="activeName === 'first'"></base-info>
    <limit-info :infoDetail="jobInfo" v-if="activeName === 'second'"></limit-info>
  </div>
</template>

<script>
import BaseInfo from './components/job/BaseInfo.vue'
import LimitInfo from './components/job/LimitInfo.vue'

export default {
  name: "JobDetail",
  components: { BaseInfo, LimitInfo },
  data() {
    return {
      activeName: 'first',
      jobInfoId: '',
      jobInfo: {}
    }
  },
  mounted() {
    this.getParams()
    this.getDetail()
  },
  methods: {
    getParams() {
      this.jobInfoId = this.$route.params.id
    },
    getDetail() {
      let params = {
        jobInfoId: this.jobInfoId,
      }

      this.$api.getJobDetail(params)
        .then(res => {
          console.log('查询职位详情成功')

          this.jobInfo = res.data
        })
        .catch(err => {
          console.log('查询职位详情失败', err)
        })
    }
  }
}
</script>
