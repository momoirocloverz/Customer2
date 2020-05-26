<template>
  <div>
    <h3 class="sche-title">{{$route.query.title}} {{$route.query.batchNumber}} 待审核奖惩</h3>
    <div class="table-box back-white">
      <div class="infoCon">这些奖惩审核通过后才能成功付款</div>
      <el-table class="table-outline" :data="tableData" emptyText="暂无相关明细" style="width: 100%;">
        <el-table-column label="奖惩对象" prop="talentName" align="center" min-width=""></el-table-column>
        <el-table-column label="奖惩金额" prop="amount" align="center" min-width=""></el-table-column>
        <el-table-column label="奖惩类型" prop="type" :formatter="forType" align="center" min-width=""></el-table-column>
        <el-table-column label="奖惩事项" prop="note" align="center" min-width=""></el-table-column>
        <el-table-column label="奖惩收入批次" prop="" align="center" min-width="">
          <template v-slot="scope">
            {{$route.query.batchNumber}}
          </template>
        </el-table-column>
        <el-table-column label="提交人" prop="commitorName" align="center" min-width=""></el-table-column>
        <el-table-column label="审批人" prop="managerName" align="center" min-width=""></el-table-column>
        <el-table-column label="提交日期" prop="createdAt" align="center" min-width=""></el-table-column>
      </el-table>
      <div class="pagination-container">
        <el-pagination class="pagebox" layout="prev, pager, next" @current-change="handleCurrentChange" :current-page="currentPage" :page-count="pageCount">
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
      tableData: [],
      fromParams:{}
    }
  },
  watch:{},
  filters:{},
  mounted() {
    this.fromParams = this.$route.query
    this.getScheduingList()
  },
  methods: {
    forType(val){
      switch (Number(val.type)) {
        case -1:
          return '考勤处罚';
          break;
        case -2:
          return '现场管理处罚';
          break;
        case -3:
          return '质量考核处罚';
          break;
        case -4:
          return '其他处罚';
          break;
        case 1:
          return '良好表现奖励';
          break;
        case 2:
          return '补贴';
          break;
        case 3:
          return '其他奖励';
          break;
        case 4:
          return '测试奖励';
          break;
        default:
          return '其他处罚';
          break
      }
    },
    getScheduingList() {
      let params = {
        pageNum: this.currentPage,
        pageSize: this.pageSize,
        batchNumber:this.fromParams.batchNumber,
        payType:this.fromParams.payType,
        showOutsourcing:true,
        outsourcingCusId: this.$route.query.outsourcingCusId || '',
      }
      this.$api.listBySalaryIds(params).then(res => {
        console.log(res)
        if (res.respCode == 0) {
          if (res.data.list) {
            this.tableData = res.data.list
            this.pageCount = res.data.pages
          }
        }
      }).catch(err=>{
        console.log(err)
      })
    },
    handleCurrentChange(val) {
      this.currentPage = val
      this.getScheduingList()
    }
  },

}
</script>
<style scoped lang="scss">
  .no-pro{
    padding: 22px 34px 0;
    .no-date{
      display: flex;
      align-items: center;
      .radio-search{

      }
      .no-date-cus{
        display: flex;
        justify-content: start;
        align-items: center;
        padding-left: 40px;
        .no-date-picker{
          width: 135px;
        }
        .no-pro-btn{
          padding: 0;
          background-color: #FFEFEA;
          color: #E84518;
          height: 28px;
          line-height: 28px;
          width: 72px;
          margin-left: 12px;
          border-radius: 0;
          border: 1px solid #F7BEB2;
        }
        .span-{
          color: #ACACB5;
          padding: 0 10px;
        }
      }
    }
  }
  .infoCon {
    height: 50px;
    width: 100%;
    color: #8C8C8C;
    font-size: 12px;
    padding-left: 30px;
    box-sizing: border-box;
    line-height: 50px;
    border-top:1px solid #E6E7EB;
    border-bottom:1px solid #E6E7EB;
  }
  .sche-title {
    text-align: center;
    font-size: 20px;
    font-stretch: normal;
    line-height: 2;
    letter-spacing: 1px;
    color: #262626;
    padding-top:5px;
    font-weight: bold;
    margin-bottom: 20px;
  }
</style>
