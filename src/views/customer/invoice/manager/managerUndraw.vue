<template>
  <div class="table-box back-white">
    <el-table class="table-outline" :data="tableData" empty-text="暂无相关信息">
      <el-table-column prop="invoiceName" :show-overflow-tooltip="true" label="开票方" align="center" min-width="100">
      </el-table-column>
      <el-table-column prop="invoiceToCustomerName" :show-overflow-tooltip="true" label="项目经理公司名称" align="center" min-width="100">
      </el-table-column>
      <el-table-column prop="applyUserName" :show-overflow-tooltip="true" label="收票方" align="center" min-width="140">
      </el-table-column>
      <el-table-column prop="amount" :show-overflow-tooltip="true" label="开票金额(元)" align="center" min-width="100">
      </el-table-column>
      <el-table-column prop="invoiceType" :show-overflow-tooltip="true" label="发票类型" align="center" min-width="80" :formatter="fortype">
      </el-table-column>
      <el-table-column prop="invoiceContext" :show-overflow-tooltip="true" label="发票项目" align="center" min-width="80">
      </el-table-column>
      <el-table-column prop="createdAt" :show-overflow-tooltip="true" label="提交时间" align="center" min-width="100">
      </el-table-column>
      <el-table-column label="操作" min-width="140">
        <template slot-scope="scope">
          <el-button class="btn-icon btn-icon-view" type="text" size="mini" @click="handleClick(scope.row)">开票信息</el-button>
          <el-button class="btn-icon btn-icon-edit" type="text" size="mini" @click="addNew(scope.row)">开票</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="pagination-container">
      <el-pagination class="pagebox" @current-change="changePage" :current-page="currentPagePlat" :page-size="pageSize" :total="total" layout="total , prev, pager, next, jumper">
      </el-pagination>
    </div>
    <el-dialog title="" :visible.sync="confirmDia" width="600px" center>
      <div class="dialog-head">
        <span>开票信息</span>
      </div>
      <div style="margin:40px auto 0">
        <el-form ref="form" :model="form" label-width="160px" label-position="left" :rules="rules">
          <el-form-item label="开票公司：" class="label">
            {{row.invoiceName ? row.invoiceName : ''}}
          </el-form-item>
          <el-form-item label="开票公司：" class="label">
            {{row.invoiceToCustomerName ? row.invoiceToCustomerName : ''}}
          </el-form-item>
          <el-form-item label="统一社会信用代码：" class="label">
            {{row.creditCode ? row.creditCode : ''}}
          </el-form-item>
          <el-form-item label="注册地址：" class="label">
            {{row.registeAddress ? row.registeAddress : ''}}
          </el-form-item>
          <el-form-item label="注册电话：" class="label">
            {{row.phone ? row.phone : ''}}
          </el-form-item>
          <el-form-item label="开户银行：" class="label">
            {{row.bankName ? row.bankName : ''}}
          </el-form-item>
          <el-form-item label="银行账号：" class="label">
            {{row.bankCard ? row.bankCard : ''}}
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button round size="medium" type="primary" @click="confirmDia = false">确 认</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'managerUndraw',
  data() {
    return {
      tableData: [],
      currentPagePlat: 1,
      currentPagePlat: 1,
      total: 0,
      pageSize: 20,
      confirmDia: false,
      form: {

      },
      row: {},
      rules: []
    }
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
        applyUserType: 2
      };
      this.$api
        .ForDrawAction(params)
        .then(response => {
          if (response.data.respCode == 0) {
            this.tableData = response.data.data.list;
            this.total = response.data.data.total;
            this.pageCountPlat = response.data.data.pages
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    handleClick() {
      this.row = row
      this.confirmDia = true
    },
    addNew(row) {
      this.$router.push({ name: 'drawing', params: { id: row.id } })
    },
    fortype(val) {
      if (val.invoiceType == 1) {
        return '普票'
      } else {
        return '专票'
      }
    },
  },
  mounted() {
    this.getList()
  }
}
</script>

<style scoped>
</style>