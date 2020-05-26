<template>
  <div class="gClassManagerList">
  <div style="width:100%;padding:20px;">{{pitchTaskName}} </div>
    <div class="table-box back-white" style="padding-top:20px;">
  <el-button type="primary" @click="handleAddClassTask" v-if="showAdd" :loading="verifyLoading" style="margin-left:20px;margin-bottom:20px;">添加班务</el-button>
      
      <el-table :data="assignmentInfoClassTaskList" empty-text="暂无相关信息" v-loading="loading">
        <el-table-column 
        align="center"
          label="班务" 
          prop="classTaskName" 
          show-overflow-tooltip  
          min-width="100" >
        </el-table-column>
        <el-table-column 
        align="center"
          label="班务经理" 
          show-overflow-tooltip  
          min-width="100" >
            <template v-slot="scope">
              {{scope.row.managerName ? scope.row.managerName :'无' }}
          </template>
        </el-table-column>
       <el-table-column align="center" label="开始日期"   show-overflow-tooltip   min-width="100" >
           <template v-slot="scope">
                <div>{{ timeFormatter(scope.row.startTime) }}</div>
            </template>
        </el-table-column>
        <el-table-column  align="center" label="结束日期"  show-overflow-tooltip  min-width="100" >
          <template v-slot="scope">
                <div>{{ timeFormatter(scope.row.endTime) }}</div>
            </template>
        </el-table-column>
        <el-table-column 
        align="center"
          label="状态" 
          prop="address" 
          show-overflow-tooltip  
          min-width="100" >
           <template v-slot="scope">
              {{statusMap[scope.row.status]}}
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" width="500">
          <template v-slot="scope">
            <el-button type="text" class="btn-icon btn-icon-view" size="mini" @click="handleToDetail(scope.row)">班务详情</el-button>
            <el-button type="text" v-if="scope.row.status===1||scope.row.status===2" class="btn-icon btn-icon-edit" size="mini" @click="handleEdit(scope.row)">编辑班务</el-button>
            <el-button type="text" v-if="scope.row.status===2" class="btn-icon btn-icon-reject" size="mini" :loading="verifyStopLoading" @click="handleStopClass(scope.row)">结束班务</el-button>
            <el-button type="text" v-if="scope.row.status===1" class="btn-icon btn-icon-view" size="mini" @click="handleDelete(scope.row)">删除班务</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination-container" v-if="params.total!==0">
        <el-pagination class="pagebox" layout="total , prev, pager, next, jumper" :total="params.total" :current-page.sync="params.pageNum" @current-change="handleCurrentChange" :page-size="params.pageSize">
        </el-pagination>
      </div>
    </div>
    
        <el-dialog title="添加班务" :visible.sync="alertDialShow" width="360px"
                   class="base-dialog centerDialogue">  
            <div class="classSelectCon">
                <div class="upBtnCon">
                    <el-button @click="toNormal" class="btnNormal">常规班务</el-button>
                    <div>创建常规班务后可分配给班务经理，更适用于现场管理</div>
                </div>
                <div class="bottomBtnCon">
                    <el-button @click="toShortCut" class="btnNormal">快捷班务</el-button>
                    <div>创建快捷班务可直接指定零工，并快速完成班务结算快捷班务不进行效能和利润分析</div>
                </div>
            </div>
        </el-dialog>


    <el-dialog
        title="添加班务成功"
        :visible.sync="showSuccessAdd"
        width="30%"
        :before-close="handleClose"       
        center
        >
        <span v-if="isGrab == '1' ">班务已添加成功，请班务经理登录班务经理APP进入【工作台-班务】页面，对其负责的班务进行【开始班务】操作
          根据实际情况一个任务可分解为1个或若干个班务</span>
          <span v-else>需求已发布至班务市场，班务经理可在app端抢单，请您关注发布中心，及时同意抢单需求。根据实际情况一个任务可分解为1个或若干个班务</span>
        <span slot="footer" class="dialog-footer">
        <el-button class="fixStyle1" @click="handleToClassList">继续为此任务添加班务</el-button>
          <el-button type="primary" @click="goBackSomeWhere">返回任务</el-button>
          
        </span>
      </el-dialog>


    <add-class-form 
      :key="1"
      :taskName="pitchTaskName" 
      :save="handleSave" 
      :showAddClassForm="showAddClassForm" 
      :cancelAddClassForm="cancelAddClassForm" 
      :assignmentInfoId="assignmentInfoId"
      :saveLoading="saveLoading"
      :edit="false"
      ref="addClassform"
      />
    <add-class-form 
      :key="2"
      :taskName="pitchTaskName" 
      :showAddClassForm="showEditClassForm" 
      :cancelAddClassForm="cancelEditClassForm" 
      :assignmentInfoId="null"
      :saveLoading="saveLoading"
      :editData="editData"
      :edit="true"
      :handleEdit="handlePostClassTaskUpdate"
      ref="addClassformEdit"
      />
  </div>
</template>

<script>
import AddClassForm from './addClassForm.vue';
export default {
  name: 'classManageList',
  components: { AddClassForm },
  data() {
    return {
      classListLen:0,
      verifyStopLoading:false,
      verifyLoading:false,
      saveLoading: false,
      statusMap:{
        [1]:'未开始',
        [2]:'进行中',
        [3]:'已结束'
      },
        isGrab:'1',
        showSuccessAdd:false,
        alertDialShow:false,
    assignmentInfoClassTaskList:[],
    params: {
       total:0,
       pageSize: 20,
       pageNum:1,
     },
     loading:false,
    showAddClassForm:false,
    pitchTaskName:'',
    assignmentInfoId:null,
    showAdd:true,
    showEditClassForm:false,
    classTaskId:null,
    editData:null,
    }
  },
  mounted() {
    this.handleGetClassList();
    const {processStatus,taskName,assignmentInfoId} = this.$route.query;
    this.pitchTaskName = taskName;
    this.assignmentInfoId = Number(assignmentInfoId);
    this.handleGetTaskDetail(assignmentInfoId);
    if(Number(processStatus)===3){
      this.showAdd = false;
    }else {
      this.showAdd = true;
    }
  },
  methods: {
      handleClose(){
          this.showSuccessAdd = false;
          this.goBackSomeWhere();
      },
      goBackSomeWhere(){
          this.$router.push({
             name: "outSourceTaskSub",
          });
      },
      handleToClassList(){
          this.showSuccessAdd = false;
      },
      timeFormatter(cellValue){
            let res = '永久';
            if(cellValue){
                res = this.Moment( cellValue ).format('YYYY-MM-DD HH:mm') ;
            }else{
                res = '永久';
            }
            return res;
        },
    handleGetTaskDetail(id){
      this.$api.getTaskStatus({id}).then(res=>{
            this.$store.commit('outSET_THUS_TASK_DETAIL',res.data);
      })
    },
    handleToDetail(row){
      this.$router.push({name:'outSourceClassDetails',query:{classTaskId:row.classTaskId}});
    },
    handleCurrentChange(val){
      this.params.pageNum = val;
      this.handleGetClassList();
    },
    handleGetTaskStatus(){
      return this.$api.getTaskStatus({id:this.assignmentInfoId});
    },
    cancelEditClassForm(){
      this.showEditClassForm = false;
    },
    handleEdit(row){
      this.classTaskId = row.classTaskId;
      this.handleGetClassTaskDetail(row.classTaskId);
    },
    handleGetClassTaskDetail(classTaskId){
      this.$api.getClassTaskDetail({classTaskId}).then(res=>{
        this.editData = res.data;
        this.$store.commit('outSET_CLASS_FORM_STATE',res.data);
        this.showEditClassForm = true;
      });
    },
    handlePostClassTaskUpdate(val){
      delete val.assignmentInfoId
      val.id = this.classTaskId;
      this.saveLoading = true;
      this.$api.postClassTaskUpdate(val).then(res=>{
        if(res.data.respCode===0){
          this.$message({
          message: '编辑成功',
          type: 'success'
        });
        this.showEditClassForm=false;
        this.handleGetClassList();
        }
        this.saveLoading = false;
      })
    },
    handleDelete(row){
      this.$confirm(`确认删除${row.classTaskName} 班务吗?`, '提示', {
          confirmButtonText: '确 认',
          cancelButtonText: '取 消',
          type: 'warning'
        }).then(() => {
          this.$api.classTaskDelete({classTaskId:row.classTaskId}).then(res=>{
                if(res.data.respCode===0){
                   this.$message({
                    type: 'success',
                    message: '删除成功!'
                  });
                 this.assignmentInfoClassTaskList = [];
                this.handleGetClassList();
                }
                })
        }).catch(() => {
        });
    },
    handleSave(val){
        this.isGrab = val.isGrab;
       this.saveLoading = true;
      this.$api.postClassTaskAdd(val).then(res=>{
        if(res.data.respCode===0){
          this.showAddClassForm =false;
            this.showSuccessAdd = true;
          this.handleGetClassList();
        }
       this.saveLoading = false;
      }).catch(error=>{
        
      })
    },
     handleGetClassList(type){
      const {pageNum,pageSize} = this.params;
      const {assignmentInfoId} = this.$route.query;
      this.loading = true;      this.$api.getAssignmentInfoClassTaskList({pageNum,pageSize,assignmentInfoId:Number(assignmentInfoId)}).then(res=>{
         this.assignmentInfoClassTaskList = res.data.list||[];
         this.params.total = res.data.total||0;
         this.$store.commit('outSET_CLASS_LIST_LEN',res.data.total);
         this.$store.commit('outSET_TASK_NAME',this.pitchTaskName);
         this.$refs.addClassform.handleClearState();
         this.loading = false;
      })
    },
    handleAddClassTask(){
      this.verifyLoading = true;
      this.handleGetTaskStatus().then(res=>{
        this.verifyLoading = false;
        if(res.data.receiveStatus===3){
          this.$message({
          message: '当前任务状态已改变，无法添加班务',
          type: 'warning'
        });
        }else {
            this.alertDialShow = true;
        }
      })
    },
      toNormal(){
          this.alertDialShow = false;
          this.zhangyuLogic1();
      },
      toShortCut(){
          this.$store.commit('setShortCutIndexOut',1);
          sessionStorage.removeItem('shortCutFirstOut');
          sessionStorage.removeItem('shortCutSecOut');
          sessionStorage.removeItem('secSelectOut');          
          this.$router.push({
              name: "shortcutClassOut"
          });
      },
      zhangyuLogic1(){
          this.showAddClassForm =true;
          this.$store.commit('outSET_TASK_NAME',this.pitchTaskName);
      },
    cancelAddClassForm(){
      this.showAddClassForm=false
    },
    handleStopClass(row){
      // this.verifyStopLoading = true;
        this.handleGetTaskStatus().then(res=>{
          // this.verifyStopLoading = false;
          if(res.data.receiveStatus===3){
            this.$message({
            message: '当前任务状态已改变，不能结束班务',
            type: 'warning'
          });
          }else {
            this.$confirm(`确认结束${row.classTaskName} 班务吗?`, '提示', {
                confirmButtonText: '确 认',
                cancelButtonText: '取 消',
                type: 'warning'
              }).then(() => {
                // this.$message({
                //   type: 'success',
                //   message: '删除成功!'
                // });
                this.$api.classTaskFinish({classTaskId:row.classTaskId}).then(res=>{                    
                   this.handleGetClassList();
                })
              }).catch(() => {
              });
          }
      })
    }
  },
  
}
</script>
<style lang="scss" scoped>
    .gClassManagerList {
         .fixStyle1 {
            width: 182px !important;
        }
        .classSelectCon {
            text-align: center;
        }
        .upBtnCon {
            box-sizing: border-box;
            padding-left: 35px;
            padding-right: 35px;
            padding-bottom: 22px;
            border-bottom: 1px solid #EDEEF0;
        }
        .bottomBtnCon {
            box-sizing: border-box;
            padding-left: 35px;
            padding-right: 35px;
            padding-top: 22px;
        }
        .btnNormal {
            color: #e84518;
            border-color: #f8c7ba;
            background-color: #fdece8;
            margin-bottom: 14px;
        }
    }    
</style>
<style lang="scss">
    .gClassManagerList {
        .centerDialogue {
            .el-dialog {
                text-align: left;
                height: 335px;
                position: absolute;
                left: 0;
                right: 0;
                top: 0;
                bottom: 0;
                margin: auto !important;
            }
            .el-dialog__body {
                padding-bottom: 20px;
                padding-left: 0;
                padding-right: 0;
            }
            .el-dialog__header {
                border-bottom: none;
            }
            .el-button:active {
                color: #d13e16;
                border-color: #d13e16;
            }
        }
    }
</style>