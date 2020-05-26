<template>
  <div class="expenses-total">
    <div class="filter-condition">
      <el-form label-width="100px" labelPosition="left">
        <el-form-item label="日期范围：">
          <el-radio-group class="radio-search" v-model="dateStatus">
            <el-radio label="1">不限</el-radio>
            <el-radio label="2">自定义</el-radio>
          </el-radio-group>
          <el-date-picker class="margin_left40" size="mini" v-model="startDate" type="date" value-format="yyyy-MM-dd" placeholder="选择开始时间">
          </el-date-picker>
          --
          <el-date-picker class="margin_left10" size="mini" v-model="endDate" type="date" value-format="yyyy-MM-dd" placeholder="选择结束时间">
          </el-date-picker>
          <el-button type="primary" class="datesearchBtn" @click="getList">确定</el-button>
        </el-form-item>
      </el-form>
    </div>

    <div class="table-box back-white">
      <!-- :summary-method="getSummaries" -->
      <el-table :data="tableData" show-summary empty-text="暂无相关信息">
        <el-table-column type="index" min-width="50"></el-table-column>
        <el-table-column label="项目经理" prop="managerNameAlias" show-overflow-tooltip align="center" min-width="100"></el-table-column>
        <el-table-column label="佣金支出（元）" prop="totalCommissionAmount" show-overflow-tooltip align="center" min-width="100"></el-table-column>
        <el-table-column label="信息费支出（元）" prop="4" show-overflow-tooltip align="center" min-width="100"></el-table-column>
        <el-table-column label="支出合计（元）" prop="5" show-overflow-tooltip align="center" min-width="100"></el-table-column>
      </el-table>

      <div class="pagination-container">
        <el-pagination class="pagebox" layout="total" :total="total"></el-pagination>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ExpensesTotal',
  components: {},
  data() {
    return {
      tableData: [],
      total: 0,
      pageSize: 0, // 不分页
      dateStatus: '1',
      startDate: '',
      endDate: '',
    };
  },

  computed: {},

  mounted() {
    this.getList()
  },
  methods: {
    getList() {
      let params = {}
      if (this.dateStatus === '1') {
        params = {}
      } else {
        params = {
          startDate: this.startDate,
          endDate: this.endDate
        }
      }

      this.$api.getExpenseSummary(params)
        .then(res => {
          console.log('支出统计列表查询成功')
          let { list, total } = res.response.data
          this.tableData = list
          this.total = total
        })
        .catch(err => {
          console.log('支出统计列表查询失败', err)
        })
    },
    getSummaries(param) {
      // const { columns, data } = param;
      // const sums = [];
      // columns.forEach((column, index) => {
      //   if (index === 0) {
      //     sums[index] = '总价';
      //     return;
      //   }
      //   const values = data.map(item => Number(item[column.property]));
      //   if (!values.every(value => isNaN(value))) {
      //     sums[index] = values.reduce((prev, curr) => {
      //       const value = Number(curr);
      //       if (!isNaN(value)) {
      //         return prev + curr;
      //       } else {
      //         return prev;
      //       }
      //     }, 0);
      //     sums[index] += ' 元';
      //   } else {
      //     sums[index] = 'N/A';
      //   }
      // });

      // return sums;
    }
  },
}
</script>
