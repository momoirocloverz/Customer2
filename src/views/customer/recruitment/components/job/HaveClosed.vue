<template>
  <div class='have-closed'>
    <div class="filter-condition">
      <el-form ref="form" :model="form" label-width="100px" labelPosition="left">
        <div class="combine-zone">
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
          <el-form-item label="工种：" class="radio-multi-line">
            <el-radio-group class="radio-search" v-model="form.industry">
              <el-radio label="">不限</el-radio>
              <el-radio :label="item.skillValue" v-for="item in industryList">{{item.skillName}}</el-radio>
            </el-radio-group>
          </el-form-item>
        </div>
      </el-form>
    </div>

    <div class="table-box back-white">
      <el-table :data="tableData" empty-text="暂无相关信息">
        <el-table-column label="工种" prop="industryName" show-overflow-tooltip align="center" min-width="100"></el-table-column>
        <el-table-column label="结算方式" prop="jobType" :formatter="jobTypeFormatter" show-overflow-tooltip align="center" min-width="100"></el-table-column>
        <el-table-column label="项目经理" prop="managerNameAlias" show-overflow-tooltip align="center" min-width="100"></el-table-column>
        <el-table-column label="劳务地区" :formatter="jobLocationFormatter" show-overflow-tooltip align="center" min-width="100"></el-table-column>
        <el-table-column label="推荐进度" :formatter="recommendProcessFormatter" show-overflow-tooltip align="center" min-width="100"></el-table-column>
        <el-table-column label="已支付佣金（元）" prop="reachCommissionAmount" show-overflow-tooltip align="center" min-width="100"></el-table-column>
        <el-table-column label="已支付信息费（元）" :formatter="expenseInfoFeeFormatter" show-overflow-tooltip align="center" min-width="100"></el-table-column>
        <el-table-column label="剩余冻结费用（元）" :formatter="totalFeeFormatter" show-overflow-tooltip align="center" min-width="100"></el-table-column>
        <el-table-column label="操作" align="center" min-width="150">
          <template v-slot="scope">
            <el-button type="text" class="btn-icon btn-icon-view" size="mini" @click="routeToDetail(scope.row)">查看</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination-container">
        <el-pagination class="pagebox" layout="total , prev, pager, next, jumper" :total="total" :current-page.sync="currentPage" @current-change="handleCurrentChange" :page-size="pageSize"></el-pagination>
      </div>
    </div>
  </div>
</template>

<script>
import { jobTypeFormatter, jobLocationFormatter, recommendProcessFormatter, expenseInfoFeeFormatter, totalFeeFormatter } from '@/common/formatter'
import { mapState } from 'vuex'
export default {
  name: 'HaveClosed',
  components: {},
  data() {
    return {
      tableData: [],
      currentPage: 1,
      pageSize: 20,
      total: 0,
      form: {
        managerId: '',
        industry: '',
        jobType: ''
      }
    };
  },
  computed: {
    ...mapState(['pmList', 'industryList'])
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
    getList() {
      let params = {
        status: 3,  // 关闭
        pageSize: this.pageSize,
        pageNum: this.currentPage,
        industry: this.form.industry,
        jobType: this.form.jobType,
        managerId: this.form.managerId
      }

      this.$api.getJobList(params)
        .then(res => {
          console.log('查询工作机会列表成功')

          this.tableData = res.data.data.list || []
          this.total = res.data.data.total
        })
        .catch(err => {
          onsole.log('查询工作机会列表失败', err)
        })
    },
    handleCurrentChange(val) {
      this.currentPage = val
    },
    routeToDetail(row) {
      const { href } = this.$router.resolve({
        name: "jobdetail",
        params: {
          id: row.id,
        }
      });
      window.open(href, "_blank");
    },
    jobTypeFormatter,
    jobLocationFormatter,
    recommendProcessFormatter,
    expenseInfoFeeFormatter,
    totalFeeFormatter
  },
}
</script>
