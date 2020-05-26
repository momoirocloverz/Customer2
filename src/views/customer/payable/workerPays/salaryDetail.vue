<template>
  <div>
    <div class="workerName">{{name}}收入明细{{batchNumber}}</div>
    <div class="redLine"></div>

    <div>
      <el-table class="table-outline" :data="tableData" empty-text="暂无相关信息">
        <el-table-column prop="recordDate" label="日期" align="center" min-width="120">
        </el-table-column>
        <el-table-column prop="workHours" label="工时" align="center" min-width="120">
        </el-table-column>
        <el-table-column prop="settlementTypeName" label="上班时间" align="center" min-width="120">
          <template v-slot="scope">
            <!-- {{scope.row.startTimeTrue | formatTimeString}} -->
            <span v-if="scope.row.workStartTime">{{scope.row.workStartDate==scope.row.schedulingDate?'当日':'次日'}}{{scope.row.workStartTime | formatTimeString}}</span>
            <span v-else>未打卡</span>
          </template>
        </el-table-column>
        <el-table-column prop="settlementTypeName" label="下班时间" align="center" min-width="120">
          <template v-slot="scope">
            <!-- {{scope.row.endTimeTrue | formatTimeString}} -->
            <span v-if="scope.row.workEndTime">{{scope.row.workEndDate==scope.row.schedulingDate?'当日':'次日'}}{{scope.row.workEndTime | formatTimeString}}</span>
            <span v-else>未打卡</span>
          </template>
        </el-table-column>
        <el-table-column prop="settlementTypeName" label="计件量" show-overflow-tooltip align="center" min-width="120">
          <template v-slot="scope">
            {{scope.row.pieceSize | formatPieces}}{{scope.row.pieceState | formatState}}
          </template>
        </el-table-column>
        <el-table-column prop="settlementTypeName" label="计价方式" show-overflow-tooltip align="center" min-width="120" :formatter="forType">
          <!-- <template v-slot="scope">
                        {{scope.row.valuationType | formatvaluationType}}
                    </template> -->
        </el-table-column>
        <el-table-column prop="salary" label="单价" align="center" min-width="120" show-overflow-tooltip :formatter="forPrice">
          <!-- <template v-slot="scope">
                        {{scope.row.salary }}
                    </template> -->
        </el-table-column>
        <el-table-column prop="amount" label="收入小计(元)" align="center" show-overflow-tooltip min-width="150"></el-table-column>

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
      id: '',
      name: '',
      settlementType: '',
      batchNumber: '',
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
    formataskSalary(val) {
      if (val) {
        let data = JSON.parse(val)
        return util.price(data)
      } else {
        return '无'
      }
    },
    formatPieces(val) {
      if (val) {
        return util.formatPieceSize(val)
      } else {
        return '无'
      }
    },
    formatvaluationType(val) {
      if (val == 1) {
        return '计时'
      } else if (val == 2) {
        return '计件'
      } else if (val == 3) {
        return '计时+计件'
      } else {
        return ''
      }
    },
    formatTimeString(val) {
      if (val) {
        return val.substring(0, 5)
      } else {
        return '未打卡'
      }
    },
    formatminDate(val) {
      return util.minDate(val)
    },
    formatState(val) {
      if (val == 1) {
        return '(待审核)'
      }
      else if (val == 2) {
        return '(通过审核)'
      }
      else if (val == 3) {
        return '(审核拒绝)'
      } else {
        return ''
      }
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
    this.id = this.$route.params.id;
    this.name = this.$route.params.name;
    this.settlementType = this.$route.params.settlementType;
    this.batchNumber = this.$route.params.batchNumber;
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
        settlementType: this.settlementType,
        batchNumber: this.batchNumber,
        talentId: this.id,
      }
      console.log(params)

      this.$api.salaryDetailList(params).then((response) => {
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
    },
    forPrice(val) {
      let salary = JSON.parse(val.salary)
      console.log(salary)
      // let type = val.settlementType == 4 ? 1 : val.settlementType
      let type = val.settlementType;
      for (let i in salary) {
        if (salary[i].settlementType == type) {
          for (let j in salary[i].price) {
            if (((salary[i].price)[j]).sex == val.sex) {
              console.log((salary[i].price)[j])
              let item = (salary[i].price)[j]
              let content = ''
              if (salary[i].valuationType == 1) {
                content = `${item.countTime}元/小时`
              } else if (salary[i].valuationType == 2) {
                if (salary[i].unit == 1) {
                  content = `${item.countSettle}元/件`
                } else if (salary[i].unit == 2) {
                  content = `${item.countDai}元/袋`
                } else if (salary[i].unit == 3) {
                  content = `${item.countChe}元/车`
                } else {
                  content = `${item.countDun}元/吨`
                }
              } else if (salary[i].valuationType == 3) {
                let varUnit
                if (salary[i].unit == 1) {
                  varUnit = '件'
                } else if (salary[i].unit == 2) {
                  varUnit = '袋'
                } else if (salary[i].unit == 3) {
                  varUnit = '车'
                } else {
                  varUnit = '吨'
                }
                content += `${(item.ladderObj)[0].count}${varUnit}以下（含），${(item.ladderObj)[0].unit}元/${varUnit}`
                for (let z in item.ladderObj) {
                  if (z > 0 && z != (item.ladderObj.length - 1)) {
                    content += `；${(Number((item.ladderObj)[z - 1].count)) + 1}至${(item.ladderObj)[z].count}${varUnit}（含），${(item.ladderObj)[z].unit}元/${varUnit}`

                  }
                }
                content += `；${(item.ladderObj)[item.ladderObj.length - 2].count}${varUnit}以上，${(item.ladderObj)[item.ladderObj.length - 1].overUnit}元/${varUnit}`
              } else if (salary[i].valuationType == 4) {
                if (item.countSettle) {
                  content += `${item.countSettle}元/件,`
                } if (item.countDai) {
                  content += `${item.countDai}元/袋,`
                } if (item.countChe) {
                  content += `${item.countChe}元/车,`
                } if (item.countDun) {
                  content += `${item.countDun}元/吨`
                }
              } else if (salary[i].valuationType == 5) {

                if (salary[i].unit == 1) {
                  content += `${item.countSettle}元/件，`
                } else if (salary[i].unit == 2) {
                  content += `${item.countDai}元/袋，`
                } else if (salary[i].unit == 3) {
                  content += `${item.countChe}元/车，`
                } else {
                  content += `${item.countDun}元/吨，`
                }
                content += `${item.countTime}元/小时`
              } else if (salary[i].valuationType == 6) {
                content += `${item.countTime}元/小时,`
                let varUnit
                if (salary[i].unit == 1) {
                  varUnit = '件'
                } else if (salary[i].unit == 2) {
                  varUnit = '袋'
                } else if (salary[i].unit == 3) {
                  varUnit = '车'
                } else {
                  varUnit = '吨'
                }
                content += `${(item.ladderObj)[0].count}${varUnit}以下（含），${(item.ladderObj)[0].unit}元/${varUnit}`
                for (let z in item.ladderObj) {
                  if (z > 0 && z != (item.ladderObj.length - 1)) {
                    content += `；${(Number((item.ladderObj)[z - 1].count)) + 1}至${(item.ladderObj)[z].count}${varUnit}（含），${(item.ladderObj)[z].unit}元/${varUnit}`

                  }
                }
                content += `；${(item.ladderObj)[item.ladderObj.length - 2].count}${varUnit}以上，${(item.ladderObj)[item.ladderObj.length - 1].overUnit}元/${varUnit}`
              } else {

                if (item.countSettle) {
                  content += `${item.countSettle}元/件,`
                } if (item.countDai) {
                  content += `${item.countDai}元/袋,`
                } if (item.countChe) {
                  content += `${item.countChe}元/车,`
                } if (item.countDun) {
                  content += `${item.countDun}元/吨,`
                }
                content += `${item.countTime}元/小时`
              }
              return content
            }
          }

        }

      }
    },
    forType(val) {
      let salary = JSON.parse(val.salary)
      console.log(salary)
      // let type = val.settlementType == 4 ? 1 : val.settlementType
      let type = val.settlementType;
      for (let i in salary) {
        if (salary[i].settlementType == type) {
          for (let j in salary[i].price) {
            if (((salary[i].price)[j]).sex == val.sex) {
              console.log((salary[i].price)[j])
              let item = (salary[i].price)[j]
              let content = ''
              if (salary[i].valuationType == 1) {
                content = `计时`
              } else if (salary[i].valuationType == 2 || salary[i].valuationType == 3 || salary[i].valuationType == 4) {
                content = `计量`

              } else {
                content = `计时 + 计量`
              }
              return content
            }
          }

        }

      }
    },
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