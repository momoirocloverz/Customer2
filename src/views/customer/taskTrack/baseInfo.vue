<template>
  <div class="baseInfo10">
    <div class="box-body-item">
      <div class="table-info info-item">
        <div class="table-info-col1"><span>所属任务</span></div>
        <div class="table-info-col2"><span>{{detail.belongToTaskName}}</span></div>
        <div class="table-info-col1"><span>状态</span></div>
        <div class="table-info-col2"><span>{{statusMap[detail.status]}}</span></div>
        <div class="table-info-col1"><span>班务经理</span></div>
        <div class="table-info-col2"><span>{{detail.managerName}}</span></div>
        <div class="table-info-col1"><span>开始日期</span></div>
        <div class="table-info-col2"><span>{{ timeFilterFun(detail.startTime) }}</span></div>
        <div class="table-info-col1"><span>结束日期</span></div>
        <div class="table-info-col2 text-overflow">
          <span>{{ timeFilterFun(detail.endTime) }}</span>
        </div>
        <div class="table-info-col1"><span>客户核定人数</span></div>
        <div class="table-info-col2"><span>{{detail.cusAuthorizedNumber}}</span></div>
        <div class="table-info-col1"><span>生产核定人数</span></div>
        <div class="table-info-col2"><span>{{detail.authorizedNumber}}</span></div>
        <div class="table-info-col1"><span>打卡地点</span></div>
        <div class="table-info-col2 setHeight">
            <span>
                <el-tooltip class="item" effect="dark" :content="detail.workingPlace" placement="top-start">
                  <span class="text-overflow">
                    {{detail.workingPlace}}
                  </span>
                </el-tooltip>
            </span>
        </div>
        <div class="table-info-col1"><span>核算单价</span></div>
        <div class="table-info-col2 text-overflow setHeight">
            <span>
                <el-tooltip class="item" effect="dark" :content="priceText" placement="top-start">
                  <span class="text-overflow">
                    {{priceText}}
                  </span>
                </el-tooltip>
            </span>
        </div>
        <div class="table-info-col1"><span>结算方式</span></div>
        <div class="table-info-col2 text-overflow"><span>{{settlementTypeText}}</span></div>
        <div class="table-info-col1"><span>上班时间</span></div>
        <div class="table-info-col2"><span>{{simpleTimer(detail.workStartTime)}}</span></div>
        <div class="table-info-col1"><span>下班时间</span></div>
        <div class="table-info-col2 text-overflow">
          <span>{{timeOutDateMap[detail.endWorkType]}}{{simpleTimer(detail.workEndTime)}}</span>
        </div>
        <div class="table-info-col1"><span>打卡方式</span></div>
        <div class="table-info-col2 text-overflow"><span>
              <span class="text-overflow">
                {{punchWayMap[detail.punchWay]}}
              </span>
          </span></div>
        <div class="table-info-col1"><span>是否人脸打卡</span></div>
        <div class="table-info-col2">
          <span>{{isRecognitionMap[detail.isRecognition]}}</span>
        </div>
        <div class="table-info-col1"><span>打卡范围</span></div>
        <div class="table-info-col2">
          <span> {{detail.punchRange}}米</span>         
        </div>
        <div class="table-info-col1"><span>工种要求</span></div>
        <div class="table-info-col2 text-overflow">
          <span> {{classTaskPriceLimitVOList.join('、')}}</span>
        </div>
        <div class="table-info-col1"><span>工种价格上限控制</span></div>
        <div class="table-info-col2 text-overflow">          
            <span class="text-overflow">{{uppeLimitMap[detail.uppeLimit]}}</span>
        </div>
        <div class="table-info-col1"><span>创建时间</span></div>
        <div class="table-info-col2"><span>{{ timeFilterFun(detail.createdAt) }}</span></div>
      </div>
    </div>
    <div class="box-body-item">
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
  </div>
</template>
<script>
export default {
  name: "myTaskBaseInfo",
  data() {
    return {
        settlementTypeText:'',
        settlementType:'',
        settlementTypeMap:{
            2:'月结',
            4:'周结',
            1:'日结'
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
      price:null,
      classTaskPriceLimitVOList:[],
      workList:[],
        priceText:'',
    }
  },
  mounted() {
    const {classTaskId} = this.$route.query;
    this.handleGetDetail(classTaskId);      
  },
  methods: {
      simpleTimer(val){
          if(val){
              return val.substring(0,5);
          }else{
              return ''
          }          
      },
    handleGetDetail(classTaskId){        
      this.$api.getClassTaskDetail({classTaskId}).then(res=>{
          let { data,respCode } = res;
          if( respCode === 0 ){
              this.detail = data;
              this.priceText = this.GlobalPriceFilter.priceFilter(this.detail.price);
              let settlementType = this.detail.settlementType;
              this.settlementTypeText = this.settlementTypeMap[settlementType];
              this.classTaskConfirmVOList = this.detail.classTaskConfirmVOList;
              this.handleClassTaskPriceLimitVOList(this.detail.classTaskPriceLimitVOList);
              this.hendleDealWorkList(this.detail.classTaskPriceLimitVOList);
          }
      }).catch(err=>{
          console.log('err',err);
      })
    },
      timeFilterFun(val){
          if( val ){
              return this.Moment(val).format("YYYY-MM-DD HH:mm");
          }else{
              return '永久'
          }
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
    .baseInfo10 {
        .setHeight {
            height: 56px;
            overflow: hidden;
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
    }
</style>