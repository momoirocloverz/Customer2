<template>
  <div>
    <div class="workerName">{{$route.params.name}}</div>
    <div class="redLine"></div>
    <div>
      <el-table class="table-outline" :data="tableData" empty-text="暂无相关信息">
        <el-table-column prop="schedulingName" show-overflow-tooltip label="排班" align="center" min-width="150">
        </el-table-column>
        <el-table-column prop="totalWorkHours" label="总工时" align="center" min-width="100">
        </el-table-column>
        <el-table-column prop="totalCustomerPieceSize" label="计件量" align="center" show-overflow-tooltip min-width="100">
          <template v-slot="scope">
            <span v-if="$route.params.payerType==1">{{scope.row.totalCustomerPieceSize | formatPieces}}</span>
            <span v-else>{{scope.row.totalTalentPieceSize | formatPieces}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="totalTalentCount" label="零工数" align="center" show-overflow-tooltip min-width="100">
          <template v-slot="scope">
            <span>{{scope.row.totalEmptyTalentCount + scope.row.totalNormalTalentCount}}</span>
          </template>
        </el-table-column>

        <el-table-column label="操作" align="center" min-width="100">
          <template v-slot="scope">
            <el-button size="small" type="text" @click="routeToDetail( scope.row)">查看</el-button>
          </template>
        </el-table-column>

      </el-table>
      <div class="page-container" v-if="pageCount">
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
        taskId: this.$route.params.id,
      }
      console.log(params)
      if (this.$route.params.payerType == 1) {
        this.$api.taskSchedulingListCus(params).then((response) => {
          if (response.data.respCode == 0) {
            const {
              data: {
                list,
                pages,
                total,
                pageNum,
              },
            } = response.data;
            this.tableData = list
            console.log(this.tableData)
            this.pageCount = pages
          }

        }).catch((error) => {
          console.log(error);
        });
      } else if (this.$route.params.payerType == 2) {
        this.$api.taskSchedulingListPro(params).then((response) => {
          if (response.data.respCode == 0) {
            const {
              data: {
                list,
                pages,
                total,
                pageNum,
              },
            } = response.data;
            this.tableData = list
            console.log(this.tableData)
            this.pageCount = pages
          }

        }).catch((error) => {
          console.log(error);
        });
      }


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
        name: "schedulingDetail",
        params: {
          id: row.schedulingId,
          hasPhoto: row.schedulingHasPhoto,
          name: row.schedulingName,
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