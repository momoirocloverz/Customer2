<template>
    <div class="taketaskCon">
            <el-form ref="searchForm" :model="searchForm" label-width="100px" labelPosition="left" class="searchThisForm">   
                <div class="search-zone">
                   <el-input class="searchMaster" clearable placeholder="输入任务名称搜索" prefix-icon="el-icon-search"   v-model="searchForm.taskName" ></el-input>
                   <div  class="charge-btn" @click="searchNow" >搜索</div>
                    <el-button class="comb-btn" size="mini" type="text" @click="handleCombShow">高级筛选<i class="el-icon-right el-icon-d-arrow-right" :class="isShowComb ? 'el-icon-d-arrow-right-down' : 'el-icon-d-arrow-right-right'"></i></el-button>
                </div> 
                <transition name="router-fade" mode="out-in">
                    <div class="combine-zone" v-if="isShowComb">
<!--
                        <el-form-item label="发布人：" class="resetFormItem wrapFlex">
                          <el-radio-group class="radio-search setMinHeight" v-model="searchForm.publisher">
                            <el-radio label="">不限</el-radio>
                            <el-radio :label="item.id" v-for="(item,index) in belongtoList" :key="index">{{item.shortName}}</el-radio>
                          </el-radio-group>
                        </el-form-item>
-->
                        <el-form-item label="结算方式：" class="resetFormItem formSearchMargin">
                          <el-radio-group class="radio-search" v-model="searchForm.settlementType">
                            <el-radio label="">不限</el-radio>
                            <el-radio label='2'>月结</el-radio>
                            <el-radio label="4">周结</el-radio>
                            <el-radio label="1">日结</el-radio>
                          </el-radio-group>
                        </el-form-item>
                    </div>
                </transition>
            </el-form>
        <div class="table-box back-white">
            <el-table :data="tableData"  empty-text="暂无相关信息">
                <el-table-column label="任务名称" prop="taskName" show-overflow-tooltip min-width="130"></el-table-column>
<!--                <el-table-column label="发布人" prop="publisherName" show-overflow-tooltip min-width="130"></el-table-column>-->
                <el-table-column label="开始日期" prop="startTime" :formatter="timeFormatter" show-overflow-tooltip min-width="130"></el-table-column>
                <el-table-column label="结束日期" prop="endTime" :formatter="timeFormatter" show-overflow-tooltip min-width="130"></el-table-column>
                <el-table-column label="结算方式" prop="settlementType" :formatter="settlementTypeFormatter"  show-overflow-tooltip></el-table-column>
                <el-table-column label="工作地点" prop="workingPlace" show-overflow-tooltip min-width="130"></el-table-column>
                <el-table-column label="所需人数" prop="authorizedNumber" show-overflow-tooltip></el-table-column>
                <el-table-column label="任务单价" prop="price" :formatter="priceFormatter"  show-overflow-tooltip min-width="130"></el-table-column>
                <el-table-column label="操作" show-overflow-tooltip min-width="160">
                    <template v-slot="scope">
                        <div class="operateCon">
                            <!--<div class="pickCon" @click="pickThis(scope.row)">-->
                            <div class="pickCon" @click="saveUpdate(scope.row)">
                                <img :src="pickIcon">
                                <span>我要抢单</span>
                            </div>
                            <div class="viewCon" @click="routeToDetail(scope.row)">
                                <img :src="viewIcon">
                                <span>任务详情</span>
                            </div>
                        </div>
                    </template>
                </el-table-column>                
            </el-table>
        </div>
        <div class="pagination-container" v-if="total">
            <el-pagination class="pagebox" layout="total , prev, pager, next, jumper" :total="total" @current-change="handleCurrentChange" :current-page="currentPage" :page-size="pageSize">
            </el-pagination>
        </div>
        <el-dialog title=""  :visible.sync="dialogVisible" width="540px" class="resetDialog">
            <div class="middleText middleTextHead">抢单成功，等待发布人确认</div>
            <div class="middleText">您可在【抢单记录】查看领取情况。发布人确认同意后，您可在【班务管理-我的任务】页面开始任务.</div>        
            <span slot="footer" class="dialog-footer">
                <el-button class="resetBtnSp" @click="dialogVisible = false">知道了</el-button>
            </span>
        </el-dialog>

        <outstandingFees :show="outstanding" :cancel="outstandingCancel" :confirm="outstandingConfirm"></outstandingFees>
    </div>
</template>

<script>
    import moment from 'moment';
    import { mapState, mapGetters, mapActions, mapMutations } from 'vuex'
    import outstandingFees from '@/components/outstandingFees'  
export default {    
    components: {
      outstandingFees
    },
    data() {
        let validateName = (rule, value, callback) => {
            console.log(value,rule)
            if (!this.searchForm.outsourcingCusId) {
                callback(new Error("外包商不能为空!"));
            } else {
                callback();
            }
        }
        return {
            outstanding:false,
            outstandingShow:false,   
            isShowComb:false,
            dialogVisible:false,
            dialogVisibleTask:false,
            searchForm:{
                publisher:'',
                settlementType:'',
                taskName:'',
                presetTaskType:'1',
                outsourcingCusId:"",
                outsourcingCusName:"",
            },
            rules: {
                outsourcingCusId: [
                    {required: true, message: '外包商不能为空!', trigger: 'blur'},
                    {validator:validateName,trigger: ['change','blur'],}
                ],
            },
            params:{},
            belongtoList:[],
            tableData:[],
            outSourceLists:[],
            total:0,
            currentPage:1,
            pageSize:20,
            pickIcon:require('@/assets/icons/pick.png'),
            viewIcon:require('@/assets/icons/view.png'),
        }
    },
    computed:{
        ...mapGetters(['getHavePayOwn'])
    },
    watch:{
        "searchForm.publisher": function (val, oldval) {
            this.unitRequest();
        },
        "searchForm.settlementType": function (val, oldval) {
            this.unitRequest();
        },
        'searchForm.outsourcingCusId': function (val,oldVal) {
            if(val){
                for(let item of this.outSourceLists){
                    if(val == item.id){
                        this.searchForm.outsourcingName = item.name
                        console.log(this.searchForm.outsourcingName)
                    }
                }
            }
        }
    },
    mounted() {
        this.fetchList();
//        this.getPublisher();
//         this.geOutLists();
        this.checkOutStanding();
    },
    methods: {
        geOutLists() {
            let params = {
                customerType: 2,
                pageSize: 0,
            };
            this.$api.getOutLists(params).then(res => {
                let {data: layer1} = res;
                let {data, respCode} = layer1;
                if (respCode === 0) {
                    if (data && data.list) {
                        this.outSourceLists = [...data.list];
                    } else {
                        this.outSourceLists = [];
                    }
                } else {
                    this.outSourceLists = [];
                }
            }).catch(err => {
                console.log('err', err);
            })
        },
        fetchList(){
            let filterSp = this.searchForm.taskName;
            filterSp = this.searchForm.taskName;
            let params = {
                pageNum:this.currentPage,
                pageSize:this.pageSize, 
//                customerId:this.searchForm.publisher, 
                settlementType:this.searchForm.settlementType,
                taskName:filterSp,
            };
           this.$api.taskMarketList(params).then(res =>{
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
               console.log(err)
           })
        },
        unitRequest(){
            this.currentPage = 1;
            this.fetchList();
        },
         outstandingCancel(){
             this.outstanding = false;
      },
      outstandingConfirm(){
          this.outstanding = false;
          this.$router.push({
              path:'/account/accountList'
          })
      },
        checkOutStanding(){
          this.outstandingShow = false;
          this.$api.managementFee().then(res=>{
              let { data:layer1 } =  res;
              let { respCode,data } = layer1;
              if( respCode === 0 ){
                 if(data){                     
                    this.outstandingShow = true;
                 }
              }
          }).catch(err=>{
              console.log(err)
          })
      },
        searchNow(){
            this.unitRequest();
        },
        priceFormatter(row, column, cellValue, index){
            let res = '';
            if(cellValue){
                res = this.GlobalPriceFilter.priceFilter(cellValue);
            }else{
                res = '无';
            }
            return res;
        },
        timeFormatter(row, column, cellValue, index){
            let res = '永久';
            if(cellValue){
                res = moment( cellValue ).format('YYYY-MM-DD HH:mm') ;
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
//        getPublisher(){
//            this.$api.assignmentInfoPublisher().then(res=>{
//                let { data,respCode } = res;
//                if( respCode === 0 ){
//                    if(data){
//                        this.belongtoList = data;
//                    }else{
//                        this.belongtoList = [];
//                    }
//                }
//            }).catch(err=>{
//                console.log('err',err);
//            })
//        },
        handleCombShow(){
            this.isShowComb = !this.isShowComb;
        },
        handleCurrentChange(val){
            this.currentPage = val;
            this.fetchList();
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
        handleCheckboxChange(val){
          console.log(val)
        },
        saveUpdate(params){
            if( this.outstandingShow ){
                this.outstanding = true;
            }else{
                let data = {
                    // presetTaskType:this.searchForm.presetTaskType,
                    // outsourcingCusId:this.searchForm.outsourcingCusId,
                    // outsourcingCusName:this.searchForm.outsourcingName,
                    assmId:params.assignmentInfoId,
                };
                this.$api.grabTask(data).then(res=>{
                    let { data:layer1 } = res;
                    let { data,respCode } = layer1;
                    if( respCode === 0 ){
                        // this.$message.success('领取成功!')
                        // this.dialogVisibleTask= false;
                        this.dialogVisible= true;
                        this.unitRequest();
                    }
                }).catch(err=>{
                    console.log('err',err);
                })
            }
        },
        pickThis(row){
            this.params = row
            if( this.outstandingShow ){
                this.outstanding = true;
            }else{
                this.outstanding = false;
                this.searchForm.presetTaskType = '1';
                this.searchForm.outsourcingCusId = '';
                this.dialogVisibleTask = true;
            }
        },
    },
}
</script>
<style lang="scss" scoped>
    .taketaskCon {
        background-color: #fff;
        .middleText {
            text-align: center;
            color: #C0C1C2;
            line-height: 22px;
        }
        .formSearchMargin {
          margin-bottom: 0;
        }
          .combine-zone {
            border-top: 1px solid #EAEDF4;
            padding-bottom: 11px;
        }
        .comb-btn {
            margin-bottom: 20px;
        }
        .searchThisForm {
            padding-left: 20px;
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
        .middleTextHead {
            color: #4D4D4D;
            font-size: 16px;
            margin-bottom: 5px;
        }
        .operateCon {
            display: flex;
            flex-direction: row;
            justify-content: space-around;
            align-content: center;
            align-items: center;
            img {
                width: 12px;
                vertical-align: -3px;
                margin-right: 6px;
            }
            .viewCon {
                cursor: pointer;
            }
            .pickCon {
                cursor: pointer;
            }
        }
    }
</style>
<style lang="scss" >
    .taketaskCon {
        .el-table {
            .cell {
                text-align: center;
                padding-left: 10px;
            }
        }
        .el-radio-group {
            height:32px;
        }
        .el-form-item__label {
            line-height:32px;
        }
        .el-form-item {
        }
        .searchMaster  {
            .el-input__inner {
                height: 34px;
            }   
            .el-icon-search {
                line-height: 28px;
            }
        }
        .resetFormItem {
            margin-top: 10px;
            margin-bottom: 0;
        }
        .resetDialog {
             .el-dialog {
                position: absolute;
                left: 0;
                right: 0;
                top: 0;
                bottom: 0;
                margin: auto !important;
                height:220px;
            }
            .el-dialog__header {
                border-bottom: none;
            }
            .resetBtn {
                width: 90px;
            }
            .resetBtnSp {
                width: 90px;
                color: #E9481C;
                background-color: #FFEFEA;
                border-color: #F7BEB2;
            }
            .el-button:active {
              color: #d13e16;
              border-color: #d13e16;
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
        .wrapFlex {
            .setMinHeight {
                min-height: 16px;
            }
            .el-radio-group {
                flex-wrap: wrap;
                height: auto;
            }
            .el-radio {
                margin-bottom: 6px;
                line-height: 16px;
            }
        }        
    }
</style>