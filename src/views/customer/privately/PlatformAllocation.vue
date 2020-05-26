<template>
  <div class="platform-allocation back-white">
    <search-bar @handleSearch="handleSearch"></search-bar>

    <el-table class="table-outline" :data="tableData" @selection-change="handleSelectionChange" empty-text="暂无相关个体工商户信息">
      <el-table-column label="字号名称" prop="name" show-overflow-tooltip align="center" min-width="150"></el-table-column>
      <el-table-column label="经营者姓名" prop="legalPerson" show-overflow-tooltip align="center" min-width="150"></el-table-column>
      <el-table-column label="统一社会信用代码" prop="creditCode" show-overflow-tooltip align="center" min-width="160"></el-table-column>
      <el-table-column label="已统筹金额(元)" prop="userAmount" show-overflow-tooltip align="center" min-width="150"></el-table-column>
      <el-table-column label="累计支付服务费(元)" prop="totalPayAmount" show-overflow-tooltip align="center" min-width="150"></el-table-column>

      <el-table-column label="操作" min-width="150">
        <template slot-scope="scope">
          <el-button type="text" size="mini" class="btn-icon btn-icon-detail" @click="viewRecord(scope.row)">明细</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="pagination-container">
      <el-pagination class="pagebox" @current-change="changePage" :current-page="currentPage" :total="total" layout="total, prev, pager, next, jumper"></el-pagination>
    </div>
  </div>
</template>

<script>
import SearchBar from '@/components/SearchBar'

export default {
  name: 'PlatformAllocation',
  components: { SearchBar },
  data() {
    return {
      tableData: [],
      currentPage: 1,
      total: 0,
      formPlat: {
        keyWord: ''
      },
    }
  },
  mounted() {
    this.getList()
  },
  methods: {
    handleSearch(keyword) {
      this.formPlat.keyWord = keyword
      this.getList()
    },
    changePage(val) {
      this.currentPage = val
      this.getList()
    },
    viewRecord() { },
    handleSelectionChange() { },
    getList() {
      const params = {
        pageNum: this.currentPage,
        pageSize: 20,
        isSelf: 2,
        companyName: this.formPlat.keyWord
      };
      this.$api
        .PlatPrivatelyList(params)
        .then(response => {
          if (response.data.respCode == 0) {
            this.tableData = response.data.data.list
            this.total = response.data.data.total
          }
        })
        .catch(error => {
          console.log(error);
        });
    }
  }
}
</script
