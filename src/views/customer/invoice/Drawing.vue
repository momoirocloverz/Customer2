<template>
  <div class="table-box back-white drawing">
    <div class="table-summary">
      <el-form label-width="80px" label-position="left" v-model="form">
        <el-form-item label="发票类型：" prop="settleType" class="formSearchMargin mTop2 inpWidth">
          <el-radio-group v-model="form.type">
            <el-radio label='1'>增值税普通发票</el-radio>
            <el-radio label='2'>增值税专用发票</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="发票项目：" prop="settleType" class="formSearchMargin mTop2 inpWidth invoice-type">
          服务费
        </el-form-item>
      </el-form>

      <el-button size="medium" type="primary" :disabled="selected.length ==0" @click="submit">确认开票</el-button>
    </div>

    <div class="table-box back-white">
      <el-table class="table-outline" :data="tableData" empty-text="暂无相关信息" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55">
        </el-table-column>
        <el-table-column label="金额(元)" prop="amount" show-overflow-tooltip align="center" min-width="100">
        </el-table-column>
        <el-table-column label="交易明细" prop="note" show-overflow-tooltip align="center" min-width="100">
        </el-table-column>
        <el-table-column label="发生时间" prop="receiveTime" show-overflow-tooltip align="center" min-width="140">
        </el-table-column>
      </el-table>
    </div>
    <!-- <div class="box-footer">
      <el-button size="medium" type="primary" :disabled="selected.length ==0" @click="submit">提 交</el-button>
      <el-button size="medium" @click="$router.go(-1)">取 消</el-button>
    </div> -->
  </div>
</template>

<script>
export default {
  name: 'undrawed',
  data() {
    return {
      tableData: [],
      currentPagePlat: 1,
      pageCountPlat: 1,
      form: {
        type: '1'
      },
      selected: []
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
        pageSize: 100,
      };
      this.$api
        .InvoieRecord(params)
        .then(response => {
          if (response.data.respCode == 0) {
            this.tableData = response.data.data.list;
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    submit() {
      let ids = []
      for (let i in this.selected) {
        ids.push(this.selected[i].id)
      }
      const params = {
        invoiceType: this.form.type,
        invoiceContext: '服务费',
        recordIds: ids.join(','),
        applyUserType: 2
      };
      this.$api
        .InvoieSubmit(params)
        .then(response => {
          if (response.data.respCode == 0) {
            this.$message.success('已提交开票申请')
            this.$router.go(-1)
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    fortype(val) {
      if (val == 1) {
        return '普票'
      } else {
        return '专票'
      }
    },
    handleSelectionChange(val) {
      this.selected = val
    }
  },
  mounted() {
    this.getList()
  }
}
</script>

<style lang="scss">
.drawing {
  .table-summary {
    position: relative;
    padding: 10px 24px;
    display: flex;
    .el-form-item {
      display: inline-block;
    }
    .el-form-item__label {
      font-size: 12px;
      line-height: 32px;
      color: #333;
    }
    .el-radio__label,
    .el-form-item__content {
      font-size: 12px;
      color: #666;
    }
    .invoice-type {
      margin-left: 150px;
    }
    .el-button--primary {
      position: absolute;
      width: 90px;
      height: 32px;
      padding: 0;
      text-align: center;
      line-height: 32px;
      font-size: 14px;
      top: 10px;
      right: 24px;
      color: #e94c21;
      background-color: #ffefea;
    }
  }
}
</style>
