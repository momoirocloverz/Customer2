<template>
  <div class="taskTrackClassListCon">
  <div class="back-white" style="margin-bottom: 12px;">
    <search-bar combCondition="true" @handleSearch="handleSearch" placeholder="输入班务名称搜索">
      <el-form label-width="100px" labelPosition="left">
        <el-form-item label="接单人:" class="formSearchMargin formSearchMarginTop" >
          <el-radio-group class="radio-search" v-model="ownCustomer" @change="handleChangeOwnCustomer" style="width: 100%;display:flex;flex-wrap: wrap;">
            <el-radio :label="item.receiverCusId" v-for="(item,index) in belongToList" :key="index">{{item.name}}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="班务状态:" class="formSearchMargin">
          <el-radio-group class="radio-search" v-model="classStatus" @change="handleChangeClassStatus">
            <el-radio label="">不限</el-radio>
            <el-radio :label="1">未开始</el-radio>
            <el-radio :label="2">进行中</el-radio>
            <el-radio :label="3">已结束</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="班务经理:" class="formSearchMargin">
          <el-radio-group class="radio-search" v-model="classManager" @change="handleChangeClassManagers" style="width: 100%;display:flex;flex-wrap: wrap;">
           <el-radio :label="it.managerId" v-for="(it,i) in managerList" :key="i">{{it.managerNameAlias}}</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
    </search-bar>
    </div>
    <div class="table-box back-white">
      <el-table :data="classList" empty-text="暂无相关信息" v-loading="loading">
        <el-table-column  align="center"  label="班务名称"  prop="classTaskName"  show-overflow-tooltip    min-width="100" ></el-table-column>
        <el-table-column  align="center" label="所属任务"  prop="taskName" show-overflow-tooltip  min-width="100" ></el-table-column>
       <el-table-column  align="center" label="接单人"  prop="receiverName"  show-overflow-tooltip  min-width="100" ></el-table-column>
        <el-table-column  align="center" label="班务经理" prop="managerName" show-overflow-tooltip  min-width="100" ></el-table-column>
        <el-table-column align="center" label="开始日期" :formatter="timeFormat" prop="startTime" show-overflow-tooltip  min-width="100" ></el-table-column>
        <el-table-column align="center" label="结束日期" :formatter="timeFormat" prop="endTime" show-overflow-tooltip min-width="100" ></el-table-column>
        <el-table-column align="center" label="工作地点"  prop="workingPlace" show-overflow-tooltip  min-width="100" ></el-table-column>
        <el-table-column  align="center" label="班务状态" show-overflow-tooltip min-width="100" >
          <template v-slot="scope">
              {{statusMap[scope.row.status]}}
          </template>
        </el-table-column>
        <el-table-column align="center" label="总工时"  prop="totalCusWorkHours"  show-overflow-tooltip min-width="100"  :formatter="workHoursFormat"></el-table-column>
        <el-table-column align="center" label="总产量"  show-overflow-tooltip  min-width="190" >
            <template v-slot="scope">
                <div>
                    <span>{{ scope.row.totalJian | transToZero }}件、</span>
                    <span>{{ scope.row.totalDai | transToZero }}袋、</span>
                    <span>{{ scope.row.totalChe | transToZero }}车、</span>
                    <span>{{ scope.row.totalDun | fixFilter }}吨</span>
                </div>
            </template>
        </el-table-column>
        <el-table-column label="操作" align="center" min-width="100">
          <template v-slot="scope">
            <el-button type="text" class="btn-icon btn-icon-view" size="mini" @click="handleViewDetail(scope.row)">班务详情</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination-container" v-if="params.total!=0">
        <el-pagination class="pagebox" layout="total , prev, pager, next, jumper" :total="params.total" :current-page.sync="params.pageNum" @current-change="handleCurrentChange" :page-size="params.pageSize">
        </el-pagination>
      </div>
    </div>
  </div>
</template>
<script>
import SearchBar from '@/components/SearchBar';
export default {
  name: 'classList',
  components: { SearchBar },
  data() {
    return {
      statusMap:{
        [1]:'未开始',
        [2]:'进行中',
        [3]:'已结束'
      },
      managerList:[],
      classTaskName:'',
     ownCustomer:'',
     classStatus:'',
     classManager:'',
     belongToList:[],
     classList:[],
    params: {
       total:0,
       pageSize: 20,
       pageNum:1,
     },
     loading:false,
     classTaskId:null,
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
     this.handleGetManagerList();
     this.handleGetClassList();
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
    handleCurrentChange(val){
      this.params.pageNum = val;
      this.handleGetClassList();
    },
    handleViewDetail(row){
       const { href } = this.$router.resolve({
        name: "taskTrackClassDetail",
        query: {
            classTaskId: row.classTaskId,
        }
      });
      window.open(href, "_blank");
    },
      uniRequest(){
          this.params.pageNum = 1;
          this.handleGetClassList();
      },
    handleChangeOwnCustomer(){
        this.uniRequest();
    },
    handleChangeClassStatus(){
        this.uniRequest();
    },
    handleChangeClassManagers(){
        this.uniRequest();
    },
    handleGetManagerList(){
      this.$api.trackManagerList().then(res=>{
          let { respCode,data } = res;
          if( respCode === 0 ){
              let $managerList =  data || [];
               this.managerList = [
                   {managerId:'',managerNameAlias:'不限'},...$managerList
               ];
          }
      }).catch(err=>{
          console.log('err',err);
      })
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
    handleSearch(val){
      this.classTaskName = val;
      this.params.pageNum =1;
      this.handleGetClassList();
    },
     handleGetClassList(){
         let params = {
             pageNum:this.params.pageNum,
             pageSize:this.params.pageSize,
             assignmentInfoId:'',
             receiverCusId:this.ownCustomer,
             status:this.classStatus,
             managerId:this.classManager,
             classTaskName:this.classTaskName,
         };
         this.$api.classTaskData(params).then(res=>{
             let { data:layer1 } = res;
              let { respCode,data } = layer1;
              if( respCode === 0 ){
                  this.classList = data.list || [];
                  this.params.total = data.total;
              }
         }).catch(err=>{
             console.log('err',err);
         })      
    },
  },
}
</script>
<style lang="scss">
    .taskTrackClassListCon {
        .el-table {
          .cell {
              text-align: center;
              padding-left: 10px;
          }
      }
    }
</style>