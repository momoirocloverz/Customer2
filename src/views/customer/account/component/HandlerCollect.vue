<template>
  <div style="background-color:#f2f2f5;" v-loading="loading" element-loading-text="正在导出excel表...">
    <el-form ref="formDetail" :model="formDetail" label-width="100px" labelPosition="left" style="background-color:white;padding-left:20px;">
      <!-- <div style="display:flex;align-items:center;padding:20px 0 20px 0;justify-content: flex-end;" class="search-zone">
        <el-button style="margin-left:487px" class="comb-btn" size="mini" type="text" @click="handleCombShow">高级筛选<i class="el-icon-right el-icon-d-arrow-right" :class="isShowComb ? 'el-icon-d-arrow-right-down' : 'el-icon-d-arrow-right-right'"></i></el-button>
      </div> -->
      <div class="combine-zone" style="border-top: 1px solid #EAEDF4">
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
          <el-radio-group style="padding:13px 0 0 0;display: flex;" class="radio-search" v-model="formDetail.managerId">
            <el-radio label="">不限</el-radio>
            <div style="margin-left:15px;" :class="{showHeight: isShowHeight}">
              <el-radio :label="item.id" class="elRadio" v-for="item in customerManager" :key="item.id">{{item.nameAlias}}</el-radio>
            </div>
          </el-radio-group>
          <el-button v-show="this.nameAliasLength.length > 16" style="padding:0;margin-left:60px;" class="myplain-btn" size="mini" type="text" @click="unfload">{{htmlTxt}}<i class="el-icon-arrow-down" :class="[isShowHeight ? 'el-icon-arrow-down':'el-icon-arrow-up']"></i></el-button>
        </el-form-item>
      </div>

    </el-form>
    <!-- <el-button class="myplain-btn" size="small" style="margin: 20px 20px" :disabled="isDisabled" @click="exportExcel">导出</el-button> -->
    <div style="background-color:white;border:1px solid #E6E7EB;margin-top:18px;">
      <div style="padding-left:24px;border-bottom: 1px solid #E6E7EB;height:50px;line-height:50px;font-size:12px;">
        收入：充值<span class="fontsizecolor">&nbsp;{{moneyCollect.rechargeTotal || 0}}&nbsp;</span>元，
        劳务费<span class="fontsizecolor">&nbsp;{{moneyCollect.trueSalaryTotalIn || 0}}&nbsp;</span>元，
        合计<span class="fontsizecolor">&nbsp;{{moneyCollect.totalIn || 0}}&nbsp;</span>元&nbsp;&nbsp;&nbsp;
        支出：充值手续费<span class="fontsizecolor">&nbsp;{{moneyCollect.rechargeTotalFee || 0}}&nbsp;</span>元，
        开票服务费<span class="fontsizecolor">&nbsp;{{moneyCollect.invoiceTotalOut || 0}}&nbsp;</span>元，
        劳务费<span class="fontsizecolor">&nbsp;{{moneyCollect.trueSalaryTotalOut || 0}}&nbsp;</span>元，
        收入<span class="fontsizecolor">&nbsp;{{moneyCollect.socialSalaryTotal || 0}}&nbsp;</span>元，
        管理费<span class="fontsizecolor">&nbsp;{{moneyCollect.managementTotalFee || 0}}&nbsp;</span>元，
        佣金<span class="fontsizecolor">&nbsp;{{moneyCollect.commissionTotalOut || 0}}&nbsp;</span>元，
        合计<span class="fontsizecolor">&nbsp;{{moneyCollect.totalOut || 0}}&nbsp;</span>元
      </div>
      <div>
        <el-button class="myplain-btn" size="small" style="margin:6px 0 6px 24px;width:98px;" :disabled="isDisabled" @click="exportExcel">导出</el-button>
      </div>
    </div>

    <div class="table-box back-white">
      <el-table class="table-outline" :data="tableData" emptyText="暂无相关明细" style="width: 100%;">
        <el-table-column label="项目经理" prop="userName" align="center" min-width="80"></el-table-column>
        <el-table-column label="充值收入" prop="rechargeTotal" align="center" min-width="80"></el-table-column>
        <el-table-column label="劳务费收入" prop="trueSalaryTotalIn" align="center" min-width="80"></el-table-column>
        <el-table-column label="合计收入" prop="totalIn" align="center" min-width="80"></el-table-column>
        <el-table-column label="充值手续费支出" prop="rechargeTotalFee" align="center" min-width="100"></el-table-column>
        <el-table-column label="劳务费支出" prop="trueSalaryTotalOut" align="center" min-width="80"></el-table-column>
        <el-table-column label="收入支出" prop="socialSalaryTotal" align="center" min-width="80"></el-table-column>
        <el-table-column label="管理费支出" prop="managementTotalFee" align="center" min-width="80"></el-table-column>
        <el-table-column label="佣金支出" prop="commissionTotalOut" align="center" min-width="80"></el-table-column>
        <el-table-column label="开票服务费支出" prop="invoiceTotalOut" align="center" min-width="80"></el-table-column>
        <el-table-column label="合计支出" prop="totalOut" align="center" min-width="80"></el-table-column>
        <el-table-column label="余额" prop="balance" align="center" min-width="80"></el-table-column>
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
      htmlTxt: '全部展示',
      isShowHeight: true,
      loading: false,
      isDisabled: false,
      total: 0,
      currentPage: 1,
      pageCount: 0,
      pageSize: 10,
      formDetail: {
        date: '5',
        managerId: '',
        startDate: '',
        endDate: '',
      },
      tableData: [],
      customerManager: [],
      moneyCollect: {},
      nameAliasLength: ''
    }
  },
  watch: {
    'formDetail.date': function (val, old) {
      if (val == '') {
        this.currentPage = 1
        this.getData()
        this.getSummaryData()
      } else if (val == '1') {
        this.currentPage = 1
        this.getData()
        this.getSummaryData()
      } else if (val == '2') {
        this.currentPage = 1
        this.getData()
        this.getSummaryData()
      } else if (val == '3') {
        this.currentPage = 1
        this.getData()
        this.getSummaryData()
      } else if (val == '5') {
        this.currentPage = 1
        this.getData()
        this.getSummaryData()
      } else if (val == '4') {
        this.formDetail.endDate = ''
        this.formDetail.startDate = ''
      }
    },
    'formDetail.managerId': function (val, old) {
      this.currentPage = 1
      this.getData()
      this.getSummaryData()
    }
  },
  methods: {
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
      if (this.formDetail.endDate < this.formDetail.startDate) {
        return this.$message.error('结束日期不能早于开始日期!')
      }
      let params = {
        pageNum: this.currentPage,
        pageSize: this.pageSize,
        managerId: this.formDetail.managerId,
        userType: 3,
        endDate: this.formDetail.endDate,
        startDate: this.formDetail.startDate,
      }
      this.$api.OtherAccountList(params).then(res => {
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
    getSummaryData() {
      if (this.formDetail.endDate < this.formDetail.startDate) {
        return this.$message.error('结束日期不能早于开始日期!')
      }
      let params = {
        pageNum: this.currentPage,
        pageSize: this.pageSize,
        managerId: this.formDetail.managerId,
        userType: 3,
        endDate: this.formDetail.endDate,
        startDate: this.formDetail.startDate,
      }
      this.$api.AccountOtherSummary(params)
        .then(res => {
          console.log(res)
          if (res.data.respCode == 0) {
            if (res.data.data) {
              this.isDisabled = false
              this.moneyCollect = res.data.data
            } else {
              this.isDisabled = true
              this.moneyCollect = {}
            }
          }
        }).catch()
    },
    exportExcel() {
      let params = {
        pageNum: this.currentPage,
        pageSize: this.pageSize,
        managerId: this.formDetail.managerId,
        userType: 3,
        endDate: this.formDetail.endDate,
        startDate: this.formDetail.startDate,
      }
      this.loading = true
      this.$api.AccountListTrueExport(params)
        .then(res => {
          // console.log(res)
          setTimeout(() => {
            this.loading = false
          }, 2000)
          if (res.data.respCode == 0) {
            if (res.data.data) {
              window.open(res.data.data)
            }
          }
        }).catch()
    },
    getCustomer() {
      let params = {
        bindingStatus: -1
      }
      this.$api.getPmListCus(params).then(res => {
        // console.log(res)
          if (res.data) {
            this.customerManager = res.data
            this.customerManager.forEach(item => {
              this.nameAliasLength = item.nameAlias
            })
          }
        
      }).catch()
    },
    btn_true() {
      this.currentPage = 1
      this.getData()
      this.getSummaryData()
    },
    handleCurrentChange(val) {
      this.currentPage = val
      this.getData()
    }
  },
  mounted() {
    this.getData()
    this.getCustomer()
    this.getSummaryData()
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
.inputWidth {
  width: 430px;
  margin-right: 15px;
}
.showHeight {
  height: 50px;
  overflow: hidden;
}
</style>


