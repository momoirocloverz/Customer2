<template>
  <div class="check-chart">
        <el-form :model="form" label-width="100px" labelPosition="center">
                <el-form-item label="时间范围：" class="formSearchMargin">
                    <el-radio-group class="radio-search" v-model="form.months">
                        <el-radio label="">本年度</el-radio>
                        <el-radio label="1">自定义</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="自定义：" class="formSearchMargin" v-if="form.months == '1'">
                        <el-date-picker class="margin_left40" size="mini" v-model="form.startDate" type="month" value-format="yyyy-MM-dd" placeholder="选择开始时间">
                        </el-date-picker>
                        --
                        <el-date-picker class="margin_left10" size="mini" v-model="form.endDate" type="month" value-format="yyyy-MM-dd" placeholder="选择结束时间">
                        </el-date-picker>
                        <el-button type="primary" size="small" class="datesearchBtn newbtn" @click="btn_true">确定</el-button>
                </el-form-item>
            </el-form>
    <div id="chartmainline" style="width:100%; height:400px;background:#ffffff;"></div>
  </div>
</template>

<script>
import Interval from '../../../../common/interval.js'
export default {
  name: 'checkChart',
  components: {},
  data() {
    return {
      form: {
        months: '',
        startDate: '',
        endDate: ''
      },
      managerId: 0,
      monthStart: '',
      monthEnd: '',
      data: []
    };
  },
  watch: {
    'form.months': function(val,old){
      if(val == ''){
        this.getDetail()
      }else if(val == '1'){
        this.form.startDate = ''
        this.form.endDate = ''
      }
    }
  },
  created(){
    this.managerId = this.$route.params.id
  },
  mounted() {
    this.getDetail()
  },
  methods: {
    getDetail() {
      if(this.form.months == ''){
        this.form.startDate = new Date().getFullYear()+'-01'
        this.form.endDate = Interval.getDay(0)
      }else if(this.form.months == '1'){
        this.form.startDate = this.form.startDate
        this.form.endDate = this.form.endDate
      }
      let param = {
        managerId: this.managerId,
        monthStart: this.form.startDate?this.form.startDate.substr(0,7):'',
        monthEnd: this.form.endDate?this.form.endDate.substr(0,7):'',
        order: "asc"
      }
      console.log(param)
      this.$api.profitQueryDetailList(param)
        .then(res => {
          console.log(res)
          if (res.respCode == 0) {
            this.data = res.data
            this.chartRender()
          }
        })
        .catch(err => {
          console.log(err)
          this.$message.error('查询失败！')
        })
    },

    chartRender() {
      let options = {
        tooltip: {
          trigger: 'axis'
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          name: '日期',
          data: []
        },
        yAxis: {
          type: 'value',
          name: '利润/元',
          axisLabel: {
            formatter: '{value}'
          }
        },
        series: [
          {
            name: '利润',
            type: 'line',
            data: [],
          },
        ]
      }
      let newData = []
      let newYearMonthStr = []
      this.data.forEach(item => {
        newData.push(item.profit)
        newYearMonthStr.push(item.yearMonthStr)
      })
      options.xAxis.data = newYearMonthStr
      options.series[0].data = newData
      let chartmainline = this.$echarts.init(document.getElementById("chartmainline"))
      chartmainline.setOption(options)
    },
    btn_true(){
            if(!this.form.startDate&&!this.form.endDate){
                return this.$message.error('时段不能为空')
            }else if(!this.form.startDate){
                return this.$message.error('开始时间不能为空')
            }else if(!this.form.endDate){
                return this.$message.error('结束时间不能为空')
            }else if(this.form.startDate > this.form.endDate){
                return this.$message.error('结束时间不能早于开始时间')
            }
      this.getDetail()
    }
  },
}
</script>
<style lang='scss' scoped>
</style>