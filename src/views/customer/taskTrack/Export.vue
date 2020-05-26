<template>
  <div class="overflow-box">
    <h4 class="dialog-panel-title">导出考勤数据</h4>
    <el-form ref="form" :model="form" label-width="100px" label-position="right">
      <el-form-item label="日期范围：">
        <el-date-picker class="radius-input workerInp" style="width:150px;" v-model="form.startDate" type="date" value-format="yyyy-MM-dd" format="yyyy-MM-dd" :picker-options="pickerOptions1" placeholder="选择日期">
        </el-date-picker>
        &nbsp;—&nbsp;
        <el-date-picker class="radius-input workerInp" style="width: 150px" v-model="form.endDate" type="date" value-format="yyyy-MM-dd" format="yyyy-MM-dd" :picker-options="pickerOptions2" placeholder="选择日期">
        </el-date-picker>
      </el-form-item>
    </el-form>
    <div class="dialog-panel-footer">
      <el-button size="medium" type="primary" :loading='loading' @click="handleExort">导出考勤表</el-button>
    </div>
  </div>
</template>
<script>
export default {
  name: "Export",
    props:{
        incomeParams:{
            type:Object,
        },
    },
  data() {
    let that = this
    return {
      pickerOptions1: {
        disabledDate: (time) => {
          let endDate = that.form.endDate
          if (endDate) {
            const one = 30 * 24 * 3600 * 1000
            const minTime = new Date(this.form.endDate).getTime() - one
            return time.getTime() <= minTime || time.getTime() >= new Date(endDate).getTime()
          }
        }
      },
      pickerOptions2: {
        disabledDate: (time) => {
          let startTime = that.form.startDate
          if (startTime) {
            const one = 30 * 24 * 3600 * 1000
            const minTime = new Date(this.form.startDate).getTime() + one
            return time.getTime() >= minTime || time.getTime() <= new Date(startTime).getTime() - 24 * 3600 * 1000
          }
        }
      },
      loading: false,
      preTime: '',
      form: {
        startDate: '',
        endDate: '',
      },
      options: [],
      nowDate: '',
      preDate: '',
    }
  },
  mounted() {
      console.log( 'incomeParams',this.incomeParams );
    this.nowDate = this.Moment(new Date()).format("YYYY-MM-DD");
    this.getPreMonth(this.nowDate);
    this.preDate = this.Moment(this.preTime).format("YYYY-MM-DD");
    this.form.startDate = this.preDate
    this.form.endDate = this.nowDate
  },
  methods: {
       exportAction(params){
           this.$api.punchDataExport(params).then(res=>{
              let { data:layer1 } = res;
              let { respCode,data } = layer1;
              if( respCode === 0 ){
                  window.open(data);
                  this.$emit('shut');
                  this.loading = false;
              }else{
                  this.loading = false;
              }
          }).catch(err=>{
               this.loading = false;
              console.log('err',err);
          })  
      },
    handleExort(type) {
        this.loading = true;
        this.incomeParams.startDate =  this.form.startDate;
        this.incomeParams.endDate =  this.form.endDate;
        this.exportAction(this.incomeParams);
    },
    getPreMonth(date) {
      var arr = date.split('-');
      var year = arr[0]; //获取当前日期的年份
      var month = arr[1]; //获取当前日期的月份
      var day = arr[2]; //获取当前日期的日
      var days = new Date(year, month, 0);
      days = days.getDate(); //获取当前日期中月的天数
      var year2 = year;
      var month2 = parseInt(month) - 1;
      if (month2 == 0) {
        year2 = parseInt(year2) - 1;
        month2 = 12;
      }
      var day2 = day;
      var days2 = new Date(year2, month2, 0);
      days2 = days2.getDate();
      if (day2 > days2) {
        day2 = days2;
      }
      if (month2 < 10) {
        month2 = '0' + month2;
      }
      var t2 = year2 + '-' + month2 + '-' + day2;
      this.preTime = new Date(t2);
    },
  }
}
</script>
<style lang="scss" scoped>
.dialog-panel-title {
  font-size: 20px;
  font-weight: normal;
  padding: 0 0 32px 0;
  text-align: center;
  color: #666;
}
.dialog-panel-footer {
  text-align: center;
}
.el_form_item {
  margin-left: 80px;
}
</style>