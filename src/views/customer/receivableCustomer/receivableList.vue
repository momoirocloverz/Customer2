<template>
  <div style="background-color:#f2f2f5; " class="receivableListCon" v-loading="loading" element-loading-text="正在导出excel表...">
    <el-form ref="formDetail" :model="formDetail" label-width="100px" labelPosition="left" style="background-color:white;padding-left:20px;">
      <div style="display:flex;align-items:center;padding:20px 20px 20px 0;" class="search-zone">
        <div style="display:flex;align-items:center;">
          <div v-if="formDetail.status == '任务名称'" style="margin: 0 12px 0 0;" class="limtScoped">
          <el-select v-model="formDetail.taskId" filterable clearable placeholder="输入任务名称搜索" class="inputWidth">
            <el-option v-for="(item,index) in taskList" :key="index" :label="`${item.taskName} / ${item.status} / ${item.startTime}-${item.endTime}`" :value="item.id">
            </el-option>
          </el-select>
        </div>
        <div v-if="formDetail.status == '零工姓名'">
          <!-- <el-select v-model="formDetail.talentName" filterable clearable placeholder="输入零工姓名搜索" class="inputWidth">
            <el-option v-for="item in talentNameAliasList" :key="item" :label="item" :value="item">
            </el-option>
          </el-select> -->
          <el-input class="rant-input inputWidth keyWFormParent" placeholder="输入交易对象姓名搜索" v-model="formDetail.talentName"></el-input>
        </div>
        <div>
          <el-select v-model="formDetail.status" placeholder="请选择" style="width:160px">
            <el-option v-for="item in nameStatus" :key="item.id" :label="item.name" :value="item.name">
            </el-option>
          </el-select>
        </div>
        <el-button type="primary" size="small" class="searchBtn" @click="btn_true_serach">搜索</el-button>
        </div>
        <el-button style="margin-left:20px" class="comb-btn" size="mini" type="text" @click="handleCombShow">高级筛选<i class="el-icon-right el-icon-d-arrow-right" :class="isShowComb ? 'el-icon-d-arrow-right-down' : 'el-icon-d-arrow-right-right'"></i></el-button>
      </div>
      <div v-show="isShowComb" class="combine-zone" style="border-top: 1px solid #EAEDF4">
        <el-form-item label="日期范围：" class="formSearchMargin" style="margin-top:15px">
          <el-radio-group class="radio-search" v-model="formDetail.date">
            <el-radio label="">不限</el-radio>
            <el-radio label="5">本月</el-radio>
            <el-radio label="1">最近30天</el-radio>
            <el-radio label="2">自定义</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="自定义：" class="formSearchMargin" v-if="formDetail.date == '2'">
          <el-date-picker class="margin_left40" size="mini" v-model="formDetail.startDate" type="date" value-format="yyyy-MM-dd" placeholder="选择开始时间">
          </el-date-picker>
          --
          <el-date-picker class="margin_left10" size="mini" v-model="formDetail.endDate" type="date" value-format="yyyy-MM-dd" placeholder="选择结束时间">
          </el-date-picker>
          <el-button type="primary" size="small" class="datesearchBtn" @click="btn_true">确定</el-button>
        </el-form-item>
        <el-form-item label="客户：" class="formSearchMargin">
          <el-radio-group class="radio-search" v-model="formDetail.subCustomerId">
            <el-radio label="">不限</el-radio>
            <div>
              <el-radio :label="item.id" :key="item.id" :value="item.id" v-for="item in customerList">{{item.shortName}}</el-radio>
            </div>
          </el-radio-group>
        </el-form-item>
      </div>
      <!-- <el-form-item label="状态：" class="formSearchMargin">
        <el-radio-group class="radio-search" v-model="formDetail.nameStatus">
          <el-radio label="1">任务名称</el-radio>
          <el-radio label="2">零工姓名</el-radio>
        </el-radio-group>
      </el-form-item> -->
      <!-- <el-form-item label="任务名称：" class="formSearchMargin" v-if="formDetail.nameStatus == 1">
        <el-select v-model="formDetail.taskId" filterable placeholder="输入任务名称搜索" class="inputWidth">
          <el-option v-for="item in taskList" :key="item.id" :label="`${item.taskName} / ${item.status} / ${item.startTime}-${item.endTime}`" :value="item.id">
          </el-option>
        </el-select>
        <el-button type="primary" size="small" class="searchBtn" @click="searchTaskName">搜索</el-button>
      </el-form-item>
      <el-form-item label="零工姓名：" class="formSearchMargin" v-if="formDetail.nameStatus == 2">
        <el-select v-model="formDetail.talentName" filterable placeholder="输入零工姓名搜索" class="inputWidth">
          <el-option v-for="item in talentNameAliasList" :key="item" :label="item" :value="item">
          </el-option>
        </el-select>
        <el-button type="primary" size="small" class="searchBtn" @click="searchTaskName">搜索</el-button>
      </el-form-item> -->
    </el-form>
    <div style="background-color:white;border:1px solid #E6E7EB;margin-top:18px;">
      <div style="display:flex;justify-content: space-between;padding:0 24px 0 24px;border-bottom: 1px solid #E6E7EB;height:50px;line-height:50px;font-size:12px;">
        <div>
          合计<span class="fontsizecolor">&nbsp;{{moneyList.totalWorkHours || 0}}&nbsp;</span>小时，
          <span class="fontsizecolor">&nbsp;{{moneyList.totalJian || 0}}&nbsp;</span>件，
          <span class="fontsizecolor">&nbsp;{{moneyList.totalDai || 0}}&nbsp;</span>袋，
          <span class="fontsizecolor">&nbsp;{{moneyList.totalDun || 0}}&nbsp;</span>吨，
          <span class="fontsizecolor">&nbsp;{{moneyList.totalChe || 0}}&nbsp;</span>车
        </div>
        <div style="color:#5c5c5c;cursor:pointer;" @click="goToNotProceedCheckWorker" v-if="notTotal != 0">
          <span style="color:#e84518">{{notTotal}}个排班未进行客户结算</span>
          <i style="color:#e84518;font-weight: bold;" class="el-icon-arrow-right"></i>
        </div>
      </div>
      <div>
        <el-button class="myplain-btn" size="small" style="margin:6px 0 6px 24px;width:98px;" :disabled="isDisabled" @click="exportExcel">导出</el-button>
      </div>
    </div>
    <div class="table-box back-white">
      <el-table class="table-outline" :data="tableData" emptyText="暂无相关信息" style="width: 100%;" @sort-change="sortWayTable">
        <el-table-column label="客户" sortable="custom" prop="subCusShortName" align="center" min-width="80"></el-table-column>
        <el-table-column label="零工" prop="talentNameAlias" align="center" min-width="80"></el-table-column>
        <el-table-column label="工作日期" sortable="custom" prop="schedulingDate" align="center" min-width="80"></el-table-column>
        <el-table-column label="任务" sortable="custom" prop="taskName" align="center" min-width="80"></el-table-column>
        <el-table-column label="工种" prop="industryName" align="center" min-width="80"></el-table-column>
        <el-table-column label="上班时间" prop="customerStartTime" align="center" min-width="80"></el-table-column>
        <el-table-column label="下班时间" prop="customerEndTime" align="center" min-width="80"></el-table-column>
        <el-table-column label="工时" prop="customerWorkHours" align="center" min-width="80"></el-table-column>
        <el-table-column label="产量" show-overflow-tooltip prop="pieceSize" align="center" min-width="80">
          <template v-slot="scope">
            <span>
              {{scope.row.pieceSize ? JSON.parse(scope.row.pieceSize).jian == '' ? '无' : JSON.parse(scope.row.pieceSize).jian + '件，' : '无'}}
              {{scope.row.pieceSize ? JSON.parse(scope.row.pieceSize).dai == '' ? '' : JSON.parse(scope.row.pieceSize).dai + '袋，' : ''}}
              {{scope.row.pieceSize ? JSON.parse(scope.row.pieceSize).che == '' ? '' : JSON.parse(scope.row.pieceSize).che + '车，' : ''}}
              {{scope.row.pieceSize ? JSON.parse(scope.row.pieceSize).dun == '' ? '' : JSON.parse(scope.row.pieceSize).dun + '吨' : ''}}
            </span>
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
import Interval from '../../../common/interval.js'
export default {
  data() {
    return {
      isShowComb: false,
      loading: false,
      isDisabled: false,
      total: 0,
      currentPage: 1,
      pageCount: 0,
      pageSize: 10,
      selectVal: '',
      formDetail: {
        date: '5',
        status: '任务名称',
        taskId: '',
        talentName: '',
        subCustomerId: '',
        startDate: '',
        endDate: ''
      },
      tableData: [],
      customerList: [],
      moneyList: {},
      taskList: [],
      talentNameAliasList: [],
      nameStatus: [{ name: '任务名称', id: 1 }, { name: '零工姓名', id: 2 }],
      notTotal: 0,
      orderByType: 0,
      sortWay: ''
    }
  },
  watch: {
    'formDetail.date': function (val, old) {
      if (val == '') {
        this.currentPage = 1
        this.getData()
        this.getMoneyData()
      } else if (val == '1') {
        this.currentPage = 1
        this.getData()
        this.getMoneyData()
      } else if (val == '5') {
        this.currentPage = 1
        this.getData()
        this.getMoneyData()
      } else if (val == '2') {
        this.formDetail.endDate = ''
        this.formDetail.startDate = ''
      }
    },
    'formDetail.taskManagerId': function (val, old) {
      this.currentPage = 1
      this.getData()
      this.getMoneyData()
    },
    'formDetail.subCustomerId': function (val, old) {
      this.currentPage = 1
      this.getData()
      this.getMoneyData()
    },
    'formDetail.status': function(val,old){
      this.formDetail.talentName = ''
       this.formDetail.taskId = ''
      this.currentPage = 1
      this.getData()
      this.getMoneyData()
    }
  },
  methods: {
    handleCombShow() {
      this.isShowComb = !this.isShowComb
    },
    sortWayTable(column, prop, order) {
      this.orderByType = 0
      this.sortWay = ''
      // console.log(column.prop)
      if (this.formDetail.date == '') {
        this.formDetail.endDate = ''
        this.formDetail.startDate = ''
      } else if (this.formDetail.date == '1') {
        this.formDetail.endDate = Interval.getDay(0)
        this.formDetail.startDate = Interval.getDay(-30)
      } else if (this.formDetail.date == '5') {
        this.formDetail.endDate = Interval.getDay(0)
        this.formDetail.startDate = new Date().getFullYear()+ '-' +((new Date().getMonth() + 1).toString().length == 1 ? '0'+(new Date().getMonth() + 1) : (new Date().getMonth() + 1))+'-01'
      } else if (this.formDetail.date == '2') {
        this.formDetail.endDate = this.formDetail.endDate
        this.formDetail.startDate = this.formDetail.startDate
      }
      if (column.prop == "subCusShortName") {
        this.orderByType = 1
        this.sortWay = column.order == "descending" ? column.order.substr(0, 4) : (column.order == "ascending" ? column.order.substr(0, 3) : '')
      } else if (column.prop == "schedulingDate") {
        this.orderByType = 2
        this.sortWay = column.order == "descending" ? column.order.substr(0, 4) : (column.order == "ascending" ? column.order.substr(0, 3) : '')
      } else if (column.prop == "taskName") {
        this.orderByType = 3
        this.sortWay = column.order == "descending" ? column.order.substr(0, 4) : (column.order == "ascending" ? column.order.substr(0, 3) : '')
      }
      let params = {
        pageNum: this.currentPage,
        pageSize: this.pageSize,
        startDate: this.formDetail.startDate,
        endDate: this.formDetail.endDate,
        subCustomerId: this.formDetail.subCustomerId,
        taskId: this.formDetail.taskId,
        talentName: this.formDetail.talentName,
        orderByType: this.orderByType,
        sortWay: this.sortWay
      }
      console.log(params)
      this.$api.SubCusAttendanceList(params).then(res => {
        // console.log(res)
        if (res.data.respCode == 0) {
          if (res.data.data) {
            const {
              data: {
                list,
                pageNum,
                total,
                pages
              }
            } = res.data
            this.tableData = list
            this.pageCount = pages
          }
        }
      }).catch()
    },
    getData() {
      if (this.formDetail.date == '') {
        this.formDetail.endDate = ''
        this.formDetail.startDate = ''
      } else if (this.formDetail.date == '1') {
        this.formDetail.endDate = Interval.getDay(0)
        this.formDetail.startDate = Interval.getDay(-30)
      } else if (this.formDetail.date == '5') {
        this.formDetail.endDate = Interval.getDay(0)
        this.formDetail.startDate = new Date().getFullYear()+ '-' +((new Date().getMonth() + 1).toString().length == 1 ? '0'+(new Date().getMonth() + 1) : (new Date().getMonth() + 1))+'-01'
      } else if (this.formDetail.date == '2') {
        this.formDetail.endDate = this.formDetail.endDate
        this.formDetail.startDate = this.formDetail.startDate
      }
      let params = {
        pageNum: this.currentPage,
        pageSize: this.pageSize,
        startDate: this.formDetail.startDate,
        endDate: this.formDetail.endDate,
        subCustomerId: this.formDetail.subCustomerId,
        taskId: this.formDetail.taskId,
        talentName: this.formDetail.talentName,
        orderByType: this.orderByType,
        sortWay: this.sortWay
      }
      this.$api.SubCusAttendanceList(params).then(res => {
        // console.log(res)
        if (res.data.respCode == 0) {
          if (res.data.data) {
            const {
              data: {
                list,
                pageNum,
                total,
                pages
              }
            } = res.data
            this.tableData = list
            this.pageCount = pages
          }
        }
      }).catch()
    },
    getMoneyData() {
      let params = {
        pageNum: this.currentPage,
        pageSize: this.pageSize,
        startDate: this.formDetail.startDate,
        endDate: this.formDetail.endDate,
        subCustomerId: this.formDetail.subCustomerId,
        taskId: this.formDetail.taskId,
        talentName: this.formDetail.talentName,
        orderByType: this.orderByType,
        sortWay: this.sortWay
      }
      // this.taskList = []
      this.talentNameAliasList = []
      this.$api.SubCusAttendanceListSumData(params).then(res => {
        // console.log(res)
        if (res.data.respCode == 0) {
          if (res.data.data) {
            this.isDisabled = false
            this.moneyList = res.data.data
            // if(!sessionStorage.getItem('talentNameAlias') || !sessionStorage.getItem('taskName')){
            // sessionStorage.setItem('talentNameAlias', res.data.data.talentNameAliasList)
            // sessionStorage.setItem('taskName', JSON.stringify(res.data.data.taskList))
            // }
            // this.talentNameAliasList = sessionStorage.getItem('talentNameAlias').split(',')
            // this.taskList = JSON.parse(sessionStorage.getItem('taskName'))
            // this.taskList.forEach(item => {
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
            // })
          } else {
            this.moneyList = {}
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
        pageSize: this.pageSize,
        startDate: this.formDetail.startDate,
        endDate: this.formDetail.endDate,
        subCustomerId: this.formDetail.subCustomerId,
        taskId: this.formDetail.taskId,
        talentName: this.formDetail.talentName,
        orderByType: this.orderByType,
        sortWay: this.sortWay
      }
      this.$api.SubCusAttendanceListExport(params)
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
    getScheduingList() {
      let params = {
        pageNum: this.currentPage,
        pageSize: -1
      }
      this.$api.SchedulingCustomerList(params).then(res => {
        // console.log(res)
        if (res.data.respCode == 0) {
          if (res.data.data) {
            this.notTotal = res.data.data.total
          }
        }
      }).catch()
    },
    btn_true_serach(){
      this.currentPage = 1
      this.getData()
      this.getMoneyData()
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
      this.getMoneyData()
    },
    getCustomerList() {
      this.$api.AllSubList().then(res => {
        // console.log(res)
        if (res.data.respCode == 0) {
          if (res.data.data) {
            this.customerList = res.data.data
          }
        }
      }).catch()
    },
    handleCurrentChange(val) {
      this.currentPage = val
      this.getData()
      this.getMoneyData()
    },
    goToNotProceedCheckWorker() {
      const { href } = this.$router.resolve({
        name: 'notProceedCheckCustomer'
      })
      window.open(href, '_blank')
    },
  },
  mounted() {
    this.getData()
    this.getMoneyData()
    this.getCustomerList()
    this.getScheduingList()
    this.getReceived()
  }
}
</script>
<style scoped lang="scss">    
    .receivableListCon { 
        .keyWFormParent {
            width: 520px !important;
            margin-right: 12px;
        }
    }
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
  padding: 15px 0;
  margin-left: 0px;
}
.searchBtn {
  width: 100px;
  height: 34px;
  margin-left: 15px;
}
.floatDiv {
  float: left;
}
.inputWidth1 {
  width: 130px;
}
.inputWidth {
  width: 520px;
  /* margin-left: 15px; */
}
</style>

<style  lang="scss">
    .receivableListCon {
        .limtScoped {
            .el-input {
                width: 100% !important;
            }
            .el-input__inner {
                width: 100% !important;
            }
        }
    }
</style>
