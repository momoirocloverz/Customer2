<template>
  <div class="expenses-detail">
    <div class="filter-condition">
      <el-form ref="form" :model="form" label-width="100px" labelPosition="left">
        <div class="search-zone">
          <el-form-item>
            <el-input placeholder="输入关键字搜索" v-model="keyWord" size="mini" class="input-with-select select-input">
              <el-select v-model="form.selectType" slot="append" placeholder="请选择">
                <el-option label="推荐者" value="2"></el-option>
                <el-option label="候选者" value="1"></el-option>
              </el-select>
            </el-input>
            <el-button type="primary" class="searchBtn" @click="handleSearch">搜索</el-button>

            <el-button class="comb-btn" size="mini" type="text" @click="handleCombShow">高级筛选<i class="el-icon-right el-icon-d-arrow-right" :class="isShowComb ? 'el-icon-d-arrow-right-down' : 'el-icon-d-arrow-right-right'"></i></el-button>
          </el-form-item>
        </div>
        <div v-show="isShowComb" class="combine-zone">
          <el-form-item label="工种：" class="radio-multi-line">
            <el-radio-group class="radio-search" v-model="form.industry">
              <el-radio label="">不限</el-radio>
              <el-radio :label="item.skillValue" v-for="item in industryList">{{item.skillName}}</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="结算方式：">
            <el-radio-group class="radio-search" v-model="form.jobType">
              <el-radio label="">不限</el-radio>
              <el-radio label="2">月结</el-radio>
              <el-radio label="4">周结</el-radio>
              <el-radio label="1">日结</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="项目经理：">
            <el-radio-group class="radio-search" v-model="form.managerId">
              <el-radio label="">不限</el-radio>
              <el-radio :label="item.id" v-for="item in pmList">{{item.nameAlias}}</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="日期范围：">
            <el-radio-group class="radio-search" v-model="dateStatus">
              <el-radio label="1">不限</el-radio>
              <el-radio label="2">自定义</el-radio>
            </el-radio-group>
            <el-date-picker class="margin_left40" size="mini" v-model="startDate" type="date" value-format="yyyy-MM-dd" placeholder="选择开始时间"></el-date-picker>
            --
            <el-date-picker class="margin_left10" size="mini" v-model="endDate" type="date" value-format="yyyy-MM-dd" placeholder="选择结束时间"></el-date-picker>
            <el-button type="primary" class="datesearchBtn" @click="getList">确定</el-button>
          </el-form-item>
        </div>
      </el-form>
    </div>

    <div class="table-box back-white">
      <p class="table-data-summary">佣金合计{{totalCommissionAmount}}元，信息费合计{{totalInformationFeeAmount}}元，总计{{Number(totalCommissionAmount) + Number(totalInformationFeeAmount)}}元，共{{total}}条记录</p>
      <el-table :data="tableData" empty-text="暂无相关信息">
        <el-table-column label="项目经理" prop="managerNameAlias" show-overflow-tooltip align="center" min-width="100"></el-table-column>
        <el-table-column label="推荐人" prop="referrer" show-overflow-tooltip align="center" min-width="100"></el-table-column>
        <el-table-column label="候选人" prop="candidate" show-overflow-tooltip align="center" min-width="100"></el-table-column>
        <el-table-column label="工种" prop="industryName" show-overflow-tooltip align="center" min-width="100"></el-table-column>
        <el-table-column label="支出时间" prop="createdAt" show-overflow-tooltip align="center" min-width="100"></el-table-column>
        <el-table-column label="类型" prop="type" :formatter="expensesTypeFormatter" show-overflow-tooltip align="center" min-width="100"></el-table-column>
        <el-table-column label="金额（元）" prop="amount" show-overflow-tooltip align="center" min-width="100"></el-table-column>
        <el-table-column label="条件" prop="ruleReachQuantity" show-overflow-tooltip align="center" min-width="100"></el-table-column>
      </el-table>

      <div class="pagination-container">
        <el-pagination class="pagebox" layout="total , prev, pager, next, jumper" :total="total" :current-page.sync="currentPage" @current-change="handleCurrentChange" :page-size="pageSize"></el-pagination>
      </div>
    </div>
  </div>
</template>

<script>
import { expensesTypeFormatter } from '@/common/formatter'
export default {
  name: 'ExpensesDetail',
  components: {},
  data() {
    return {
      pmList: [],
      industryList: [],
      isShowComb: false,
      tableData: [],
      total: 0,
      currentPage: 1,
      pageSize: 20,
      totalCommissionAmount: 0, // 总佣金
      totalInformationFeeAmount: 0,  // 总信息费
      startDate: '',
      endDate: '',
      dateStatus: '1',
      keyWord: '',
      form: {
        keyWord: '',
        industry: '',
        status: '',
        jobType: '',
        managerId: ''
      }
    };
  },

  mounted() {
    this.getPmList()
    this.getIndustryList()
    this.getList()
  },
  watch: {
    form: {
      handler() {
        this.currentPage = 1
        this.getList()
      },
      deep: true
    }
  },
  methods: {
    // 该客户下所有绑定或已解绑或解绑中的项目经理
    getPmList() {
      this.$api
        .getAllPmListCus()
        .then(response => {
          this.pmList = response.data
        })
        .catch(error => {
          console.log(error);
        });
    },
    // 该客户所属行业对应的全部工种
    getIndustryList() {
      this.$api
        .getAllIndustryList()
        .then(response => {
          this.industryList = response.data
        })
        .catch(error => {
          console.log(error);
        });
    },
    getList() {
      let params = {}
      if (this.dateStatus === '1') {
        params = {
          pageNum: this.currentPage,
          pageSize: this.pageSize,
          industry: this.form.industry,
          managerId: this.form.managerId,
          keyWord: this.form.keyWord
        }
      } else {
        params = {
          pageNum: this.currentPage,
          pageSize: this.pageSize,
          industry: this.form.industry,
          managerId: this.form.managerId,
          startDate: this.startDate,
          endDate: this.endDate,
          keyWord: this.form.keyWord
        }
      }
      this.$api.getExpenseDetail(params)
        .then(res => {
          console.log('查询明细列表成功！')

          let { list, total } = res.data.data
          this.tableData = list
          this.total = total
        })
        .catch(err => {
          console.log('查询明细列表失败！', err)
        })

      this.$api.getExpenseDetailTotal(params)
        .then(res => {
          console.log('查询明细汇总成功！')
          this.totalInformationFeeAmount = res.data.totalInformationFeeAmount || 0
          this.totalCommissionAmount = res.data.totalCommissionAmount || 0
        })
        .catch(err => {
          console.log('查询明细汇总失败！', err)
        })
    },
    handleCombShow() {
      this.isShowComb = !this.isShowComb
    },
    handleSearch() {
      this.form.keyWord = this.keyWord
    },
    handleCurrentChange(val) {
      this.currentPage = val
      this.getList()
    },
    expensesTypeFormatter
  },
}
</script>
