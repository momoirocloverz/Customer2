<template>
  <div class="trackMyMaskCon">
   <div class="back-white" style="margin-bottom: 12px;">
    <search-bar combCondition="true" @handleSearch="handleSearch" placeholder="输入任务名称搜索">
      <el-form ref="form"  label-width="100px" labelPosition="left">
        <el-form-item label="接单人:" class="formSearchMargin formSearchMarginTop">
          <el-radio-group class="radio-search" v-model="ownCustomer" @change="handleChangeOwnCustomer" style="width: 100%;display:flex;flex-wrap: wrap;">
            <el-radio :label="item.receiverCusId" v-for="(item,index) in belongToList" :key="index">{{item.name}}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="结算方式:" class="formSearchMargin" >
          <el-radio-group class="radio-search" v-model="settlement" @change="handleChangeSettlement">
            <el-radio label="">不限</el-radio>
            <el-radio :label='2'>月结</el-radio>
            <el-radio :label="4">周结</el-radio>
            <el-radio :label="1">日结</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="任务状态:" class="formSearchMargin">
          <el-radio-group class="radio-search" v-model="taskStatus" @change="handleChangeTaskStatus">
            <el-radio label="">不限</el-radio>
            <el-radio :label="1">未开始</el-radio>
            <el-radio :label="2">进行中</el-radio>
            <el-radio :label="3">已结束</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
    </search-bar>
    </div>
    <div class="table-box back-white">
      <el-table :data="taskList" empty-text="暂无相关信息" v-loading="loading" align="center">
        <el-table-column  align="center" label="任务名称"  prop="taskName"  show-overflow-tooltip  min-width="140" ></el-table-column>
       <el-table-column align="center"  label="接单人"   prop="receiverName" show-overflow-tooltip min-width="100" ></el-table-column>
        <el-table-column align="center" label="开始日期" :formatter="timeFormat" prop="startTime"  show-overflow-tooltip  min-width="130" ></el-table-column>
        <el-table-column  align="center" label="结束日期" prop="endTime" :formatter="timeFormat" show-overflow-tooltip min-width="130" ></el-table-column>
        <el-table-column align="center" label="结算方式"  prop="settlementType" show-overflow-tooltip  min-width="100" >
           <template v-slot="scope">
            {{settlementMap[scope.row.settlementType]}}
          </template>
        </el-table-column>
       <el-table-column align="center" label="计价方式"  prop="valuationType"  :formatter="valuationFormat"  show-overflow-tooltip    min-width="100" ></el-table-column>
        <el-table-column align="center" label="任务状态"  prop="processStatus"  show-overflow-tooltip  min-width="100" >
            <template v-slot="scope">
            {{taskStatusMap[scope.row.processStatus]}}
          </template>
        </el-table-column>
        <el-table-column  align="center" label="总工时"  prop="totalCusWorkHours"  :formatter="workHoursFormat"  show-overflow-tooltip   min-width="100" ></el-table-column>
        <el-table-column align="center" label="总产量"show-overflow-tooltip   min-width="190" >
            <template v-slot="scope">
                <div>
                    <span>{{ scope.row.totalJian | transToZero }}件、</span>
                    <span>{{ scope.row.totalDai | transToZero }}袋、</span>
                    <span>{{ scope.row.totalChe | transToZero }}车、</span>
                    <span>{{ scope.row.totalDun | fixFilter }}吨</span>
                </div>
            </template>
        </el-table-column>
        <el-table-column label="操作" align="center" width="270">
          <template v-slot="scope">
            <el-button type="text" class="btn-icon btn-icon-view" size="mini" @click="handleView(scope.row)">任务详情</el-button>
            <el-button type="text" class="btn-icon btn-icon-manage" size="mini" @click="handleClass(scope.row)">查看班务</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination-container" v-if="params.total!==0">
        <el-pagination class="pagebox" layout="total , prev, pager, next, jumper" :total="params.total" :current-page.sync="params.pageNum" @current-change="handleCurrentChange" :page-size="params.pageSize">
        </el-pagination>
      </div>
    </div>
  </div>
</template>
<script>
import SearchBar from '@/components/SearchBar';
export default {
  name: 'myTask',
  components: { SearchBar },
  data() {
    return {
      settlementMap:{
        [2]:'月结',
        [4]:'周结',
        [1]:'日结'
      },
      taskStatusMap:{
        [1]:'未开始',
        [2]:'进行中',
        [3]:'已结束'
      },
      assignmentInfoId:null,
      belongToList:[],
      pitchTaskName:'',
      showAddClassForm:false,
      taskName:'',
     ownCustomer:'',
     settlement:'',
     taskStatus:'',
     params: {
       total:0,
       pageSize: 20,
       pageNum:1,
     },
     loading: false,
     taskList:[],
     processStatus:null,
    }
  },
    filters:{
        transToZero(val){
            if(val){
                return val;
            }else{
                return 0;
            }
        },
        fixFilter(value){
            if ((toString.call(value) === '[object Null]') || (toString.call(value) === '[object Undefined]')) {
              return 0;
          } else {
              let fix = (Math.round(+value + 'e' + 2) / Math.pow(10, 2)).toFixed(2);
              return fix;
          }
        },
    },
  mounted() {
    this.handleGetTaskBelongToList();
    this.handleGetTaskList();
  },
  methods: {
      timeFormat(row, column, cellValue, index){
          let res = '永久';
          if(cellValue){
              res = this.Moment(cellValue).format("YYYY-MM-DD HH:mm");
          }else{
              res = '永久'
          }
          return res;
      },
      workHoursFormat(row, column, cellValue, index){
          if ((toString.call(cellValue) === '[object Null]') || (toString.call(cellValue) === '[object Undefined]')) {
              return 0;
          } else {
              let fix = (Math.round(+cellValue + 'e' + 1) / Math.pow(10, 1)).toFixed(1);
              return fix;
          }
      },
      valuationFormat(row, column, cellValue, index){
          let result = ''
              switch (Number(cellValue)) {
                case 1:
                  result = '计时'
                  break;
                case 8:
                  result = '日固定'
                  break;
                case 2:
                case 3:
                case 4:
                  result = '计量'
                  break;
                case 5:
                case 6:
                case 7:
                  result = '计时 + 计量'
                  break;
                default:
                  break;
              }
              return result
      },
      uniRequest(){
          this.params.pageNum = 1;
          this.handleGetTaskList();
      },
    handleChangeTaskStatus(){
        this.uniRequest();
    },
    handleChangeSettlement(){
        this.uniRequest();
    },
    handleChangeOwnCustomer(){
        this.uniRequest();
    },
    handleGetTaskBelongToList(){
      this.$api.receiverList().then(res=>{
          let { respCode,data } = res;
          if( respCode === 0 ){
              let tempArr = data||[];              
              this.belongToList = [ {receiverCusId:'',name:'不限'},...tempArr ]; 
          }
      }).catch(err=>{
          console.log('err',err);
      })
    },
    handleView(row){
     const { href } = this.$router.resolve({
        name: "taskTrackDetail",
        query: {
          id: row.assignmentInfoId,
        }
      });
      window.open(href, "_blank");
    },
    handleClass(row){
        const { href } = this.$router.resolve({
        name: "taskTrackClassManageList",
        query: {
            assignmentInfoId:row.assignmentInfoId,
            taskName:row.taskName,
        }
      });
      window.open(href, "_blank");
    },
    handleSearch(val){
      this.taskName = val;
      this.uniRequest();
    },
    handleGetTaskList(){
        let params = {
            pageNum:this.params.pageNum,
            pageSize:this.params.pageSize,
            receiverCusId:this.ownCustomer,
            settlementType:this.settlement,
            processStatus:this.taskStatus,
            taskName:this.taskName,
        };
        this.loading = true;
        this.$api.assignmentInfoData(params).then(res=>{
            let { data:layer1 } = res;
            let { respCode,data } = layer1;
            if( respCode === 0 ){
                this.taskList = data.list||[];
                this.params.total = data.total;
                this.loading = false;
            }else{
                this.loading = false;
            }
        }).catch(err=>{
            this.loading = false;
            console.log('err',err);
        });
    },
    handleCurrentChange(val){
      this.params.pageNum = val;
      this.handleGetTaskList();
    },
  },
}
</script>
<style lang="scss" scope>
  .trackMyMaskCon {
  }
</style>
<style lang="scss">
  .trackMyMaskCon {
      .el-table {
          .cell {
              text-align: center;
              padding-left: 10px;
          }
      }
  }
</style>