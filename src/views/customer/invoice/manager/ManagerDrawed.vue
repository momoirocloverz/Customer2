<template>
  <div class="table-box back-white">
    <el-table class="table-outline" :data="tableData" empty-text="暂无相关信息">
      <el-table-column label="开票方" prop="realName" show-overflow-tooltip align="center" min-width="120">
      </el-table-column>
      <el-table-column label="收票方" prop="realName" show-overflow-tooltip align="center" min-width="120">
      </el-table-column>
      <el-table-column label="开票金额(元)" prop="loginName" show-overflow-tooltip align="center" min-width="140">
      </el-table-column>
      <el-table-column label="发票类型" prop="mobile" show-overflow-tooltip align="center" min-width="140">
      </el-table-column>
      <el-table-column label="发票项目" prop="status" show-overflow-tooltip :formatter="formatStatus" align="center" min-width="140">
      </el-table-column>
      <el-table-column label="发票号码" prop="status" show-overflow-tooltip :formatter="formatStatus" align="center" min-width="140">
      </el-table-column>
      <el-table-column label="提交时间" prop="createdAt" show-overflow-tooltip align="center" min-width="180">
      </el-table-column>
      <el-table-column label="操作" width="140">
        <template slot-scope="scope">
          <el-button type="text" size="mini" class="btn-icon btn-icon-view" @click="handleClick(scope.row)">开票信息</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="pagination-container">
      <el-pagination class="pagebox" @current-change="changePage" :current-page="currentPagePlat" :page-size="pageSize" :total="total" layout="total , prev, pager, next, jumper">
      </el-pagination>
    </div>
    <el-dialog :visible.sync="confirmDia" width="600px" center>
      <div class="dialog-head">
        <span>开票信息</span>
      </div>
      <div style="margin:40px auto 0">
        <el-form ref="form" :model="invoice" label-width="160px" label-position="left" :rules="rules">
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
  name: 'drawed',
  data() {
    return {
      tableData: [],
      currentPagePlat: 1,
      pageSize: 20,
      total: 0,
      row: {},
      invoice: {},
      confirmDia: false,
      rules: []
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
        applyUserType: 2
      };
      this.$api
        .AlreadyDrawedAction(params)
        .then(response => {
          if (response.data.respCode == 0) {
            this.tableData = response.data.data.list;
            this.total = response.data.data.total;
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    handleClick(row) {
      this.row = row
      this.confirmDia = true
    },
  },
}
</script>
