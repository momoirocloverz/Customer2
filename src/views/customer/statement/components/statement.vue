<template>
    <div>
        <el-form :model="form" label-width="100px" labelPosition="center">
                <el-form-item label="月份：" class="formSearchMargin">
                    <el-radio-group class="radio-search" v-model="form.months">
                        <el-radio label="">不限</el-radio>
                        <el-radio label="1">自定义</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="自定义：" class="formSearchMargin" v-if="form.months == '1'">
                        <el-date-picker class="margin_left40" size="mini" v-model="form.startDate" type="month" value-format="yyyy-MM-dd" placeholder="选择开始时间">
                        </el-date-picker>
                        --
                        <el-date-picker class="margin_left10" size="mini" v-model="form.endDate" type="month" value-format="yyyy-MM-dd" placeholder="选择结束时间">
                        </el-date-picker>
                        <el-button type="primary" size="small" class="datesearchBtn newbtn" @click="btn_true">确定</el-button>
                </el-form-item>
            </el-form>
            <el-table :data="tableData" empty-text="暂无相关信息">
                <el-table-column label="月份" prop="yearMonthStr" show-overflow-tooltip align="center" min-width="80"></el-table-column>
                <el-table-column label="收入（元）" prop="totalIn" show-overflow-tooltip align="center" min-width="80"></el-table-column>
                <el-table-column label="支出（元）" prop="totalOut" show-overflow-tooltip align="center" min-width="80"></el-table-column>
                <el-table-column label="利润（元）" prop="profit" show-overflow-tooltip align="center" min-width="80"></el-table-column>
                <el-table-column label="操作" align="center" min-width="180">
                    <template slot-scope="scope">
                        <el-button type="text" class="btn-icon btn-icon-view" size="mini" @click="checkCollectList(scope.row)">查看</el-button>
                    </template>
                </el-table-column>
            </el-table>
      <div class="pagination-container">
        <el-pagination class="pagebox" layout="prev, pager, next" @current-change="handleCurrentChange" :current-page="currentPage" :page-count="pageCount" :page-size="pageSize">
        </el-pagination>
      </div>
    </div>
</template>

<script>
export default {
    data(){
        return {
            tableData: [],
            form: {
                months: '',
                startDate: '',
                endDate: ''
            },
            currentPage: 1,
            pageCount: 0,
            pageSize: 20
        }
    },
    watch: {
        'form.months': function(val,old){
            if(val == ''){
                this.currentPage = 1
                this.getData()
            }else if(val == '1'){
                this.form.startDate = ''
                this.form.endDate = ''
            }
        }
    },
    mounted(){
        this.getData()
    },
    methods: {
        getData(){
            if(this.form.months == ''){
                this.form.startDate = ''
                this.form.endDate = ''
            }else if(this.form.months == '1'){
                this.form.startDate = this.form.startDate
                this.form.endDate = this.form.endDate
            }
            let params = {
                monthStart: this.form.startDate?this.form.startDate.substr(0,7):'',
                monthEnd: this.form.endDate?this.form.endDate.substr(0,7):'',
                pageNum: this.currentPage,
                pageSize: this.pageSize
            }
            this.$api.profitTotalQuery(params).then(res => {
                // console.log(res)
                if(res.respCode == 0){
                    if(res.data){
                        this.tableData = res.data.list || []
                    }
                }
            }).catch()
        },
        handleCurrentChange(val){
            console.log(val)
        },
        checkCollectList(row){
            const {href} = this.$router.resolve({
                name: 'collectList',
                params: {
                    month: row.yearMonthStr
                }
            })
            window.open(href,'_blank')
        },
        btn_true(){
            if(!this.form.startDate&&!this.form.endDate){
                return this.$message.error('时段不能为空')
            }else if(!this.form.startDate){
                return this.$message.error('开始时间不能为空')
            }else if(!this.form.endDate){
                return this.$message.error('结束时间不能为空')
            }else if(this.form.startDate > this.form.endDate){
                return this.$message.error('结束时间不能早于开始时间')
            }
            this.currentPage = 1
            this.getData()
        }
    }
}
</script>

<style scoped>
.el-form-item{
    margin-bottom: 0 !important;
}
.el-button--primary{
    margin-left: 15px;
}
</style>
