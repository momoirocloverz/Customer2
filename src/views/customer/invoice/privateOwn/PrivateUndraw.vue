<template>
  <div class="table-box back-white">
    <el-table class="table-outline" :data="tableData" empty-text="暂无相关信息">
      <el-table-column prop="invoiceName" :show-overflow-tooltip="true" label="开票方" align="center" min-width="120">
      </el-table-column>
      <el-table-column prop="amount" :show-overflow-tooltip="true" label="开票金额(元)" align="center" min-width="100">
      </el-table-column>
      <el-table-column prop="invoiceType" :show-overflow-tooltip="true" label="发票类型" align="center" min-width="100" :formatter="fortype">
      </el-table-column>
      <el-table-column prop="invoiceContext" :show-overflow-tooltip="true" label="发票项目" align="center" min-width="140">
      </el-table-column>
      <el-table-column prop="createdAt" :show-overflow-tooltip="true" label="提交时间" align="center" min-width="100">
      </el-table-column>
    </el-table>
    <div class="pagination-container">
      <el-pagination class="pagebox" @current-change="changePage" :current-page="currentPagePlat" :page-count="currentPagePlat" :total="total" layout="total , prev, pager, next, jumper">
      </el-pagination>
    </div>
  </div>
</template>

<script>
export default {
  name: 'PrivateUndraw',
  data() {
    return {
      tableData: [],
      currentPagePlat: 1,
      currentPagePlat: 1,
      total: 0,
    }
  },
  mounted() {
    this.getList()
  },
  methods: {
    changePage(val) {
      this.currentPagePlat = val
      this.getList()
    },
    getList() {
      const params = {
        pageNum: this.currentPagePlat,
        pageSize: 20,
        applyUserType: 3
      };
      this.$api
        .ForDraw(params)
        .then(response => {
          if (response.data.respCode == 0) {
            this.tableData = response.data.data.list;
            this.pageCountPlat = response.data.data.pages
            this.total = response.data.data.total
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    fortype(val) {
      if (val.invoiceType == 1) {
        return '普票'
      } else {
        return '专票'
      }
    },
  },
}
</script>
