<template>
  <div style="background-color:#f2f2f5;" v-loading="loading" element-loading-text="正在导出excel表...">
    <el-form
      ref="formDetail"
      :model="formDetail"
      label-width="100px"
      labelPosition="left"
      style="background-color:white;padding-left:20px;"
    >
      <div style="display:flex;align-items:center;padding:20px 20px 20px 0;" class="search-zone">
        <div>
          <!-- <el-select v-model="formDetail.bizUserName" filterable clearable placeholder="输入交易对象姓名搜索" class="inputWidth">
          <el-option v-for="item in bizUserNameList" :key="item" :label="item" :value="item">
          </el-option>
          </el-select>-->
          <el-input
            class="rant-input inputWidth keyWFormParent"
            placeholder="输入交易对象姓名搜索"
            v-model="formDetail.bizUserName"
          ></el-input>
          <el-button
            type="primary"
            size="small"
            class="searchBtn keyWBtn"
            @click="searchBizUserName"
          >搜索</el-button>
        </div>
        <div>
          <el-button
            style="margin-left:20px"
            class="comb-btn"
            size="mini"
            type="text"
            @click="handleCombShow"
          >
            高级筛选
            <i
              class="el-icon-right el-icon-d-arrow-right"
              :class="isShowComb ? 'el-icon-d-arrow-right-down' : 'el-icon-d-arrow-right-right'"
            ></i>
          </el-button>
        </div>
      </div>
      <div v-show="isShowComb" class="combine-zone" style="border-top: 1px solid #EAEDF4">
        <el-form-item label="日期范围：" class="formSearchMargin" style="margin-top:15px">
          <el-radio-group class="radio-search" v-model="formDetail.date">
            <el-radio label>不限</el-radio>
            <el-radio label="5">本月</el-radio>
            <el-radio label="1">最近7天</el-radio>
            <el-radio label="2">最近30天</el-radio>
            <el-radio label="3">最近90天</el-radio>
            <el-radio label="4">自定义</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="自定义：" class="formSearchMargin" v-if="formDetail.date == '4'">
          <el-date-picker
            class="margin_left40"
            size="mini"
            v-model="formDetail.startDate"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="选择开始时间"
          ></el-date-picker>--
          <el-date-picker
            class="margin_left10"
            size="mini"
            v-model="formDetail.endDate"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="选择结束时间"
          ></el-date-picker>
          <el-button type="primary" size="small" class="datesearchBtn" @click="btn_true">确定</el-button>
        </el-form-item>
        <el-form-item label="业务类型：" class="formSearchMargin">
          <el-radio-group class="radio-search" v-model="formDetail.note">
            <el-radio label>不限</el-radio>
            <el-radio label="充值">充值</el-radio>
            <el-radio label="充值手续费">充值手续费</el-radio>
            <el-radio label="劳务费">劳务费</el-radio>
            <el-radio label="收入">收入</el-radio>
            <el-radio label="管理费">管理费</el-radio>
            <el-radio label="佣金">佣金</el-radio>
            <el-radio label="开票服务费">开票服务费</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="收支分类：" class="formSearchMargin">
          <el-radio-group class="radio-search" v-model="formDetail.inOutType">
            <el-radio label>不限</el-radio>
            <el-radio label="1">收入</el-radio>
            <el-radio label="2">支出</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="项目经理：" class="formSearchMargin">
          <el-radio-group
            style="padding:13px 0 0 0;display: flex;"
            class="radio-search"
            v-model="formDetail.managerId"
          >
            <el-radio label>不限</el-radio>
            <div style="margin-left:15px;" :class="{showHeight: isShowHeight}">
              <el-radio
                :label="item.id"
                class="elRadio"
                v-for="item in customerManager"
                :key="item.id"
              >{{item.nameAlias}}</el-radio>
            </div>
          </el-radio-group>
          <el-button
            v-show="this.nameAliasLength.length > 16"
            style="padding:0;margin-left:60px;"
            class="myplain-btn"
            size="mini"
            type="text"
            @click="unfload"
          >
            {{htmlTxt}}
            <i
              class="el-icon-arrow-down"
              :class="[isShowHeight ? 'el-icon-arrow-down':'el-icon-arrow-up']"
            ></i>
          </el-button>
        </el-form-item>
      </div>

      <!-- <el-form-item label="关键字：" class="formSearchMargin"> -->
      <!-- <el-input class="rant-input inputWidth keyWFormParent" placeholder="输入零工姓名搜索" v-model="formDetail.nameAlias"></el-input> -->
      <!-- <el-select v-model="formDetail.bizUserName" filterable clearable placeholder="输入交易对象姓名搜索" class="inputWidth">
          <el-option v-for="item in bizUserNameList" :key="item" :label="item" :value="item">
          </el-option>
        </el-select>
      <el-button type="primary" size="small" class="searchBtn keyWBtn" @click="searchBizUserName">搜索</el-button>-->
      <!-- </el-form-item> -->
    </el-form>
    <!-- <el-button class="myplain-btn" size="small" style="margin: 20px 20px" :disabled="isDisabled" @click="exportExcel">导出</el-button> -->
    <!-- <div id="mountNode"></div> -->
    <div style="background-color:white;border:1px solid #E6E7EB;margin-top:18px;">
      <div
        style="padding-left:24px;border-bottom: 1px solid #E6E7EB;height:50px;line-height:50px;font-size:12px;"
      >
        收入：充值
        <span class="fontsizecolor">&nbsp;{{moneyTotal.rechargeTotal || 0}}&nbsp;</span>元，
        劳务费
        <span class="fontsizecolor">&nbsp;{{moneyTotal.trueSalaryTotalIn || 0}}&nbsp;</span>元，
        合计
        <span class="fontsizecolor">&nbsp;{{moneyTotal.totalIn || 0}}&nbsp;</span>元&nbsp;&nbsp;&nbsp;
        支出：充值手续费
        <span class="fontsizecolor">&nbsp;{{moneyTotal.rechargeTotalFee || 0}}&nbsp;</span>元，
        开票服务费
        <span class="fontsizecolor">&nbsp;{{moneyTotal.invoiceTotalOut || 0}}&nbsp;</span>元，
        劳务费
        <span class="fontsizecolor">&nbsp;{{moneyTotal.trueSalaryTotalOut || 0}}&nbsp;</span>元，
        收入
        <span class="fontsizecolor">&nbsp;{{moneyTotal.socialSalaryTotal || 0}}&nbsp;</span>元，
        管理费
        <span class="fontsizecolor">&nbsp;{{moneyTotal.managementTotalFee || 0}}&nbsp;</span>元，
        佣金
        <span class="fontsizecolor">&nbsp;{{moneyTotal.commissionTotalOut || 0}}&nbsp;</span>元，
        合计
        <span class="fontsizecolor">&nbsp;{{moneyTotal.totalOut || 0}}&nbsp;</span>元
      </div>
      <div>
        <el-button
          class="myplain-btn"
          size="small"
          style="margin:6px 0 6px 24px;width:98px;"
          :disabled="isDisabled"
          @click="exportExcel"
        >导出</el-button>
      </div>
    </div>

    <div class="table-box back-white">
      <el-table class="table-outline" :data="tableData" emptyText="暂无相关明细" style="width: 100%;">
        <el-table-column label="时间" prop="receiveTime" align="center" min-width="180">
          <template slot-scope="scope">
            <span>{{scope.row.receiveTime?scope.row.receiveTime.substr(0,16):''}}</span>
          </template>
        </el-table-column>
        <el-table-column label="业务类型" prop="note" align="center" min-width="180"></el-table-column>
        <el-table-column label="项目经理" prop="userName" align="center" min-width="180"></el-table-column>
        <el-table-column label="交易对象" prop="bizUserName" align="center" min-width="180"></el-table-column>
        <el-table-column label="收入/支出" prop="inOutTypeName" align="center" min-width="180"></el-table-column>
        <el-table-column
          label="金额（元）"
          prop="amount"
          align="center"
          min-width="180"
          :formatter="amountFormatter"
        >
          <!-- <template scope="scope">
            <span>{{-scope.row.amount}}</span>
          </template>-->
        </el-table-column>
      </el-table>
      <div class="pagination-container">
        <el-pagination
          class="pagebox"
          layout="prev, pager, next"
          @current-change="handleCurrentChange"
          :current-page="currentPage"
          :page-count="pageCount"
        ></el-pagination>
      </div>
    </div>
  </div>
</template>
<script>
import Interval from "../../../../common/interval.js";
import G2 from '@antv/g2'
export default {
  data() {
    return {
      isShowComb: false,
      htmlTxt: "全部展示",
      isShowHeight: true,
      loading: false,
      isDisabled: false,
      total: 0,
      currentPage: 1,
      pageCount: 0,
      pageSize: 10,
      formDetail: {
        date: "5",
        note: "",
        inOutType: "",
        managerId: "",
        startDate: "",
        endDate: "",
        nameAlias: "",
        bizUserName: ""
      },
      tableData: [],
      // customers: [{ name: '很爱很爱你', id: 1 }, { name: '啊哈哈哈', id: 2 }],
      customerManager: [],
      moneyTotal: {},
      bizUserNameList: [],
      nameAliasLength: "",
      // chart: null,
      // charData: [{
      //   year: '2010',
      //   value: 3
      // }, {
      //   year: '2011',
      //   value: 4
      // }, {
      //   year: '2012',
      //   value: 3.5
      // }, {
      //   year: '2013',
      //   value: 5
      // }, {
      //   year: '2014',
      //   value: 4.9
      // }, {
      //   year: '2015',
      //   value: 6
      // }, {
      //   year: '2016',
      //   value: 7
      // }, {
      //   year: '2017',
      //   value: 9
      // }, {
      //   year: '2018',
      //   value: 13
      // }]
    };
  },
  watch: {
    "formDetail.date": function(val, old) {
      if (val == "") {
        this.currentPage = 1;
        this.getData();
        this.getSummaryData();
      } else if (val == "1") {
        this.currentPage = 1;
        this.getData();
        this.getSummaryData();
      } else if (val == "2") {
        this.currentPage = 1;
        this.getData();
        this.getSummaryData();
      } else if (val == "3") {
        this.currentPage = 1;
        this.getData();
        this.getSummaryData();
      } else if (val == "5") {
        this.currentPage = 1;
        this.getData();
        this.getSummaryData();
      } else if (val == "4") {
        this.formDetail.endDate = "";
        this.formDetail.startDate = "";
      }
    },
    "formDetail.note": function(val, old) {
      this.currentPage = 1;
      this.getData();
      this.getSummaryData();
    },
    "formDetail.inOutType": function(val, old) {
      this.currentPage = 1;
      this.getData();
      this.getSummaryData();
    },
    "formDetail.managerId": function(val, old) {
      this.currentPage = 1;
      this.getData();
      this.getSummaryData();
    }
  },
  methods: {
    // drawChart() {
    //   this.chart = new G2.Chart({
    //     container: 'mountNode',
    //     width: 600,
    //     height: 300
    //   })
    //   this.chart.source(this.charData)
    //   this.chart.scale('value', {
    //     min: 0
    //   })
    //   this.chart.scale('year', {
    //     range: [0, 1]
    //   })
    //   this.chart.tooltip({
    //     crosshairs: {
    //       type: 'line'
    //     }
    //   })
    //   this.chart.line().position('year*value')
    //   this.chart.point().position('year*value').size(4).shape('circle').style({
    //     stroke: '#fff',
    //     lineWidth: 1
    //   })
    //   this.chart.render()
    // },
    handleCombShow() {
      this.isShowComb = !this.isShowComb;
    },
    unfload() {
      this.isShowHeight = !this.isShowHeight;
      if (this.isShowHeight) {
        this.htmlTxt = "全部展示";
      } else {
        this.htmlTxt = "收起";
      }
    },
    getData() {
      if (this.formDetail.date == "") {
        this.formDetail.endDate = "";
        this.formDetail.startDate = "";
      } else if (this.formDetail.date == "1") {
        this.formDetail.endDate = Interval.getDay(0);
        this.formDetail.startDate = Interval.getDay(-7);
      } else if (this.formDetail.date == "2") {
        this.formDetail.endDate = Interval.getDay(0);
        this.formDetail.startDate = Interval.getDay(-30);
      } else if (this.formDetail.date == "3") {
        this.formDetail.endDate = Interval.getDay(0);
        this.formDetail.startDate = Interval.getDay(-90);
      } else if (this.formDetail.date == "5") {
        this.formDetail.endDate = Interval.getDay(0);
        this.formDetail.startDate =
          new Date().getFullYear() +
          "-" +
          ((new Date().getMonth() + 1).toString().length == 1
            ? "0" + (new Date().getMonth() + 1)
            : new Date().getMonth() + 1) +
          "-01";
      } else if (this.formDetail.date == "4") {
        this.formDetail.endDate = this.formDetail.endDate;
        this.formDetail.startDate = this.formDetail.startDate;
      }
      if (this.formDetail.endDate < this.formDetail.startDate) {
        return this.$message.error("结束日期不能早于开始日期!");
      }
      let params = {
        pageNum: this.currentPage,
        pageSize: this.pageSize,
        note: this.formDetail.note,
        inOutType: this.formDetail.inOutType,
        bizUserName: this.formDetail.bizUserName,
        managerId: this.formDetail.managerId,
        queryType: 3,
        endDate: this.formDetail.endDate,
        startDate: this.formDetail.startDate
      };
      this.$api
        .AccountList(params)
        .then(res => {
          // console.log(res)
          if (res.data.respCode == 0) {
            if (res.data.data) {
              const {
                data: { list, pages, total, pageNum }
              } = res.data;
              this.tableData = list;
              this.pageCount = pages;
            }
          }
        })
        .catch();
    },
    getSummaryData() {
      if (this.formDetail.endDate < this.formDetail.startDate) {
        return this.$message.error("结束日期不能早于开始日期!");
      }
      let params = {
        pageNum: this.currentPage,
        pageSize: this.pageSize,
        note: this.formDetail.note,
        inOutType: this.formDetail.inOutType,
        bizUserName: this.formDetail.bizUserName,
        managerId: this.formDetail.managerId,
        queryType: 3,
        endDate: this.formDetail.endDate,
        startDate: this.formDetail.startDate
      };
      this.$api
        .AccountSummaryData(params)
        .then(res => {
          // console.log(res)
          if (res.data.respCode == 0) {
            if (res.data.data) {
              this.isDisabled = false;
              this.moneyTotal = res.data.data;
              // if(!sessionStorage.getItem('bizUserName')){
              //   sessionStorage.setItem('bizUserName', res.data.data.bizUserNameList)
              // }
              // this.bizUserNameList = sessionStorage.getItem('bizUserName').split(',')
            } else {
              this.moneyTotal = {};
              this.isDisabled = true;
            }
          }
        })
        .catch();
    },
    getCustomer() {
      let params = {
        bindingStatus: -1
      };
      this.$api
        .getPmListCus(params)
        .then(res => {
          // console.log(res)
            if (res.data) {
              this.customerManager = res.data;
              this.customerManager.forEach(item => {
                this.nameAliasLength = item.nameAlias;
              });
            }
        })
        .catch();
    },
    amountFormatter(row, column, cellValue) {
      if (row.inOutTypeName == "支出") {
        return -cellValue;
      } else if (row.inOutTypeName == "收入") {
        return cellValue;
      }
    },
    searchBizUserName() {
      this.currentPage = 1;
      this.getData();
      this.getSummaryData();
    },
    btn_true() {
      this.currentPage = 1;
      this.getData();
      this.getSummaryData();
    },
    exportExcel() {
      let params = {
        pageNum: this.currentPage,
        pageSize: this.pageSize,
        note: this.formDetail.note,
        inOutType: this.formDetail.inOutType,
        bizUserName: this.formDetail.bizUserName,
        managerId: this.formDetail.managerId,
        queryType: 3,
        endDate: this.formDetail.endDate,
        startDate: this.formDetail.startDate
      };
      this.loading = true;
      this.$api
        .AccountOtherExport(params)
        .then(res => {
          // console.log(res)
          setTimeout(() => {
            this.loading = false;
          }, 2000);
          if (res.data.respCode == 0) {
            if (res.data.data) {
              window.open(res.data.data);
            }
          }
        })
        .catch();
    },
    handleCurrentChange(val) {
      this.currentPage = val;
      this.getData();
    }
  },
  mounted() {
    this.getCustomer();
    this.getData();
    this.getSummaryData();
    // this.drawChart()
  }
};
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


