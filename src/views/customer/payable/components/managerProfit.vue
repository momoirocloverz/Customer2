<template>
  <div>
    <el-form ref="form" :model="form" label-width="100px" labelPosition="left">
      <!--选择条件的单选按钮-->
      <el-form-item label="状态：" class="formSearchMargin formSearchMarginTop">
        <el-radio-group class="radio-search" v-model="form.status">
          <el-radio label="">不限</el-radio>
          <el-radio label="1">待付</el-radio>
          <el-radio label="2">已付</el-radio>
        </el-radio-group>
      </el-form-item>
    </el-form>
    <div class="splitLine"></div>
    <div>

      <el-table class="table-outline" :data="tableData" empty-text="暂无相关信息">
        <el-table-column prop="batchNumber" show-overflow-tooltip label="批次" align="center" min-width="120">
        </el-table-column>
        <el-table-column prop="allTotalIncome" label="总收入合计(元)" align="center" min-width="100">
        </el-table-column>
        <el-table-column prop="allTotalOut" label="总支出合计(元)" align="center" show-overflow-tooltip min-width="100"></el-table-column>
        <el-table-column prop="allTotalProfit" label="毛利润合计(元)" align="center" show-overflow-tooltip min-width="100"></el-table-column>
        <el-table-column prop="allTotalTaskProfitAdjustment" label="调整合计(元)" align="center" show-overflow-tooltip min-width="100"></el-table-column>
        <el-table-column prop="allActualProfit" label="实发利润合计(元)" align="center" show-overflow-tooltip min-width="150"></el-table-column>
        <el-table-column prop="status" label="状态" align="center" min-width="80">
          <template v-slot="scope">
            {{scope.row.paidMark | formatpaidMark}}
            <!--&gt;0待付-->
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" min-width="180">
          <template v-slot="scope">
            <el-button size="small" type="text" @click="routeToDetail( scope.row)">查看</el-button>
            <!--<el-button size="small" v-if="scope.row.status==1" type="text" @click="freeze( scope.row)">冻结</el-button>-->
            <!--<el-button size="small" v-if="scope.row.status==2" type="text" @click="unfreeze(scope.row)">解冻</el-button>-->
          </template>

        </el-table-column>

      </el-table>
      <div class="page-container">
        <el-pagination class="pagebox" background layout="prev, pager, next" :current-page="currentPage" @current-change="handleCurrentChange" :page-count="pageCount">
        </el-pagination>
      </div>

      <el-dialog title="" :visible.sync="grantVisible" width="500px" center>
        <div class="dialog-head">
          <span>确认发放2018年12月张三
            <br>的项目利润吗？</span>
          <h4>本次发放需收取项目经理300.00元的个体户服务费</h4>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button round size="medium" type="primary" @click="grantVisible = true">发 放</el-button>
          <el-button round size="medium" @click="grantVisible = true">不发放</el-button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import util from '../../../../common/util'
export default {
  name: "Unbound",
  component: {
    //someComponent
  },
  data() {
    return {
      grantVisible: false,
      DeleteVisible: false,
      currentPage: 1,
      pageSize: 20,
      pageCount: '',
      settlementTypeList: '',
      belongtoList: '',
      input5: '',
      select: '',
      tableData: [],
      form: {
        status: '',
      },
      mineItem: {},
      reveiveId: '',
      publishId: '',
    }
  },
  filters: {
    formatminDate(val) {
      return util.minDate(val)
    },
    formatpaidMark(val) {
      if (Number(val) > 1) {
        return '待付'
      } else {
        return '已付'
      }
    }
  },
  mounted() {
    this.getList();
  },
  watch: {
    'form.status': function (val, oldval) {
      this.currentPage = 1
      this.getList();
    },
  },
  methods: {

    routeToPravite() {
      const { href } = this.$router.resolve({
        name: "privateDetail",
        //          params: {
        //            id:this.reveiveId,
        //          }
      });
      window.open(href, "_blank");
    },
    setGrantVisiabe() {
      this.grantVisible = true
    },
    handleSelectionChange(val) {
    },
    RouteToReceive(row) {
      const params = {
        userId: row.receiveUserId,
        type: row.receiveUserType == 1 ? 2 : 3,
      }
      this.$api.getPrimaryKey(params).then(response => {
        console.log(response)
        if (response.respCode == 0) {
          this.reveiveId = response.data
          if (row.receiveUserType == 1) {
            const { href } = this.$router.resolve({
              name: "pmDetail",
              params: {
                id: this.reveiveId,
              }
            });
            window.open(href, "_blank");
          } else if (row.receiveUserType == 2) {
            const { href } = this.$router.resolve({
              name: "workerDetail",
              params: {
                id: this.reveiveId,
              }
            });
            window.open(href, "_blank");
          }
        } else {
          this.$message.error(response.errorMsg)
        }
      })
        .catch(error => {
          console.log(error);
        });
    },
    RouteToPublish(row) {
      const params = {
        userId: row.createdBy,
        type: (row.taskType == 1 || row.taskType == 2) ? 1 : 2,
      }
      this.$api.getPrimaryKey(params).then(response => {
        console.log(response)
        if (response.respCode == 0) {
          this.publishId = response.data
          if (row.taskType == 1 || row.taskType == 2) {
            const { href } = this.$router.resolve({
              name: "customerDetail",
              params: {
                id: this.publishId,
              }
            });
            window.open(href, "_blank");
          } else if (row.taskType == 3) {
            const { href } = this.$router.resolve({
              name: "pmDetail",
              params: {
                id: this.publishId,
              }
            });
            window.open(href, "_blank");
          }
        } else {
          this.$message.error(response.errorMsg)
        }
      })
        .catch(error => {
          console.log(error);
        });
    },
    RouteToBelong(row) {
      if (row.taskType == 3) {
        const { href } = this.$router.resolve({
          name: "taskTrackDetail",
          query: {
            id: row.belongTo,
          }
        });
        window.open(href, "_blank");
      } else if (row.taskType == 2) {
        const { href } = this.$router.resolve({
          name: "subCustomerDetail",
          params: {
            id: row.belongTo,
          }
        });
        window.open(href, "_blank");
      } else if (row.taskType == 1) {
        const { href } = this.$router.resolve({
          name: "customerDetail",
          params: {
            id: row.belongTo,
          }
        });
        window.open(href, "_blank");
      }

    },
    getList() {
      const params = {
        pageNum: this.currentPage,
        pageSize: this.pageSize,
        status: this.form.status,
      }
      console.log(params)

      this.$api.profitAllList(params).then((response) => {
        const {
          data: {
            list,
            pages,
            total,
            pageNum,
          },
        } = response.data;
        this.tableData = list
        //          if(this.tabledata%2!=0){
        //            this.tabledata.push(
        //                {}
        //            )
        //          }
        //          console.log(this.tabledata[0])
        //          if(this.tabledata[0]==null){
        //            this.tabledata=[
        //
        //            ]
        //
        //          }
        this.pageCount = pages
      }).catch((error) => {
        console.log(error);
      });
    },
    getsettlement() {
      this.$api
        .getDicList("settlementType", 0)
        .then(response => {
          this.settlementTypeList = response.data.data;
        })
        .catch(error => {
          console.log(error);
        });
    },
    routeToDetail(row) {
      const { href } = this.$router.resolve({
        name: "profitDetail",
        params: {
          batchNumber: row.batchNumber,
        }
      });
      window.open(href, "_blank");
    },
    routeToEdit(row) {
      this.$router.push({ name: 'editTask', params: { id: row.id } })
    },
    handleCurrentChange(val) {
      this.currentPage = val;
      this.getList();
    },
    routeTowoker() {
      this.$router.push({ name: 'myworker' })
    },
    handleClose() {

    },
    addNew() {
      this.$router.push({ name: 'addTask' })
    }
  }
}
</script>

<style scoped>
.el-input .el-select {
  width: 100px;
}
.select-input {
  width: 396px;
  margin-right: 20px;
}
</style>