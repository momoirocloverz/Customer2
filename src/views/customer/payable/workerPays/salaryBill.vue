<template>
  <div>
    <div class="workerName">{{name}}的收入条</div>
    <div class="redLine"></div>

    <el-button class="myplain-btn" style="margin: 8px 0px" @click="routeToAdjust">收入调整</el-button>
    <div class="collapse-outline" v-if="type==1">
      <el-collapse accordion>
        <div class="el-collapse-item__header flexSafari salary-collapse">
          <div>薪酬合计</div>
          <div class="right-div">
            <span class="right-label">{{billInfo.salary}}元</span>
            <el-button type="text" @click="routeToDetail">查看</el-button>
          </div>
        </div>

        <el-collapse-item aria-expanded="false">
          <template slot="title">
            <div class="el-collapse-item__header flexSafari salary-collapse">
              <div>奖惩合计</div>
              <div class="right-div">
                <span class="right-label">{{billInfo.rewardAndPunishAmount}}元</span></div>
            </div>
          </template>
          <div class="flexSafari salary-collapse salary-child" v-for="item in billInfo.rewardAndPunish">
            <div>{{item.note}}</div>
            <div class="right-div">
              <span class="right-label">{{item.salary}}元</span></div>
          </div>
        </el-collapse-item>

        <div class="el-collapse-item__header flexSafari salary-collapse">
          <div>应发收入</div>
          <div class="right-div">
            <span class="right-label-notag">{{billInfo.socialSecurityBase}}元</span>
          </div>
        </div>
        <div class="el-collapse-item__header flexSafari salary-collapse">
          <div>养老保险扣款</div>
          <div class="right-div">
            <span class="right-label-notag">{{billInfo.oldAgePension}}元</span>
          </div>
        </div>
        <div class="el-collapse-item__header flexSafari salary-collapse">
          <div>医疗保险扣款</div>
          <div class="right-div">
            <span class="right-label-notag">{{billInfo.medicalInsurance}}元</span>
          </div>
        </div>
        <div class="el-collapse-item__header flexSafari salary-collapse">
          <div>失业保险扣款</div>
          <div class="right-div">
            <span class="right-label-notag">{{billInfo.unemploymentInsurance}}元</span>
          </div>
        </div>
        <div class="el-collapse-item__header flexSafari salary-collapse">
          <div>公积金扣款</div>
          <div class="right-div">
            <span class="right-label-notag">{{billInfo.accumulationFund}}元</span>
          </div>
        </div>
        <el-collapse-item aria-expanded="false">
          <template slot="title">
            <div class="el-collapse-item__header flexSafari salary-collapse">
              <div>个人所得税</div>
              <div class="right-div">
                <span class="right-label">{{billInfo.personalTax}}元</span></div>
            </div>
          </template>
          <div class="flexSafari salary-collapse salary-child">
            <div>专项扣除前应纳税所得</div>
            <div class="right-div">
              <span class="right-label">{{billInfo.deductAfter}}元</span></div>
          </div>
          <div class="flexSafari salary-collapse salary-child">
            <div>子女教育专项扣除</div>
            <div class="right-div">
              <span class="right-label">{{billInfo.childrenEducation}}元</span></div>
          </div>
          <div class="flexSafari salary-collapse salary-child">
            <div>继续教育专项扣除</div>
            <div class="right-div">
              <span class="right-label">{{billInfo.continuingEducation}}元</span></div>
          </div>
          <div class="flexSafari salary-collapse salary-child">
            <div>住房贷款利息专项扣除</div>
            <div class="right-div">
              <span class="right-label">{{billInfo.housingInterest}}元</span></div>
          </div>
          <div class="flexSafari salary-collapse salary-child">
            <div>住房租金专项扣除</div>
            <div class="right-div">
              <span class="right-label">{{billInfo.housingRent}}元</span></div>
          </div>
          <div class="flexSafari salary-collapse salary-child">
            <div>赡养老人专项扣除</div>
            <div class="right-div">
              <span class="right-label">{{billInfo.supportElderly}}元</span></div>
          </div>
          <div class="flexSafari salary-collapse salary-child">
            <div>专项扣除后应纳税所得</div>
            <div class="right-div">
              <span class="right-label">{{billInfo.deductBefore}}元</span></div>
          </div>
        </el-collapse-item>

        <div class="el-collapse-item__header flexSafari salary-collapse">
          <div>应发提供发票劳务收入</div>
          <div class="right-div">
            <span class="right-label-notag">{{billInfo.shouldSalary}}元</span>
          </div>
        </div>

        <el-collapse-item aria-expanded="false">
          <template slot="title">
            <div class="el-collapse-item__header flexSafari salary-collapse">
              <div>调整合计</div>
              <div class="right-div">
                <span class="right-label">{{billInfo.otherAmount}}元</span></div>
            </div>
          </template>
          <div class="flexSafari salary-collapse salary-child" v-for="item in billInfo.adjustments">
            <div>{{item.typeName}}</div>
            <div class="right-div">
              <span class="right-label">{{item.amount}}元</span>
              <span class="salary-child-btn" @click="deleteAdjust(item)">删除</span>
            </div>
          </div>
        </el-collapse-item>

        <div class="el-collapse-item__header flexSafari salary-collapse heavey-label">
          <div class="">实发收入</div>
          <div class="right-div ">
            <span class="">{{billInfo.socialSalary}}元</span>
          </div>
        </div>
        <div class="el-collapse-item__header flexSafari salary-collapse heavey-label">
          <div class="">实发提供发票劳务收入</div>
          <div class="right-div ">
            <span class="">{{billInfo.trueSalary}}元</span>
          </div>
        </div>
        <div class="el-collapse-item__header flexSafari salary-collapse heavey-label">
          <div class="">实发合计</div>
          <div class="right-div ">
            <span class="">{{billInfo.totalAmount}}元</span>
          </div>
        </div>
        <div class="el-collapse-item__header flexSafari salary-collapse heavey-label" v-if="billInfo.debt">
          <div class="">剩余欠款</div>
          <div class="right-div ">
            <span class="">{{billInfo.debt}}元</span>
          </div>
        </div>

      </el-collapse>
    </div>
    <div class="collapse-outline" v-if="type==2">
      <el-collapse accordion>
        <div class="el-collapse-item__header flexSafari salary-collapse">
          <div>薪酬合计</div>
          <div class="right-div">
            <span class="right-label">{{billInfo.salary}}元</span>
            <el-button type="text" @click="routeToDetail">查看</el-button>
          </div>
        </div>

        <el-collapse-item aria-expanded="false">
          <template slot="title">
            <div class="el-collapse-item__header flexSafari salary-collapse">
              <div>奖惩合计</div>
              <div class="right-div">
                <span class="right-label">{{billInfo.rewardAndPunishAmount}}元</span></div>
            </div>
          </template>
          <div class="flexSafari salary-collapse salary-child" v-for="item in billInfo.rewardAndPunish">
            <div>{{item.note}}</div>
            <div class="right-div">
              <span class="right-label">{{item.salary}}元</span></div>
          </div>
        </el-collapse-item>

        <div class="el-collapse-item__header flexSafari salary-collapse">
          <div>应发收入</div>
          <div class="right-div">
            <span class="right-label-notag">{{billInfo.socialSecurityBase}}元</span>
          </div>
        </div>
        <div class="el-collapse-item__header flexSafari salary-collapse">
          <div>个人所得税</div>
          <div class="right-div">
            <span class="right-label-notag">{{billInfo.personalTax}}元</span>
          </div>
        </div>

        <div class="el-collapse-item__header flexSafari salary-collapse">
          <div>应发提供发票劳务收入</div>
          <div class="right-div">
            <span class="right-label-notag">{{billInfo.shouldSalary}}元</span>
          </div>
        </div>

        <el-collapse-item aria-expanded="false">
          <template slot="title">
            <div class="el-collapse-item__header flexSafari salary-collapse">
              <div>调整合计</div>
              <div class="right-div">
                <span class="right-label">{{billInfo.otherAmount}}元</span></div>
            </div>
          </template>
          <div class="flexSafari salary-collapse salary-child" v-for="item in billInfo.adjustments">
            <div>{{item.typeName}}</div>
            <div class="right-div">
              <span class="right-label">{{item.amount}}元</span>
              <span class="salary-child-btn" @click="deleteAdjust(item)">删除</span>
            </div>
          </div>
        </el-collapse-item>

        <div class="el-collapse-item__header flexSafari salary-collapse heavey-label">
          <div class="">实发收入</div>
          <div class="right-div ">
            <span class="">{{billInfo.trueSalary}}元</span>
          </div>
        </div>
        <div class="el-collapse-item__header flexSafari salary-collapse heavey-label">
          <div class="">实发提供发票劳务收入</div>
          <div class="right-div ">
            <span class="">{{billInfo.socialSalary}}元</span>
          </div>
        </div>
        <div class="el-collapse-item__header flexSafari salary-collapse heavey-label">
          <div class="">实发合计</div>
          <div class="right-div ">
            <span class="">{{billInfo.totalAmount}}元</span>
          </div>
        </div>
        <div class="el-collapse-item__header flexSafari salary-collapse heavey-label" v-if="billInfo.debt">
          <div class="">剩余欠款</div>
          <div class="right-div ">
            <span class="">{{billInfo.debt}}元</span>
          </div>
        </div>

      </el-collapse>
    </div>
    <div class="collapse-outline" v-if="type==3">
      <el-collapse accordion>
        <div class="el-collapse-item__header flexSafari salary-collapse">
          <div>薪酬合计</div>
          <div class="right-div">
            <span class="right-label">{{billInfo.salary}}元</span>
            <el-button type="text" @click="routeToDetail">查看</el-button>
          </div>
        </div>

        <el-collapse-item aria-expanded="false">
          <template slot="title">
            <div class="el-collapse-item__header flexSafari salary-collapse">
              <div>奖惩合计</div>
              <div class="right-div">
                <span class="right-label">{{billInfo.rewardAndPunishAmount}}元</span></div>
            </div>
          </template>
          <div class="flexSafari salary-collapse salary-child" v-for="item in billInfo.rewardAndPunish">
            <div>{{item.note}}</div>
            <div class="right-div">
              <span class="right-label">{{item.salary}}元</span></div>
          </div>
        </el-collapse-item>

        <div class="el-collapse-item__header flexSafari salary-collapse">
          <div>应发提供发票劳务收入</div>
          <div class="right-div">
            <span class="right-label-notag">{{billInfo.shouldSalary}}元</span>
          </div>
        </div>

        <el-collapse-item aria-expanded="false">
          <template slot="title">
            <div class="el-collapse-item__header flexSafari salary-collapse">
              <div>调整合计</div>
              <div class="right-div">
                <span class="right-label">{{billInfo.otherAmount}}元</span></div>
            </div>
          </template>
          <div class="flexSafari salary-collapse salary-child" v-for="item in billInfo.adjustments">
            <div>{{item.typeName}}</div>
            <div class="right-div">
              <span class="right-label">{{item.amount}}元</span>
              <span class="salary-child-btn" @click="deleteAdjust(item)">删除</span>
            </div>
          </div>
        </el-collapse-item>

        <div class="el-collapse-item__header flexSafari salary-collapse heavey-label">
          <div class="">实发提供发票劳务收入</div>
          <div class="right-div ">
            <span class="">{{billInfo.trueSalary}}元</span>
          </div>
        </div>
        <div class="el-collapse-item__header flexSafari salary-collapse heavey-label" v-if="billInfo.debt">
          <div class="">剩余欠款</div>
          <div class="right-div ">
            <span class="">{{billInfo.debt}}元</span>
          </div>
        </div>

      </el-collapse>
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
      name: '',
      type: '',
      isSocialSecurity: '',
      talentType: '',
      billInfo: '',
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
    this.name = this.$route.params.name
    this.id = this.$route.params.id
    this.talentType = this.$route.params.talentType
    this.isSocialSecurity = this.$route.params.isSocialSecurity
    //      if( this.talentType==2 || this.talentType==3 ){
    //        this.type=2
    //      }else if(this.talentType==1){
    //        if(this.isSocialSecurity==1){
    //          this.type=1
    //        }
    //        if(this.isSocialSecurity==2){
    //          this.type=3
    //        }
    //      }
    this.settlementType = this.$route.params.settlementType
    //1其他 2 3学生 退休人员 1 日 2 月 4 周settlementType
    if (this.talentType == 2 || this.talentType == 3) {
      this.type = 2//7.4
    } else if (this.talentType == 1) {
      if (this.isSocialSecurity == 1 && this.settlementType == 2) {
        this.type = 1//7.3
      }
      if (this.isSocialSecurity == 2 && this.settlementType == 2) {
        this.type = 3//7.5
      }
      if (this.settlementType != 2) {
        this.type = 3//7.5
      }
    }
    this.getList();
  },
  watch: {
    'form.taskStatus': function (val, oldval) {
      this.currentPage = 1
      this.getList();
    },
  },
  methods: {
    deleteAdjust(item) {
      const params = {
        adjustmentId: item.id,
      }
      console.log(params)

      this.$api.adjustDelete(params).then((response) => {
        if (response.respCode == 0) {
          this.getList()
        }
      }).catch((error) => {
        console.log(error);
      });
    },
    handleSelectionChange(val) {
    },
    routeToAdjust() {
      this.$router.push({ name: 'salaryAdjust', params: { id: this.id, name: this.name, talentId: this.billInfo.talentId } })
    },
    routeToDetail() {
      //        this.$router.push({name:'salaryDetail',params:{id:this.billInfo.talentId,settlementType:this.billInfo.settlementType,batchNumber:this.billInfo.batchNumber,name:this.billInfo.talentId}})
      const { href } = this.$router.resolve({
        name: "salaryDetail",
        params: { id: this.billInfo.talentId, settlementType: this.billInfo.settlementType, batchNumber: this.billInfo.batchNumber, name: this.name }
      });
      window.open(href, "_blank");
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
        id: this.$route.params.id,
      }
      console.log(params)

      this.$api.salarySheet(params).then((response) => {
        if (response.respCode == 0) {
          this.billInfo = response.data;
        }
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
.salary-collapse {
  display: flex;
  justify-content: space-between;
}
.right-label {
  margin-right: 25px;
}
.right-label-notag {
  margin-right: 46px;
}
.right-div {
  /*margin-right: 21px;*/
}
.salary-child {
  padding: 10px 34px 0 34px;
}
.heavey-label {
  font-size: 16px;
  color: #262626;
}
.salary-child-btn {
  padding: 0;
  color: #e84518;
  cursor: pointer;
}
.collapse-outline {
  border: solid 1px #eeeeee;
  padding: 30px 20px;
}
.el-collapse-item__header:first-child {
  border-top: none;
}
.el-collapse-item__header:last-child {
  border-bottom: none;
}
</style>