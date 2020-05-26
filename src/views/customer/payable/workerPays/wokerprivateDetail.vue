<template>
  <div>
    <div class="workerName">个体户明细2018-12</div>
    <div class="redLine"></div>

    <div>
      <el-table class="table-outline" :data="tableData" empty-text="暂无相关信息">
        <el-table-column prop="financeName" show-overflow-tooltip label="个体户" align="center" min-width="120">
        </el-table-column>
        <el-table-column prop="financeType" label="类型" align="center" min-width="120">
        </el-table-column>
        <el-table-column prop="talentName" label="零工" align="center" min-width="120">
        </el-table-column>
        <el-table-column prop="workDate" label="上班日期" align="center" min-width="120">
        </el-table-column>
        <el-table-column prop="workStartTime" label="上班时间" align="center" min-width="120">
        </el-table-column>
        <el-table-column prop="workEndTime" label="下班时间" align="center" min-width="120">
        </el-table-column>
        <el-table-column prop="workHours" label="工时" align="center" min-width="120">
        </el-table-column>
        <el-table-column prop="pieceSize" label="计件量" align="center" min-width="120">
          <template v-slot="scope">
            {{scope.row.pieceSize | formatPieces}}
          </template>
        </el-table-column>
        <el-table-column prop="amount" label="劳务收入(元)" align="center" show-overflow-tooltip min-width="120"></el-table-column>
        <el-table-column prop="charge" label="服务费(元)" align="center" show-overflow-tooltip min-width="120"></el-table-column>

      </el-table>
      <div class="page-container">
        <el-pagination class="pagebox" background layout="prev, pager, next" :current-page="currentPage" @current-change="handleCurrentChange" :page-count="pageCount">
        </el-pagination>
      </div>
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
      batchNumber: '',
      settlementType: '',
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
        taskStatus: '',
        belongtoItem: '',
        settlementType: "",
        publishType: "",
      },
      mineItem: {},
      reveiveId: '',
      publishId: '',
    }
  },
  filters: {
    formatPieces(val) {
      if (val) {
        return util.formatPieceSize(val)
      } else {
        return '无'
      }
    },
    formatminDate(val) {
      return util.minDate(val)
    },
    formatStatus(val) {
      if (val == 1) {
        return '待领取'
      } else if (val == 2) {
        return '进行中'
      } else if (val == 3) {
        return '已结束'
      } else {
        return ''
      }
      return util.minDate(val)
    }
  },
  mounted() {
    this.batchNumber = this.$route.params.batchNumber;
    this.settlementType = this.$route.params.settlementType;
    this.getList();
  },
  watch: {
    'form.taskStatus': function (val, oldval) {
      this.currentPage = 1
      this.getList();
    },
  },
  methods: {
    routeToImport() {
      this.$router.push({ name: 'salaryImport' })
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
        batchNumber: this.batchNumber,
        settlementType: this.settlementType,
      }
      console.log(params)

      this.$api.privateDetailList(params).then((response) => {
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
        name: "salaryBill",
        //          params: {
        //            id: row.id,
        //          }
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