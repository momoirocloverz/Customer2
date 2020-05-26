<template>
  <div class="back-white scheduleListConLimit">
    <div class="filter-condition">
      <el-form ref="form" :model="form" label-width="100px" labelPosition="left">
        <div class="search-zone">
          <el-form-item class="formSearchMargin ">
            <el-input placeholder="根据下拉框选项输入关键字搜索" v-model="form.keyWords" size="mini" class="input-with-select select-input">
              <el-select v-model="form.selectType" slot="append" placeholder="请选择">
                <el-option label="排班名称" value="1"></el-option>                  
                  <el-option label="班务经理" value="2"></el-option>
              </el-select>
            </el-input>
            <el-button type="primary" class="searchBtn" @click="handleSearch">搜索</el-button>
            <el-button class="comb-btn" size="mini" type="text" @click="handleCombShow">高级筛选<i class="el-icon-right el-icon-d-arrow-right" :class="isShowComb ? 'el-icon-d-arrow-right-down' : 'el-icon-d-arrow-right-right'"></i></el-button>
          </el-form-item>
        </div>
        <!--选择条件的单选按钮-->
        <div v-show="isShowComb" class="combine-zone">
          <el-form-item label="排班状态：" class="formSearchMargin formSearchMarginTop">
            <el-radio-group class="radio-search" v-model="form.status" @change="commonChange">
              <el-radio label="">不限</el-radio>
              <el-radio label="1">待确认</el-radio>
              <el-radio label="2">待结算</el-radio>
              <el-radio label="3">已结束</el-radio>
            </el-radio-group>
          </el-form-item>
            <el-form-item label="排班时间：" class="formSearchMargin formSearchMarginTop">
            <el-radio-group class="radio-search" v-model="form.time" @change="dateChange(form.time)">
              <el-radio label="">不限</el-radio>
              <el-radio label="1">今日</el-radio>
              <el-radio label="2">昨日</el-radio>
              <el-radio label="3">自定义</el-radio>
            </el-radio-group>
          </el-form-item>
            <el-form-item label="自定义：" class="formSearchMargin" v-if="form.time == '3'">
                <el-date-picker class="" size="mini" v-model="form.startDate" type="date" value-format="yyyy-MM-dd" placeholder="选择开始时间">
                </el-date-picker>
                --
                <el-date-picker class="margin_left10" size="mini" v-model="form.endDate" type="date" value-format="yyyy-MM-dd" placeholder="选择结束时间" @change="endDateChange('form','endDate')">
                </el-date-picker>
                <el-button type="primary"  class="datesearchBtn" @click="btn_true">确定</el-button>
            </el-form-item>
            <el-form-item label="审核状态：" class="formSearchMargin formSearchMarginTop">
            <el-radio-group class="radio-search" v-model="form.status2" @change="commonChange">
              <el-radio label="">不限</el-radio>
              <el-radio label="1">无需审核</el-radio>
              <el-radio label="2">待审核</el-radio>
            </el-radio-group>
          </el-form-item>
        </div>
      </el-form>
    </div>
    <div class="table-box back-white">
      <el-table :data="tableData" empty-text="暂无相关排班信息">
        <el-table-column type="expand">
          <template v-slot="scope">
            <div class="table-style">
              <div class="table-tr">
                <p class="table-td"><span class="td-title">工作地点：</span><span class="is-link" @click="getPositon(scope.row)">
                    <el-tooltip :content="scope.row.workingPlace" placement="top">
                      <span>{{scope.row.workingPlace && scope.row.workingPlace.substring(0,10)}}...</span>
                    </el-tooltip>
                  </span></p>
                <!--<p class="table-td"><span class="td-title td-title-differ">非空挂人数：</span>{{scope.row.normalNumber}}人</p>-->
                <p class="table-td"><span class="td-title">最早上班时间：</span>{{scope.row.workStartTime}}</p>
              </div>
              <div class="table-tr">
                <p class="table-td"><span class="td-title">核定人数：{{scope.row.authorizedNumber}}人</span></p>
                <!--<p class="table-td"><span class="td-title td-title-differ">空挂人数：</span>{{scope.row.emptyNumber}}人</p>-->
                <p class="table-td"><span class="td-title">最晚下班时间：</span>{{endTimeFormatter(scope.row, scope.row.workEndTime)}}</p>
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="排班名称" prop="schedulingName" show-overflow-tooltip align="center" min-width="100"></el-table-column>
        <el-table-column label="所属班务" prop="taskName" show-overflow-tooltip align="center" min-width="100">
          <template v-slot="scope">
            <span>{{scope.row.taskName}}</span>
            <!--<span class="is-link" @click="RouteToTask(scope.row)">{{scope.row.taskName}}</span>-->
          </template>
        </el-table-column>
        <el-table-column label="班务经理" prop="managerNameAlias" show-overflow-tooltip align="center" min-width="100">
          <template v-slot="scope">
            <span>{{scope.row.managerNameAlias}}</span>
            <!--<span class="is-link" @click="RouteToPm(scope.row)">{{scope.row.managerNameAlias}}</span>-->
          </template>
        </el-table-column>
        <el-table-column label="班务工作总量" prop="total" :formatter="totalFormatter" show-overflow-tooltip align="center" min-width="100"></el-table-column>
        <el-table-column label="排班状态" prop="schedulingStatus" show-overflow-tooltip align="center" min-width="100"></el-table-column>
        <el-table-column label="操作" align="center" min-width="150">
          <template v-slot="scope">
            <el-button type="text" class="btn-icon btn-icon-view" size="mini" @click="routeToDetail(scope.row)">查看</el-button>
            <el-button type="text" class="btn-icon btn-icon-view" size="mini" @click="checkDetail(scope.row)" v-if="setShowOrNot(scope.row)">审核</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination-container" v-if="pageCount!=0">
        <el-pagination class="pagebox" layout="total , prev, pager, next, jumper" :total="total" :current-page.sync="currentPage" @current-change="handleCurrentChange" :page-size="pageSize">
        </el-pagination>
      </div>
    </div>

    <el-dialog title="" :visible.sync="DeleteVisible" width="540px" center>
      <div class="dialog-head" style="margin-top: 40px">
        <span>确认删除{{this.selectItem.taskName}}吗？</span>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button size="medium" type="primary" @click="handleDelete">确 定</el-button>
        <el-button size="medium" @click="DeleteVisible = false">取 消</el-button>
      </span>
    </el-dialog>

    <el-dialog title="" :visible.sync="AssignVisible" width="540px" center>
      <div class="dialog-head">
        <span>指派</span>
      </div>
      <el-form ref="form" :model="form" label-width="100px" label-position="left" :rules="rules" style="margin-top: 30px;padding: 40px;">
        <el-form-item label="班务经理：" prop="managerUserId">
          <el-select v-model="form.managerUserId" class="radius-input" clearable style="width: 100%;" placeholder="请选择">
            <el-option v-for="item in PmList" :key="item.userId" :label="item.name" :value="item.userId">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button size="medium" type="primary" @click="AssignTask">确 定</el-button>
        <el-button size="medium" @click="AssignVisible = false">取 消</el-button>
      </span>
    </el-dialog>

    <el-dialog :visible.sync="mapVisible" width="540px">
      <baidu-map :zoom="zoom" :center="center" :scroll-wheel-zoom="true" @ready="handleMap" style="height:400px;width:100%;">
        <bm-navigation anchor="BMAP_ANCHOR_TOP_RIGHT"></bm-navigation>
        <bm-marker :position="center" animation="BMAP_ANIMATION_BOUNCE">
        </bm-marker>
      </baidu-map>
    </el-dialog>

    <el-dialog title="提示" :visible.sync="equalVisible" class="centerDialog" width="540px" center>
      <div class="dialog-head" style="margin-top: 10px">
        <span>当前零工报酬与昨日排班审核通过的零工报酬相同</span>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button size="small" type="primary" @click="passImmediate">直接审核通过</el-button>
        <el-button size="small" @click="specialJump">查看零工报酬</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import util from '../../../common/util'
export default {
  name: "ScheduleList",
  data() {
    return {
        equalVisible:false,
      isShowComb: false,
      doClear: true,
      zoom: 15,
      center: {},
      selectPosition: {},
      mapVisible: false,
      rules: {
        managerUserId: [
          { required: true, message: '班务经理不能为空', trigger: 'blur' },
        ],
      },
      PmList: [],
      selectItem: {},
      DeleteVisible: false,
      AssignVisible: false,
      currentPage: 1,
      pageSize: 20,
      pageCount: 1,
      total: 0,
      settlementTypeList: '',
      belongtoList: '',
      input5: '',
      select: '1',
      tableData: [],
      form: {
          endDate:'',
          startDate:'',
            time:'',
            status2:'',
        selectType: '1',
        status: '',
        managerId: '',
        belongtoItem: '',
        settlementType: "",
        keyWord: ''
      },
      mineItem: {},
      price: {},
      content: '',
        checkid:'',
        rowBridge:{},
        timeout:null,
        dateValidate:false,
    }
  },
  mounted() {
      this.getPmList();
      this.getList();
  },
    beforeDestroy(){
        this.timeout = null;
    },
  methods: {
      commonChange(){
          this.currentPage = 1
          this.getList();
      },
      dateChange(val){
                if( val == '3' ){
                    this.form.endDate = '';
                    this.form.startDate = '';
                }else{
                    this.currentPage = 1
                    this.getList();
                }
            },
      endDateChange(form,item){
              let start = this[form].startDate;
              let end = this[form][item];
              if( start&&end ){
                  let startStamp = this.Moment( start ).unix();
                  let endStamp = this.Moment( end ).unix();
                  if( endStamp>=startStamp ){
                      this.dateValidate = true;
                  }else{
                      this.$message.error('结束日期不能早于开始日期!');
                      this.dateValidate = false;
                  }
              }else{
                  if( !start ){
                      this.dateValidate = false;
                      this.$message.error('开始日期不能为空！');
                  }
                  if( !end ){
                      this.dateValidate = false;
                      this.$message.error('结束日期不能为空！');
                  }
                  if( (!end)&&(!start)   ){
                      this.dateValidate = false;
                      this.$message.error('开始日期和结束日期不能为空！');
                  }
              }
          },
      setShowOrNot(row){
          if( row.shouldPriceCheck == '1' ){
              return true;
          }else if( row.shouldPriceCheck == '2' ){
              return false;
          }
      },
      passImmediate(){
          let data = {
              schedulingId:this.checkid,
          };
          this.$api.priceDiffCheck(data).then(res=>{
              let { respCode,data } = res;
              if( respCode === 0 ){
                  if( data ){
                      this.$message.error('该排班零工报酬已改变，与上一日排班审核通过的零工报酬不一致，请查看审核。');
                      this.normalJump(this.rowBridge);
                  }else{
                      let params = {
                            schedulingId: this.checkid,
                        }
                        this.$api.schedulingCheckAction(params).then(res => {
                            let { data:layer1 } = res;
                            let { respCode } = layer1;
                            if( respCode === 0 ){
                                this.$message({
                                  message: '审核成功',
                                  type: 'success'
                                });
                                this.equalVisible = false;
                                this.currentPage = 1
                                this.getList();
                            }
                        }).catch(err=>{
                            console.log('err',err);
                        })
                  }
              }
          }).catch(err=>{
              console.log('err',err);
          })
          },
        specialJump(){
            this.equalVisible = false;
            this.normalJump(this.rowBridge);
        },
      normalJump(row){
          this.$router.push({
              name: "schedulingDetail",
              query: {
                  id: row.id,
                  hasPhoto: row.hasPhoto,
                  name: row.schedulingName,
                  activeName:'third',
              }
          });   
      },
      commonJump(row){
          const { href } = this.$router.resolve({
                name: "schedulingDetail",
                query: {
                    id: row.id,
                    hasPhoto: row.hasPhoto,
                    name: row.schedulingName,
                    activeName:'third',
                }
              });
              window.open(href, "_blank");
      },
      checkDetail(row){
          this.rowBridge = row;
          let data = {
              schedulingId:row.id,
          };
          this.$api.priceDiffCheck(data).then(res=>{
              let { respCode,data } = res;
              if( respCode === 0 ){
                  if( data ){
                      this.normalJump(row);
                  }else{
                      this.checkid = row.id;
                      this.equalVisible = true;
                  }
              }
          }).catch(err=>{
              console.log('err',err);
          })
      },
      btn_true(){
          this.endDateChange('form','endDate');
          if( this.dateValidate ){
              this.currentPage = 1
              this.getList();
          }
      },
    handleCombShow() {
      this.isShowComb = !this.isShowComb
    },
    endTimeFormatter(row, cellValue) {
      let endWorkType = ''
      if (Number(row.endWorkType) === 1) {
        endWorkType = '当日'
      } else if (Number(row.endWorkType) === 2) {
        endWorkType = '次日'
      }
      return `${endWorkType}${cellValue}`
    },
    totalFormatter(row, cloumn, cellValue, index) {
      let result = ''
      if (cellValue) {
        result = `${util.formatPieceSize(cellValue)}`
      } else {
        result = '无'
      }
      return result
    },
    handleSearch() {
      this.currentPage = 1
      this.getList()
    },
    getPositon(item) {
      this.select = {
        lng: item.longitude,
        lat: item.latitude,
      }
      this.center = this.select
      this.mapVisible = true
    },
    handleMap({ BMap, map }) {
      console.log('BMap init complete')
    },
    routeToDetail(row) {
      const { href } = this.$router.resolve({
        name: "schedulingDetail",
        query: {
          id: row.id,
          hasPhoto: row.hasPhoto,
          name: row.schedulingName,
        }
      });
      window.open(href, "_blank");
    },
    RouteToTask(row) {
      const { href } = this.$router.resolve({
        name: "taskTrackDetail",
        query: {
          id: row.taskId,
        }
      });
      window.open(href, "_blank");
    },
    RouteToPm(row) {
      const params = {
        id: row.managerId,
      }
      this.$api.detailPm(params).then(response => {
        if (response.respCode == 0) {
          const { href } = this.$router.resolve({
            name: "projectManagerdetail",
            params: {
              id: row.managerId,
              userId: response.data.userId,
            }
          });
          window.open(href, "_blank");
        }
      }).catch(error => {
          console.log(error);
        });
    },
      getPmList() {
          this.$api.schePmList().then(response => {
              if (response.data.respCode == 0) {
                  this.PmList = response.data.data;
              }
          }).catch(error => {
              console.log(error);
          });
      },
    handleDelete() {
        const params = {
            taskId: this.selectItem.id,
        }
        this.$api.TaskDelete(params).then((response) => {
            if (response.respCode == 0) {
                this.$message.success('删除成功')
                this.DeleteVisible = false;
                this.getList()
            }
        }).catch((error) => {
            console.log(error);
        });
    },
    AssignTask() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          const params = {
            taskId: this.selectItem.id,
            managerUserId: this.form.managerUserId,
          }
          this.$api.TaskAssign(params).then((response) => {
            if (response.data.respCode == 0) {
              this.$message.success('指派成功')
              this.AssignVisible = false;
              this.getList()
            }
          }).catch((error) => {
            console.log(error);
          });
        }
      });
    },
    getList() {
      const params = {
          pageNum: this.currentPage,
          pageSize: this.pageSize,
          status: this.form.status,
          showOutsourcing:false,
          priceCheckStatus:this.form.status2,
      }
      if( this.form.selectType == '1' ){
          params.schedulingName = this.form.keyWords;
      }else if( this.form.selectType == '2' ){
          params.managerNameAlias = this.form.keyWords;
      }
      let flag = this.form.time;
        switch( flag ){
            case '':
                this.form.endDate = '';
                this.form.startDate = '';
                break; 
            case '1':
                this.form.endDate = this.Moment( Date.now() ).format('YYYY-MM-DD');
                this.form.startDate = this.Moment( Date.now() ).format('YYYY-MM-DD');
                break;
            case '2':
                this.form.endDate = this.Moment( Date.now() - 24*60*60*1000 ).format('YYYY-MM-DD');
                this.form.startDate = this.Moment( Date.now() - 24*60*60*1000 ).format('YYYY-MM-DD');
                break;
        }     
        params.startDate = this.form.startDate;
        params.endDate = this.form.endDate;
      this.$api.scheduleList(params).then((response) => {
        const {
          data: {
            list,
            pages,
            total,
            pageNum,
          },
        } = response.data;
        if (response.data.respCode == 0) {
          this.tableData = list
          this.pageCount = pages
          this.currentPage = pageNum
          this.total = total
        }

      }).catch((error) => {
        console.log(error);
      });
    },
    handleCurrentChange(val) {
      this.currentPage = val;
      this.getList();
    },
  }
}
</script>
<style lang="scss" scoped>
    .scheduleListConLimit {
        .searchBtn {
            vertical-align: 2px;
        }
    }
</style>
<style lang="scss">
    .scheduleListConLimit {
       .centerDialog {
            .el-dialog {
                height: 190px !important;
                position: absolute;
                left: 0;
                right: 0;
                bottom: 0;
                top: 0;
                margin: auto !important;
            }
        }
        .editPriceCon {
            .el-dialog {
                margin: auto !important;
                left: 0;
                right: 0;
                bottom: 0;
                top: 0;
                position: absolute;
                height: 650px !important;
            }
            .el-dialog__body {
                padding-top: 0;
                padding-bottom: 0;
            }
        }
    }
</style>