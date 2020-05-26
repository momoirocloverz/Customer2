<template>
    <div class="marketReceiveNotConfirmCon">        
        <div class="firstLine">
            <div>这些排班未客户结算确认，对应任务待付批次暂不可付</div>
        </div>
        <div class="tableCon">
            <el-table :data="tableData" style="width: 100%">
                <el-table-column prop="date" label="付款任务批次"></el-table-column>
                <el-table-column prop="date" label="排班"></el-table-column>
                <el-table-column prop="date" label="班务经理"></el-table-column>               
            </el-table>
            <div class="pagCon">
                <el-pagination class="pagebox" layout="total , prev, pager, next, jumper" :total="total" :current-page.sync="pageNum" @current-change="handleCurrentChange" :page-size="pageSize">
                </el-pagination>
            </div>
        </div>
    </div>
</template>
<script>
    export default {
        name: "marketReceiveNotConfirm",
        data() {
            return {
                tableData:[],
                total:0,
                pageNum:0,                
                pageSize:10,
            }
        },
        mounted() {
        },
        methods: {
            handleCurrentChange(){
                
            },
        },
    }
</script>
<style scoped lang="scss">
    .marketReceiveNotConfirmCon {
        .firstLine {
            background-color: #fff;
            display: flex;
            justify-content: flex-start;
            align-content: center;
            align-items: center;
            padding: 20px;
            box-sizing: border-box;
        }
        .pagCon {
            padding-top: 20px;
            padding-bottom: 20px;
            background-color: #fff;
            display: flex;
            justify-content: center;
            align-content: center;
            align-items: center;
        }
    }
</style>
<style lang="scss">
    .marketReceiveNotConfirmCon {
        .el-table .cell {
            text-align: center;
            padding-left: 10px;
        }
    }
</style>