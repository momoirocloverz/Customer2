<template>
  <div class="back-white dispatchTaskCon">
          <el-form ref="form" :model="form" class="searchThisForm" label-width="100px" labelPosition="left">
          <div class="search-zone">
                   <el-input class="searchMaster" clearable placeholder="输入任务名称搜索" prefix-icon="el-icon-search"   v-model="form.taskName" ></el-input>
                   <div  class="charge-btn" @click="searchNow" >搜索</div>
                    <el-button class="comb-btn" size="mini" type="text" @click="handleCombShow">高级筛选<i class="el-icon-right el-icon-d-arrow-right" :class="isShowComb ? 'el-icon-d-arrow-right-down' : 'el-icon-d-arrow-right-right'"></i></el-button>
                </div> 
          <transition name="router-fade" mode="out-in">
          <div  class="combine-zone" v-if="isShowComb">
              <el-form-item label="状态：" class=" resetFormItem ">
          <el-radio-group class="radio-search sameHeight" v-model="form.taskStatus">
            <el-radio label="">不限</el-radio>
            <el-radio label="1">待领取</el-radio>
            <el-radio label="2">领取完毕</el-radio>
            <el-radio label="3">已关闭</el-radio>
          </el-radio-group>
        </el-form-item>              
        <el-form-item label="任务所属：" class="formSearchMargin wrapThis">
          <el-radio-group class="radio-search flexWrap" v-model="form.belongtoItem">
            <el-radio label="">不限</el-radio>
            <el-radio :label="item" v-for="(item,index) in belongtoList" :key="index">{{item.belongToName}}</el-radio>
          </el-radio-group>
        </el-form-item>              
        <el-form-item label="结算方式：" class="formSearchMargin spSet">
          <el-radio-group class="radio-search sameHeight" v-model="form.settlementType">
            <el-radio label="">不限</el-radio>
            <el-radio label='2'>月结</el-radio>
            <el-radio label="4">周结</el-radio>
            <el-radio label="1">日结</el-radio>
          </el-radio-group>
        </el-form-item>
            </div>
            </transition>
      </el-form>

    <div class="back-white btn-div flexable">
      <el-button class="primary-btn setWidthBtn" size="mini" @click="addNew">添加任务</el-button>
    </div>

    <div class="table-box back-white">
      <el-table :data="tableData" empty-text="暂无相关信息">
        <el-table-column label="任务名称" prop="taskName" show-overflow-tooltip align="center" min-width="130"></el-table-column>
        <el-table-column label="任务所属" prop="belongToName" show-overflow-tooltip align="center" min-width="130"></el-table-column>
        <el-table-column label="开始时间" prop="startTime" show-overflow-tooltip :formatter="dateFormatter" align="center" min-width="130"></el-table-column>
        <el-table-column label="结束时间" prop="endTime" show-overflow-tooltip :formatter="dateFormatter" align="center" min-width="130"></el-table-column>
        <el-table-column label="结算方式" prop="settlementType" :formatter="settlementFormatter"   show-overflow-tooltip align="center" min-width="80"></el-table-column>
        <el-table-column label="计价方式" prop="price" :formatter="handlePricingManager"   show-overflow-tooltip align="center" min-width="80"></el-table-column>
        <el-table-column label="领取状态" prop="receiveStatus" show-overflow-tooltip :formatter="statusFormatter" align="center" min-width="80"></el-table-column>
        <el-table-column label="操作" show-overflow-tooltip align="center" min-width="190">
          <template v-slot="scope">
            <el-button type="text" class="btn-icon btn-icon-view" size="mini" @click="routeToDetail(scope.row)">查看</el-button>
            <el-button type="text" class="btn-icon btn-icon-edit" size="mini" @click="goToEdit(scope.row)" v-if="scope.row.receiveStatus == 1">编辑</el-button>
              
<!--              <el-button type="text" class="btn-icon btn-icon-edit" size="mini" @click="goToEdit(scope.row)" >编辑</el-button>-->
              
            <el-button type="text" class="btn-icon btn-icon-delete" size="mini" @click="handleDeleteVisible(scope.row)" v-if=" scope.row.receiveStatus==3 || scope.row.receiveStatus==1">删除</el-button>            
          </template>
        </el-table-column>
      </el-table>

      <div class="pagination-container" v-if="total!=0">
        <el-pagination class="pagebox" layout="total , prev, pager, next, jumper" :total="total" @current-change="handleCurrentChange" :current-page="currentPage" :page-size="pageSize">
        </el-pagination>
      </div>
    </div>

    <el-dialog :visible.sync="DeleteVisible" width="450px" class="base-dialog spMeSet">
          <div class="dialog-head" style="">
        <p class="base-dialog-title">确认删除<strong class="dialog-strong">{{this.selectItem.taskName}}</strong>吗？</p>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button size="medium" type="primary" @click="handleDelete">确 定</el-button>
        <el-button size="medium" @click="DeleteVisible = false">取 消</el-button>
      </span>
    </el-dialog>

    <add-task v-if="addTaskVisible" :taskId="taskId" :comeFrom="setSource" :addOrEditStatus="addOrEditStatus" @closeDialog='handleCloseDialog' />

          <el-dialog title="选择" :visible.sync="alertDialShow" width="400px"
                   class="base-dialog centerDialogue">  
            <div class="classSelectCon">
                <div class="centerAlign marBot"><el-button @click="popToSelf"  class="btnNormal">发任务给自己</el-button></div>
                    
                <div class="centerAlign"><el-button  @click="popToOther"  class="btnNormal">发任务给其他经理人</el-button></div>
                    
<!--
                <div class="">
                    <el-button @click="popToOutSource"  class="btnNormal">发任务给平台外包商</el-button>
                </div>
-->
            </div>
        </el-dialog>



  </div>
</template>

<script>
import util from '@/common/util'
import AddTask from '../AddTaskdialog'
import moment from 'moment'
export default {
  name: "DispatchTask",
  components: { AddTask },
  data() {
    return {
        alertDialShow:false,
      selectItem: {},
      addTaskVisible: false,  // 显示添加任务的对话框
      DeleteVisible: false,
      currentPage: 1,
      pageSize: 20,
      total: 0,
        isShowComb:false,
      settlementTypeList: '',
      belongtoList: '',
      input5: '',
      select: '1',
      tableData: [],
      form: {
        taskStatus: '',
        taskName: '',
        belongtoItem: '',
        settlementType: '',
      },
      mineItem: {},
      price: {},
      addOrEditStatus: 1,
      taskId: 0,
        setSource:'1',
    }
  },
  mounted() {
    this.getsettlement();
    this.getbelongtoList();
    this.getList();
  },
  watch: {
    'form.taskStatus': function (val, oldval) {
      this.unitRequest();
    },
     'form.belongtoItem': function (val, oldval) {
       this.unitRequest();
     },
    'form.settlementType': function (val, oldval) {
      this.unitRequest();
    },
  },
  methods: {
      handlePricingManager(val){
        let type = '';
        let typeMap = {
          [1]:'计时',
          [2]:'固定计量',
          [3]:'阶梯计量',
          [4]:'组合计量',
          [5]:'计时+固定计量',
          [6]:'计时+阶梯计量',
          [7]:'计时+组合计量',
          [8]:'固定计价（日固定)'
        };
        return typeMap[JSON.parse(val.price).valuationType];
      },
      searchNow(){
          this.unitRequest();
      },
      unitRequest(){
          this.currentPage = 1;
          this.getList();
      },
      handleCombShow(){
            this.isShowComb = !this.isShowComb;
        },
    handleCloseDialog(reload) {
      this.addTaskVisible = false
      if (reload) {
          this.unitRequest();
      }
    },
    dateFormatter(row, column, cellValue, index) {
      let res = '永久';
        if( cellValue ){
             res =  moment(cellValue).format('YYYY-MM-DD HH:mm')
        }else{
            res = '永久';
        }
      return res;
    },
      settlementFormatter(row, column, cellValue, index){
             let status = '';
              switch (Number.parseInt(cellValue)) {
                case 1:
                  status = '日结'
                  break
                case 2:
                  status = '月结'
                  break
                case 4:
                  status = '周结'
                  break
                default:
                  status = '无'
                  break
              }
              return status
      },
    statusFormatter(row, column, cellValue, index) {
      let status = ''
      switch (Number.parseInt(cellValue)) {
        case 1:
          status = '待领取'
          break
        case 2:
          status = '领取完毕'
          break
        case 3:
          status = '已关闭'
          break
        default:
          status = ''
          break
      }
      return status
    },
    handleDeleteVisible(item) {
      this.selectItem = item;
      this.DeleteVisible = true;
    },
    handleDelete() {
      let params = {
        id: this.selectItem.assignmentInfoId,
      };
      this.$api.deleteTask(params).then((res) => {
          let { data:layer1 } = res;
          let { respCode } = layer1;
        if (respCode == 0) {
          this.$message.success('删除成功')
          this.DeleteVisible = false;            
            this.unitRequest();
        }
      }).catch((error) => {
        console.log(error);
      });

    },
    getList() {
      let params = {
          pageNum: this.currentPage,
          pageSize: this.pageSize,
          receiveStatus:this.form.taskStatus,
          belongTo:this.form.belongtoItem.belongTo,
          belongToType:this.form.belongtoItem.belongToType,
          settlementType:this.form.settlementType,
          taskName:this.form.taskName,
      };
      this.$api.publishTaskList(params).then(res=>{
          let { data:layer1 } = res;
          let { data,respCode } = layer1;
          if( respCode === 0 ){
              this.total = data.total;
              if(data.list){
                  this.tableData = data.list;
              }else{
                  this.tableData = [];
              }
          }
      }).catch(err=>{
          console.log('err',err);
      })
    },
    getsettlement() {
      this.$api.getDicList("settlementType", 0).then(response => {
          this.settlementTypeList = response.data.data;
        }).catch(error => {
          console.log(error);
        });
    },
    getbelongtoList() {
      this.$api.taskBelongSpToList().then(res => {
          this.belongtoList = res.data;
        }).catch(error => {
          console.log(error);
        });
    },
    routeToDetail(row) {
      const { href } = this.$router.resolve({
        name: "TaskDetail",
          query: {
          id: row.assignmentInfoId,
        }
      });
      window.open(href, "_blank");
    },
    handleCurrentChange(val) {
      this.currentPage = val;
      this.getList();
    },
      popToSelf(){
          this.setSource = '1';
          this.alertDialShow = false;
          this.addTaskVisible = true
          this.addOrEditStatus = 1
      },
      popToOther(){
          this.setSource = '2';
          this.alertDialShow = false;
          this.addTaskVisible = true
          this.addOrEditStatus = 1
      },
      popToOutSource(){
          this.setSource = '4';
          this.alertDialShow = false;
          this.addTaskVisible = true
          this.addOrEditStatus = 1
      },
    addNew() {
        this.popToOther()
        // this.alertDialShow = true;
    },
    goToEdit(row) {
      this.addTaskVisible = true
      this.taskId = row.assignmentInfoId      
      this.addOrEditStatus = 2
    }
  }
}
</script>
<style lang="scss" scoped>
    .dispatchTaskCon { 
        .centerAlign {
            text-align: center;
        }
        .marBot {
            margin-top: 20px;
            margin-bottom: 40px;
        }
        .btnNormal {
            color: #e84518;
            border-color: #f8c7ba;
            background-color: #fdece8;
            width: 170px;
        }
        .combine-zone {
            border-top: 1px solid #EAEDF4;
            padding-bottom: 11px;
        }
        .comb-btn {
            margin-bottom: 20px;
        }
        .resetFormItem {
            margin-top: 10px;
            margin-bottom: 0;
        }
         .charge-btn {
            font-size: 12px;
            background-color: #ffefea !important;
            border: 1px solid #f7beb2;
            border-radius: 4px;
            text-align: center;
            line-height: 34px;
            width: 100px;
            height: 34px;
            box-sizing: border-box;            
            color: #e9481c;            
            cursor: pointer;
            margin-bottom: 20px;
        }
        .formSearchMargin {
            margin-bottom: 0;
        }
        .searchThisForm {
            padding-left: 20px;
        }
         .search-zone {
            display:flex;
            align-items:center;
            justify-content:flex-start;
            flex-wrap: wrap;
            align-content: center;
            align-items: center;
            padding-top: 20px;
        }
        .searchMaster {  
            font-size: 12px;
            width: 520px;  
            margin-right: 20px;
            margin-bottom: 20px;
        }
        .flexWrap {
            display: flex;
            flex-direction: row;
            flex-wrap: wrap;
            justify-content: flex-start;
            align-content: center;
            align-items: center;
            min-height: 18px;
            height: auto;
            .el-radio {
                padding-bottom: 8px;
            }
        }
        .sameHeight {
            height: 18px;
        }
    }
</style>
<style lang="scss">
    .dispatchTaskCon {
        .spMeSet {
            .el-dialog__footer {
                padding-bottom: 10px !important;
            }
            .el-dialog__header {
                border-bottom: none;
            }
        }        
        .combine-zone {
            .el-radio__label {
                font-size: 12px;
                padding-left: 0;
                vertical-align: -1px;
            }
            .el-form-item__label {
                line-height: 18px;
                font-size: 12px;
            }
            .el-form-item__content {
                line-height: 18px;
            }
            .el-radio-group {
                min-height:inherit;
            }
        }  
        .wrapThis {
             .el-form-item__label {
                margin-top: 0;
            }
            .el-form-item__content {
                margin-top: 1px;
            }
            margin-top: 6px;
        }
        .spSet {
            .el-form-item__label {
                margin-top: 0;
            }
            .el-form-item__content {
                margin-top: 0;
            }
        }
        .el-table .cell {
            padding-left: 10px;
        }
        .searchMaster  {
            .el-input__inner {
                height: 34px;
            } 
            .el-icon-search {
                line-height: 28px;
            }
        }   
        .setWidthBtn {
            width: 100px;
        }
        .centerDialogue {
            .el-dialog {
                text-align: left;
                height: 300px;
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