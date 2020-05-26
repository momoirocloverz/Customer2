<template>
  <div style="background-color:#f2f2f5;" v-loading="loading" element-loading-text="正在导出excel表...">
    <el-form ref="formDetail" :model="formDetail" label-width="100px" labelPosition="left" style="background-color:white;padding-left:20px;">
      <div style="display:flex;align-items:center;padding:20px 20px 20px 0;" class="search-zone">
        <div style="display:flex;align-items:center;">
          <el-select v-model="formDetail.taskId" filterable clearable placeholder="输入任务名称搜索" class="inputWidth">
          <el-option v-for="item in customers" :key="item.id" :label="`${item.taskName} / ${item.status} / ${item.startTime}-${item.endTime}`" :value="item.id">
          </el-option>
        </el-select>
        <el-button type="primary" size="small" class="searchBtn keyWBtn" @click="searchTaskName">搜索</el-button>
        </div>
        <el-button style="margin-left:20px" class="comb-btn" size="mini" type="text" @click="handleCombShow">高级筛选<i class="el-icon-right el-icon-d-arrow-right" :class="isShowComb ? 'el-icon-d-arrow-right-down' : 'el-icon-d-arrow-right-right'"></i></el-button>
      </div>
      <div v-show="isShowComb" class="combine-zone" style="border-top: 1px solid #EAEDF4">
        <el-form-item label="日期范围：" class="formSearchMargin" style="margin-top:15px">
          <el-radio-group class="radio-search" v-model="formDetail.date">
            <el-radio label="">不限</el-radio>
            <el-radio label="5">本月</el-radio>
            <el-radio label="1">最近7天</el-radio>
            <el-radio label="2">最近30天</el-radio>
            <el-radio label="3">最近90天</el-radio>
            <el-radio label="4">自定义</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="自定义：" class="formSearchMargin" v-if="formDetail.date == '4'">
          <el-date-picker class="margin_left40" size="mini" v-model="formDetail.startDate" type="date" value-format="yyyy-MM-dd" placeholder="选择开始时间">
          </el-date-picker>
          --
          <el-date-picker class="margin_left10" size="mini" v-model="formDetail.endDate" type="date" value-format="yyyy-MM-dd" placeholder="选择结束时间">
          </el-date-picker>
          <el-button type="primary" size="small" class="datesearchBtn" @click="btn_true">确定</el-button>
        </el-form-item>
        <el-form-item label="项目经理：" class="formSearchMargin">
          <el-radio-group style="padding:13px 0 0 0;display: flex;" class="radio-search" v-model="formDetail.taskManagerId">
            <el-radio label="">不限</el-radio>
            <div style="margin-left:15px;" :class="{showHeight: isShowHeight}">
              <el-radio :label="item.id" :value="item.id" :key="item.id" class="elRadio" v-for="item in mangersId">{{item.nameAlias}}</el-radio>
            </div>
          </el-radio-group>
          <el-button v-show="this.nameAliasLength.length>16" style="padding:0;margin-left:60px;" class="myplain-btn" size="mini" type="text" @click="unfload">{{htmlTxt}}<i class="el-icon-arrow-down" :class="[isShowHeight ? 'el-icon-arrow-down':'el-icon-arrow-up']"></i></el-button>
        </el-form-item>
      </div>
    </el-form>
    <div style="background-color:white;border:1px solid #E6E7EB;margin-top:18px;">
      <div style="padding-left:24px;border-bottom: 1px solid #E6E7EB;height:50px;line-height:50px;font-size:12px;">
        合计<span class="fontsizecolor">&nbsp;{{moneyTotal.totalWorkHours || 0}}&nbsp;</span>小时，
        <span class="fontsizecolor">&nbsp;{{moneyTotal.totalJian || 0}}&nbsp;</span>件，
        <span class="fontsizecolor">&nbsp;{{moneyTotal.totalDai || 0}}&nbsp;</span>袋，
        <span class="fontsizecolor">&nbsp;{{moneyTotal.totalChe || 0}}&nbsp;</span>车，
        <span class="fontsizecolor">&nbsp;{{moneyTotal.totalDun || 0}}&nbsp;</span>吨，
        合计金额<span class="fontsizecolor">&nbsp;{{moneyTotal.totalAmount || 0}}&nbsp;</span>元
      </div>
      <div>
        <el-button class="myplain-btn" size="small" style="margin:6px 0 6px 24px;width:98px;" :disabled="isDisabled" @click="exportExcel">导出</el-button>
      </div>
    </div>
    <div class="table-box back-white">
      <el-table class="table-outline" :data="tableData" emptyText="暂无相关信息" style="width: 100%;">
        <el-table-column label="任务" prop="taskName" align="center" min-width="180"></el-table-column>
        <el-table-column label="项目经理" prop="managerNameAlias" align="center" min-width="180"></el-table-column>
        <el-table-column label="工时" prop="totalWorkHours" align="center" min-width="180"></el-table-column>
        <el-table-column label="产量" show-overflow-tooltip align="center" min-width="180">
          <template v-slot="scope">
            <span>{{scope.row.totalJian+'件' || 0}},{{scope.row.totalDai+'袋' || 0}},{{scope.row.totalChe+'车' || 0}},{{scope.row.totalDun+'吨' || 0}}</span>
          </template>
        </el-table-column>
        <el-table-column label="金额" prop="totalAmount" align="center" min-width="180"></el-table-column>
        <el-table-column label="操作" align="center" min-width="180">
          <template v-slot="scope">
            <el-button size="small" type="text" @click="goToHandlerPayDetails(scope.row)">明细</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination-container">
        <el-pagination class="pagebox" layout="prev, pager, next" @current-change="handleCurrentChange" :current-page="currentPage" :page-count="pageCount">
        </el-pagination>
      </div>
    </div>
  </div>
</template>
<script>
import Interval from '../../../../common/interval.js'
export default {
  data() {
    return {
      isShowComb: false,
      htmlTxt: '全部展示',
      isShowHeight: true,
      loading: false,
      isDisabled: false,
      total: 0,
      currentPage: 1,
      pageCount: 0,
      pageSize: 20,
      inputVal: '',
      selectVal: '',
      formDetail: {
        date: '5',
        businessType: '',
        income: '',
        taskManagerId: '',
        startDate: '',
        endDate: '',
        // taskName: ''
      },
      tableData: [{ note: 1, receiveTime: 2, receiveTime: 3, type: 4, amount: 5 }],
      customers: [],
      mangersId: [],
      moneyTotal: {},
      nameAliasLength: ''
    }
  },
  watch: {
    'formDetail.date': function (val, old) {
      if (val == '') {
        this.currentPage = 1
        this.getData()
        this.getTotalData()
      } else if (val == '1') {
        this.currentPage = 1
        this.getData()
        this.getTotalData()
      } else if (val == '2') {
        this.currentPage = 1
        this.getData()
        this.getTotalData()
      } else if (val == '3') {
        this.currentPage = 1
        this.getData()
        this.getTotalData()
      } else if (val == '5') {
        this.currentPage = 1
        this.getData()
        this.getTotalData()
      } else if (val == '4') {
        this.formDetail.endDate = ''
        this.formDetail.startDate = ''
      }
    },
    'formDetail.taskManagerId': function (val, old) {
      this.currentPage = 1
      this.getData()
      this.getTotalData()
    }
  },
  methods: {
    handleCombShow() {
      this.isShowComb = !this.isShowComb
    },
    unfload() {
      this.isShowHeight = !this.isShowHeight
      if (this.isShowHeight) {
        this.htmlTxt = '全部展示'
      } else {
        this.htmlTxt = '收起'
      }
    },
    getData() {
      if (this.formDetail.date == '') {
        this.formDetail.endDate = ''
        this.formDetail.startDate = ''
      } else if (this.formDetail.date == '1') {
        this.formDetail.endDate = Interval.getDay(0)
        this.formDetail.startDate = Interval.getDay(-7)
      } else if (this.formDetail.date == '2') {
        this.formDetail.endDate = Interval.getDay(0)
        this.formDetail.startDate = Interval.getDay(-30)
      } else if (this.formDetail.date == '3') {
        this.formDetail.endDate = Interval.getDay(0)
        this.formDetail.startDate = Interval.getDay(-90)
      } else if (this.formDetail.date == '5') {
        this.formDetail.endDate = Interval.getDay(0)
        this.formDetail.startDate = new Date().getFullYear()+ '-' +((new Date().getMonth() + 1).toString().length == 1 ? '0'+(new Date().getMonth() + 1) : (new Date().getMonth() + 1))+'-01'
      } else if (this.formDetail.date == '4') {
        this.formDetail.endDate = this.formDetail.endDate
        this.formDetail.startDate = this.formDetail.startDate
      }
      let params = {
        pageNum: this.currentPage,
        pageSzie: this.pageSzie,
        startDate: this.formDetail.startDate,
        endDate: this.formDetail.endDate,
        // taskName: this.formDetail.taskName,
        taskId: this.formDetail.taskId,
        taskManagerId: this.formDetail.taskManagerId,
        showOutsourcing:true,
        outsourcingCusId: this.$route.query.outsourcingCusId,
      }
      this.$api.NeedPaySummaryList(params).then(res => {
        console.log(res)
        if (res.data.respCode == 0) {
          if (res.data.data) {
            const {
              data: {
                list,
                pages,
                pageNum,
                total
              }
            } = res.data
            this.tableData = list
            this.pageCount = pages
          }
        }
      }).catch()
    },
    getTotalData() {
      let params = {
        pageNum: this.currentPage,
        pageSzie: this.pageSzie,
        startDate: this.formDetail.startDate,
        endDate: this.formDetail.endDate,
        // taskName: this.formDetail.taskName,
        taskId: this.formDetail.taskId,
        taskManagerId: this.formDetail.taskManagerId,
        showOutsourcing:true,
        outsourcingCusId: this.$route.query.outsourcingCusId,
      }
      // this.customers = []
      this.$api.NeedPaySummaryListData(params).then(res => {
        console.log(res)
        if (res.data.respCode == 0) {
          if (res.data.data) {
            this.isDisabled = false
            this.moneyTotal = res.data.data
            // if(!sessionStorage.getItem('customerName')){
            //   sessionStorage.setItem('customerName', JSON.stringify(res.data.data.taskList))
            // }
            // this.customers = JSON.parse(sessionStorage.getItem('customerName'))
            // this.customers.forEach(item => {
            //   if (item.status == 2) {
            //     item.status = '进行中'
            //   } else if (item.status == 3) {
            //     item.status = '已结束'
            //   }
            //   if (item.startTime) {
            //     item.startTime = item.startTime.substr(0, 10)
            //   } else {
            //     item.startTime = ''
            //   }
            //   if (item.endTime) {
            //     item.endTime = item.endTime.substr(0, 10)
            //   } else {
            //     item.endTime = ''
            //   }
            // });
          } else {
            this.moneyTotal = {}
            this.isDisabled = true
          }
        }
      }).catch()
    },
    getReceived(){
      this.$api.received().then(res => {
        console.log(res)
        if(res.respCode == 0){
          if(res.data && res.data.length > 0){
            this.taskList = res.data
            this.taskList.forEach(item => {
              if (item.status == 2) {
                item.status = '进行中'
              } else if (item.status == 3) {
                item.status = '已结束'
              }
              if (item.startTime) {
                item.startTime = item.startTime.substr(0, 10)
              } else {
                item.startTime = ''
              }
              if (item.endTime) {
                item.endTime = item.endTime.substr(0, 10)
              } else {
                item.endTime = ''
              }
            })
          }
        }
      }).catch()
    },
    exportExcel() {
      let params = {
        pageNum: this.currentPage,
        pageSzie: this.pageSzie,
        startDate: this.formDetail.startDate,
        endDate: this.formDetail.endDate,
        // taskName: this.formDetail.taskName,
        taskId: this.formDetail.taskId,
        taskManagerId: this.formDetail.taskManagerId,
        showOutsourcing:true,
        outsourcingCusId: this.$route.query.outsourcingCusId,
      }
      this.$api.NeedPaySummaryExport(params)
        .then(res => {
          // console.log(res)
          if (res.data.respCode == 0) {
            this.loading = true
            setTimeout(() => {
              this.loading = false
            }, 2000)
            if (res.data.data) {
              window.open(res.data.data)
            }
          }else if(res.data.respCode == -1){
            this.loading = false
          }
        }).catch()
    },
    btn_true() {
      if(this.formDetail.startDate && !this.formDetail.endDate){

      }else if(this.formDetail.startDate == '' && this.formDetail.endDate == ''){
        return this.$message.error('开始日期和结束日期不能为空!')
      }else if(!this.formDetail.startDate && this.formDetail.endDate){
        return this.$message.error('开始日期不能为空!')
      }
      this.currentPage = 1
      this.getData()
      this.getTotalData()
    },
    searchTaskName() {
      this.currentPage = 1
      this.getData()
      this.getTotalData()
    },
    getCusPayManagerList() {
      this.$api.CusPayManagerList().then(res => {
        // console.log(res)
        if (res.data.respCode == 0) {
          if (res.data.data) {
            this.mangersId = res.data.data
            this.mangersId.forEach(item => {
              this.nameAliasLength = item.nameAlias
            })
          }
        }
      }).catch()
    },
    goToHandlerPayDetails(row) {
      // console.log(row)
      // alert(this.formDetail.startTime)
      const { href } = this.$router.resolve({
        name: 'outHandlerPayDetails',
        query: {
          taskId: row.taskId,
          taskName: row.taskName,
          startDate: this.formDetail.startDate,
          endDate: this.formDetail.endDate
        }
      })
      // alert(href)
      window.open(href, '_blank')
    },
    handleCurrentChange(val) {
      // this.currentPage = val
      console.log(val)
    },
  },
  mounted() {
    this.getData()
    this.getCusPayManagerList()
    this.getTotalData()
    this.getReceived()
  }
}
</script>
<style scoped>
.formSearchMargin {
  margin-bottom: 0;
}
.datesearchBtn {
  margin-left: 15px;
}
.fontsizecolor {
  color: #e84518;
}
.elRadio {
  padding-bottom: 15px;
  margin-left: 0px;
}
.searchBtn {
  width: 100px;
  height: 34px;
  margin-left: 0px;
}
.inputWidth {
  width: 520px;
  margin-right: 15px;
}
.showHeight {
  height: 50px;
  overflow: hidden;
}
</style>


