<template>
  <div class='on-working'>
    <div class="filter-condition">
      <el-form ref="form" :model="form" label-width="100px" labelPosition="left">
        <!--搜索区域-->
        <div class="search-zone">
          <el-form-item class="formSearchMargin">
            <el-input placeholder="输入关键字搜索" v-model="keyWord" size="mini" class="input-with-select select-input">
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
        <el-table-column label="工种" prop="industry" show-overflow-tooltip align="center" min-width="100"></el-table-column>
        <el-table-column label="结算方式" prop="jobType" show-overflow-tooltip align="center" min-width="100"></el-table-column>
        <el-table-column label="项目经理" prop="1" show-overflow-tooltip align="center" min-width="100"></el-table-column>
        <el-table-column label="劳务地区" prop="2" show-overflow-tooltip align="center" min-width="100"></el-table-column>
        <el-table-column label="推荐进度" prop="3" show-overflow-tooltip align="center" min-width="100"></el-table-column>
        <el-table-column label="已支付佣金（元）" prop="4" show-overflow-tooltip align="center" min-width="100"></el-table-column>
        <el-table-column label="已支付信息费（元）" prop="5" show-overflow-tooltip align="center" min-width="100"></el-table-column>
        <el-table-column label="剩余冻结费用（元）" prop="6" show-overflow-tooltip align="center" min-width="100"></el-table-column>
        <el-table-column label="操作" align="center" min-width="150">
          <template v-slot="scope">
            <el-button type="text" class="btn-icon btn-icon-view" size="mini" @click="handleShowExpenses(scope.row)">佣金详情</el-button>
          </template>
        </el-table-column>
      </el-table>

      <div class="pagination-container">
        <el-pagination class="pagebox" layout="total , prev, pager, next, jumper" :total="total" :current-page.sync="currentPage" @current-change="handleCurrentChange" :page-size="pageSize"></el-pagination>
      </div>
    </div>

    <dialog-expenses v-if="isShowExpenses" :dialogVisible="isShowExpenses" :expensesInfo="currentItem" @handleClose="handleClose"></dialog-expenses>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import DialogExpenses from './DialogExpenses'

export default {
  name: 'OnWorking',
  components: { DialogExpenses },
  data() {
    return {
      tableData: [],
      currentPage: 1,
      pageSize: 20,
      total: 0,
      isShowComb: false,
      keyWord: '',
      form: {
        managerId: '',
        keyWord: ''
      },
      currentItem: [],
      isShowExpenses: false
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
    handleCombShow() {
      this.isShowComb = !this.isShowComb
    },
    getList() {
      let params = {}

      let item = {
        industry: '抢银行',
        jobType: '日结',
        1: '萨达姆',
        2: '阿富汗',
        3: '10/10',
        4: '10000',
        5: '10000',
        6: '10000',
      }
      for (let i = 0; i < 10; i++) {
        this.tableData.push(item)
      }
    },
    handleSearch() {
      this.form.keyWord = this.keyWord
    },
    handleCurrentChange(val) {
      this.currentPage = val
    },
    handleShowExpenses(row) {
      this.currentItem = row

      this.currentItem = [
        { info: '条件1：出勤10天给付200元', status: true },
        { info: '条件2：出勤10天给付200元', status: true },
        { info: '条件3：出勤10天给付200元', status: false }
      ]
      this.isShowExpenses = true
    },
    handleClose() {
      this.isShowExpenses = false
    }
  },
}
</script>
