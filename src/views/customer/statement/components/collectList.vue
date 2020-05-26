<template>
    <div>
        <h1 style="color:#383838;font-size:14px;font-style:MicrosoftYaHei;padding:20px 0 20px 30px;background: #ffffff;border-bottom:1px solid #EAEDF4;">班务利润汇总表{{month}}</h1>
        <el-table :data="tableData" empty-text="暂无相关零工信息" show-summary class="head-title">
                <el-table-column  label="班务经理" prop="managerName" show-overflow-tooltip align="center" min-width="80"></el-table-column>
                <el-table-column label="收入" align="center">
                    <el-table-column label="本月" prop="totalIn" show-overflow-tooltip align="center" min-width="80">
                    
                    </el-table-column>
                    <el-table-column label="年度累计" prop="yearTotalIn" show-overflow-tooltip align="center" min-width="80">
                    
                    </el-table-column>
                </el-table-column>
                <el-table-column label="支出" align="center">
                    <el-table-column label="本月" prop="totalOut" show-overflow-tooltip align="center" min-width="80">
                    
                    </el-table-column>
                    <el-table-column label="年度累计" prop="yearTotalOut" show-overflow-tooltip align="center" min-width="80">
                    
                    </el-table-column>
                </el-table-column>
                <el-table-column label="利润" align="center">
                    <el-table-column label="本月" prop="profit" show-overflow-tooltip align="center" min-width="80">
                    
                    </el-table-column>
                    <el-table-column label="年度累计" prop="yearProfit" show-overflow-tooltip align="center" min-width="80">
                    
                    </el-table-column>
                </el-table-column>
        </el-table>
    </div>
</template>

<script>
export default {
    data(){
        return {
            tableData: [],
            month: ''
        }
    },
    created(){
        this.month = this.$route.params.month
    },
    mounted(){
        this.getData()
    },
    methods: {
        getData(){
            let params = {
                month: this.month
            }
            this.$api.profitTotalDetailQuery(params).then(res => {
                // console.log(res)
                if(res.respCode == 0){
                    if(res.data){
                        this.tableData = res.data
                    }
                }
            }).catch()
        }
    }
}
</script>

<style >
    .head-title .el-table__header tr th.is-leaf{
        border:1px solid #EBEEF5;
    }
</style>
