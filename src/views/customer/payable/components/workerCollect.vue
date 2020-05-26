<template>
  <div style="background-color:#f2f2f5;" class="worker-collect" v-loading="loading" :element-loading-text="loadingText">
    <div v-show="isShowComb" class="filter-condition bg-fff pb20">
      <el-form ref="formDetail" :model="formDetail" label-width="100px" labelPosition="left"
               style="background-color:white;padding-left:20px;padding-bottom: 15px">
        <div class="pt15 pb15 linebdb mb10 f14 fs-bold">选择筛选条件</div>
        <div class="pt5">
          <el-form-item label="选择班务：" class="formSearchMargin formSearchMarginTop">
            <div class="f12 co-999 pl10 pb5 ">
              可多选,不选查所有
            </div>
          </el-form-item>
          <el-form-item label="" class="formSearchMargin formSearchMarginTop select-new-307">
            <div class="select-el-wrap pl10 pb20">
              <span class="f12">进行中</span>
              <el-select class="ml20" v-model="taskId" filterable multiple remote reserve-keyword placeholder="请输入关键字并选择">
                <el-option
                        v-for="item in taskingList"
                        :key="item.classTaskId"
                        :label="item.classTaskName"
                        :value="item.classTaskId">
                </el-option>
              </el-select>
            </div>
            <div class="select-el-wrap pl50 pb20">
              <span class="f12">已结束</span>
              <el-select class="ml20" v-model="taskId2" filterable multiple remote reserve-keyword placeholder="请输入关键字并选择">
                <el-option
                        v-for="item in taskedList"
                        :key="item.classTaskId"
                        :label="item.classTaskName"
                        :value="item.classTaskId">
                </el-option>
              </el-select>
            </div>
          </el-form-item>
          <el-form-item label="选择零工：" class="formSearchMargin">
            <el-row class="pl10">
              <el-col :span="12">
                <el-autocomplete
                        class="inline-input"
                        v-model="formDetail.talentName"
                        :fetch-suggestions="querySearch"
                        placeholder="输入零工姓名"
                        :trigger-on-focus="false"
                        @select="handleSelect"
                ></el-autocomplete>
              </el-col>
            </el-row>
          </el-form-item>
          <el-form-item label="日期范围：" class="formSearchMargin" style="margin-top:15px;font-size:12px;">
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
            <el-date-picker class="" size="mini" v-model="formDetail.startDate" type="date"
                            value-format="yyyy-MM-dd" placeholder="选择开始时间">
            </el-date-picker>
            --
            <el-date-picker class="margin_left10" size="mini" v-model="formDetail.endDate" type="date"
                            value-format="yyyy-MM-dd" placeholder="选择结束时间">
            </el-date-picker>
            <!--<el-button type="primary" size="small" class="datesearchBtn" @click="btn_true">确定</el-button>-->
          </el-form-item>
          <el-form-item label="结算方式：" class="formSearchMargin">
            <el-radio-group style="display: flex;" class="radio-search" v-model="formDetail.settlementType">
              <el-radio label="">不限</el-radio>
              <el-radio label="2">月结</el-radio>
              <el-radio label="4">周结</el-radio>
              <el-radio label="1">日结</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="状态：" class="formSearchMargin">
            <el-radio-group style="display: flex;" class="radio-search" v-model="formDetail.payStatus">
              <el-radio label="">不限</el-radio>
              <!--<el-radio label="1">待生成</el-radio>-->
              <el-radio label="1">待付款</el-radio>
              <el-radio label="2">已付款</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="批次类型：" class="formSearchMargin">
            <el-radio-group class="radio-search" v-model="formDetail.payType">
              <el-radio label="">不限</el-radio>
              <el-radio label="1">外包费用</el-radio>
              <el-radio label="2">代发收入</el-radio>
            </el-radio-group>
          </el-form-item>
        </div>
      </el-form>
      <div class="tc">
        <el-button @click="queryList()" type="primary">查询</el-button>
      </div>
    </div>
    <div v-show="!isShowComb" style="background-color:white;border:1px solid #E6E7EB;margin-top:18px;">
      <div style="padding-left:24px;border-bottom: 1px solid #E6E7EB;height:50px;line-height:50px;font-size:12px;">
        共<span class="fontsizecolor">&nbsp;{{total}}&nbsp;</span>条记录
      </div>
      <div class="pr20 pt5 pb5" style="display:flex;justify-content: space-between;">
        <el-button class="myplain-btn" size="small" style="margin:6px 0 6px 24px;width:98px;" :disabled="isDisabled" @click="exportExcel">导出</el-button>
        <el-button class="primary-btn" size="mini" style="margin:6px 0 6px 24px;min-width:98px;"
                   @click="queryRefresh()">重新查询
        </el-button>
      </div>
    </div>
    <div v-show="!isShowComb" class="table-box back-white">
      <el-table class="table-outline" :data="tableData" emptyText="暂无相关信息" style="width: 100%;" :summary-method="getSummaries" show-summary>
        <el-table-column label="姓名" prop="realNameAlias" align="center" min-width="50"></el-table-column>
        <el-table-column label="批次" prop="batchNumber" show-overflow-tooltip align="center" min-width="50"></el-table-column>
        <!--<el-table-column label="项目经理" prop="managerNameAlias" align="center" min-width="60"></el-table-column>-->
        <el-table-column label="签到天数" prop="attendance" align="center" min-width="50"></el-table-column>
        <el-table-column label="工时" prop="workHours" align="center" min-width="50" :formatter="workHoursFormatter"></el-table-column>
        <el-table-column label="产量" show-overflow-tooltip align="center" min-width="80">
          <template v-slot="scope">
            <span>
              {{scope.row.jian ? Number(scope.row.jian).toFixed(0)+'件、' : 0+'件、'}}
              {{scope.row.dai ? Number(scope.row.dai).toFixed(0)+'袋、' : 0+'袋、'}}
              {{scope.row.che ? Number(scope.row.che).toFixed(0)+'车、' : 0+'车、'}}
              {{scope.row.dun ? Number(scope.row.dun).toFixed(2)+'吨' : 0+'吨'}}
            </span>
          </template>
        </el-table-column>
        <el-table-column label="收入合计" prop="salary" align="center" min-width="50"></el-table-column>
        <el-table-column label="奖惩合计(元)" prop="" align="center" min-width="50">
          <template v-slot="scope">
            <span>{{scope.row.punish+scope.row.reward}}</span>
          </template>
        </el-table-column>
        <el-table-column label="应发收入(元)" prop="shouldSalary" align="center" min-width="50"></el-table-column>
        <!--<el-table-column label="社保扣款(元)" prop="socialPay" align="center" min-width="60">-->
          <!--<template v-slot="scope">-->
            <!--<span>{{scope.row.oldAgePension||scope.row.medicalInsurance||scope.row.unemploymentInsurance?Number(scope.row.oldAgePension+scope.row.medicalInsurance+scope.row.unemploymentInsurance).toFixed(2):0}}</span>-->
          <!--</template>-->
        <!--</el-table-column>-->
        <!--<el-table-column label="公积金扣款(元)" prop="accumulationFund" align="center" min-width="60"></el-table-column>-->
        <!--<el-table-column label="个税(元)" prop="personalTax" align="center" min-width="60"></el-table-column>-->
        <!--<el-table-column label="应发劳务收入(元)" prop="shouldSalary" align="center" min-width="60"></el-table-column>-->
        <el-table-column label="扣款合计(元)" prop="otherAmount" align="center" min-width="50"></el-table-column>
        <el-table-column label="实发收入(元)" prop="totalAmount" align="center" min-width="50"></el-table-column>
        <!--<el-table-column label="实发劳务收入(元)" prop="trueShouldSalary" align="center" min-width="60"></el-table-column>-->
        <!--<el-table-column label="实发合计(元)" prop="totalAmount" align="center" min-width="60">-->
          <!--&lt;!&ndash; <template v-slot="scope">-->
            <!--<span>{{scope.row.socialSalary+scope.row.trueSalary}}</span>-->
          <!--</template> &ndash;&gt;-->
        <!--</el-table-column>-->
        <el-table-column label="状态" prop="payStatus" align="center" min-width="50" :formatter="statusFormatter"></el-table-column>
        <!--<el-table-column label="付款方式" prop="payWay" align="center" min-width="50" :formatter="payWayFormatter"></el-table-column>-->
        <el-table-column label="类型" prop="payTypeName" align="center" min-width="50" ></el-table-column>
        <el-table-column label="操作" align="center" min-width="150">
          <template v-slot="scope">
            <div class="operateCon">
              <div class="subItem" @click="goToHandlerDetails(scope.row)"><img :src="icon1"/><span>收入明细</span></div>
              <div class="subItem" @click="goToReward(scope.row)"><img :src="icon2"/><span>奖惩明细</span></div>
              <div class="subItem" @click="goToDeductions(scope.row)"><img :src="icon3"/><span>扣款明细</span></div>
              <div class="subItem" @click="goToPayHistory(scope.row)"><img :src="icon3"/><span>付款记录</span></div>
            </div>
            <!--<el-button size="small" type="text" @click="goToHandlerDetails(scope.row)">收入明细</el-button>-->
            <!--<el-button size="small" type="text" @click="goToReward(scope.row)">奖惩明细</el-button>-->
            <!--<el-button size="small" type="text" @click="goToDeductions(scope.row)">扣款明细</el-button>-->
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
      isShowComb: true,
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
        date: '',
        settlementType: '',
        payStatus: '',
        payWay:'', //新增付款方式  1线上  2线下  2019/8/2
        payType:'',//新增外包费用 代发收入  1线上  2线下  2019/8/2
        managerId: '',
        startDate: '',
        classTaskIdList: [],
        endDate: '',
        talentName: '',
      },
      tableData: [],
      talentNameAliasList: [],
      totalMount: {},
      nameAliasLength: '',
      icon1:require('@/assets/icons/icon_1541.png'),
      icon2:require('@/assets/icons/icon_1542.png'),
      icon3:require('@/assets/icons/icon_1543.png'),
      taskId: [],
      taskId2: [],
      taskIds: [],
      taskingList: [],//进行中
      taskedList: [],//已结束
      talentList: [],//零工列表
      loadingText:"正在导出excel表...",
    }
  },
  watch: {
    'formDetail.date': function (val, old) {
      if (val == '') {
        this.formDetail.endDate = ''
        this.formDetail.startDate = ''
      } else if (val == '1') {
        this.formDetail.endDate = Interval.getDay(0)
        this.formDetail.startDate = Interval.getDay(-7)
      } else if (val == '2') {
        this.formDetail.endDate = Interval.getDay(0)
        this.formDetail.startDate = Interval.getDay(-30)
      } else if (val == '3') {
        this.formDetail.endDate = Interval.getDay(0)
        this.formDetail.startDate = Interval.getDay(-90)
      } else if (val == '5') {
        this.formDetail.endDate = Interval.getDay(0)
        this.formDetail.startDate = new Date().getFullYear() + '-' + ((new Date().getMonth() + 1).toString().length == 1 ? '0' + (new Date().getMonth() + 1) : (new Date().getMonth() + 1)) + '-01'
      } else if (val == '4') {
        this.formDetail.endDate = ''
        this.formDetail.startDate = ''
      }
    },
  },
  mounted() {
    this.getTalentList();
    this.getTaskList();
  },
  methods: {
    async queryList() {
      if (this.formDetail.date == 4) {
        if (!this.formDetail.startDate) {
          return this.$message.error('开始时间不能为空!')
        }
        if (!this.formDetail.endDate) {
          return this.$message.error('结束时间不能为空!')
        }
        if (this.formDetail.startDate > this.formDetail.endDate) {
          return this.$message.error('结束日期要大于开始日期!')
        }
      }
      this.currentPage = 1;
      this.formDetail.classTaskIdList = this.taskId.concat(this.taskId2);
      await this.getDataList();
      await this.getSettlementTotal();
      this.isShowComb = false;
    },
    queryRefresh() {
      this.isShowComb = true;
    },
    querySearch(queryString, cb) {
      var restaurants = this.talentList;
      console.log(restaurants);
      var results = queryString ? restaurants.filter((i) => i.value.includes(queryString)) : restaurants;
      // 调用 callback 返回建议列表的数据
      cb(results);
    },
    handleSelect(item) {
      this.formDetail.talentName = item.value;
      console.log(item);
    },
    async getTaskList() {
      let params = {pageNum: 1, pageSize: 0, classTaskStatus: 2};
      let res = await this.$api.getClassTaskCustomerList(params);
      params['classTaskStatus'] = 3;
      let res2 = await this.$api.getClassTaskCustomerList(params);
      if (res.data.respCode === 0) {
        if (res.data.data.list) {
          this.taskingList = res.data.data.list
        }
      }
      if (res2.data.respCode === 0) {
        if (res2.data.data.list) {
          this.taskedList = res2.data.data.list
        }
      }
      console.log(this.taskingList)
      console.log(this.taskedList)
    },
    getTalentList() {
      const params = {
        customerStatus: 1,
        pageNum: this.currentPage,
        pageSize: 0,
        nameAlias: '',
      };
      this.$api.getAllEmpList(params).then(res => {
        let result = res.data ? res.data : [];
        if (result.length > 0) {
          this.talentList = result.map((i) => {
            return Object.assign({}, {value: i});
          })
        }
      }).catch(error => {
        console.log(error);
      });
    },
    unfload() {
      this.isShowHeight = !this.isShowHeight
      if (this.isShowHeight) {
        this.htmlTxt = '全部展示'
      } else {
        this.htmlTxt = '收起'
      }
    },
    getDataList() {
      this.loadingText = '正在请求数据中...';
      this.loading = true;
      let params = {
        pageNum: this.currentPage,
        pageSize: this.pageSize,
        talentName: this.formDetail.talentName,
        classTaskIdList: this.formDetail.classTaskIdList,
        payStatus: this.formDetail.payStatus,
        payWay:this.formDetail.payWay,
        payType:this.formDetail.payType,
        settlementType: this.formDetail.settlementType,
        startDate: this.formDetail.startDate,
        endDate: this.formDetail.endDate
      }
      this.$api.batchNumberSummary(params)
        .then(res => {
          // console.log(res)
          if (res.data.respCode == 0) {
            if (res.data.data) {
              const {
                data: {
                  list,
                  pages,
                  total,
                  pageNum,
                },
              } = res.data;
              this.tableData = list
              this.pageCount = pages
              this.total = total
            } else {
              this.tableData = []
              this.pageCount = 0
              this.total = 0
            }
            if (this.total) {
              this.isDisabled = false
            } else {
              this.isDisabled = true
            }
          }
        })
        .catch(error => {
          console.log('error')
        }).finally(()=>{
        this.loading = false;
      })
    },
    exportExcel() {
      let _this = this;
      if(this.loading){return}
      this.loadingText = '正在导出excel表...';
      this.loading = true
      let params = {
        pageNum: this.currentPage,
        pageSize: this.pageSize,
        talentName: this.formDetail.talentName,
        classTaskIdList: this.formDetail.classTaskIdList,
        payStatus: this.formDetail.payStatus,
        payWay:this.formDetail.payWay,
        payType:this.formDetail.payType,
        settlementType: this.formDetail.settlementType,
        startDate: this.formDetail.startDate,
        endDate: this.formDetail.endDate
      }
      this.$api.SettlementExport(params)
        .then(res => {
          // console.log(res)
          if (res.data.respCode == 0) {
            if (res.data.data) {
              window.open(res.data.data)
            }
          }else{
            this.$message.error(res.data.data.errorMsg);
            console.log('1')
          }
        }).catch(err=>{
          this.$message.error(err)
        console.log('2')
      }).finally(() => {
        setTimeout(()=>{
          _this.loading = false
        },1000)
      })
    },
    getSettlementTotal() {
      if (this.formDetail.endDate < this.formDetail.startDate) {
        return this.$message.error('结束日期不能早于开始日期!')
      }
      let params = {
        pageNum: this.currentPage,
        pageSize: this.pageSize,
        talentName: this.formDetail.talentName,
        classTaskIdList: this.formDetail.classTaskIdList,
        payStatus: this.formDetail.payStatus,
        payWay:this.formDetail.payWay,
        payType:this.formDetail.payType,
        settlementType: this.formDetail.settlementType,
        startDate: this.formDetail.startDate,
        endDate: this.formDetail.endDate
      }
      this.$api.SettlementTotal(params).then(res => {
        console.log(res)
        if (res.data.respCode == 0) {
          if (res.data.data) {
            if(!localStorage.getItem('talentNameAlias')){
              localStorage.setItem('talentNameAlias', res.data.data.talentNameAliasList)
            }
            this.talentNameAliasList = localStorage.getItem('talentNameAlias').split(',')
            this.totalMount = res.data.data
            console.log(this.totalMount);
          }
        }
      }).catch()
    },
    btn_true() {
      if(!this.formDetail.startDate){
        return this.$message.error('开始日期不能为空!')
      }
      if(!this.formDetail.endDate){
        return this.$message.error('结束日期不能为空!')
      }
      if(this.formDetail.startDate > this.formDetail.endDate){
        return this.$message.error('结束日期要大于开始日期!')
      }
      this.currentPage = 1
      this.getDataList()
      this.getSettlementTotal()
    },
    handleCurrentChange(val) {
      this.currentPage = val
      this.getDataList()
    },
    searchTalentName() {
      this.currentPage = 1
      this.getDataList()
      this.getSettlementTotal()
    },
    workHoursFormatter(row, column, cellValue) {
      if (cellValue) {
        return cellValue
      } else {
        return 0
      }
    },
    goToHandlerDetails(row) {
      let query = Object.assign(row)
      const {href} = this.$router.resolve({
        path: '/payable/handlerDetails',
        query: query
      });
      window.open(href, '_blank')
    },
    goToReward(row) {
      let query = Object.assign(row)
      const {href} = this.$router.resolve({
        path: '/payable/rewardDetails',
        query: query
      });
      window.open(href, '_blank')
    },
    goToDeductions(row) {
      let query = Object.assign(row)
      const {href} = this.$router.resolve({
        path: '/payable/deductionsDetails',
        query: query
      });
      window.open(href, '_blank')
    },
    goToPayHistory(row){
      let query = Object.assign({},row)
      console.log(row,'row')
      const {href} = this.$router.resolve({
        path: '/payable/payHistory',
        query: query
      });
      window.open(href, '_blank')
    },
    statusFormatter(row, column, cellValue) {
      if (cellValue == 1) {
        return '待支付'
      } else if (cellValue == 2) {
        return '已支付'
      } else {
        return '无'
      }
    },
    payWayFormatter(row, column, cellValue){
      if (cellValue == 1) {
        return '线上'
      } else if (cellValue == 2) {
        return '线下'
      } else {
        return '--'
      }
    },
    getSummaries(param) {
      const { columns, data } = param;
      const sums = [];
      sums[0] = '合计'
      sums[1] = ''
      sums[2] = this.totalMount.attendance || 0
      sums[3] = this.totalMount.workHours ? this.totalMount.workHours.toFixed(2) : 0
      sums[4] = `
      ${this.totalMount.jian ? this.totalMount.jian + '件' : '0件'},
      ${this.totalMount.dai ? this.totalMount.dai.toFixed(2) + '袋' : '0袋'},
      ${this.totalMount.che ? this.totalMount.che.toFixed(2) + '车' : '0车'},
      ${this.totalMount.dun ? this.totalMount.dun.toFixed(2) + '吨' : '0吨'}
      `
      sums[5] = this.totalMount.salary ? this.totalMount.salary.toFixed(2) : 0;
      sums[6] = this.totalMount.punish ? this.totalMount.punish.toFixed(2) : 0 + this.totalMount.reward ? this.totalMount.reward.toFixed(2) : 0;
      sums[7] = this.totalMount.shouldSalary ? this.totalMount.shouldSalary.toFixed(2) : 0
      sums[8] = this.totalMount.otherAmount ? this.totalMount.otherAmount.toFixed(2) : 0
      let oldAgePension = this.totalMount.oldAgePension ? this.totalMount.oldAgePension.toFixed(2) : 0
      let medicalInsurance = this.totalMount.medicalInsurance ? this.totalMount.medicalInsurance.toFixed(2) : 0
      let unemploymentInsurance = this.totalMount.unemploymentInsurance ? this.totalMount.unemploymentInsurance.toFixed(2) : 0
      oldAgePension = Number(oldAgePension)
      medicalInsurance = Number(medicalInsurance)
      unemploymentInsurance = Number(unemploymentInsurance)
      // sums[9] = oldAgePension + medicalInsurance + unemploymentInsurance
      sums[9] = this.totalMount.totalAmount ? this.totalMount.totalAmount.toFixed(2) : 0
      sums[10] = ""
      sums[11] = ""
      sums[12] = ""
      sums[13] = ""
      // sums[11] = this.totalMount.personalTax ? this.totalMount.personalTax.toFixed(2) : 0
      // sums[12] = this.totalMount.shouldSalary ? this.totalMount.shouldSalary.toFixed(2) : 0
      // sums[13] = this.totalMount.otherAmount ? this.totalMount.otherAmount.toFixed(2) : 0
      // sums[14] = this.totalMount.deductAfter ? this.totalMount.deductAfter.toFixed(2) : 0
      // sums[15] = this.totalMount.trueShouldSalary ? this.totalMount.trueShouldSalary.toFixed(2) : 0
      // sums[16] = this.totalMount.totalAmount ? this.totalMount.totalAmount.toFixed(2) : 0
      // sums[17] = ''
      // sums[18] = ''
      // sums[19] = ''
      // sums[20] = ''
      return sums;
      // <el-button size="small" type="text" id="btn_ert">明细</el-button>
    //   <el-tooltip class="item" effect="dark" content="Top Left 提示文字" placement="top">
    //   <span type="text" style="overflow: hidden;display: block;width: 25px;height: 20px;">上左上左上左上左上左上左上左上左</span>
    // </el-tooltip>
    }
  },
}
</script>
<style lang="scss">
  .worker-collect{
    .el-form-item__label {
      color: #333;
      font-weight: bold;
    }
    .select-new-307 {
      .el-form-item__content {
        display: flex;
        justify-content: flex-start;
        align-items: flex-start;

        .select-el-wrap {
          .el-select {
            vertical-align: top;

            .el-input {
              width: 100%;

              .el-input__inner {
                width: 100%;
              }
            }
          }
        }
      }
    }
    .operateCon {
      display: flex;
      flex-direction: row;
      flex-wrap: nowrap;
      justify-content: space-around;
      align-content: center;
      align-items: center;
      .subItem{
        img,span{
          display: inline-block;
          vertical-align: middle;
        }
        img{
          width: 13px;
          height:15px;
          margin-right:3px;
        }
      }
    }
    .el-table .cell{
      padding-left: 5px;
      .el-button{
        padding: 10px 15px;
      }
      .el-button + .el-button{
        margin-left:5px;
      }
    }
    .formSearchMargin {
      margin-bottom: 0;
      .el-radio-group{
        height: 32px;
      }
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
      margin-left: 15px;
    }
    .inputWidth {
      width: 520px;
      /* margin-right: 15px; */
    }
    .showHeight {
      height: 50px;
      overflow: hidden;
    }
  }
</style>


