<template>
  <div class="deductionsDetailsCon">
    <div class="table-box">
      <el-table class="table-outline" :data="tableData" emptyText="暂无相关明细" style="width: 100%;">
        <el-table-column label="付款时间" prop="payTime"  ></el-table-column>
        <el-table-column label="付款方式" prop="payWay"  :formatter="paytype"></el-table-column>
         <el-table-column label="付款金额" prop="amount" ></el-table-column>
      </el-table>
      <div class="pagination-container">
        <el-pagination class="pagebox" layout="total,prev, pager, next" @current-change="handleCurrentChange" :page-size="pageSize" :current-page="currentPage" :total="tableData.length" :page-count="pageCount">
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
            tableData: [],
            totalAmount:0,
            detailIcon:require('@/assets/icons/btnicons/delete.png'),
            viewIcon:require('@/assets/icons/btnicons/view.png'),
            fromParams:{},
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
      paytype(row,cell,val) {
        if (val == '1') {
          return '线下'
        } else if (val == '2') {
          return '线上'
        } else if (val == '4') {
          return '薪福多'
        } else if (val == '5') {
          return '薪企云服'
        } else if (val == '6') {
          return JSON.parse(localStorage.userInfo).customerShortName || '--'
        }else {
          return '--'
        }
      },
      getData() {
          let _this = this;
          let params = {
              pageNum:_this.currentPage,
              pageSize:20,
              talentId:_this.fromParams.talentId,
              batchNumber:this.fromParams.batchNumber,
              payType: this.fromParams.payType,
              customerId:this.fromParams.customerId
          }
          console.log(params)
          this.$api.salarySheetPayRecordDetail(params).then(res=>{
              if(res.data.respCode === 0){
                      this.tableData = res.data.data.list||[];
                      // this.totalAmount=0;
                      // for(let item of this.tableData){
                      //     this.totalAmount += item.amount
                      // }
                 
              }
              console.log(res)
          }).catch(err=>{
              console.log(err)
          })
      },
      existFormatter(row, column, cellValue){
          if(cellValue){
              return cellValue
          }else{
              return '无'
          }
      },
      moneyFormat(row, column, cellValue){        
          if( (toString.call(cellValue) === '[object Null]')||(toString.call(cellValue) === '[object Undefined]')  ){
              return '无'
          }else{
              let fix = (Math.round(+cellValue + 'e' + 2) / Math.pow(10, 2)).toFixed(2);
              return fix;
          }
        },
        handleCurrentChange(val) {
            this.currentPage = val
            this.getData()
        },
        deleteDetail(row){
            let _this =this;
            if (row.status == '3') {
                return _this.$message.warning("当前批次已发放，无法删除!")
            }
            let params = {
                adjustmentId:row.id
            }
            this.$confirm('是否删除?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                    }).then(() => {
                        this.$api.adjDelete(params).then(res=>{
                    if(res.respCode === 0){
                            _this.getData()
                            this.$message({
                                type: 'success',
                                message: '删除成功!'
                            });
                        }
                    }).catch(err=>{
                    })
                   
                    }).catch(() => {
                    // this.$message({
                    //     type: 'info',
                    //     message: '已取消删除'
                    // });          
                    });
            
        },
        goToDetail(row){
          let item = row;
          if(row.typeName == "保险费"){
              const { href } = this.$router.resolve({
                  path:'/payable/insuranceDetails',
                  query:{...item}
              });
              window.open(href, '_blank');
          }else if(row.typeName == "系统使用费"){
              const { href } = this.$router.resolve({
                  path:'/payable/accessFee',
                  query:{...item}
              });
              window.open(href, '_blank');
          }
        },
  },
}
</script>
<style lang="scss">
    .deductionsDetailsCon {
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