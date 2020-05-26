<template>
  <div class="back-white">
    <div class="table-box back-white">
      <el-table :data="tableData" empty-text="暂无相关空挂零工信息">
        <el-table-column show-overflow-tooltip prop="talentName" label="姓名" align="center" min-width="100"></el-table-column>
        <el-table-column show-overflow-tooltip prop="sexName" label="性别" align="center" min-width="100"></el-table-column>
        <el-table-column show-overflow-tooltip prop="industryName" label="工种" align="center" min-width="100"></el-table-column>
        <el-table-column show-overflow-tooltip label="上班时间" align="center" min-width="100">
          <template v-slot="scope">
            <span v-if="scope.row.customerStartTime">
              {{scope.row.customerStartDate==scope.row.schedulingDate?'当日':'次日'}}{{scope.row.customerStartTime | formatCusTimeString}}
            </span>
            <span v-else>无</span>
          </template>
        </el-table-column>
        <el-table-column show-overflow-tooltip label="下班时间" align="center" min-width="100">
          <template v-slot="scope">
            <span v-if="scope.row.customerEndDate">
              {{scope.row.customerEndDate==scope.row.schedulingDate?'当日':'次日'}}{{scope.row.customerEndTime | formatCusTimeString}}
            </span>
            <span v-else>无</span>
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination-container" v-if="pageCount">
        <el-pagination class="pagebox" background layout="prev, pager, next" :current-change="handleCurrentChange" :page-count="pageCount">
        </el-pagination>
      </div>
    </div>
  </div>
</template>

<script>
import util from '../../../../common/util'

export default {
  name: "Unbound",

  data() {
    return {
      DeleteVisible: false,
      currentPage: 1,
      pageSize: 20,
      pageCount: '',
      total: 0,
      settlementTypeList: '',
      belongtoList: '',
      input5: '',
      select: '',
      tableData: [],
      form: {
        taskStatus: '',
        belongtoItem: '',
        settlementType: "",
      },
      mineItem: {},
      reveiveId: '',
      publishId: '',
    }
  },
  filters: {
    formatpieceState(val) {
      if (val == 1) {
        return '(待审核)'
      } else {
        return ''
      }
    },
    formatCusTimeString(val){
      if(val){
        return val.substr(0,5)
      }else{
        return '无'
      }
    },
    formatminDate(val) {
      return util.minDate(val)
    },
    formatTimeString(val) {
      if (val) {
        return val.substring(0, 5)
      } else {
        return '未打卡'
      }
    },
    formatStatus(val) {
      if (val == 1) {
        return '待领取'
      } else if (val == 2) {
        return '领取完毕'
      } else if (val == 3) {
        return '关闭'
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
    'form.industry': function (val, oldval) {
      this.currentPage = 1
      this.getList();
    },
    'form.settlementType': function (val, oldval) {
      this.currentPage = 1
      this.getList();
    },
  },
  methods: {
    dateFormatter(row, column, cellValue, index) {
      return util.minDate(cellValue)
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
        settlementType: this.form.settlementType,
        industry: this.form.industry,
        schedulingId: this.$route.query.id,
        talentType: 2
      }
      console.log(params)

      this.$api.scheduleWorker(params).then((response) => {
        const {
          data: {
            list,
            pages,
            total,
            pageNum,
          },
        } = response.data;
        this.tableData = list
        this.total = total
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
    getbelongtoList() {
      this.$api
        .getBelongtoList()
        .then(response => {
          this.belongtoList = response.data;
          console.log(this.belongtoList)
        })
        .catch(error => {
          console.log(error);
        });
    },
    routeToDetail(row) {
      const { href } = this.$router.resolve({
        name: "taskTrackDetail",
        query: {
          id: row.id,
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
    formatbindingStatus(row) {
      let val = row.bindingStatus
      if (val == 1) {
        return '服务中'
      } else if (val == 2) {
        return '待班务经理同意解绑'
      } else if (val == 3) {
        return '待客户同意解绑'
      } else if (val == 4) {
        return '已解绑'
      } else {
        return ''
      }
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
};
</script>

<style scoped>
.task-table-body {
  font-family: PingFang-SC-Medium;
  font-size: 14px;
  font-weight: normal;
  font-stretch: normal;
  line-height: 24px;
  letter-spacing: 0px;
  color: #666666;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 15px;
}
.task-label {
  display: inline-block;
  width: 100px;
}
.task-table-tag {
  font-family: PingFang-SC-Medium;
  font-size: 14px;
  font-weight: normal;
  font-stretch: normal;
  line-height: 24px;
  letter-spacing: 0px;
  color: #666666;
  margin-left: 18px;
}
.vp-table-header {
  display: table-cell;
  vertical-align: bottom;
}
.task-center {
  width: 1px;
  height: 80px;
  background-color: #eeeeee;
}
.task-left {
  /*float: left;*/
}
.task-right {
  width: 48%;
  /*float: left;*/
}
.task-item {
  height: 32px;
  line-height: 32px;
}
.task-address {
  display: inline-block;
  width: 100px;
}
.task-right {
  width: 63%;
}
.span-block {
  display: block;
}
.vw-sex-tag {
  line-height: 18px;
}
.vw-sex-tag-type {
  line-height: 18px;
}
.sche-name {
  font-family: PingFang-SC-Heavy;
  font-size: 18px;
  color: #262626;
  display: block;
  margin-bottom: 12px;
}
.vw-sex {
  display: block;
  margin-bottom: 12px;
}
.tag-line {
  line-height: 17px;
}
</style>