<template>
  <div class="g-class-list">
  <div class="back-white" style="margin-bottom: 12px;">
    <search-bar combCondition="true" @handleSearch="handleSearch" placeholder="输入班务名称搜索">
      <el-form ref="form" label-width="100px" labelPosition="left">
        <el-form-item label="所属客户:" class="formSearchMargin formSearchMarginTop" >
          <el-radio-group class="radio-search" v-model="ownCustomer" @change="handleChangeOwnCustomer" style="width: 100%;display:flex;flex-wrap: wrap;">
            <el-radio :label="it.belongTo" v-for="it,i in belongToList" :key="i">{{it.belongToName}}</el-radio>
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
           <el-radio :label="it.managerId" v-for="it,i in managerList" :key="i">{{it.managerNameAlias}}</el-radio>
          </el-radio-group>
        </el-form-item>
          <el-form-item label="班务类型:" class="formSearchMargin">
          <el-radio-group class="radio-search" v-model="classType" @change="classTypeChange">  
              <el-radio label="">不限</el-radio>
            <el-radio label="1">常规</el-radio>
            <el-radio :label="2">快捷</el-radio>            
          </el-radio-group>
        </el-form-item>
          
          <el-form-item label="外包商:" class="formSearchMargin">
          <el-radio-group class="radio-search" v-model="outsourcingCusId" @change="outsourcingChange" style="width: 100%;display:flex;flex-wrap: wrap;">
           <el-radio :label="it.id" v-for="(it,i) in outSourceLists" :key="i">{{it.name}}</el-radio>
          </el-radio-group>
        </el-form-item>
          
          
      </el-form>
    </search-bar>
    </div>
    <div class="table-box back-white">
      <el-table :data="classList" empty-text="暂无相关信息" v-loading="loading">
        <el-table-column 
        align="center"
          label="班务名称" 
          prop="classTaskName" 
          show-overflow-tooltip  
          min-width="140" >
        </el-table-column>
        <el-table-column 
        align="center"
          label="所属任务" 
          prop="belongToTaskName" 
          show-overflow-tooltip  
          min-width="140" >
        </el-table-column>
             <el-table-column 
        align="center"
          label="外包商" 
          prop="outsourcingCusName" 
          show-overflow-tooltip  
          min-width="140" >
        </el-table-column>
       <el-table-column 
       align="center"
          label="所属客户" 
          prop="belongToCusName" 
          show-overflow-tooltip  
          min-width="140" >
        </el-table-column>
        <el-table-column 
        align="center"
          label="班务经理" 
          prop="managerName" 
          show-overflow-tooltip  
          min-width="100" >
        </el-table-column>
        <el-table-column 
        align="center"
          label="开始日期" 
          prop="startTime" 
          show-overflow-tooltip  
          min-width="120" >
            <template v-slot="scope">
            {{timeFormatter(scope.row.startTime)}}
            </template>
        </el-table-column>
        <el-table-column 
        align="center"
          label="结束日期" 
          prop="endTime" 
          show-overflow-tooltip  
          min-width="120" >
          <template v-slot="scope">
              {{timeFormatter(scope.row.endTime)}}
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
          label="类型" 
          show-overflow-tooltip  
          min-width="80" >
            <template v-slot="scope">
            {{scope.row.type == 1 ? '常规班务':'快捷班务'}}
          </template>
        </el-table-column>
        <el-table-column 
        align="center"
          label="班务状态" 
          prop="status" 
          show-overflow-tooltip  
          min-width="100" >
          <template v-slot="scope">
              {{statusMap[scope.row.status]}}
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" min-width="480">
          <template v-slot="scope">
            <el-button type="text" class="btn-icon btn-icon-view" size="mini" @click="handleViewDetail(scope.row)">班务详情</el-button>
            <el-button type="text" v-if="scope.row.status!==3" class="btn-icon btn-icon-edit" size="mini" @click="handleEditClassTask(scope.row)">编辑班务</el-button>
            <el-button v-if="scope.row.status===2" type="text"  class="btn-icon btn-icon-reject" size="mini" @click="handleStopClass(scope.row)">结束班务</el-button>
            <el-button type="text" v-if="scope.row.status===1" class="btn-icon btn-icon-view" size="mini" @click="handleDelete(scope.row)">删除班务</el-button>
            <el-button type="text" v-if="scope.row.status==1 || scope.row.status==2" class="btn-icon btn-icon-manage" size="mini" @click="adjustPrice(scope.row)">修改单价</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination-container" v-if="params.total!=0">
        <el-pagination class="pagebox" layout="total , prev, pager, next, jumper" :total="params.total" :current-page.sync="params.pageNum" @current-change="handleCurrentChange" :page-size="params.pageSize">
        </el-pagination>
      </div>
    </div>


     <add-class-form 
      :taskName="pitchTaskName" 
      :save="handleSave" 
      :showAddClassForm="showAddClassForm" 
      :cancelAddClassForm="cancelAddClassForm" 
      :assignmentInfoId="null"
      :saveLoading="saveLoading"
      :editData="editData"
      :edit="true"
      :handleEdit="handlePostClassTaskUpdate"
      />

        <el-dialog class="protecterCon" title="修改班务核算单价" :visible.sync="showEditUnitPrice" width="600px" center
               :modal-append-to-body="false">
        <priceFormCom :priceStr="priceBridge" :classTaskId="tranTaskId"  v-if="showEditUnitPrice" @getData="comeData" @cancelAction="shutAdjustDialog" />
    </el-dialog>

  </div>
</template>

<script>
    import priceFormCom from '@/views/customer/classManage/priceFormCom.vue';
import SearchBar from '@/components/SearchBar'
import AddClassForm from '../addClassForm.vue';

export default {
  name: 'classList',
  components: { SearchBar,AddClassForm,priceFormCom },
  data() {
    return {
        showEditUnitPrice:false,
      showAddClassForm:false,
      saveLoading:false,
      editData:null,
        outsourcingCusId:'',
        outSourceLists:[{id:'',name:'不限'}],
        classType:'',
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
     pitchTaskName:'',
     saveLoading:false,
        priceBridge:'',
        formPriceBridge:{},
        tranTaskId:'',
        payLoadObj:{},
    }
  },
  mounted() {
     this.handleGetTaskBelongToList();
     this.handleGetManagerList();
     this.handleGetClassList();
      this.geOutLists();
  },
  methods: {  
            analyseSet(){
          console.log( this.payLoadObj );
          console.log( JSON.parse(this.priceBridge) );
          let settlementType = JSON.parse(this.priceBridge).settlementType;
          let calculateType = this.payLoadObj.calculateType;
          let valuationPrice = this.payLoadObj.valuationPrice;
          let calculatePrice = this.payLoadObj.calculatePrice;
          let priceList = this.payLoadObj.priceList;
          let exceedPrice = this.payLoadObj.exceedPrice;
          let unit = this.payLoadObj.unit;
          let calculatePriceReal = this.payLoadObj.calculatePriceReal;
          let calculatePricePiece = this.payLoadObj.calculatePricePiece;
          let calculatePriceBag = this.payLoadObj.calculatePriceBag;
          let calculatePriceCar = this.payLoadObj.calculatePriceCar;
          let calculatePriceTon = this.payLoadObj.calculatePriceTon;
          let valuationType = this.payLoadObj.valuationType;
          let $price = {};
                if (valuationType === 1) {
                    $price = {
                        price: [{
                            countTime: valuationPrice,
                            ladderObj: [{count: "", unit: ""}],
                            countSettle: "",
                            countChe: "",
                            countDun: "",
                            countDai: ""
                        }], unit: "", valuationType: 1, settlementType: settlementType
                    }
                } else if (valuationType === 2 && calculateType === 1 && calculatePrice === 1) {

                    $price = {
                        price: [{
                            countTime: "",
                            ladderObj: [{count: "", unit: ""}],
                            countSettle: unit === 1 ? calculatePriceReal : "",
                            countDai: unit === 2 ? calculatePriceReal : "",
                            countChe: unit === 3 ? calculatePriceReal : "",
                            countDun: unit === 4 ? calculatePriceReal : ""
                        }], unit, valuationType: 2, settlementType: settlementType
                    }
                } else if (valuationType === 2 && calculateType === 1 && calculatePrice === 2) {

                    $price = {
                        price: [{
                            countTime: "",
                            ladderObj: [...priceList.map(it => {
                                return {
                                    count: it.num,
                                    unit: it.price
                                }
                            }), {overUnit: exceedPrice.price}],
                            countSettle: "",
                            countChe: "",
                            countDun: "",
                            countDai: ""
                        }], unit, valuationType: 3, settlementType: settlementType
                    }
                } else if (valuationType === 2 && calculateType === 2) {

                    $price = {
                        price: [{
                            countTime: "",
                            ladderObj: [{count: "", unit: ""}],
                            countSettle: calculatePricePiece,
                            countDai: calculatePriceBag,
                            countChe: calculatePriceCar,
                            countDun: calculatePriceTon
                        }], unit: "", valuationType: 4, settlementType: settlementType
                    }
                } else if (valuationType === 3 && calculateType === 1 && calculatePrice === 1) {

                    $price = {
                        price: [{
                            countTime: valuationPrice,
                            ladderObj: [{count: "", unit: ""}],
                            countSettle: unit === 1 ? calculatePriceReal : "",
                            countDai: unit === 2 ? calculatePriceReal : "",
                            countChe: unit === 3 ? calculatePriceReal : "",
                            countDun: unit === 4 ? calculatePriceReal : ""
                        }], unit, valuationType: 5, settlementType: settlementType
                    }
                } else if (valuationType === 3 && calculateType === 1 && calculatePrice === 2) {

                    $price = {
                        price: [{
                            countTime: valuationPrice,
                            ladderObj: [...priceList.map(it => {
                                return {
                                    count: it.num,
                                    unit: it.price
                                }
                            }), {overUnit: exceedPrice.price}],
                            countSettle: "",
                            countChe: "",
                            countDun: "",
                            countDai: ""
                        }], unit, valuationType: 6, settlementType: settlementType
                    }
                } else if (valuationType === 3 && calculateType === 2) {

                    $price = {
                        price: [{
                            countTime: valuationPrice,
                            ladderObj: [{count: "", unit: ""}],
                            countSettle: calculatePricePiece,
                            countDai: calculatePriceBag,
                            countChe: calculatePriceCar,
                            countDun: calculatePriceTon
                        }], unit: "", valuationType: 7, settlementType: settlementType
                    }
                } else if (valuationType === 4) {
                    $price = {
                        price: [{sex: 3, countFixed: dayPrice}],
                        unit: "",
                        valuationType: 8,
                        settlementType: settlementType
                    }

                }
          console.log( '$price',$price )
          let params = {
              classTaskId:this.tranTaskId,
              price:JSON.stringify($price),
              enableDate:this.payLoadObj.enableDate,
          }        
          this.$api.classTaskPriceLogSave(params).then(res=>{
              let { data:layer1 } = res;
               let { respCode,data } = layer1;
              if( respCode == 0 ){
                  this.$message({
                      message: '设置成功',
                      type: 'success'
                    });
                  this.handleGetTaskBelongToList();
                     this.handleGetManagerList();
                     this.handleGetClassList();
              }              
          }).catch(err=>{
              console.log('err',err);
          })
          
      },
      comeData(payload){
          this.showEditUnitPrice = false;
          this.payLoadObj = payload;
          this.analyseSet();
      },
      shutAdjustDialog(){
          this.showEditUnitPrice = false;
      },
      adjustPrice(row){
          let reqParam = {
              classTaskId:row.classTaskId,
          };
          this.$api.getClassTaskDetail(reqParam).then(res=>{
              let { respCode,data } = res;
              if( respCode === 0 ){
                  this.priceBridge = data.price;
                  this.showEditUnitPrice = true;
                  this.tranTaskId = String(row.classTaskId);
              }
          }).catch(err=>{
              console.log('err',err);
          })          
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
      outsourcingChange(){
          this.params.pageNum = 1;
          this.handleGetClassList();
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
                this.handleGetClassList('saveordelete');
                }
                })
        }).catch(() => {
        });
    },
    handleStopClass(row){
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
    },
    handleCurrentChange(val){
      this.params.pageNum = val;
      this.handleGetClassList();
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
        this.showAddClassForm=false;
        this.handleGetClassList();
        }
        this.saveLoading = false;
      })
    },
    // handleOpenSaveLoading(){
      
    // },
    // handleSaveLoading(){
    //   this.saveLoading = false;
    // },
    handleViewDetail(row){
       const { href } = this.$router.resolve({
        name: "outSourceClassDetails",
        query: {
          classTaskId: row.classTaskId,
        }
      });
      window.open(href, "_blank");
    },
      // this.$router.push({name:'classDetail',query:{classTaskId:row.classTaskId}});
    // },
     cancelAddClassForm(){
      this.showAddClassForm=false;
    },
    handleSave(val){
    },
    handleEditClassTask(row){
      this.pitchTaskName = row.belongToTaskName;
      this.classTaskId = row.classTaskId;
      this.handleGetClassTaskDetail(row.classTaskId);
      
    },
    handleGetClassTaskDetail(classTaskId){
      this.$api.getClassTaskDetail({classTaskId}).then(res=>{
        this.editData = res.data;
        this.$store.commit('outSET_CLASS_FORM_STATE',res.data);
        this.showAddClassForm = true;
      });
    },
      classTypeChange(){
          this.params.pageNum = 1;
        this.handleGetClassList();
      },
    handleChangeOwnCustomer(){
      this.params.pageNum = 1;
      this.handleGetClassList();
    },
    handleChangeClassStatus(){
      this.params.pageNum = 1;
      this.handleGetClassList();
    },
    handleChangeClassManagers(){
      this.params.pageNum = 1;
      this.handleGetClassList();
    },
    handleGetManagerList(){
      this.$api.managerMyBindingManagerList({status:1,pageSize:0}).then(res=>{
       let $managerList =  res.data.list||[];
       this.managerList = [{managerId:'',managerNameAlias:'不限'},...$managerList];
      });
    },
    handleGetTaskBelongToList(){
      this.$api.getTaskBelongToList().then(res=>{
        let $belongToList = res.data||[];
          let temp = $belongToList.map(item=>{
              return {
                  belongTo:`${item.belongTo}-${item.belongToType}`,
                  belongToName:item.belongToName,
                  belongToType:item.belongToType
              }
          });
          this.belongToList = [{belongTo:'',belongToName:'不限'},...temp];
      })
    },
    handleSearch(val){
      this.classTaskName = val;
      this.params.pageNum =1;
      this.handleGetClassList();
    },
     handleGetClassList(){
      const {ownCustomer,classStatus,classManager,classTaskName} = this;
      const {pageNum,pageSize} = this.params;
      this.loading = true;
      
      this.$api.getClassTaskCustomerList(
          {
              assignmentInfoBelongTo:ownCustomer?ownCustomer.split('-')[0]:'',
              assignmentInfoBelongToType:ownCustomer?ownCustomer.split('-')[1]:'',
              classTaskStatus:classStatus,
              managerId:classManager,
              type:this.classType,
              showOutsourcing:true,       
              pageNum,
              outsourcingCusId:this.outsourcingCusId,
              pageSize,
              classTaskName
          }
      ).then(res=>{
        this.classList = res.data.data.list||[];
        this.params.total = res.data.data.total;
        this.loading = false;
      })
    },
  },
}
</script>
<style lang="scss">
  .protecterCon {
        .el-dialog {
            height: 610px !important;
        }
        .el-dialog__body {
            height: 555px !important;
        }
    }
</style>