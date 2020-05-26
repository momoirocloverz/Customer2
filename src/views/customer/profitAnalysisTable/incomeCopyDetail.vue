<template>
    <div class="pb20">
        <div class="headerCon">
            <div>收入明细&nbsp;</div>
            <div>{{$route.query.startDate}}~{{$route.query.endDate}} </div>
            <div>&nbsp;{{$route.query.name}}</div>
        </div>
        <el-table :data="tableData" empty-text="暂无相关信息">
            <el-table-column label="班务" prop="classTaskName" show-overflow-tooltip align="center"></el-table-column>
            <el-table-column label="工时" prop="cusSettlementHours"  :formatter="float1Format" show-overflow-tooltip align="center"></el-table-column>
            <el-table-column label="产量" align="center">
                <el-table-column label="件" prop="jian" show-overflow-tooltip align="center" min-width="50">
                    <template slot-scope="scope">
                        {{scope.row.jian}}
                    </template>
                </el-table-column>
                <el-table-column label="袋" prop="dai" show-overflow-tooltip align="center" min-width="50">
                    <template slot-scope="scope">
                        {{scope.row.dai}}
                    </template>
                </el-table-column>
                <el-table-column label="车" prop="che" show-overflow-tooltip align="center" min-width="50">
                    <template slot-scope="scope">
                        {{scope.row.che}}
                    </template>
                </el-table-column>
                <el-table-column label="吨" prop="dun" show-overflow-tooltip :formatter="float2Format" align="center" min-width="50"></el-table-column>
            </el-table-column>
            <el-table-column label="单价" min-width="200" prop="price" :formatter="forPrice" show-overflow-tooltip align="center"></el-table-column>
            <el-table-column label="收入金额(元)" :formatter="float2Format" prop="inCome" show-overflow-tooltip align="center"></el-table-column>
        </el-table>
    </div>
</template>
<script>
    export default {
        data() {
            return {
                tableData: [],
                info:{},
            }
        },       
        mounted() {
            this.info = Object.assign({},this.$route.query)
            this.getData()
        },
        methods: {
            float2Format(row, column, cellValue) {
                if ((toString.call(cellValue) === '[object Null]') || (toString.call(cellValue) === '[object Undefined]')) {
                      return 0;
                  } else {
                      let fix = (Math.round(+cellValue + 'e' + 2) / Math.pow(10, 2)).toFixed(2);
                      return fix;
                  }
            },
            float1Format(row, column, cellValue){
                 if ((toString.call(cellValue) === '[object Null]') || (toString.call(cellValue) === '[object Undefined]')) {
                      return 0;
                  } else {
                      let fix = (Math.round(+cellValue + 'e' + 1) / Math.pow(10, 1)).toFixed(1);
                      return fix;
                  }
            },
            getData() {
                this.$api.getInComeDetailByManager(this.info).then(res => {
                    if (res.data.respCode == 0) {
                        this.tableData = Array.from(res.data.data);
                    }
                }).catch(err => {
                    console.log(err);
                })
            },
            forPrice(val) {
                return this.GlobalPriceFilter.priceFilter(val.price);
            },
        }
    }
</script>
<style lang="scss" scoped>
     .headerCon {
        display: flex;
        justify-content: center;
        align-content: center;
        align-items: center;
         font-size: 18px;
         margin-bottom: 30px;
    }
</style>