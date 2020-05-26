<template>
  <div class="outclassBaseInfoCon3">
    <div class="box-body-item">
      <div class="table-info info-item">
        <div class="table-info-col1"><span>所属任务</span></div>
        <div class="table-info-col2"><span>{{detail.belongToTaskName}}</span></div>
        <div class="table-info-col1"><span>状态</span></div>
        <div class="table-info-col2"><span>{{statusMap[detail.status]}}</span></div>
        
        <div class="table-info-col1"><span>开始日期</span></div>
        <div class="table-info-col2"><span>{{detail.startTime}}</span></div>
        <div class="table-info-col1"><span>结束日期</span></div>
        <div class="table-info-col2 text-overflow">
          <span>{{detail.endTime?detail.endTime:'永久'}}</span>
        </div>          
        <div class="table-info-col1"><span>打卡地点</span></div>
        <div class="table-info-col2 setHeight" ><span>{{detail.workingPlace}}</span></div>
        <div class="table-info-col1"><span>核算单价</span></div>
        <div class="table-info-col2 setHeight">
            <span class="checkAmount" @click="popAmount">查看单价</span>
<!--
            <span>
                <el-tooltip class="item" effect="dark" :content="priceText" placement="top-start">
                  <span class="text-overflow">
                    {{priceText}}
                  </span>
                </el-tooltip>
            </span>
-->
        </div>
        <div class="table-info-col1"><span>结算方式</span></div>
        <div class="table-info-col2 text-overflow"><span>{{settlementTypeText}}</span></div>
        <div class="table-info-col1"><span>上班时间</span></div>
        <div class="table-info-col2"><span>{{detail.workStartTime}}</span></div>
        <div class="table-info-col1"><span>下班时间</span></div>
        <div class="table-info-col2 text-overflow">
          <span>{{timeOutDateMap[detail.endWorkType]}}{{detail.workEndTime}}</span>
        </div>
          
          <div class="table-info-col1" v-if="detail.type==1"><span>班务经理</span></div>
        <div class="table-info-col2" v-if="detail.type==1"><span>{{detail.managerName}}</span></div>
        <div class="table-info-col1" v-if="detail.type==1"><span>客户核定人数</span></div>
        <div class="table-info-col2" v-if="detail.type==1"><span>{{detail.cusAuthorizedNumber}}</span></div>
        <div class="table-info-col1" v-if="detail.type==1"><span>生产核定人数</span></div>
        <div class="table-info-col2" v-if="detail.type==1"><span>{{detail.authorizedNumber}}</span></div>
        <div class="table-info-col1" v-if="detail.type==1"><span>打卡方式</span></div>
        <div class="table-info-col2 text-overflow" v-if="detail.type==1"><span>
            <el-tooltip class="item" effect="dark" :content="form.workingPlace" placement="top-start">
              <span class="text-overflow">
                {{punchWayMap[detail.punchWay]}}
              </span>
            </el-tooltip>
          </span></div>
        <div class="table-info-col1" v-if="detail.type==1"><span>是否人脸打卡</span></div>
        <div class="table-info-col2" v-if="detail.type==1">
          <span>{{isRecognitionMap[detail.isRecognition]}}</span>
        </div>
        <div class="table-info-col1" v-if="detail.type==1"><span>打卡范围</span></div>
        <div class="table-info-col2" v-if="detail.type==1">
          <span> {{detail.punchRange}}米</span>
        </div>
        <div class="table-info-col1" v-if="detail.type==1"><span>工种价格上限控制</span></div>
        <div class="table-info-col2 text-overflow" v-if="detail.type==1">
            <span class="text-overflow">{{uppeLimitMap[detail.uppeLimit]}}</span>
        </div>
          
        <div class="table-info-col1"><span>工种要求</span></div>
        <div class="table-info-col2 text-overflow setHeight">
          <span> {{classTaskPriceLimitVOList.join('、')}}</span>
        </div>
        
        <div class="table-info-col1"><span>创建时间</span></div>
        <div class="table-info-col2"><span>{{detail.createdAt}}</span></div>
          <div class="table-info-col1" ><span>外包商</span></div>
        <div class="table-info-col2" ><span>{{detail.outsourcingCusName}}</span></div>
          <div class="table-info-col1" ><span>零工单价审核</span></div>
        <div class="table-info-col2" ><span>{{statusTextObj[checkStatus]}}</span></div>
          <div class="table-info-col1"><span>保证金</span></div>
        <div class="table-info-col2" ><span>{{detail.deposit || 0}}元</span></div>
          <div class="table-info-col1"><span></span></div>
        <div class="table-info-col2" ><span></span></div>
          
      </div>
    </div>
    <div class="box-body-item" v-if="detail.type==1">
      <div class="table-info info-item">
        <template v-for="(item, index) of this.classTaskConfirmVOList">
          <div class="table-info-col1"><span>日常产量确认人{{index+1}}</span></div>
          <div class="table-info-col2"><span>{{item.name}}</span></div>
          <div class="table-info-col1"><span>身份证号码</span></div>
          <div class="table-info-col2"><span>{{item.idCard}}</span></div>
        </template>
      </div>
    </div>
    <div class="box-body-item sub-table" v-if="detail.uppeLimit == 1">
      <table class="setting-table">
        <thead>
          <tr>
            <th>工种</th>
            <th>计时</th>
            <th>计件</th>
            <th>计袋</th>
            <th>计吨</th>
            <th>计车</th>
            <th>日固定</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item,index) in workList" :key="index">
            <td style="width:72px;color:#e84518;text-align:left">{{item.industryName}}</td>
            <td>
              <span>{{item.countTime}}</span>
              <span class="input-piece">元/小时</span>
            </td>
            <td>
              <span>{{item.countSettle}}</span>
              <span class="input-piece">元/件</span>
            </td>
            <td>
              <span>{{item.countDai}}</span>
              <span class="input-piece">元/袋</span>
            </td>
            <td>
              <span>{{item.countChe}}</span>
              <span class="input-piece">元/车</span>
            </td>
            <td>
              <span>{{item.countDun}}</span>
              <span class="input-piece">元/吨</span>
            </td>
            <td>
              <span>{{item.countFixed}}</span>
              <span class="input-piece">元/天</span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>


    <el-dialog title="历史单价" :visible.sync="dialogTableVisible" class="tableDiaglog" width="880px">
            <el-table :data="gridData" height="480" class="lockTable">
                <el-table-column property="createdAt" label="创建时间" show-overflow-tooltip></el-table-column>
                <el-table-column property="enableDate" label="生效时间" show-overflow-tooltip></el-table-column>
                <el-table-column property="formatText" label="单价" show-overflow-tooltip></el-table-column>
                <el-table-column property="status" label="状态"  :formatter="statusFormatter"  show-overflow-tooltip></el-table-column>
            </el-table>
            <div class="setPagnation">
                <el-pagination @current-change="handleCurrentChange"
                                   :current-page="currentPage" :page-size="pageSize"
                                   layout="total , prev, pager, next, jumper" :total="total">
                </el-pagination>
            </div>
        </el-dialog>


  </div>
</template>

<script>
export default {
  name: "details2Out",
  data() {
    return {
        dialogTableVisible:false,
        gridData:[],
        priceText:'',
        settlementTypeText:'',
        settlementTypeMap:{
            2:'月结',
            4:'周结',
            1:'日结'
        },
        checkStatus:1,
        statusTextObj:{
            1:'需要审核',
            2:'不需要审核'
        },
      timeOutDateMap:{
       [1]:'当日',
       [2]:'次日'
     },
      classTaskConfirmVOList:[],
      uppeLimitMap:{
        [1]:'开启',
        [2]:'关闭'
      },
      isRecognitionMap:{
        [0]:'是',
        [1]:'否'
      },
      punchWayMap:{
        [1]:'扫码打卡',
        [2]:'自主打卡'
      },
       unitMap:{
        [1]:'件',
        [2]:'袋',
        [3]:'车',
        [4]:'吨',
      },
      statusMap:{
        [1]:'未开始',
        [2]:'进行中',
        [3]:'已结束'
      },
      detail:{},
      form:{},
      valuationType:null,
      price:null,
      classTaskPriceLimitVOList:[],
      workList:[],
        currentPage:1,
        pageSize:10,
        total:0,
    }
  },
  filters: {
   
  },
  mounted() {
    const {classTaskId} = this.$route.query;
    this.handleGetDetail(classTaskId);
  },
  methods: {
      statusFormatter(row, column, cellValue, index) {
              let status = ''
              switch (Number.parseInt(cellValue)) {
                case 1:
                  status = '生效中'
                  break
                case 2:
                  status = '待生效'
                  break
                case 3:
                  status = '已失效'
                  break
                case 4:
                  status = '已作废'
                  break;
              }
              return status
            },
      handleCurrentChange(val){
          this.currentPage = val;
          this.getHistoryList();
      },
      getHistoryList(){
          let param = {
              classTaskId:this.$route.query.classTaskId,
              pageNum:this.currentPage,
              pageSize:this.pageSize,
          };
          this.$api.classTaskPriceLogList(param).then(res=>{
              let { data,respCode } = res;
              if( respCode === 0 ){
                  if( data&&data.list ){
                      data.list.forEach(ele=>{
                          ele.formatText = this.GlobalPriceFilter.priceFilter(ele.price);
                      });
                      this.gridData = data.list;
                      this.total = data.total;
                  }else{
                      this.gridData = [];
                      this.total = 0;
                  }
              }else{
                  this.total = 0;
              }
              
          }).catch(err=>{
              console.log('err',err);
          })
      },
      popAmount(){
          this.dialogTableVisible = true;
          this.getHistoryList();
      },
    handleGetDetail(classTaskId){
      this.$api.getClassTaskDetail({classTaskId}).then(res=>{
        this.detail = res.data;
          this.checkStatus = this.detail.needPriceCheck;
          let settlementType = this.detail.settlementType;
          this.settlementTypeText = this.settlementTypeMap[settlementType];
          this.priceText = this.GlobalPriceFilter.priceFilter(this.detail.price);
        this.classTaskConfirmVOList = this.detail.classTaskConfirmVOList;
//        this.handleDealPrice(this.detail.price); 
          this.handleClassTaskPriceLimitVOList(this.detail.classTaskPriceLimitVOList);
        this.hendleDealWorkList(this.detail.classTaskPriceLimitVOList);          
      });
    },
    handleDealPrice(price){
      let $price = JSON.parse(price);
      this.valuationType = $price.valuationType;
      this.price = $price;
    },
    handleClassTaskPriceLimitVOList(classTaskPriceLimitVOList){
      let idList = classTaskPriceLimitVOList.map(it=>it.industryName);
      this.classTaskPriceLimitVOList = [...new Set(idList)];
    },
    hendleDealWorkList(classTaskPriceLimitVOList){
      this.workList=classTaskPriceLimitVOList.map(it=>{
        let $price = JSON.parse(it.priceLimit).price[0]
        return {
          industryName:it.industryName,
          ...$price
        }
      })
    }
  },
}
</script>

<style scoped lang="scss">
     .setHeight {
            height: 56px;
            overflow: hidden;
        }
    .checkAmount {
        color: #e84518;
        cursor: pointer;
    }
     .setPagnation {
        text-align: center;
        padding-top: 10px;
    }
.info-item {
  margin: 20px 0px;
}
.box-body-item-title {
  font-size: 18px;
  font-weight: normal;
  font-stretch: normal;
  letter-spacing: 0px;
  color: #262626;
  line-height: 40px;
}
.box-body-item {
  margin-top: 40px;
}
.table {
  padding: 20px;
}
.setting-table {
  width: 100%;
}
thead {
  width: 100%;
}
.rant-input {
  width: 180px;
}
.setting-table {
  td {
    background-color:#fff
  }
}
.table-info .t-div{
  font-size: 14px;
    font-weight: normal;
    font-stretch: normal;
    letter-spacing: 0px;
    color: #5C5C5C;
    margin-top: 16px;
    line-height: 20px;
}
</style>
<style lang="scss">
    .outclassBaseInfoCon3 {
        .lockTable {
            overflow-y: scroll;
        }
        .tableDiaglog {
            .el-dialog {
                height: 600px !important;
                position: absolute;
                margin: auto !important;
                left: 0;
                right: 0;
                top: 0;
                bottom: 0;
            }
            .el-dialog__body {
                padding: 0;
                padding-top: 10px;
                height: 500px !important;
            }
        }
        .el-table {
            .cell {
                text-align: center;
            }
        }
    }
</style>