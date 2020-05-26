<template>
    <div class="shortCutPart3Con">   
      <div class="upper">
            <div class="upperLeft">
                <div class="marginSet">共{{tableData.length}}人</div>
                <div>合计结算收入： {{selectTotal  |  floatFilter}} 元</div>
            </div>
            <div class="upperRight">
                <div class="upperRightFirstChild">单价：{{countTime | float4Filter}}元/小时</div>
                <div>计时</div>
            </div>
        </div>
         <div class="tableCon">
            <el-table class="table-outline" :data="tableData" emptyText="暂无零工" style="width: 100%;">
                <el-table-column label="姓名" prop="realNameAlias"  show-overflow-tooltip></el-table-column>
                <el-table-column label="性别" prop="sex" :formatter="sexFormatter" show-overflow-tooltip></el-table-column>
                <el-table-column label="结算方式" prop="settlementType"  :formatter="settlementTypeFormatter" show-overflow-tooltip></el-table-column>       
                <el-table-column label="结算类型" prop="payType" :formatter="payTypeFormatter" show-overflow-tooltip></el-table-column>
                <el-table-column label="总工时">
                    <template v-slot="scope">{{scope.row.select}}</template>
                </el-table-column>
                <el-table-column label="结算收入" prop="manager" show-overflow-tooltip>
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
            <el-button class="btnNormal btn2Normal" @click="finalConfirm">确认结算</el-button>
        </div>
        <el-dialog title="删除"  :visible.sync="deleteVisible" width="540px" class="resetDialog">
            <div class="middleTextHead">确认删除{{transObj.row.realNameAlias}}吗？</div>     
            <span slot="footer" class="dialog-footer">
                <el-button class="resetBtn" @click="deleteVisible = false">取 消</el-button>
                <el-button class="resetBtnSp"  @click="shutDelete">确 认</el-button>
            </span>
        </el-dialog>
        <el-dialog title="提示"  :visible.sync="finalVisible" width="540px" class="resetDialog">
            <div class="finalTextHead">确认该班务的收入数据正确，<br/>系统将关闭该班务并生成零工待付收入。<br/>零工端可在待发放收入列表中查看</div>     
            <span slot="footer" class="dialog-footer">
                <el-button class="resetBtn" @click="finalVisible = false">取 消</el-button>
                <el-button class="resetBtnSp"  @click="finalSubmit">确 认</el-button>
            </span>
        </el-dialog>
        
    </div>
</template>
<script>
export default {
  name: 'shortCutPart3',
  data() {
      return {
          delImg:require('@/assets/images/transh_bin.png'),
          tableData:[],
          selectTotal:0,
          deleteVisible:false,
          countTime:0,
          transObj:{
              row:{
                  realNameAlias:'',
              }
          },
          submitObj:{},
          finalVisible:false,
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
      this.singlePrice();
      this.initData();
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
      singlePrice(){
          let resource = JSON.parse(sessionStorage.getItem( 'shortCutFirst'));
          let countTime = JSON.parse(resource.price).price[0].countTime;
          this.countTime = countTime;
      },
      initData(){
          if( sessionStorage.getItem( 'shortCutSec') ){
              this.tableData = JSON.parse( sessionStorage.getItem( 'shortCutSec') );
              this.calucateFinal();
          }
      },
      calucateFinal(){
          let forCalu = Object.assign([],this.tableData);          
          let pure = forCalu.map(ele=>{
              if( !ele.amount ){
                  return 0;
              }else{
//                  console.log( ele.select*this.countTime );
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
      goBack(){
          this.$store.commit('setShortCutIndex',2);
      },
      finalSubmit(){
          const loading = this.$loading({
             lock: true,
             text: '处理中',
             spinner: 'el-icon-loading',
             background: 'rgba(255, 255, 255, 0.9)',
              customClass:'tempLoading'
         });
          this.$api.classTaskFastAdd(this.submitObj).then(res=>{              
              let { data:layer1 } = res;
              let { respCode } = layer1;
              if( respCode === 0 ){
                  this.$message({
                      message: '添加成功.',
                      type: 'success'
                    });                  
                  this.finalVisible = false;
                  this.$router.push({
                     name: 'classList', 
                  });
                  loading.close();
                  this.$nextTick(()=>{
                      sessionStorage.removeItem( 'shortCutSec');
                      sessionStorage.removeItem( 'shortCutFirst');
                      sessionStorage.removeItem( 'secSelect');
                  });
              }else{
                  loading.close();
              }            
          }).catch(err=>{
              loading.close();
              console.log('err',err);
          })
      },
      finalConfirm(){
          let regenrateArr = this.tableData.map(ele=>{
              return {
                  talentId:ele.talentId,
                  talentName:ele.realNameAlias,
                  sex:ele.sex,
                  settlementType:ele.settlementType,
                  payType:ele.payType,
                  workHours:ele.select,
              }
          });          
          let short = JSON.parse(sessionStorage.getItem( 'shortCutFirst'));
          let finalParams = {
              fastClassTaskAddDTO:{
                  assignmentInfoId:short.assignmentInfoId,
                  classTaskName:short.classTaskName,
                  managerId:short.managerId,
                  startTime:short.startTime,
                  endTime:short.endTime,
                  settlementType:short.settlementType,
                  price:short.price,
                  workStartTime:short.workStartTime,
                  endWorkType:short.endWorkType,
                  timePrice:this.countTime,
                  workEndTime:short.workEndTime,
                  workingPlace:short.workingPlace,
                  longitude:short.longitude,
                  latitude:short.latitude,
                  industryList:short.industryList,
                  classTaskPriceLimitDTOList:short.classTaskPriceLimitDTOList,
              },
              talentAddDTOList:regenrateArr,
          };
          console.log( 'finalParams',finalParams );
          this.submitObj = finalParams;
          if(regenrateArr.length){
              this.finalVisible = true;
          }else{
              this.$message.error('请添加零工。');
          }
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
          sessionStorage.setItem( 'shortCutSec',JSON.stringify(this.tableData) ); 
      },
  },
}
</script>
<style lang="scss" scoped>
    .shortCutPart3Con {
        background-color: #fff;  
        .finalTextHead {
            text-align: center;
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
        .btnCon {
            padding-top: 20px;
            padding-bottom: 20px;
            text-align: center;
        }
        .btnNormal {
            width: 90px;
            color: #e84518;
            border-color: #f8c7ba;
            background-color: #fdece8;
        }
        .btn2Normal {
            width: 100px;
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
    }
</style>
<style lang="scss">
    .shortCutPart3Con {
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
        }
    }
</style>