<template>
    <div class="marketReceiveNormalDetailCon">        
        <div class="firstLine">
            <div>合计1000小时，100件，0袋，0吨，0车</div>
        </div>
        <div class="tableCon">
            <el-table :data="tableData" style="width: 100%">
                <el-table-column prop="date" label="排班日期"></el-table-column>
                <el-table-column prop="date" label="排班工时"></el-table-column>
                <el-table-column prop="date" label="排班产量"></el-table-column>
                <el-table-column prop="date" label="任务单价"></el-table-column>
                <el-table-column prop="date" label="金额"></el-table-column>
                <el-table-column prop="date" label="操作">
                </el-table-column>
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
        name: "marketReceiveNormalDetail",
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
    .marketReceiveNormalDetailCon {
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
    .marketReceiveNormalDetailCon {
        .el-table .cell {
            text-align: center;
            padding-left: 10px;
        }
    }
</style>