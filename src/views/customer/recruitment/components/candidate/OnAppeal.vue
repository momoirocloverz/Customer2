<template>
  <div class='on-appeal'>
    <div class="filter-condition">
      <el-form ref="form" :model="form" label-width="100px" labelPosition="left">
        <div class="search-zone">
          <el-form-item>
            <el-input placeholder="输入关键字搜索" v-model="form.keyWord" size="mini" class="input-with-select select-input">
              <el-select v-model="form.selectType" slot="append" placeholder="请选择">
                <el-option label="候选人" value="2"></el-option>
                <el-option label="推荐人" value="1"></el-option>
              </el-select>
            </el-input>
            <el-button type="primary" class="searchBtn" @click="handleSearch">搜索</el-button>

            <el-button class="comb-btn" size="mini" type="text" @click="handleCombShow">高级筛选<i class="el-icon-right el-icon-d-arrow-right" :class="isShowComb ? 'el-icon-d-arrow-right-down' : 'el-icon-d-arrow-right-right'"></i></el-button>
          </el-form-item>
        </div>
        <div v-show="isShowComb" class="combine-zone">
          <el-form-item label="工种：" class="radio-multi-line">
            <el-radio-group class="radio-search" v-model="form.industryType">
              <el-radio label="">不限</el-radio>
              <el-radio :label="item.skillValue" v-for="item in industryList">{{item.skillName}}</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="结算方式：">
            <el-radio-group class="radio-search" v-model="form.status">
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
        </div>
      </el-form>
    </div>

    <div class="table-box back-white">
      <el-table :data="tableData" empty-text="暂无相关信息">
        <el-table-column label="候选人" prop="" show-overflow-tooltip align="center" min-width="100"></el-table-column>
        <el-table-column label="推荐人" prop="" show-overflow-tooltip align="center" min-width="100"></el-table-column>
        <el-table-column label="工种" prop="" show-overflow-tooltip align="center" min-width="100"></el-table-column>
        <el-table-column label="项目经理" prop="" show-overflow-tooltip align="center" min-width="100"></el-table-column>
        <el-table-column label="失败原因" prop="" show-overflow-tooltip align="center" min-width="100"></el-table-column>
        <el-table-column label="已出勤天数" prop="" show-overflow-tooltip align="center" min-width="100"></el-table-column>
        <el-table-column label="已支付佣金（元）" prop="" show-overflow-tooltip align="center" min-width="100"></el-table-column>
        <el-table-column label="操作" align="center" min-width="150">
          <template v-slot="scope">
            <el-button type="text" class="btn-icon btn-icon-detail" size="mini" @click="handleExpensesShow(scope.row)">佣金详情</el-button>
            <el-button type="text" class="btn-icon btn-icon-detail" size="mini" @click="handleAppealShow(scope.row)">申诉信息</el-button>
          </template>
        </el-table-column>
      </el-table>

      <div class="pagination-container">
        <el-pagination class="pagebox" layout="total , prev, pager, next, jumper" :total="total" :current-page.sync="currentPage" @current-change="handleCurrentChange" :page-size="pageSize"></el-pagination>
      </div>
    </div>

    <dialog-expenses v-if="isShowExpenses" @handleClose="handleExpensesClose" class="self-dialog"></dialog-expenses>
    <dialog-appeal v-if="isShowAppeal" :appealVisible="isShowAppeal" @handleClose="handleAppealClose" class="self-dialog"></dialog-appeal>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import DialogExpenses from './DialogExpenses'
import DialogAppeal from './DialogAppeal'

export default {
  name: 'OnAppeal',
  components: { DialogExpenses, DialogAppeal },
  data() {
    return {
      tableData: [],
      currentPage: 1,
      pageSize: 20,
      total: 0,
      form: {
        managerId: '',
        status: '',
        industryType: ''
      },
      isShowComb: false,
      isShowExpenses: false,
      isShowAppeal: false
    };
  },
  computed: {
    ...mapState(['pmList', 'industryList'])
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
  mounted() {
    this.getList()
  },
  methods: {
    getList() {
      this.tableData = [
        {},
        {}
      ]
    },
    handleCurrentChange(val) {
      this.currentPage = val
    },
    handleShowDetail(row) {

    },
    handleSearch() { },
    handleCombShow() {
      this.isShowComb = !this.isShowComb
    },
    handleShowExpenses(row) {
      this.isShowExpenses = true
    },
    handleExpensesClose() {
      this.isShowExpenses = false
    },
    handleAppealShow(row) {
      this.isShowAppeal = true
    },
    handleAppealClose() {
      this.isShowAppeal = false
    }
  },
}
</script>
