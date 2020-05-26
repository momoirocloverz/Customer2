<template>
    <div class="marketReceiveNotConfirmCon"> 
        <div class="nameCon">{{name}}</div> 
        <div class="firstLine">
            <div>这些排班未客户结算确认，对应任务待付批次暂不可付</div>
        </div>
        <div class="tableCon">
            <el-table :data="tableData" style="width: 100%">
                <el-table-column prop="batchNumber" label="付款任务批次"></el-table-column>
                <el-table-column prop="schedulingName" label="排班"></el-table-column>
                <el-table-column prop="managerNameAlias" label="班务经理"></el-table-column> 
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
                pageNum:1,                
                pageSize:10,
                name:'未客户结算确认的排班',
                customerId:'',
            }
        },
        mounted() {
            this.analyseLocalData();
            this.getList();
        },
        methods: {
            analyseLocalData(){
                let userInfo = JSON.parse(localStorage.getItem('userInfo'));
                this.customerId = userInfo.customerId;
            },
            getList(){
                let reqParams = {
                    customerId:this.customerId,
                    pageNum:this.pageNum,
                    pageSize:this.pageSize,
                };
                this.$api.assignmentSalaryRecordunConfirmSchedulingList(reqParams).then(res=>{  
                    let { data,respCode } = res;
                    if( respCode === 0 ){
                        if( data&&data.list ){
                            this.tableData = data.list;
                            this.total = data.total;
                        }else{
                            this.total = 0;
                        }
                    }else{
                        this.total = 0;
                    }
                }).catch(err=>{
                    this.total = 0;
                    console.log('err',err);
                })
            },
            handleCurrentChange(val){
                this.pageNum = val;
                this.getList();
            },
        },
    }
</script>
<style scoped lang="scss">
    .marketReceiveNotConfirmCon {
        .firstLine {
            font-size: 12px;
            color: #333;
            background-color: #fff;
            display: flex;
            justify-content: flex-start;
            align-content: center;
            align-items: center;
            padding: 20px;
            box-sizing: border-box;
        }
        .nameCon {
            margin-bottom: 20px;
            margin-top: 20px;
            text-align: center;
            font-size: 20px;
            line-height: 2;
            letter-spacing: 1px;
            color: #262626;
            font-weight: bold;
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
/*            text-align: center;*/
            padding-left: 10px;
        }
    }
</style>