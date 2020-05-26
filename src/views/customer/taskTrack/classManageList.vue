<template>
  <div class="trackTaskClassManageCon">
  <div style="width:100%;padding:20px;">{{pitchTaskName}} </div>
    <div class="table-box back-white" style="padding-top:20px;">
      <el-table :data="assignmentInfoClassTaskList" empty-text="暂无相关班务信息" v-loading="loading">
        <el-table-column  align="center"  label="班务"   prop="classTaskName"   show-overflow-tooltip   min-width="100" ></el-table-column>
        <el-table-column  align="center" label="班务经理"  prop="managerName"   show-overflow-tooltip   min-width="100" ></el-table-column>
       <el-table-column  align="center"  label="开始日期"  :formatter="timeFormat" prop="startTime"  show-overflow-tooltip   min-width="100" ></el-table-column>
        <el-table-column  align="center" label="结束日期" :formatter="timeFormat"  prop="endTime"  show-overflow-tooltip min-width="100" ></el-table-column>
        <el-table-column  align="center" label="状态" show-overflow-tooltip  min-width="100" >
           <template v-slot="scope">
              {{statusMap[scope.row.status]}}
          </template>
        </el-table-column>
    <el-table-column  align="center"  label="工时"  prop="totalCusWorkHours"  :formatter="workHoursFormat"   show-overflow-tooltip   min-width="100" ></el-table-column>
        <el-table-column  align="center"  label="产量"  show-overflow-tooltip   min-width="100" >
           <template v-slot="scope">
             <div>
                    <span>{{ scope.row.totalJian | transToZero }}件、</span>
                    <span>{{ scope.row.totalDai | transToZero }}袋、</span>
                    <span>{{ scope.row.totalChe | transToZero }}车、</span>
                    <span>{{ scope.row.totalDun | fixFilter }}吨</span>
                </div>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" >
          <template v-slot="scope">
            <el-button type="text" class="btn-icon btn-icon-view" size="mini" @click="handleToDetail(scope.row)">班务详情</el-button>   
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
export default {
  name: 'classManageList',
  data() {
    return {
      statusMap:{
        [1]:'未开始',
        [2]:'进行中',
        [3]:'已结束'
      },
    assignmentInfoClassTaskList:[],
    params: {
       total:0,
       pageSize: 20,
       pageNum:1,
     },
     loading:false,
    pitchTaskName:'',
    assignmentInfoId:null,
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
    handleToDetail(row){
        const { href } = this.$router.resolve({
            name: "taskTrackClassDetail",
            query: {
                classTaskId:row.classTaskId
            }
          });
          window.open(href, "_blank");
    },
    handleCurrentChange(val){
      this.params.pageNum = val;
      this.handleGetClassList();
    },
     handleGetClassList(type){         
         let params = {
             pageSize:this.params.pageSize,
             pageNum:this.params.pageNum,
             assignmentInfoId:this.$route.query.assignmentInfoId,
         };
         this.loading = true;
         this.$api.classTaskData(params).then(res=>{
             let { data:layer1 } = res;
              let { respCode,data } = layer1;
              if( respCode === 0 ){                  
                  this.assignmentInfoClassTaskList = data.list || [];
                  this.params.total = data.total;
                  this.pitchTaskName = this.$route.query.taskName;
                  this.loading = false;
              }else{
                  this.loading = false;
              }
         }).catch(err=>{
             this.loading = false;
             console.log('err',err);
         })  
    },
  },
}
</script>
<style lang="scss">
    .trackTaskClassManageCon {
        .el-table {
              .cell {
                  text-align: center;
                  padding-left: 10px;
              }
          } 
    }
</style>