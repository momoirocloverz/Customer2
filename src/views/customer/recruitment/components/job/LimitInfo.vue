<template>
  <div class="limit-info">
    <div class="box-body-item" v-for="(item, index) in infoDetail.jobFeeRuleList" :key="index">
      <div class="table-title">第{{item.ruleOrder}}次</div>
      <div class="table-info info-item">
        <div class="table-info-col1"><span>给付条件</span></div>
        <div class="table-info-col2"><span>出勤满{{item.ruleReachQuantity}}天</span></div>
        <div class="table-info-col1"><span>佣金金额（元）</span></div>
        <div class="table-info-col2"><span>{{item.ruleAmount}}</span></div>
      </div>
    </div>
  </div>
</template>

<script>
// ruleType  佣金类型：1.临时工 按天给  2.固定工 按天给
export default {
  name: 'LimitInfo',
  components: {},
  props: {
    infoDetail: {}
  },
  data() {
    return {

    };
  },
  mounted() {

  },
  methods: {

  },
}
</script>
