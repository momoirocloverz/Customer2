<template>
  <div class="outSourceTaskManageCon">
   <div class="back-white" style="margin-bottom: 12px;">
    <search-bar combCondition="true" @handleSearch="handleSearch" placeholder="输入任务名称搜索">
      <el-form ref="form"  label-width="100px" labelPosition="left">
        <el-form-item label="所属客户:" class="formSearchMargin formSearchMarginTop">
          <el-radio-group class="radio-search" v-model="ownCustomer" @change="handleChangeOwnCustomer" style="width: 100%;display:flex;flex-wrap: wrap;">
            <el-radio :label="it.belongTo" v-for="(it,i) in belongToList" :key="i">{{it.belongToName}}</el-radio>
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
          <el-form-item label="外包商:" class="formSearchMargin formSearchMarginTop">
          <el-radio-group class="radio-search" v-model="outsourcingCusId" @change="handleoutsourcingCusId"   style="width: 100%;display:flex;flex-wrap: wrap;">
            <el-radio :label="item.id" v-for="(item,i) in outSourceLists" :key="i">{{item.name}}</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
    </search-bar>
    </div>      
      <div class="back-white btn-div flexable">
          <el-button class="primary-btn setWidthBtn" size="mini" @click="addNew">发任务给平台外包商</el-button>
    </div>      
    <div class="table-box back-white">
      <el-table :data="taskList" empty-text="暂无相关信息" v-loading="loading" align="center">
        <el-table-column 
        align="center"
          label="任务名称" 
          prop="taskName" 
          show-overflow-tooltip  
          min-width="140" >
        </el-table-column>
       <el-table-column 
       align="center"
          label="所属客户" 
          prop="belongToName" 
          show-overflow-tooltip  
          min-width="100" >
        </el-table-column>
           <el-table-column label="外包商" prop="outsourcingCusName" show-overflow-tooltip align="center" ></el-table-column>
        <el-table-column  align="center" label="开始日期" show-overflow-tooltip   min-width="100" >
            <template v-slot="scope">
                <div>{{ timeFormatter(scope.row.startTime) }}</div>
            </template>
        </el-table-column>
        <el-table-column align="center" label="结束日期"  prop="endTime"  show-overflow-tooltip min-width="100" >
          <template v-slot="scope">
                <div>{{ timeFormatter(scope.row.endTime) }}</div>
            </template>
        </el-table-column>
        <el-table-column 
        align="center"
          label="结算方式" 
          prop="settlementType" 
          show-overflow-tooltip  
          min-width="100" >
           <template v-slot="scope">
            {{settlementMap[scope.row.settlementType]}}
          </template>
        </el-table-column>
       <el-table-column 
       align="center"
          label="工作地点" 
          prop="workingPlace" 
          show-overflow-tooltip  
          min-width="100" >
        </el-table-column>
        <el-table-column 
        align="center"
          label="任务状态" 
          prop="processStatus" 
          show-overflow-tooltip  
          min-width="100" >
          <template v-slot="scope">
            {{taskStatusMap[scope.row.processStatus]}}
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" width="400">
          <template v-slot="scope">
            <el-button type="text" class="btn-icon btn-icon-view" size="mini" @click="handleView(scope.row)">任务详情</el-button>
            <el-button type="text" v-if="scope.row.processStatus===2" class="btn-icon btn-icon-reject" size="mini" @click="handleStopTask(scope.row)">结束任务</el-button>
            <el-button type="text" v-if="scope.row.processStatus===1" class="btn-icon btn-icon-add" size="mini" @click="handleAddClassTask(scope.row)">开始任务</el-button>
            <el-button type="text"  v-if="scope.row.processStatus===2||scope.row.processStatus===3" class="btn-icon btn-icon-manage" size="mini" @click="handleClass(scope.row)">管理班务</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination-container" v-if="params.total!==0">
        <el-pagination class="pagebox" layout="total , prev, pager, next, jumper" :total="params.total" :current-page.sync="params.pageNum" @current-change="handleCurrentChange" :page-size="params.pageSize">
        </el-pagination>
      </div>
    </div>
      <el-dialog
        title="添加班务成功"
        :visible.sync="showSuccessAdd"
        width="30%"
        center
        >
        <span v-if="isGrab == '1' ">班务已添加成功，请班务经理登录班务经理APP进入【工作台-班务】页面，对其负责的班务进行【开始班务】操作
          根据实际情况一个任务可分解为1个或若干个班务</span>
          <span v-else>需求已发布至班务市场，班务经理可在app端抢单，请您关注发布中心，及时同意抢单需求。根据实际情况一个任务可分解为1个或若干个班务</span>
        <span slot="footer" class="dialog-footer">
        <el-button class="fixStyle1" @click="handleToClassList">继续为此任务添加班务</el-button>
          <el-button type="primary" @click="showSuccessAdd = false">返回任务</el-button>
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
      ref="addCalssFrom"
      />
    
        
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

      <add-task v-if="addTaskVisible" :taskId="taskId" :comeFrom="setSource" :addOrEditStatus="addOrEditStatus" @closeDialog='handleCloseDialog' />


  </div>
</template>

<script>
    import AddTask from './AddTaskdialog'
import SearchBar from '@/components/SearchBar';
import AddClassForm from './addClassForm.vue';
export default {
  name: 'myTask',
  components: { SearchBar,AddClassForm,AddTask },
  data() {
    return {
        addOrEditStatus: 1,
        setSource:'4',
        taskId: 0,
        addTaskVisible:false,
        outsourcingCusId:'',
        alertDialShow:false,
        showSuccessAdd:false,
        saveLoading:false,
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
         isGrab:'1',
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
        outSourceLists:[{id:'',name:'不限'}],
    }
  },
  mounted() {
      this.handleGetTaskBelongToList();
      this.handleGetTaskList();
      this.geOutLists();
  },
  methods: {
      timeFormatter(cellValue){
            let res = '永久';
            if(cellValue){
                res = this.Moment( cellValue ).format('YYYY-MM-DD HH:mm') ;
            }else{
                res = '永久';
            }
            return res;
        },
      handleCloseDialog(payload){
          this.addTaskVisible = false;
          if( payload ){
              this.params.pageNum = 1;
              this.handleGetTaskList();
          }
      },
      addNew(){
          this.addTaskVisible = true;
      },
      geOutLists(){
          let params = {
              customerType:2,
              pageSize:0,
          };
          this.$api.getOutLists(params).then(res=>{
              let { data:layer1 } = res;
              let { data,respCode } = layer1;
              if( respCode === 0 ){
                  if(data && data.list){
                      this.outSourceLists = [{id:'',name:'不限'},...data.list];
                  }else{
                      this.outSourceLists = [{id:'',name:'不限'}];
                  }
              }else{
                  this.outSourceLists = [{id:'',name:'不限'}];
              }
          }).catch(err=>{
              console.log('err',err);
          })
      },
       toNormal(){
          this.alertDialShow = false;           
          this.zhangyuLogic1();
      },      
      zhangyuLogic1(){
          this.showAddClassForm =true;
//          this.$store.commit('SET_TASK_NAME',this.pitchTaskName);
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
    handleChangeTaskStatus(){
      this.params.pageNum = 1;
      this.handleGetTaskList();
    },
    handleChangeSettlement(){
      this.params.pageNum = 1;
      this.handleGetTaskList();
    },
    handleChangeOwnCustomer(){
      this.params.pageNum = 1;
      this.handleGetTaskList();
    },
      handleoutsourcingCusId(){
          this.handleChangeOwnCustomer();
      },
    handleToClassList(){
        this.$router.push({
            name:'outClassManageList',
            query:{ 
                assignmentInfoId:this.assignmentInfoId,
                processStatus:this.processStatus,
                taskName:this.pitchTaskName,
            }
       })
    },
    handleGetTaskBelongToList(){
      this.$api.getTaskBelongToList().then(res=>{
          let tempList = res.data||[];
          let regenerate = tempList.map(item=>{
             return {
                 belongTo:`${item.belongTo}-${item.belongToType}`,
                 belongToType:item.belongToType,
                 belongToName:item.belongToName,
             } 
          });
          this.belongToList = [{belongTo:'',belongToName:'不限'},...regenerate];
      })
    },
    handleView(row){
     const { href } = this.$router.resolve({
        name: "outSourceTaskDetail",
        query: {
          id: row.assignmentInfoId,
        }
      });
      window.open(href, "_blank");
    },
    handleClass(row){
      this.$router.push({name:'outClassManageList',query:{
        assignmentInfoId:row.assignmentInfoId,
        processStatus:row.processStatus,
        taskName:row.taskName,
      }});
    },
    handleStopTask(row){
      if(row.processStatus===3){
         this.$message("当前任务已结束");
      }else {
        this.$confirm(`确认结束${row.taskName} 任务吗?`, '提示', {
                confirmButtonText: '确 认',
                cancelButtonText: '取 消',
                type: 'warning'
              }).then(() => {
                 this.$api.assignmentInfoStop({id:row.assignmentInfoId}).then(res=>{
                   this.handleGetTaskList();
                });
              }).catch(() => {
              });
       
      }
    },
    cancelAddClassForm(){
      this.showAddClassForm=false;
      this.assignmentInfoId = null;
    },
    handleSave(val){
        this.isGrab = val.isGrab;
      this.saveLoading = true;
      this.$api.postClassTaskAdd(val).then(res=>{
        if(res.data.respCode===0){
        
        this.showAddClassForm =false;
        this.handleGetTaskList();
         this.showSuccessAdd = true;
        }
        this.saveLoading = false;
      }).catch(error=>{
        
      })
    },
    handleSearch(val){
      this.taskName = val;
      this.params.pageNum =1;
      this.handleGetTaskList();
    },
    handleGetTaskList(){
      const {ownCustomer,settlement,taskStatus,taskName} = this;
      const {pageNum,pageSize} = this.params;
      this.loading = true;
        let reqParams =  {
            belongTo:ownCustomer?ownCustomer.split('-')[0]:'',
            belongToType:ownCustomer?ownCustomer.split('-')[1]:'',
            settlementType:settlement,
            processStatus:taskStatus,
            pageNum,
            pageSize,
            showOutsourcing:true,               
            taskName
        };
        if( this.outsourcingCusId ){
            let forOutIndex =  this.outSourceLists.findIndex(ele=>{
                return ele.id === this.outsourcingCusId;
            });
            reqParams.outsourcingCusId = this.outsourcingCusId;
            reqParams.outsourcingCusName = this.outSourceLists[forOutIndex].shortName;
        }
        this.$api.getMyTaskList(reqParams).then(res=>{
            this.taskList = res.data.data.list||[];
            this.params.total = res.data.data.total;
            this.loading = false;
        })
    },
    handleCurrentChange(val){
      this.params.pageNum = val;
      this.handleGetTaskList();
    },
    handleAddClassTask(row){
      if(row.processStatus===3){
          this.$message("当前任务状态已改变，无法开始任务");        
      }else {          
          this.$api.getTaskStatus({id:Number(row.assignmentInfoId)}).then(res=>{
              if(res.data.processStatus===1){
                  this.$store.commit('outSET_THUS_TASK_DETAIL',res.data);
                  this.$api.getAssignmentInfoClassTaskList({assignmentInfoId:Number(row.assignmentInfoId)}).then(res=>{
                      this.$store.commit('outSET_CLASS_LIST_LEN',res.data.total);
                      this.$store.commit('outSET_TASK_NAME',row.taskName);
                      if(this.$refs.addCalssFrom){
                          this.$refs.addCalssFrom.handleClearState();
                      }
                      this.pitchTaskName = row.taskName;
                      this.assignmentInfoId = row.assignmentInfoId;
                      this.processStatus = row.processStatus;
                      this.alertDialShow = true;
                  })
              }else {
                  this.$message("当前任务状态已改变，无法开始任务");
              }
          })
      }
    }
  },
}
</script>
<style lang="scss" scoped>
    .outSourceTaskManageCon { 
         .classSelectCon {
            text-align: center;
        } 
        .fixStyle1 {
            width: 182px !important;
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
        .setWidthBtn {
            width: 160px !important;
        }
    }
</style>
<style lang="scss">
    .outSourceTaskManageCon {
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