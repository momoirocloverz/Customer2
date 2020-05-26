<template>
  <div>
    <el-form :model="form" label-width="100px" labelPosition="center">
      <el-form-item label="班务经理：" class="formSearchMargin topMargin">
        <el-radio-group class="radio-search" v-model="form.managerId">
          <el-radio label="">不限</el-radio>
          <el-radio :label="item.id" v-for="item in manageIds" :key="item.id" :value="item.id">{{item.nameAlias}}</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="月份：" class="formSearchMargin">
        <el-radio-group class="radio-search" v-model="form.months">
          <el-radio label="">不限</el-radio>
          <el-radio label="1">自定义</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="自定义：" class="formSearchMargin dai-gn" v-if="form.months == '1'">
        <el-date-picker class="margin_left40" size="mini" v-model="form.monthStart" type="month" value-format="yyyy-MM-dd" placeholder="选择开始时间"  :picker-options="pickerOptions">
        </el-date-picker>
        --
        <el-date-picker class="margin_left10" size="mini" v-model="form.monthEnd" type="month" value-format="yyyy-MM-dd" placeholder="选择结束时间"  :picker-options="pickerOptions">
        </el-date-picker>
        <el-button type="primary" size="small" class="datesearchBtn newbtn" @click="btn_click">确定</el-button>
      </el-form-item>
    </el-form>
    <el-table :data="tableData" empty-text="暂无相关信息">
      <el-table-column label="班务经理" prop="managerName" show-overflow-tooltip align="center" min-width="80"></el-table-column>
      <el-table-column label="月份" prop="yearMonthStr" show-overflow-tooltip align="center" min-width="80"></el-table-column>
      <el-table-column label="收入（元）" prop="totalIn" show-overflow-tooltip align="center" min-width="80"></el-table-column>
      <el-table-column label="支出（元）" prop="totalOut" show-overflow-tooltip align="center" min-width="80"></el-table-column>
      <el-table-column label="利润（元）" prop="profit" show-overflow-tooltip align="center" min-width="80"></el-table-column>
      <el-table-column label="操作" align="center" min-width="180">
        <template slot-scope="scope">
          <el-button type="text" class="btn-icon btn-icon-view" size="mini" @click="checkYiDetail(scope.row.managerId, scope.row.managerName, scope.row.yearMonthStr)">查看</el-button>
          <el-button type="text" class="btn-icon" size="mini" @click="checkYiChart(scope.row)"><i class="btn_icon"></i>&nbsp;&nbsp;&nbsp;趋势图</el-button>
        </template>
      </el-table-column>
    </el-table>

    <div class="pagination-container">
      <el-pagination class="pagebox" :total="total" layout="total , prev, pager, next, jumper" @current-change="handleCurrentChange" :current-page="currentPage" :page-size="pageSize" :page-count="pageCount">
      </el-pagination>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      tableData: [],
      currentPage: 1,
      pageSize: 20,
      total: 0,
      pageCount: 0,
      manageIds: [],
      form: {
        managerId: '',
        months: '',
        monthStart: '',
        monthEnd: '',
      },
        pickerOptions:{
                disabledDate(time) {
                    return time.getTime() < new Date(2019,2,28);
                },
            }
    }
  },
  mounted() {
    this.getList()
    this.getManageId()
  },
  watch: {
    // form: {
    //   handler() {
    //     this.currentPage = 1
    //     this.getList()
    //   },
    //   deep: true
    // }
    'form.months':function(val,old){
      if(val == ''){
        this.currentPage = 1
        this.getList()
      }else if(val == '1'){
        this.form.monthStart = ''
        this.form.monthEnd = ''
      }
    },
    'form.managerId': function(val,old){
      this.currentPage = 1
      this.getList()
    }
  },
  methods: {
    getList() {
      if(this.form.months == ''){
        this.form.monthStart = ''
        this.form.monthEnd = ''
      }else if(this.form.months == '1'){
        this.form.monthStart = this.form.monthStart
        this.form.monthEnd = this.form.monthEnd
      }
      let param = {
        managerId: this.form.managerId,
        monthStart: this.form.monthStart,
        monthEnd: this.form.monthEnd,
        pageNum: this.currentPage,
        pageSize: this.pageSize
      }

      this.$api.profitQueryYet(param)
        .then(res => {
//          console.log(res)
          if (res.respCode == 0) {
            let data = res.data
            this.total = data.total
            this.tableData = data.list
            this.pageCount = data.pages
          }
        })
        .catch(err => {
          console.log(err)
        })

    },
    handleCurrentChange(val) {
      this.currentPage = val
      this.getList()
    },
    btn_click(){
            if(!this.form.monthStart&&!this.form.monthEnd){
                return this.$message.error('时段不能为空')
            }else if(!this.form.monthStart){
                return this.$message.error('开始时间不能为空')
            }else if(!this.form.monthEnd){
                return this.$message.error('结束时间不能为空')
            }else if(this.form.monthStart > this.form.monthEnd){
                return this.$message.error('结束时间不能早于开始时间')
            }
      this.currentPage = 1
      this.getList()
    },
    checkYiDetail(id, name, month) {
      const { href } = this.$router.resolve({
        name: 'yiCheckDetail',
        query: {
          id: id,
          name: name,
          month: month
        }
      })
      window.open(href, '_blank')
    },
    checkYiChart(row) {
      // console.log(row)
      const { href } = this.$router.resolve({
        name: 'yiCheckChart',
        params: {
          id: row.managerId,
        }
      })
      window.open(href, '_blank')
    },
    getManageId() {
      let params = {
        bindingStatus: -1
      }
      this.$api.getPmListCus(params).then(res => {
          if (res.data) {
            this.manageIds = res.data
          }
      })
        .catch(err => {
          console.log(err)
        })
    }
  }
}
</script>

<style scoped lang="scss">
  .radio-search{
    overflow: hidden;
    width: calc(100% - 30px);
    flex-direction: row;
    flex-wrap: wrap;
    height: auto !important;
    label{
      padding:8px 0 5px;
    }
  }
  .dai-gn{
    padding-bottom: 10px;
  }
    .topMargin {
        margin-top: 15px;
    }
.newbtn {
  margin-left: 15px;
}
.el-form-item {
  margin-bottom: 0 !important;
}
.btn_icon {
  display: inline-block;
  width: 18px;
  height: 14px;
  background-image: url("../../../../assets/images/btnicon.png");
  background-size: cover;
}
</style>
