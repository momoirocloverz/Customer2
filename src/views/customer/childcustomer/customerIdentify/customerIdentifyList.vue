<template>
  <div class="customer-identify-list">
    <div>
     <el-tabs v-model="status" type="card" @tab-click="handleStatusChange">
      <el-tab-pane label="在用" name="on"></el-tab-pane>
      <el-tab-pane label="停用" name="off"></el-tab-pane>
    </el-tabs>
      <!--<el-radio-group v-model="status" @change="handleStatusChange">
        <el-radio-button label="on">在用</el-radio-button>
        <el-radio-button label="off">停用</el-radio-button>
      </el-radio-group>-->
    </div>
    <div class="u-condition-wrapper">
      
      <div class="keyword-wrapper">
        <div class="keyword-value">
          <el-input placeholder="输入姓名搜索" v-model="keyword" class="input-with-select" size="small">
            
          </el-input>
          <el-button  size="small" type="primary" style="margin-left: 25px" @click="hanldeGetKeywordMessage">搜索</el-button>
        </div> 
       
    </div>
     <el-divider></el-divider>
     <div class="role-wrapper">
        <div class="role-key">
          角色:
        </div>
        <div class="role-value">
          <el-radio-group class="radio-search" v-model="roleTypeParent"  @change="handleRoleTypeParentChange">
              <el-radio label="">不限</el-radio>
              <el-radio :label="1">日常产量确认人</el-radio>
              <el-radio :label="2">管理者</el-radio>
          </el-radio-group>
        </div>
      </div>
   </div>
   <div class="add-wrapper">
    <el-button v-if="status==='on'" @click="handleEdit(false)" type="primary" size="small">添加客户确认人</el-button>
    </div>
   
    <el-table
      emptyText="暂无相关信息"
      :data="tableData"
      v-loading="loading"
      height="500"
      style="width: 100%">
      <el-table-column
        prop="nameAlias"
        label="姓名"
        width="180">
      </el-table-column>
      <el-table-column
        prop="idCard"
        label="身份证号"
        width="200">
      </el-table-column>
      <el-table-column
        prop="roleType"
        label="角色">
        <template slot-scope="{row}">
          <div class="u-role-type" v-if="row.roleType===1">
            日常产量确认人
          </div>
          <div class="u-role-type" v-else>
            管理者
          </div>
        </template>
      </el-table-column>
      <el-table-column
        prop="taskCount"
        label="负责的班务数">
        <template slot-scope="{row}">
          <div class="u-task-count" v-if="row.taskCount>0" @click="handleGetTaskCount(row)">
            {{row.taskCount}}
          </div>
          <div v-else>
            {{row.taskCount}}
          </div>
        </template>
      </el-table-column>
      <el-table-column
        prop="personCount"
        label="数据查看权限">
        <template slot-scope="{row}">
         <div class="u-person-count" v-if="row.personCount>0" @click="handleGetPersonCount(row)">
            {{row.personCount}}
          </div>
          <div v-else>
            {{row.personCount}}
          </div>
        </template>
      </el-table-column>
      <el-table-column
        :prop="status==='on'?'createdAt':'disableTime'"
        :label="status==='on'?'最近添加时间':'最近停用时间'">
      </el-table-column>
      <el-table-column
        prop="operation"
        label="操作">
        <template slot-scope="{row}">
          <div class="u-operation" v-if="status==='on'">
            <el-button type="text" class="btn-icon btn-icon-edit" size="mini" @click="handleEdit(row)">编辑</el-button>
            <el-button type="text" class="btn-icon btn-icon-stop" size="mini" @click="handleStop(row)">停用</el-button>
          </div>
         <div class="u-operation" v-else>
            <el-button type="text" class="btn-icon btn-icon-agree" size="mini" @click="handleStart(row)">启用</el-button>
        </div>
        </template>
      </el-table-column>
    </el-table>
    <div class="u-page-wrapper">
      <el-pagination
        @current-change="handleCurrentChange"
        :page-size="20"
        layout="total, prev, pager, next, jumper"
        :total="total">
      </el-pagination>
    </div>
      <el-dialog
        :title="isAdd?'添加客户确认人':'编辑客户确认人'"
        :visible.sync="showAddForm"
        :before-close="handleCancel"
        width="40%"
        center>
        <el-form ref="ruleForm" label-width="120px" :model="ruleForm" :rules="rules">
          <el-form-item label="姓名:" prop="name" >
            <el-input v-model="ruleForm.name" style="width: 80%" :disabled="!isAdd"></el-input>
          </el-form-item>
          <el-form-item label="身份证号:" prop="idCard" >
            <el-input v-model="ruleForm.idCard" style="width:  80%" :disabled="!isAdd"></el-input>
          </el-form-item>
          <el-form-item label="角色:" prop="roleType">
             <el-radio-group v-model="ruleForm.roleType">
              <el-radio :label="1">日常产量确认人</el-radio>
              <el-radio :label="2">管理者</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="数据查看权限:" v-if="ruleForm.roleType===2" prop="seeConfirmList" >
            <el-checkbox-group v-model="ruleForm.seeConfirmList" v-if="allConfirmList.length>0" @change="handleConfirmListChange">
              <el-checkbox :key="key" :label="it" v-for="it,key in allConfirmList">{{it.nameAlias}}</el-checkbox>
            </el-checkbox-group>
            <div v-else style="line-height:40px;height:40px;">请先设置确认人 </div>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="handleCancel">取 消</el-button>
          <el-button type="primary" @click="handleSubmit" :loading="subLoading">确 认</el-button>
        </span>
    </el-dialog>
    <el-dialog
        :title="taskTitle"
        :visible.sync="showTask"
        width="30%"
        center>
        <el-table
        height="500px"
        :data="taskList"
         >
         <el-table-column
          prop="id"
          label="序号"
           align="center"
          >
           </el-table-column>
          <el-table-column
          prop="name"
          label="班务名称"
           align="center"
          >
        </el-table-column>
        </el-table>
        <span slot="footer" class="dialog-footer-look">
          <el-button type="primary" @click="showTask=false" :loading="subLoading">确 认</el-button>
        </span>
    </el-dialog>
    <el-dialog
        :title="personTitle"
        :visible.sync="showPerson"
        width="30%"
        height="500px"
        center>
        <el-table
        :data="personList"
         >
         <el-table-column
          prop="id"
          label="序号"
           align="center"
          >
           </el-table-column>
          <el-table-column
          prop="name"
          label="人员姓名"
           align="center"
          >
        </el-table-column>
        </el-table>
         <span slot="footer" class="dialog-footer-look">
          <el-button type="primary" @click="showPerson=false" :loading="subLoading">确 认</el-button>
        </span>
    </el-dialog>
  </div>
</template>

<script>
const idCardTest = /^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$|^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}([0-9]|X)$/;
const roleTypeConfirm = 1;
const roleTypeManager = 2;
export default {
  name: "customerIdentifyList",
  components: {
  },
  data() {
    let checkIdCard = (rule,value,callback)=>{
      if(!idCardTest.test(value)){
        callback(new Error('请输入正确的身份证号'));
      }
      callback();
    }
    return {
     taskTitle:'',
     personTitle:'',
     total:0,
     status:'on',
     roleTypeParent:"",
     keyword:'',
     showAddForm:false,
     loading:false,
     subLoading:false,
     showTask:false,
     showPerson:false,
     isAdd:true,
     ruleForm: {
      name:'',
      idCard:'',
      roleType:1,
      seeConfirmList:[],
      },
     rules:{
       name:[{
              required: true,message: '姓名不能为空', trigger: 'blur'
          }],
       idCard:[{
              required: true,message: '身份证号不能为空', trigger: 'blur'
          },{
            validator: checkIdCard, trigger: 'blur'
          }],
        roleType:[{
              required: true,message: '角色不能为空', trigger: 'blur'
          }],
        seeConfirmList:[{
           required: true,message: '数据查看权限不能为空', trigger: 'blur'
        }]
     },
     allConfirmList:[
     ],
     tableData:[],
     nowSchedulingList:[],
     nowConfirmPersonList:[],
     taskList:[],
     personList:[],
     id:null
    }
  },
  mounted() {
    this.handleGetAllConfirm();
    const {pageNum,status,roleTypeParent,keyword} = this;
    this.handleGetTableData({pageNum,status,roleType:roleTypeParent,keyword});
  },
  methods: {
    handleConfirmListChange(val){
    },
    handleCancel(){
      this.showAddForm = false;
      this.handleClearForm();
      this.handleGetAllConfirm();
      this.$refs['ruleForm'].clearValidate();
    },
    handleGetTableData({pageNum,status,roleType,keyword}){
      this.loading = true;
      this.$api.getConfirmList({
        pageNum,
        pageSize:20,
        status:status==='on'?1:2,
        roleType,
        name:keyword
        }).then(res=>{
          this.loading = false;
          this.tableData = res.data.data.list;
          this.total= res.data.data.total;
        })
    },
    handleStatusChange(val){
      this.status = val.name||val;
      const {pageNum,status,roleTypeParent,keyword} = this;
      this.handleGetTableData({pageNum,status,roleType:roleTypeParent,keyword});
    },
    handleRoleTypeParentChange(val){
      this.roleTypeParent = val;
      const {pageNum,status,roleTypeParent,keyword} = this;
      this.handleGetTableData({pageNum,status,roleType:roleTypeParent,keyword});
    },
    handleCurrentChange(val){
      this.pageNum = val;
      const {pageNum,status,roleTypeParent,keyword} = this;
      this.handleGetTableData({pageNum,status,roleType:roleTypeParent,keyword});
    },
    hanldeGetKeywordMessage(val){
      const {pageNum,status,roleTypeParent,keyword} = this;
      this.handleGetTableData({pageNum,status,roleType:roleTypeParent,keyword});
    },
    handleEdit(row){
      this.allConfirmList = this.allConfirmList.filter(it=>it.idCard!==row.idCard);
      if(row){
        this.ruleForm={
        ...this.ruleForm,
        name:row.name,
        idCard:row.idCard,
        roleType:row.roleType
        }
       this.isAdd = false;
       this.id=row.id;
       if(row.seeConfirmIds){
        this.handleConfirmMessage(row);
       }
      }else {
       this.isAdd = true;
      }
      this.showAddForm = true;
    },
    handlePostEdit(val){
      this.subLoading = true;
      this.$api.postIdentifyEdit({
          ...val
        }).then(res=>{
          this.subLoading = false;
          if(res.data.respCode===0){
            this.$message({
              message: '编辑确认人成功',
              type: 'success'
            });
            const {pageNum,status,roleTypeParent,keyword} = this;
            this.handleGetTableData({pageNum,status,roleType:roleTypeParent,keyword});
            this.handleClearForm();
            this.handleGetAllConfirm();
          };
          this.showAddForm = false;
        }).catch(()=>{
          this.subLoading = false;
        });
    },
    handlePostAdd(val){
      let data = {
        ...val,
      };
      delete data.id;
      this.subLoading = true;
      this.$api.postIdentifyAdd({
          ...val
        }).then(res=>{
          this.subLoading = false;
          if(res.data.respCode===0){
            this.$message({
              message: '添加确认人成功',
              type: 'success'
            });
            const {pageNum,status,roleTypeParent,keyword} = this;
            this.handleGetTableData({pageNum,status,roleType:roleTypeParent,keyword});
            this.handleClearForm();
          };
          this.showAddForm = false;
          this.handleGetAllConfirm();

        }).catch(()=>{
          this.subLoading = false;
        });
    },
    
    handleGetAllConfirm(){//获取所有确认人
      this.$api.getAllConfirm().then(res=>{
        this.allConfirmList = res.data||[];
      });
    },
    handleSubmit(){
      this.$refs['ruleForm'].validate(valid=>{
        if(valid){
          let newData = {};
          //是否确认人
          if(this.ruleForm.roleType === roleTypeConfirm){//确认人
            newData = {
              name:this.ruleForm.name,
              idCard:this.ruleForm.idCard,
              roleType:this.ruleForm.roleType,
              id:this.id
            };
          }else {//管理人
            newData = {
              name:this.ruleForm.name,
              idCard:this.ruleForm.idCard,
              roleType:this.ruleForm.roleType,
              seeConfirmIds:this.ruleForm.seeConfirmList.map(it=>it.id).join(','),
              seeConfirmIdCards:this.ruleForm.seeConfirmList.map(it=>it.idCard).join(','),
              id:this.id
            };
          };
          //是否添加
          if(this.isAdd){//添加
            this.handlePostAdd(newData);
          }else {//编辑
            this.handlePostEdit(newData);
          }
        }
      })
    },
    handleConfirmMessage(row){//获取编辑确认人信息
      this.nowSchedulingList = row.seeConfirmIds.split(',').map(it=>Number(it));
      this.ruleForm.seeConfirmList = this.allConfirmList.map(it=>{
        if( this.nowSchedulingList.some(z=>z===it.id)){
          return it;
        }
      }).filter(it=>!!it);
    },
    handleGetTaskCount(row){
      this.showTask = true;
      this.taskTitle = `${row.name}负责的班务`
      this.$api.getTaskCount({id:row.id}).then(res=>{
        if(res.respCode===0){
          this.taskList=res.data.map((it,i)=>{return {name:it,id:i+1}});
        }
      });
    },
    handleGetPersonCount(row){
      this.showPerson = true;
      this.personTitle = `${row.name}的数据查看权限`
      this.$api.getPersonCount({id:row.id}).then(res=>{
        if(res.respCode===0){
          this.personList=res.data.map((it,i)=>{return {name:it,id:i+1}});
        }
      });
    },
    handleStop(row){
      setTimeout(()=>{
        this.$confirm(`确认停用${row.nameAlias}吗？`, '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.$api.setStopAndStart({id:row.id,status:2}).then(res=>{
              if(res.respCode===0){
                this.$message({
                  message:'停用成功',
                  type:'success'
                });
                const {pageNum,status,roleTypeParent,keyword} = this;
                this.tableData = [];//强行解决停用启用后按钮问题
                this.handleGetTableData({pageNum,status,roleType:roleTypeParent,keyword});
              }
            });
          }).catch(() => {
          });
      })
      
    },
    handleStart(row){
      this.$confirm(`确认启用${row.nameAlias}吗？`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
           this.$api.setStopAndStart({id:row.id,status:1}).then(res=>{
             if(res.respCode===0){
                this.$message({
                message:'启用成功',
                type:'success'
              });
              this.tableData = [];//强行解决停用启用后按钮问题
              const {pageNum,status,roleTypeParent,keyword} = this;
              this.handleGetTableData({pageNum,status,roleType:roleTypeParent,keyword});
             }
             
          });
        }).catch(() => {
        });
    },
    handleClearForm(){
      this.ruleForm = {
        name:'',
        idCard:'',
        roleType:1,
        seeConfirmList:[]
      };
      this.id = null;
    }
  }
}
</script>

<style scoped lang="scss">
  .role-wrapper {
    display:flex;
    height: 26px;
    margin-bottom: 10px;
    .role-key {
      font-size: 14px;
      line-height:32px;
      color: #606266;
      margin-right: 58px;
    }
  }
  .keyword-wrapper {
     display:flex;
     height: 26px;
     margin-bottom: 20px;
     .keyword-key {
      font-size: 14px;
      line-height: 32px;
      color: #606266;
      margin-right: 10px;
     }
  }
  .u-person-count {
    color: #0000FF;
    cursor: pointer;
  }
  .u-task-count {
    color: #0000FF;
    cursor: pointer;
  }
  .u-condition-wrapper {
    width: 100%;
    padding: 20px;
    height: 134px;
    background-color: #fff;
  }
  .u-page-wrapper {
    width: 100%;
    background-color: #fff;
    text-align: center;
    padding: 30px 0;
  }
  .add-wrapper {
    width: 100%;
    background-color: #fff;
    padding: 10px 20px;
    height: 56px;
    margin-top: 20px;
  }
  .dialog-footer-look {
    display: flex;
    justify-content: flex-end;
  }
  .role-value {
    .el-radio-group {
      height: 23px;
    }
  }
</style>
