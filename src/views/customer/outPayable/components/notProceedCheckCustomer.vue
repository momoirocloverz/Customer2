<template>
  <div>
    <h3 class="sche-title">未结算的排班</h3>
    <div class="table-box back-white">
      <el-table class="table-outline" :data="tableData" emptyText="暂无相关明细" style="width: 100%;">
        <el-table-column label="排班" prop="schedulingName" align="center" min-width="180"></el-table-column>
        <el-table-column label="项目经理" prop="managerNameAlias" align="center" min-width="180"></el-table-column>
      </el-table>
      <div class="pagination-container">
        <el-pagination class="pagebox" layout="prev, pager, next" @current-change="handleCurrentChange" :current-page="currentPage" :page-count="pageCount">
        </el-pagination>
      </div>
    </div>
  </div>
</template>
<script>
  export default {
    data() {
      return {
        currentPage: 1,
        pageCount: 0,
        pageSize: 20,
        tableData: [],
      }
    },
    methods: {
      getScheduingList() {
        let params = {
          pageNum: this.currentPage,
          pageSize: this.pageSize,
          showOutsourcing:true
        }
        this.$api.SchedulingCustomerList(params).then(res => {
          console.log(res)
          if (res.data.respCode == 0) {
            if (res.data.data) {
              this.tableData = res.data.data.list
              this.pageCount = res.data.data.pages
            }
          }
        }).catch()
      },
      handleCurrentChange(val) {
        this.currentPage = val
        this.getScheduingList()
      }
    },
    mounted() {
      this.getScheduingList()
    }
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
    margin-bottom: 20px;
  }
</style>
