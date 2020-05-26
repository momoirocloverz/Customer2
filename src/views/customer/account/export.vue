<template>
  <div class="back-white">
    <div class="overflow-box pwd-box" v-if="firstStep">
      <div class="dialog-head">
        <div class="dialog-title">您正在第三方支付页面充值</div>
      </div>
      <div class="dialog-body">
        <el-form ref="form" :model="form" label-width="110px" :rules="rules">
          <el-form-item label="">
            <el-radio-group v-model="form.type" style="margin-left: -100px">
              <el-radio label="1">本月数据</el-radio>
              <el-radio label="2">上月数据</el-radio>
              <el-radio label="3">自定义时段</el-radio>
            </el-radio-group>
          </el-form-item>

          <el-form-item label="开始时间：" prop="startDate" v-if="form.type==3">
            <el-date-picker class="radius-input workerInp" v-model="form.startDate" type="date" value-format="yyyy-MM-dd" format="yyyy-MM-dd" :picker-options="pickerOptions1" placeholder="选择日期">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="结束时间：" prop="endDate" v-if="form.type==3">
            <el-date-picker class="radius-input workerInp" v-model="form.endDate" value-format="yyyy-MM-dd" format="yyyy-MM-dd" :picker-options="pickerOptions0" type="date" placeholder="选择日期">
            </el-date-picker>
            <div style="color:#666">每次最多只能导一个月的数据</div>
          </el-form-item>
        </el-form>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button size="medium" type="primary" :loading='loading' @click="handleSubmit">导 出</el-button>
        <el-button size="medium" @click="handleHideExport">取 消</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import util from '../../../common/util'

export default {
  name: "",
  components: {},
  data() {
    let that = this
    return {
      pickerOptions1: {
        disabledDate(time) {
          let endDate = that.form.endDate
          if (endDate) {
            const one = 30 * 24 * 3600 * 1000
            const minTime = new Date(that.form.endDate).getTime() - one
            return time.getTime() < minTime || time.getTime() > new Date(endDate).getTime()
          }

        }
      },
      pickerOptions0: {
        disabledDate(time) {
          let startTime = that.form.startDate
          if (startTime) {
            const one = 30 * 24 * 3600 * 1000
            const minTime = new Date(that.form.startDate).getTime() + one
            return time.getTime() > minTime || time.getTime() < new Date(startTime).getTime()
          }

        }
      },
      loading: false,
      currentMonth: '',
      preMonth: '',
      time: 3,
      wating: 60,
      getcoding: false,
      buttonText: '获取验证码',
      rules: {
        endDate: [
          { required: true, message: '结束时间不能为空', trigger: 'blur' },
        ],
        startDate: [
          { required: true, message: '结束时间不能为空', trigger: 'blur' },
        ],
      },
      firstStep: true,
      agreeVisible: false,
      form: {
        type: '1',
        startDate: '',
        endDate: '',
      },
      msg: "Hello Vue.js"
    }
  },
  filters: {
    formatMobile(val) {
      if (val) {
        return val.substr(0, 3) + "****" + val.substr(7);
      }
    }
  },
  mounted() {
    this.currentMonth = util.formatDate(new Date())
  },
  methods: {
    handleSubmit() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          let month = []
          if (this.form.type == 1) {
            month = this.currentMonth
          } else if (this.form.type == 2) {
            month = this.getPreMonth(this.currentMonth)
          } else {
            month = ''
          }
          const params = {
            objectType: 2,
            startDate: this.form.type == 3 ? this.form.startDate : '',
            month: month,
            endDate: this.form.type == 3 ? this.form.endDate : '',
          };
          this.loading = true
          this.$api
            .AccountExport(params)
            .then(response => {
              if (response.data.respCode == 0) {
                window.open(response.data.data)
              }
              this.loading = false
            })
            .catch(error => {
              console.log(error);
            });
        }
      });
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
      return t2;
    },
    handleHideExport() {
      this.$emit('handleHideExport')
    }
  }
}
</script>


<style scoped>
</style>