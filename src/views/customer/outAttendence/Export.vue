<template>
  <div class="overflow-box">
    <h4 class="dialog-panel-title">导出考勤数据</h4>

    <el-form ref="form" :model="form" label-width="150px" label-position="right" :rules="rules">
      <el-form-item label="客户：">
        <el-select class="radius-input " v-model="form.belongto" placeholder="请选择" style="width: 220px">
          <el-option v-for="item in belongtoList" :key="item.id" :label="item.belongToName" :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="班务：">
        <el-select class="radius-input " v-model="form.taskId" placeholder="请选择" style="width: 220px">
          <el-option v-for="item in taskList" :key="item.id" :label="item.taskName" :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="结算方式：">
        <el-select class="radius-input " v-model="form.settlementType" placeholder="请选择" style="width: 220px">
          <el-option label="不限" value=""></el-option>
          <el-option label="月结" value="2"></el-option>
          <el-option label="周结" value="4"></el-option>
          <el-option label="日结" value="1"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="日期范围：">
        <el-date-picker class="radius-input workerInp" style="width:150px;" v-model="form.startDate" type="date" value-format="yyyy-MM-dd" format="yyyy-MM-dd" :picker-options="pickerOptions1" placeholder="选择日期">
        </el-date-picker>
        &nbsp;—&nbsp;
        <el-date-picker class="radius-input workerInp" style="width: 150px" v-model="form.endDate" type="date" value-format="yyyy-MM-dd" format="yyyy-MM-dd" :picker-options="pickerOptions2" placeholder="选择日期">
        </el-date-picker>
        <p class="note-label">以上条件可单选</p>
      </el-form-item>
    </el-form>

    <div class="dialog-panel-footer">
      <el-button size="medium" type="primary" :loading='loading2' @click="handleExort(2)">导出考勤表</el-button>
    </div>
  </div>
</template>

<script>
import util from '../../../common/util'

export default {
  name: "Export",
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
      loading1: false,
      loading2: false,
      preTime: '',
      nextDate: '',
      belongtoList: [],
      taskList: [],
      form: {
        startDate: '',
        endDate: '',
        taskId: '',
        belongto: '',
        settlementType: ''
      },
      isEdit: false,
      fileList: [],
      upload_form: {},
      rules: {
        creditCode: [
          { required: true, message: '统一社会信用代码不能为空', trigger: 'blur' },
          { max: 128, message: '长度不超过128字', trigger: 'blur' },
          { pattern: /^[a-z0-9]*$/, message: '统一社会信用代码为数字或字母' },
        ],
      },
      options: [],
      provinceList: [],
      cityList: [],
      regionList: [],
      insdutryList: [],
      value: '',
      customerId: '',
      count1: '',
      count2: '',
      nowDate: '',
      preDate: '',
    }
  },
  mounted() {
    this.getbelongtoList()
    this.getTaskList()
    this.nowDate = util.dayTime(new Date())
    this.getPreMonth(this.nowDate)
    this.preDate = util.dayTime(this.preTime)
    this.form.startDate = this.preDate
    this.form.endDate = this.nowDate
  },
  watch: {
    'form.belongto': function (val, oldval) {
      if (val) {
        for (let x in this.belongtoList) {
          if (this.belongtoList[x].id == val) {
            this.taskType = this.belongtoList[x].taskType
            this.belongto = this.belongtoList[x].belongTo
            this.belongtoName = this.belongtoList[x].belongToName
            console.log(this.taskType)
            console.log(this.belongto)
            break;
          }
        }
        this.getTaskList()
      }
    },
    'form.province': function (val, oldval) {
      if (val) {
        if (this.form.city && this.count1 != 1) {
          this.form.city = ''
        }
        this.getCity()
        this.count1++
      }
    },
    'form.city': function (val, oldval) {
      if (val) {
        if (this.form.region && this.count2 != 1) {
          this.form.region = ''
        }
        this.getRegion()
        this.count2++
      }
    },
  },

  methods: {
    getTaskList() {
      this.form.taskId = ''
      const params = {
        receiptType: 1,
        taskType: this.taskType,
        belongto: this.belongto,
        exportAttendanceTask: true
      }
      console.log(params)

      this.$api.mainTaskList(params).then((response) => {
        const {
          data: {
            list,
            pages,
            total,
            pageNum,
          },
        } = response.data;
        this.taskList = list
        let obj = {
          taskName: "不限",
          id: ''
        }
        this.taskList.unshift(obj)
        this.pageCount = pages
      }).catch((error) => {
        console.log(error);
      });
    },
    getbelongtoList() {
      this.$api
        .getAllBelongToList()
        .then(response => {
          this.belongtoList = response.data;
          let obj = {
            belongToName: "不限",
            id: ''
          }
          this.belongtoList.unshift(obj)
          console.log(this.belongtoList)
        })
        .catch(error => {
          console.log(error);
        });
    },
    handleExort(type) {
      console.log(type)
      if (type == 1) {
        this.loading1 = true
      } else {
        this.loading2 = true
      }
      const params = {
        taskId: this.form.taskId,
        startDate: this.form.startDate,
        endDate: this.form.endDate,
        settlementType: this.form.settlementType,
        taskType: this.taskType,
        belongto: this.belongto,
        belongtoName: this.belongtoName,
        attendanceType: type,
      }
      this.$api
        .attendanceExport(params)
        .then(response => {
          if (response.data.respCode == 0) {
            this.$router.push({ name: 'AttendenceList' })
            window.open(response.data.data)

          }
          if (type == 1) {
            this.loading1 = false
          } else {
            this.loading2 = false
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    getNextMonth(date) {
      var arr = util.dayTime(date).split("-");
      var year = arr[0]; //获取当前日期的年份
      var month = arr[1]; //获取当前日期的月份
      var day = arr[2]; //获取当前日期的日
      var days = new Date(year, month, 0);
      days = days.getDate(); //获取当前日期中的月的天数
      var year2 = year;
      var month2 = parseInt(month) + 1;
      if (month2 == 13) {
        year2 = parseInt(year2) + 1;
        month2 = 1;
      }
      var day2 = day;
      var days2 = new Date(year2, month2, 0);
      days2 = days2.getDate();
      if (day2 > days2) {
        day2 = days2;
      }
      if (month2 < 10) {
        month2 = "0" + month2;
      }
      let endtime = year2 + "-" + month2 + "-" + day2
      this.nextDate = new Date(endtime)
    },
    getPreMonth(date) {
      var arr = util.dayTime(date).split('-');
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
      this.preTime = new Date(t2)
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
