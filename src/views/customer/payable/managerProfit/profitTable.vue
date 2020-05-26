<template>
    <div style="margin-bottom: 100px">
        <div class="workerName">{{name}}利润表{{batchNumber}}</div>
        <div class="redLine"></div>
        <el-button class="myplain-btn" style="margin: 8px 0px" @click="routeToAdjust">利润调整</el-button>
        <el-button class="myplain-btn" style="margin: 8px 8px"  @click="routeToImport">导入调整项</el-button>
        <div >
            <div class="table-outline table-title-box">
                <span class="table-title">收入</span>
            <el-table
                    class=""
                    :data="incomeList"
                    :summary-method="getSummaries"
                    show-summary
                    empty-text="暂无相关信息"
            >

                <el-table-column prop="taskName" show-overflow-tooltip label="任务" align="center" min-width="150">
                    <template v-slot="scope">
                        <span class="is-link" @click="RouteToTask(scope.row)">{{scope.row.taskName}}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="taskType" label="类型"  align="center" min-width="100">
<!--1.2 yewu 3 paigong-->
                    <template v-slot="scope">
                        {{scope.row.taskType | formattaskType}}
                    </template>
                </el-table-column>
                <el-table-column prop="valuationType" label="计价方式" align="center" show-overflow-tooltip min-width="100">
                    <template v-slot="scope">
                        {{scope.row.valuationType | formatvaluationType}}
                    </template>
                </el-table-column>
                <el-table-column prop="workHours" label="总工时" align="center" show-overflow-tooltip min-width="100"></el-table-column>
                <el-table-column prop="pieceSize" label="计件量" align="center" show-overflow-tooltip min-width="100"></el-table-column>
                <el-table-column prop="taskSalary" label="单价" align="center" show-overflow-tooltip min-width="100"></el-table-column>
                <el-table-column prop="salary" label="金额(元)" align="center" show-overflow-tooltip min-width="100"></el-table-column>

                <el-table-column label="操作" align="center" min-width="100">
                    <template v-slot="scope">
                        <el-button size="small" type="text" @click="routeToIncomeDetail( scope.row)">查看</el-button>
                    </template>

                </el-table-column>

            </el-table>
            </div>
            <!--<div class="page-container">-->
                <!--<el-pagination-->
                        <!--class="pagebox"-->
                        <!--background-->
                        <!--layout="prev, pager, next"-->
                        <!--:current-page="currentPage"-->
                        <!--@current-change="handleCurrentChange"-->
                        <!--:page-count="pageCount">-->
                <!--</el-pagination>-->
            <!--</div>-->
        </div>
        <div style="width: 450px;">
            <div class="table-outline table-title-box">
                <span class="table-title">支出</span>
            <el-table
                    class=""
                    :data="outputList"
                    empty-text="暂无相关信息"
            >

                <el-table-column prop="type" label="类型"  align="center" min-width="200">
                </el-table-column>

                <el-table-column prop="value" show-overflow-tooltip label="金额(元)" align="center" min-width="200">
                </el-table-column>
            </el-table>
            </div>
            <!--<div class="page-container">-->
                <!--<el-pagination-->
                        <!--class="pagebox"-->
                        <!--background-->
                        <!--layout="prev, pager, next"-->
                        <!--:current-page="currentPage"-->
                        <!--@current-change="handleCurrentChange"-->
                        <!--:page-count="pageCount">-->
                <!--</el-pagination>-->
            <!--</div>-->
        </div>
        <table class="setting-info-table" cellspacing="0" cellpadding="0">
            <tr >
                <td width="200px" class="header">毛利润</td>
                <td width="200px">{{profitTotal}}</td>
            </tr>
        </table>
        <br/>
        <div style="width: 650px;">
            <div class="table-outline table-title-box">
                <span class="table-title">调整</span>
            <el-table
                    class=""
                    :data="adjustmentList"
                    empty-text="暂无相关信息"
            >

                <el-table-column prop="adjustmentName" label="调整项"  align="center" min-width="200">
                </el-table-column>

                <el-table-column prop="amount" show-overflow-tooltip label="金额(元)" align="center" min-width="200">
                </el-table-column>
                <el-table-column label="操作" align="center" min-width="100">
                    <template v-slot="scope">
                        <el-button size="small" type="text" @click="adjustDelete( scope.row,scope.$index)">删除</el-button>
                    </template>

                </el-table-column>
            </el-table>
            </div>
            <!--<div class="page-container">-->
                <!--<el-pagination-->
                        <!--class="pagebox"-->
                        <!--background-->
                        <!--layout="prev, pager, next"-->
                        <!--:current-page="currentPage"-->
                        <!--@current-change="handleCurrentChange"-->
                        <!--:page-count="pageCount">-->
                <!--</el-pagination>-->
            <!--</div>-->
        </div>

        <table class="setting-info-table" cellspacing="0" cellpadding="0">
            <tr >
                <td width="200px" class="header">实发利润</td>
                <td width="200px">{{actualProfitTotal}}</td>
            </tr>
        </table>
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
        actualProfitTotal:'',
        profitTotal:'',
        adjustTotal:'',
        outTotal:'',
        incomeTotal:'',
        incomeList:[],
        outputList:[],
        adjustmentList:[],
        batchNumber:'',
        name:'',
        taskManagerProfitId:'',
        DeleteVisible:false,
        currentPage:1,
        pageSize:20,
        pageCount:'',
        settlementTypeList:'',
        belongtoList:'',
        input5:'',
        select:'',
        tableData:[{},{}],
        tableData1:[{},{}],
        form: {
          taskStatus:'',
          belongtoItem: '',
          settlementType: "",
          publishType: "",
        },
        mineItem:{},
        reveiveId:'',
        publishId:'',
      }
    },
    filters:{
      formattaskType(val){
        if(val==1){
          return '计时'
        }else if(val==2){
          return '计件'
        }else if(val==3){
          return '计时+计件'
        }else{
          return ''
        }
      },
      formatvaluationType(val){
        if(val==1 || val==2){
          return '业务'
        }else if(val==3){
          return '派工'
        }else{
          return ''
        }
      },
      formatminDate(val){
        return util.minDate(val)
      },
      formatStatus(val){
        if(val==1){
          return '待领取'
        }else if(val==2){
          return '进行中'
        }else if(val==3){
          return '已结束'
        }else{
          return ''
        }
        return util.minDate(val)
      }
    },
    mounted(){
      this.managerId=this.$route.params.managerId
      this.name=this.$route.params.name
      this.batchNumber=this.$route.params.batchNumber
      this.taskManagerProfitId=this.$route.params.id
      this.getList();
    },
    watch:{
      'form.taskStatus':function (val,oldval) {
        this.currentPage=1
        this.getList();
      },
    },
    methods: {
      adjustDelete(row,index){
        console.log(index)
        const params = {
          id:row.id
        }
        this.$api.adjustdelete(params) .then(response => {
              if(response.respCode==0){
                this.$message.success('删除成功')
                this.adjustmentList.splice(index,1)
              }
        })
            .catch(error => {
              console.log(error);
            });
      },
      getSummaries(param){
        const { columns, data } = param;
        const sums = [];
        columns.forEach((column, index) => {
          if (index === 0) {
            sums[index] = '合计';
            return;
          }
          const values = data.map(item => Number(item[column.property]));
          if (!values.every(value => isNaN(value)) && index==6) {
            sums[index] = values.reduce((prev, curr) => {
              const value = Number(curr);
              if (!isNaN(value)) {
                return prev + curr;
              } else {
                return prev;
              }
            }, 0);
            this.incomeTotal = sums[index];
            console.log(this.incomeTotal)
//            sums[index] += ' 元';
          } else {
            sums[index] = '';
          }
        });

        return sums;
      },
      routeToImport (){
        this.$router.push({name:'profitImport'})
      },
      routeToAdjust(){
        this.$router.push({name:'profitAdjust',params:{id:this.taskManagerProfitId,name:this.name}})
      },
      handleSelectionChange(val) {
      },
      RouteToTask(row){
        const { href } = this.$router.resolve({
            name: "taskTrackDetail",
            query: {
                id: row.belongTo,
            }
          });
          window.open(href, "_blank");
      },
      getList(){
        const params ={
          taskManagerProfitId:this.taskManagerProfitId,
          batchNumber:this.batchNumber,
          managerId:this.managerId,
        }
        console.log(params)

        this.$api.tableDetail(params).then((response) => {
          if(response.respCode==0){
            console.log(response.data)
            this.adjustmentList=response.data.adjustmentList
            this.incomeList=response.data.incomeList
            this.outTotal = Number(response.data.outTotal)
            this.profitTotal = Number(response.data.profitTotal)
            this.actualProfitTotal = Number(response.data.actualProfitTotal)
            this.outputList=[{
              type:'收入',
              value:response.data.talentSalaryAmount
            },{
              type:'发单',
              value:response.data.managerTaskAmount
            },{
              type:'合计',
              value:this.outTotal
            },]
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
      routeToIncomeDetail(row){
          const { href } = this.$router.resolve({
            name: "projectPayDetail",
            params: {
              id: row.taskId,
              name:row.taskName,
            }
          });
          window.open(href, "_blank");
      },
      routeToDetail(row){
        const { href } = this.$router.resolve({
          name: "salaryBill",
//          params: {
//            id: row.id,
//          }
        });
        window.open(href, "_blank");
      },
      routeToEdit(row){
        this.$router.push({name:'editTask',params:{id:row.id}})
      },
      handleCurrentChange(val){
        this.currentPage=val;
        this.getList();
      },
      routeTowoker(){
        this.$router.push({name:'myworker'})
      },
      handleClose(){

      },
      addNew(){
        this.$router.push({name:'addTask'})
      }
    }
  }
</script>

<style scoped>


    .el-input  .el-select{
        width: 100px;
    }
    .select-input{
        width:396px;
        margin-right: 20px;
    }
    .table-title{
        font-size: 16px;
        font-weight: normal;
        font-stretch: normal;
        line-height: 32px;
        letter-spacing: 0px;
        color: #262626;
    }
    .table-title-box{
        margin-bottom: 20px;
    }
    .setting-info-table {
        text-align: center;
    }
    table {
        border-right: solid 1px #e4e4e4;
        border-bottom: solid 1px #e4e4e4;
        font-size: 14px;
    }

    td {
        border-left: solid 1px #e4e4e4;
        border-top: solid 1px #e4e4e4;
        height: 130px;
    }

    .header {
        background-color: #f6f6f6;
        font-family: MicrosoftYaHei;
        font-weight: normal;
        font-stretch: normal;
        letter-spacing: 0px;
        color: #262626;
    }

    .setting-info-table td {
        height: 54px;
    }
</style>