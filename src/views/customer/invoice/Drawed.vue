<template>
 <!-- class="table-box back-white" -->
  <div>
    <el-table class="table-outline" :data="tableData" empty-text="暂无相关信息" center>
      <el-table-column prop="amount" :show-overflow-tooltip="true" label="开票金额(元)" align="center" min-width="120">
      </el-table-column>
      <el-table-column prop="invoiceType" :show-overflow-tooltip="true" label="发票类型" align="center" min-width="120" :formatter="fortype">
      </el-table-column>
      <el-table-column prop="invoiceName" :show-overflow-tooltip="true" label="发票内容" align="center" min-width="120">
      </el-table-column>
      <el-table-column prop="invoiceTax" :show-overflow-tooltip="true" label="发票税点(%)" align="center" min-width="120">
      </el-table-column>
      <el-table-column prop="invoiceType" :show-overflow-tooltip="true" label="发票号码" align="center" min-width="120">
      </el-table-column>
      <el-table-column prop="expressCompany" :show-overflow-tooltip="true" label="物流公司" align="center" min-width="120">
      </el-table-column>
      <el-table-column prop="expressNumber" :show-overflow-tooltip="true" label="快递单号" align="center" min-width="120">
      </el-table-column>
      <!-- <el-table-column prop="invoiceContext" :show-overflow-tooltip="true" label="发票项目" align="center" min-width="140">
      </el-table-column> -->
      <el-table-column prop="createdAt" :show-overflow-tooltip="true" label="提交时间" align="center" min-width="120" :formatter="fortypeTime">
      </el-table-column>
      <el-table-column label="操作" width="200px">
        <template slot-scope="scope">
          <el-button type="text" class="btn-icon btn-icon-view" size="mini" @click="checkInfo">开票信息</el-button>
          <el-button type="text" class="btn-icon btn-icon-tickets" size="mini" @click="checkAddress">收票地址</el-button>
        </template>
      </el-table-column>
    </el-table>

    <div class="pagination-container">
      <el-pagination class="pagebox" @current-change="changePage" :page-size="pageSize" :current-page="currentPagePlat" :page-count="pageCountPlat" :total="total" layout="total , prev, pager, next, jumper">
      </el-pagination>
    </div>
    <!-- 窗窗(开票信息) -->
    <el-dialog title="开票信息" :visible.sync="dialogVisible" v-if="dialogVisible" width="640px" class="dialog">
      <el-form label-width="150px" labelPosition="center">
        <el-form-item label="公司全称：" class="formSearchMargin">
          <span>浙江万才公司</span>
        </el-form-item>
        <el-form-item label="统一社会信用代码：" class="formSearchMargin">
          <span>123154465X</span>
        </el-form-item>
        <el-form-item label="注册地址：" class="formSearchMargin">
          <span>高德置地广场</span>
        </el-form-item>
        <el-form-item label="注册电话：" class="formSearchMargin">
          <span>0571-15748312</span>
        </el-form-item>
        <el-form-item label="开户银行：" class="formSearchMargin">
          <span>招商银行</span>
        </el-form-item>
        <el-form-item label="银行账号：" class="formSearchMargin">
          <span>620019861154354</span>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogVisible = false">确 认</el-button>
      </span>
    </el-dialog>
    <!-- 窗窗(收票地址) -->
    <el-dialog title="收票地址" :visible.sync="dialogVisibleAddress" v-if="dialogVisibleAddress" width="540px" class="dialog">
      <el-form label-width="150px" labelPosition="center">
        <el-form-item label="收货人：" class="formSearchMargin">
          <span>浙江万才公司</span>
        </el-form-item>
        <el-form-item label="手机号码：" class="formSearchMargin">
          <span>123154465X</span>
        </el-form-item>
        <el-form-item label="地址：" class="formSearchMargin">
          <span>高德置地广场</span>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogVisibleAddress = false">确 认</el-button>
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
      pageCountPlat: 0,
      total: 0,
      dialogVisible: false,
      dialogVisibleAddress: false
    }
  },
  methods: {
    getList2(){
      let params = {
        pageNum: this.currentPagePlat,
        pageSize: this.pageSize,
        status: 2,
      }
      this.$api.invoiceAdd(params).then(res => {
        console.log(res)
        if(res.data.respCode == 0){
            const {
            data: {
              pages,
              pageNum,
              total,
              list
            }
          } = res.data
          this.tableData = list
          this.pageCountPlat = pages
          this.total = total
        }
      }).catch()
    },
    checkInfo(row){
      this.dialogVisible = !this.dialogVisible
      this.row = row
    },
    checkAddress(row){
      this.dialogVisibleAddress = !this.dialogVisibleAddress
      this.row = row
    },
    changePage(val) {
      this.currentPagePlat = val
      this.getList()
    },
    getList() {
      const params = {
        pageNum: this.currentPagePlat,
        pageSize: 20,
        status: 2,
      };
      this.$api
        .AlreadyDrawed(params)
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
        return '增值税普通发票'
      } else {
        return '增值税专用发票'
      }
    },
    fortypeTime(val){
      if(val){
        return val.createdAt.substr(0,10)
      }
    }
  },
  mounted() {
    this.getList2()
  }
}
</script>
