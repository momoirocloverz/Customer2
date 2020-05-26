<template>
    <div class="shortCutPart2Con">       
        <div class="upper">
            <div class="upperLeft">
                <el-button class="btnNormal biggerBtn" @click="addMoreWorker">添加零工</el-button>
                <div class="marginSet">已添加{{tableData.length}}人</div>
                <div>合计结算收入： {{selectTotal | floatFilter}} 元</div>
            </div>
            <div class="upperRight">
                <div class="upperRightFirstChild">单价：{{countTime | float4Filter}}元/小时</div>
                <div>计时</div>
            </div>
        </div>
        <div class="tableCon">
            <el-table :key="1" class="table-outline" :data="tableData" emptyText="暂无零工"  style="width: 100%;">
                <el-table-column label="姓名" prop="realNameAlias"  show-overflow-tooltip></el-table-column>
                <el-table-column label="性别"  prop="sex" :formatter="sexFormatter" show-overflow-tooltip></el-table-column>
                <el-table-column label="结算方式" prop="settlementType" :formatter="settlementTypeFormatter" show-overflow-tooltip></el-table-column>       
                <el-table-column label="结算类型" prop="payType"  :formatter="payTypeFormatter"  show-overflow-tooltip></el-table-column>
                <el-table-column label="总工时">
                    <template v-slot="scope">
                        <el-autocomplete v-model="scope.row.select" :fetch-suggestions="querySearchAsync"  placeholder="请输入工时"  @select="handleSelect(scope)" @blur="selectBlur(scope)" :trigger-on-focus="false"></el-autocomplete>
                      </template>
                </el-table-column>
                <el-table-column label="结算收入" show-overflow-tooltip>
                    <template v-slot="scope">
                    <div>{{ scope.row.amount |  floatFilter}}</div>
                    </template>
                </el-table-column>       
                <el-table-column label="操作" prop="payOut" >
                    <template v-slot="scope">
                        <div class="delBtn" @click="deletePop(scope)"><img :src="delImg">删除</div>
                      </template>
                </el-table-column>
              </el-table>
        </div>
        <div class="btnCon">
            <el-button class="btnNormal" @click="goBack">上一步</el-button>
            <el-button class="btnNormal " @click="nextStep">下一步</el-button>
        </div>
        <el-dialog title="删除"  :visible.sync="deleteVisible" width="540px" class="resetDialog">
            <div class="middleTextHead">确认删除{{transObj.row.realNameAlias}}吗？</div>     
            <span slot="footer" class="dialog-footer">
                <el-button class="resetBtn" @click="deleteVisible = false">取 消</el-button>
                <el-button class="resetBtnSp"  @click="shutDelete">确 认</el-button>
            </span>
        </el-dialog>
        <el-dialog title="选择零工"  :visible.sync="workerVisible" width="800px" :destroy-on-close="true" class="selectWorkerDialog" :before-close="beforeClose">
            <div class="middleTextHead resetMiddleText">
                <div class="search-zone">
                    <div class="text">关键字：</div>
                    <el-input class="searchMaster" clearable placeholder="输入零工姓名搜索" prefix-icon="el-icon-search"   v-model="workerName" @clear="searchNow"></el-input>
                    <div  class="charge-btn" @click="searchNow" >搜索</div>
                </div>                
                <div class="dialogTableCon">
                    <el-table :key="2" class="table-outline" :data="tableData2" ref="multipleTable2" emptyText="暂无零工" style="width: 100%;"  @selection-change="handleSelectionChange" @select="selectOnly" @select-all="selectAll" height="300">
                        <el-table-column type="selection" ></el-table-column>
                        <el-table-column label="姓名" prop="realNameAlias" show-overflow-tooltip></el-table-column>
                        <el-table-column label="性别" prop="sex" :formatter="sexFormatter"  show-overflow-tooltip></el-table-column>
                        <el-table-column label="身份证号" prop="idCard" show-overflow-tooltip></el-table-column>       
                        <el-table-column label="手机号" prop="mobile" show-overflow-tooltip></el-table-column>
                        <el-table-column label="班务经理" prop="ownManager" show-overflow-tooltip></el-table-column>
                        <el-table-column label="结算方式" prop="settlementType" :formatter="settlementTypeFormatter" show-overflow-tooltip></el-table-column>
                        <el-table-column label="结算类型" prop="payType"  :formatter="payTypeFormatter" show-overflow-tooltip></el-table-column>
                      </el-table>
                    <div class="pagContainer" >
                        <el-pagination class="pagebox" layout="total,prev, pager, next" @current-change="handleCurrentChange" :page-size="pageSize" :current-page="currentPage" :page-count="pageCount" :total="total" ></el-pagination>
                      </div>
                </div>  
                <div class="selectedCon">
                    <div class="selectedText">已选人：</div>
                    <div class="selectItemCon">
                        <div class="selectInner">
                            <template v-for="(item,index) in selected">
                                <div :key="index" class="testStyle"><span>{{ item.realNameAlias }}</span><i class="el-icon-error" @click="deleteThis(item,index)"></i></div>
                            </template>
                        </div>
                    </div>
                </div>
            </div>     
            <span slot="footer" class="dialog-footer">
                <el-button class="resetBtn" @click="cancelWorker">取 消</el-button>
                <el-button class="resetBtnSp resetBtnSp2"  @click="confirmWorker">确认添加</el-button>
            </span>
        </el-dialog>
    </div>
</template>
<script>
export default {
  name: 'shortCutPart2',
  data() {
      return {
          delImg:require('@/assets/images/transh_bin.png'),
          tableData:[],    
          tableData2:[],
          countTime:0,
          selectTotal:0,
          deleteVisible:false,
          workerVisible:false,
          transObj:{
              row:{
                  realNameAlias:'',
              }
          },
          workerName:'',
          currentPage:1,
          pageCount:0,
          total:0,
          pageSize:10,
          multipleSelection:[],
          selected:[],
          chaosChangeStoreData:[],
          startDateTime:'',
          endDateTime:'',
          workEndTime:'',
          workStartTime:'',
          endWorkType:'',
          hours:0,
          days:0,
          loading: false,
          talentIdBridge:'',
          singleDeleteId:-1,
          singleAble:false,
          multipleAble:false,
          bottomDeleteAble:false,
          singleDeleteBridge:{},
          timer:null,
          timeout:null,
          restaurants:[],
          selectFirstTime:false,
      }
  },
    filters:{
        floatFilter (cellValue){
            if( (toString.call(cellValue) === '[object Null]')||(toString.call(cellValue) === '[object Undefined]')  ){
               return 0;
            }else{
                let fix = (Math.round(+cellValue + 'e' + 2) / Math.pow(10, 2)).toFixed(2);
                return fix;
            }
        },
        float4Filter (cellValue){
            if( (toString.call(cellValue) === '[object Null]')||(toString.call(cellValue) === '[object Undefined]')  ){
               return 0;
            }else{
                let fix = (Math.round(+cellValue + 'e' + 4) / Math.pow(10, 4)).toFixed(4);
                return fix;
            }
        },
        
    },
  mounted() {    
      this.analyse();      
  },
  methods: {   
      payTypeFormatter(row, column, cellValue, index) {
                let status = "";
                switch (Number.parseInt(cellValue)) {
                    case 1:
                        status = "外包费用";
                        break;
                    case 2:
                        status = "代发收入";
                        break;
                }
                return status;
            },
      sexFormatter(row, column, cellValue, index) {
                let status = "男";
                switch (Number.parseInt(cellValue)) {
                    case 1:
                        status = "男";
                        break;
                    case 2:
                        status = "女";
                        break;
                    default:
                        status = "男";
                        break;
                }
                return status;
            },
      settlementTypeFormatter(row, column, cellValue, index) {
                let status = "";
                switch (Number.parseInt(cellValue)) {
                    case 1:
                        status = "日结";
                        break;
                    case 2:
                        status = "月结";
                        break;
                    case 3:
                        status = "实时结";
                        break;
                    case 4:
                        status = "周结";
                        break;
                    default:
                        status = "";
                        break;
                }
                return status;
            },
      goBack(){
          this.$store.commit('setShortCutIndex',1);
          sessionStorage.setItem( 'shortCutSec',JSON.stringify(this.tableData) ); 
      },
      nextStep(){
          if( this.tableData.length ){
              let flag = this.tableData.every(ele=>{
                  return ele.select;
              });
              if( flag ){
                  sessionStorage.setItem( 'shortCutSec',JSON.stringify(this.tableData) ); 
                  this.$store.commit('setShortCutIndex',3);
              }else{
                  this.$message.error('总工时不能为空。');
              }
          }else{
              this.$message.error('请添加零工。');
          } 
      },
      deleteThis(item,index){ 
          this.multipleAble = false;
          this.singleAble = false;
          let unique2 = JSON.parse(sessionStorage.getItem('secSelect'));  
          unique2.splice(index,1); 
          this.Lodash.remove(this.chaosChangeStoreData,function(n){
              return n.talentId == item.talentId;
          })
          let unique3 = this.Lodash.uniqBy(this.chaosChangeStoreData,'talentId');         
          this.chaosChangeStoreData = [...unique3];  
          this.bottomDeleteAble = true;
          this.selected.splice(index,1);
          sessionStorage.setItem('secSelect',JSON.stringify(unique2)); 
          this.getWorkerListForDelete();
      },
      selectOnly(selection, row){
          this.multipleAble = false;
          this.singleAble = true;    
          this.bottomDeleteAble = false;
          let find = selection.findIndex(ele=>{
              return ele.talentId == row.talentId
          });        
          if( find<0 ){
             this.singleDeleteId = row.talentId;
          }else{
              this.singleDeleteId = -1;
          }
      },
      selectAll(selection){ 
          this.multipleAble = true;
          this.bottomDeleteAble = false;
          this.singleAble = false;
          let regroup = selection.filter(ele=>{   
              if((toString.call(ele) === '[object Null]')||(toString.call(ele) === '[object Undefined]')){    
              }else{
                  return ele;
              } 
          });  
          if( !regroup.length ){
              let that = this;
              function deepDelete(){
                  that.tableData2.forEach(ele=>{
                      this.Lodash.remove(that.chaosChangeStoreData,function(n){
                          return n.talentId == ele.talentId;
                      })
                  });
                  that.$nextTick(()=>{
                      let unique2 = this.Lodash.uniqBy(that.chaosChangeStoreData,'talentId');
                      that.selected = unique2; 
                      sessionStorage.setItem('secSelect',JSON.stringify(unique2));
                  })
              };
              deepDelete();  
          }else{
              let unique2 = this.Lodash.uniqBy(this.chaosChangeStoreData,'talentId');
              sessionStorage.setItem('secSelect',JSON.stringify(unique2));
              this.selected = unique2;
          }
      },
      handleSelectionChange(val){ 
          let regroup = val.filter(ele=>{   
              if((toString.call(ele) === '[object Null]')||(toString.call(ele) === '[object Undefined]')){    
              }else{
                  return ele;
              } 
          });          
          this.multipleSelection = regroup; 
          let transMultiple = Object.assign([],this.multipleSelection);
          let parseData = JSON.parse(sessionStorage.getItem('secSelect'));
          let hi = [...parseData,...transMultiple];
          let unique = this.Lodash.uniqBy(hi,'talentId'); 
          unique.forEach(ele=>{
              this.chaosChangeStoreData.push(ele);
          });
          if(this.singleAble){
             //单点操作时
              if(this.singleDeleteId>-1){
                  //单点删除
                  let that = this;
                  function deepDelete(){
                      this.Lodash.remove(that.chaosChangeStoreData,function(n){
                          return n.talentId == that.singleDeleteId;
                      })
                      let unique2 = this.Lodash.uniqBy(that.chaosChangeStoreData,'talentId');
                      that.selected = unique2;  
                      sessionStorage.setItem('secSelect',JSON.stringify(unique2));
                  };
                  deepDelete(); 
              }else{
                  //单点添加
                  let unique2 = this.Lodash.uniqBy(this.chaosChangeStoreData,'talentId');
                  sessionStorage.setItem('secSelect',JSON.stringify(unique2));
                  this.selected = unique2;
              }
          }else{              
              if(this.multipleAble){
                  //全选按钮的操作                  
              }else{
                  //底部进行删除操作
              }              
          }
      },
      handleCurrentChange(val){
          this.currentPage = val;
          this.singleDeleteId = -1;
          this.getWorkerListSp(); 
      },
      searchNow(){
          this.currentPage = 1;
          this.getWorkerListSp();
      },
      beforeClose(){
          this.cancelWorker();
      },
      cancelWorker(){
          this.workerVisible = false;
          this.selected = [];
          this.chaosChangeStoreData = [];
      },
      confirmWorker(){
          const loading = this.$loading({
             lock: true,
             text: '处理中',
             spinner: 'el-icon-loading',
             background: 'rgba(255, 255, 255, 0.9)',
              customClass:'tempLoading'
         });
         this.timer = setTimeout(()=>{
             loading.close();
             this.timer = null;
          },700);
          this.$nextTick(()=>{
              this.workerVisible = false;          
              this.chaosChangeStoreData = [];
              this.tableData = Object.assign([],this.selected);
          });
      },
      getWorkerListForDelete(){
          const params = {
                    customerStatus: 1,
                    pageNum: this.currentPage,
                    pageSize: this.pageSize,
                    nameAlias:this.workerName,
                };
                this.$api.getWorkerListThree(params).then(res => {                    
                    let { data:layer1 } = res;
                    let { data,respCode } = layer1;
                    if( respCode === 0 ){
                        if( data.list&&data.list.length  ){
                            data.list.forEach(item=>{
                                item.select = '';
                                item.amount = 0;
                            }); 
                            this.tableData2 = data.list;
                            this.$nextTick(()=>{                                                              
                                this.selected.forEach((ele)=>{
                                    let hi = this.tableData2.findIndex((subEle)=>{
                                        return (subEle.talentId == ele.talentId)
                                    });
                                    if( hi>-1 ){
                                        this.$refs.multipleTable2.toggleRowSelection(this.tableData2[hi]);
                                    }
                                })
                            });
                        }else{
                            this.tableData2 = [];
                        }
                        this.total = data.total;
                    }else{
                        this.tableData2 = [];
                        this.total = 0;
                    }
                }).catch(err=>{
                    console.log('err',err);
                })
      },
      getWorkerListSp(){
          const params = {
                    customerStatus: 1,
                    pageNum: this.currentPage,
                    pageSize: this.pageSize,
                    nameAlias:this.workerName,
                };
                this.$api.getWorkerListThree(params).then(res => {                    
                    let { data:layer1 } = res;
                    let { data,respCode } = layer1;
                    if( respCode === 0 ){
                        if( data.list&&data.list.length  ){
                            data.list.forEach(item=>{
                                item.select = '';
                                item.amount = 0;
                            }); 
                            this.tableData2 = data.list;
                            this.$nextTick(()=>{                                                              
                                this.selected.forEach((ele)=>{
                                    let hi = this.tableData2.findIndex((subEle)=>{
                                        return (subEle.talentId == ele.talentId)
                                    });
                                    if( hi>-1 ){
                                        this.$refs.multipleTable2.toggleRowSelection(this.tableData2[hi]);
                                    }
                                })
                            });
                        }else{
                            this.tableData2 = [];
                        }
                        this.total = data.total;
                    }else{
                        this.tableData2 = [];
                        this.total = 0;
                    }
                }).catch(err=>{
                    console.log('err',err);
                })
      },
      addMoreWorker(){
          this.workerName = '';
          this.currentPage = 1;
          this.getWorkerListSp();           
          sessionStorage.setItem('secSelect',JSON.stringify(this.tableData));          
          this.selected = Object.assign([],this.tableData);      
          this.workerVisible = true;
          this.selectFirstTime = true;
      },
      deletePop(row){          
          this.transObj = row;
          this.deleteVisible = true;
      },
      shutDelete(){          
          let shorter = this.transObj.$index;
          this.tableData.splice(shorter,1);
          this.deleteVisible = false;
          this.$message({
              message: '删除成功.',
              type: 'success'
          });
          this.calucateFinal();
          if( sessionStorage.getItem( 'shortCutSec') ){
              sessionStorage.setItem( 'shortCutSec',JSON.stringify(this.tableData) ); 
          }
      },
      analyseDays(resource){
          this.startDateTime = this.Moment(resource.startTime).format('YYYY-MM-DD');
          this.endDateTime = this.Moment(resource.endTime).format('YYYY-MM-DD');    
          let timeStamp1 = this.Moment(this.startDateTime);
          let timeStamp2 = this.Moment(this.endDateTime);
          let diffRes = timeStamp2.diff(timeStamp1,'days') + 1; 
          this.days = diffRes;
      },
      analyseHours(resource){      
          this.endWorkType= resource.endWorkType;            
          let years1 = '2019-11-12';
          let years2 = '2019-11-12';                    
          switch(this.endWorkType){
              case 1:
                  years2 = '2019-11-12';  
                  this.workStartTime = `${years1} ${resource.workStartTime}`;
                  this.workEndTime = `${years2} ${resource.workEndTime}`;
                  break;
              case 2:
                  years2 = '2019-11-13';
                  this.workStartTime = `${years1} ${resource.workStartTime}`;
                  this.workEndTime = `${years2} ${resource.workEndTime}`;
                  break;
          } 
          let timeStamp1 = this.Moment(this.workStartTime);
          let timeStamp2 = this.Moment(this.workEndTime);
          let diffRes = timeStamp2.diff(timeStamp1,'minutes');  
          let minutesToHours = diffRes/60;
          console.log('小时数',minutesToHours);
          this.hours = minutesToHours;
      },
      singlePrice(resource){
          let countTime = JSON.parse(resource.price).price[0].countTime;
          this.countTime = countTime;
      },
      analyse(){
          let resource = JSON.parse(sessionStorage.getItem( 'shortCutFirst'));
          this.singlePrice(resource);
          this.analyseDays(resource);
          this.analyseHours(resource);
          this.setOption();  
          this.getSeStorage();
      },
      getSeStorage(){
          if( sessionStorage.getItem( 'shortCutSec') ){
              this.tableData = JSON.parse( sessionStorage.getItem( 'shortCutSec') );
              this.calucateFinal();
          }
      },                      
      setOption(){
          let max = this.hours * this.days;
          console.log( 'max',max );
          let arr = [];
          function calucate (max){      
              let result = max;               
              if( result > 0.5 ){
                  result = result - 0.5;
                  arr.unshift({
                      value:String(result),
                      address:String(result),
                  });    
                  calucate(result);
              }              
          }
          calucate(max);          
          if(max > 0.5){
              arr = [ ...arr,{value:String(max),address:String(max)}];
          }     
          let finalArr = Object.assign([],arr);
          if( finalArr.length>20 ){
              finalArr = finalArr.slice(0,20);
          }
          this.restaurants = arr;
      },
      handleSelect(scope) {
          let calucateRes = Number(scope.row.select)*this.countTime;
          this.tableData[scope.$index].amount = calucateRes;
          this.calucateFinal(); 
      },
      selectBlur(scope){
//          console.log( 'blur这里',scope.row.select );
          let max = this.hours * this.days;
//          console.log( 'max',max );          
          if( isNaN(Number(scope.row.select)) ){
//              console.log('不是数字');
              scope.row.select = '0.5';
              let calucateRes = 0.5*this.countTime;
              this.tableData[scope.$index].amount = calucateRes;
              this.calucateFinal();
          }else{
              if( Number(scope.row.select) > max ){
                  scope.row.select = '0.5';
                  let calucateRes = 0.5*this.countTime;
                  this.tableData[scope.$index].amount = calucateRes;
                  this.calucateFinal(); 
                  this.$message.error(`最大只能输入${max}`);
              }else{
                  if( Number(scope.row.select) < 0.5 ){
                      scope.row.select = '0.5';
                      let calucateRes = 0.5*this.countTime;
                      this.tableData[scope.$index].amount = calucateRes;
                      this.calucateFinal(); 
                  }              
                  let checkPoint = scope.row.select.indexOf('.');
                  if( checkPoint > -1 ){                      
                      let number1 = scope.row.select.split('.')[0];
                      let number2 = scope.row.select.split('.')[1];
//                      console.log( 'number1',number1,number2 );    
                      console.log( `${number1}.5` );
                      if( Number(`${number1}.5`) > max ){
                          scope.row.select = String(max);
                      }else{
                          scope.row.select = `${number1}.5`;
                      }
                      let calucateRes = 0.5*this.countTime;
                      console.log('calucateRes',calucateRes)
                      this.tableData[scope.$index].amount = calucateRes;
                      this.calucateFinal();                       
                  }else{
                      let calucateRes = scope.row.select*this.countTime;
                      this.tableData[scope.$index].amount = calucateRes;
                      this.calucateFinal(); 
                  }
              }
          }
      },
      createStateFilter(queryString) {                  
          return (state) => {
              return state.value.indexOf(queryString)=== 0;
          };
      },
      querySearchAsync(queryString, cb) {
          var restaurants = this.restaurants;
          var results = queryString ? restaurants.filter(this.createStateFilter(queryString)) : restaurants;
          clearTimeout(this.timeout);
          this.timeout = setTimeout(() => {
              cb(results);
          }, 3000 * Math.random());
      },
      calucateFinal(){
          let forCalu = Object.assign([],this.tableData);   
          let pure = forCalu.map(ele=>{
              if( !ele.amount ){
                  return 0;
              }else{
                  return ele.select*this.countTime;
              }
          });
          forCalu.forEach(ele=>{
             ele.amount =  ele.select*this.countTime;
          });
          let final = pure.reduce((acc,current)=>{
              return acc+current;
          },0);
          this.selectTotal = final;
      },      
  },
    beforeDestroy(){
      this.timer = null;
    },
}
</script>
<style lang="scss" scoped>
    .shortCutPart2Con {
        background-color: #fff;
        .pagContainer {
            margin-top: 10px;
            margin-bottom: 10px;
            text-align: center;
        }
        .testStyle {
            position: relative;
            padding: 7px 23px;
            height: 30px;
            box-sizing: border-box;
            text-align: center;
            font-size: 12px;
            color: #2991FF;
            border: 1px solid #2991FF;
            margin-right: 27px;
            margin-top: 10px;
            margin-bottom: 10px;
            i {
                z-index: 2;
                font-size: 20px;
                position: absolute;
                right: -10px;
                top: -10px;
                color: #F56269;
                cursor: pointer;
            }
        }
        .selectedCon {
            text-align: left;
            .selectItemCon {
                padding-bottom: 30px; 
                height: 100px;  
                box-sizing: border-box;
                overflow-y: scroll;
                .selectInner {
                    display: flex;
                    justify-content: flex-start;
                    align-content: center;
                    align-items: center;
                    flex-wrap: wrap;
                }
            }
        }        
        .btnNormal {
            width: 90px;
            color: #e84518;
            border-color: #f8c7ba;
            background-color: #fdece8;
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
        }
        .searchMaster {            
            width: 300px;  
            margin-right: 20px;
        }
        .middleTextHead {
            color: #4D4D4D;
            font-size: 16px;
            margin-bottom: 5px;
            text-align: center;
            padding-top: 12px;
        }
        .resetMiddleText {
            padding-top: 0;
        }
        .biggerBtn {
            width: 100px !important;
            font-size: 12px;
        }
        .search-zone {
            display:flex;
            align-items:center;
            justify-content:flex-start;
            flex-wrap: wrap;
            align-content: center;
            align-items: center;
            margin-bottom: 20px;
            .text {
                font-size: 14px;
            }
        }
        .btnCon {
            padding-top: 20px;
            padding-bottom: 20px;
            text-align: center;
        }
        .upper {
            display:flex;
            justify-content: space-between;
            align-content: center;
            align-items: center;
            padding: 18px 24px;
            border-bottom: 1px solid #E6E7EB;
            font-size:12px;
            word-wrap: break-word; 
            .marginSet {
                margin-left: 20px;
                margin-right: 20px;
            }
            .upperLeft {
                display:flex;
                align-content: center;
                align-items: center;
                justify-content: flex-start;
            }
            .upperRight {
                display:flex;
                align-content: center;
                align-items: center;
                justify-content: flex-end;                
                .upperRightFirstChild {
                    margin-right: 20px;
                }                
            }
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
            .resetBtnSp2 {
                width: 100px;
            }
        .delBtn {
            width: 50px;
            margin: 0 auto;
            cursor: pointer;
            &:hover {
                color: #e84518;
            }
            img {
                width: 13px;
                height: 13px;
                vertical-align: -2px;
                margin-right: 7px;
            }
        }
    }
</style>
<style lang="scss">
    .tempLoading {
        z-index: 40;
    }
    .shortCutPart2Con {  
        .searchMaster {
            .el-input__prefix {
                top:-3px;
            }
            .el-input__inner {
                height: 34px;
            }  
        }
        .el-button:active {
            color: #d13e16;
            border-color: #d13e16;
        }
        .selectWorkerDialog {
            .el-dialog {
                position: absolute;
                left: 0;
                right: 0;
                top: 0;
                bottom: 0;
                margin: auto !important;
                height:665px;
            }
            .el-dialog__body {                
                padding-top: 10px;
                padding-bottom: 10px;
            }
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
                height: 40px;
            }
            .el-dialog__body {                
                height: 122px;
            }
        }
        .el-table {
            .cell {
                text-align: center;
                padding-left: 10px;
            }
            .el-autocomplete {
                width: 80%;
            }
        }        
    }
</style>