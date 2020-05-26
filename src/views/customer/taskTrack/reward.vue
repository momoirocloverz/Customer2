<template>
  <div class="rewardtemplate">
    <div style="margin-top: 40px">
        <el-table :data="tableData"  :span-method="objectSpanMethod"  border  style="width: 100%; margin-top: 20px">
          <el-table-column  prop="industryName"  label="工种"></el-table-column>
          <el-table-column  label="结算方式">
              <template v-slot="scope">
                  <div class="settlementTypeCon">
                      <div class="settlementText">{{ scope.row.settlementType | formatSettle }}</div>
                      <div class="valuationText">{{ scope.row.valuationType | valuationTypeFilter }}</div>
                    </div>
              </template>
            </el-table-column>
          <el-table-column  prop="sex" label="性别" :formatter="genderFormat"></el-table-column>
          <el-table-column label="报酬设置">
              <template v-slot="scope">
                <div>{{ priceFormat(scope.row) }}</div>
              </template>
            </el-table-column>
        </el-table>
    </div>
  </div>
</template>

<script>
export default {
  name: "reword",
  data() {
    return {
      form: [],
      visible: false,
      salary: [],
        tableData:[],
    }
  },

  filters: {
    formatSettle(val) {
      if (val == 1) {
        return '日结'
      } else if (val == 2) {
        return '月结'
      } else if (val == 3) {
        return ''
      } else if (val == 4) {
        return '周结'
      } else {
        return ''
      }
    },
    valuationTypeFilter(val) {
      let result = ''
      switch (Number(val)) {
        case 1:
          result = '计时'
          break;
        case 8:
          result = '日固定'
          break;
        case 2:
        case 3:
        case 4:
          result = '计量'
          break;
        case 5:
        case 6:
        case 7:
          result = '计时 + 计量'
          break;
        default:
          break;
      }
      return result
    },
  },
  mounted() {
    this.getaskSalaryList()
  },
  methods: {
      genderFormat(row, column, cellValue, index){
          if( cellValue == 1 ){
              return '男';
          }else{
              return '女';
          }
      },
      priceFormat(val){
          let hi = this.GlobalPriceFilter.pieceFilter(val);
          return hi;
      },
      objectSpanMethod({ row, column, rowIndex, columnIndex }) {
          if (columnIndex === 1) {
              if (rowIndex % 2 === 0) {
                return {
                  rowspan: 2,
                  colspan: 1
                };
              } else {
                return {
                  rowspan: 0,
                  colspan: 0
                };
              }
          }
          if (columnIndex === 0) {
              if (rowIndex % 6 === 0) {
                return {
                  rowspan: 6,
                  colspan: 1
                };
              } else {
                return {
                  rowspan: 0,
                  colspan: 0
                };
              }
          }
      },
    getaskSalaryList() {
      const params = {
        classTaskId: this.$route.query.classTaskId,
      }
      this.$api.getClassTaskDetail(params).then((res) => {
          
             let { data,respCode } = res;
          if( respCode === 0 ){
              console.log( 'data',data.classTaskPriceVOList );
              
              let temp = data.classTaskPriceVOList.map(ele=>{
                  console.log('ele',ele);
                  return {
                      industryName:ele.industryName,
                      industry:ele.industry,
                      salary: ele.salary ? JSON.parse(ele.salary) : [],
                  }
              })              
              console.log( 'temp',temp );
              let empty = [];
               temp.forEach(ele=>{
                      ele.salary.forEach(sub=>{
                          sub.price.forEach(third=>{
                              third.industryName = String(ele.industryName);
                              third.settlementType = String(sub.settlementType);
                              third.unit = sub.unit ? sub.unit : '';
                              third.valuationType = String(sub.valuationType);
                              empty.push(third);
                          })
                      });
                  });    
              console.log( 'empty',empty );
              this.tableData = empty;
          }
      }).catch((error) => {
      });
    },
  }
}
</script>

<style scoped lang="scss">
      .settlementTypeCon {
            display: flex;
            justify-content: center;
            align-content: center;
            align-items: center;
            .valuationText {
                padding: 3px 6px;
                border-radius: 3px;
                border: 1px solid #e84518;
                margin-left: 5px;
            }
        }
</style>
<style lang="scss">
    .rewardtemplate {
        .el-table {
            .cell {
                text-align: center;   
                padding-left: 10px;
            }
        }
    }
</style>