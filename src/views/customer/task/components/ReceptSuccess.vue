<template>
  <div class="back-white receptSuccessCon">
    <div class="filter-condition">
      <el-form ref="form" :model="form" label-width="100px" labelPosition="left">
        <div class="search-zone">
          <el-form-item class="formSearchMargin ">
            <el-input placeholder="输入关键字搜索" prefix-icon="el-icon-search"  v-model="input5" size="mini" class="input-with-select select-input">
              <el-select v-model="select" slot="append" placeholder="请选择">
                <el-option label="任务名称" value="1"></el-option>
                <el-option label="接单人" value="2"></el-option>
              </el-select>
            </el-input>
            <el-button type="primary" class="searchBtn" @click="handleSearch">搜索</el-button>
            <el-button class="comb-btn removeHere" size="mini" type="text" @click="handleCombShow">高级筛选<i class="el-icon-right el-icon-d-arrow-right" :class="isShowComb ? 'el-icon-d-arrow-right-down' : 'el-icon-d-arrow-right-right'"></i></el-button>
          </el-form-item>
        </div>
        <!--选择条件的单选按钮-->
        <div v-show="isShowComb" class="combine-zone">
          <el-form-item label="状态：" class="formSearchMargin formSearchMarginTop">
            <el-radio-group class="radio-search sameHeight" v-model="form.taskStatus">
              <el-radio label="">不限</el-radio>
                <el-radio label="1">未开始</el-radio>
              <el-radio label="2">进行中</el-radio>
              <el-radio label="3">已结束</el-radio>
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
      </el-form>
    </div>
    <div class="table-box back-white">
      <el-table :data="tableData" empty-text="暂无相关信息" :row-class-name="getRowClassName">
        <el-table-column label="任务名称" prop="taskName" show-overflow-tooltip align="center" min-width="130"></el-table-column>
        <el-table-column label="任务所属" prop="belongToName" show-overflow-tooltip align="center" min-width="130"></el-table-column>
        <el-table-column label="接单人" show-overflow-tooltip align="center" min-width="130">
          <template slot-scope="scope">
            <span v-if="scope.row.isHook">{{scope.row.managerNameAlias}}</span>
            <span v-if="scope.row.isHook">挂靠: {{scope.row.receiverName}}</span>
            <span v-else>{{scope.row.receiverName}}</span>
            <!--<span class="">挂靠: {{scope.row.receiverName}}</span>-->
          </template>
        </el-table-column>
        <el-table-column label="开始时间" prop="startTime" :formatter="minDateFormatter" show-overflow-tooltip align="center" min-width="130"></el-table-column>
        <el-table-column label="结束时间" prop="endTime" :formatter="minDateFormatter" show-overflow-tooltip align="center" min-width="130"></el-table-column>
        <el-table-column label="结算方式" prop="settlementType" :formatter="settlementTypeFormatter"  show-overflow-tooltip align="center"></el-table-column>
         <el-table-column label="计价方式" prop="price" :formatter="handlePricingManager"  show-overflow-tooltip align="center"></el-table-column>
       <!-- <el-table-column label="工作地点" prop="workingPlace" show-overflow-tooltip align="center" min-width="130"></el-table-column>-->
        <el-table-column label="状态" prop="processStatus" :formatter="statusFormatter" show-overflow-tooltip align="center" min-width="100"></el-table-column>
        <el-table-column label="操作" align="center" min-width="160">
          <template v-slot="scope">
            <el-button type="text" class="btn-icon btn-icon-view" size="mini" @click="routeToDetail(scope.row)">查看</el-button>            
            <el-button type="text" class="btn-icon btn-icon-stop" size="mini" @click="handleStopVisible(scope.row)" v-if="scope.row.processStatus==2">停止</el-button>
          </template>
        </el-table-column>
      </el-table>

      <div class="pagination-container" v-if="total!=0">
        <el-pagination class="pagebox" :total="total" layout="total , prev, pager, next, jumper" @current-change="handleCurrentChange" :current-page="currentPage" :page-size="pageSize">
        </el-pagination>
      </div>
    </div>

    <el-dialog :visible.sync="StopVisible" width="540px" class="base-dialog spMeSet">
      <div class="dialog-head">
        <p class="base-dialog-title">确认停止<strong class="dialog-strong">{{selectItem.taskName}}</strong>任务吗？</p>
        <p class="base-dialog-tip">(停止后将无法再排班)</p>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button size="medium" type="primary" @click="handleStop">确 定</el-button>
        <el-button size="medium" @click="StopVisible = false">取 消</el-button>
      </span>
    </el-dialog>
    <el-dialog :visible.sync="payVisible" width="540px" center>
      <div class="dialog-head">
        <span>您的余额不足！</span>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button size="medium" type="primary" @click="handlepayVisible">确 定</el-button>
      </span>
    </el-dialog>
    <add-task v-if="addTaskVisible" :taskId="taskId" :addOrEditStatus="addOrEditStatus" @closeDialog='handleCloseDialog'></add-task>
  </div>
</template>
<script>
import AddTask from '../AddTaskdialog'
import moment from 'moment';
export default {
  name: "ReceptSuccess",
  components: { AddTask },
  data() {
    return {
      isShowComb: false,
      payVisible: false,
      selectItem: {},
      StopVisible: false,
      currentPage: 1,
      pageSize: 20,
      total: 0,
      addOrEditStatus: 2,
      settlementTypeList: '',
      belongtoList: '',
      input5: '',
      select: '1',
      tableData: [],
      form: {
        taskStatus: '',
        belongtoItem: '',
        settlementType: "",
      },
      mineItem: {},
      addTaskVisible: false,
      title: '编辑任务',
      addOrIdetStatus: 2,
      formDetail: {},
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
       //1.计时 2.固定计量 3.阶梯计量 4.组合计量 5.计时+固定计量 6.计时+阶梯计量 7.计时+组合计量 8.固定计价（日固定）
      },
    handleCombShow() {
      this.isShowComb = !this.isShowComb
    },
    getRowClassName({row, column, rowIndex, columnIndex}) {
      if (row.isHook) {
        return 'cell-hook'
      } else {
        return ''
      }
    },
    unitRequest(){
        this.currentPage = 1;
        this.getList();
    },  
    handleSearch() {
        this.unitRequest();
    },
    minDateFormatter(row, column, cellValue, index) {
        let res = '永久';
        if( cellValue ){
            res =  moment(cellValue).format('YYYY-MM-DD HH:mm')
        }else{
            res = '永久';
        }
      return res;
    },
      settlementTypeFormatter(row, column, cellValue, index){
           let status = ''
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
      if (cellValue == 1) {
        return '未开始'
      } else if (cellValue == 2) {
        return '进行中'
      } else if (cellValue == 3) {
        return '已结束'
      } else {
        return ''
      }
    },
    handlepayVisible() {
      this.payVisible = false
      this.$router.push({ name: 'accountList' })
    },
    handleCloseDialog(reload) {
      this.addTaskVisible = false
      if (reload) {
        this.getList()
      }
    },
    RouteToPm(row) {
//      const params = {
//        userId: row.receiveUserId,
//        type: row.receiveUserType == 1 ? 2 : 3,
//      }
//      this.$api.getPrimaryKey(params).then(response => {
//        console.log(response)
//        if (response.respCode == 0) {
//          this.pmId = response.data
//          const { href } = this.$router.resolve({
//            name: "projectManagerdetail",
//            params: {
//              id: this.pmId,
//              userId: row.receiveUserId,
//            }
//          });
//          window.open(href, "_blank");
//        }
//      }).catch(error => {
//          console.log(error);
//        });
//      console.log(row)

    },
    handleStopVisible(item) {
      this.selectItem = item;
      this.StopVisible = true;
    },
    handleStop() {
      const data = {
        id: this.selectItem.assignmentInfoId,
      }
      this.$api.stopTask(data).then(res=>{
          let { data:layer1 } = res;
          let { data,respCode } = layer1;
          if( respCode === 0 ){
              this.$message.success('操作成功')
              this.StopVisible = false;
              this.getList()
          }
      }).catch(err=>{
          console.log('err',err);
      })
    },
    getList() {  
        let filterSp = this.input5;
        let data = {
            pageNum: this.currentPage,
            pageSize: this.pageSize,
            processStatus:this.form.taskStatus,
            belongTo:this.form.belongtoItem.belongTo,
            belongToType:this.form.belongtoItem.belongToType,
            settlementType:this.form.settlementType,
            taskName:this.select == 1 ? filterSp : '',
            customerName:this.select == 2 ? filterSp : '',
        };
        this.$api.confirmTaskList(data).then(res=>{
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
    goToEdit(row) {
      this.addTaskVisible = true
      this.addOrIdetStatus = 2
      this.taskId = row.assignmentInfoId
    },
    closeAddTask() {
      this.addTaskVisible = false
    },
    handleCurrentChange(val) {
      this.currentPage = val;
      this.getList();
    },
    formatbindingStatus(row) {
      let val = row.bindingStatus
      if (val == 1) {
        return '服务中'
      } else if (val == 2) {
        return '待项目经理同意解绑'
      } else if (val == 3) {
        return '待客户同意解绑'
      } else if (val == 4) {
        return '已解绑'
      } else {
        return ''
      }
    },
    routeTowoker() {
      this.$router.push({ name: 'myworker' })
    },
    handleClose(done) {
      setTimeout(() => {
        this.getList()
        this.formDetail = {}
      }, 500)
      done()
    },
  }
};
</script>
<style lang="scss" scoped>
    .receptSuccessCon {
        .sameHeight {
            height: 18px;
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
    }
</style>
<style lang="scss">
    .receptSuccessCon {
        .searchBtn {
            vertical-align: 2px;
        }
        .spMeSet {
            .el-dialog__footer {
                padding-bottom: 10px !important;
            }
            .el-dialog__header {
                border-bottom: none;
            }
        }
        .filter-condition .comb-btn{
            position: initial;
        }
        .removeHere {
            margin-left: 0;
            vertical-align: 2px;
        }
        .combine-zone {
            .el-radio__label {
                font-size: 12px;
                padding-left: 0;
                vertical-align: -1px;
            }
            .el-form-item__label {
                line-height: 18px;
                margin-top: 12px;
                font-size: 12px;
            }
            .el-form-item__content {
                line-height: 18px;
                margin-top: 11px;
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
        .el-table .cell-hook td:nth-child(3) .cell {
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
        }
    }
</style>