<template>
    <div style="background: #F2F2F5 !important;">
        <p class="p-style">{{ importSummaryMsg }}</p>
        <div>
            <el-table :data="importDetailErrorMsgList" empty-text="暂无相关信息">
                <el-table-column label="序号（excel表格序号）" prop="number" show-overflow-tooltip align="center" min-width="20%"></el-table-column>
                <el-table-column label="失败原因" prop="errorMsg" show-overflow-tooltip align="center" min-width="80%"></el-table-column>
            </el-table>
        </div>
    </div>
</template>
<script>
export default {
    data(){
        return {
            importSummaryMsg: '',
            importDetailErrorMsgList: [],
        }
    },
    beforeDestroy(){
        localStorage.removeItem('importSummaryMsg');
        localStorage.removeItem('importDetailErrorMsgList');
    },
    created(){        
        this.importSummaryMsg = localStorage.getItem('importSummaryMsg')
        this.importDetailErrorMsgList = JSON.parse(localStorage.getItem('importDetailErrorMsgList'))
    },
    mounted(){
        
    },
    methods: {
        
    }
}
</script>
<style>
.p-style{
    font-size: 16px;
    color: #333333;
    line-height: 34px;
    height: 34px;
    text-align: center;
}
</style>


