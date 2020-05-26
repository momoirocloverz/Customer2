<template>
  <div class="outSourceChargeCon">
    <div class="table-box back-white">
      <el-table class="table-outline" :data="tableData" emptyText="暂无相关明细" style="width: 100%;">
        <el-table-column label="充值批次" prop="orderNo"  :formatter="timeFormatter"></el-table-column>
        <el-table-column label="外包费用" prop="outSource"  :formatter="moneyFormat" ></el-table-column>
        <el-table-column label="付款手续费" prop="outSourceFee" :formatter="moneyFormat" ></el-table-column>       
        <el-table-column label="转账金额" prop="recharge" :formatter="moneyFormat" ></el-table-column>
          <el-table-column label="状态" prop="outSourceStatus" :formatter="statusFormat" ></el-table-column>       
        <el-table-column label="操作" >
            <template  v-slot="scope">                
                <div class="popOut" v-if="scope.row.outSourceStatus == 1" @click="popOut(scope.row)"><img class="operateIcon" :src="operateIcon">去转账</div>
            </template>
        </el-table-column>
      </el-table>
      <div class="pagination-container" >
        <el-pagination class="pagebox" layout="total,prev, pager, next" @current-change="handleCurrentChange" :current-page="currentPage" :page-count="pageCount" :total="total" v-if="total"></el-pagination>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      total: 0,
      currentPage: 1,
      pageCount: 0,
      pageSize: 10,
      tableData: [
//          {outSourceStatus:1}
      ],
        operateIcon:require('@/assets/icons/pay@2x.png'),
    }
  },
    mounted() {
        this.getDataList(); 
    },
  methods: {
      popOut(row){
          this.$emit('outSourceBridge',{id:row.id});
      },
    getDataList() {   
        let params = {
            pageNum: this.currentPage,
            pageSize: this.pageSize,            
        };
       this.$api.outsourceRechargeList(params).then(res=>{           
           let { respCode,data } = res;
           if( respCode === 0 ){
               if( data.list ){
                   if( data.list.length ){
                       this.tableData = data.list;
                       this.total = data.total;
                   }else{
                       this.tableData = [];
                       this.total = data.total;
                   }
               }else{
                   this.tableData = [];
//                   this.tableData = [{outSourceStatus:1}];
                   this.total = data.total;
               }
           }           
       }).catch(err=>{
           console.log( 'err',err );
       })
    },
   
    handleCurrentChange(val) {
      this.currentPage = val
      this.getDataList();
    },
    timeFormatter(row, column, cellValue){
      if(cellValue){
        return cellValue.substr(0,16)
      }else{
        return '无'
      }
    },
      statusFormat(row, column, cellValue){
          switch (cellValue) {
              case 1:
                  return '待转账'
                  break;
               case 2:
                  return '已转账'
                  break;
              case 3:
                  return '已入账'
                  break;
              case 4:
                  return '已取消'
                  break;
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
    existFormatter(row, column, cellValue){
      if(cellValue){
        return cellValue;
      }else{
        return '无'
      }
    }, 
  },  
}
</script>
<style scoped lang="scss">
    .outSourceChargeCon {
        background-color:#f2f2f5;    
        .table-box {
            padding-top: 18px;
        }   
        .popOut {
            cursor: pointer;
        }
        .operateIcon {
            height: 18px;
            width: 18px;
            vertical-align: -5px;
            margin-right: 10px;
        }
    }
</style>
<style lang="scss">
    .outSourceChargeCon {   
        .el-table__header-wrapper {
            border-top: 1px solid #E4E7ED;
        }
        .el-table .cell {
            text-align: center;
            padding-left: 10px;
        }
    }
</style>