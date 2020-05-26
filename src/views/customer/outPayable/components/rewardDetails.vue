<template>
  <div class="rewardDetailCon">
    <h3 class="sche-title">奖惩明细 - {{fromParams.outsourcingCusName || '' }} - {{fromParams.realNameAlias}} - {{fromParams.batchNumber}}</h3>
    <div class="headTitleCon" >
      <div class="subTitle">
       <span>合计{{totalAmount | moneyFormat}}元</span>
      </div>
    </div>
    <div class="table-box">
      <el-table class="table-outline" :data="tableData" emptyText="暂无相关明细" style="width: 100%;">
          <el-table-column label="奖惩类型" prop="rewardPunishTypeName"></el-table-column>
          <el-table-column label="奖惩事项" prop="note"></el-table-column>
          <el-table-column label="金额(元)" prop="amount"></el-table-column>
          <el-table-column label="提交人" prop="commitorName"></el-table-column>
          <el-table-column label="提交日期" prop="updatedAt"  :formatter="existFormatterDate"></el-table-column>
          <el-table-column label="当前审批人" prop="classManagerName" :formatter="onForPeople"></el-table-column>
          <el-table-column label="状态" prop="status"  :formatter="existFormatter"></el-table-column>
      </el-table>
      <div class="pagination-container">
        <el-pagination class="pagebox" layout="total,prev, pager, next" @current-change="handleCurrentChange" :page-size="pageSize" :current-page="currentPage" :total="total" :page-count="pageCount">
        </el-pagination>
      </div>
    </div>
  </div>
</template>
<script>
export default {
    data() {
        return {
            currentPage: 1,
            pageCount: 0,
            pageSize: 20,
            total: 0,
            fromParams:{},
            tableData: [],
            totalAmount:0,
        }
    },
    mounted() {
        this.fromParams = this.$route.query;
        console.log(this.fromParams)
        this.getData();
    },
    filters:{
        moneyFormat(value){            
            if ((toString.call(value) === '[object Null]') || (toString.call(value) === '[object Undefined]')) {
                return 0;
            } else {
                let fix = (Math.round(+value + 'e' + 2) / Math.pow(10, 2)).toFixed(2);
                return fix;
            }
        },
    },
    methods: {
      getData() {
          let _this = this;
          console.log(this.$route.query,'query')
          let params = {
              pageNum:_this.currentPage,
              pageSize:20,
              talentId:_this.fromParams.talentId,
              batchNumber:_this.fromParams.batchNumber,
              payType:_this.fromParams.payType,
              payStatus:_this.fromParams.payStatus,
              showOutsourcing:true,
              outsourcingCusId: this.$route.query.outsourcingCusId || '',
              badDebt:this.$route.query.badDebt || '1',
          }
          this.$api.getTalentRP(params).then(res=>{
              if (res.data.respCode === 0) {
                  if (res.data.data.list && res.data.data.list.length > 0) {
                      _this.tableData = Array.from(res.data.data.list);
                      _this.total = res.data.data.total;
                      _this.pageCount = res.data.data.pages;
                      for (let item of _this.tableData) {
                          _this.totalAmount += item.amount
                      }
                  }else{
                      _this.tableData = []
                      _this.total = 0
                      _this.pageCount = 0
                      _this.totalAmount = 0
                  }
              }
              console.log(res)
          }).catch(err=>{
              console.log(err)
          })
      },
        existFormatterDate(row, column, cellValue){
            if(cellValue){
                return cellValue.substring(0,10)
            }else{
                return '无'
            }
        },
        onForPeople(row, column, cellValue){
            if(cellValue){
                return cellValue
            }else{
                return '--'
            }
        },
      existFormatter(row, column, cellValue){
          if(cellValue == '1'){
              return "待审核"
          }else if(cellValue == '2'){
              return '已同意'
          }else if(cellValue == '3'){
              return '已驳回'
          }else if(cellValue == '4'){
              return '已撤回'
          }else if(cellValue == '5'){
              return '已撤销'
          }
      },
        handleCurrentChange(val) {
            this.currentPage = val
            this.getData()
        },
  },
}
</script>
<style lang="scss">
    .rewardDetailCon {
        .el-table .cell {
            text-align: center;
        }
    }
</style>
<style scoped lang="scss">
    .headTitleCon {
        background-color:#fff;
        border:1px solid #E6E7EB;
        margin-top:18px;
        padding-left: 36px;
    }
    .operate {
        cursor: pointer;
        img {
            height: 18px;
            width: 18px;
            vertical-align: -5px;
            margin-right: 10px;
        }
    }
    .table-box {
        background-color: #fff;
    }
    .subTitle {
        height:50px;
        line-height:50px;
        font-size:12px;
    }
    .sche-title {
      text-align: center;
      font-size: 20px;
    }
</style>
