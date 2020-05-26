<template>
    <div>
        <div class="workerName">利润详情{{batchNumber}}</div>
        <div class="redLine"></div>
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
        <el-button class="myplain-btn" style="margin: 8px 0px" @click="routeToImport">导入调整项</el-button>
        <div >

            <el-table
                    class="table-outline"
                    :data="tableData"
                    empty-text="暂无相关信息"
            >
                <el-table-column prop="managerName" label="项目经理"  align="center" show-overflow-tooltip min-width="120">
                    <template v-slot="scope">
                        <span class="is-link" @click="RouteToManager(scope.row)">{{scope.row.managerName}}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="totalIncome" label="总收入(元)"  align="center" min-width="100">
                </el-table-column>
                <el-table-column prop="totalOut" label="总支出(元)" align="center" show-overflow-tooltip min-width="100"></el-table-column>
                <el-table-column prop="totalProfit" label="毛利润(元)" align="center" show-overflow-tooltip min-width="100"></el-table-column>
                <el-table-column prop="totalTaskProfitAdjustment" label="调整(元)" align="center" show-overflow-tooltip min-width="100"></el-table-column>
                <el-table-column prop="actualProfit" label="实发利润(元)" align="center" show-overflow-tooltip min-width="150"></el-table-column>
                <el-table-column prop="gfee" label="个体户服务费(元)" align="center" show-overflow-tooltip min-width="150"></el-table-column>
                <el-table-column prop="status" label="状态" align="center" min-width="80">
                    <template v-slot="scope">
                        {{scope.row.status | formatStatus}}
                    </template>
                </el-table-column>
                <el-table-column label="操作" align="center" min-width="180">
                    <template v-slot="scope">
                        <el-button size="small" type="text" @click="routeToDetail( scope.row)">利润表</el-button>
                        <el-button size="small" type="text" v-if="scope.row.status==2" @click="routeToPravite(scope.row)">个体户明细</el-button>
                        <el-button size="small" type="text"  v-if="scope.row.status==1" @click="handlePayDia(scope.row)">付款</el-button>
                        <!--<el-button size="small" v-if="scope.row.status==1" type="text" @click="freeze( scope.row)">冻结</el-button>-->
                        <!--<el-button size="small" v-if="scope.row.status==2" type="text" @click="unfreeze(scope.row)">解冻</el-button>-->
                    </template>

                </el-table-column>

            </el-table>
            <div class="page-container">
                <el-pagination
                        class="pagebox"
                        background
                        layout="prev, pager, next"
                        :current-page="currentPage"
                        @current-change="handleCurrentChange"
                        :page-count="pageCount">
                </el-pagination>
            </div>

            <el-dialog
                    title=""
                    :visible.sync="grantVisible"
                    width="500px"
                    center
            >
                <div class="dialog-head">
            <span>确认发放{{batchNumber}}{{selectedItem.managerName}}
                <br>的项目利润吗？</span>
                    <h4>本次发放需收取项目经理300.00元的个体户服务费</h4>
                </div>
                <span slot="footer" class="dialog-footer">
            <el-button round size="medium"  type="primary" @click="handlePay">发 放</el-button>
            <el-button round size="medium"  @click="grantVisible = false">不发放</el-button>
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
        selectedItem:{},
        batchNumber:'',
        grantVisible:false,
        DeleteVisible:false,
        currentPage:1,
        pageSize:20,
        pageCount:'',
        settlementTypeList:'',
        belongtoList:'',
        input5:'',
        select:'',
        tableData:[],
        form: {
          status:'',
        },
        mineItem:{},
        reveiveId:'',
        publishId:'',
      }
    },
    filters:{
      formatminDate(val){
        return util.minDate(val)
      },
      formatStatus(val){
        if(val==1){
          return '待付'
        }else if(val==2){
          return '已付'
        }else{
          return ''
        }
        return util.minDate(val)
      }
    },
    mounted(){
      this.batchNumber=this.$route.params.batchNumber
      this.getList();
    },
    watch:{
      'form.status':function (val,oldval) {
        this.currentPage=1
        this.getList();
      },
    },
    methods: {
      handlePayDia(row){
        this.selectedItem=row
        this.grantVisible=true;
      },
      handlePay(){
        const params = {
          taskManagerProfitId: this.selectedItem.id
        }
        this.$api.profitPay(params).then((response) => {
          if(response.respCode==0){

          }
        }).catch((error) => {
          console.log(error);
        });
      },
      routeToImport (){
        this.$router.push({name:'profitImport',params:{batchNumber:this.batchNumber}})
      },
      routeToPravite(){
        const { href } = this.$router.resolve({
          name: "privateDetail",
//          params: {
//            id:this.reveiveId,
//          }
        });
        window.open(href, "_blank");
      },
      setGrantVisiabe(){
        this.grantVisible=true
      },
      handleSelectionChange(val) {
      },
      RouteToManager(row){
        const {href} = this.$router.resolve({
          name: "projectManagerdetail",
          params: {
            id: row.managerId,
            userId: row.managerUserId,
          }
        });
        window.open(href, "_blank");
      },
      getList(){
        const params ={
          pageNum:this.currentPage,
          pageSize:this.pageSize,
          status:this.form.status,
          batchNumber:this.batchNumber,
        }
        console.log(params)

        this.$api.profitAllDetail(params).then((response) => {
          const {
            data: {
              list,
              pages,
              total,
              pageNum,
            },
          } = response.data;
          this.tableData=list
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
          this.pageCount=pages
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
      routeToDetail(row){
        const { href } = this.$router.resolve({
          name: "profitTable",
          params: {
            id: row.id,
            batchNumber: row.batchNumber,
            name: row.managerName,
            managerId: row.managerId,
          }
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

</style>