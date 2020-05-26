<template>
  <div style="background-color:#f2f2f5;" v-loading="loading" element-loading-text="正在导出excel表...">
    <h3 class="sche-title pb10">{{realNameAlias}} - {{fromParams.outsourcingCusName}} - {{batchNumber}} 明细</h3>
    <el-form ref="formDetail" :model="formDetail" label-width="100px" labelPosition="left" style="background-color:white;padding:15px 0 15px 20px;">
      <el-form-item label="工种：" class="formSearchMargin">
        <el-radio-group class="radio-search mb10" v-model="formDetail.industry">
          <el-radio label="">不限</el-radio>
          <div class="" style="display:flex;flex-wrap:wrap;line-height:32px">
            <el-radio class="" :label="item.dicVal" v-for="item in industryList" :value="item.dicVal" :key="item.dicVal">{{item.dicName}}</el-radio>
          </div>
          </el-radio-group>
      </el-form-item>
      <el-form-item label="关键字：" class="formSearchMargin">
         <el-input class="rant-input inputWidth keyWFormParent" placeholder="输入班务名称搜索" v-model="formDetail.taskName"></el-input>
        <!--<el-select v-model="formDetail.taskId" filterable placeholder="输入班务名称搜索" class="inputWidth">-->
          <!--<el-option v-for="item in taskList" :key="item.id" :label="`${item.taskName} / ${item.status} / ${item.startTime}-${item.endTime}`" :value="item.id">-->
          <!--</el-option>-->
        <!--</el-select>-->
        <el-button type="primary" size="small" class="searchBtn keyWBtn" @click="searchTaskName">搜索</el-button>
      </el-form-item>
    </el-form>
    <div style="background-color:white;border:1px solid #E6E7EB;margin-top:18px;">
      <div style="padding-left:24px;border-bottom: 1px solid #E6E7EB;height:50px;line-height:50px;font-size:12px;">
        共<span class="fontsizecolor">&nbsp;{{total || 0}}&nbsp;</span>条记录，
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
      <el-table class="table-outline" :data="tableData" emptyText="暂无相关明细" style="width: 100%;">
        <el-table-column label="日期" prop="recordDate" align="center" min-width=""></el-table-column>
        <el-table-column label="班务" prop="taskName" :formatter="taskNameFormatter" align="center" min-width=""></el-table-column>
        <el-table-column label="工种" prop="industryName" align="center" min-width="" :formatter="typeNameFormatter"></el-table-column>
        <el-table-column label="签到时间" prop="workStartTime" align="center" min-width="" :formatter="typeNameFormatter"></el-table-column>
        <el-table-column label="签退时间" prop="workEndTime" align="center" min-width="" :formatter="typeNameFormatter"></el-table-column>
        <el-table-column label="工时" prop="workHours" align="center" min-width="" :formatter="typeNameFormatter"></el-table-column>
        <el-table-column label="产量" show-overflow-tooltip align="center" min-width="">
          <template v-slot="scope">
            <span>
              {{scope.row.typeName != '任务收入' ? '无' : scope.row.jian ? scope.row.jian+'件、' : 0+'件、'}}
              {{scope.row.typeName != '任务收入' ? '' : scope.row.che ? scope.row.che+'车、' : 0+'车、'}}
              {{scope.row.typeName != '任务收入' ? '' : scope.row.dai ? scope.row.dai+'袋、' : 0+'袋、'}}
              {{scope.row.typeName != '任务收入' ? '' : scope.row.dun ? scope.row.dun+'吨' : 0+'吨'}}
            </span>
          </template>
        </el-table-column>
        <el-table-column label="单价" prop="salary" align="center" min-width="" :formatter="forPrice"></el-table-column>
        <el-table-column label="金额" prop="amount" align="center" min-width=""></el-table-column>
        <el-table-column label="类型" prop="typeName" align="center" min-width=""></el-table-column>
         <!--<el-table-column label="批次" prop="batchNumber" align="center" min-width=""></el-table-column>-->
        <el-table-column label="状态" prop="payStatus" align="center" min-width="" :formatter="statusFormatter"></el-table-column>
        <!--<el-table-column label="付款方式" prop="payWay" align="center" min-width="" :formatter="payWayFormatter"></el-table-column>-->
      </el-table>
      <div class="pagination-container">
        <el-pagination class="pagebox" layout="prev, pager, next" @current-change="handleCurrentChange" :page-size="pageSize" :current-page="currentPage" :page-count="pageCount">
        </el-pagination>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      loading: false,
      isDisabled: false,
      currentPage: 1,
      pageCount: 0,
      pageSize: 20,
      total: 0,
      formDetail: {
        industry: '',
        taskId: '',
        taskName:'',
      },
      tableData: [],
      industryList: [],
      moneyTotal: {},
      taskList: [],
      taskName: '',
      realNameAlias:'',
      batchNumber: '',
      recordType: 1,
      fromParams: {},
    }
  },
  watch: {
    'formDetail.industry': function (val, old) {
      this.currentPage = 1
      this.getData()
      this.getSettlementList()
    },
  },
  mounted() {
    this.taskName = this.$route.query.taskName,
    this.fromParams = this.$route.query;
    this.realNameAlias = this.$route.query.realNameAlias
    this.batchNumber = this.$route.query.batchNumber
    this.getIndustryList()
    this.getData()
    this.getSettlementList()
    this.getReceived()
  },
  methods: {
    payWayFormatter(row, column, cellValue){
      if (cellValue == 2) {
        return '线上'
      } else if (cellValue == 1) {
        return '线下'
      } else {
        return '--'
      }
    },
    statusFormatter(row, column, cellValue) {
      if (row.payStatus == 1) {
        return '待支付'
      } else if (row.payStatus == 2) {
        return '已支付'
      } else {
        return '无'
      }
    },
    getData() {
      let params = {
        talentId: this.$route.query.talentId,
        managerId: this.$route.query.managerId,
        batchNumber: this.$route.query.batchNumber,
        pageNum: this.currentPage,
        pageSize: this.pageSize,
        taskId: this.formDetail.taskId,
        taskName: this.formDetail.taskName,
        salaryId: this.$route.query.id,
        industry: this.formDetail.industry,
        payType:this.$route.query.payType,
        recordType:this.recordType,
        payStatus:this.$route.query.payStatus,
        showOutsourcing:true,
        outsourcingCusId: this.$route.query.outsourcingCusId,
        badDebt:this.$route.query.badDebt || '1',
      }

      this.$api.batchNumberSummaryDetail(params).then(res => {
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
            this.total = total
          }
          if (this.total) {
            this.isDisabled = false
          } else {
            this.isDisabled = true
          }
        }
      }).catch()
    },
    getSettlementList() {
      let params = {
        talentId: this.$route.query.talentId,
        managerId: this.$route.query.managerId,
        batchNumber: this.$route.query.batchNumber,
        salaryId: this.$route.query.id,
        currentPage: this.currentPage,
        pageSize: this.pageSize,
        taskId: this.formDetail.taskId,
        taskName: this.formDetail.taskName,
        industry: this.formDetail.industry,
        recordType:this.recordType,
        payStatus:this.$route.query.payStatus,
        showOutsourcing:true,
        outsourcingCusId: this.$route.query.outsourcingCusId,
        badDebt:this.$route.query.badDebt || '1',
      }
      // this.taskList = []
      this.$api.batchNumberDetailTotal(params).then(res => {
        if (res.data.respCode == 0) {
          if (res.data.data) {
            this.moneyTotal = res.data.data
            // if(!sessionStorage.getItem('taskList')){
            //   sessionStorage.setItem('taskList',JSON.stringify(res.data.data.taskList))
            // }
            // this.taskList = JSON.parse(sessionStorage.getItem('taskList'))
            // this.taskList.forEach(item => {
            //   if(item.status == 2){
            //     item.status = '进行中'
            //   }else if(item.status == 3){
            //     item.status = '已结束'
            //   }
            //   if(item.startTime){
            //     item.startTime = item.startTime.substr(0, 10)
            //   }else{
            //     item.startTime = ''
            //   }
            //   if(item.endTime){
            //     item.endTime = item.endTime.substr(0, 10)
            //   }else{
            //     item.endTime = ''
            //   }
            // })
            // this.taskList.push({
            //   id: res.data.data.taskList[0].id,
            //   taskName: res.data.data.taskList[0].taskName,
            //   status: res.data.data.taskList[0].status == 2 ? '进行中' : (res.data.data.taskList[0].status == 3 ? '已结束' : ''),
            //   startTime: res.data.data.taskList[0].startTime ? res.data.data.taskList[0].startTime.substr(0, 10) : '',
            //   endTime: res.data.data.taskList[0].endTime ? res.data.data.taskList[0].endTime.substr(0, 10) : '',
            // })
            // console.log(this.taskList)
          }else {
            this.moneyTotal = {}
          }
        }
      }).catch()
    },
    getReceived(){
      this.$api.received().then(res => {
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
        talentId: this.$route.query.talentId,
        managerId: this.$route.query.managerId,
        batchNumber: this.$route.query.batchNumber,
        pageNum: this.currentPage,
        pageSize: this.pageSize,
        taskId: this.formDetail.taskId,
        salaryId: this.$route.query.id,
        industry: this.formDetail.industry,
        taskName: this.formDetail.taskName,
        payType:this.$route.query.payType,
        recordType:this.recordType,
        payStatus:this.$route.query.payStatus,
        showOutsourcing:true,
        outsourcingCusId: this.$route.query.outsourcingCusId,
        badDebt:this.$route.query.badDebt || '1',
      }
      this.$api.AccountDetailExport(params)
        .then(res => {
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
    searchTaskName() {
      this.currentPage = 1
      this.getData()
      this.getSettlementList()
      this.formDetail.taskId = ''
    },
    getIndustryList() {
      let params = {
        talentId: this.$route.query.talentId,
        managerId: this.$route.query.managerId,
        batchNumber: this.$route.query.batchNumber,
        pageNum: this.currentPage,
        pageSize: this.pageSize,
        taskId: this.formDetail.taskId,
        salaryId: this.$route.query.id,
        // industry: this.formDetail.industry,
        payType:this.$route.query.payType,
        recordType:this.recordType,
        payStatus:this.$route.query.payStatus,
        showOutsourcing:true
      }
      this.$api.IndustryList(params).then(res => {
        if (res.data.respCode == 0) {
          if (res.data.data) {
            this.industryList = res.data.data
          }
        }
      }).catch()
    },
    typeNameFormatter(row, column, cellValue) {
      if (row.typeName != '任务收入') {
        return '无'
      } else {
        if (cellValue) {
          return cellValue
        } else {
          return 0
        }
      }
    },
    taskNameFormatter(row, column, cellValue){
      if(cellValue){
        return cellValue
      }else{
        return '无'
      }
    },
    handleCurrentChange(val) {
      this.currentPage = val
      this.getData()
    },
    forPrice(val) {
      if (val.salary) {
        let salary = JSON.parse(val.salary)
        let type = val.settlementType;
        for (let i in salary) {
          if (salary[i].settlementType == type) {
            for (let j in salary[i].price) {
              if (((salary[i].price)[j]).sex == val.sex || ((salary[i].price)[j]).sex == 3) {
                let item = (salary[i].price)[j]
                let content = ''
                if (salary[i].valuationType == 1) {
                  content = `${item.countTime}元/小时`
                } else if(salary[i].valuationType == 8) {
                  content = `${item.countFixed}元/天`
                } else if (salary[i].valuationType == 2) {
                  if (salary[i].unit == 1) {
                    content = `${item.countSettle}元/件`
                  } else if (salary[i].unit == 2) {
                    content = `${item.countDai}元/袋`
                  } else if (salary[i].unit == 3) {
                    content = `${item.countChe}元/车`
                  } else {
                    content = `${item.countDun}元/吨`
                  }
                } else if (salary[i].valuationType == 3) {
                  let varUnit
                  if (salary[i].unit == 1) {
                    varUnit = '件'
                  } else if (salary[i].unit == 2) {
                    varUnit = '袋'
                  } else if (salary[i].unit == 3) {
                    varUnit = '车'
                  } else {
                    varUnit = '吨'
                  }
                  content += `${(item.ladderObj)[0].count}${varUnit}以下（含），${(item.ladderObj)[0].unit}元/${varUnit}`
                  for (let z in item.ladderObj) {
                    if (z > 0 && z != (item.ladderObj.length - 1)) {
                      content += `；${(Number((item.ladderObj)[z - 1].count)) + 1}至${(item.ladderObj)[z].count}${varUnit}（含），${(item.ladderObj)[z].unit}元/${varUnit}`

                    }
                  }
                  content += `；${(item.ladderObj)[item.ladderObj.length - 2].count}${varUnit}以上，${(item.ladderObj)[item.ladderObj.length - 1].overUnit}元/${varUnit}`
                } else if (salary[i].valuationType == 4) {
                  if (item.countSettle) {
                    content += `${item.countSettle}元/件,`
                  } if (item.countDai) {
                    content += `${item.countDai}元/袋,`
                  } if (item.countChe) {
                    content += `${item.countChe}元/车,`
                  } if (item.countDun) {
                    content += `${item.countDun}元/吨`
                  }
                } else if (salary[i].valuationType == 5) {

                  if (salary[i].unit == 1) {
                    content += `${item.countSettle}元/件，`
                  } else if (salary[i].unit == 2) {
                    content += `${item.countDai}元/袋，`
                  } else if (salary[i].unit == 3) {
                    content += `${item.countChe}元/车，`
                  } else {
                    content += `${item.countDun}元/吨，`
                  }
                  content += `${item.countTime}元/小时`
                } else if (salary[i].valuationType == 6) {
                  content += `${item.countTime}元/小时,`
                  let varUnit
                  if (salary[i].unit == 1) {
                    varUnit = '件'
                  } else if (salary[i].unit == 2) {
                    varUnit = '袋'
                  } else if (salary[i].unit == 3) {
                    varUnit = '车'
                  } else {
                    varUnit = '吨'
                  }
                  content += `${(item.ladderObj)[0].count}${varUnit}以下（含），${(item.ladderObj)[0].unit}元/${varUnit}`
                  for (let z in item.ladderObj) {
                    if (z > 0 && z != (item.ladderObj.length - 1)) {
                      content += `；${(Number((item.ladderObj)[z - 1].count)) + 1}至${(item.ladderObj)[z].count}${varUnit}（含），${(item.ladderObj)[z].unit}元/${varUnit}`

                    }
                  }
                  content += `；${(item.ladderObj)[item.ladderObj.length - 2].count}${varUnit}以上，${(item.ladderObj)[item.ladderObj.length - 1].overUnit}元/${varUnit}`
                } else {

                  if (item.countSettle) {
                    content += `${item.countSettle}元/件,`
                  } if (item.countDai) {
                    content += `${item.countDai}元/袋,`
                  } if (item.countChe) {
                    content += `${item.countChe}元/车,`
                  } if (item.countDun) {
                    content += `${item.countDun}元/吨,`
                  }
                  content += `${item.countTime}元/小时`
                }
                return content
              }
            }

          }
        }
      } else {
        return '无'
      }
    },
  },
}
</script>
<style scoped>
.sche-title {
  text-align: center;
  font-size: 20px;
  font-stretch: normal;
  line-height: 2;
  letter-spacing: 1px;
  color: #262626;
  padding-top: 20px;
  font-weight: bold;
}
.inputWidth {
  width: 430px;
  margin-right: 15px;
}
.fontsizecolor {
  color: #e84518;
}
.formSearchMargin {
  margin-bottom: 0;
}
</style>


